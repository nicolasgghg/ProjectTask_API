import { Router } from "express";
import { UserController } from "../Controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { auth } from "../middlewares/auth.middleware";

const router = Router()

const users = new UserController();

router.post('/authenticate', users.authenticateUser)
router.get('/authenticateByToken', users.authenticateUserByToken)
router.post('/', validate(CreateUserDto), users.createUser)
// router.get('/', auth, users.getAllUsers)
router.get('/:id', auth, users.getUserById)
router.patch('/:id', validate(UpdateUserDto), auth, users.updateUserById)
router.delete('/:id', auth, users.deleteUserById)

export default router;