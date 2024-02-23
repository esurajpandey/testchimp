import sendMail from "../../../utils/helpers/sendMail";
import prisma from "../../../utils/init/prisma";
import {
  successResponse,errorResponse,Request,Response,
} from "../../../utils/Response/response";
import { isValidEmail } from "../../../utils/validation/validate_email";

export default async (req: Request, resp: Response) => {
  try {

    const { assessmentId, email, firstName, lastName, emailText, teamId } =
      req.body;

    //Either candidate is in current team or not
    let teamCandidates = await prisma.candidate.findFirst({
      where  :{
        teamId : teamId,
        email : email
      }
    });


    let candidate;

    if(!await isValidEmail(email))
      throw {msg : "Invalid mail",errorCode: 404};
    
    //if not in team - create candidate
    if(!teamCandidates){
      candidate = await prisma.candidate.create({
        data: {
          email,
          firstName,
          lastName,
          team : {
            connect : {
              id : teamId
            }
          }
        },
      });

      //check error
      if(!candidate)
        throw {msg : "Unable to add Candidate",errorCode : 422};

    }else{

      //update candidate details
      candidate = await prisma.candidate.update({
        where : {
          id :  teamCandidates.id
        },
        data :{
          firstName : firstName,
          lastName : lastName
        }
      });

    }

    //find assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) throw { msg: "Assessment not found!", errorCode: 404 };

    if(!assessment?.isEditable)
      throw {msg : "This assessment is archived",errorCode : 400};

    const hiringStage = await prisma.hiringStage.findFirst({
      where : {
        title : "NOT YET EVALUATED"
      },
      select : {
        id : true,
        title : true,
      }
    });

    if(!hiringStage) 
      throw {msg : "Hiring stage not found!",errorCode : 404}//change messgae 

    let token = `${candidate?.id}${assessment?.id}`;
    
    //create a assessment for candidate
    const candidateAssessment = await prisma.candidateAssessment.create({
      data : {
        firstName : firstName,
        lastName : lastName,
        status : "INVITED",
        invitationToken : token,
        assessments :{
          connect :{
            id : assessment?.id,
          },
        },
        candidates :{
          connect :{
            id : candidate?.id
          }
        },
      
      }
    });

    //make assessment disable to edit
    await prisma.assessment.update({
      where : { id : assessment?.id},
      data : {isEditable : false}
    });
    
    if(!candidateAssessment) 
      throw {msg : "Unable to invite candidate for assessment",errorCode : 422};
    
    const url = `http://localhost:3000/test-invitation/${token}`;
    const subject = "You've been invited to an assessment";
    let msg = `<div>
                  <h2>Hi there</h2>
                  <p>
                  Hi ${firstName},
                  Great news! You've been invited to take a TestChimp assessment.
                  You can start the assessment by clicking here:
                      <br/><br/>
                      ${url}
                  </p>
               </div>`;

    await sendMail(email, subject, msg);

    resp
      .status(201)
      .send(successResponse(candidate, "Candidate invited for assessment"));
    
  } catch (err: any) {

    if(err.code === 'P2002'){
      err.msg = "Candidate is already invited!";
      err.errorCode = 409;
      err.code = null;
    }

    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};
