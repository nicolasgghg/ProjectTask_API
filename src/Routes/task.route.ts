import { Router } from "express";
import { taskController } from "../Controllers/task.controller";

const router = Router()

const tasks = new taskController();

router.post('/:userId', tasks.createTask);
router.get('/', tasks.getAllTasks)
router.get('/:id', tasks.getTaskById)
router.patch('/:userId/:id', tasks.updateTaskById)
router.delete('/:id', tasks.deleteTaskById)


export default router;