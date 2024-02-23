import prisma from "../../../../utils/init/prisma";
import {
  errorResponse,
  Request,
  Response,
  successResponse,
} from "../../../../utils/Response/response";

export default async (req: Request, resp: Response) => {
  try {
    const { name } = req.body;

    const data = await prisma.language.create({
      data: {
        name,
      },
    });

    if (!data) throw { msg: "Unable to create", errorCode: 403 };
    resp.status(201).send(successResponse(data, "Created successfully."));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};
