import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { AppError } from "../Errors/AppError";
import { TaskRepository } from "../Repositories/tasks.repository";
import { UserService } from "./user.service";


export class TaskService {
    private _taskRepository = new TaskRepository
    private _userService = new UserService

    async createTask(data: CreateTaskDto) {

        await this._userService.ensureUserExistById(data.userId)

        await this.maxTaskForUser(data.userId)

        return await this._taskRepository.create(data);
    }

    async getAllTasksByUser(userId:number) {
        return await this._taskRepository.findManyByUserId(userId);
    }

    async getTaskById(id: number) {
        await this.taskExist(id)
        return await this._taskRepository.findById(id);
    }

    async updateTaskById(id: number, data: UpdateTaskDto) {
        await this.taskExist(id)
        return await this._taskRepository.updateById(id, data);
    }

    async deleteTaskById(id: number) {
        await this.taskExist(id)
        return await this._taskRepository.deleteById(id);
    }

    private async taskExist(id: number) {
        const task = await this._taskRepository.findById(id)
        if (!task) throw new AppError("task not found", 404, "TASK_NOT_FOUND")
    }

    private async getUserTasksCount(userId: number) {
        return await this._taskRepository.countTaskByUserId(userId)
    }

    private async maxTaskForUser(userId: number) {
        const taskLimitUser = 10
        const userTasksCount = await this.getUserTasksCount(userId)
        if (userTasksCount >= taskLimitUser) {
            throw new AppError(`User cannot have more than ${taskLimitUser} tasks`, 400, "LIMIT_TASKS_FOR_USER")
        }
    }
}