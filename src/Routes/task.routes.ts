import { Router } from "express";
import { TaskController } from "../controllers/task.controllers";
import { validate } from "../middlewares/validate.middleware";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dtos";
import { auth } from "../middlewares/auth.middleware";

const router = Router();
const tasks = new TaskController();

router.use(auth);

router.post("/", validate(CreateTaskDto), tasks.createTask);

router.get("/me", tasks.getAllTasksByUser);

router.get("/:id", tasks.getTaskById);

router.patch("/:id", validate(UpdateTaskDto), tasks.updateTaskByIdTask);

router.delete("/:id", tasks.deleteTaskById);

export default router;
