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

  // Handle ResizeObserver error
  useEffect(() => {
    const originalError = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      if (
        message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        return false; // Suppress the error
      }

      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }

      return false;
    };

    return () => {
      window.onerror = originalError;
    };
  }, []);

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
        deleteKeyCode={46} // Delete key
        onPaneClick={() => onNodeSelect(null)} // Deselect node when clicking on pane
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default (props) => (
  <ReactFlowProvider>
    <Canvas {...props} />
  </ReactFlowProvider>
);
