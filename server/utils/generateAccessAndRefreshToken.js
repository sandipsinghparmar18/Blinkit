import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js";

const generateAccessToken = async(userId)=>{
    const token= await jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
    return token;
}

const generateRefreshToken = async(userId)=>{
    const token= await jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
    const updatedUser= await UserModel.updateOne(
        { _id: userId },
        { refresh_token: token }
    )
    return token;
}


export {
    generateAccessToken,
    generateRefreshToken
}