// src/components/campaign/PropertiesPanel.js
import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PropertiesPanel = ({ node, onNodeChange }) => {
  const [localNode, setLocalNode] = useState(node);

  // Update localNode when node prop changes
  useEffect(() => {
    setLocalNode(node);
  }, [node]);

  const handleChange = (field, value) => {
    // Create a deep copy of the node data
    const updatedData = { ...localNode.data, [field]: value };
    const updatedNode = { ...localNode, data: updatedData };

    // Update local state immediately
    setLocalNode(updatedNode);

    // Propagate changes to parent
    onNodeChange(node.id, { data: updatedData });
  };

  const handleDeleteCondition = (index) => {
    const newConditions = [...localNode.data.conditions];
    newConditions.splice(index, 1);
    handleChange("conditions", newConditions);
  };

  const renderEmailProperties = () => (
    <>
      <TextField
        label="Email Name"
        value={localNode.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Subject"
        value={localNode.data.subject || ""}
        onChange={(e) => handleChange("subject", e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Template</InputLabel>
        <Select
          value={localNode.data.template || ""}
          onChange={(e) => handleChange("template", e.target.value)}
        >
          <MenuItem value="welcome">Welcome Email</MenuItem>
          <MenuItem value="promotion">Promotion</MenuItem>
          <MenuItem value="newsletter">Newsletter</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  const renderConditionProperties = () => (
    <>
      <TextField
        label="Condition Name"
        value={localNode.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography variant="subtitle1" mt={2}>
        Conditions
      </Typography>

      {localNode.data.conditions?.map((condition, index) => (
        <Box
          key={index}
          sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
        >
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={condition.type || ""}
              onChange={(e) => {
                const newConditions = [...localNode.data.conditions];
                newConditions[index] = {
                  ...newConditions[index],
                  type: e.target.value,
                };
                handleChange("conditions", newConditions);
              }}
            >
              <MenuItem value="behavior">Behavior</MenuItem>
              <MenuItem value="time">Time</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Event</InputLabel>
            <Select
              value={condition.event || ""}
              onChange={(e) => {
                const newConditions = [...localNode.data.conditions];
                newConditions[index] = {
                  ...newConditions[index],
                  event: e.target.value,
                };
                handleChange("conditions", newConditions);
              }}
            >
              <MenuItem value="open">Email Opened</MenuItem>
              <MenuItem value="click">Link Clicked</MenuItem>
              <MenuItem value="purchase">Purchase Made</MenuItem>
              <MenuItem value="idle">No Activity</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={() => handleDeleteCondition(index)}
            color="error"
            aria-label="delete condition"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={() => {
          const newConditions = [
            ...(localNode.data.conditions || []),
            { type: "behavior", event: "open" },
          ];
          handleChange("conditions", newConditions);
        }}
      >
        Add Condition
      </Button>
    </>
  );

  const renderWaitProperties = () => (
    <>
      <TextField
        label="Wait Name"
        value={localNode.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Duration"
        value={localNode.data.duration || ""}
        onChange={(e) => handleChange("duration", e.target.value)}
        fullWidth
        margin="normal"
        helperText="e.g., 2d, 12h, 30m"
      />
    </>
  );

  const renderActionProperties = () => (
    <>
      <TextField
        label="Action Name"
        value={localNode.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Action Type</InputLabel>
        <Select
          value={localNode.data.actionType || ""}
          onChange={(e) => handleChange("actionType", e.target.value)}
        >
          <MenuItem value="tag">Add Tag</MenuItem>
          <MenuItem value="segment">Add to Segment</MenuItem>
          <MenuItem value="webhook">Trigger Webhook</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  if (!localNode) {
    return (
      <Paper className="properties-panel" elevation={3}>
        <Typography variant="h6">Properties</Typography>
        <Typography variant="body2">
          Select a node to edit its properties
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className="properties-panel" elevation={3}>
      <Typography variant="h6">Properties</Typography>

      {localNode.type === "email" && renderEmailProperties()}
      {localNode.type === "condition" && renderConditionProperties()}
      {localNode.type === "wait" && renderWaitProperties()}
      {localNode.type === "action" && renderActionProperties()}
    </Paper>
  );
};

export default PropertiesPanel;
