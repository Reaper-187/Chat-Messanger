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

exports.favoriteContact = async (req, res) => {
  const user = req.user;
  const contactId = req.body._id;
  console.log("contactId", contactId);

  try {
    const loggedInUser = await User.findById(user._id);
    const exists = loggedInUser.favorites.includes(contactId);
    console.log("exists", exists);

    if (exists) {
      loggedInUser.favorites = loggedInUser.favorites.filter(
        (id) => id !== contactId
      );
    } else {
      loggedInUser.favorites.push(contactId);
    }
    await loggedInUser.save();
    res.status(200).json({
      message: "Contact insert in Schema",
    });
  } catch (err) {
    console.error("Error with put User as Favorite", err);
  }
};

exports.fetchFavoriteContact = async (req, res) => {
  const user = req.user;
  try {
    const fetchData = await User.findById(user._id).populate("favorites");
    console.log("fetchData", fetchData);

    const fetchFavContacts = fetchData.favorites;
    console.log("fetchFavContacts", fetchFavContacts);

    res.status(200).json({
      fetchFavContacts,
      message: "fetch favorite contacts successfully",
    });
  } catch (err) {
    console.error("Error with fetching favorite contacts", err);
  }
};
