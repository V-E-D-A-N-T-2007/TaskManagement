import { Router } from "express";
import { 
    createTask,
} from "../controllers/tasks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router({mergeParams:true})

router.route('/create').post(verifyJWT, createTask)

export default router