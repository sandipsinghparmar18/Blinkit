import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import verifyEmailTemplate from "../utils/verifyEmailtemplate.js";
import {generateAccessToken,generateRefreshToken} from "../utils/generateAccessAndRefreshToken.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemp from "../utils/forgotPasswordtemp.js"
import jwt from "jsonwebtoken"

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

const uploadAvatar=asyncHandler(async(req, res)=>{
    const avatarLocalPath=req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(500, "Failed to upload avatar to cloudinary");
    }
    //take old avatar from db and delete it from cloudinary
    const existinguser=await UserModel.findById(req.user?._id).select("avatar");
    const oldavatar=existinguser?.avatar;
    const deleteResponse=await deleteFromCloudinary(oldavatar);
    //console.log("deleteResponse",deleteResponse);

    const user=await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password -refresh_token")

    return res.status(200).json(
        new ApiResponse(200, "Avatar uploaded successfully", user)
    )
});

const updateUserProfile=asyncHandler(async(req, res)=>{
    try {
        const {name,email,mobile}=req.body;
        if(!name &&!email &&!mobile){
            throw new ApiError(400, "At least one field is required");
        }
        const updateUser=await UserModel.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    ...(name && {name:name}),
                    ...(email && {email:email.toLowerCase()}),
                    ...(mobile && {mobile:mobile})
                }
            },
            {
                new: true
            }
        )
        return res.status(200).json(
            new ApiResponse(200, "User profile updated successfully", updateUser)
        )
    } catch (error) {
        throw new ApiError(500,error.message || "Inernal server error");
    }
})

const chnangePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=await UserModel.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid old password");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200).json(
        new ApiResponse(200, "Password changed successfully")
    )
})

const forgotPassword=asyncHandler(async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            throw new ApiError(400, "Email is required");
        }
        const user=await UserModel.findOne({email:email.toLowerCase()});
        if(!user){
            throw new ApiError(404, "User not found");
        }
        const otp=generateOtp();
        const expireTime=new Date(Date.now() + 60 * 60 * 1000);// 1hour
        user.forgot_password_otp=otp;
        user.forgot_password_expiry=expireTime.toISOString();
        await user.save({validateBeforeSave:false});

        await sendEmail({
            sendTo:email.toLowerCase(),
            subject:"Reset Password",
            html:forgotPasswordTemp({
                name: user.name,
                otp,
                expireTime
            })
        })
    
        return res.status(200).json(
            new ApiResponse(200, "Password reset link sent to your email")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error");
    }
});

const verifyForgotPasswordOtp=asyncHandler(async(req,res)=>{
    try {
        const {email, otp}=req.body;
        if(!email ||!otp){
            throw new ApiError(400, "Code and OTP are required");
        }
        const user=await UserModel.findOne({email:email.toLowerCase()});
        if(!user){
            throw new ApiError(404, "User not found");
        }
        if(user.forgot_password_expiry < new Date().toISOString()){
            throw new ApiError(401, "OTP expired");
        }
        if(user.forgot_password_otp !== otp){
            throw new ApiError(401, "Invalid OTP");
        }
        user.forgot_password_otp=null;
        user.forgot_password_expiry=null;
        await user.save({validateBeforeSave:false});
        return res.status(200).json(
            new ApiResponse(200, "otp verify successfully")
        )
        
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error");
    }
})

const resetPassword=asyncHandler(async(req,res)=>{
    try {
        const {email, newPassword}=req.body;
        if(!email ||!newPassword){
            throw new ApiError(400, "Email and new password are required");
        }
        const user=await UserModel.findOne({email:email.toLowerCase()});
        if(!user){
            throw new ApiError(404, "User not found");
        }
        user.password=newPassword;
        await user.save({validateBeforeSave:false});
        return res.status(200).json(
            new ApiResponse(200, "Password reset successful")
        )
    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error");
    }
})

const refreshToken=asyncHandler(async(req,res)=>{
    try {
        const refreshToken=req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];
        if(!refreshToken){
            throw new ApiError(401, "Refresh token is required");
        }
        const data=jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user=await UserModel.findById(data._id);
        if(!user){
            throw new ApiError(404, "User not found");
        }
        const accessToken=await generateAccessToken(user._id);
        const cookieOption={
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'None' : 'Lax'
        }
        return res
            .status(200)
            .cookie('accessToken', accessToken, cookieOption)
            .json(
            new ApiResponse(200, "User logged in successfully",{accessToken})
        )
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            throw new ApiError(401, "Refresh token expired");
        }
        throw new ApiError(500, error.message || "Internal server error");
    }
})

export{
    registerUser,
    verifyEmail,
    login,
    logout,
    uploadAvatar,
    updateUserProfile,
    chnangePassword,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    refreshToken
}
