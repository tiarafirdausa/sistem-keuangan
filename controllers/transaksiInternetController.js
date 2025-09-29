const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// ✅ CREATE
exports.create = [
  body("pelanggan_id").isInt(),
  body("produk_id").isInt(),
  body("tanggal").isDate(),
  body("jumlah").isInt(),
  body("harga").isNumeric(),
  body("total").isNumeric(),
  body("metode_bayar").notEmpty(),
  body("bukti_id").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { pelanggan_id, produk_id, tanggal, jumlah, harga, total, metode_bayar,
        bukti_id, akun_piutang, akun_pendapatan, dibuat_oleh } = req.body;

      const [result] = await db.query(
        `INSERT INTO TransaksiInternet 
        (pelanggan_id, produk_id, tanggal, jumlah, harga, total, metode_bayar, bukti_id, akun_piutang, akun_pendapatan, dibuat_oleh) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pelanggan_id, produk_id, tanggal, jumlah, harga, total, metode_bayar,
          bukti_id, akun_piutang || null, akun_pendapatan || null, dibuat_oleh || null]
      );

      res.status(201).json({ id: result.insertId, message: "Transaksi internet berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM TransaksiInternet ORDER BY tanggal DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM TransaksiInternet WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
exports.update = [
  body("jumlah").optional().isInt(),
  body("harga").optional().isNumeric(),
  body("total").optional().isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { pelanggan_id, produk_id, tanggal, jumlah, harga, total, metode_bayar,
        bukti_id, akun_piutang, akun_pendapatan, dibuat_oleh } = req.body;

      const [result] = await db.query(
        `UPDATE TransaksiInternet SET 
        pelanggan_id=?, produk_id=?, tanggal=?, jumlah=?, harga=?, total=?, metode_bayar=?, 
        bukti_id=?, akun_piutang=?, akun_pendapatan=?, dibuat_oleh=? 
        WHERE id=?`,
        [pelanggan_id, produk_id, tanggal, jumlah, harga, total, metode_bayar,
          bukti_id, akun_piutang, akun_pendapatan, dibuat_oleh, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Transaksi internet berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM TransaksiInternet WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Transaksi internet berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
