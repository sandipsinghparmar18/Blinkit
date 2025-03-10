import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
})
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from 'helmet';
import connectDb from "./config/connectDb.js";

const app = express();
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL
}))
app.use(express.json());
app.use(cookieParser());
//app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy:false
}))


app.get("/", (req, res) => {
    res.send("Hello from server!");
})

// Connect to MongoDB
connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDb Connection Failed",err)
})