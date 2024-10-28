import { NextFunction, Request, Response } from "express";
import { UserService } from "../Services/user.service";
import { handleSuccess, handleError } from "./handlesControllers";

export class UserController {
    private _userService: UserService;

    constructor() {
        this._userService = new UserService();
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;
        try {
            const dataUser = await this._userService.createUser(data);
            handleSuccess(res, 'Created Successfully', { ...dataUser, password: undefined });
        } catch (error) {
            handleError(res, error, next);
        }
    };

    getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._userService.getAllUsers();
            handleSuccess(res, "Success", data);
        } catch (error) {
            handleError(res, error, next)
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            const data = await this._userService.getUserById(id);
            handleSuccess(res, "Success", data);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    updateUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const updatedUserData = await this._userService.updateUserById(id, data);
            handleSuccess(res, "User Updated Successfully", updatedUserData);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            await this._userService.deleteUserById(id);
            res.status(204).send();
        } catch (error) {
            handleError(res, error, next);
        }
    };
}
