const createError = require("http-errors");
const Authors = require("../models/authorsModel");
const { successResponse } = require("./responseController");

const getAuthors = async (req, res, next) => {
  try {
    const authors = await Authors.find().populate("books");
    if (authors.length === 0) {
      throw createError(404, "auhtors not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "authors were return successfully",
      payload: { authors },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleAuthor = async (req, res, next) => {
  const id = req.params.id;
  try {
    const author = await Authors.findById(id);
    if (!author) {
      throw createError(404, "author not found with this id");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "author is return successfully",
      payload: { author },
    });
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  const { email } = req.body;
  try {
    const emailExist = await Authors.findOne({ email: email });
    if (emailExist) {
      throw createError(409, "this email already use another author!");
    }
    const author = await Authors.create(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: "author created successfully",
      payload: { author },
    });
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  const id = req.params.id;
  const { name, bio, birthdate } = req.body;
  try {
    const findAuthor = await Authors.findById(id);
    if (!findAuthor) {
      throw createError(404, "author not found this id");
    }
    await Authors.findByIdAndUpdate(id, req.body);
    return successResponse(res, {
      statusCode: 200,
      message: "author updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  const id = req.params.id;
  try {
    const findAuthor = await Authors.findById(id);
    if (!findAuthor) {
      throw createError(404, "author not found with this id");
    }
    await Authors.findByIdAndDelete(id);
    return successResponse(res, {
      statusCode: 200,
      message: "author deleted successfully",
      payload: findAuthor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
};
