// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Handle ResizeObserver loop error
const resizeObserverErrorHandler = (e) => {
  if (
    e.message ===
    "ResizeObserver loop completed with undelivered notifications."
  ) {
    // Suppress the error
    return;
  }
  throw e;
};

// Add error listener
window.addEventListener("error", resizeObserverErrorHandler);

// Also handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  if (
    event.reason &&
    event.reason.message ===
      "ResizeObserver loop completed with undelivered notifications."
  ) {
    event.preventDefault();
    return;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
