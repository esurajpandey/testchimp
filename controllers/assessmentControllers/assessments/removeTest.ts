import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req :Request,resp : Response) => {
    try{
        const {assessmentId,testId} = req.params;
        //check whether assessments belongs to current user or not 
        await prisma.assessmentTest.delete({
            where: {
                testId_assessmentId : {
                    testId : testId,
                    assessmentId : assessmentId,
                }
            }
        });

        resp.status(200).send(successResponse(null,"Test is removed from assessment!"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
    }   
}