const User = require("../../models/userSchema");

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
