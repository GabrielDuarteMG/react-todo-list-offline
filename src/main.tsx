import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { SyncProvider } from "./context/SyncContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SyncProvider>
        <App />
      </SyncProvider>
    </ThemeProvider>
  </StrictMode>
);
