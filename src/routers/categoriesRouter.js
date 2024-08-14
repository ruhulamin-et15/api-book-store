const { Router } = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", isLoggedIn, isAdmin, createCategory);
categoriesRouter.put("/categories/:id", isLoggedIn, isAdmin, updateCategory);
categoriesRouter.delete("/categories/:id", isLoggedIn, isAdmin, deleteCategory);

module.exports = { categoriesRouter };
