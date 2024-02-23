import {Request,Response,errorResponse,successResponse} from "../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import generate_uuid from "../../../utils/helpers/generate_uuid";


export default async (req:Request,resp :Response) => {
    try{
        const assessmentId = req.params?.assessmentId;

        if(!assessmentId)
            throw {msg : "Assessment id required",errorCode :400};
        // const d = await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

        const clonedAssessment = await clone(assessmentId);
        resp.status(200).send(successResponse(clonedAssessment,"Assessment is cloned"));
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}


const clone = async (assessmentId : string) => {
    return await prisma.$transaction(async tx => {
        let uuid = await generate_uuid();
        let clonedAssessment = await tx.$queryRaw`
        INSERT INTO "public"."Assessment" ("id","name","extraTime","isArchived","isAccomodationForNonFluent",
        "isAccomodationForAbnormal","isAntiCheatingEnabled","isEditable","createAt","updatedAt",
        "languageId","jobRoleId","teamId") SELECT ${uuid},"name","extraTime","isArchived",
        "isAccomodationForNonFluent","isAccomodationForAbnormal","isAntiCheatingEnabled",
        ${true},${new Date()},${new Date()},"languageId","jobRoleId","teamId"
        FROM "public"."Assessment"
        WHERE id=${assessmentId} RETURNING *`;

        let assessment = clonedAssessment as any;

        if(!assessment[0]?.id)
            throw {msg : "Unable to clone the assessment",errorCode :422};
        

        const tests = await tx.assessmentTest.findMany({
            where : {
                assessmentId : assessmentId,
            }
        });

        if(tests[0]){
            let query = tests.map(test => {
                return {
                    testId : test.testId,
                    assessmentId: uuid
                }
            });

            await tx.assessmentTest.createMany({
                data : query
            });
        }

        const questions = await tx.assessmentQuestion.findMany({
            where : {
                assessmentId 
            }
        });

        if(questions[0]?.questionId){
            let query = questions.map(question => {
                return {
                    questionId : question.questionId,
                    assessmentId: uuid
                }
            });
            
            await tx.assessmentQuestion.createMany({
                data : query
            });
        }
        return assessment;
    })
}   