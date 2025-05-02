import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import task from "../Entities/tasks.entity";

export class TaskRepository {
  async create(data: CreateTaskDto) {
    return await task.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
        completed: data.completed,
      },
    });
  }

  async countTaskByUserId(userId: number) {
    return await task.count({
      where: {
        userId: userId,
      },
    });
  }

  async findMany() {
    return await task.findMany();
  }

  async findManyForUser(userId: number) {
    return await task.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findById(id: number) {
    return await task.findUnique({
      where: { id },
    });
  }

  async updateById(id: number, data: UpdateTaskDto) {
    return await task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        completed: data.completed,
      },
    });
  }

  async deleteById(id: number) {
    return await task.delete({
      where: { id },
    });
  }
}
