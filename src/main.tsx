import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initRealtimeSync } from "./services/realtimeSync";

initRealtimeSync();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
