const User = require("../../models/userSchema");
const Message = require("../../models/messageSchema");
const UnreadMsg = require("../../models/unreadMsg");
const path = require("path");
const fs = require("fs");
const { fileTypeFromBuffer } = require("file-type");

exports.chatData = async (req, res) => {
  const user = req.user;
  try {
    const fromUser = user._id;
    const toUser = req.params.userId;

    const chats = await Message.find({
      $or: [
        { from: fromUser, to: toUser },
        { from: toUser, to: fromUser },
      ],
    }).sort({ timeStamp: 1 });

    res.status(200).json({
      chats,
      message: "chats loaded successfully",
    });
  } catch (err) {
    console.error("Error fetching chatdata", err);
    res.status(500).json({ message: "Server error while fetching chats" });
  }
};

exports.lastMessages = async (req, res) => {
  const user = req.user;
  try {
    const chatHistory = await Message.aggregate([
      { $match: { $or: [{ from: user._id }, { to: user._id }] } },
      { $sort: { timeStamp: -1 } },
    ]);

    const map = new Map();

    for (const singleMessage of chatHistory) {
      const otherId =
        String(singleMessage.from) === String(user._id)
          ? String(singleMessage.to)
          : String(singleMessage.from);

      if (!map.has(otherId)) {
        map.set(otherId, singleMessage);
      }
    }

    const latestMsgOfContact = Array.from(map.values());

    res.status(200).json({
      latestMsgOfContact,
      message: "sorting contacts successfully",
    });
  } catch (err) {
    console.error("Error on loading last Messages", err);
  }
};

exports.resetUnreadMessage = async (req, res) => {
  const user = req.user;
  try {
    const toUser = user._id.toString();
    const fromUser = req.params.userId;

    await UnreadMsg.findOneAndUpdate(
      { from: fromUser, to: toUser },
      { $set: { count: 0 } },
      { new: true }
    );

    return res.status(204).send(); // Kein Body nötig
  } catch (err) {
    console.error("Error by counting unread messages", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllUnread = async (req, res) => {
  const toUser = req.user._id;
  try {
    const messages = await UnreadMsg.find({ to: toUser });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.sendImage = async (req, res) => {
  const user = req.user;
  const dataBuffer = req.file.buffer;
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
    "userImgs",
    uniqueName
  );
  const imgPathForDB = "/uploads/userImgs/" + uniqueName;
  const shortenedPath = imgPathForDB.replace(/\\/g, "/");
  try {
    await fs.promises.writeFile(finalPath, dataBuffer);
    res.status(200).json({ success: true, url: shortenedPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "File upload failed" });
  }
};
