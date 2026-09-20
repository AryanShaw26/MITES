import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Calendar.css";

function Calendar() {
  const navigate = useNavigate();

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("access_token");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const fetchTasks = async (date) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/?task_date=${date}`,
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
      console.error(error);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  const formatDate = (day) => {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );

    setSelectedDate(
      today.toISOString().split("T")[0]
    );
  };

  const handleDateClick = (day) => {
    const date = formatDate(day);
    setSelectedDate(date);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        <div className="calendar-page">

          <div className="calendar-header">
            <div>
              <h1>Calendar</h1>
              <p>
                View and manage your tasks by date.
              </p>
            </div>

            <button
              type="button"
              className="today-btn"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <div className="calendar-layout">

            {/* CALENDAR */}
            <div className="calendar-card">

              <div className="calendar-navigation">
                <button
                  type="button"
                  onClick={previousMonth}
                >
                  ‹
                </button>

                <h2>
                  {currentMonth.toLocaleString(
                    "default",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </h2>

                <button
                  type="button"
                  onClick={nextMonth}
                >
                  ›
                </button>
              </div>

              <div className="weekdays">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="calendar-grid">

                {Array.from({
                  length: firstDay,
                }).map((_, index) => (
                  <div
                    className="calendar-empty"
                    key={`empty-${index}`}
                  />
                ))}

                {Array.from({
                  length: daysInMonth,
                }).map((_, index) => {
                  const day = index + 1;
                  const date = formatDate(day);

                  const isSelected =
                    date === selectedDate;

                  const isToday =
                    date ===
                    today.toISOString().split("T")[0];

                  return (
                    <button
                      type="button"
                      key={day}
                      className={`calendar-day ${
                        isSelected ? "selected" : ""
                      } ${isToday ? "today" : ""}`}
                      onClick={() =>
                        handleDateClick(day)
                      }
                    >
                      {day}

                      {isToday && (
                        <span className="today-dot" />
                      )}
                    </button>
                  );
                })}

              </div>
            </div>

            {/* SELECTED DATE TASKS */}
            <div className="selected-date-card">

              <div className="selected-date-header">
                <div>
                  <h2>
                    {new Date(
                      `${selectedDate}T00:00:00`
                    ).toLocaleDateString(
                      "default",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </h2>

                  <p>
                    {tasks.length} task
                    {tasks.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/tasks?date=${selectedDate}`
                    )
                  }
                >
                  + Add Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="calendar-empty-tasks">
                  <div>📋</div>

                  <h3>
                    No tasks scheduled
                  </h3>

                  <p>
                    Add a task for this date.
                  </p>
                </div>
              ) : (
                <div className="calendar-task-list">
                  {tasks.map((task) => (
                    <div
                      className={`calendar-task ${
                        task.completed ? "completed" : ""
                      }`}
                      key={task.id}
                    >
                      <div className="calendar-task-status">
                        {task.completed ? "✓" : "○"}
                      </div>

                      <div>
                        <h3>{task.title}</h3>

                        {task.task_time && (
                          <span>
                            🕒{" "}
                            {task.task_time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Calendar;
