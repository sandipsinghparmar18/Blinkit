import { Router } from "express"
import {
    registerUser,
    verifyEmail,
    login,
    logout,
    uploadAvatar,
    updateUserProfile,
    chnangePassword
} from "../controllers/user.controller.js"
import {auth} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const userRouter=Router();

userRouter.post('/register',registerUser);
userRouter.post("/verify-email",verifyEmail);
userRouter.post('/login',login);
userRouter.post('/logout',auth,logout);
userRouter.put('/upload-avatar',auth,upload.single("avatar"),uploadAvatar);
userRouter.patch('/update-profile',auth,updateUserProfile);
userRouter.patch('/change-password',auth,chnangePassword);


export default userRouter; 