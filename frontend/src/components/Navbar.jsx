import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow-lg">
      <h1
        className="text-xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
        onClick={() => navigate("/dashboard")}
      >
        Study Tracker
      </h1>
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/subjects")}
          className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Subjects
        </button>
        <button
          onClick={() => navigate("/log-session")}
          className="text-gray-400 hover:text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Log Session
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
