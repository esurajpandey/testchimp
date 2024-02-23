import prisma from "../../../utils/init/prisma";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  let item: ResponseItem = { message: "", data: null, status: Status.SUCCESS };
  try {
    const id = req.body.id;

    let data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        team: {
          select: {
            subscription: true,
          },
        },
      },
    });

    if (!data) throw { msg: "Unable to make process", errorCode: 403 };

    item.data = data;
    item.message = "User subscription";
    resp.status(200).send(item);
  } catch (err: any) {
    item.status = Status.FAILURE;
    item.message = err?.msg ?? "Some internal error!";

    if (err?.message) {
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
