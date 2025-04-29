import { createRoot } from "react-dom/client";
import { App } from "./App";
import "../src/index.css";
import { ThemeContextProvider } from "./style/ThemeContextProvider";

createRoot(document.getElementById("root")!).render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);
