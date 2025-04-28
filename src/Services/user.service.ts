import { Request } from "express";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { AppError } from "../Errors/AppError";
import { UserRepository } from "../Repositories/user.repository";
import bcrypt from "bcrypt";
import * as jose from "jose";

export class UserService {
  private _userRepository = new UserRepository();
  private hashSaltRounds = 10;

  async createUser(data: CreateUserDto) {
    await this.ensureUserDoesNotExistByEmail(data.email);

    const password = await this.generateHash(data.password);

    return await this._userRepository.create({ ...data, password });
  }

  async getAllUsers() {
    return await this._userRepository.findMany();
  }

  async getUserById(id: number, req: Request) {
    await this.ensureUserExistById(id);

    const userFromToken = req.user;
    this.userIsUser(id, Number(userFromToken?.id));

    return await this._userRepository.findById(id);
  }

  async updateUserById(data: UpdateUserDto) {

    if (data.password) data.password = await this.generateHash(data.password);

    return await this._userRepository.updateById(data);
  }

  async deleteUserById(userId: number) {
    await this.ensureUserExistById(userId);
  
    return await this._userRepository.deleteById(userId);
  }
  
  

  async ensureUserExistById(id: number) {
    const user = await this._userRepository.findById(id);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  async userIsUser(id: number, userByToken: number) {
    if (id !== userByToken) throw new AppError("Operation not allowed");
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
      .setSubject("users")
      .setExpirationTime("1h")
      .sign(secret);

    return token;
  }

  async authenticateUserByToken(token: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const userId = payload.id;

    if (!userId) {
      throw new Error("Invalid token: no user ID");
    }

    const userData = await this.getUserByIdForToken(Number(userId));

    return {...userData, password:null};
  }

  private async getUserByIdForToken(id: number) {
    await this.ensureUserExistById(id);

    return await this._userRepository.findById(id);
  }

  private async ensureUserDoesNotExistByEmail(email: string) {
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser)
      throw new AppError("Email already in use", 409, "EMAIL_ALREADY_IN_USE");
  }

  private async generateHash(word: string) {
    return await bcrypt.hash(word, this.hashSaltRounds);
  }

  private async verifyHash(word: string, hashedPassword: string) {
    const comparePasswords = await bcrypt.compare(word, hashedPassword);
    if (!comparePasswords)
      throw new AppError("Password incorrect", 400, "PASSWORD_INCORRECT");
    return comparePasswords;
  }

  private async getUserByEmail(email: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    return user;
  }
}
