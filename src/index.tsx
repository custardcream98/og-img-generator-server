import React from "react";
import ReactDOM from "react-dom/client";
import { renderToString } from "react-dom/server";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
