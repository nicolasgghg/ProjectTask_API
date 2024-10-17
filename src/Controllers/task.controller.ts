import { NextFunction, Request, Response } from "express";
import { TaskService } from "../Services/task.service";
import { AppError } from "../Errors/AppError";


export class taskController {
    private _taskService: TaskService

    constructor() {
        this._taskService = new TaskService()
    }

    createTask = async (req: Request, res: Response, next: NextFunction) => {
        const userId = Number(req.params.userId)
        const data = { ...req.body, userId: userId }

        try {
            const dataTask = await this._taskService.createTask(data)
            res.status(201).json({
                message: 'Created Successfully',
                data: dataTask,
            })
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.errorCode,
                })
            } else {
                next(error)
            }
        }
    }

    getAllTasks = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this._taskService.getAllTasks()
            res.status(200).json({
                message: "Success",
                data,
            })
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.errorCode,
                })
            } else {
                next(error)
            }
        }
    }

    getTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const taskId = Number(req.params.id)
        try {
            const data = await this._taskService.getTaskById(taskId)
            res.status(200).json({
                message: "Success",
                data,
            })
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.errorCode,
                })
            } else {
                next(error)
            }
        }
    }

    updateTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const userId = Number(req.params.userId)
        const id = Number(req.params.Id)
        const data = { ...req.body, userId: userId }
        try {
            const updatedTaskData = await this._taskService.updateTaskById(id, data)
            res.status(200).json({
                message: "Task Updated Successfully",
                data: updatedTaskData,
            })
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.errorCode,
                })
            } else {
                next(error)
            }
        }
    }

    deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
        const taskId = Number(req.params.taskId)
        try {
            await this._taskService.deleteTaskById(taskId)
            res.status(204).send()
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message,
                    code: error.errorCode,
                })
            } else {
                next(error)
            }
        }
    }

}