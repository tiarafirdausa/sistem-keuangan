const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// CREATE
exports.create = [
  body("kode").notEmpty().trim().escape(),
  body("nama").notEmpty().trim().escape(),
  body("urutan").optional().isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { kode, nama, parent_id, urutan, path } = req.body;
      const [result] = await db.query(
        "INSERT INTO Menu (kode, nama, parent_id, urutan, path) VALUES (?, ?, ?, ?, ?)",
        [kode, nama, parent_id || null, urutan || 0, path || null]
      );
      res.status(201).json({ id: result.insertId, message: "Menu berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Menu ORDER BY parent_id, urutan");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Menu by Role
exports.getMenuByRole = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.id, m.kode, m.nama, m.parent_id, m.urutan, m.path, 
              rma.boleh_lihat, rma.boleh_tambah, rma.boleh_ubah, rma.boleh_hapus
       FROM Menu m
       JOIN RoleMenuAkses rma ON m.id = rma.menu_id
       WHERE rma.role_id = ?
       ORDER BY m.parent_id, m.urutan`,
      [req.params.roleId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Menu WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
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
      const { kode, nama, parent_id, urutan, path } = req.body;
      const [result] = await db.query(
        "UPDATE Menu SET kode=?, nama=?, parent_id=?, urutan=?, path=? WHERE id=?",
        [kode, nama, parent_id || null, urutan || 0, path || null, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
      res.json({ message: "Menu berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM Menu WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
    res.json({ message: "Menu berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
