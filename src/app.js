const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const { authorsRouter } = require("./routers/authorsRouter");
const { errorResponse } = require("./controllers/responseController");
const { booksRouter } = require("./routers/booksRouter");
const { usersRouter } = require("./routers/usersRouter");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//router point
app.use("/api", authorsRouter);
app.use("/api", booksRouter);
app.use("/api", usersRouter);

//client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

//api handling all errors
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;
