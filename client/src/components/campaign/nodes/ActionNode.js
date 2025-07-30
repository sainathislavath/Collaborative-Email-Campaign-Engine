import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const ActionNode = ({ data, selected }) => {
  return (
    <Card
      className={`action-node ${selected ? "selected" : ""}`}
      sx={{ minWidth: 200, border: selected ? "2px solid #4f46e5" : "none" }}
    >
      <Handle type="target" position={Position.Top} />
      <CardContent>
        <div className="node-header">
          <SettingsIcon color="primary" />
          <Typography variant="h6">{data.name || "Action"}</Typography>
        </div>
        <Typography variant="body2">
          {data.actionType || "No action set"}
        </Typography>
      </CardContent>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default ActionNode;
