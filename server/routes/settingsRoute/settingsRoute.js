const express = require("express");
const router = express.Router();
const settingsController = require("../../controllers/settings/settings");
const upload = require("../../middleware/uploadMiddleware");
const authUserMw = require("../../middleware/authMiddleware");

router.post(
  "/saveImage",
  authUserMw,
  upload.single("avatar"),
  settingsController.saveImage
);

module.exports = router;
