export default function Step({ step }) {
  return (
    <div className="border p-4 rounded shadow bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold text-lg">{step.type.toUpperCase()}</h3>
      <p>{step.content}</p>
      <small>Delay: {step.delay}</small>
    </div>
  );
}
