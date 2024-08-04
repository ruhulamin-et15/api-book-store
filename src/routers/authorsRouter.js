const { Router } = require("express");
const {
  getAuthors,
  createAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");
const { getBooksByAuthor } = require("../controllers/booksController");
const { isLoggedIn } = require("../middlewares/auth");

const authorsRouter = Router();

//public route
authorsRouter.get("/authors/:id", getSingleAuthor);
authorsRouter.get("/authors/:id/books", getBooksByAuthor);

//private route
authorsRouter.get("/authors", isLoggedIn, getAuthors);
authorsRouter.post("/authors", isLoggedIn, createAuthor);
authorsRouter.put("/authors/:id", isLoggedIn, updateAuthor);
authorsRouter.delete("/authors/:id", isLoggedIn, deleteAuthor);

module.exports = { authorsRouter };
