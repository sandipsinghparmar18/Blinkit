import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Provide name"]
    },
    email:{
        type:String,
        required: [true,"Provide email"],
        unique: true
    },
    password:{
        type:String,
        required: [true,"Provide password"],
        minlength: [8,"Password must be at least 8 characters long"]
    },
    avatar:{
        type: String,
        default: ""
    },
    mobile:{
        type:Number,
        default: null
    },
    refresh_token:{
        type:String,
        default: ""
    },
    verify_email:{
        type:Boolean,
        default: false
    },
    last_login_date:{
        type: Date,
        default:""
    },
    status:{
        type: String,
        enum: ["Active","Inactive","Suspended"],
        default: "Active"
    },
    address_details:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    shopping_cart:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartProduct"
        }
    ],
    orderHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    forgot_password_otp:{
        type: String,
        default: null
    },
    forgot_password_expiry:{
        type: Date,
        default: ""
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
    }
},{timestamps:true})

//yha pr password encrypt krte h
userSchema.pre("save",async function (next) {
    if(! this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10)
    next();
})

//yha pr user enter password check krte h
userSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)
}

const UserModel=mongoose.model("User",userSchema);

export default UserModel;