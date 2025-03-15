import { Router } from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const categoryRoute = Router();
categoryRoute.use(auth);

categoryRoute.post("/addCategory", upload.single("image"), addCategory);
categoryRoute.get("/get", getCategories);
categoryRoute.put(
  "/update/:categoryId",
  upload.single("image"),
  updateCategory
);
categoryRoute.delete("/delete/:categoryId", deleteCategory);
export default categoryRoute;
