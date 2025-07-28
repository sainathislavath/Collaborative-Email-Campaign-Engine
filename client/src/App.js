import { useEffect } from "react";
import { io } from "socket.io-client";
import useStore from "./store";
import Canvas from "./canvas/Canvas";

const socket = io("http://localhost:3000");

export default function App() {
  const { schema, setSchema } = useStore();

  useEffect(() => {
    socket.on("schema:update", (newSchema) => setSchema(newSchema));
    return () => socket.off("schema:update");
  }, [setSchema]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Email Campaign Builder</h1>
      <Canvas schema={schema} socket={socket} />
    </div>
  );
}
