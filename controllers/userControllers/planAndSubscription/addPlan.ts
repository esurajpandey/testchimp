import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

export default async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    status: Status.SUCCESS,
    message: "",
    data: null,
  };

  try {
    /**
     * Can not use lodash inside body
     * type '{ _: LoDashStatic; "": any; }' is not assignable to type '(Without<PlanCreateInput, PlanUncheckedCreateInput> & PlanUncheckedCreateInput) | (Without<...> & PlanCreateInput)'.
     */

    const plan = await prisma.plan.create({
      data: {
        ...req.body
      },
    });
    
    if (!plan) throw { msg: "No plans available!", errorCode: 404 };

    item.data = plan;
    item.message = "Available plans";
    resp.status(200).send(item);
  } catch (err: any) {
    item.status = Status.FAILURE;
    item.message = err?.msg ?? "Some internal error!";

    if (err?.message) {
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};
