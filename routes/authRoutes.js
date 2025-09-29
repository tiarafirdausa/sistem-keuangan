const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/rateLimiter");

router.post("/register", controller.register);
router.post("/login", loginLimiter, controller.login); // 🔐 Rate limiter khusus login

module.exports = router;
