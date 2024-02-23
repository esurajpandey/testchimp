import prisma from "../../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../../utils/Response/response";


export default async (req:Request,resp:Response) => {
    try{
        const teamId = req.body.teamId;

        const assessments = await prisma.assessment.findMany({
            where : {
                teamId :  teamId
            },
            select : {
                id : true,
                name : true,
            }
        });

        
        if(!assessments)
            throw {msg : "No assessment found",errorCode : 404};
        
        resp.status(200).send(successResponse(assessments,"Team assessment lists"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}