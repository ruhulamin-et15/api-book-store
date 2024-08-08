const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, forgetPasswordKey, clientURL } = require("../secret");
const { findUserById } = require("../services");
const { emailWithNodeMail } = require("../helper/email");

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
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "15m");
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000, //15min
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "user login successfully",
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

const updatePassword = async (req, res, next) => {
  const userId = req.params.id;
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await findUserById(userId);
    const isEmailMatch = user.email === email;
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    const updates = { password: newPassword, new: true };

    if (isSamePassword) {
      throw createError(401, "your new password is same to old password");
    } else if (!isEmailMatch) {
      throw createError(
        404,
        "your email is incorrect!, please enter a correct email"
      );
    } else if (!isPasswordMatch) {
      throw createError(
        404,
        "your old password is incorrect!, please enter correct password"
      );
    }

    await Users.findByIdAndUpdate(userId, updates);

    return successResponse(res, {
      statusCode: 200,
      message: "user password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      throw createError(404, "user not found with this email");
    }
    //send mail
    const token = createJSONWebToken({ email }, forgetPasswordKey, "10m");

    //prepare email
    const emailData = {
      email,
      subject: "Reset password",
      html: `
      <h2>Hello ${user.name}</h2>
      <p>Please click here to link <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">reset your password</a></p>
      `,
    };

    //send email with nodemailer
    try {
      await emailWithNodeMail(emailData);
    } catch (error) {
      console.log(error);
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for reset your password`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  try {
    if (!token) {
      throw createError(404, "token not found");
    }
    const decoded = jwt.verify(token, forgetPasswordKey);
    const user = await Users.findOne({ email: decoded.email });
    const updates = { password: newPassword, new: true };

    await Users.findByIdAndUpdate(user._id, updates);
    return successResponse(res, {
      statusCode: 200,
      message: "user password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  logoutUser,
  updatePassword,
  forgetPassword,
  resetPassword,
};
