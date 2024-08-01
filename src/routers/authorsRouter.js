const { Router } = require("express");
const {
  getAuthors,
  createAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");
const { getBooksByAuthor } = require("../controllers/booksController");

const authorsRouter = Router();

authorsRouter.get("/authors", getAuthors);
authorsRouter.get("/authors/:id", getSingleAuthor);
authorsRouter.get("/authors/:id/books", getBooksByAuthor);
authorsRouter.post("/authors", createAuthor);
authorsRouter.put("/authors/:id", updateAuthor);
authorsRouter.delete("/authors/:id", deleteAuthor);

module.exports = { authorsRouter };
