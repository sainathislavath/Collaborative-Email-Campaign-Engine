// src/components/campaign/CampaignBuilder.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCampaign } from "../../contexts/CampaignContext";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../contexts/WebSocketContext";
import Canvas from "./Canvas";
import NodePalette from "./NodePalette";
import PropertiesPanel from "./PropertiesPanel";
import CampaignHeader from "./CampaignHeader";
import { useDebounce } from "../../hooks/useDebounce";

const CampaignBuilder = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    currentCampaign,
    loading,
    getCampaign,
    updateCampaignData,
    setCurrentCampaign,
  } = useCampaign();
  const {
    connected,
    collaborators,
    joinCampaignRoom,
    leaveCampaignRoom,
    updateCampaign,
    subscribeToCampaign,
  } = useWebSocket();

  const [selectedNode, setSelectedNode] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Memoize the campaign ID to prevent unnecessary effect runs
  const campaignId = useMemo(() => id, [id]);

  // Load campaign data
  useEffect(() => {
    if (campaignId) {
      getCampaign(campaignId);
    }
  }, [campaignId, getCampaign]);

  // Join campaign room and subscribe to updates
  useEffect(() => {
    let unsubscribe;

    if (connected && user && campaignId) {
      joinCampaignRoom(campaignId, user.id);

      // Subscribe to real-time updates
      unsubscribe = subscribeToCampaign(({ campaign, userId }) => {
        if (userId !== user.id) {
          setCurrentCampaign(campaign);
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (campaignId && user) {
        leaveCampaignRoom(campaignId, user.id);
      }
    };
  }, [
    connected,
    user,
    campaignId,
    joinCampaignRoom,
    leaveCampaignRoom,
    subscribeToCampaign,
    setCurrentCampaign,
  ]);

  // Update selectedNode when campaign changes
  useEffect(() => {
    if (currentCampaign && selectedNode) {
      const updatedNode = currentCampaign.nodes.find(
        (node) => node.id === selectedNode.id
      );
      if (updatedNode) {
        setSelectedNode(updatedNode);
      }
    }
  }, [currentCampaign, selectedNode]);

  const handleNodeChange = useCallback(
    (nodeId, updates) => {
      if (!currentCampaign) return;

      const updatedNodes = currentCampaign.nodes.map((node) => {
        if (node.id === nodeId) {
          // If we're updating the data, merge it with existing data
          if (updates.data) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates.data,
              },
            };
          }
          // Otherwise, just apply the updates
          return { ...node, ...updates };
        }
        return node;
      });

      const updatedCampaign = { ...currentCampaign, nodes: updatedNodes };
      setCurrentCampaign(updatedCampaign);
      setIsDirty(true);

      // Update the selected node if it's the one being changed
      if (selectedNode && selectedNode.id === nodeId) {
        const updatedSelectedNode = updatedNodes.find(
          (node) => node.id === nodeId
        );
        setSelectedNode(updatedSelectedNode);
      }

      // Send real-time update
      if (connected && user) {
        updateCampaign(campaignId, updatedCampaign, user.id);
      }
    },
    [
      currentCampaign,
      setCurrentCampaign,
      selectedNode,
      connected,
      user,
      campaignId,
      updateCampaign,
    ]
  );

  const handleEdgesChange = useCallback(
    (edges) => {
      if (!currentCampaign) return;

      const updatedCampaign = { ...currentCampaign, edges };
      setCurrentCampaign(updatedCampaign);
      setIsDirty(true);

      // Send real-time update
      if (connected && user) {
        updateCampaign(campaignId, updatedCampaign, user.id);
      }
    },
    [
      currentCampaign,
      setCurrentCampaign,
      connected,
      user,
      campaignId,
      updateCampaign,
    ]
  );

  // Debounce the position change handler to prevent too many updates
  const debouncedPositionChange = useDebounce((nodes) => {
    if (!currentCampaign) return;

    const updatedCampaign = { ...currentCampaign, nodes };
    setCurrentCampaign(updatedCampaign);
    setIsDirty(true);

    // Send real-time update
    if (connected && user) {
      updateCampaign(campaignId, updatedCampaign, user.id);
    }
  }, 300);

  const handleNodesPositionChange = useCallback(
    (nodes) => {
      debouncedPositionChange(nodes);
    },
    [debouncedPositionChange]
  );

  const handleSave = async () => {
    if (!currentCampaign) return;

    try {
      await updateCampaignData(campaignId, currentCampaign);
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleAddNode = useCallback(
    (type, position) => {
      if (!currentCampaign) return;

      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: {
          name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        },
      };

      if (type === "email") {
        newNode.data.subject = "Subject line";
        newNode.data.template = "welcome";
      } else if (type === "condition") {
        newNode.data.conditions = [{ type: "behavior", event: "open" }];
      } else if (type === "wait") {
        newNode.data.duration = "1d";
      } else if (type === "action") {
        newNode.data.actionType = "tag";
      }

      const updatedNodes = [...currentCampaign.nodes, newNode];
      const updatedCampaign = { ...currentCampaign, nodes: updatedNodes };
      setCurrentCampaign(updatedCampaign);
      setIsDirty(true);

      // Send real-time update
      if (connected && user) {
        updateCampaign(campaignId, updatedCampaign, user.id);
      }
    },
    [
      currentCampaign,
      setCurrentCampaign,
      connected,
      user,
      campaignId,
      updateCampaign,
    ]
  );

  const handleCampaignChange = useCallback(
    (updatedCampaign) => {
      setCurrentCampaign(updatedCampaign);
      setIsDirty(true);

      // Send real-time update
      if (connected && user) {
        updateCampaign(id, updatedCampaign, user.id);
      }
    },
    [setCurrentCampaign, connected, user, id, updateCampaign]
  );

  if (loading) return <div>Loading campaign...</div>;
  if (!currentCampaign) return <div>Campaign not found</div>;

  return (
    <div className="campaign-builder">
      <CampaignHeader
        campaign={currentCampaign}
        onSave={handleSave}
        isDirty={isDirty}
        collaborators={collaborators}
        onCampaignChange={handleCampaignChange}
      />

      <div className="builder-container">
        <NodePalette />
        <Canvas
          nodes={currentCampaign.nodes}
          edges={currentCampaign.edges}
          onNodeSelect={handleNodeSelect}
          onNodeChange={handleNodeChange}
          onAddNode={handleAddNode}
          onEdgesChange={handleEdgesChange}
          onNodesPositionChange={handleNodesPositionChange}
        />
        <PropertiesPanel node={selectedNode} onNodeChange={handleNodeChange} />
      </div>
    </div>
  );
};

export default CampaignBuilder;
