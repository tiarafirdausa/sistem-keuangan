const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// ✅ CREATE
exports.create = [
  body("nama").notEmpty().withMessage("Nama wajib diisi"),
  body("tipe").isString().withMessage("Tipe harus teks"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { nama, tipe, model_bisnis, status, deskripsi } = req.body;
      const [result] = await db.query(
        "INSERT INTO UnitUsaha (nama, tipe, model_bisnis, status, deskripsi) VALUES (?, ?, ?, ?, ?)",
        [nama, tipe, model_bisnis, status || "aktif", deskripsi]
      );
      res.status(201).json({ id: result.insertId, message: "Unit usaha berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM UnitUsaha ORDER BY dibuat_pada DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM UnitUsaha WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
exports.update = [
  body("nama").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { nama, tipe, model_bisnis, status, deskripsi } = req.body;
      const [result] = await db.query(
        "UPDATE UnitUsaha SET nama=?, tipe=?, model_bisnis=?, status=?, deskripsi=? WHERE id=?",
        [nama, tipe, model_bisnis, status, deskripsi, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Unit usaha berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM UnitUsaha WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Unit usaha berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
