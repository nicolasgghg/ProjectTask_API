export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;

    constructor(message: string, statusCode: number = 400, errorCode: string = 'GENERIC_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode; 
        this.name = "AppError";
    }
}