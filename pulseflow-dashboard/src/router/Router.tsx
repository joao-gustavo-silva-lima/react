import { BrowserRouter, Route, Routes } from "react-router";
import Index from "../pages/Index";
import Modal from "../pages/Modal";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/new/:routineId?" element={<Modal />} />
      </Routes>
    </BrowserRouter>
  );
}
