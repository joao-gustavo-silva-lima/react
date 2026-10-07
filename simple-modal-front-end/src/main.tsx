import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Modal from "./components/Modal";
import Layout from "./pages/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Profile from "./pages/Profile";
import "./assets/styles/tailwind.style.css";
import Fallback from "./pages/Fallback";
import { Slide, ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Modal mode="login" />} />
            <Route path="/register" element={<Modal mode="register" />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="*"
              element={<Fallback message="Página não encontrada." />}
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
      closeOnClick
      rtl={false}
      limit={3}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="dark"
      transition={Slide}
    />
  </StrictMode>,
);
