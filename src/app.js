import express from "express";
import "dotenv/config"
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import projectRouter from "./routes/project.routes.js"
import tasksRouter from "./routes/tasks.routes.js"

const app = new express()

app.use(express.json({limit: "16kb"}))
app.use(cookieParser())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/project', projectRouter)
app.use('/api/v1/project/:projectID/tasks', tasksRouter)
export { app }