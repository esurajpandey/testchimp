import { Status } from '../Response/response';
// const jwt = require("jsonwebtoken");
import jwt from 'jsonwebtoken';
require('dotenv').config();

export default (data:any) : string => {
    if(Object.keys(data).length !== 0){
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET as string,{
            expiresIn : 8640000
        });
        return accessToken;
    }else{
        throw {msg : "Data required for hashing",status : Status.FAILURE};
    }
}
