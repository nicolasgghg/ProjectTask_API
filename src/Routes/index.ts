import { Router } from "express";
import users from "./user.route"
import tasks from "./task.route"


const router = Router()

router.use('/user', users)
router.use('/task', tasks)

export default router