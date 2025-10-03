const express = require("express");
const router = express.Router();
const controller = require("../controllers/menuController");
const { verifyToken, checkAccess } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, checkAccess("SET", "tambah"), controller.create);
router.get("/", verifyToken, checkAccess("SET", "lihat"), controller.getAll);
router.get("/:id", verifyToken, checkAccess("SET", "lihat"), controller.getById);
router.get("/by-role/:roleId", verifyToken, controller.getMenuByRole);
router.put("/:id", verifyToken, checkAccess("SET", "ubah"), controller.update);
router.delete("/:id", verifyToken, checkAccess("SET", "hapus"), controller.remove);

module.exports = router;
