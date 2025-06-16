const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
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

  io.on("connect", (socket) => {
    const user = socket.request.user;

    const socketRoom = socket.join(user._id.toString());

    socket.on("send_message", async (message) => {
      try {
        const newMessage = new Message({
          from: socket.request.user._id,
          to: message.to,
          text: message.text,
          timeStamp: message.timeStamp,
        });
        await newMessage.save();
        const sender = await User.findById(socket.request.user._id).select(
          "name"
        );

        io.to(message.to).emit("receive_message", message);
        io.to(message.to).emit("new_contact");
      } catch (err) {
        console.error("Fehler beim senden oder Speichern der Nachricht", err);
      }
    });
  });
}

module.exports = { setupSocketIO };
