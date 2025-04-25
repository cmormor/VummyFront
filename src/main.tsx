import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "../src/index.css";
import { ThemeContextProvider } from "./style/ThemeContextProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>
);
