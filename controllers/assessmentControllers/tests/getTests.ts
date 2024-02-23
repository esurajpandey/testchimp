import prisma from "../../../utils/init/prisma";
import { errorResponse, Request, Response, successResponse } from "../../../utils/Response/response";

export default async (req:Request,resp: Response) => {
    try {
        const limit = +req.params.limit;
        const offset = +req.params.offset;

        const tests = await prisma.test.findMany({
            skip : limit * offset,
            take : limit,
            select : {
                id : true,
                title : true,
                duration : true,
                isPremium : true,
                shortDescription : true,
            }
        });

        if (!tests) throw { msg: "No test found.", errorCode: 404 };
        resp.status(200).send(successResponse(tests, ""));

      } catch (err: any) {
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
      }
}