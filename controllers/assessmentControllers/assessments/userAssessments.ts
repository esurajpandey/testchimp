import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import assessments from "./assessments";



export default async (req :Request,resp : Response) => {
    try{
        const {teamId} = req.body;

        const limit = +req.params?.limit ?? "10";
        const offset = +req.params?.offset ?? "0";
        const status = !!req.query?.active ?? "true";
        
        if(!teamId)
          throw {msg: "Team details not available",errorCode: 400};
      
        const responseData = await assessments(teamId,status,limit,offset);
        resp.status(200).send(successResponse(responseData,"User assessments"));
    }catch(err : any){
        let item  = errorResponse(err);
        resp.status(err?.errorCode ?? 400).send(item);
    }   
}

