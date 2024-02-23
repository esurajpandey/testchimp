import prisma from "../../../../utils/init/prisma";
import { successResponse,errorResponse,Response,Request } from "../../../../utils/Response/response";

export default async (req:Request,resp: Response) => {
    try{
        const types = await prisma.questionType.findMany();
        resp.status(200).send(successResponse(types,"Types"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}