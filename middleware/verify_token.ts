require('dotenv').config();
import jwt from "jsonwebtoken";
import {Request,Response,NextFunction} from "express";
import { ResponseItem, Status } from "../utils/Response/response";

export default async (req : Request,resp : Response,next :  NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    // 'BarearToken  sfjkbasgfasgfgaskjdfhashgfhjsbfgsfbashgfhjasgfghfgasfdg'
    console.log("Verify token",token);
    if(token == null){
        return resp.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, function(err : any, decoded : any) {
        if(err) {
            let item : ResponseItem = {
                message : "Unauthorized User",
                status : Status.FAILURE,
                data :  null,
            }
            return resp.status(401).send(item);
        }
        req.body.id   = decoded.id;
        next();
    });
}