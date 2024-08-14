const createError = require("http-errors");
const Books = require("../models/booksModel");
const { successResponse } = require("./responseController");
const Authors = require("../models/authorsModel");

const getBooks = async (req, res, next) => {
  try {
    const books = await Books.find().populate("author_id");
    if (books.length === 0) {
      throw createError(404, "books not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "books were return successfully",
      payload: { books },
    });
  } catch (error) {
    next(error);
  }
};

const getBooksByAuthor = async (req, res, next) => {
  const id = req.params.id;
  try {
    const books = await Books.find({ author_id: id }).populate("author_id");
    if (books.length === 0) {
      throw createError(404, "books not found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "books were return successfully",
      payload: { books },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleBook = async (req, res, next) => {
  const id = req.params.id;
  try {
    const book = await Books.findById(id).populate("author_id");
    if (!book) {
      throw createError(404, "book not found with this id");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "book is return successfully",
      payload: { book },
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  const { author_id } = req.body;
  try {
    const book = await Books.create(req.body);
    await Authors.findByIdAndUpdate(
      author_id,
      {
        $push: { books: book._id },
      },
      { new: true, useFindAndModify: false }
    );
    return successResponse(res, {
      statusCode: 201,
      message: "book created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  const id = req.params.id;
  try {
    const findBook = await Books.findById(id);
    if (!findBook) {
      throw createError(404, "book not found in db");
    }
    await Books.findByIdAndUpdate(id, req.body);
    return successResponse(res, {
      statusCode: 200,
      message: "book updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  const id = req.params.id;
  try {
    const findBook = await Books.findById(id);
    if (!findBook) {
      throw createError(404, "book not found in db");
    }
    await Books.findByIdAndDelete(id);
    return successResponse(res, {
      statusCode: 200,
      message: "book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  createBook,
  getSingleBook,
  updateBook,
  deleteBook,
  getBooksByAuthor,
};
