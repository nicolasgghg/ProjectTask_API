import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";
import { UserRepository } from "../repositories/user.repositories";
import bcrypt from "bcrypt";
import * as jose from "jose";

declare module 'express-serve-static-core' {
  interface Request {
    user?: jose.JWTPayload
  }
}

export class UserService {
  private _userRepository = new UserRepository();
  private hashSaltRounds = 10;

  async createUser(data: CreateUserDto) {
    await this.ensureUserDoesNotExistByEmail(data.email);

    const password = await this.generateHash(data.password);

    return await this._userRepository.createUser({ ...data, password });
  }

  // async getAllUsers() {
  //     return await this._userRepository.findManyUsers()
  // }

  async getUserById(id: number) {
    await this.ensureUserExistById(id);
    return await this._userRepository.findUserById(id);
  }

  async updateUserById(id: number, data: UpdateUserDto) {
    await this.ensureUserExistById(id);
    return await this._userRepository.updateUserById(id, data);
  }

  // async deleteUserById(id: number) {
  //     await this.ensureUserExistById(id)
  //     return await this._userRepository.deleteUserById(id)
  // }

  async ensureUserExistById(id: number) {
    const user = await this._userRepository.findUserById(id);
    if (!user) throw new Error("User was not found");
  }

  async authenticateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    await this.verifyHash(password, user.password);

    const payload = { id: user.id, email: user.email };
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );
    const alg = "HS256";

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(`http://localhost:3000`)
      .setSubject("user")
      .setExpirationTime("1h")
      .sign(secret);

    return token;
  }

  private async ensureUserDoesNotExistByEmail(email: string) {
    const existingUser = await this._userRepository.findUserByEmail(email);
    if (existingUser) throw new Error("Email already in use");
  }

  private async generateHash(word: string) {
    return await bcrypt.hash(word, this.hashSaltRounds);
  }

  private async verifyHash(word: string, hashedPassword: string) {
    const comparePasswords = await bcrypt.compare(word, hashedPassword);
    if (!comparePasswords) throw new Error("Incorrect password");
    return comparePasswords;
  }

  private async getUserByEmail(email: string) {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) throw new Error("User was not found");
    return user;
  }
}
