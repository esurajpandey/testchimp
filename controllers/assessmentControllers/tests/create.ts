import prisma from "../../../utils/init/prisma";
import _ from "lodash";
import {
  errorResponse,
  Request,
  Response,
  successResponse,
} from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const {
      duration,
      title,
      audience,
      longDescription,
      shortDescription,
      relevance,
      testTypeId,
      testLevelId,
      ownerId,
    } = req.body;
    const isPremium = req.body?.isPremium ?? false;

    //i can't use _.pick because prisma is not allowing me to use inside the data object
    const data = await prisma.test.create({
      data: {
        duration,
        title,
        audience,
        isPremium,
        longDescription,
        shortDescription,
        relevance,
        testLevel: {
          connect: {
            id: testLevelId,
          },
        },
        owner: {
          connect: {
            id: ownerId,
          },
        },
        testType: {
          connect: {
            id: testTypeId,
          },
        },
      },
    });

    //create skill for tes

    if (!data) throw { msg: "Unable to create test!", errorCode: 400 };
    resp.status(201).send(successResponse(data, ""));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
