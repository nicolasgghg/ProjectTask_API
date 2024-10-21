import { Router } from "express";
import { userController } from "../Controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateUserDto } from "../dtos/user.dto";

const router = Router()

const users = new userController();

router.post('/', validate(CreateUserDto), users.createUser)
router.get('/', users.getAllUsers)
router.get('/:id', users.getUserById)
router.patch('/:id', users.updateUserById)
router.delete('/:id', users.deleteUserById)


export default router;