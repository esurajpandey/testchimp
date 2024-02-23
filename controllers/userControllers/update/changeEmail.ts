import bcrypt from "bcrypt";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import { validateEmail } from "../../../utils/validation/validate_email";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  try {
    console.log(req.body);
    
    const { email, password, id } = req.body;
    let user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    //if not
    if (!user)
      throw { msg: "Invalid User", status: Status.FAILURE, errorCode: 401 };

    if(email === user?.email)
      throw {msg : "Same email can't be accepted!",errorCode : 400};

    await validateEmail(email);

    if (!(await bcrypt.compare(password, user?.password as string)))
      throw {
        msg: "Incorrect password",
        status: Status.FAILURE,
        errorCode: 401,
      };

    //update
    let data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: email,
      },
      select: {
        email: true,
      },
    });

    let item: ResponseItem = {
      status: Status.SUCCESS,
      message: "Email changed successfully",
      data: data,
    };

    resp.status(200).send(item);
  } catch (err: any) {
    let item: ResponseItem = {
      message: err?.msg,
      status: err?.status ?? Status.ERROR,
      data: null,
    };

    if (err.code) {
      //duplicate
      if (err.code === "P2002") {
        item.message = "Email is already registered.";
      } else {
        item.error = {
          code: err.code,
          message: err.message,
        };
      }
    }
    resp.status(err?.errorCode ?? 500).send(item);
  }
};
