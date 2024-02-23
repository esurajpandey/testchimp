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
        Test : {
          select : {
            _count : true,
            audience : true,
            duration : true,
            createAt : true,
            updatedAt : true,
            id : true,
            isPremium : true,
            longDescription : true,
            shortDescription : true,
            relevance : true,
            testLevel : true,
            testType : true,
            title : true,
            TestQuestions : {
              select : {
                questions : {
                  select : {
                    _count : true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!data?.Test[0]?.id) throw { msg: "No test found! ", errorCode: 404 };
    resp.status(200).send(successResponse(data, "Owner tests"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 400).send(errorResponse(err));
  }
};