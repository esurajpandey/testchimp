import prisma from "../../../utils/init/prisma";
import {
  successResponse,
  errorResponse,
  Request,
  Response,
} from "../../../utils/Response/response";

//Queries

const assessmentSelectQuery = {
  select : {
    assessmentId : true,
    assessments : {
      select : {
        AssessmentTest : {
          select : {
            testId : true,
          }
        }
      }
    }
  }
}

const candidateSelectQuery =  {
  select :{
    id:  true,
    email : true,
    firstName : true,
    lastName : true,
    assessment : assessmentSelectQuery
  }
}

export default async (req: Request, resp: Response) => {
  try {
    const teamId= req.body.teamId;
    const offset = +req.params?.offset ?? "0";

    const candidates = await prisma.candidate.findMany({
      take : 25,
      skip : 25 * offset,
      where  : {
        teamId 
      },
      select : {
        id:  true,
        email : true,
        firstName : true,
        lastName : true,
        updatedAt : true,
        assessment : assessmentSelectQuery
      }
    });

    if(!candidates) 
        throw {msg : "No candidate found",errorCode :404};
    
    
    let res = candidates?.map(item => {
        return (
          {
            id : item.id,
            firstName : item.firstName,
            lastName : item.lastName,
            updatedAt : item?.updatedAt,
            assessments : item.assessment?.length,
            test : item.assessment?.map(test => {
              return test?.assessments?.AssessmentTest?.length
            })[0]
          }
        )
    });

    resp.status(200).send(successResponse(res,"Candidates"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};
