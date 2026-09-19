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
        <Route path="/new-routine" element={<RoutineModal mode="create" />} />
        <Route
          path="/:routineId/edit"
          element={<RoutineModal mode="patch" />}
        />
        <Route path="/:routineId/new-habit" element={<HabitModal />} />
        <Route
          path="/:routineId/:habitId/new-sub-task"
          element={<SubTaskModal />}
        />
      </Routes>
    </BrowserRouter>
  );
}
