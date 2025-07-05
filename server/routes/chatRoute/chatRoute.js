const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chatData/chatData");
const authUserMw = require("../../middleware/authMiddleware");

router.get("/chatData/:userId", authUserMw, chatController.chatData);

router.post(
  "/resetUnreadMessage/:userId",
  authUserMw,
  chatController.resetUnreadMessage
);

router.get("/getAllUnread", authUserMw, chatController.getAllUnread);

router.get("/lastMessages", authUserMw, chatController.lastMessages);

module.exports = router;
