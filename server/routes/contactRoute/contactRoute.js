const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/userContacts/contacts");
const authUserMw = require("../../middleware/authMiddleware");

router.get("/contacts", authUserMw, contactController.contacts);

router.get("/chatContacts", authUserMw, contactController.chatContacts);

module.exports = router;
