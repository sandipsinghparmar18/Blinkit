import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "name must be required");
  }
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }
  const imagePath = await uploadOnCloudinary(imageLocalPath);
  if (!imagePath.url) {
    throw new ApiError(500, "Failed to upload image to cloudinary");
  }
  const category = await CategoryModel.create({
    name,
    image: imagePath.url,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Successfully created category"));
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, categories, "Successfully retrieved categories")
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    throw new ApiError(400, "id is required");
  }

  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const { name } = req.body;
  const imageLocalPath = req?.file?.path;
  let imagePath = null;

  if (imageLocalPath) {
    imagePath = await uploadOnCloudinary(imageLocalPath);
    if (!imagePath?.url) {
      throw new ApiError(500, "Failed to upload image to Cloudinary");
    }
    // Only delete the old image after a successful upload
    if (category?.image) {
      await deleteFromCloudinary(category.image);
    }
  }

  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    category._id,
    {
      $set: {
        name: name || category.name,
        image: imagePath?.url || category.image, // Use existing image if not updated
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedCategory, "Successfully updated category")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    throw new ApiError(400, "id is required");
  }
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  const checkSubCategory = await SubCategoryModel.find({
    category: {
      $in: [category._id],
    },
  }).countDocuments();
  if (checkSubCategory > 0) {
    throw new ApiError(
      400,
      "Cannot delete category with associated subcategories"
    );
  }
  const checkProduct = await ProductModel.find({
    category: {
      $in: [category._id],
    },
  }).countDocuments();
  if (checkProduct > 0) {
    throw new ApiError(400, "Cannot delete category with associated products");
  }
  if (category?.image) {
    await deleteFromCloudinary(category.image);
  }
  await CategoryModel.findByIdAndDelete(categoryId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully deleted category"));
});

export { addCategory, getCategories, updateCategory, deleteCategory };
