import prisma from "../../../../utils/init/prisma";
import { successResponse,errorResponse,Response,Request } from "../../../../utils/Response/response";

export default async (req:Request,resp: Response) => {
    try{
        const category = await prisma.category.findMany();
        resp.status(200).send(successResponse(category,"Categories"));

    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}