import prisma from "../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";

export default async (req:Request,resp:Response) => {
    try{
        const {assessmentId,testId,jobRoleId,queryString = "" } = req.query;
        const teamId = req.body.teamId;
        
        const candidate = await prisma.candidate.findMany({
            where : {
                teamId,
                OR: [
                    {
                        firstName: {
                            contains: queryString?.toString()
                        },
                    },
                    {
                        lastName: {
                            contains: queryString?.toString()
                        },
                    }
                ],
                ...((assessmentId || testId || jobRoleId) ? {assessment: {
                    some: {
                        assessments: {
                            ...(assessmentId ? {id: assessmentId?.toString(),} : {}),
                            ...(jobRoleId ? {jobRoleId: jobRoleId?.toString(),} : {}),
                            ...(testId ? {AssessmentTest: {
                                some: {
                                    testId: testId?.toString(),
                                }
                            }} : {})
                        }
                    },
                }} : {})
            },
            select : {
                firstName : true,
                email : true,
                lastName : true,
                id : true,
            }
        });
        if(!candidate)
            throw {msg:"No canidate found",errorCode: 404};
        
        resp.status(200).send(successResponse(candidate,"Canidates"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}


