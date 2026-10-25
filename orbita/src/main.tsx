import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Modal from "./components/Modal";
import UserView from "./pages/UserView";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <p>Hello World!</p>
      <BrowserRouter>
        <Routes>
          <Route path="/registro" element={<Modal mode="registro" />} />
          <Route path="/login" element={<Modal mode="login" />} />
          <Route path="/perfil" element={<UserView />} />
          <Route path="/u/:username" element={<UserView />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
