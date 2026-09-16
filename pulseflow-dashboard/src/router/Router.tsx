import { BrowserRouter, Route, Routes } from "react-router";
import Index from "../pages/Index";
import HabitModal from "../pages/HabitModal";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/:routineId/new-habit" element={<HabitModal />} />
      </Routes>
    </BrowserRouter>
  );
}
