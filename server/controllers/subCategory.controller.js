import SubCategoryModel from "../models/subCategory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category[0]) {
    throw new ApiError(400, "All fields are required");
  }
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }
  const imagePath = await uploadOnCloudinary(imageLocalPath);
  if (!imagePath.url) {
    throw new ApiError(500, "Failed to upload image to cloudinary");
  }
  const subCategory = await SubCategoryModel.create({
    name,
    image: imagePath.url,
    category: category,
  });
  if (!subCategory) {
    throw new ApiError(500, "Failed to create subcategory");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, subCategory, "Successfully created subcategory")
    );
});

const getSubCategories = asyncHandler(async (req, res) => {
  try {
    const data = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Successfully retrieved subcategories"));
  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

export { addSubCategory, getSubCategories };
