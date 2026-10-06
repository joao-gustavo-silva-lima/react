import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Modal from "./components/Modal";
import Index from "./pages/Index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<Modal mode="login" />} />
          <Route path="/register" element={<Modal mode="register" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
