// src/services/socket.js
import io from "socket.io-client";

let socket;

export const initiateSocketConnection = () => {
  socket = io(
    process.env.REACT_APP_SERVER_URL ||
      "https://collaborative-email-campaign-engine.vercel.app/" // http://localhost:5000
  );
  console.log("Connecting socket...");
  return socket;
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const subscribeToCampaignUpdates = (cb) => {
  if (!socket) return () => {};
  socket.on("campaign_update", cb);

  // Return unsubscribe function
  return () => {
    socket.off("campaign_update", cb);
  };
};

export const subscribeToCollaboratorUpdates = (cb) => {
  if (!socket) return () => {};
  socket.on("collaborators_update", cb);

  // Return unsubscribe function
  return () => {
    socket.off("collaborators_update", cb);
  };
};

export const joinCampaign = (campaignId, userId) => {
  if (socket) socket.emit("join_campaign", { campaignId, userId });
};

export const leaveCampaign = (campaignId, userId) => {
  if (socket) socket.emit("leave_campaign", { campaignId, userId });
};

export const sendCampaignUpdate = (campaignId, campaign, userId) => {
  if (socket) socket.emit("campaign_change", { campaignId, campaign, userId });
};

export default socket;
