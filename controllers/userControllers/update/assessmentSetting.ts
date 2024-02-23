import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  try {
    const { id, demographic_details, redirect_candidate, feedback } = req.body;

    //check user role
    let user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    //grant for only admin and owner
    if (user?.role && user?.role?.code < 15) {
      throw {
        msg: "Permission Dennied",
        errorCode: 401,
        status: Status.FAILURE,
      };
    }

    //update
    const data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        team: {
          update: {
            assessmentSetting: {
              update: {
                demographic_details,
                redirect_candidate,
                feedback,
              },
            },
          },
        },
      },
    });

    if (!data)
      throw { message: "Not updated", errorCode: 304, status: Status.FAILURE };

    let item: ResponseItem = {
      status: Status.SUCCESS,
      data: data,
      message: "Updated",
    };

    resp.status(303).send(item);
  } catch (err: any) {
    let item: ResponseItem = {
      data: null,
      status: err?.status ?? Status.ERROR,
      message: err?.msg,
    };

    if (err?.code) {
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
