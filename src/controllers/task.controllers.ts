import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/task.services";
import handleSuccess from "./handle.controllers";
import { JWTPayload } from "jose";

declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
  }
}

export class TaskController {
  private _taskService: TaskService;

  constructor() {
    this._taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.ensureTokenExist(req, res);
      if (!userId) return next();

      const data = req.body;

      const dataTask = await this._taskService.createTask({
        ...data,
        userId: Number(userId),
      });
      handleSuccess(res, 201, "Created Successfully", dataTask);
    } catch (error) {
      return next(error);
    }
  };

  getAllTasksByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = this.ensureTokenExist(req, res);
      if (!userId) return next();

      const data = await this._taskService.getAllTasksByUser(Number(userId));
      handleSuccess(res, 200, "Success", data);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.ensureTokenExist(req, res);
      if (!userId) return;

      const id = Number(req.params.id);
      const data = await this._taskService.getTaskById(id);

      if (!data || Number(userId) != data.userId) {
        res.status(403).json({ message: "Action is not permitted" });
        return;
      }

      handleSuccess(res, 200, "Success", data);
    } catch (error) {
      next(error);
    }
  };

  updateTaskByIdTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = this.ensureTokenExist(req, res);
      if (!userId) return;

      const id = Number(req.params.id);
      const data = req.body;

      const task = await this.ensureTaskExistById(id, res);
      if (!task) return;

      if (this.checkPermissionToModifyTask(task, Number(userId), res)) return;

      const updatedTaskData = await this._taskService.updateTaskById(id, data);
      handleSuccess(res, 200, "Task Updated Successfully", updatedTaskData);
    } catch (error) {
      next(error);
    }
  };

  deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.ensureTokenExist(req, res);
      if (!userId) return;

      const id = Number(req.params.id);

      const task = await this.ensureTaskExistById(id, res);
      if (!task) return;

      if (this.checkPermissionToModifyTask(task, Number(userId), res)) return;

      await this._taskService.deleteTaskByDeactivatingById(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  private ensureTokenExist(req: Request, res: Response): string | undefined {
    const userId = req.user?.id as string | undefined;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Token is missing" });
      return undefined;
    }

    return userId;
  }

  private async ensureTaskExistById(id: number, res: Response) {
    const task = await this._taskService.getTaskById(id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return null;
    }
    return task;
  }

  private checkPermissionToModifyTask(
    task: any,
    userId: number,
    res: Response
  ): boolean {
    if (task.userId !== userId) {
      res.status(403).json({ message: "Action not allowed" });
      return true;
    }
    return false;
  }
}
