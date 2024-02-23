import prisma from "../../../utils/init/prisma";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
    let item: ResponseItem = {
      status: Status.SUCCESS,
      message: "",
      data: null,
    };
  
    try {
      const id = req.params.id;
      const plan = await prisma.plan.findUnique({
        where: {
          id,
        },
      });
  
      if (!plan) throw { msg: "No plan found", errorCode: 404 };
  
      item.data = plan;
      item.message = "Plan details";
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
  