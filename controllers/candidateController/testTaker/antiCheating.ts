import prisma from "../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";
import _ from 'lodash';

export default async (req:Request,resp: Response) => {
    try{
        const monitoringDetails = await antiCheating(req.body)
        resp.status(200).send(successResponse(null,"details added"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}


const antiCheating =async (body : any) => {
    
    return await prisma.$transaction(async tx => {
        const {candidateId,assessmentId}  = body;
        //check isAnticheating is enabled or not

        const assessment = await tx.assessment.findUnique({where : {id : assessmentId}});

        if(assessment?.isArchived === false && assessment?.isAntiCheatingEnabled === false)
            throw {msg : "Anti monitoring is disabled for this assessment",errorCode : 400};
        
        
        const antiCheatingDetails = _.pick(body,[
            "deviceUsed",
            "isAlwaysFullScreen",
            "isMouseUser",
            "isOnlyOneIP",
            "isWebcamEnabled",
            "location",
        ])
        
        const session = await tx.candidateAssessment.update({
            where : {
                candidateId_assessmentId : {
                    assessmentId,
                    candidateId
                }
            },
            data : {
                antiCheatingMonitor : {
                    update : {
                        ...antiCheatingDetails
                    }
                }
            }
        });

        if(!session)
            throw {msg : "Unable to monitor",errorCode: 422}
        return session;
    })
}