import prisma from "../../../utils/init/prisma";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";

export default  async (req: Request, resp: Response) => {
    const item: ResponseItem = {
      message: "",
      data: null,
      status: Status.SUCCESS,
    };
  
    try {
      const plans = await prisma.plan.findMany({
        where :{
          NOT :{
            name : "Free"
          }
        }
      });
      if (!plans) throw { msg: "No plan found", errorCode: 404 };
  
      item.data = plans;
      item.message = "All plans";
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