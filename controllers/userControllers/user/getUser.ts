import prisma from "../../../utils/init/prisma";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  const item: ResponseItem = {
    message: "",
    data: null,
    status: Status.SUCCESS,
  };

 

  try {
    const id = req.body.id;
    
    let teamSeletionQuery =  {
      select: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: {
              select: {
                type: true,
                code: true,
              },
            },
          },
        },
  
        subscription: {
          select: {
            endDate: true,
            plan: true,
          },
        },
  
        applicant_tracking: true,
        assessmentSetting: true,
        company: true,
      },
    }

    let data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        setting: true,
        language: true,
        jobTitle: true,

        role: {
          select: {
            type: true,
            code: true,
          },
        },
        team : teamSeletionQuery
      },
    });

    if (!data)
      throw {
        msg: "Server not responding! Try after sometime.",
        errorCode: 400,
      };

    //filter data according to role
    if (data?.role?.code && data?.role?.code < 15) {
      if (data.team?.company) data.team.company = null;
      if (data.team?.assessmentSetting) data.team.assessmentSetting = null;
      if (data.team?.applicant_tracking) data.team.applicant_tracking = null;

      if (data.role.code < 10) {
        if (data.team?.User) data.team.User = [];
      }
    }

    data?.team?.User.sort((u1, u2) => {
      if (u1.role && u2.role) {
        return u2.role.code - u1.role.code;
      }
      return 0;
    });

    item.data = data;
    item.message = "User details";
    resp.status(200).send(item);
  } catch (err: any) {
    item.status = Status.FAILURE;
    item.message = err?.msg ?? "Some internal error!";

    if (err.code) {
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};

