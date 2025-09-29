const db = require("../models/db");
const { body, validationResult } = require("express-validator");

// CREATE
exports.create = [
  body("role_id").isInt(),
  body("menu_id").isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { role_id, menu_id, boleh_lihat, boleh_tambah, boleh_ubah, boleh_hapus } = req.body;
      const [result] = await db.query(
        `INSERT INTO RoleMenuAkses 
        (role_id, menu_id, boleh_lihat, boleh_tambah, boleh_ubah, boleh_hapus) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [role_id, menu_id, !!boleh_lihat, !!boleh_tambah, !!boleh_ubah, !!boleh_hapus]
      );
      res.status(201).json({ id: result.insertId, message: "Akses role-menu berhasil dibuat" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT rma.*, r.nama AS role_nama, m.nama AS menu_nama, m.kode AS menu_kode
       FROM RoleMenuAkses rma
       JOIN Role r ON rma.role_id = r.id
       JOIN Menu m ON rma.menu_id = m.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM RoleMenuAkses WHERE id=?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Akses tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = [
  async (req, res) => {
    const { role_id, menu_id, boleh_lihat, boleh_tambah, boleh_ubah, boleh_hapus } = req.body;
    try {
      const [result] = await db.query(
        `UPDATE RoleMenuAkses SET role_id=?, menu_id=?, boleh_lihat=?, boleh_tambah=?, boleh_ubah=?, boleh_hapus=? WHERE id=?`,
        [role_id, menu_id, !!boleh_lihat, !!boleh_tambah, !!boleh_ubah, !!boleh_hapus, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: "Akses tidak ditemukan" });
      res.json({ message: "Akses role-menu berhasil diperbarui" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// DELETE
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM RoleMenuAkses WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Akses tidak ditemukan" });
    res.json({ message: "Akses role-menu berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
