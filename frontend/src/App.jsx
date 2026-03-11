import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LogSession from "./pages/LogSession";
import Subjects from "./pages/Subjects";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log-session" element={<LogSession />} />
          <Route path="/subjects" element={<Subjects />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
