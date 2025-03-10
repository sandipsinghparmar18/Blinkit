import mongoose from "mongoose";

async function connectDb(){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
    } catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDb;