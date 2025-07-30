// src/contexts/WebSocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  initiateSocketConnection,
  disconnectSocket,
  // subscribeToCampaignUpdates,
  subscribeToCollaboratorUpdates,
  joinCampaign,
  leaveCampaign,
  sendCampaignUpdate,
} from "../services/socket";
import { useRef } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const campaignUpdateHandlers = useRef(new Set());

  useEffect(() => {
    const newSocket = initiateSocketConnection();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setConnected(true);
      console.log("Connected to WebSocket server");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from WebSocket server");
    });

    // Set up campaign update handler
    newSocket.on("campaign_update", (data) => {
      campaignUpdateHandlers.current.forEach((handler) => handler(data));
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const joinCampaignRoom = useCallback(
    (campaignId, userId) => {
      if (socket && connected) {
        joinCampaign(campaignId, userId);

        const handleCollaboratorsUpdate = (collaboratorsData) => {
          setCollaborators(collaboratorsData.collaborators);
        };

        subscribeToCollaboratorUpdates(handleCollaboratorsUpdate);
      }
    },
    [socket, connected]
  );

  const leaveCampaignRoom = useCallback(
    (campaignId, userId) => {
      if (socket && connected) {
        leaveCampaign(campaignId, userId);
      }
    },
    [socket, connected]
  );

  const updateCampaign = useCallback(
    (campaignId, campaign, userId) => {
      if (socket && connected) {
        sendCampaignUpdate(campaignId, campaign, userId);
      }
    },
    [socket, connected]
  );

  const subscribeToCampaign = useCallback((callback) => {
    campaignUpdateHandlers.current.add(callback);

    // Return unsubscribe function
    return () => {
      campaignUpdateHandlers.current.delete(callback);
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        connected,
        collaborators,
        joinCampaignRoom,
        leaveCampaignRoom,
        updateCampaign,
        subscribeToCampaign,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
