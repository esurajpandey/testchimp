import {
  Request,
  Response,
  errorResponse,
  successResponse,
} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  try {
    const { name, jobRoleId, languageId, teamId } = req.body;

    //create assessment
    const assessment = await prisma.assessment.create({
      data : {
        name,
        jobRole : {
          connect : {
            id:  jobRoleId
          }
        },
        language: {
          connect: {
            id: languageId,
          },
        },
        team : {
          connect : {
            id  : teamId
          }
        }
      } 
    });

    if (!assessment) throw { msg: "Unable to create assessment", errorCode: 422};

    resp.status(201).send(successResponse(assessment, "Assessment created!"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
