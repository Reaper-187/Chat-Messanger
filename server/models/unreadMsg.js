const mongoose = require("mongoose");

const unreadMessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UnreadMsg", unreadMessageSchema);
