import prisma from "../../../utils/init/prisma";
import {
  errorResponse,
  Request,
  Response,
  successResponse,
} from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const testId = req.params.testId;
    const data = await prisma.test.findUnique({
      where: {
        id: testId,
      },
      select: {
        id: true,
        audience: true,
        title: true,
        duration: true,
        createAt: true,
        updatedAt: true,
        isPremium: true,
        longDescription: true,
        shortDescription: true,
        relevance: true,
        owner: true,
        testLevel: true,
        testType: true,
        coveredSkills : true,
        TestQuestions: {
          select: {
            questions: true
          },
        },
      },
    });

    if (!data) throw { msg: "No test found.", errorCode: 404 };
    resp.status(200).send(successResponse(data, "Test details"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
