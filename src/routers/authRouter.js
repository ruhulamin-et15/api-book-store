const { Router } = require("express");
const { loginUser, logoutUser } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");

const authRouter = Router();

//public route
authRouter.post("/auth/login", isLoggedOut, loginUser);

//private route
authRouter.post("/auth/logout", isLoggedIn, logoutUser);

module.exports = { authRouter };
