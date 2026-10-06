import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}></QueryClientProvider>
  </StrictMode>,
);
