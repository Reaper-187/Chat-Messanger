const Message = require("../../models/messageSchema");

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
