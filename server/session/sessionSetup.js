const MongoStore = require("connect-mongo");
const crypto = require("crypto");

const SECRET_RANDOM_KEY = crypto.randomBytes(32).toString("hex");

const sessionSetup = () => ({
  name: "connect.sid",
  secret: process.env.SECRET_KEY || SECRET_RANDOM_KEY,
  resave: false,
  saveUninitialized: false, // Muss false sein, sonst wird leere Session gespeichert
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Falls HTTPS genutzt wird, auf true setzen.
    sameSite: "none", // Falls Frontend auf anderer Domain, 'none' verwenden
    maxAge: 1000 * 60 * 60 * 24,
  },
});

module.exports = { sessionSetup };
