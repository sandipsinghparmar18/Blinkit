import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import verifyEmailTemplate from "../utils/verifyEmailtemplate.js";
import {generateAccessToken,generateRefreshToken} from "../utils/generateAccessAndRefreshToken.js";

const registerUser=asyncHandler(async(req,res)=>{
    try {
        const {name,email,password}= req.body;
        if(!name || !email || !password){
            throw new ApiError(400, "All fields are required");
        }
        const existingUser= await UserModel.findOne({email});
        if(existingUser){
            throw new ApiError(400, "Email already exists");
        }
        const newUser=await UserModel.create({
            name,
            email: email.toLowerCase(),
            password
        })
        if(!newUser){
            throw new ApiError(500, "Failed to create user");
        }
        const user=await UserModel.findById(newUser._id).select("-password");

        const verifyEmailUrl=`${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;

        const verifyEmail= await sendEmail({
            sendTo:email.toLowerCase(),
            subject:"Verify your email",
            html:verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        })

        return res.status(200).json(
            new ApiResponse(201, "User registered successfully", user)
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

const verifyEmail=asyncHandler(async(req,res)=>{
    try {
        const {code}=req.body;
        if(!code){
            throw new ApiError(400, "Code is required");
        }
        const user=await UserModel.findByIdAndUpdate(code, {verify_email:true}, {new:true});
        if(!user){
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(
            new ApiResponse(200, "Email verified successfully")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
});

const login=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new ApiError(400, "Email and password are required");
    }
    const user=await UserModel.findOne({email:email.toLowerCase()});
    if(!user){
        throw new ApiError(404, "User not found");
    }
    if(user.status !== "Active"){
        throw new ApiError(401, "User is not active");
    }
    const isPasswordValid= await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid username or password")
    }
    const accessToken=await generateAccessToken(user._id);
    const refreshToken=await generateRefreshToken(user._id);
    const cookieOption={
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
    
    return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieOption)
        .cookie('accessToken', accessToken, cookieOption)
        .json(
            new ApiResponse(200, "User logged in successfully",{refreshToken,accessToken})
        );
});

const logout=asyncHandler(async(req,res)=>{
    if(!req.user){
        throw new ApiError(401, "User is not logged in");
    }
    await UserModel.findByIdAndUpdate(req.user._id,{
        $unset:{refresh_token:""}
    });

    const options={
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production'? 'None' : 'Lax'
    };
    return res
        .status(200)
        .clearCookie('refreshToken', options)
        .clearCookie('accessToken', options)
        .json(
            new ApiResponse(200, "User logged out successfully")
        );
})

export{
    registerUser,
    verifyEmail,
    login,
    logout
}
