import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import assessments from "./assessments";

export default async (req :Request,resp : Response) => {
    try{
        const {assessmentId} = req.params;
        const teamId = req.body;
        
        //check whether assessments belongs to current user or not 
        const assessment = await prisma.assessment.update({
            where : {
                id : assessmentId
            },
            data :{
                isArchived :  true
            }
        });

        const responseData = await assessments(teamId,true,25,0);
        if(responseData)
            throw {msg : "No record found",errorCode: 404};

        resp.status(200).send(successResponse(responseData,"Assessment is updated"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
    }   
}