const jwt = require("jsonwebtoken");

// ✅ Verifikasi JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token tidak ditemukan" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = decoded;
    next();
  });
};

// ✅ Cek Role & Akses Menu
exports.checkAccess = (menuKode, aksi) => {
  return async (req, res, next) => {
    const db = require("../models/db");
    try {
      const [rows] = await db.query(
        `SELECT rma.* 
         FROM RoleMenuAkses rma
         JOIN Menu m ON rma.menu_id = m.id
         WHERE rma.role_id = ? AND m.kode = ?`,
        [req.user.role_id, menuKode]
      );

      if (rows.length === 0) return res.status(403).json({ error: "Akses ditolak" });

      const akses = rows[0];
      if (aksi === "lihat" && !akses.boleh_lihat) return res.status(403).json({ error: "Tidak boleh melihat data" });
      if (aksi === "tambah" && !akses.boleh_tambah) return res.status(403).json({ error: "Tidak boleh menambah data" });
      if (aksi === "ubah" && !akses.boleh_ubah) return res.status(403).json({ error: "Tidak boleh mengubah data" });
      if (aksi === "hapus" && !akses.boleh_hapus) return res.status(403).json({ error: "Tidak boleh menghapus data" });

      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};
