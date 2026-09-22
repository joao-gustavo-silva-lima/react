import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router/Router";
import "../src/assets/styles/tailwindcss.style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </StrictMode>,
);
