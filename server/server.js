if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const connectDB = require("./MongoDB/dataBase");
const session = require("express-session");
const cors = require("cors");
const flash = require("express-flash");
const authRoutes = require("./routes/authRoutes");
const contactRoute = require("./routes/contactRoute/contactRoute");
const chatRoute = require("./routes/chatRoute/chatRoute");
const passportLocal = require("./passport/passport-local");
const User = require("./models/userSchema");
const passport = require("passport");
const { setupSocketIO } = require("./sockets/socketSetup");
const { sessionSetup } = require("./session/sessionSetup");
const { createServer } = require("http");
const httpServer = createServer(app);

// muss du setzten wenn du mit vercel arbeitest sonst
// werden keine cookies gespeichert
// app.set("trust proxy", 1);

// CORS-Konfiguration
const FRONTEND_URL = process.env.FRONTEND_URL;

// Session-Konfiguration
const sessionMiddleware = session(sessionSetup());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passportLocal(
  passport,
  (email) => User.findOne({ email }),
  (id) => User.findById(id)
);

// initializeGoogleAuth(passport);
// initializeGhubAuth(passport);

setupSocketIO(httpServer, sessionMiddleware, passport);

app.use("/api/auth", authRoutes); // Route für userAuthen
app.use("/api/user-contacts", contactRoute); // Route für contacts
app.use("/api/chat-data", chatRoute); // Route für chatdata

connectDB();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log("Server is on PORT " + PORT);
});
