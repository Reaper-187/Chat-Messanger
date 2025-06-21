const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars"); // hier werden die Bilder gespeichert
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + req.user._id + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
