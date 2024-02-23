import prisma from "../../../utils/init/prisma";
import { errorResponse, Request, Response, successResponse } from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const id = req.params.ownerId;
    if(!id) 
      throw {msg : "OwnerId required!",errorCode : 400};

    const data = await prisma.testOwner.findUnique({
      where : {
        id
      },
      select : {
        name : true,
        bio : true,
        profile : true,
        Test : {
          select : {
            _count : true
          }
        }
      }
    })

    if (!data) throw { msg: "No owner found!", errorCode: 404 };
    resp.status(200).send(successResponse(data, "owner details."));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};