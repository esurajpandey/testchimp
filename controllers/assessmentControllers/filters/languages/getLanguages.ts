import prisma from "../../../../utils/init/prisma";
import { errorResponse,Request,Response,successResponse } from "../../../../utils/Response/response";

export default async (req:Request,resp: Response) => {
    try {
        const data = await prisma.language.findMany({
            select : {
                id : true,
                name : true
            }
        });
        if (!data) throw { msg: "No language found", errorCode: 404 };
        resp.status(201).send(successResponse(data, ""));

      } catch (err: any) {
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
      }
}