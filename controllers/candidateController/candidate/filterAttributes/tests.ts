import prisma from "../../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../../utils/Response/response";


const testSelectQuery = {
    select  : {
        id : true,
        title : true
    }
}

const assessmentSelectQuery = {
    select : {
        AssessmentTest : {
            select : {
                tests : testSelectQuery
            }
        }
    }
}

export default async (req:Request,resp:Response) => {
    try{
        const teamId = req.body.teamId;

        const tests = await prisma.assessment.findMany({
            where : {
                teamId
            },
            select : {
                AssessmentTest :{
                    select : {
                        tests :{
                            select : {
                                id : true,
                                title : true,
                            }
                        }
                    }
                }
            }
        })

        if(!tests)
            throw {msg : "No test found",errorCode : 404};
        

        
        resp.status(200).send(successResponse(tests,"Team test"));

    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}