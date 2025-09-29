const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// CREATE
exports.create = [
  body("kode").notEmpty().trim().escape(),
  body("nama").notEmpty().trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { kode, nama, deskripsi } = req.body;
      const [result] = await db.query(
        "INSERT INTO Role (kode, nama, deskripsi) VALUES (?, ?, ?)",
        [kode, nama, deskripsi || null]
      );
      res.status(201).json({ id: result.insertId, message: "Role berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Role");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Role WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Role tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = [
  body("nama").optional().trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { kode, nama, deskripsi } = req.body;
      const [result] = await db.query(
        "UPDATE Role SET kode=?, nama=?, deskripsi=? WHERE id=?",
        [kode, nama, deskripsi, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: "Role tidak ditemukan" });
      res.json({ message: "Role berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Role WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Role tidak ditemukan" });
    res.json({ message: "Role berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
