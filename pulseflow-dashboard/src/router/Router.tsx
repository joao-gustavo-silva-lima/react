import { BrowserRouter, Route, Routes } from "react-router";
import Index from "../pages/Index";
import HabitModal from "../components/HabitModal";
import RoutineModal from "../components/RoutineModal";
import SubTaskModal from "../components/SubTaskModal";
import Analytics from "../pages/Analytics";
import Fallback from "../pages/Fallback";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="new-routine" element={<RoutineModal mode="create" />} />
          <Route
            path=":routineId/edit"
            element={<RoutineModal mode="patch" />}
          />
          <Route
            path=":routineId/new-habit"
            element={<HabitModal mode="create" />}
          />
          <Route
            path=":routineId/:habitId/edit"
            element={<HabitModal mode="patch" />}
          />
          <Route
            path=":routineId/:habitId/new-sub-task"
            element={<SubTaskModal mode="create" />}
          />
          <Route
            path=":routineId/:habitId/:subTaskId/edit"
            element={<SubTaskModal mode="patch" />}
          />
        </Route>
        <Route path="/analytics" element={<Analytics />} />
        <Route
          path="*"
          element={<Fallback message="A página que você tentou acessar não foi encontrada." />}
        />
      </Routes>
    </BrowserRouter>
  );
}
