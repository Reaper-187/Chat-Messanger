const User = require("../../models/userSchema");
const path = require("path");
const fs = require("fs");
const { fileTypeFromBuffer } = require("file-type");

exports.saveImage = async (req, res) => {
  const user = req.user;
  const dataBuffer = req.file.buffer; // Der Dateiinhalt
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const result = await fileTypeFromBuffer(req.file.buffer);

  if (
    !result ||
    !["image/jpeg", "image/png", "image/svg+xml"].includes(result.mime)
  ) {
    return res.status(400).json({ error: "Invalid file type" });
  }
  const fileExt = path.extname(req.file.originalname);
  const uniqueName =
    Date.now() +
    "-" +
    user._id +
    "-" +
    Math.round(Math.random() * 1e9) +
    fileExt;
  const finalPath = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    "avatars",
    uniqueName
  );

  try {
    fs.writeFileSync(finalPath, dataBuffer);
    const avatarPathForDB = "uploads/avatars/" + uniqueName;
    const newAvatarImg = avatarPathForDB.replace(/\\/g, "/");
    if (user.avatar && user.avatar.startsWith("uploads/")) {
      const oldImagePath = path.join(__dirname, "..", "..", user.avatar);
      fs.unlink(oldImagePath, (err) => {
        err ? console.log(err) : console.log("Old Img Deleted", user.avatar);
      });
    }
    await User.findOneAndUpdate(
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
    return res.status(200).json({ message: "New Image saved" });
  } catch (err) {
    console.error("error: deleting old Img", err);
  }
};
