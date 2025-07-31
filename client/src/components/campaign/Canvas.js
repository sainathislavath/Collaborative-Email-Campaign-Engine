// src/components/campaign/Canvas.js
import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  // NodeChange,
  // EdgeChange,
  // Connection,
  ReactFlowProvider,
} from "reactflow";
import { useDrop } from "react-dnd";
import "reactflow/dist/style.css";
import EmailNode from "./nodes/EmailNode";
import WaitNode from "./nodes/WaitNode";
import ConditionNode from "./nodes/ConditionNode";
import ActionNode from "./nodes/ActionNode";

const nodeTypes = {
  email: EmailNode,
  wait: WaitNode,
  condition: ConditionNode,
  action: ActionNode,
};

const Canvas = ({ nodes, edges, onNodeSelect, onNodeChange, onAddNode }) => {
  const [flowNodes, setFlowNodes] = useState(nodes);
  const [flowEdges, setFlowEdges] = useState(edges);
  const reactFlowWrapper = useRef(null);

  // Update flowNodes and flowEdges when props change
  useEffect(() => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, [nodes, edges]);

  const [{ isOver }, drop] = useDrop({
    accept: "node",
    drop: (item, monitor) => {
      const position = monitor.getClientOffset();
      if (position && reactFlowWrapper.current) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const x = position.x - reactFlowBounds.left;
        const y = position.y - reactFlowBounds.top;
        onAddNode(item.type, { x, y });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(reactFlowWrapper);

  const onNodesChange = useCallback((changes) => {
    setFlowNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setFlowEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection) => {
    setFlowEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeClick = useCallback(
    (event, node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  return (
    <div
      className="canvas-container"
      ref={reactFlowWrapper}
      style={{ border: isOver ? "2px dashed #4f46e5" : "none" }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable
        nodesConnectable
        elementsSelectable
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionMode="loose"
        deleteKeyCode={46}
        onPaneClick={() => onNodeSelect(null)}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

const CanvasWithProvider = (props) => (
  <ReactFlowProvider>
    <Canvas {...props} />
  </ReactFlowProvider>
);

export default CanvasWithProvider;