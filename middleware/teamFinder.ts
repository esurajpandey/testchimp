import {
  successResponse,
  errorResponse,
  Request,
  Response,
} from "../utils/Response/response";
import { NextFunction } from "express";
import prisma from "../utils/init/prisma";

export default async (req: Request, resp: Response, next: NextFunction) => {
  try {
    const team = await prisma.user.findUnique({
        where : {
            id : req.body.id
        },
        select : {
            teamId : true
        }
    });

    if(!team?.teamId)
        throw  {msg : "It seems you are not a member of any team",errorCode:404};
    
    req.body.teamId = team?.teamId;
    next();
  } catch (err: any) {
    return resp.status(err?.code ?? 400).send(errorResponse(err));
  }
};
