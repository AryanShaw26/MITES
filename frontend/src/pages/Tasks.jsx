import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Tasks.css";
import Sidebar from "../components/Sidebar/Sidebar";

function Tasks() {
  const [searchParams] = useSearchParams();

  const urlDate = searchParams.get("date");
  const initialDate =
    urlDate || new Date().toISOString().split("T")[0];

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    task_date: initialDate,
    task_time: "",
    priority: "medium",
  });

  const token = localStorage.getItem("access_token");

  // Fetch tasks for selected date
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/?task_date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // Keep selected date in sync when coming from Calendar
  useEffect(() => {
    if (urlDate) {
      setSelectedDate(urlDate);

      setFormData((previous) => ({
        ...previous,
        task_date: urlDate,
      }));
    }
  }, [urlDate]);

  // Handle input
  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // Open add form
  const handleAddTask = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      description: "",
      task_date: selectedDate,
      task_time: "",
      priority: "medium",
    });

    setShowForm(true);
  };

  // Open edit form
  const handleEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description || "",
      task_date: task.task_date,
      task_time: task.task_time
        ? task.task_time.slice(0, 5)
        : "",
      priority: task.priority,
    });

    setShowForm(true);
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingTask
        ? `http://127.0.0.1:8000/tasks/${editingTask.id}`
        : "http://127.0.0.1:8000/tasks/";

      const response = await fetch(url, {
        method: editingTask ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          ...formData,
          task_time: formData.task_time || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to save task"
        );
      }

      setShowForm(false);
      setEditingTask(null);

      // If the task date was changed while editing,
      // display the newly selected date.
      setSelectedDate(formData.task_date);

      await fetchTasks();
    } catch (error) {
      console.error("Save task error:", error);
      alert(error.message);
    }
  };

  // Delete
  const handleDelete = async (taskId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this task?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);
      alert(error.message);
    }
  };

  // Complete / incomplete
  const handleComplete = async (task) => {
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

      await fetchTasks();
    } catch (error) {
      console.error("Complete task error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        <div className="tasks-page">

          <div className="tasks-header">
            <div>
              <h1>Tasks</h1>
              <p>
                Manage your daily tasks and stay productive.
              </p>
            </div>

            <button
              type="button"
              className="add-task-btn"
              onClick={handleAddTask}
            >
              + Add Task
            </button>
          </div>

          {/* Date Selection */}
          <div className="date-selector">
            <label htmlFor="task-date">
              Select Date
            </label>

            <input
              id="task-date"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const newDate = e.target.value;

                setSelectedDate(newDate);

                setFormData((previous) => ({
                  ...previous,
                  task_date: newDate,
                }));
              }}
            />
          </div>

          {/* Task Form */}
          {showForm && (
            <div className="task-form-card">

              <h2>
                {editingTask
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <textarea
                  name="description"
                  placeholder="Task description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <div className="form-row">

                  <div>
                    <label htmlFor="form-task-date">
                      Date
                    </label>

                    <input
                      id="form-task-date"
                      type="date"
                      name="task_date"
                      value={formData.task_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="task-time">
                      Time
                    </label>

                    <input
                      id="task-time"
                      type="time"
                      name="task_time"
                      value={formData.task_time}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="task-priority">
                      Priority
                    </label>

                    <select
                      id="task-priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="low">
                        Low
                      </option>
                      <option value="medium">
                        Medium
                      </option>
                      <option value="high">
                        High
                      </option>
                    </select>
                  </div>

                </div>

                <div className="form-buttons">

                  <button type="submit">
                    {editingTask
                      ? "Update Task"
                      : "Create Task"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          )}

          {/* Tasks */}
          <div className="tasks-container">

            <div className="tasks-list-header">
              <h2>
                Tasks for {selectedDate}
              </h2>

              <span>
                {tasks.length} task
                {tasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            {tasks.length === 0 ? (

              <div className="empty-tasks">
                <div>📋</div>
                <h3>
                  No tasks for this date
                </h3>
                <p>
                  Add a task to get started.
                </p>
              </div>

            ) : (

              <div className="task-list">

                {tasks.map((task) => (

                  <div
                    className={`task-card ${
                      task.completed
                        ? "completed"
                        : ""
                    }`}
                    key={task.id}
                  >

                    <div className="task-check">

                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleComplete(task)
                        }
                      />

                    </div>

                    <div className="task-content">

                      <h3>{task.title}</h3>

                      {task.description && (
                        <p>
                          {task.description}
                        </p>
                      )}

                      <div className="task-meta">

                        {task.task_time && (
                          <span>
                            🕒{" "}
                            {task.task_time.slice(0, 5)}
                          </span>
                        )}

                        <span
                          className={`priority ${task.priority}`}
                        >
                          {task.priority}
                        </span>

                      </div>

                    </div>

                    <div className="task-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEditTask(task)
                        }
                        aria-label="Edit task"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(task.id)
                        }
                        aria-label="Delete task"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </main>
    </div>
  );
}

export default Tasks;