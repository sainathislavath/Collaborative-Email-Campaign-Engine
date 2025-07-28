import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, Mail, Clock, GitFork, Sun, Moon } from "lucide-react";

// --- Initial Data Structure (Schema) ---
// This data is now the single source of truth, managed locally.
const getInitialCampaignData = () => ({
  nodes: [
    {
      id: "start",
      type: "TRIGGER",
      position: { x: 50, y: 200 },
      data: { name: "Campaign Start" },
    },
    {
      id: "email1",
      type: "EMAIL",
      position: { x: 300, y: 150 },
      data: {
        subject: "Welcome to our newsletter!",
        content: "Hi there, thanks for signing up!",
      },
    },
    {
      id: "delay1",
      type: "DELAY",
      position: { x: 550, y: 200 },
      data: { duration: 3, unit: "days" },
    },
    {
      id: "condition1",
      type: "CONDITION",
      position: { x: 800, y: 200 },
      data: { type: "EMAIL_OPEN", targetNodeId: "email1" },
    },
    {
      id: "email2_yes",
      type: "EMAIL",
      position: { x: 1050, y: 100 },
      data: {
        subject: "Thanks for reading!",
        content: "We noticed you opened our last email...",
      },
    },
    {
      id: "email2_no",
      type: "EMAIL",
      position: { x: 1050, y: 300 },
      data: {
        subject: "Still interested?",
        content: "Just checking in since we haven't heard from you.",
      },
    },
  ],
  connections: [
    { id: "c1", source: "start", target: "email1", sourceHandle: "output" },
    { id: "c2", source: "email1", target: "delay1", sourceHandle: "output" },
    {
      id: "c3",
      source: "delay1",
      target: "condition1",
      sourceHandle: "output",
    },
    {
      id: "c4",
      source: "condition1",
      target: "email2_yes",
      sourceHandle: "yes",
    },
    { id: "c5", source: "condition1", target: "email2_no", sourceHandle: "no" },
  ],
  theme: "light",
  viewport: { x: 0, y: 0, zoom: 1 },
});

// --- Components ---

const Node = ({ node, onDrag, onUpdateNode, isSelected, onSelectNode }) => {
  const nodeRef = useRef(null);

  const handleMouseDown = (e) => {
    // Prevent drag from starting on form elements
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "SELECT"
    ) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    onSelectNode(node.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startNodeX = node.position.x;
    const startNodeY = node.position.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onDrag(node.id, { x: startNodeX + dx, y: startNodeY + dy });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const renderNodeContent = () => {
    switch (node.type) {
      case "TRIGGER":
        return (
          <div className="flex items-center space-x-2">
            <ArrowRight className="text-green-500" size={20} />
            <span className="font-semibold">{node.data.name}</span>
          </div>
        );
      case "EMAIL":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="text-blue-500" size={20} />
              <span className="font-semibold">Send Email</span>
            </div>
            <input
              type="text"
              value={node.data.subject}
              onChange={(e) =>
                onUpdateNode(node.id, { ...node.data, subject: e.target.value })
              }
              className="w-full p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
              placeholder="Email Subject"
            />
            <textarea
              value={node.data.content}
              onChange={(e) =>
                onUpdateNode(node.id, { ...node.data, content: e.target.value })
              }
              className="w-full p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
              placeholder="Email Content"
              rows={2}
            />
          </div>
        );
      case "DELAY":
        return (
          <div className="flex items-center space-x-2">
            <Clock className="text-yellow-500" size={20} />
            <span className="font-semibold">Wait for</span>
            <input
              type="number"
              value={node.data.duration}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  ...node.data,
                  duration: parseInt(e.target.value) || 0,
                })
              }
              className="w-16 p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
            />
            <select
              value={node.data.unit}
              onChange={(e) =>
                onUpdateNode(node.id, { ...node.data, unit: e.target.value })
              }
              className="p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
            >
              <option>days</option>
              <option>hours</option>
              <option>minutes</option>
            </select>
          </div>
        );
      case "CONDITION":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <GitFork className="text-purple-500" size={20} />
              <span className="font-semibold">Condition: If/Else</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Based on Email #{node.data.targetNodeId.slice(-4)}
            </p>
            <select
              value={node.data.type}
              onChange={(e) =>
                onUpdateNode(node.id, { ...node.data, type: e.target.value })
              }
              className="w-full p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="EMAIL_OPEN">User Opened Email</option>
              <option value="EMAIL_CLICK">User Clicked Link</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={nodeRef}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNode(node.id);
      }}
      className={`absolute p-3 rounded-lg shadow-md cursor-pointer transition-all duration-150 ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-800"
          : "ring-1 ring-gray-300 dark:ring-gray-600"
      } bg-white dark:bg-gray-800`}
      style={{ left: node.position.x, top: node.position.y, width: 250 }}
    >
      {renderNodeContent()}

      {/* Input Handle */}
      {node.type !== "TRIGGER" && (
        <div
          className="absolute w-3 h-3 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800"
          style={{ left: "-6px", top: "50%", transform: "translateY(-50%)" }}
          data-handle-id={`${node.id}-input`}
        />
      )}

      {/* Output Handles */}
      {node.type === "CONDITION" ? (
        <>
          <div
            className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
            style={{ right: "-6px", top: "33%", transform: "translateY(-50%)" }}
            data-handle-id={`${node.id}-yes`}
          >
            <span className="absolute left-[-25px] top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
              Yes
            </span>
          </div>
          <div
            className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
            style={{ right: "-6px", top: "66%", transform: "translateY(-50%)" }}
            data-handle-id={`${node.id}-no`}
          >
            <span className="absolute left-[-22px] top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
              No
            </span>
          </div>
        </>
      ) : (
        node.type !== "TRIGGER" && (
          <div
            className="absolute w-3 h-3 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800"
            style={{ right: "-6px", top: "50%", transform: "translateY(-50%)" }}
            data-handle-id={`${node.id}-output`}
          />
        )
      )}
    </div>
  );
};

const Connection = ({ from, to, sourceHandle }) => {
  if (!from || !to) return null;

  const handlePositions = {
    output: { x: from.position.x + 250, y: from.position.y + 50 },
    yes: { x: from.position.x + 250, y: from.position.y + 33 },
    no: { x: from.position.x + 250, y: from.position.y + 66 },
    input: { x: to.position.x, y: to.position.y + 50 },
  };

  const start = handlePositions[sourceHandle] || handlePositions.output;
  const end = handlePositions.input;

  const dx = end.x - start.x;
  const path = `M ${start.x} ${start.y} C ${start.x + dx * 0.5} ${start.y}, ${
    end.x - dx * 0.5
  } ${end.y}, ${end.x} ${end.y}`;

  return (
    <path
      d={path}
      strokeWidth="2"
      className="stroke-gray-400 dark:stroke-gray-500"
      fill="none"
    />
  );
};

const Sidebar = ({ onAddNode }) => {
  const nodeTypes = [
    { type: "EMAIL", label: "Send Email", icon: <Mail size={20} /> },
    { type: "DELAY", label: "Add Delay", icon: <Clock size={20} /> },
    {
      type: "CONDITION",
      label: "If/Else Condition",
      icon: <GitFork size={20} />,
    },
  ];

  return (
    <div className="absolute top-0 left-0 h-full bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700 shadow-lg z-20">
      <h3 className="text-lg font-bold mb-4">Add Steps</h3>
      <div className="space-y-2">
        {nodeTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onAddNode(type)}
            className="w-full flex items-center space-x-3 p-2 rounded-md text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Toolbar = ({ theme, onToggleTheme }) => (
  <div className="absolute top-4 right-4 flex items-center space-x-4 z-20">
    <button
      onClick={onToggleTheme}
      className="p-2 rounded-full bg-white dark:bg-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  </div>
);

export default function App() {
  // All state is now managed locally using useState.
  const [campaignData, setCampaignData] = useState(getInitialCampaignData);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const campaignCanvasRef = useRef(null);

  // --- Theme Effect ---
  useEffect(() => {
    if (campaignData?.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [campaignData?.theme]);

  const handleDragNode = (nodeId, position) => {
    setCampaignData((prev) => {
      const newNodes = prev.nodes.map((n) =>
        n.id === nodeId ? { ...n, position } : n
      );
      return { ...prev, nodes: newNodes };
    });
  };

  const handleUpdateNodeData = (nodeId, data) => {
    setCampaignData((prev) => {
      const newNodes = prev.nodes.map((n) =>
        n.id === nodeId ? { ...n, data } : n
      );
      return { ...prev, nodes: newNodes };
    });
  };

  const handleAddNode = (type) => {
    const newNode = {
      id: `${type.toLowerCase()}_${crypto.randomUUID().slice(0, 4)}`,
      type,
      position: { x: 200, y: 400 }, // Default position for new nodes
      data:
        type === "EMAIL"
          ? { subject: "", content: "" }
          : type === "DELAY"
          ? { duration: 1, unit: "days" }
          : { type: "EMAIL_OPEN", targetNodeId: "email1" }, // Default condition
    };
    setCampaignData((prev) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
  };

  const handleToggleTheme = () => {
    setCampaignData((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  if (!campaignData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        Loading...
      </div>
    );
  }

  const { nodes, connections, theme } = campaignData;

  return (
    <div className="w-full h-screen font-sans bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden relative">
      <Toolbar theme={theme} onToggleTheme={handleToggleTheme} />
      <Sidebar onAddNode={handleAddNode} />
      <div
        ref={campaignCanvasRef}
        className="w-full h-full pl-[220px]"
        onClick={() => setSelectedNodeId(null)}
      >
        <div className="relative w-full h-full overflow-auto">
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: "200vw", height: "200vh" }}
          >
            <defs>
              <pattern
                id="pattern-circles"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="1"
                  className="fill-gray-300 dark:fill-gray-700"
                ></circle>
              </pattern>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#pattern-circles)"
            ></rect>
            <g>
              {connections.map((conn) => (
                <Connection
                  key={conn.id}
                  from={nodes.find((n) => n.id === conn.source)}
                  to={nodes.find((n) => n.id === conn.target)}
                  sourceHandle={conn.sourceHandle}
                />
              ))}
            </g>
          </svg>

          <div className="relative w-full h-full">
            {nodes.map((node) => (
              <Node
                key={node.id}
                node={node}
                onDrag={handleDragNode}
                onUpdateNode={handleUpdateNodeData}
                isSelected={selectedNodeId === node.id}
                onSelectNode={setSelectedNodeId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
