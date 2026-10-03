import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiReponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

const createProject = asyncHandler(async (req, res) => {
    const {
        name, description
    } = req.body

    if(!name.trim()){
        throw new ApiError(400, "Name of project is required")
    }

    const project = await Project.create({
        name,
        description,
        owner: req.user._id
    })

    res.status(200)
    .json(
        new ApiResponse(200, "Project Created", project)
    )
})

const editProject = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if(!user){
        throw new ApiError(400, "User no longer exists")
    }

    if(user._id.toString() != req.params.projectID.owner._id.toString()){
        throw new ApiError(404, "You are not allowed to edit these project")
    }

    const{
        name, description
    } = req.body

    const updatedProject = await Project.findByIdAndUpdate(
        req.params.projectID,
        {
            $set:{
                name, description
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Project Updated", updatedProject)
    )
})

export {
    createProject
}