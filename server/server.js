const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("history", messages);

  socket.on("sendMessage", (data) => {
    messages.push(data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
