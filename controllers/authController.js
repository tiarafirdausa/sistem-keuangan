const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");

// 🔑 Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // 1 jam
  );
};

// 🔑 Generate Refresh Token
const generateRefreshToken = () => crypto.randomBytes(40).toString("hex");

// ✅ REGISTER
exports.register = [
  body("username").notEmpty(),
  body("password").isLength({ min: 6 }),
  body("role_id").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { username, password, role_id } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        "INSERT INTO Pengguna (username, password, role_id) VALUES (?, ?, ?)",
        [username, hashedPassword, role_id]
      );
      res.status(201).json({ message: "Pengguna berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// ✅ LOGIN
exports.login = [
  body("username").notEmpty(),
  body("password").notEmpty(),
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const [rows] = await db.query("SELECT * FROM Pengguna WHERE username=?", [username]);

      if (rows.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Password salah" });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

      await db.query(
        "INSERT INTO RefreshToken (user_id, token, expires_at) VALUES (?, ?, ?)",
        [user.id, refreshToken, expiresAt]
      );

      // kirim access token via response (bisa disimpan di memory/frontend)
      // refresh token disimpan di cookie HttpOnly
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({
        user: { id: user.id, username: user.username, role_id: user.role_id },
        token: accessToken,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

// ✅ LOGOUT
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ error: "Tidak ada refresh token" });

    await db.query("DELETE FROM RefreshToken WHERE token=?", [refreshToken]);
    res.clearCookie("refreshToken");
    res.json({ message: "Logout berhasil" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ME
exports.getMe = async (req, res) => {
  try {
    const user = req.user; // dari verifyToken
    const [rows] = await db.query("SELECT id, username, role_id FROM Pengguna WHERE id=?", [user.id]);
    if (rows.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token wajib disertakan" });

    const [rows] = await db.query("SELECT * FROM RefreshToken WHERE token=?", [refreshToken]);
    if (rows.length === 0) return res.status(403).json({ error: "Refresh token tidak valid" });

    const tokenRecord = rows[0];
    if (new Date(tokenRecord.expires_at) < new Date()) {
      await db.query("DELETE FROM RefreshToken WHERE id=?", [tokenRecord.id]);
      return res.status(403).json({ error: "Refresh token kadaluarsa" });
    }

    const [userRows] = await db.query("SELECT * FROM Pengguna WHERE id=?", [tokenRecord.user_id]);
    if (userRows.length === 0) return res.status(404).json({ error: "User tidak ditemukan" });

    const newAccessToken = generateAccessToken(userRows[0]);
    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
