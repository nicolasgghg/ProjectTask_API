import { IDataTask, TaskRepository } from "../Repositories/tasks.repository";
import { UserRepository } from "../Repositories/user.repository";


export class TaskService {
    private _taskRepository = new TaskRepository
    private _userRepository = new UserRepository

    async createTask(data: IDataTask) {
        
        const userExist = await this._userRepository.findById(data.userId)
        if (!userExist){
            throw new Error("User not found")
        }
        
        return await this._taskRepository.create(data);
    }

    async getAllTasks() {
        return await this._taskRepository.findMany();
    }

    async getTaskById(id:number) {
        return await this._taskRepository.findById(id);
    }

    async updateTaskById(id: number, data: IDataTask) {
        const taskToDelete = await this.getTaskById(id)
        if (!taskToDelete){
            throw new Error("task not found")
        }
        return await this._taskRepository.updateById(id, data);
    }

    async deleteTaskById(id: number) {
        const taskToDelete = await this.getTaskById(id)
        if (!taskToDelete){
            throw new Error("task not found")
        }
        return await this._taskRepository.deleteById(id);
    }
}