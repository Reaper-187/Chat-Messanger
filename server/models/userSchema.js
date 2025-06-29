const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: function () {
      return !this.githubId && !this.googleId && !this.isGuest;
    },
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId && !this.githubId && !this.isGuest;
    },
  }, // Passwort nur erforderlich, wenn kein Google oder GitHub Login
  avatar: {
    type: String,
    default: function () {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        this.name || "Guest"
      )}`;
    },
  },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  isVerified: {
    type: Boolean,
    default: function () {
      return !!(this.googleId || this.githubId);
    },
  },
  verificationToken: {
    type: String,
    default: function () {
      return this.googleId || this.githubId ? null : undefined;
    },
  },
  tokenExpires: { type: Date },
  createdOn: { type: Date, default: Date.now },
  otpSent: { type: Number, default: null },
  resetCodeExpires: { type: Date },

  isGuest: { type: Boolean, default: false },
  isGuestLoggedIn: { type: Boolean, default: false },
  guestSessionExpiresAt: { type: Date, default: null },
  isOnline: { type: Boolean, default: false },
  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
});

module.exports = mongoose.model("User", userSchema);
