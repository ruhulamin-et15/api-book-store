const createError = require("http-errors");
const Users = require("../models/usersModel");
const { default: mongoose } = require("mongoose");
const Categories = require("../models/categoryModel");

const findUserById = async (id, options = {}) => {
  try {
    const user = await Users.findById(id, options);
    if (!user) {
      throw createError(404, "user not found with this id");
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "user not found!");
    }
    throw error;
  }
};

const findCatById = async (id) => {
  try {
    const category = await Categories.findById(id);
    if (!category) {
      throw createError(404, "category not found with this id");
    }
    return category;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "category not found!");
    }
    throw error;
  }
};

module.exports = { findUserById, findCatById };
