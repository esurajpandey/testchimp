import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  const item: ResponseItem = {
    message: "",
    data: null,
    status: Status.SUCCESS,
  };

  try {
    const data = await prisma.role.findMany({
      where: {
        NOT: {
          type: "OWNER",
        },
      },
    });

    if (!data) throw { msg: "Server is not responding!", errorCode: 503 };

    item.data = data;
    item.message = "All roles";
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
