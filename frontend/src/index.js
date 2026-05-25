import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";

const resizeObserverErr = window.onerror;

window.onerror = (...args) => {
  if (
    args[0] &&
    args[0].includes(
      "ResizeObserver loop completed with undelivered notifications"
    )
  ) {
    return true;
  }

  return resizeObserverErr && resizeObserverErr(...args);
};

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);