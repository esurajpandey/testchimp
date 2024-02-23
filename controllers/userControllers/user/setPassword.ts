import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import generate_jwt_token from "../../../utils/helpers/generate_jwt_token";
import get_email_from_jwt from "../../../utils/helpers/get_email_from_jwt";
import hash_password from "../../../utils/helpers/hash_password";

const setPassword = async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };
  try {
    //verify token and exctract email from that
    let token: string = req.query.token as string;
    
    const { password } = req.body;
    console.log("In user set passowrd",password,token);

    let user = await prisma.user.findFirst({
      where: {
        token: token,
      },
    });

    if(!user)
      throw {msg: "User not found!",errorCode : 404};

    //encrypting password
    let encrypted_password = await hash_password(password);

    //update in password
    const updateUser = await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        password: encrypted_password,
        token: "",
      },
      select: {
        id: true,
        firstName: true,
        language: true,
        lastName: true,
        email: true,
        jobTitle: true,
        phoneNumber: true,
        setting: true,
        team: {
          select: {
            applicant_tracking: true,
            assessmentSetting: true,
            company: true,
            subscription: true,
          },
        },
      },
    });

    //after that we need to send jsonwebtoken
    let jwtData = {
      id: updateUser?.id,
    };

    let access_token = generate_jwt_token(jwtData);

    item.data = updateUser;
    item.message = "Password is set successfully";
    resp.setHeader("X-Auth-Token", access_token.toString());

    resp.status(200).send({data : item,token : access_token});
  } catch (err: any) {
    item.message = err?.msg ?? "Internal error";
    item.status = Status.FAILURE;

    if (err?.message) {
      item.status = Status.ERROR;
      item.error = {
        message: err.message,
        code: err.code,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};

export default setPassword;
