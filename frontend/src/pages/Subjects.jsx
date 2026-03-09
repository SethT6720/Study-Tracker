import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchSubjects } from "../utils/fetchers";

export default function Subject() {
  const [subjects, setSubjects] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editting, setEditing] = useState(-1);
  const [newName, setNewName] = useState("");
  const { token } = useAuth();

  const [name, setName] = useState("");

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
  }, [refresh]);

  async function onSubmit(e) {
    e.preventDefault();
    const toSend = {
      name: name,
    };

    try {
      const result = await fetch(import.meta.env.VITE_API_URL + "/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toSend),
      });

      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.log(err.message);
    }
  }

  async function changeName(e) {
    e.preventDefault();
    const toSend = {
      name: newName,
    };

    try {
      const result = await fetch(
        import.meta.env.VITE_API_URL + `/subjects/${editting}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(toSend),
        },
      );
      setEditing(-1);
      setShowEditForm(false);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteSubject(e) {
    e.preventDefault();
    try {
      const result = await fetch(
        import.meta.env.VITE_API_URL + `/subjects/${editting}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setEditing(-1);
      setShowEditForm(false);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white">Subjects</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your study subjects
          </p>
        </div>

        {/* Subject List */}
        <div className="flex flex-col gap-3 mb-6">
          {subjects.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No subjects yet — add one below!
            </p>
          )}
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-gray-800 rounded-xl p-4">
              {showEditForm && editting === subject.id ? (
                <div className="flex flex-col gap-3">
                  <form onSubmit={changeName} className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditing(-1);
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                  <button
                    onClick={deleteSubject}
                    className="text-red-400 text-sm hover:text-red-300 text-left transition-colors"
                  >
                    Delete subject
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">{subject.name}</p>
                  <button
                    onClick={() => {
                      setShowEditForm(true);
                      setNewName(subject.name);
                      setEditing(subject.id);
                    }}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Subject */}
        {showAdd ? (
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Subject name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            + Add Subject
          </button>
        )}
      </div>
    </div>
  );
}
