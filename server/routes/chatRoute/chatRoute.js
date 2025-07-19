const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chatData/chatData");
const authUserMw = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

router.get("/chatData/:userId", authUserMw, chatController.chatData);

router.post(
  "/resetUnreadMessage/:userId",
  authUserMw,
  chatController.resetUnreadMessage
);

router.get("/getAllUnread", authUserMw, chatController.getAllUnread);

router.get("/lastMessages", authUserMw, chatController.lastMessages);

router.post(
  "/sendImage",
  authUserMw,
  upload.single("userImg"),
  chatController.sendImage
);

router.get("/getImageUrl", authUserMw, chatController.getImageUrl);

module.exports = router;
