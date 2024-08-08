const { Router } = require("express");
const {
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");

const authRouter = Router();

//public route
authRouter.post("/auth/login", isLoggedOut, loginUser);
authRouter.post("/auth/forget-password", forgetPassword);
authRouter.put("/auth/reset-password", resetPassword);

//private route
authRouter.post("/auth/logout", isLoggedIn, logoutUser);
authRouter.put("/auth/update-password/:id", isLoggedIn, updatePassword);

module.exports = { authRouter };
