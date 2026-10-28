import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserModal from "./components/UserModal";
import UserView from "./pages/UserView";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <p>Hello World!</p>
      <BrowserRouter>
        <Routes>
          <Route path="/cadastro" element={<UserModal mode="cadastro" />} />
          <Route path="/login" element={<UserModal mode="login" />} />
          <Route path="/u/:username" element={<UserView />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
