import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

const questionSelectQuery = {
    questions : {
        select : {
            id : true,
            duration : true,
            description : true,
            type : {
                select : {
                    title : true,
                }
            }
        }
    },
}

const testSelectQuery = {
    tests : {
        select : {
            id : true,
            title : true,
            duration : true
        }
    },
}

const candidateSelectQuery =  {
    invitedAt : true,
    status : true,
    firstName : true,
    lastName : true,
    candidateId : true,
    hiringStage : {
        select : {
            id : true,
            title : true
        }
    }
}

const assessmentSelectQuery = {
    id : true,
    name : true,
    language : true,
    extraTime : true,
    isAccomodationForAbnormal : true,
    isAccomodationForNonFluent : true,
    isAntiCheatingEnabled : true,
    isEditable : true,

    AssessmentQuestion : {
        select : questionSelectQuery
    },
    AssessmentTest : {
        select : testSelectQuery
    },
    //sending candidate with his role if candidate belongs to team - pending
}

export default async (req :Request,resp : Response) => {
    try{
        const {id} = req.body;

        const assessmentId = req.params?.assessmentId;
        if(!assessmentId)
            throw {msg : "Assessment Id required",errorCode : 400};
        
        let assessment = await prisma.assessment.findUnique({
            where : {
                id : assessmentId,
            },
            select : assessmentSelectQuery
        });

        if(!assessment)
            throw {msg : "Assessment not found",errorCode: 404};
        
        const candidates = await prisma.candidateAssessment.findMany({
            where : {
                assessmentId
            },
            select : candidateSelectQuery
        });

        if(!assessment)
            throw {msg : "Assessment not found", errorCode : 404};
          
        let item = successResponse({assessment,candidates},"Assessment details");
        resp.status(200).send(item);
    }catch(err : any){
        let item  = errorResponse(err);
        resp.status(err?.errorCode ?? 400).send(item);
    }   
}