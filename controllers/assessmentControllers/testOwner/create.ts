import prisma from "../../../utils/init/prisma";
import { errorResponse, Request, Response, successResponse } from "../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const {name,bio} = req.body;
    const profile = req.body?.profile ?? "";

    const data = await prisma.testOwner.create({
        data : {
            name,
            bio,
            profile,
        }
    });

    if (!data) throw { msg: "Unable to create owner!", errorCode: 400 };
    resp.status(201).send(successResponse(data, "Test owner created."));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
