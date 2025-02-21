import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.services";
import handleSuccess from "./handle.controllers";
import * as jose from "jose";

declare module "express-serve-static-core" {
  interface Request {
    user?: jose.JWTPayload;
  }
}

export class UserController {
  private _userService: UserService;

  constructor() {
    this._userService = new UserService();
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      const dataUser = await this._userService.createUser(data);
      handleSuccess(res, 201, "The user was created successfully", {
        ...dataUser,
        password: undefined,
      });
    } catch (error) {
      next(error);
    }
  };

  // getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  //     try {
  //         const data = await this._userService.getAllUsers();
  //         handleSuccess(res, 200, "Success", data);
  //     } catch (error) {
  //         next(error);
  //     }
  // };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = this.ensureTokenExist(req, res);
      if (!userId) return;

      const data = await this._userService.getUserById(Number(userId));

      if (!data) {
        throw new Error("User was not found");
      }
      const { password, ...userWithoutPassword } = data;
      handleSuccess(res, 200, "Success", userWithoutPassword);
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = this.ensureTokenExist(req, res); // Recupera o id do token
    if (!userId) return;

    const data = req.body;
    try {
      const updatedUserData = await this._userService.updateUserById(
        Number(userId),
        data
      );
      handleSuccess(res, 200, "User Updated Successfully", updatedUserData);
    } catch (error) {
      next(error);
    }
  };

  // deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  //     const id = Number(req.params.id);
  //     try {
  //         await this._userService.deleteUserById(id);
  //         handleSuccess(res, 204)
  //     } catch (error) {
  //        next(error);
  //     }
  // };

  authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new Error("E-mail and Password is mandatory");
      const token = await this._userService.authenticateUser(email, password);
      return handleSuccess(res, 200, "Authentication Successful", {
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  private ensureTokenExist(req: Request, res: Response): string | undefined {
    const userId = req.user?.id as string | undefined;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Token is missing" });
      return undefined;
    }

    return userId;
  }
}
