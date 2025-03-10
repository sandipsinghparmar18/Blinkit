import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import verifyEmailTemplate from "../utils/verifyEmailtemplate.js";

const registerUser= async (req,res)=>{
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
};

export{
    registerUser
}