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
import Fallback from "./pages/Fallback";
import { ToastContainer, Zoom } from "react-toastify";

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
            <Route
              path="*"
              element={
                <Fallback
                  code={404}
                  headline={`Ops! Parece que você se perdeu.`}
                  subHeadline="A página que você está procurando não existe, foi removida ou talvez tenha sido digitada incorretamente."
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Zoom}
    />
  </StrictMode>,
);
