// src/components/campaign/PropertiesPanel.js
import React from "react";
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
} from "@mui/material";

const PropertiesPanel = ({ node, onNodeChange }) => {
  if (!node) {
    return (
      <Paper className="properties-panel" elevation={3}>
        <Typography variant="h6">Properties</Typography>
        <Typography variant="body2">
          Select a node to edit its properties
        </Typography>
      </Paper>
    );
  }

  const handleChange = (field, value) => {
    // Create a deep copy of the node data
    const updatedData = { ...node.data, [field]: value };
    onNodeChange(node.id, { data: updatedData });
  };

  const renderEmailProperties = () => (
    <>
      <TextField
        label="Email Name"
        value={node.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Subject"
        value={node.data.subject || ""}
        onChange={(e) => handleChange("subject", e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Template</InputLabel>
        <Select
          value={node.data.template || ""}
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
        value={node.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />

      <Typography variant="subtitle1" mt={2}>
        Conditions
      </Typography>

      {node.data.conditions?.map((condition, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={condition.type || ""}
              onChange={(e) => {
                const newConditions = [...node.data.conditions];
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
                const newConditions = [...node.data.conditions];
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
        </Box>
      ))}

      <Button
        variant="outlined"
        onClick={() => {
          const newConditions = [
            ...(node.data.conditions || []),
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
        value={node.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Duration"
        value={node.data.duration || ""}
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
        value={node.data.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Action Type</InputLabel>
        <Select
          value={node.data.actionType || ""}
          onChange={(e) => handleChange("actionType", e.target.value)}
        >
          <MenuItem value="tag">Add Tag</MenuItem>
          <MenuItem value="segment">Add to Segment</MenuItem>
          <MenuItem value="webhook">Trigger Webhook</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  return (
    <Paper className="properties-panel" elevation={3}>
      <Typography variant="h6">Properties</Typography>

      {node.type === "email" && renderEmailProperties()}
      {node.type === "condition" && renderConditionProperties()}
      {node.type === "wait" && renderWaitProperties()}
      {node.type === "action" && renderActionProperties()}
    </Paper>
  );
};

export default PropertiesPanel;
