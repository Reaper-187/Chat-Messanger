const User = require("../../models/userSchema");

exports.contacts = async (req, res) => {
  try {
    const contacts = await User.find();
    // fetch all contacts but loggenin User!!!
    res.status(200).json({
      contacts,
      message: "All contacts loaded",
    });
  } catch (error) {
    console.error(error);
  }
};
