import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserModal from "./components/UserModal";
import UserView from "./pages/UserView";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Join from "./pages/Join";
import "./assets/styles/tailwind.style.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route
              path="/cadastro"
              element={<Join modal={<UserModal mode="cadastro" />} />}
            />
            <Route
              path="/login"
              element={<Join modal={<UserModal mode="login" />} />}
            />
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
