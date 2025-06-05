const { randomUUID } = require("crypto");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  uuid: { type: String, default: () => randomUUID() },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  text: String, // nur bei text
  mediaUrl: String, // bei Bildern/Dateien
  fileName: String, // bei Datei
  timeStamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
