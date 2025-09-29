const express = require("express");
const router = express.Router();
const controller = require("../controllers/roleMenuAksesController");
const { verifyToken, checkAccess } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, checkAccess("SET", "tambah"), controller.create);
router.get("/", verifyToken, checkAccess("SET", "lihat"), controller.getAll);
router.get("/:id", verifyToken, checkAccess("SET", "lihat"), controller.getById);
router.put("/:id", verifyToken, checkAccess("SET", "ubah"), controller.update);
router.delete("/:id", verifyToken, checkAccess("SET", "hapus"), controller.remove);

module.exports = router;
