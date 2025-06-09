const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/chatData/chatData");
const authUserMw = require("../../middleware/authMiddleware");

router.get("/chatData/:userId", authUserMw, chatController.chatData);

module.exports = router;
