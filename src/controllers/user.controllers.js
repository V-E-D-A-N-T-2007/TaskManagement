import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiResponse } from "../utils/ApiReponse.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { User } from "../models/user.model.js";

const generateAccessTokenAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID)

        if(!user){
            throw new ApiError(400, "User Not Found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({
            validateBeforeSave: false
        })

        return {
            accessToken, refreshToken
        }

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh tokens"
        );
    }
}
 
const registerUser = asyncHandler (async (req, res) => {
    const {
        name, email, age, password
    } = req.body

    if([name, email, password].some((field) => !field?.trim())){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{email}]
    })

    if(existingUser){
        throw new ApiError(401, "Email should not be already registered")
    }
    
    const user = await User.create({
        name,
        email,
        age,
        password
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, "User Registered Successfully", user)
    )
})

const loginUser = asyncHandler (async (req, res) => {
    const {
        email, password 
    } = req.body

    if(!(email || password)){
        throw new ApiError(400, "Both field are required to login")
    }

    const user = await User.findOne({
        $or: [{email}]
    })

    if(!user){
        throw new ApiError(404, "Email Id does not exist")
    }
    
    const isPasswordValid = user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404, "Enter valid password")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

    const options = {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie(
        "accessToken",
        accessToken,
        options
    )
    .cookie(
        "refreshToken",
        refreshToken,
        options
    )
    .json(
        new ApiResponse(200, "logged in", {loggedInUser, accessToken, refreshToken})
    )
})

const logoutUser = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
    )

    const cookieOption = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken", cookieOption)
    .clearCookie("refreshToken", cookieOption)
    .json(
        new ApiResponse(200, "User Logged Out")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser
}