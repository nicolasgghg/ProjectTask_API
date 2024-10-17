import { AppError } from "../Errors/AppError";
import { IDataTask, TaskRepository } from "../Repositories/tasks.repository";
import { UserService } from "./user.service";


export class TaskService {
    private _taskRepository = new TaskRepository
    private _userService = new UserService

    async createTask(data: IDataTask) {

        await this._userService.userExist(data.userId)

        await this.maxTaskForUser(data.userId)

        return await this._taskRepository.create(data);
    }

    async getAllTasks() {
        return await this._taskRepository.findMany();
    }

    async getTaskById(id: number) {
        await this.taskExist(id)
        return await this._taskRepository.findById(id);
    }

    async updateTaskById(id: number, data: Omit<IDataTask, 'userId'>) {
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