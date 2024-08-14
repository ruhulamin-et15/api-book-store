//external imports
const createHttpError = require("http-errors");
const slugify = require("slugify");

//internal imports
const Categories = require("../models/categoryModel");
const { successResponse } = require("./responseController");
const { findCatById } = require("../services");

const createCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const slug = slugify(name).toLowerCase();
    const createOptions = { name, slug };
    const isExist = await Categories.findOne({ slug });
    if (isExist) {
      throw createHttpError(401, "this category is already exist!");
    }
    await Categories.create(createOptions);
    return successResponse(res, {
      statusCode: 201,
      message: "category created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    if (categories.length === 0) {
      throw createHttpError(404, "categories not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "categories return successfully",
      payload: { categories },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const catId = req.params.id;
  const { name } = req.body;
  try {
    await findCatById(catId);
    const slug = slugify(name).toLowerCase();
    const updatedOptions = { name, slug };
    const isExist = await Categories.findOne({ slug });
    if (isExist) {
      throw createHttpError(401, "this category is already exist!");
    }
    await Categories.findByIdAndUpdate(catId, updatedOptions);
    return successResponse(res, {
      statusCode: 200,
      message: "category updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const catId = req.params.id;
  try {
    await findCatById(catId);
    await Categories.findByIdAndDelete(catId);
    return successResponse(res, {
      statusCode: 200,
      message: "category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
