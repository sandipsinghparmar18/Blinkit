import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware for authenticated users only
export const auth=asyncHandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401, "Not authorized to access this resource");
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        //console.log("Decoded Token",decodedToken);
        const user=await UserModel.findById(decodedToken?._id).select("-password");
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
        req.user=user;
        next();
    } catch (error) {
        console.error("Error in verifyJWT Token",error);
        next(error);
    }
})