const rateLimit = require("express-rate-limit");

// 🔐 Rate limit untuk login (lebih ketat)
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // max 5 percobaan login
  message: { error: "Terlalu banyak percobaan login. Coba lagi setelah 15 menit." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔐 Rate limit global (untuk semua API)
exports.apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // max 100 request per menit per IP
  message: { error: "Terlalu banyak request dari IP ini. Coba lagi nanti." },
  standardHeaders: true,
  legacyHeaders: false,
});
