import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import get_email_from_jwt from "../../../utils/helpers/get_email_from_jwt";
import prisma from "../../../utils/init/prisma";

const validateResetToken = async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };

  try {
    const token = req.params.token as string;

    let user = await prisma.user.findFirst({
      where: {
        token : token
      },
    });


    if(!user?.id)
      throw {msg : "Invalid token",errorCode : 400};
    
    item.message = "Token is valid";
    item.data = null;
    resp.status(200).send(item);

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

export default validateResetToken;
