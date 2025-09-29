const db = require("../models/db");
const { body, validationResult } = require("express-validator");

exports.create = [
  body("kode").notEmpty(),
  body("nama").notEmpty(),
  body("jenis_id").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { kode, nama, jenis_id, induk_id, unit_id } = req.body;
      const [result] = await db.query(
        "INSERT INTO Akun (kode, nama, jenis_id, induk_id, unit_id) VALUES (?, ?, ?, ?, ?)",
        [kode, nama, jenis_id, induk_id || null, unit_id || null]
      );
      res.status(201).json({ id: result.insertId, message: "Akun berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, j.nama AS jenis_nama, u.nama AS unit_nama
      FROM Akun a
      LEFT JOIN JenisAkun j ON a.jenis_id = j.id
      LEFT JOIN UnitUsaha u ON a.unit_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Akun WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = [
  body("nama").notEmpty(),
  async (req, res) => {
    try {
      const { kode, nama, jenis_id, induk_id, unit_id } = req.body;
      const [result] = await db.query(
        "UPDATE Akun SET kode=?, nama=?, jenis_id=?, induk_id=?, unit_id=? WHERE id=?",
        [kode, nama, jenis_id, induk_id || null, unit_id || null, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Akun berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Akun WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Akun berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
