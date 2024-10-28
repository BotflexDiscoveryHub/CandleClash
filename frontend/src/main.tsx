import ReactDOM from "react-dom/client";

import { App } from "./App";
import React from "react";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  window.Telegram.WebApp.expand();

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
