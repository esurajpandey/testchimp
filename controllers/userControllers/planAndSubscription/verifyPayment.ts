import prisma from "../../../utils/init/prisma";
import { successResponse,errorResponse,Request,Response } from "../../../utils/Response/response";
import crypto from 'crypto';

export default  async (req:Request,resp : Response) => {
    try{
        const planId = req.query?.plan as string;

        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        let body= razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_KEY_SECRET as string).update(body.toString()).digest('hex');
        

        if(expectedSignature !== razorpay_signature)
            throw {msg : "Payment is not done! Try again",errorCode : 400};
        
        //now store in db
        const subscription = await prisma.subscription.findFirst({
            where : {
                newOrderId : razorpay_order_id
            }
        });

        if(!subscription?.id)
            throw {msg : "Invalid order id",errorCode : 400};
        
        const plan = await prisma.plan.findUnique({
            where  :{ id : planId}
        });

        if(!plan)
            throw {msg : "Invalid payments and plan! contact to our team",errorCode :400};
        
        const duration = Number(plan?.duration);
        const planExpiryDate = getNextDate(duration);

        const new_subscription = await prisma.subscription.update({
            where : {
                id : subscription?.id
            },
            data : {
                endDate : planExpiryDate,
                startingDate : new Date(),
                plan : {
                    connect : {
                        id : plan?.id
                    }
                },
                receipt : {
                    create : {
                        amount : `${plan?.price}`,
                        date : new Date(),
                        orderId : razorpay_order_id,
                        paymentId : razorpay_payment_id
                    }
                }
            }
        });

        if(!new_subscription)
            throw {msg : "Unable to process",errorCode : 422};
        
        resp.redirect(`${process.env.PAYMENT_SUCCESS_URL}?reference=${razorpay_payment_id}&subscription=${new_subscription?.id}`);
    }catch(err : any){
        resp.status(err?.errorCode ?? 500).send(errorResponse(err));
    }
}

function getNextDate(days : number) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}