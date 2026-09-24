import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/assets/styles/tailwindcss.style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import HabitModal from "./components/HabitModal";
import RoutineModal from "./components/RoutineModal";
import SubTaskModal from "./components/SubTaskModal";
import Analytics from "./pages/Analytics";
import Fallback from "./pages/Fallback";
import Index from "./pages/Index";
import Layout from "./components/Layout";
import { Flip, ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Index />}>
              <Route
                path="new-routine"
                element={<RoutineModal mode="create" />}
              />
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
              element={
                <Fallback message="A página que você tentou acessar não foi encontrada." />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Flip}
    />
  </StrictMode>,
);
