import { BrowserRouter, Route, Routes } from "react-router";
import Index from "../pages/Index";
import HabitModal from "../components/HabitModal";
import RoutineModal from "../components/RoutineModal";
import SubTaskModal from "../components/SubTaskModal";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/new-routine" element={<RoutineModal />} />
        <Route path="/:routineId/edit" element={<p>WIP</p>} />
        <Route path="/:routineId/new-habit" element={<HabitModal />} />
        <Route
          path="/:routineId/:habitId/new-sub-task"
          element={<SubTaskModal />}
        />
      </Routes>
    </BrowserRouter>
  );
}
