const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// ✅ CREATE
exports.create = [
  body("unit_id").isInt(),
  body("produk_id").isInt(),
  body("jumlah").isInt(),
  body("harga").isNumeric(),
  body("total").isNumeric(),
  body("tanggal").isDate(),
  body("metode_bayar").notEmpty(),
  body("bukti_id").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { unit_id, produk_id, pelanggan_id, agen_id, jumlah, harga, total,
        tanggal, metode_bayar, bukti_id, akun_piutang, akun_pendapatan,
        akun_hpp, akun_persediaan, dibuat_oleh } = req.body;

      const [result] = await db.query(
        `INSERT INTO Penjualan 
        (unit_id, produk_id, pelanggan_id, agen_id, jumlah, harga, total, tanggal, metode_bayar, bukti_id, 
         akun_piutang, akun_pendapatan, akun_hpp, akun_persediaan, dibuat_oleh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [unit_id, produk_id, pelanggan_id || null, agen_id || null, jumlah, harga, total, tanggal, metode_bayar,
         bukti_id, akun_piutang, akun_pendapatan, akun_hpp, akun_persediaan, dibuat_oleh || null]
      );

      res.status(201).json({ id: result.insertId, message: "Penjualan berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Penjualan ORDER BY tanggal DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Penjualan WHERE id=?", [req.params.id]);
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
      const { unit_id, produk_id, pelanggan_id, agen_id, jumlah, harga, total,
        tanggal, metode_bayar, bukti_id, akun_piutang, akun_pendapatan,
        akun_hpp, akun_persediaan, dibuat_oleh } = req.body;

      const [result] = await db.query(
        `UPDATE Penjualan SET 
         unit_id=?, produk_id=?, pelanggan_id=?, agen_id=?, jumlah=?, harga=?, total=?, tanggal=?, metode_bayar=?, 
         bukti_id=?, akun_piutang=?, akun_pendapatan=?, akun_hpp=?, akun_persediaan=?, dibuat_oleh=? 
         WHERE id=?`,
        [unit_id, produk_id, pelanggan_id || null, agen_id || null, jumlah, harga, total, tanggal, metode_bayar,
         bukti_id, akun_piutang, akun_pendapatan, akun_hpp, akun_persediaan, dibuat_oleh, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Penjualan berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Penjualan WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Penjualan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
