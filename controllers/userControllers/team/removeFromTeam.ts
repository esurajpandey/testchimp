import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";


export default async (req: Request, resp: Response) => {
    const item: ResponseItem = {
      message: "",
      data: null,
      status: Status.SUCCESS,
    };
    try {
      //remove from database
  
      let { id, email } = req.body;
      let userId = req.params.requestedUserId;
  
      //current user
      const currUser = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });
  
      if (id === userId)
        throw { msg: "You can't remove yourself", errorCode: 400 };
      //process user
      const procUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true,setting : true },
      });
      
      if (!procUser)
        throw {
          msg: "Selected user does not exists in the team",
          errorCode: 400,
        };
      if (!currUser) throw { msg: "Something went wrong!", errorCode: 400 };
  
      //lets compare them
      if (
        currUser?.role?.code &&
        procUser?.role?.code &&
        currUser?.role.code <= procUser?.role?.code
      ) {
        throw { msg: "Unauthorized to remove this user!", errorCode: 401 };
      }
  
      //and check for owner - not himself
      if (procUser?.role?.code === 20)
        throw { msg: "Something went wrong!", errorCode: 400 };
      
      //lets delete one-one-mapping
      await prisma.notification.delete({
        where : {
          id : procUser?.setting?.id
        }
      });

      //lets delete user
      await prisma.user.delete({
        where: {
          id: procUser?.id,
        },
      });
      //need to remove user setting from db
      
      //locally also we can remove
      let userDetails = await prisma.user.findUnique({
        where: {
          id,
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
  
      userDetails?.team?.User.sort((u1, u2) => {
        if (u1.role && u2.role) {
          return u2.role.code - u1.role.code;
        }
        return 0;
      });
  
      item.message = "Member is removed from team!";
      item.data = userDetails;
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