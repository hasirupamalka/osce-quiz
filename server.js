const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Enable CORS so your frontend can communicate with the backend
const io = new Server(server, {
  cors: { origin: "*" }
});

// Store the current state of the buzzer
let buzzerState = { group: "", locked: false };

io.on("connection", (socket) => {
  // Send the current state to newly connected users
  socket.emit("buzzer_update", buzzerState);

  // Listen for a buzz from a group
  socket.on("buzz", (group) => {
    if (!buzzerState.locked) {
      buzzerState = { group: group, locked: true };
      io.emit("buzzer_update", buzzerState); // Broadcast to everyone
    }
  });

  // Listen for the reset command from the main screen
  socket.on("reset", () => {
    buzzerState = { group: "", locked: false };
    io.emit("buzzer_update", buzzerState);
  });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Buzzer server running on port ${PORT}`));
