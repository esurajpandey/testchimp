import generate_pdf from "../../../utils/helpers/pdf/send_result";
import prisma from "../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";

export default async (req:Request,resp:Response) => {
    try{
         
        const details = await fetchDetails(req);
        if(!details?.data)
            throw {msg :"No data found",errorCode : 404};
        await generate_pdf(JSON.stringify(details?.data),details?.email);
        resp.status(200).send(successResponse(null,"PDF result sent"));
    }catch(err : any){
        console.log(err);
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}


const testSelectQuery = {
    select : {
        tests : {
            select : {
                title : true,
                TestQuestions :{select :{questions :{select : {title : true}}}} 
            }
        }
    }
}
const questionSelectQuery = {
    select : {
        questions : {
            select : {
                description : true,
                type : true,
            }
        },
    }
}
const companySelectQuery = {
    team : {select : {company : {select : {name : true}}} }
}

const fetchDetails = async (req : Request) => {
    return await prisma.$transaction(async tx =>{

        const {id} = req.body;
        const assessmentId = req.query.assessmentId as string;
        const candidateId = req.query.candidateId as string;

        const company = await tx.user.findUnique({
            where : {
                id
            },
            select : companySelectQuery
        });
        
        const canidate = await tx.candidate.findUnique({
            where : {
                id : candidateId
            },
            select : {
                id : true,
                firstName : true,
                lastName : true,
                email : true,
            }
        });

        const assessment = await tx.candidateAssessment.findUnique({
            where :{
                candidateId_assessmentId : {
                    candidateId,
                    assessmentId
                }
            },
            select : {
                score : true, 
                assessments : {
                    select : {
                        AssessmentQuestion :questionSelectQuery,
                        AssessmentTest : testSelectQuery
                    }
                }
            }
        });

        
        //preparing data to send pdf
        let data = {
            company : company?.team?.company?.name ,
            candidate : {
                name :  `${canidate?.firstName} ${canidate?.lastName}`
            },
            "Test Score" : {
                "Average Score" : assessment?.score,
                tests : assessment?.assessments?.AssessmentTest.map(test => {
                    return {
                        name : test?.tests?.title,
                        questions : {
                            title : test?.tests?.TestQuestions.map(question => {
                                return question?.questions?.title
                            })
                        }
                    }
                })
            },
            "Custom questions" : {
                questions :  assessment?.assessments?.AssessmentQuestion.map(question => {
                    return {
                        type : question?.questions?.type?.title,
                        question : question?.questions?.description
                    }
                })
            }
        }

        return {data,email : canidate?.email};
    })
    
}