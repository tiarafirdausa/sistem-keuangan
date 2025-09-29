const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// ✅ Register User
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
  }
];

// ✅ Login User
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

      const token = jwt.sign(
        { id: user.id, username: user.username, role_id: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];
