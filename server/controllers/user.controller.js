import UserModel from "../models/user.model.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser= async (req,res)=>{
    try {
        const {name,email,password}= req.body;
        if(!name || !email || !password){
            throw new ApiError(400, "All fields are required");
        }
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
}