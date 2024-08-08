const createError = require("http-errors");
const Users = require("../models/usersModel");
const { default: mongoose } = require("mongoose");

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

module.exports = { findUserById };
