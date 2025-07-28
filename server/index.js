const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let currentSchema = {
  steps: [],
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("schema:update", currentSchema);

  socket.on("schema:update", (schema) => {
    currentSchema = schema;
    socket.broadcast.emit("schema:update", schema);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
