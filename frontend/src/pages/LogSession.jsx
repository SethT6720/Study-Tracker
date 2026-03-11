import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchSubjects } from "../utils/fetchers";
import { useNavigate } from "react-router-dom";

export default function LogSession() {
  const [subjects, setSubjects] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(-1);
  const [startDate, setStartDate] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchSubjects(token);
      if (data.message) {
        setSubjects([]);
      } else {
        setSubjects(data);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    const toSend = {
      subject_id: selected,
      start_time: new Date(startDate),
      duration: duration,
      notes: notes,
    };

    try {
      const result = await fetch(import.meta.env.VITE_API_URL + "/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toSend),
      });
      navigate('/dashboard');
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="min-h-full bg-gray-900 p-6 flex flex-col items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Log Session</h1>
          <p className="text-gray-400 text-sm mt-1">Track your study time</p>
        </div>

        {/* Timer */}
        <div className="bg-gray-700 rounded-xl p-6 flex flex-col items-center gap-4">
          <p className="text-5xl font-mono font-bold text-white">
            {String(Math.floor(duration / 3600)).padStart(2, "0")}:
            {String(Math.floor((duration % 3600) / 60)).padStart(2, "0")}:
            {String(duration % 60).padStart(2, "0")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsRunning(true);
                setStartDate(Date.now());
              }}
              disabled={isRunning}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setCanSubmit(true);
              }}
              disabled={!isRunning}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {subjects.length === 0 ? (
            <p className="text-yellow-400 text-sm">
              You have no subjects yet. Create one first!
            </p>
          ) : (
            <select
              onChange={(e) => setSelected(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={-1}>Select a subject</option>
              {subjects &&
                subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>
          )}
          <textarea
            placeholder="Notes (optional)"
            onChange={(e) => setNotes(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none h-24"
          />
          <button
            type="submit"
            disabled={!canSubmit || subjects.length === 0}
            className="bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Log Session
          </button>
        </form>
      </div>
    </div>
  );
}
