import { NextFunction } from 'express';
import { successResponse,errorResponse,Response,Request } from "../utils/Response/response";
import prisma  from "../utils/init/prisma";

export default async (req:Request,resp :Response,next : NextFunction) => {
    try{
        const {id} = req.body;

        const user =  await prisma.user.findUnique({ where : { id },select : { role : true}});

        if(!user)
            throw {msg : "User doesn't exists",errorCode :404};

        if(user?.role?.code && user?.role?.code < 10)
            throw {msg : "Unauthorised to perform operation",errorCode : 401};
        
        req.body.role = user?.role;
        next()
    }catch(err : any){
         resp.status(err?.errorCode ?? 400).send(errorResponse(err));
    }
}