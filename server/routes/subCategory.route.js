import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  addSubCategory,
  getSubCategories,
} from "../controllers/subCategory.controller.js";

const subCategoryRoute = Router();
subCategoryRoute.use(auth);

subCategoryRoute.post("/upload", upload.single("image"), addSubCategory);
subCategoryRoute.post("/get", getSubCategories);

export default subCategoryRoute;
