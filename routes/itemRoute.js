const express = require("express");
const { item } = require("../controllers/itemController");
const { protect, authorize } = require("../middleware/auth");
const cloudUpload = require("../utils/multer");

const router = express.Router();

router.route("/:id").get(item);
module.exports = router;
