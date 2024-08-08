const { Router } = require("express");
const {
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  updatePassword,
  handleRefreshToken,
  handleProtectedRoute,
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");

const authRouter = Router();

//public route
authRouter.post("/auth/login", isLoggedOut, loginUser);
authRouter.post("/auth/forget-password", forgetPassword);
authRouter.put("/auth/reset-password", resetPassword);
authRouter.get("/auth/refresh-token", handleRefreshToken);
authRouter.get("/auth/protected", handleProtectedRoute);

//private route
authRouter.post("/auth/logout", logoutUser);
authRouter.put("/auth/update-password/:id", isLoggedIn, updatePassword);

module.exports = { authRouter };
