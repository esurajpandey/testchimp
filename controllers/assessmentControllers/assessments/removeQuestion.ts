import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req :Request,resp : Response) => {
    try{
        const {assessmentId,questionId} = req.params;
        //check whether assessments belongs to current user or not 
        await prisma.assessmentQuestion.delete({
            where: {
                questionId_assessmentId : {
                    questionId,
                    assessmentId
                }
            }
        });

        resp.status(200).send(successResponse(null,"Question is removed from assessment!"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
    }   
}