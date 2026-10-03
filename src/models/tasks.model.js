import mongoose from "mongoose";

const tasksScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        lowercase: true,
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    dueDate: {
        type: Date
    }

}, {timestamps: true})

export const Tasks = mongoose.model("Tasks", tasksScheme)