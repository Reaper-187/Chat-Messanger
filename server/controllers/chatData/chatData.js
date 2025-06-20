const Message = require("../../models/messageSchema");
const UnreadMsg = require("../../models/unreadMsg");

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
