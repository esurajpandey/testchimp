import { successResponse,errorResponse,Request,Response } from "../utils/Response/response";
import { NextFunction } from "express";
import prisma from "../utils/init/prisma";

export default async (req:Request,resp : Response,next : NextFunction) => {
    try{
        const {id} = req.body;
        const assessmentId = req.params?.assessmentId  ?? req.body?.assessmentId;

        if(!assessmentId)
            throw {msg : "Assessment id required",errorCode : 400};

        let user  =  await prisma.user.findUnique({
            where : { id },select : { team : { select :  { id  : true}}}
        });

        if(!user?.team?.id) 
            throw {msg : "It seems you are not belongs to any team",errorCode : 404};
        
        let assessment = await prisma.assessment.findFirst({
            where : {
                teamId : user?.team?.id,
                id : assessmentId
            },
        });

        if(!assessment)
            throw {msg : "Assessment not belongs to current user",errorCode : 401};

        //move to next end - point 
        req.body.teamId = user?.team?.id;
        next();
    }catch(err : any){
        return resp.status(err?.code ?? 400).send(errorResponse(err));
    }
}