import prisma from "../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";
import { antiCheatingSelectQuery, assessmentSelectQuery, responseSelectQuery } from "./filterAttributes/candidateSelectQuery";

export default async (req: Request, resp: Response) =>{
    try{    
        const teamId = req.body.teamId;
        const candidateId = req.query.candidateId as string;

        if(!candidateId)
            throw {msg : "Id required",errorCode :400};
        
        const candidate = await prisma.candidate.findFirst({
            where : {
                id : candidateId,
                teamId : teamId,
            }
        });
        if(!candidate)
            throw {msg :"No candidate found",errorCode :404};
        
        const details = await prisma.candidateAssessment.findMany({
            where : {
                candidateId
            },
            select : {
                firstName : true,
                lastName : true,
                hiringStage :  true,
                invitedAt: true,
                submittedAt : true,
                startedAt : true,
                status : true,
                assessments : assessmentSelectQuery,
                antiCheatingMonitor : antiCheatingSelectQuery,
                response : responseSelectQuery
            }
        });  

        if(!details[0])
            throw {msg:"No details found of this candidate",errorCode : 404};
        
        resp.status(200).send(successResponse(details,"All details of candidate"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}
