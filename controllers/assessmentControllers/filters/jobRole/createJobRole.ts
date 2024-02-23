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
    const language = await prisma.language.create({
      data: {
        name,
      },
    });

    if (!language) throw { msg: "Unable to create job role", errorCode: 403 };

    resp.status(201).send(successResponse(language, "Created successfully."));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};
