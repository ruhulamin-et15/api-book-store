const { Router } = require("express");
const { loginUser, logoutUser } = require("../controllers/authController");

const authRouter = Router();

authRouter.post("/auth/login", loginUser);
authRouter.post("/auth/logout", logoutUser);

module.exports = { authRouter };
