import prisma from "../../../../utils/init/prisma";
import { successResponse,errorResponse,Response,Request } from "../../../../utils/Response/response";

export default async (req:Request,resp: Response) => {
    try{
        const {title} = req.body;

        const type = await prisma.questionType.create({
            data : {
                title,
            }
        })
        resp.status(201).send(successResponse(type,"Type created"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}