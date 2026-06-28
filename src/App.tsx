import './App.css'
import Tasks from './pages/tasks/Tasks'
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RequireAuth from "./RequireAuth"
import type { JSX } from "react";
import "./pages/tasks/Tasks.css"

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <Tasks />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App
