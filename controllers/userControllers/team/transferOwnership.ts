import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
    const item: ResponseItem = {
      message: "",
      data: null,
      status: Status.SUCCESS,
    };
    try {
      let { id, email } = req.body;
      //find current user
      let currUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });
      if (!currUser)
        throw { msg: "Error occured! try after sometime", errorCode: 400 };
  
      //find user who will be owner
      let procUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true },
      });
      if (!procUser)
        throw { msg: "Error occured! try after sometime", errorCode: 400 };
  
      if (currUser?.role?.code !== 20)
        throw { msg: "Only owner can trasfer ownership", errorCode: 401 };
  
      //if owner request himself
      if (currUser?.id === procUser?.id)
        throw { msg: "User has already ownership", errorCode: 400 };
  
      //if procc user is not admin then
      if (procUser?.role?.code !== 15)
        throw { msg: "Only admin can be an owner", errorCode: 400 };
  
      //lets transfer - first admin to owner
      let owner = await prisma.user.update({
        where: {
          id: procUser?.id,
        },
        data: {
          role: {
            connect: {
              type: "OWNER",
            },
          },
        },
      });
  
      let data = await prisma.user.update({
        where: {
          id: currUser?.id,
        },
        data: {
          role: {
            connect: {
              type: "ADMIN",
            },
          },
        },
        select: {
          firstName: true,
          lastName: true,
          role: true,
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
  
      data?.team?.User.sort((u1, u2) => {
        if (u1.role && u2.role) {
          return u2.role.code - u1.role.code;
        }
        return 0;
      });
      item.data = data;
      item.message = "Ownership transferred successfully!";
  
      resp.status(202).send(item);
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