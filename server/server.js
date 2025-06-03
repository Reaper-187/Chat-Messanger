if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const connectDB = require("./MongoDB/dataBase");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
const flash = require("express-flash");
const authRoutes = require("./routes/authRoutes");
const passportLocal = require("./passport/passport-local");
const User = require("./models/userSchema");
const passport = require("passport");
const { createServer } = require("http");
const httpServer = createServer(app);

// muss du setzten wenn du mit vercel arbeitest sonst
// werden keine cookies gespeichert
// app.set("trust proxy", 1);

// CORS-Konfiguration
const FRONTEND_URL = process.env.FRONTEND_URL;

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
});

const SECRET_RANDOM_KEY = crypto.randomBytes(32).toString("hex");

// Session-Konfiguration
app.use(
  session({
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
      sameSite: "lax", // Falls Frontend auf anderer Domain, 'none' verwenden
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passportLocal(
  passport,
  async (email) => await User.findOne({ email }),
  async (id) => await User.findById(id)
);

// initializeGoogleAuth(passport);
// initializeGhubAuth(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use("/api/auth", authRoutes); // Route für userAuthen

connectDB();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log("Server is on PORT " + PORT);
});
