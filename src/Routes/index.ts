import { Router } from "express";
import users from "./user.routes"
import tasks from "./task.routes"

const router = Router()

router.use('/user', users)
router.use('/task', tasks)

export default router