import React from "react";
import { useDrag } from "react-dnd";
import { Box, Paper, Typography, Button } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import SettingsIcon from "@mui/icons-material/Settings";

const NodePalette = () => {
  const nodeTypes = [
    { type: "email", name: "Email", icon: <MailIcon /> },
    { type: "wait", name: "Wait", icon: <AccessTimeIcon /> },
    { type: "condition", name: "Condition", icon: <CallSplitIcon /> },
    { type: "action", name: "Action", icon: <SettingsIcon /> },
  ];

  return (
    <Paper
      elevation={2}
      sx={{ width: 200, p: 2, height: "100%", overflowY: "auto" }}
    >
      <Typography variant="h6" gutterBottom>
        Node Palette
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {nodeTypes.map((nodeType) => (
          <DraggableNode key={nodeType.type} nodeType={nodeType} />
        ))}
      </Box>
    </Paper>
  );
};

const DraggableNode = ({ nodeType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "node",
    item: { type: nodeType.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Button
      ref={drag}
      variant="outlined"
      startIcon={nodeType.icon}
      sx={{
        justifyContent: "flex-start",
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      fullWidth
    >
      {nodeType.name}
    </Button>
  );
};

export default NodePalette;
