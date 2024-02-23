import prisma from "../../../utils/init/prisma";
import { errorResponse, Request, Response, successResponse } from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const {name,bio,profile} = req.body;
    const ownerId = req.params.ownerId;
    if(!ownerId)
      throw {msg : "Owner id required",errorCode : 400};

    const data = await prisma.testOwner.update ({
      where : {
        id : ownerId
      },
      data : {
        name,
        bio,
        profile,
      }
    });

    if (!data) throw { msg: "Unable to process", errorCode: 404 };
    resp.status(202).send(successResponse(data, "Details updated."));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};