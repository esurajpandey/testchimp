import { errorResponse,successResponse,Request,Response } from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req:Request,resp : Response) => {
    try{
        const assessmentId = req.params.assessmentId;

        /**
         * isEditable
         */
        const {name,languageId,jobRoleId} = req.body;

        let assessment = await prisma.assessment.findUnique({
            where : {
                id : assessmentId
            }
        });

        if(assessment && assessment?.isEditable === false)
            throw {msg : "Not editable",errorCode : 400};
        
        let updatedAssessment = await prisma.assessment.update({
            where : {
                id : assessmentId,
            },
            data : {
                name,
                language : {
                    connect :{
                        id : languageId
                    }
                },
                jobRole: {
                    connect :{
                        id : jobRoleId
                    }
                }
            }
        });

        if(!updatedAssessment)
            throw {msg : "Unable to update assessment",errorCode : 304}
        
        resp.status(200).send(successResponse(updatedAssessment,"Assessment updated"));
    }catch(err : any) {
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
    }
}