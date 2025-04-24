import { NextFunction, Request, Response } from "express";
import { UserService } from "../Services/user.service";
import { handleSuccess, handleError } from "./handlesControllers";
import { AppError } from "../Errors/AppError";
import { JWTPayload } from "jose";

declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
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
      handleSuccess(res, 200, "Created Successfully", {
        ...dataUser,
        password: undefined,
      });
    } catch (error) {
      handleError(res, error, next);
    }
  };

  getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this._userService.getAllUsers();
      handleSuccess(res, 200, "Success", data);
    } catch (error) {
      handleError(res, error, next);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = await this._userService.getUserById(id, req);
      handleSuccess(res, 200, "Success", data);
    } catch (error) {
      handleError(res, error, next);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    const data = (req.body = {
      ...req.body,
      id: Number(req.user?.id as number),
    });
    try {
      const updatedUserData = await this._userService.updateUserById(data);
      handleSuccess(res, 200, "User Updated Successfully", updatedUserData);
    } catch (error) {
      handleError(res, error, next);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._userService.deleteUserById(req);
      handleSuccess(res, 204);
    } catch (error) {
      handleError(res, error, next);
    }
  };

  authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        throw new AppError(
          "E-mail and Password is mandatory",
          202,
          "INVALID_DATA"
        );
      const token = await this._userService.authenticateUser(email, password);
      return handleSuccess(res, 200, "Authentication Successful", { token });
    } catch (error) {
      handleError(res, error, next);
    }
  };

  authenticateUserByToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new AppError("Authorization header missing", 401, "Missing Date");
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        throw new AppError("Token is missing", 401, "Missing Date");
      }

      const result = await this._userService.authenticateUserByToken(token);

      handleSuccess(res, 200, "User authenticated by token", { result });
    } catch (error) {
      handleError(res, error, next);
    }
  };
}
