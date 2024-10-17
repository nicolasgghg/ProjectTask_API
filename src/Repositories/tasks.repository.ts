import task from "../Entities/tasks.entity"

export interface IDataTask {
    title: string
    description: string
    userId: number
}

export class TaskRepository {

    async create(data: IDataTask) {
        return await task.create({
            data: {
                title: data.title,
                description: data.description,
                userId: data.userId,
            }
        })
    }

    async countTaskByUserId(userId: number){
        return await task.count({
            where:{
                userId: userId,
            }
        })
    }

    async findMany() {
        return await task.findMany()
    }

    async findById(id: number) {
        return await task.findUnique({
            where: { id }
        })
    }

    async updateById(id: number, data: Omit<IDataTask, 'userId'>) {
        return await task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
            }
        })
    }

    async deleteById(id: number) {
        return await task.delete({
            where: { id }
        }
        )
    }

}