import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";

const applicantTracking = async (req: Request, resp: Response) => {
  try {
    const data = await prisma.applicantTracking.findMany();

    if (!data)
      throw {
        msg: "Applicant tracking does not exists!",
        errorCode: 404,
        status: Status.FAILURE,
      };

    let item: ResponseItem = {
      status: Status.SUCCESS,
      message: "",
      data: data,
    };
    resp.status(200).send(item);
  } catch (err: any) {
    let item: ResponseItem = {
      status: err?.status,
      message: err?.msg,
      data: null,
    };

    if (err.code) {
      item.error = {
        message: err.message,
        code: err.code,
      };
    }

    resp.status(err.errorCode ? err.errorCode : 400).send(item);
  }
};

export default applicantTracking;
