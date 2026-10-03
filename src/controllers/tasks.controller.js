import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiReponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Tasks } from "../models/tasks.model.js";
import { Project } from "../models/project.model.js";

const createTask = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.projectID)

    if(!project){
        throw new ApiError(404, "This Project no longer exists")
    }

    if(project.owner._id.toString() != req.user._id.toString()){
        throw new ApiError(404, "You are not allowed to create a task")
    }

    const {
        title, description,status,priority,dueDate
    } = req.body

    if(!title){
        throw new ApiError(404, "Title is required cant create empty tasks")
    }

    const taskCreated = await Tasks.create({
        title,
        description,
        status,
        priority,
        dueDate,
        createdBy: req.user._id,
        project: project._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Task Created", taskCreated)
    )
})


export {
    createTask
}