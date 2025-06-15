const User = require("../../models/userSchema");
const Message = require("../../models/messageSchema");

exports.contacts = async (req, res) => {
  const user = req.user;
  try {
    const contacts = await User.find();
    res.status(200).json({
      contacts,
      message: "All contacts loaded",
    });
  } catch (err) {
    console.error("Error fetching contacts", err);
  }
};

exports.chatContacts = async (req, res) => {
  const user = req.user;
  try {
    const chatIdLoggedUser = await Message.find({
      $or: [{ from: user }, { to: user }],
    }).sort({ timeStamp: 1 });

    const contactIds = chatIdLoggedUser.map((msg) =>
      msg.from.toString() === user._id.toString() ? msg.to : msg.from
    );

    const uniqueIds = [...new Set(contactIds)];

    const chatContacts = await User.find({ _id: { $in: uniqueIds } });

    res.status(200).json({
      chatContacts,
      message: "All contacts loaded",
    });
  } catch (err) {
    console.error("Error fetching contacts", err);
  }
};
