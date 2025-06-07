const Message = require("../models/messageSchema");
const { Server } = require("socket.io");

// Die wrap() ist wie ein Übersetzer von express => socketio

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

function setupSocketIO(server, sessionMiddleware, passport) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    if (socket.request.session?.passport?.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.request.user;
    console.log(`User ${user?.email || "Unknown"} connected on ${socket.id}`);

    try {
      socket.on("send_message", async (data, callback) => {
        const newMessage = new Message({
          from: socket.request.user._id,
          text: data.text,
          timeStamp: new Date(),
        });
        await newMessage.save();
        callback({ success: true, message: "Message stored in DB" });
      });
    } catch (err) {
      callback({ success: true, message: "Message can not stored in DB" });
    }
  });
}

module.exports = { setupSocketIO };
