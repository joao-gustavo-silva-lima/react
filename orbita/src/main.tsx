import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Modal from "./components/Modal";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <p>Hello World!</p>
      <BrowserRouter>
        <Routes>
          <Route path="/registro" element={<Modal mode="registro" />} />
          <Route path="/login" element={<Modal mode="login" />} />
          <Route path="/:username" element={<p>Looking for user...</p>} />
          <Route path="/perfil" element={<p>Hello Again</p>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
