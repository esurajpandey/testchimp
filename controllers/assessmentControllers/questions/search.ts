import {
  errorResponse,
  successResponse,
  Request,
  Response,
} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import { questionSelectQuery } from "./create";
import { QuestionSource } from "@prisma/client";

export default async (req: Request, resp: Response) => {
  try {
    const limit = +req.params?.limit ?? "10";
    const offset = +req.params?.offset ?? "0";

    const categories = req.query.categories as string[];
    const sources = req.query.sources as string[];

    const assessmentId = req.query?.assessmentId ?? "" as string;
    const queryString = req.query?.queryString ?? "" as string;
    const types = req.query.types as string[];

    const question = await prisma.question.findMany({
      take: limit,
      skip: offset * limit,
      where: {
        OR: [
          { description: { contains: queryString?.toString() } },
          { title: { contains: queryString?.toString() } },
        ],
        ...(sources?.length > 0
          ? {
              source: {
                in: sources as QuestionSource[],
              },
            }
          : {}),

        ...(assessmentId
          ? {
              assessments: {
                some: {
                  assessmentId: assessmentId?.toString(),
                },
              },
            }
          : {}),
        ...(types?.length > 0
          ? {
              type: {
                id: {
                  in: types,
                },
              },
            }
          : {}),
        ...(categories?.length > 0
          ? {
              QuestionCategories: {
                some: {
                  categoryId: {
                    in: categories,
                  },
                },
              },
            }
          : {}),
      },
      select: {
        id : true,
        duration : true,
        description : true,
        type : true,
        questionRelevant : true,
        lookingForAsnwer : true,
        source : true,
        title : true,
        heading : true,
      },
    });

    if (!question) throw { msg: "No question found", errorCode: 404 };

    resp.status(200).send(successResponse(question, "questions"));
  } catch (err: any) {
    console.log(err);
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};
