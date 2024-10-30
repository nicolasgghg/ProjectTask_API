import { NextFunction, Response } from "express";
import { AppError } from "../Errors/AppError";

export const handleSuccess = (res: Response, status:number, message?: string, data?: any) => {
    res.status(status).json({
        message,
        data,
    });
};

export const handleError = (res: Response, error: any, next:NextFunction) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            code: error.errorCode,
        });
    }
    next(error)
};
