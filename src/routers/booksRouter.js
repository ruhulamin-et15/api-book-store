const { Router } = require("express");
const {
  getBooks,
  createBook,
  getSingleBook,
  updateBook,
  deleteBook,
  getBooksByAuthor,
} = require("../controllers/booksController");

const booksRouter = Router();

booksRouter.get("/books", getBooks);
booksRouter.get("/books/:id", getSingleBook);
booksRouter.get("/books/author/:id", getBooksByAuthor);
booksRouter.post("/books", createBook);
booksRouter.put("/books/:id", updateBook);
booksRouter.delete("/books/:id", deleteBook);

module.exports = { booksRouter };
