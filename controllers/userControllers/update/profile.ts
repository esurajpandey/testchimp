import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  try {
    let { firstName, lastName, phoneNumber, languageId, id } = req.body;
    
    //default 
    const language = await prisma.language.findFirst({
      where : {
        name : "English"
      }
    });

    if(!languageId) {
      languageId = language?.id
    }

    let user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        phoneNumber,
        language : {
          connect : {
            id : languageId
          }
        }
      },
      select: {
        firstName : true,
        lastName : true,
        phoneNumber : true,
        language : true,
        email: true,
      },
    });

    // console.log(user);
    if (!user) {
      let item: ResponseItem = {
        status: Status.FAILURE,
        message: "User doesn't exist",
        data: null,
      };
      resp.status(304).send(item);
      return;
    }

    let item: ResponseItem = {
      message: "User details is modified",
      data: user,
      status: Status.SUCCESS,
    };

    resp.status(200).send(item);
  } catch (err: any) {
    let item: ResponseItem = {
      status: Status.ERROR,
      data: null,
      error: {
        code: err.code,
        message: err.message,
      },
    };
    resp.status(400).send(item);
  }
};
