const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");
const Users = require("../models/usersModel");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw createError(404, "access token not found, please sign in");
    }
    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "invalid access token, please login again");
    }
    req.userId = decoded.user._id; //this is optional, same as req.params.user when get user from params
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (accessToken) {
      const decoded = jwt.verify(accessToken, jwtAccessKey);
      try {
        if (decoded) {
          throw createError(404, "user is already logged in");
        }
      } catch (error) {
        throw error;
      }
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.userId);
    if (!user.isAdmin) {
      throw createError(403, "forbidden, you must be an admin to access");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
  isAdmin,
};
