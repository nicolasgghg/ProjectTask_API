import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";
import user from "../entities/user.entities";

export class UserRepository {
  async createUser(data: CreateUserDto) {
    return await user.create({ data });
  }

  // async findManyUsers() {
  //   return await user.findMany();
  // }

  async findUserById(id: number) {
    return await user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return await user.findUnique({
      where: { email },
    });
  }

  async updateUserById(id: number, data: UpdateUserDto) {
    return await user.update({
      where: { id },
      data,
    });
  }

  // async deleteById(id: number) {
  //   return await user.delete({
  //     where: { id },
  //   });
  // }
}
