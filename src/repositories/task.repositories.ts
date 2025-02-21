import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dtos";
import task from "../entities/task.entities";

export class TaskRepository {
  async createTask(data: CreateTaskDto) {
    return await task.create({ data });
  }

  // async countTaskByUserId(userId: number) {
  //   return await task.count({
  //     where: {
  //       userId,
  //     },
  //   });
  // }

  async countActiveTaskByUserId(userId: number) {
    return await task.count({
      where: {
        userId,
        isActive: true,
      },
    });
  }

  // async findManyTask() {
  //   return await task.findMany();
  // }

  // async findManyTaskByUserId(userId: number) {
  //   return await task.findMany({
  //     where: { userId },
  //   });
  // }

  async findManyActiveTaskByUserId(userId: number) {
    return await task.findMany({
      where: { userId, isActive: true },
    });
  }

  async findTaskById(id: number) {
    return await task.findUnique({
      where: { id },
    });
  }

  async updateTaskById(id: number, data: UpdateTaskDto) {
    return await task.update({
      where: { id },
      data: data,
    });
  }

  // async deleteTaskById(id: number) {
  //   return await task.delete({
  //     where: { id },
  //   });
  // }
}
