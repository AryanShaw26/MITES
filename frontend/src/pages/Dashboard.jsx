import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import MetricCard from "../components/analytics/MetricCard";
import TaskOverviewChart from "../components/analytics/TaskOverviewChart";
import ProductivityStats from "../components/analytics/ProductivityStats";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingEvents from "../components/events/UpcomingEvents";
import { fetchDashboardAnalytics } from "../services/analytics";
import { fetchUpcomingEvents } from "../services/events";
import { generateProductivityPDF } from "../services/pdfReport";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [user, setUser] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [chartPeriod, setChartPeriod] = useState("weekly");
  const [loading, setLoading] = useState(true);

  // Calendar widget state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [taskDatesInMonth, setTaskDatesInMonth] = useState(new Set());

  const today = new Date().toISOString().split("T")[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {
      console.error("User fetch error:", e);
    }
  };

  const fetchTodayTasks = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/tasks/?task_date=${today}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTodayTasks(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Today tasks fetch error:", e);
    }
  };

  const fetchRecentNotes = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/notes/?limit=3", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecentNotes(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Recent notes fetch error:", e);
    }
  };

  const fetchEventsData = async () => {
    try {
      const data = await fetchUpcomingEvents(4);
      setUpcomingEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Upcoming events fetch error:", e);
    }
  };

  const fetchAnalyticsData = async (period) => {
    try {
      const data = await fetchDashboardAnalytics(period);
      setAnalytics(data);
    } catch (e) {
      console.error("Analytics fetch error:", e);
    }
  };

  const checkMonthTaskDates = async () => {
    try {
      const year = calendarMonth.getFullYear();
      const month = calendarMonth.getMonth();
      const lastDay = new Date(year, month + 1, 0);

      const daysCount = lastDay.getDate();
      const setOfDates = new Set();

      for (let d = 1; d <= daysCount; d++) {
        const mStr = String(month + 1).padStart(2, "0");
        const dStr = String(d).padStart(2, "0");
        const dateStr = `${year}-${mStr}-${dStr}`;

        if (dateStr === today && todayTasks.length > 0) {
          setOfDates.add(dateStr);
        }
      }
      setTaskDatesInMonth(setOfDates);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        fetchTodayTasks(),
        fetchRecentNotes(),
        fetchEventsData(),
        fetchAnalyticsData(chartPeriod),
      ]);
      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    fetchAnalyticsData(chartPeriod);
  }, [chartPeriod]);

  useEffect(() => {
    checkMonthTaskDates();
  }, [calendarMonth, todayTasks]);

  const handleToggleTask = async (task) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}/complete?completed=${!task.completed}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        await fetchTodayTasks();
        await fetchAnalyticsData(chartPeriod);
      }
    } catch (e) {
      console.error("Toggle task error:", e);
    }
  };

  const handleExportPDF = () => {
    if (!analytics) return;
    generateProductivityPDF({
      user,
      periodName: chartPeriod.toUpperCase(),
      periodInfo: analytics.period || {},
      summary: analytics.summary || {},
      taskSeries: analytics.task_series || [],
      upcomingEvents,
    });
  };

  // Calendar helpers
  const calYear = calendarMonth.getFullYear();
  const calMonth = calendarMonth.getMonth();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDayIndex = new Date(calYear, calMonth, 1).getDay();
  const calMonthName = calendarMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const prevMonth = () => setCalendarMonth(new Date(calYear, calMonth - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(calYear, calMonth + 1, 1));

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const summary = analytics?.summary || {};
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        {/* Top bar with search and profile */}
        <div className="dashboard-topbar">
          <div className="topbar-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tasks, notes, events..."
              className="topbar-search-input"
              aria-label="Search"
            />
          </div>

          <div className="topbar-actions">
            <button type="button" className="icon-btn" aria-label="Notifications" title="Notifications">
              🔔
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Theme mode"
              title="Light Mode (Active)"
            >
              ☀️
            </button>

            <div className="user-profile-badge">
              <div className="avatar-circle">{userInitial}</div>
              <span className="user-profile-name">{user?.name || "Student"}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Header */}
        <header className="dashboard-header-v3">
          <div>
            <h1 className="greeting-text">
              {getGreeting()}, {user?.name || "there"} 👋
            </h1>
            <p className="greeting-sub">
              Here's your productivity overview for today. Stay focused and achieve your goals.
            </p>
          </div>

          <div className="header-right-date">
            <div className="date-chip">📅 {formattedDate}</div>
            <div className="quote-chip">✨ "Consistency is the key to mastery."</div>
          </div>
        </header>

        {/* 4 Summary Cards (Live Data from DB) */}
        <section className="dashboard-summary-cards">
          <MetricCard
            icon="📋"
            iconBg="#efedff"
            iconColor="#6254f5"
            label="Total Tasks"
            value={summary.all_time_tasks ?? summary.total_tasks ?? 0}
            subtitle="Overall tasks recorded"
          />

          <MetricCard
            icon="✅"
            iconBg="#eef8f4"
            iconColor="#20b981"
            label="Completed"
            value={summary.all_time_completed ?? summary.completed_tasks ?? 0}
            subtitle="Successfully completed"
          />

          <MetricCard
            icon="⏳"
            iconBg="#fff6eb"
            iconColor="#f4a62a"
            label="Pending"
            value={summary.all_time_pending ?? summary.pending_tasks ?? 0}
            subtitle="Awaiting completion"
          />

          <MetricCard
            icon="📝"
            iconBg="#f5efff"
            iconColor="#8b5cf6"
            label="Total Notes"
            value={summary.all_time_notes ?? 0}
            subtitle="Knowledge notes saved"
          />
        </section>

        {/* Main Grid: Left (Today's Tasks + Recent Notes) | Right (Calendar Preview + Upcoming Events) */}
        <div className="dashboard-content-grid">
          {/* Left Column */}
          <div className="grid-left-col">
            {/* Today's Tasks */}
            <div className="v3-card">
              <div className="v3-card-header">
                <div className="header-title-group">
                  <span className="card-icon">📌</span>
                  <div>
                    <h3>Today's Tasks</h3>
                    <p>Stay focused on what matters today.</p>
                  </div>
                </div>

                <Link to="/tasks" className="v3-action-link">
                  + Add Task
                </Link>
              </div>

              <div className="task-items-container">
                {todayTasks.length === 0 ? (
                  <div className="v3-empty-state">
                    <p>🎉 No tasks scheduled for today. Take a breather or add one!</p>
                  </div>
                ) : (
                  todayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`v3-task-row ${task.completed ? "task-completed" : ""}`}
                    >
                      <label className="task-checkbox-label">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task)}
                        />
                        <span className="checkbox-custom" />
                        <span className="task-title-text">{task.title}</span>
                      </label>

                      <div className="task-meta-right">
                        {task.task_time && (
                          <span className="task-time-badge">
                            🕒 {task.task_time.slice(0, 5)}
                          </span>
                        )}
                        <span className={`priority-tag ${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Notes */}
            <div className="v3-card">
              <div className="v3-card-header">
                <div className="header-title-group">
                  <span className="card-icon">📝</span>
                  <div>
                    <h3>Recent Notes</h3>
                    <p>Your latest thoughts, summaries, and lecture notes.</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="v3-action-link"
                  onClick={() => navigate("/notes")}
                >
                  + Add Note
                </button>
              </div>

              <div className="notes-items-container">
                {recentNotes.length === 0 ? (
                  <div className="v3-empty-state">
                    <p>No notes written yet. Organize your learning with structured sections!</p>
                    <button
                      type="button"
                      className="inline-cta-btn"
                      onClick={() => navigate("/notes")}
                    >
                      Open Notes Workspace →
                    </button>
                  </div>
                ) : (
                  recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="v3-note-row"
                      onClick={() => navigate(`/notes/note/${note.id}`)}
                    >
                      <div className="note-text-content">
                        <h4>{note.title}</h4>
                        <p>{note.content ? note.content.slice(0, 90) + (note.content.length > 90 ? "..." : "") : "No content preview."}</p>
                      </div>

                      <div className="note-date-tag">
                        {note.created_at ? new Date(note.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Preview + Upcoming Events */}
          <div className="grid-right-col">
            {/* Calendar Preview Widget */}
            <div className="v3-card compact-calendar-card">
              <div className="compact-calendar-header">
                <h4>{calMonthName}</h4>
                <div className="calendar-nav-arrows">
                  <button type="button" onClick={prevMonth} aria-label="Previous month">
                    ‹
                  </button>
                  <button type="button" onClick={nextMonth} aria-label="Next month">
                    ›
                  </button>
                </div>
              </div>

              {/* Weekdays */}
              <div className="compact-calendar-grid weekdays">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="calendar-day-header">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="compact-calendar-grid">
                {Array.from({ length: calFirstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="calendar-cell empty" />
                ))}

                {Array.from({ length: calDaysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const mStr = String(calMonth + 1).padStart(2, "0");
                  const dStr = String(dayNum).padStart(2, "0");
                  const dateStr = `${calYear}-${mStr}-${dStr}`;

                  const isCurrentDay = dateStr === today;
                  const isSelected = dateStr === selectedCalendarDate;
                  const hasTasks = taskDatesInMonth.has(dateStr);

                  return (
                    <div
                      key={dayNum}
                      className={`calendar-cell ${isCurrentDay ? "today" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedCalendarDate(dateStr);
                        navigate("/calendar");
                      }}
                      title={`${dateStr}${hasTasks ? " (Has tasks)" : ""}`}
                    >
                      <span className="cell-num">{dayNum}</span>
                      {hasTasks && <span className="cell-dot" />}
                    </div>
                  );
                })}
              </div>

              <div className="calendar-bottom-link">
                <Link to="/calendar">Open Full Calendar →</Link>
              </div>
            </div>

            {/* Upcoming Events */}
            <UpcomingEvents events={upcomingEvents} loading={loading} />

            {/* Quick Actions Component */}
            <QuickActions onExportPDF={handleExportPDF} />
          </div>
        </div>

        {/* Analytics Row: Task Overview Bar Chart + Productivity Stats Gauge */}
        <section className="dashboard-analytics-row">
          <TaskOverviewChart
            series={analytics?.task_series || []}
            period={chartPeriod}
            onPeriodChange={(p) => setChartPeriod(p)}
          />

          <ProductivityStats
            productivity={analytics?.productivity || {}}
            period={chartPeriod}
            onPeriodChange={(p) => setChartPeriod(p)}
          />
        </section>

        {/* Bottom Productivity Callout Banner */}
        <section className="dashboard-productivity-callout">
          <div className="callout-content">
            <span className="callout-trophy">🏆</span>
            <div>
              <h3>
                {summary.completed_tasks && summary.completed_tasks > 0
                  ? `Great job! You've completed ${summary.completed_tasks} tasks this period.`
                  : "Keep pushing forward! Consistent effort builds unstoppable momentum."}
              </h3>
              <p>Review comprehensive trends, task time distribution, and complete analytics.</p>
            </div>
          </div>

          <button
            type="button"
            className="callout-analytics-btn"
            onClick={() => navigate("/analytics")}
          >
            View Detailed Analytics →
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
