const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} has joined`);
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("leaveCall", () => {
    console.log("Ended");
    socket.broadcast.emit("callEnded");
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", {
      signal: data.signal,
      name: data.name,
    });
  });
});

server.listen(5000, () => console.log("server running"));
