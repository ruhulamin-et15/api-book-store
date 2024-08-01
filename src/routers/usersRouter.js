const { Router } = require("express");
const {
  getUsers,
  processRegister,
  verifyUser,
  getSingleUser,
  updateUser,
} = require("../controllers/usersController");
const upload = require("../middlewares/uploadFile");

const usersRouter = Router();

usersRouter.get("/users", getUsers);
usersRouter.get("/users/:id", getSingleUser);
usersRouter.post(
  "/users/process-register",
  upload.single("avatar"),
  processRegister
);
usersRouter.post("/users/verify", verifyUser);
usersRouter.put("/users/:id", updateUser);

module.exports = { usersRouter };
