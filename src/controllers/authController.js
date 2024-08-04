const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const Users = require("../models/usersModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    //find user
    const user = await Users.findOne({ email: email });
    if (!user) {
      throw createError(404, "user not found with this email, please signup");
    }
    //compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "user email/password dont match");
    }
    //banned user check
    if (user.isBanned) {
      throw createError(403, "you are banned, please contact authority");
    }
    //token, cookie
    const accessToken = createJSONWebToken({ email }, jwtAccessKey, "10m");
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000, //15min
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "user login successfully",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    return successResponse(res, {
      statusCode: 200,
      message: "user logout successfully",
    });
  } catch (error) {
    next();
  }
};

module.exports = { loginUser, logoutUser };
