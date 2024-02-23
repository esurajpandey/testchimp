import bcrypt from "bcrypt";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import hash_password from "../../../utils/helpers/hash_password";
import { isValidPassword } from "../../../utils/validation/validate_password";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  try {
    const { oldPassword, newPassword, id } = req.body;

    //find the user
    //verify the old password
    //convert the new password
    //update the user
    //return the response

    let user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      let item: ResponseItem = {
        message: "Used not found",
        status: Status.FAILURE,
        data: null,
      };
      resp.status(404).send(item);
      return;
    }

    if (await bcrypt.compare(oldPassword, user.password as string)) {
      const hp = await hash_password(newPassword);

      if (!isValidPassword(newPassword)) {
        let item: ResponseItem = {
          message: "Password does not followed required pattern.",
          status: Status.FAILURE,
          data: null,
        };
        resp.status(304).send(item);
        return;
      }

      //lets update user password with new password
      user = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          password: hp,
        },
      });

      let item: ResponseItem = {
        message: "Password changed!",
        status: Status.SUCCESS,
        data: null,
      };
      resp.status(202).send(item);
    } else {
      let item: ResponseItem = {
        status: Status.FAILURE,
        data: null,
        message: "Password doesn't matched!",
      };
      resp.status(304).send(item);
    }
  } catch (err: any) {
    let item: ResponseItem = {
      data: null,
      status: err?.status ?? Status.ERROR,
      message: err?.msg,
    };

    if (err?.code) {
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
