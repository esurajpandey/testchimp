import prisma from "../../../utils/init/prisma";

const assessmentSelectQuery = {
    id : true,
    name : true,
    createAt : true,
    updatedAt : true,
    CandidateAssessment : {
      select : {
        status : true,
        candidateId : true,
      }
    }
  }

export default async (teamId: string | undefined,status : boolean,limit : number,offset:number) => {
    if(!teamId)
          return []
      
        const assessments = await prisma.assessment.findMany({
            where: {
              teamId : teamId,
              isArchived : status
            },
            take : limit,
            skip : limit * offset,
            select : assessmentSelectQuery
        });

        if(!assessments)
            throw {msg: "No assessment found",errorCode : 404};
        
        const result = assessments.map((assessment) => {
            return {
            id: assessment.id,
            name: assessment.name,
            createdAt: assessment.createAt,
            updatedAt: assessment.updatedAt,
            candidates: assessment.CandidateAssessment.length,
            completed : assessment.CandidateAssessment.filter(candidate => candidate.status === "COMPLETED").length,
            invited : assessment.CandidateAssessment.filter(candidate => candidate.status === "INVITED").length,
            started : assessment.CandidateAssessment.filter(candidate => candidate.status === "STARTED").length
            };
        });

        return result;
}