import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import generate_jwt_token from "../../../utils/helpers/generate_jwt_token";
import sendSetPasswordMail from "../../../utils/helpers/sendMail";
import prisma from "../../../utils/init/prisma";
import randomstring from "randomstring";
const forgetPassword = async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };

  try {
    const email = req.body?.email;
    console.log("Part 1")
    if(email == "") 
      throw { msg: "Email required", errorCode: 400 };
    
    console.log("Part 2");

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
      select : {
        id : true,
        email : true,
        password :  true
      }
    });

    if (!user) throw { msg: "User is not registered", errorCode: 404 };

    
    const rs = randomstring.generate();
    //for testing
    let url =  `${process.env.SET_PASSWORD_URL}?token=${rs}`;
    let subject = "Please set your password";
    let msg = `<div>
                          <h2>Hi there</h2>
                          <p>
                          Reset Password
                          Click the link below to validate your email address and set your password:
                           <br/>
                           <br/>
                          <p>
                              if the above link does not work, copy and paste this URL into your browser:<br/>
                              ${url}
                          </p>
                      </div>`;

    let res = await sendSetPasswordMail(email, subject, msg);

    let data = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        token: rs,
      },
    });

    item.message = "Reset link send successfully";
    item.data = null;
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

export default forgetPassword;