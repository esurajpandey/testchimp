import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import { validateEmail } from "../../../utils/validation/validate_email";
import generate_jwt_token from "../../../utils/helpers/generate_jwt_token";
import sendSetPasswordMail from "../../../utils/helpers/sendMail";
import prisma from "../../../utils/init/prisma";
import randomstring from "randomstring";

export default async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    data: null,
    message: "",
    status: Status.SUCCESS,
  };

  try {
    const { email } = req.body;
    await validateEmail(email);

    let rs = randomstring.generate();
    // let url1 = `http://localhost:3000/TestGorrila/user-service/users/password?token=${rs}`;

    let url2 =  `${process.env.SET_PASSWORD_URL}?token=${rs}`;
    let subject = "Please set your password";
    let msg = `<div>
                  <h2>Hi there</h2>
                  <p>
                  Hi there,
                  Thanks for signing up with TestGorilla!
                  Click the link below to validate your email address and set your password:
                      <br/><br/>
                      ${url2}
                  </p>
               </div>`;

    //select free plan
    let plan = await prisma.plan.findFirst({
      where: {
        name: "Free",
      },
    });
    
    if(!plan)
      throw{msg :"Plan error",errorCode: 404};


    const language = await prisma.language.findFirst({
      where  : {
        name : "English"
      }
    });

    //create user and store email and token
    const data = await prisma.user.create({
      data: {
        email: email,
        token: rs,
        language: {
          connect : {
            id : language?.id
          }
        },
        setting: {
          create: {},
        },
        role: {
          connect: {
            type: "OWNER",
          },
        },
        team: {
          create: {
            company: {
              create: {},
            },
            assessmentSetting: {
              create: {},
            },
            subscription: {
              create: {
                endDate: new Date(),
                startingDate: new Date(),
                plan: {
                  connect: {
                    id: plan?.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    let res = await sendSetPasswordMail(email, subject, msg);
    
    const jwtdata = {
      id: data?.id,
    };

    const token = generate_jwt_token(jwtdata);
    resp.setHeader("X-Auth-Token", token.toString());
    item.data = token;

    item.message = "Link for reset password is sent successfully";
    resp.status(201).send(item);

  } catch (err: any) {
    item.message = err?.msg ?? "Internal error";
    item.status = Status.FAILURE;

    if (err?.message) {
      if (err.code === "P2002") {
        item.status = Status.FAILURE;
        item.message = "User already exists!";
      } else {
        item.status = Status.ERROR;
        item.error = {
          message: err.message,
          code: err.code,
        };
      }
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
