import Step from "./Step";

export default function Canvas({ schema, socket }) {
  const handleAddStep = () => {
    const newStep = {
      id: Date.now().toString(),
      type: "email",
      content: "New Email Step",
      delay: "2 days",
    };
    const updatedSchema = {
      ...schema,
      steps: [...schema.steps, newStep],
    };
    socket.emit("schema:update", updatedSchema);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={handleAddStep}
      >
        + Add Step
      </button>
      <div className="flex flex-col gap-4">
        {schema.steps.map((step) => (
          <Step key={step.id} step={step} />
        ))}
      </div>
    </div>
  );
}
