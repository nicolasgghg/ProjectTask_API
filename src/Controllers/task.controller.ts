import { NextFunction, Request, Response } from "express";
import { TaskService } from "../Services/task.service";
import { handleSuccess, handleError } from "./handlesControllers";
import jose from 'jose'

declare module 'express-serve-static-core' {
    interface Request {
        user?: jose.JWTPayload
    }
}

export class TaskController {
    private _taskService: TaskService;

    constructor() {
        this._taskService = new TaskService();
    }

    createTask = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: Token does not exist' })
            return
        }

        const data = req.body;

        try {
            const dataTask = await this._taskService.createTask(data);
            handleSuccess(res, 201, 'Created Successfully', { ...dataTask, password: undefined });
        } catch (error) {
            handleError(res, error, next);
        }
    };

    getAllTasks = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._taskService.getAllTasks();
            handleSuccess(res, 200, "Success", data);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    getTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            const data = await this._taskService.getTaskById(id);
            handleSuccess(res, 200, "Success", data);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    updateTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const updatedTaskData = await this._taskService.updateTaskById(id, data);
            handleSuccess(res, 200, "Task Updated Successfully", updatedTaskData);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {
            await this._taskService.deleteTaskById(id);
            handleSuccess(res, 204)
        } catch (error) {
            handleError(res, error, next);
        }
    };
}
