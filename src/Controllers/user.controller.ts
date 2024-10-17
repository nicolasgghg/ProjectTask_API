import { NextFunction, Request, Response } from "express";
import { UserService } from "../Services/user.service";


export class userController {
    private _userService: UserService

    constructor() {
        this._userService = new UserService()
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body
        try {
            const dataUser = await this._userService.createUser(data)
            res.status(201).json({
                message: 'Created Successfully',
                data: dataUser,
            })
        } catch (error) {
            next(error)
        }
    }

    getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._userService.getAllUsers()
            res.status(200).json({
                message: "Success",
                data,
            })
        } catch (error) {
            next(error)
        }
    }

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)
        try {
            const data = await this._userService.getUserById(id)
            res.status(200).json({
                message: "Success",
                data,
            })
        } catch (error) {
            next(error)
        }
    }

    updateUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)
        const data = req.body
        try {
            const updatedUserData = await this._userService.updateUserById(id, data)
            res.status(200).json({
                message: "User Updated Successfully",
                data: updatedUserData,
            })
        } catch (error) {
            next(error)
        }
    }

    deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id)
        try {
            await this._userService.deleteUserById(id)
            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

}