const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const app = express();
const server = http.createServer(app); // creating the server outside of the express library to later connect it to socket io
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  // socket is an object that contains info on the connection
  console.log("new webSocket connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", generateMessage("you entered chat")); // socket emit to current user
    socket.broadcast.to(room).emit("message", generateMessage(`${username} has joined the chat`));
  });

  socket.on("message", (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("bad words");
    }

    io.to('a').emit("message", generateMessage(msg)); // io emit to all connected clients
    callback();
  });

  socket.on("sendLocation", (location, callback) => {
    io.emit("location", generateLocationMessage(location));
    callback();
  });

  socket.on("disconnect", () => {
    io.emit("message", "user has left");
  });
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
