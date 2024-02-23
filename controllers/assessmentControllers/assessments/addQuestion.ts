import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

const assessmentSelectQuery =  {
    select : {
        id : true,
        name : true,
        language : true,
        jobRole : true,
        createAt : true,
        updatedAt : true,
        extraTime : true,
        isAccomodationForAbnormal : true,
        isAccomodationForNonFluent : true,
        isAntiCheatingEnabled : true,
        isArchived : true,
        isEditable : true,
        AssessmentQuestion : {
            select : {
                questions : true,
            },
        },
        AssessmentTest : true,
    }
}


export default async (req:Request,resp : Response) => {
    try{
        const {questionId,assessmentId} = req.params;
        if(!(questionId || assessmentId)) 
            throw {msg : "Question id and assessment Id is required",errorCode :400 };
        
        const assessment = await prisma.assessmentQuestion.create({
            data : {
                assessments : {
                    connect : {
                        id : assessmentId
                    }
                },
                questions : {
                    connect : {
                        id : questionId
                    }
                }
            },
            select : {
                assessments : assessmentSelectQuery
            }

        });

        if(!assessment)
            throw {msg : "Unable to add question",errorCode :422};
        
        resp.status(200).send(successResponse(assessment?.assessments,"Question added"));

    }catch(err : any) {
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}