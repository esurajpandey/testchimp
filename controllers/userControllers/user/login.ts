import {
  successResponse,
  errorResponse,
  Request,
  Response,
} from "./../../../utils/Response/response";
import bcrypt from "bcrypt";
import generate_jwt_token from "../../../utils/helpers/generate_jwt_token";
import prisma from "../../../utils/init/prisma";
import assessments from "../../assessmentControllers/assessments/assessments";

export default async (req: Request, resp: Response) => {
  try {
    const { email, password } = req.body;

    //find user email and password
    let user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user)
      throw {
        msg: "Email is not registered!",
        errorCode: 404,
      };

    //let verify credentials
    if (!(await bcrypt.compare(password, user?.password as string)))
      throw {
        msg: "Invalid credentials",
        errorCode: 401,
      };

    //extract the whole data
    let userDetails = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        setting: true,
        firstName: true,
        lastName: true,
        language: true,
        email: true,
        jobTitle: true,
        phoneNumber: true,
        role: {
          select: {
            type: true,
            code: true,
          },
        },
        team: {
          select: {
            id: true,
            applicant_tracking: true,
            assessmentSetting: true,
            company: true,

            subscription: {
              select: {
                endDate: true,
                plan: true,
              },
            },
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: {
                  select: {
                    code: true,
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    //filter data according to role
    if (userDetails?.role?.code && userDetails?.role?.code < 15) {
      if (userDetails.team?.company) userDetails.team.company = null;
      if (userDetails.team?.assessmentSetting)
        userDetails.team.assessmentSetting = null;
      if (userDetails.team?.applicant_tracking)
        userDetails.team.applicant_tracking = null;

      if (userDetails.role.code < 10) {
        if (userDetails.team?.User) userDetails.team.User = [];
      }
    }

    //sort member according to role-owner->admin->recruiter->hiring manager
    userDetails?.team?.User.sort((u1, u2) => {
      if (u1.role && u2.role) {
        return u2.role.code - u1.role.code;
      }
      return 0;
    });

    //generate token
    const token = generate_jwt_token({
      id: user?.id,
    });

    const assessment = await assessments(userDetails?.team?.id,false,25,0);


    resp.setHeader("X-Auth-Token", token.toString());
  
    resp
      .status(202)
      .send(
        successResponse(
          {
            userDetails: userDetails,
            accessToken: token,
            assessments: assessments,
          },
          "Login success!"
        )
      );

  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};

