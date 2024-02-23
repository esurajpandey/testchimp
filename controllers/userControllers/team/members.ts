import prisma from "../../../utils/init/prisma";
import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  const item: ResponseItem = {
    message: "",
    data: null,
    status: Status.SUCCESS,
  };
  try {
    let { id } = req.body;
    let data = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
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
          },
        },
      },
    });

    if (!data?.team) {
      throw { msg: "User doesn't have any team", errorCode: 400 };
    }

    data?.team?.User.sort((u1, u2) => {
      if (u1.role && u2.role) {
        return u2.role.code - u1.role.code;
      }
      return 0;
    });
    item.message = "All members";
    item.data = data;
    resp.status(200).send(item);
  } catch (err: any) {
    item.message = err.msg;
    item.status = Status.FAILURE;

    if (err?.message) {
      item.status = Status.ERROR;
      item.error = {
        message: err.message,
        code: err.code,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
