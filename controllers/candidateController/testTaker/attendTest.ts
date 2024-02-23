import prisma from "../../../utils/init/prisma";
import {
  successResponse,
  errorResponse,
  Request,
  Response,
} from "../../../utils/Response/response";

export default async (req:Request,resp:Response) => {
    try{
        const token = req.params.token;
        
        const candidate = await prisma.candidateAssessment.findFirst({
            where : {
                invitationToken : token
            },
            select : {
                candidates : true
            }
        });

        resp.status(200).send(successResponse(candidate,"Candidate"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}