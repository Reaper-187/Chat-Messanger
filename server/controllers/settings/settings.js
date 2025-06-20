const User = require("../../models/userSchema");

exports.saveImage = async (req, res) => {
  const user = req.user;
  const userAvatar = req.file;
  console.log(userAvatar);
};

// eine datei img
