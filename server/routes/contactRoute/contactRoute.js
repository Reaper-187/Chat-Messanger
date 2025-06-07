const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/userContacts/contacts");

router.get("/contacts", contactController.contacts);

module.exports = router;
