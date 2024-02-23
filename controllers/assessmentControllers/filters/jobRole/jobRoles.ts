import prisma from "../../../../utils/init/prisma";
import {
  errorResponse,
  Request,
  Response,
  successResponse,
} from "../../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const { name } = req.body;

    const data = await prisma.jobRole.findMany();
    
    if (!data) throw { msg: "No Job role found", errorCode: 404 };
    resp.status(200).send(successResponse(data, ""));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
