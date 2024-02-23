import prisma from "../../../utils/init/prisma";
import {
  successResponse,
  errorResponse,
  Request,
  Response,
} from "../../../utils/Response/response";

const testSelectQuery = {
  id: true,
  title: true,
  duration: true,
  isPremium: true,
  shortDescription: true,
  jobRoleId: true,
  languageId: true,
  testTypeId : true
};

export default async (req: Request, resp: Response) => {
  try {
    const jobRoleId = req.query.jobRole as string;
    const searchQuery = req.query.searchQuery as string;
    const languageId = req.query.languge as string;
    const testTypeId = req.query.testType as string;

    let tests;

    if (searchQuery) {
      tests = await prisma.test.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery } },
            { shortDescription: { contains: searchQuery } },
          ],
        },
        select: testSelectQuery,
      });
    } else {
      tests = await prisma.test.findMany({
        where: {
          OR: {
            languageId: { equals: languageId },
            jobRoleId: { equals: jobRoleId },
            testTypeId : {equals : testTypeId}
          },
        },
        select : testSelectQuery
      });
    }

    if (tests && jobRoleId) 
        tests = tests.filter((test) => test.jobRoleId === jobRoleId);

    if (tests && languageId) {
      tests = tests.filter((test) => test.languageId === languageId);
    }

    if(tests && testTypeId)
        tests = tests.filter((test) => test.testTypeId === testTypeId);

    resp.status(200).send(successResponse(tests, "tests"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};

const filterJobRole = (data: any[], roleId: string) => {
  data = data.filter((test) => test.jobRoleId == roleId);
};
