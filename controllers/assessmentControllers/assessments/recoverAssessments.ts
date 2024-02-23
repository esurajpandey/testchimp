import prisma from "../../../utils/init/prisma";
import { errorResponse, Request, Response, successResponse } from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const {assessmentId} = req.params;
    /*Procedure
        - find team details
        - check whether assessment belongs to current user team
        - using assessmentId make update 
    */

    if(!assessmentId) 
        throw {msg : "Assessment id required",errorCode :400};

    //lets update
    let assessment = await prisma.assessment.update({
        where : {
            id : assessmentId
        },
        data : {
            isArchived : false
        }
    });
    
    resp.status(202).send(successResponse(assessment, "Assessment recovered!"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
