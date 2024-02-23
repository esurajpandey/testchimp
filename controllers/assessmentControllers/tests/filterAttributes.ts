import prisma from "../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";

export default {
    testType :async (req:Request,resp:Response) => {
        try{
            const testType = await prisma.testType.findMany({
                select : {
                    id: true,
                    title: true,
                }
            });

            if(!testType)
                throw {msg : "No type found",errorCode: 404};
            
            resp.status(200).send(successResponse(testType,"All types"));
        }catch(err : any){
            resp.status(err?.errorCode ?? 500).send(errorResponse(err));
        }
    },
    testLevel :async (req:Request,resp:Response) => {
        try{
            const testType = await prisma.testLevel.findMany({
                select : {
                    id: true,
                    level : true,
                }
            });

            if(!testType)
                throw {msg : "No level found",errorCode: 404};
            
            resp.status(200).send(successResponse(testType,"All Levels"));
        }catch(err : any){
            resp.status(err?.errorCode ?? 500).send(errorResponse(err));
        }
    },
}