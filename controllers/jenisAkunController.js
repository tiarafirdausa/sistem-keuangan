const db = require("../models/db");
const { body, validationResult } = require("express-validator");

exports.create = [
  body("kode").notEmpty().withMessage("Kode wajib diisi"),
  body("nama").notEmpty().withMessage("Nama wajib diisi"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { kode, nama } = req.body;
      const [result] = await db.query("INSERT INTO JenisAkun (kode, nama) VALUES (?, ?)", [kode, nama]);
      res.status(201).json({ id: result.insertId, message: "Jenis akun berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM JenisAkun");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM JenisAkun WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = [
  body("nama").notEmpty().withMessage("Nama wajib diisi"),
  async (req, res) => {
    const { nama } = req.body;
    try {
      const [result] = await db.query("UPDATE JenisAkun SET nama=? WHERE id=?", [nama, req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Jenis akun berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM JenisAkun WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Jenis akun berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
