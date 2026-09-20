import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  const token = localStorage.getItem("access_token");

  const today = new Date().toISOString().split("T")[0];

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("User fetch error:", error);
    }
  };

  const fetchTodayTasks = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/?task_date=${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch today's tasks");
      }

      const data = await response.json();
      setTodayTasks(data);
    } catch (error) {
      console.error("Today's tasks fetch error:", error);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const dates = [];

      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split("T")[0]);
      }

      const results = await Promise.all(
        dates.map(async (date) => {
          const response = await fetch(
            `http://127.0.0.1:8000/tasks/?task_date=${date}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            return [];
          }

          return response.json();
        })
      );

      setUpcomingTasks(results.flat().slice(0, 5));
    } catch (error) {
      console.error("Upcoming tasks fetch error:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    fetchUser();
    fetchTodayTasks();
    fetchUpcomingTasks();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    navigate("/", { replace: true });
  };

  const handleToggleTask = async (task) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}/complete?completed=${!task.completed}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await fetchTodayTasks();
      await fetchUpcomingTasks();
    } catch (error) {
      console.error("Task update error:", error);
    }
  };

  const completedTasks = todayTasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = todayTasks.filter(
    (task) => !task.completed
  ).length;

  const userInitial =
    user?.name?.charAt(0).toUpperCase() || "U";

  const formattedToday = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          MITES
        </div>

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="nav-item active"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/tasks"
            className="nav-item"
          >
            ✅ Tasks
          </Link>

          <Link
            to="/notes"
            className="nav-item"
          >
            📝 Notes
          </Link>

          <Link
            to="/calendar"
            className="nav-item"
          >
            📅 Calendar
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <button
            type="button"
            className="nav-item"
          >
            ⚙️ Settings
          </button>

          <button
            type="button"
            className="nav-item logout"
            onClick={handleLogOut}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <h1>
              Good morning, {user?.name || "there"} 👋
            </h1>

            <p>
              Here's what's happening with your productivity today.
            </p>

            <p className="dashboard-date">
              {formattedToday}
            </p>
          </div>

          <div className="profile-circle">
            {userInitial}
          </div>

        </header>

        {/* Stats */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <span className="stat-icon">📋</span>

            <div>
              <p>Total Tasks</p>
              <h2>{todayTasks.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✅</span>

            <div>
              <p>Completed</p>
              <h2>{completedTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⏳</span>

            <div>
              <p>Pending</p>
              <h2>{pendingTasks}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📝</span>

            <div>
              <p>Notes</p>
              <h2>0</h2>
            </div>
          </div>

        </section>

        {/* Dashboard Grid */}
        <section className="dashboard-grid">

          {/* Today's Tasks */}
          <div className="dashboard-card tasks-card">

            <div className="card-header">

              <div>
                <h2>Today's Tasks</h2>
                <p>Stay focused on what matters.</p>
              </div>

              <Link
                to="/tasks"
                className="add-button"
              >
                + Add Task
              </Link>

            </div>

            <div className="task-list">

              {todayTasks.length === 0 ? (
                <div className="empty-state">
                  No tasks for today 🎉
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    className={`task-item ${
                      task.completed ? "completed" : ""
                    }`}
                    key={task.id}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task)}
                    />

                    <span>
                      {task.title}
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>

          {/* Recent Notes */}
          <div className="dashboard-card notes-card">

            <div className="card-header">

              <div>
                <h2>Recent Notes</h2>
                <p>Your latest thoughts.</p>
              </div>

              <button
                type="button"
                className="add-button"
                onClick={() => navigate("/notes")}
              >
                + Add Note
              </button>

            </div>

            <div className="notes-list">

              <div className="empty-state">
                <p>
                  Notes will appear here in Version 2.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Upcoming Tasks */}
        <section className="dashboard-card upcoming-card">

          <div className="card-header">

            <div>
              <h2>Upcoming Tasks</h2>
              <p>What's coming next.</p>
            </div>

            <Link to="/tasks">
              View All
            </Link>

          </div>

          <div className="upcoming-list">

            {upcomingTasks.length === 0 ? (
              <div className="empty-state">
                No upcoming tasks.
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  className="upcoming-item"
                  key={task.id}
                >
                  <div>
                    <strong>{task.title}</strong>

                    <p>
                      {new Date(
                        `${task.task_date}T00:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <span
                    className={`priority ${task.priority}`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;