import prisma from "../../../utils/init/prisma";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  const item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };

  try {
    const { firstName, lastName, phoneNumber, emailUpdate, id } = req.body;
    // console.log(firstname, lastname, phone, emailUpdate, id)

    let data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName : firstName,
        lastName : lastName, 
        phoneNumber : phoneNumber,
        jobTitle: req.body?.jobTitle ?? null,
        setting: {
          update: {
            emailUpdate,
          },
        },
      },
      select: {
        firstName: true,
        lastName: true,
        language: true,
        setting: true,
        role: {
          select: {
            type: true,
            code: true,
          },
        },
        team: {
          select: {
            User: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
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
        },
      },
    });

    //filter data according to role
    if (data?.role?.code && data?.role?.code < 15) {
      if (data.team?.company) data.team.company = null;
      if (data.team?.assessmentSetting) data.team.assessmentSetting = null;
      if (data.team?.applicant_tracking) data.team.applicant_tracking = null;

      if (data.role.code < 10) {
        if (data.team?.User) data.team.User = [];
      }
    }

    //sort member according to role-owner->admin->recruiter->hiring manager
    data?.team?.User.sort((u1, u2) => {
      if (u1.role && u2.role) {
        return u2.role.code - u1.role.code;
      }
      return 0;
    });

    item.data = data;
    item.message = "Data added";
    resp.status(202).send(item);
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
