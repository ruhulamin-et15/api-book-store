const { Router } = require("express");
const {
  getUsers,
  processRegister,
  verifyUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const upload = require("../middlewares/uploadFile");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");

const usersRouter = Router();

//private route
usersRouter.get("/users", isLoggedIn, getUsers);
usersRouter.delete("/users/:id", isLoggedIn, deleteUser);
usersRouter.put("/users/:id", upload.single("avatar"), isLoggedIn, updateUser);

//public route
usersRouter.get("/users/:id", getSingleUser);
usersRouter.post(
  "/users/process-register",
  upload.single("avatar"),
  isLoggedOut,
  processRegister
);
usersRouter.post("/users/verify", isLoggedOut, verifyUser);

module.exports = { usersRouter };
