import { NextFunction, Request, Response } from "express";
import { TaskService } from "../Services/task.service";
import { handleSuccess, handleError } from "./handlesControllers";

export class TaskController {
    private _taskService: TaskService;

    constructor() {
        this._taskService = new TaskService();
    }

    createTask = async (req: Request, res: Response, next: NextFunction) => {
        
        try {
            const data = req.body;
            data.userId = req.user!.id;

            const dataTask = await this._taskService.createTask(data);
            handleSuccess(res, 200, 'Created Successfully', dataTask);
        } catch (error) {
            handleError(res, error, next); 
        }
    };

    getAllTasksByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = Number(req.user!.id);
            const data = await this._taskService.getAllTasksByUser(userId);
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

            const task = await this._taskService.getTaskById(id);
            if (task.userId !== req.user?.id) {
                return handleSuccess(res, 403, "Action not allowed");
            }

            const updatedTaskData = await this._taskService.updateTaskById(id, data);
            handleSuccess(res, 200, "Task Updated Successfully", updatedTaskData);
        } catch (error) {
            handleError(res, error, next);
        }
    };

    deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        try {

            const task = await this._taskService.getTaskById(id);
            if (task.userId !== req.user?.id) {
                return handleSuccess(res, 403, "Action not allowed");
            }
            
            await this._taskService.deleteTaskById(id);
            res.status(204).send();
        } catch (error) {
            handleError(res, error, next);
        }
    };
}
