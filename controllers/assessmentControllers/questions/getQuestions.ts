import {
  errorResponse,
  successResponse,
  Request,
  Response,
} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import { questionSelectQuery } from "./create";

export default async (req: Request, resp: Response) => {
  try {
    const limit =  +req.params?.limit ?? "10";
    const offset = +req.params?.offset ?? "0";

    const question = await prisma.question.findMany({
      skip: limit * offset,
      take: limit,
      select: {
        id : true,
        heading : true,
        type : true,
        duration : true,
        description : true,
        source : true,
        lookingForAsnwer : true,
        questionRelevant : true,
        isPremium : true,
      },
    });

    if (!question) throw { msg: "No question found", errorCode: 404 };

    resp.status(200).send(successResponse(question, "questions"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};
