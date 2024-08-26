import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Sample from "./Sample.tsx";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Sample />
  </StrictMode>
);
