const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app); // creating the server outside of the express library to later connect it to socket io
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  // socket is an object that contains info on the connection
  console.log("new webSocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage('Admin', "you entered chat")); // socket emit to current user
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage('Admin', `${user.username} has joined the chat`));

      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room),
      })

      callback()
  });

  socket.on("message", (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("bad words");
    }

    const user = getUser(socket.id);

    io.to(user.room).emit("message", generateMessage(user.username, msg)); // io emit to all connected clients
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("location", generateLocationMessage(user.username, location));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage('Admin', `${user.username} left the room`)
      );
      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
      })
    }
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
