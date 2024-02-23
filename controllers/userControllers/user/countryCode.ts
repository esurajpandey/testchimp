import { Status, ResponseItem, Request, Response} from "./../../../utils/Response/response";
import prisma from "../../../utils/init/prisma";


const countryCode = async (req: Request, resp: Response) => {
  let item: ResponseItem = {
    message: "",
    status: Status.SUCCESS,
    data: null,
  };

  try {
    const query = req.params.query;
    const data = await prisma.countryCode.findMany({
      where: {
        code: {
          startsWith: query,
        },
      },
    });

    item.message = "Related code";
    item.data = data;
    resp.status(200).send(data);
  } catch (err: any) {
    item.status = Status.FAILURE;
    item.message = err?.msg ?? "Some internal error!";

    if (err.code) {
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }
    resp.status(err?.errorCode ?? 400).send(item);
  }
};

export default countryCode;