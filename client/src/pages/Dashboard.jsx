import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || userId === "undefined") {
      navigate("/");
    }
  }, [userId, navigate]);

  const fetchTasks = async () => {
    if (!userId || userId === "undefined") return;
    try {
      const res = await API.get(`/tasks/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const addTask = async () => {
    if (!title) return alert("Enter task");
    try {
      await API.post("/tasks", { userId, title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!userId || userId === "undefined") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans text-slate-500">
        <div className="animate-pulse">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-blue-200 shadow-lg">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* --- WELCOME & INPUT SECTION --- */}
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">My Dashboard</h2>
          <p className="mt-2 text-slate-500">Keep track of your tasks and stay productive.</p>
        </header>

        <div className="group relative mb-12">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="What's on your mind today?" 
              className="flex-1 border-none bg-transparent px-4 py-3 outline-none placeholder:text-slate-400"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button 
              onClick={addTask}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-blue-200 shadow-md transition-all hover:bg-blue-700 active:scale-95"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* --- TASK LIST SECTION --- */}
        <section>
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Active Tasks ({tasks.length})
            </h3>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">All caught up! No tasks left.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li 
                  key={task._id} 
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    <span className="text-slate-700 font-medium">{task.title}</span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;