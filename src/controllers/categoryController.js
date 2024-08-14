const createHttpError = require("http-errors");
const Categories = require("../models/categoryModel");
const { successResponse } = require("./responseController");

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

module.exports = { getCategories };
