const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB verbunden");
  } catch (error) {
    console.error("MongoDB Verbindung fehlgeschlagen:", error);
    process.exit(1); // Beendet die App bei Verbindungsfehler
  }
};

module.exports = connectDB;
