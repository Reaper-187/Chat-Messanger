const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chatData/chatData");
const authUserMw = require("../../middleware/authMiddleware");

router.get("/chatData/:userId", authUserMw, chatController.chatData);

router.post("/unreadMessage/:userId", authUserMw, chatController.unreadMessage);

router.get("/getAllUnread", authUserMw, chatController.getAllUnread);

module.exports = router;
