import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";
import { validateEmail } from "../../../utils/validation/validate_email";

export default async (req: Request, resp: Response) => {
  const item: ResponseItem = {
    message: "",
    data: null,
    status: Status.SUCCESS,
  };
  try {
    let { id, role, firstName, lastName, email } = req.body;

    let requestedId = req.params.updateMemberId;
    role = role.toUpperCase();

    if (role === "OWNER")
      throw { msg: "Not applicable -to Change owner", errorCode: 400 };

    if (email) {
      //validate
      await validateEmail(email);
    }

    //lets find current user
    let currUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });
    if (!currUser)
      throw { msg: "Error occured! try after sometime", errorCode: 400 };

    //if current user and proccessing User is same
    if (id === requestedId)
      throw { msg: "User Can't change himself", errorCode: 400 };

    //if current user is hiring manager
    if (currUser?.role?.code && currUser?.role?.code < 10)
      throw {
        msg: "Hiring Manager has no permission to change",
        errorCode: 401,
      };

    //if current user is recruiter and requested to Change Admin
    if (currUser?.role?.code && currUser?.role?.code < 15) {
      if (role === "ADMIN") {
        throw { msg: "Only Admin and Owner can change", errorCode: 401 };
      }
    }

    //find user who will be update
    let requestedUser = await prisma.user.findUnique({
      where: { id: requestedId },
      select: { id: true, role: true },
    });
    if (!requestedUser)
      throw { msg: "Error occured! try after sometime", errorCode: 400 };

    /**
     * Owner  -  All control - transfer ownership
     * Admin - change other admin, recruiter,hiring manager except himself
     * Recruiter -  can change other recruiter, hiring manager and except himself
     * HM -  No control
     */

    //current user role >= processing user
    if (
      currUser.role?.code &&
      requestedUser?.role?.code &&
      currUser?.role.code < requestedUser.role.code
    )
      throw { msg: "Current user doesn't have permission", errorCode: 401 };

    //lets update in database
    let new_data = await prisma.user.update({
      where: {
        id: requestedId,
      },
      data: {
        firstName,
        lastName,
        email,
        role: {
          connect: {
            type: role,
          },
        },
      },
      select: {
        team: {
          select: {
            User: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    //sort member according to role-owner->admin->recruiter->hiring manager
    new_data?.team?.User.sort((u1, u2) => {
      if (u1.role && u2.role) {
        return u2.role.code - u1.role.code;
      }
      return 0;
    });

    item.data = new_data;
    item.message = "New role is assigned";
    resp.status(202).send(item);
  } catch (err: any) {
    item.message = err.msg;
    item.status = Status.FAILURE;

    if (err?.message) {
      if (err.code === "P2002") {
        item.message = "This email is already exists";
      } else {
        item.status = Status.ERROR;
        item.error = {
          message: err.message,
          code: err.code,
        };
      }
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
