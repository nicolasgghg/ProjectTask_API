import { Router } from "express";
import { taskController } from "../Controllers/task.controller";

const router = Router()

const tasks = new taskController();

router.post('/', tasks.createTask);
router.get('/', tasks.getAllTasks)
router.get('/:id', tasks.getTaskById)
router.patch('/:id', tasks.updateTaskById)
router.delete('/:id', tasks.deleteTaskById)


export default router;