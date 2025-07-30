import React from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import CallSplitIcon from "@mui/icons-material/CallSplit";

const ConditionNode = ({ data, selected }) => {
  return (
    <Card
      className={`condition-node ${selected ? "selected" : ""}`}
      sx={{ minWidth: 200, border: selected ? "2px solid #4f46e5" : "none" }}
    >
      <Handle type="target" position={Position.Top} />
      <CardContent>
        <div className="node-header">
          <CallSplitIcon color="primary" />
          <Typography variant="h6">{data.name || "Condition"}</Typography>
        </div>
        <div className="condition-chips">
          {data.conditions?.map((condition, index) => (
            <Chip
              key={index}
              label={`${condition.type}: ${condition.event}`}
              size="small"
              variant="outlined"
            />
          ))}
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} id="true" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: "75%" }}
      />
    </Card>
  );
};

export default ConditionNode;
