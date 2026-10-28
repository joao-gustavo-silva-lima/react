import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserModal from "./components/UserModal";
import UserView from "./pages/UserView";
import MainLayout from "./layouts/MainLayout";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/cadastro" element={<UserModal mode="cadastro" />} />
            <Route path="/login" element={<UserModal mode="login" />} />
            <Route path="/u/:username" element={<UserView />}>
              <Route
                path="/u/:username/editar"
                element={<UserModal mode="edição" />}
              />
              <Route
                path="/u/:username/excluir"
                element={<UserModal mode="exclusão" />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
