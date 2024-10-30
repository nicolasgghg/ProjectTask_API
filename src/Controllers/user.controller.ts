import { NextFunction, Request, Response } from "express";
import { UserService } from "../Services/user.service";
import { handleSuccess, handleError } from "./handlesControllers";
import { AppError } from "../Errors/AppError";

export class UserController {
    private _userService: UserService;

    constructor() {
        this._userService = new UserService();
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;
        try {
            const dataUser = await this._userService.createUser(data);
            handleSuccess(res, 200, 'Created Successfully', { ...dataUser, password: undefined });
        } catch (error) {
            handleError(res, error, next);
        }
    };

    getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._userService.getAllUsers();
            handleSuccess(res, 200, "Success", data);
        } catch (error) {
            handleError(res, error, next)
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            const data = await this._userService.getUserById(id);
            handleSuccess(res, 200, "Success", data);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    updateUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const updatedUserData = await this._userService.updateUserById(id, data);
            handleSuccess(res, 200, "User Updated Successfully", updatedUserData);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            await this._userService.deleteUserById(id);
            handleSuccess(res, 204)
        } catch (error) {
            handleError(res, error, next);
        }
    };

    authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body
            if (!email || !password) throw new AppError("E-mail and Password is mandatory", 202, "INVALID_DATA")
            const token = await this._userService.authenticateUser(email, password)
            return handleSuccess(res, 200, "Authentication Successful", { token })
        } catch (error) {
            handleError(res, error, next);
        }

    }
}
