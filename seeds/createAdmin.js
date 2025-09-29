require("dotenv").config();
const db = require("../models/db");
const bcrypt = require("bcrypt");

async function seedAdmin() {
  try {
    const username = "admin";
    const plainPassword = "admin123";
    const role_id = 1; // Role ADMIN (sesuai seed Role)

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [check] = await db.query("SELECT * FROM Pengguna WHERE username=?", [username]);
    if (check.length > 0) {
      console.log("⚠️ Admin sudah ada, tidak perlu dibuat ulang.");
      process.exit(0);
    }

    await db.query(
      "INSERT INTO Pengguna (username, password, role_id) VALUES (?, ?, ?)",
      [username, hashedPassword, role_id]
    );

    console.log("✅ Admin user berhasil dibuat:");
    console.log(`   username: ${username}`);
    console.log(`   password: ${plainPassword}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal membuat admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();