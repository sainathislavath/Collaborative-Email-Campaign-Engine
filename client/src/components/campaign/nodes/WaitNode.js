import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const WaitNode = ({ data, selected }) => {
  return (
    <Card
      className={`wait-node ${selected ? "selected" : ""}`}
      sx={{ minWidth: 200, border: selected ? "2px solid #4f46e5" : "none" }}
    >
      <Handle type="target" position={Position.Top} />
      <CardContent>
        <div className="node-header">
          <AccessTimeIcon color="primary" />
          <Typography variant="h6">{data.name || "Wait"}</Typography>
        </div>
        <Typography variant="body2">
          {data.duration || "No duration set"}
        </Typography>
      </CardContent>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

export default WaitNode;
