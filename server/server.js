require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const campaignRoutes = require("./routes/campaigns");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);

// Socket.IO for real-time collaboration
const activeCampaigns = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  // Join a campaign room
  socket.on("join_campaign", ({ campaignId, userId }) => {
    socket.join(campaignId);

    if (!activeCampaigns[campaignId]) {
      activeCampaigns[campaignId] = new Set();
    }
    activeCampaigns[campaignId].add(userId);

    // Notify others in the room
    socket.to(campaignId).emit("user_joined", { userId });

    // Send current collaborators list
    io.to(campaignId).emit("collaborators_update", {
      collaborators: Array.from(activeCampaigns[campaignId]),
    });
  });

  // Handle campaign changes
  socket.on("campaign_change", ({ campaignId, campaign, userId }) => {
    socket.to(campaignId).emit("campaign_update", { campaign, userId });
  });

  // Leave a campaign room
  socket.on("leave_campaign", ({ campaignId, userId }) => {
    socket.leave(campaignId);

    if (activeCampaigns[campaignId]) {
      activeCampaigns[campaignId].delete(userId);

      if (activeCampaigns[campaignId].size === 0) {
        delete activeCampaigns[campaignId];
      } else {
        // Update collaborators list
        io.to(campaignId).emit("collaborators_update", {
          collaborators: Array.from(activeCampaigns[campaignId]),
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
