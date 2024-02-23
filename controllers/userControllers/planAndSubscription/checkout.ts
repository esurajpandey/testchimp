import prisma from "../../../utils/init/prisma";
import {
  successResponse,
  errorResponse,
  Request,
  Response,
} from "../../../utils/Response/response";
import instance from "../../../config/razorpay";

export default async (req: Request, resp: Response) => {
  try {
    const { planId, subscriptionId } = req.body;

    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) throw { msg: "Plan not found", errorCode: 404 };

    const amount = Number(plan?.price);

    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    const subscription = await prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        newOrderId: order?.id,
      },
    });

    if (!subscription)
      throw { msg: "Unable create checkout! Try again", errorCode: 422 };

    resp.status(200).json(successResponse(order, "Checkout details"));
  } catch (err: any) {
    resp.status(err?.errorCode ?? 500).send(errorResponse(err));
  }
};
