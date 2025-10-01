const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csrfProtection = require("./middlewares/csrfMiddleware");
const { apiLimiter } = require("./middlewares/rateLimiter");
const db = require("./models/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use("/api", apiLimiter); 
app.use("/api/unit-usaha", require("./routes/unitUsahaRoutes"));
app.use("/api/jenis-akun", require("./routes/jenisAkunRoutes"));
app.use("/api/akun", require("./routes/akunRoutes"));
app.use("/api/bukti", require("./routes/buktiRoutes"));
app.use("/api/transaksi-internet", require("./routes/transaksiInternetRoutes"));
app.use("/api/penjualan", require("./routes/penjualanRoutes"));
app.use("/api/pembelian", require("./routes/pembelianRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/role", require("./routes/roleRoutes"));
app.use("/api/akses", require("./routes/roleMenuAksesRoutes"));

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully!");
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}
startServer();
