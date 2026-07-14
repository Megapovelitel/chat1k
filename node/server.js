const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Forward SDP Offer to other connected clients
  socket.on("offer", (data) => {
    console.log("new offer", data);
    socket.broadcast.emit("offer", data);
  });

  // Forward SDP Answer to other connected clients
  socket.on("answer", (data) => {
    console.log("new answer", data);
    socket.broadcast.emit("answer", data);
  });

  // Forward network routing data
  socket.on("ice-candidate", (data) => {
    console.log("new ice", data);
    socket.broadcast.emit("ice-candidate", data);
  });
});

http.listen(3000, () => {
  console.log("Signaling server running on http://localhost:3000");
});
