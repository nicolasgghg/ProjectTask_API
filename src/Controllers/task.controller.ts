import { NextFunction, Request, Response } from "express";
import { TaskService } from "../Services/task.service";
import { handleSuccess, handleError } from "./handlesControllers";
import jose from "jose";

declare module "express-serve-static-core" {
  interface Request {
    user?: jose.JWTPayload;
  }
}

export class TaskController {
  private _taskService: TaskService;

  constructor() {
    this._taskService = new TaskService();
  }

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const userId = Number(req.user?.id as number);

    if (!userId) {
      res
        .status(400)
        .json({ message: "Invalid token payload: missing user ID" });
      return;
    }

    if (userId != data.userId) {
      res
        .status(403)
        .json({ message: "TOKEN IS NOT COMPATIBLE WITH USER" });
      return;
    }

    try {
      const dataTask = await this._taskService.createTask({
        ...data,
        userId: userId,
      });
      handleSuccess(res, 201, "Created Successfully", {
        ...dataTask,
        password: undefined,
      });
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
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: missing user ID in token" });
        return;
      }

      const id = Number(req.params.id);
      const data = await this._taskService.getTaskById(id);

      if (data?.userId !== userId) {
        res
          .status(403)
          .json({ message: "Forbidden: you cannot see this task" });
        return;
      }

      handleSuccess(res, 200, "Success", data);
    } catch (error) {
      handleError(res, error, next);
    }
  };

  updateTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: missing user ID in token" });
        return;
      }

      const id = Number(req.params.id);
      const data = req.body;

      const task = await this._taskService.getTaskById(id);

      if (task?.userId !== userId) {
        res
          .status(403)
          .json({ message: "Forbidden: you cannot modify this task" });
        return;
      }

      const updatedTask = await this._taskService.updateTaskById(id, data);
      handleSuccess(res, 200, "Task Updated Successfully", updatedTask);
    } catch (error) {
      handleError(res, error, next);
    }
  };

  deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.user?.id);
      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: missing user ID in token" });
        return;
      }

      const id = Number(req.params.id);

      const task = await this._taskService.getTaskById(id);

      if (task?.userId !== userId) {
        res
          .status(403)
          .json({ message: "Forbidden: you cannot Delete this task" });
        return;
      }

      await this._taskService.deleteTaskById(id);
      handleSuccess(res, 204);
    } catch (error) {
      handleError(res, error, next);
    }
  };
}
