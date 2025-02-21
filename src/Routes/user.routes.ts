import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { auth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dtos";

const router = Router();

const users = new UserController();

router.post("/authenticate", users.authenticateUser);
router.post("/", validate(CreateUserDto), users.createUser);
// router.get('/', auth, users.getAllUsers)
router.get("/me", auth, users.getUserById);
router.patch("/me", auth, validate(UpdateUserDto), users.updateUserById);
// router.delete('/:id', users.deleteUserById)

export default router;
