const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app); // creating the server outside of the express library to later connect it to socket io
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", (socket) => {// socket is an object that contains info on the connection
  console.log("new webSocket connection");

  socket.emit("message", "hello world");
  socket.broadcast.emit('message', 'a new user joined')

  socket.on("message", (msg) => {
    io.emit("message", msg); // io emit to every connection (except current)
  });

  socket.on('disconnect', () => {
      io.emit('message', 'user has left')
      
  })
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
