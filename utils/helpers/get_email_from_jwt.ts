require('dotenv').config();
import jwt from "jsonwebtoken";

export default async (token : string) => {
    let data = {email :""}
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, function(err : any, decoded : any) {
        if(err){
            throw {msg : "Invalid token",errorCode : 400,status : "FAILURE"}
        }
        data.email = decoded.email;
    });
    return data;
}