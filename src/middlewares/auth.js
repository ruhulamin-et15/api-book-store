const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

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
    req.body.userId = decoded._id; //this is optional, same as req.params.id when get id from params
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (accessToken) {
      throw createError(404, "user is already logged in");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
