const User = require("../models/userSchema");

async function authStatus(req, res, next) {
  const loggedInUser = req.session.passport?.user || req.session.user;
  const userId =
    typeof loggedInUser === "object" ? loggedInUser.id : loggedInUser;

  if (!userId) return res.status(401).json({ loggedIn: false });

  try {
    const user = await User.findById(userId).select(
      "isVerified verificationToken otpSent isGuest name email _id avatar isOnline"
    );

    if (!user) {
      return res.status(404).json({ loggedIn: false });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("AuthCheck Error:", err);
    res.status(500).json({ loggedIn: false, error: "Internal Server Error" });
  }
}

module.exports = authStatus;
