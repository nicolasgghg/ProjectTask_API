import { Router } from "express";
import users from "./user.route"


const router = Router()

router.use('/user', users)

export default router