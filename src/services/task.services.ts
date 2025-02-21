import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dtos";
import { TaskRepository } from "../repositories/task.repositories";
import { UserService } from "./user.services";

export class TaskService {
  private _taskRepository = new TaskRepository();
  private _userService = new UserService();

  async createTask(data: CreateTaskDto) {
    await this._userService.ensureUserExistById(data.userId);

    await this.maxTaskForUser(data.userId);

    return await this._taskRepository.createTask(data);
  }

  async getAllTasksByUser(userId: number) {
    return await this._taskRepository.findManyActiveTaskByUserId(userId);
  }

  async getTaskById(id: number) {
    await this.ensureTaskExistById(id);
    return await this._taskRepository.findTaskById(id);
  }

  async updateTaskById(id: number, data: UpdateTaskDto) {
    await this.ensureTaskExistById(id);
    return await this._taskRepository.updateTaskById(id, data);
  }

  // async deleteTaskById(id: number) {
  //     await this.ensureTaskExistById(id)
  //     return await this._taskRepository.deleteTaskById(id);
  // }

  async deleteTaskByDeactivatingById(id: number) {
    await this.ensureTaskIsNotDeletedById(id);
    return await this._taskRepository.updateTaskById(id, { isActive: false });
  }

  private async ensureTaskIsNotDeletedById(id: number) {
    const task = await this._taskRepository.findTaskById(id);
    if (!task) throw new Error("The task was not found");
    if (!task.isActive) throw new Error("The task is already deactivated");
  }

  private async ensureTaskExistById(id: number) {
    const task = await this._taskRepository.findTaskById(id);
    if (!task) throw new Error("The task was not found");
  }

  private async getUserTasksCount(userId: number) {
    return await this._taskRepository.countActiveTaskByUserId(userId);
  }

  private async maxTaskForUser(userId: number) {
    const taskLimitUser = 10;
    const userTasksCount = await this.getUserTasksCount(userId);
    if (userTasksCount >= taskLimitUser) {
      throw new Error(`User cannot have more than ${taskLimitUser} tasks`);
    }
  }
}
