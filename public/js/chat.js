const socket = io();

const messagesElement = document.querySelector("#messages");

// templated
const messageTemplate = document.querySelector("#message-template").innerHTML; // to get the html data and not script

//options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true}) // ignoreQueryPrefix to hide ?

socket.on("message", (msg) => {
  console.log(msg);

  const html = Mustache.render(messageTemplate, {
    message: msg.text,
    createdAt: moment(msg.createdAt).format('h:mm a')
  });

  messagesElement.insertAdjacentHTML("beforeend", html);
});

socket.on("location", (location) => {
  console.log(location);

  const html = Mustache.render(
    document.querySelector("#location-template").innerHTML,
    {
      location: location.location,
      createdAt: moment(location.createdAt).format("h:mm a"),
    }
  );

  messagesElement.insertAdjacentHTML("beforeend", html);
});

document.querySelector(".message-from").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.message.value;
  socket.emit("message", msg, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("message delivered");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    // check if cursor have geolocation options
    return alert("geolocation isn`t supported");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      `http://google.com/maps/?q=${position.coords.latitude},${position.coords.longitude}`,
      (error) => {
        console.log("location delivered");
      }
    );
  });
});

socket.emit('join', {username, room})