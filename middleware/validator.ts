import { NextFunction,Request,Response } from 'express';
import { ResponseItem, Status } from '../utils/Response/response';

const validator = (schema : any) => async (req : Request,resp: Response,next : NextFunction) => {
    const body = req.body;
    // console.log(body);
    let res = await schema.validate(body);

    if(res?.error){
        let item : ResponseItem = {
            message : res?.error?.details[0]?.message,
            status : Status.FAILURE,
            data : null
        }
        resp.status(400).send(item);
        return;
    }
    next();
}

export default validator;