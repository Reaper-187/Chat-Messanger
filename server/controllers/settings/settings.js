const User = require("../../models/userSchema");
const path = require("path");
const fs = require("fs");

exports.saveImage = async (req, res) => {
  const user = req.user;
  const uploadedImgPath = req.file;
  const newAvatarImg = uploadedImgPath.path.replace(/\\/g, "/");
  try {
    if (user.avatar && user.avatar.startsWith("uploads/")) {
      const oldImagePath = path.join(__dirname, "..", "..", user.avatar);
      fs.unlink(oldImagePath, (err) => {
        err ? console.log(err) : console.log("Old Img Deleted", user.avatar);
      });
    }
    const changeImg = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        avatar: newAvatarImg,
      },
      {
        upsert: true,
        new: true,
      }
    );
    console.log("new Image ok", newAvatarImg);
  } catch (err) {
    console.error("error: deleting old Img", err);
  }
};
