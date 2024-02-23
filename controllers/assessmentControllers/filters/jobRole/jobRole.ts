import prisma from "../../../../utils/init/prisma";
import {
  errorResponse,
  Request,
  Response,
  successResponse,
} from "../../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const id = req.params.jobRoleId
    const data = await prisma.jobRole.findUnique({ where :  {  id  }, select : {
        Assessment :  true,
    }});

    if (!data) throw { msg: "Unable to process", errorCode: 404 };
    resp.status(200).send(successResponse(data, ""));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
