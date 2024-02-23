import {
  errorResponse,
  successResponse,
  Request,
  Response,
} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import { questionSelectQuery } from "./create";


export default async (req:Request,resp : Response) => {
    try{
        const questionId = req.params.questionId;
        if(!questionId)
            throw {msg : "question id is required"}

        const question = await prisma.question.findUnique({
            where : {
                id : questionId
            },
            select : questionSelectQuery
        });

        if(!question)
            throw {msg : "No question found",errorCode: 404};
        
        resp.status(200).send(successResponse(question,"question details"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}