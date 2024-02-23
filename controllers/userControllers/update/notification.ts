import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
    try {
      const { candidateAlert, candidateSummary, id } = req.body;
  
      //update
      let data = await prisma.user.update({
        where: {
          id,
        },
        data: {
          setting: {
            update: {
              candidateAlert,
              candidateSummary,
            },
          },
        },
        select: {
          setting: true,
        },
      });
  
      if (!data) {
        let item: ResponseItem = {
          status: Status.FAILURE,
          message: "Not Updated",
          data: null,
        };
        resp.status(304).send(item);
        return;
      }
  
      let item: ResponseItem = {
        status: Status.SUCCESS,
        message: "Settings updated!",
        data: data,
      };
      resp.status(303).send(item);
    } catch (err: any) {
      let item: ResponseItem = {
        status: Status.ERROR,
        data: null,
        message: "Some internal error",
        error: {
          code: err.code,
          message: err.message,
        },
      };
      resp.status(400).send(item);
    }
  };