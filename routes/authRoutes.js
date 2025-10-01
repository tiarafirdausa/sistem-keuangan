const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../middlewares/rateLimiter");

router.post("/register", controller.register);
router.post("/login", loginLimiter, controller.login);
router.post("/logout", controller.logout);
router.get("/me", verifyToken, controller.getMe);
router.post("/refresh-token", controller.refreshToken);

module.exports = router;
