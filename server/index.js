import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from 'helmet';
import connectDb from "./config/connectDb.js";

const app = express();
app.use(cors({
    credentials:true,
    origin: '*'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy:false
}))

//import Routers 
import userRouter from "./routes/user.route.js";


//use Routers
app.use("/api/user",userRouter);

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