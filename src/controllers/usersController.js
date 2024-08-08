const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL } = require("../secret");
const { emailWithNodeMail } = require("../helper/email");

const getUsers = async (req, res, next) => {
  try {
    const users = await Users.find().select("-password");
    if (users.length === 0) {
      throw createError(404, "users not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "users were return successfully",
      payload: { users },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await Users.findById(id).select("-password");
    if (!user) {
      throw createError(404, "user not found");
    }
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

//all user can be update
const updateUser = async (req, res, next) => {
  const id = req.params.id;
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
    const findUser = await Users.findById(id);
    if (!findUser) {
      throw createError(404, "user not found in database");
    }
    await Users.findByIdAndUpdate(id, updatedUser, { new: true });
    return successResponse(res, {
      statusCode: 200,
      message: "user updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const matchUser = await Users.findById(id);
    if (!matchUser) {
      throw createError(404, "user not found!");
    }
    await Users.findByIdAndDelete(id);
    return successResponse(res, {
      statusCode: 200,
      message: "user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const handleBanUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const findUser = await Users.findById(userId);
    if (!findUser) {
      throw createError(404, "user not found");
    }
    const options = { new: true };
    const updates = { isBanned: true };
    await Users.findByIdAndUpdate(userId, updates, options).select("-password");
    return successResponse(res, {
      statusCode: 200,
      message: "user was banned successfully",
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
  handleBanUser,
};
