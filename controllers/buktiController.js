const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// ✅ CREATE
exports.create = [
  body("tanggal").isDate().withMessage("Tanggal wajib diisi format YYYY-MM-DD"),
  body("jenis").notEmpty().withMessage("Jenis wajib diisi"),
  body("total").isNumeric().withMessage("Total harus angka"),
  body("unit_id").isInt().withMessage("Unit ID wajib angka"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { tanggal, jenis, total, unit_id, dibuat_oleh, disetujui_oleh } = req.body;
      const [result] = await db.query(
        "INSERT INTO BuktiTransaksi (tanggal, jenis, total, unit_id, dibuat_oleh, disetujui_oleh) VALUES (?, ?, ?, ?, ?, ?)",
        [tanggal, jenis, total, unit_id, dibuat_oleh || null, disetujui_oleh || null]
      );
      res.status(201).json({ id: result.insertId, message: "Bukti transaksi berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM BuktiTransaksi ORDER BY tanggal DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM BuktiTransaksi WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
exports.update = [
  body("jenis").optional().notEmpty(),
  body("total").optional().isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { tanggal, jenis, total, unit_id, dibuat_oleh, disetujui_oleh } = req.body;
      const [result] = await db.query(
        "UPDATE BuktiTransaksi SET tanggal=?, jenis=?, total=?, unit_id=?, dibuat_oleh=?, disetujui_oleh=? WHERE id=?",
        [tanggal, jenis, total, unit_id, dibuat_oleh, disetujui_oleh, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
      res.json({ message: "Bukti transaksi berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// ✅ DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM BuktiTransaksi WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Bukti transaksi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
