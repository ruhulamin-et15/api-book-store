const { Router } = require("express");
const {
  getBooks,
  createBook,
  getSingleBook,
  updateBook,
  deleteBook,
  getBooksByAuthor,
} = require("../controllers/booksController");
const { isLoggedIn } = require("../middlewares/auth");

const booksRouter = Router();

booksRouter.get("/books", getBooks);
booksRouter.get("/books/:id", getSingleBook);
booksRouter.get("/books/author/:id", getBooksByAuthor);
booksRouter.post("/books", isLoggedIn, createBook);
booksRouter.put("/books/:id", isLoggedIn, updateBook);
booksRouter.delete("/books/:id", isLoggedIn, deleteBook);

module.exports = { booksRouter };
