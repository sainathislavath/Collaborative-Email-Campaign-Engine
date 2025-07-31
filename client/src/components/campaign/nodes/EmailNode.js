// src/components/campaign/nodes/EmailNode.js
import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

const EmailNode = ({ data, selected }) => {
  return (
    <Card
      className={`email-node ${selected ? "selected" : ""}`}
      sx={{ minWidth: 200, border: selected ? "2px solid #4f46e5" : "none" }}
    >
      <Handle type="target" position={Position.Top} />
      <CardContent>
        <div className="node-header">
          <MailIcon color="primary" />
          <Typography variant="h6">{data.name || "Email"}</Typography>
        </div>
        <Typography variant="body2">{data.subject || "No subject"}</Typography>
        <Typography variant="caption" color="textSecondary">
          {data.template || "No template selected"}
        </Typography>
      </CardContent>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default EmailNode;
