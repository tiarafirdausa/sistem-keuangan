const express = require("express");
const router = express.Router();
const controller = require("../controllers/jenisAkunController");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
