import prisma from "../../../../utils/init/prisma";
import { successResponse,errorResponse,Response,Request } from "../../../../utils/Response/response";

export default async (req:Request,resp: Response) => {
    try{
        const {name,type} = req.body;

        const category = await prisma.category.create({
            data : {
                name,
                type,
            }
        });
        resp.status(201).send(successResponse(category,"Category created"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}