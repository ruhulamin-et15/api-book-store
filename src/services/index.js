const createError = require("http-errors");
const Users = require("../models/usersModel");

const findUserById = async (id, options = {}) => {
  try {
    const user = await Users.findById(id, options);
    if (!user) {
      throw createError(404, "user not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { findUserById };
