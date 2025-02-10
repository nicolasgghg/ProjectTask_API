import { Router } from "express";
import { TaskController } from "../Controllers/task.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { auth } from "../middlewares/auth.middleware";


const router = Router()
const tasks = new TaskController();

router.use(auth);

router.post('/', validate(CreateTaskDto), tasks.createTask);
router.get('/', tasks.getAllTasksByUser)
router.get('/:id', tasks.getTaskById)
router.patch('/:id', validate(UpdateTaskDto), tasks.updateTaskById)
router.delete('/:id', tasks.deleteTaskById)


export default router;