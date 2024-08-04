const { Router } = require("express");
const {
  getAuthors,
  createAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");
const { getBooksByAuthor } = require("../controllers/booksController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const authorsRouter = Router();

//public route
authorsRouter.get("/authors/:id", getSingleAuthor);
authorsRouter.get("/authors/:id/books", getBooksByAuthor);

//private route
authorsRouter.get("/authors", isLoggedIn, isAdmin, getAuthors);
authorsRouter.post("/authors", isLoggedIn, isAdmin, createAuthor);
authorsRouter.put("/authors/:id", isLoggedIn, isAdmin, updateAuthor);
authorsRouter.delete("/authors/:id", isLoggedIn, isAdmin, deleteAuthor);

module.exports = { authorsRouter };
