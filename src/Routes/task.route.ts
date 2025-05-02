import { Router } from "express";
import { TaskController } from "../Controllers/task.controller";
import { validate } from "../middlewares/validate.middleware";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { auth } from "../middlewares/auth.middleware";

const router = Router()

const tasks = new TaskController();

router.post('/', auth, validate(CreateTaskDto), tasks.createTask);
// router.get('/', tasks.getAllTasks)
router.get('/:id', auth, tasks.getTaskById)
router.get('/', auth, tasks.getAllTaskByIdUser)
router.patch('/:id', auth, validate(UpdateTaskDto), tasks.updateTaskById)
router.delete('/:id', auth,tasks.deleteTaskById)


export default router;