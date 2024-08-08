const { Router } = require("express");
const {
  getUsers,
  processRegister,
  verifyUser,
  getSingleUser,
  updateUser,
  deleteUser,
  manageUserStatus,
  manageAdminStatus,
  updatePassword,
} = require("../controllers/usersController");
const upload = require("../middlewares/uploadFile");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const usersRouter = Router();

//private route
usersRouter.get("/users", isLoggedIn, isAdmin, getUsers);
usersRouter.get("/users/:id", isLoggedIn, isAdmin, getSingleUser);
usersRouter.delete("/users/:id", isLoggedIn, isAdmin, deleteUser);
usersRouter.put(
  "/users/:id",
  upload.single("avatar"),
  isLoggedIn,
  isAdmin,
  updateUser
);
usersRouter.put(
  "/users/manage-user/:id",
  isLoggedIn,
  isAdmin,
  manageUserStatus
);
usersRouter.put(
  "/users/admin-status/:id",
  isLoggedIn,
  isAdmin,
  manageAdminStatus
);
usersRouter.put("/users/update-password/:id", isLoggedIn, updatePassword);

//public route
usersRouter.post(
  "/users/process-register",
  upload.single("avatar"),
  isLoggedOut,
  processRegister
);
usersRouter.post("/users/verify", isLoggedOut, verifyUser);

module.exports = { usersRouter };
