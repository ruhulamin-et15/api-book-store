const { Router } = require("express");
const { getCategories } = require("../controllers/categoryController");

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);

module.exports = { categoriesRouter };
