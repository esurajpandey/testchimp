import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req :Request,resp : Response) => {
    try{
        const {id} = req.body;
        const testId = req.params?.testId;
        const assessmentId = req.params?.assessmentId;

        if(!testId)
            throw {msg : "Test id is required",errorCode : 400};

        if(!assessmentId)
            throw {msg : "Assessment id is required",errorCode : 400};
        
        //check the number of tests added in assessment max = 5
        const assessmentData = await prisma.assessmentTest.findMany({
            where : {
                assessmentId
            }
        });
        
        if(assessmentData.length === 5)
            throw {msg : "Only five test allowed in one assessments",errorCode : 404};
        

        let assessment = await prisma.assessmentTest.create({
            data  : {
                tests : {
                    connect : {
                        id : testId
                    }
                },
                assessments : {
                    connect : {
                        id : assessmentId
                    }
                }
            },
            select : {
                assessments : true,
                tests : true
            }
        });

        if(!assessment) 
            throw {msg : ""}
        let item = successResponse(assessment,"Test Added.");
        resp.status(200).send(item);
        
    }catch(err : any){
        if(err.code === "P2002")
            err.msg = "This test already added!";
            err.errorCode = 409;
            err.code = null;
        resp.status(err?.errorCode ?? 400).send(errorResponse(err));
    }   
}