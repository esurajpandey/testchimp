import {
  Status,
  ResponseItem,
  Request,
  Response,
} from "./../../../utils/Response/response";
import { validateEmail } from "../../../utils/validation/validate_email";
import generate_jwt_token from "../../../utils/helpers/generate_jwt_token";
import sendSetPasswordMail from "../../../utils/helpers/sendMail";
import prisma from "../../../utils/init/prisma";
import randomstring from 'randomstring';


export default async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };

  try {
    let { email, role, id } = req.body; //id from user
    role = role ? role : "ADMIN";

    //find user who invited
    let invitedBy = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        firstName: true,
        lastName: true,
        team: true,
        role: {
          select: {
            code: true,
          },
        },
      },
    });

    if (!invitedBy)
      throw { msg: "Something went wrong!-User not found", errorCode: 403 };

    //If user is Hiring manager
    if (invitedBy?.role?.code && invitedBy?.role?.code < 10)
      throw { msg: "Permission denied!", errorCode: 401 };

    await validateEmail(email);

    //generate jwt token
    let rs = randomstring.generate();

    const language = await prisma.language.findFirst({
      where  : {
        name : "English"
      }
    });
    if(!language){
      throw {msg : "No Language found",errorCode: 404};
    }

    let new_user = await prisma.user.create({
      data: {
        email,
        token: rs,
        language: {
          connect : {
            id : language?.id
          }
        },
        setting: {
          create: {
            emailUpdate: false,
          },
        },
        role: {
          connect: {
            type: role,
          },
        },
        team: {
          connect: {
            id: invitedBy?.team?.id as string,
          },
        },
      },
      select :{
        role : true,
        firstName : true,
        lastName : true,
        email : true,
        id : true
      }
    });

    if (!new_user)
      throw { msg: "Something went wrong! Try after sometime", errorCode: 403 };

    let url =  `${process.env.SET_PASSWORD_URL}?token=${rs}`;
    let subject = "Please set your password";

    let msg = `<div>
                  <p>
                    ${invitedBy?.firstName} ${invitedBy?.lastName} has invited you to join 
                    TestChimp in your role as ${role}.
                    Register to get access to the test results of your candidates.
                    <br/><br/>
                    Click the link below to set your password:
                    <br/><br/>
                    ${url}
                   </p>
               </div>`;

    let res = await sendSetPasswordMail(email, subject, msg);

    item.data = new_user;
    item.message = "Invitation sent successfully!";
    resp.status(201).send(item);
  } catch (err: any) {
    item.status = Status.FAILURE;
    item.message = err?.msg ?? "Some internal error!";
    if (err.code) {
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
