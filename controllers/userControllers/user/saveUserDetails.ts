import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

const saveUserDetails = async (req: Request, resp: Response) => {
  const item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      companyName,
      employeeRange,
      planToHire,
      id,
    } = req.body;

    const jobTitle = req.body?.jobTitle ?? null;
    const applicantTrackingId = req.body?.applicantTrackingSystemId ?? null;
    const emailUpdate = req.body?.emailUpdate ?? false;

    if (!id) throw { msg: "User doesn't exist", errorCode: 404 };

    let data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        phoneNumber,
        jobTitle,
        setting: {
          update: {
            emailUpdate,
          },
        },
        team: {
          update: {
            assessmentSetting: {
              update: {
                demographic_details: false,
              },
            },
            company: {
              update: {
                name: companyName,
                employeeRange,
                planToHire,
              },
            },
            applicant_tracking: {
              connect: {
                id: applicantTrackingId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        setting: true,
        role: {
          select: {
            type: true,
            code: true,
          },
        },
        language: true,
        team: {
          select: {
            id: true,
            company: true,
            applicant_tracking: true,
            assessmentSetting: true,
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
                startingDate: true,
                endDate: true,
                plan: true,
              },
            },
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

    if (!data) throw { msg: "Error occured in account update", errorCode: 304 };

    item.data = data;
    item.message = "Data updated successfully!";
    
    resp.status(202).send(item);
  } catch (err: any) {
    console.log(err);
    item.status = Status.FAILURE;
    item.message = err?.msg ?? "Some internal error!";
    if (err.code) {
      if (err.code === "P2002") {
        item.message = "Duplicate Details";
      }
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};

export default saveUserDetails;
