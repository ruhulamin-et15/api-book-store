const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../models/usersModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodeMail } = require("../helper/email");
const { findUserById } = require("../services");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    const users = await Users.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await Users.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "no users found!");

    return successResponse(res, {
      statusCode: 200,
      message: "users were return successfully",
      payload: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  const userId = req.params.id;
  const options = { password: 0 };
  try {
    const user = await findUserById(userId, options);
    return successResponse(res, {
      statusCode: 200,
      message: "user return successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  try {
    if (!req.file) {
      throw createError(404, "user avatar is required");
    }
    const userAvatar = `public/images/users/${req.file.originalname}`;

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
      avatar: userAvatar,
    };
    const existEmail = await Users.findOne({ email: email });
    if (existEmail) {
      throw createError(409, "email already exist! please login");
    }

    //create jwt
    const token = createJSONWebToken(newUser, jwtActivationKey, "10m");

    //prepare email
    const emailData = {
      email,
      subject: "account activation mail",
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to link <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p>
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
      message: `please go to your ${email} for completing your registration process`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  const { token } = req.body;
  try {
    if (!token) {
      throw createError(404, "token not found");
    }

    const decoded = jwt.verify(token, jwtActivationKey);
    console.log(decoded);
    const existEmail = await Users.findOne({ email: decoded.email });

    if (existEmail) {
      throw createError(409, "email already exist, please login");
    }

    const user = await Users.create(decoded);

    return successResponse(res, {
      statusCode: 201,
      message: "user created successfull",
      payload: user,
    });
  } catch (error) {
    next(error);
  }
};

//all user can be update them
const updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { name, phone, address } = req.body;

  try {
    if (!req.file) {
      throw createError(404, "user avatar is required");
    }
    const userAvatar = `public/images/users/${req.file.originalname}`;

    const updatedUser = {
      name,
      phone,
      address,
      avatar: userAvatar,
    };
    await findUserById(userId);
    await Users.findByIdAndUpdate(userId, updatedUser, { new: true });
    return successResponse(res, {
      statusCode: 200,
      message: "user updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    await findUserById(userId);
    await Users.findByIdAndDelete(userId);
    return successResponse(res, {
      statusCode: 200,
      message: "user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const manageUserStatus = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await findUserById(userId);
    const options = { new: true };
    const updateToBan = { isBanned: true };
    const updateToUnban = { isBanned: false };

    if (user.isBanned === false) {
      await Users.findByIdAndUpdate(userId, updateToBan, options);
      return successResponse(res, {
        statusCode: 200,
        message: "user was banned successfully",
      });
    } else {
      await Users.findByIdAndUpdate(userId, updateToUnban, options);
      return successResponse(res, {
        statusCode: 200,
        message: "user was unbanned successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

const manageAdminStatus = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await findUserById(userId);
    const options = { new: true };
    const adminTrue = { isAdmin: true };
    const adminFalse = { isAdmin: false };

    if (user.isAdmin === false) {
      await Users.findByIdAndUpdate(userId, adminTrue, options);
      return successResponse(res, {
        statusCode: 200,
        message: "user updated to Admin successfully",
      });
    } else {
      await Users.findByIdAndUpdate(userId, adminFalse, options);
      return successResponse(res, {
        statusCode: 200,
        message: "updated to normal user successfully",
      });
    }
  } catch (error) {
    next(error);
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

module.exports = {
  getUsers,
  getSingleUser,
  processRegister,
  verifyUser,
  updateUser,
  deleteUser,
  manageUserStatus,
  manageAdminStatus,
  updatePassword,
};
