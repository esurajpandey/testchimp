import { Request, Response } from "express";



export enum Status {
    SUCCESS="SUCCESS",
    FAILURE="FAILURE",
    ERROR="ERROR"
}

export interface ResponseItem { 
    message ?: string,
    status : Status,
    data : any ,

    error ?: {
        code : string,
        message : string
    }
}

const successResponse = (data : any,message : string) => {
    const item : ResponseItem = {
        status : Status.SUCCESS,
        message : message,
        data : data
    }

    return item;
}

const errorResponse = (err : any) => {
    
    let item : ResponseItem = {
        status : Status.FAILURE,
        message : err?.msg ?? "Some internal error!",
        data : null
    }
    
    if (err?.code) {
      item.status = Status.ERROR;
      item.error = {
        code: err.code,
        message: err.message,
      };
    }

    return item;
}

export {
    Request,
    Response,
    errorResponse,
    successResponse
}