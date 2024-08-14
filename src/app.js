//external imports
const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//internal imports
const { authorsRouter } = require("./routers/authorsRouter");
const { errorResponse } = require("./controllers/responseController");
const { booksRouter } = require("./routers/booksRouter");
const { usersRouter } = require("./routers/usersRouter");
const { authRouter } = require("./routers/authRouter");
const { categoriesRouter } = require("./routers/categoriesRouter");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//router point
app.use("/api", authorsRouter);
app.use("/api", booksRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/api", categoriesRouter);

//client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

//api handling all errors
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
