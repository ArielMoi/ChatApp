const socket = io();

document.querySelector(".message-from").addEventListener("submit", (e) => {
  event.preventDefault();
  const msg = e.target.elements.message.value;
  socket.emit("message", msg);
});

socket.on("message", (msg) => {
  console.log(msg);
});
