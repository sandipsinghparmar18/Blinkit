import { Router } from "express"
import {
    registerUser,
    verifyEmail,
    login,
    logout
} from "../controllers/user.controller.js"
import {auth} from "../middleware/auth.js";

const userRouter=Router();

userRouter.post('/register',registerUser);
userRouter.post("/verify-email",verifyEmail);
userRouter.post('/login',login);
userRouter.post('/logout',auth,logout);


export default userRouter; 