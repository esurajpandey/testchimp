import prisma from "../../../utils/init/prisma";
import { errorResponse, Request, Response, successResponse } from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const limit = +req.params.limit;
    const offset =  +req.params.offset;

    const data = await prisma.testOwner.findMany({
      skip : limit * offset,
      take : limit,
      select : {
        name : true,
        bio : true,
        profile : true,
        Test : {
          select : {
            _count : true
          }
        }
      }
    });

    if (!data) throw { msg: "No test owner found!", errorCode: 404 };
    resp.status(200).send(successResponse(data, "All Owners!"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};