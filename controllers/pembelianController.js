const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// ✅ CREATE
exports.create = [
  body("unit_id").isInt(),
  body("pemasok").notEmpty(),
  body("produk").notEmpty(),
  body("jumlah").isInt(),
  body("harga_satuan").isNumeric(),
  body("total").isNumeric(),
  body("tanggal").isDate(),
  body("metode_bayar").notEmpty(),
  body("bukti_id").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { unit_id, pemasok, produk, jumlah, harga_satuan, total, tanggal,
        metode_bayar, bukti_id, akun_hutang, akun_pembelian, akun_persediaan, dibuat_oleh } = req.body;

      const [result] = await db.query(
        `INSERT INTO Pembelian 
        (unit_id, pemasok, produk, jumlah, harga_satuan, total, tanggal, metode_bayar, bukti_id, akun_hutang, akun_pembelian, akun_persediaan, dibuat_oleh)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [unit_id, pemasok, produk, jumlah, harga_satuan, total, tanggal, metode_bayar,
         bukti_id, akun_hutang, akun_pembelian, akun_persediaan, dibuat_oleh || null]
      );

      res.status(201).json({ id: result.insertId, message: "Pembelian berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Pembelian ORDER BY tanggal DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Pembelian WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
exports.update = [
  body("jumlah").optional().isInt(),
  body("harga_satuan").optional().isNumeric(),
  body("total").optional().isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { unit_id, pemasok, produk, jumlah, harga_satuan, total, tanggal,
        metode_bayar, bukti_id, akun_hutang, akun_pembelian, akun_persediaan, dibuat_oleh } = req.body;

      const [result] = await db.query(
        `UPDATE Pembelian SET 
        unit_id=?, pemasok=?, produk=?, jumlah=?, harga_satuan=?, total=?, tanggal=?, metode_bayar=?, 
        bukti_id=?, akun_hutang=?, akun_pembelian=?, akun_persediaan=?, dibuat_oleh=? 
        WHERE id=?`,
        [unit_id, pemasok, produk, jumlah, harga_satuan, total, tanggal, metode_bayar,
         bukti_id, akun_hutang, akun_pembelian, akun_persediaan, dibuat_oleh, req.params.id]
      );

      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Pembelian berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Pembelian WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Pembelian berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
