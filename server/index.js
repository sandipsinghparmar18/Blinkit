import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDb from "./config/connectDb.js";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
//app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//import Routers
import userRouter from "./routes/user.route.js";
import categoryRoute from "./routes/category.route.js";
import subCategoryRoute from "./routes/subCategory.route.js";

//use Routers
app.use("/api/user", userRouter);
app.use("/api/category", categoryRoute);
app.use("/api/subcategory", subCategoryRoute);

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

// Error Handling

app.use(errorHandler);
// Connect to MongoDB
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb Connection Failed", err);
  });
