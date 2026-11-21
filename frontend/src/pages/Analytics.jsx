import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import MetricCard from "../components/analytics/MetricCard";
import TaskOverviewChart from "../components/analytics/TaskOverviewChart";
import ProductivityStats from "../components/analytics/ProductivityStats";
import { fetchDashboardAnalytics } from "../services/analytics";
import { fetchUpcomingEvents } from "../services/events";
import { generateProductivityPDF } from "../services/pdfReport";
import "./Analytics.css";

function Analytics() {
  const [period, setPeriod] = useState("weekly");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [taskSeries, setTaskSeries] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async (selectedPeriod) => {
    try {
      setLoading(true);
      setError("");

      const [dashData, userRes, eventsData] = await Promise.all([
        fetchDashboardAnalytics(selectedPeriod),
        fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }).then((r) => (r.ok ? r.json() : null)),
        fetchUpcomingEvents(5).catch(() => []),
      ]);

      setAnalyticsData(dashData);
      setTaskSeries(dashData.task_series || []);
      setUpcomingEvents(eventsData || []);
      if (userRes) setUser(userRes);
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(period);
  }, [period]);

  const handleExportPDF = () => {
    if (!analyticsData) return;
    generateProductivityPDF({
      user,
      periodName: period.toUpperCase(),
      periodInfo: analyticsData.period || {},
      summary: analyticsData.summary || {},
      taskSeries: analyticsData.task_series || [],
      upcomingEvents,
    });
  };

  const summary = analyticsData?.summary || {};
  const periodInfo = analyticsData?.period || {};

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <header className="analytics-header">
          <div>
            <h1 className="analytics-title">Detailed Analytics</h1>
            <p className="analytics-subtitle">
              Comprehensive performance metrics, productivity trends, and study insights.
            </p>
          </div>

          <div className="analytics-header-actions">
            {/* Period Selector */}
            <div className="period-pill-selector">
              {["daily", "weekly", "monthly"].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`period-btn ${period === p ? "active" : ""}`}
                  onClick={() => setPeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="export-pdf-btn"
              onClick={handleExportPDF}
              disabled={loading || !analyticsData}
            >
              📄 Export as PDF
            </button>
          </div>
        </header>

        {/* Date Range Badge */}
        {periodInfo.start_date && (
          <div className="range-badge-row">
            <span className="range-badge">
              📅 {periodInfo.start_date} to {periodInfo.end_date}
            </span>
          </div>
        )}

        {/* Loading and Error States */}
        {loading ? (
          <div className="analytics-loading">
            <div className="spinner" />
            <p>Aggregating productivity metrics from database...</p>
          </div>
        ) : error ? (
          <div className="analytics-error">
            <p>{error}</p>
            <button type="button" onClick={() => loadData(period)} className="retry-btn">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* 6 Metric Cards Grid */}
            <section className="analytics-metrics-grid">
              <MetricCard
                icon="📋"
                iconBg="#efedff"
                iconColor="#6254f5"
                label="Total Tasks"
                value={summary.total_tasks ?? 0}
                subtitle={`All time: ${summary.all_time_tasks ?? 0}`}
              />

              <MetricCard
                icon="✅"
                iconBg="#eef8f4"
                iconColor="#20b981"
                label="Completed Tasks"
                value={summary.completed_tasks ?? 0}
                subtitle={`All time: ${summary.all_time_completed ?? 0}`}
              />

              <MetricCard
                icon="⏳"
                iconBg="#fff6eb"
                iconColor="#f4a62a"
                label="Pending Tasks"
                value={summary.pending_tasks ?? 0}
                subtitle={`All time: ${summary.all_time_pending ?? 0}`}
              />

              <MetricCard
                icon="🎯"
                iconBg="#f0f5ff"
                iconColor="#3b82f6"
                label="Completion Rate"
                value={`${summary.completion_rate ?? 0}%`}
                subtitle="In selected period"
              />

              <MetricCard
                icon="🔥"
                iconBg="#fef0f0"
                iconColor="#ef5350"
                label="Active Days"
                value={summary.active_days ?? 0}
                subtitle="Days with completed tasks"
              />

              <MetricCard
                icon="📝"
                iconBg="#f5efff"
                iconColor="#8b5cf6"
                label="Notes Created"
                value={summary.notes_created ?? 0}
                subtitle={`All time: ${summary.all_time_notes ?? 0}`}
              />
            </section>

            {/* Charts Row */}
            <section className="analytics-charts-row">
              <TaskOverviewChart
                series={taskSeries}
                period={period}
                onPeriodChange={(p) => setPeriod(p)}
              />

              <ProductivityStats
                productivity={analyticsData?.productivity || {}}
                period={period}
                onPeriodChange={(p) => setPeriod(p)}
              />
            </section>

            {/* Detailed Table / Timeline Breakdown */}
            <section className="analytics-table-card">
              <div className="table-card-header">
                <h3>Time Series Breakdown</h3>
                <span className="badge-pill">{taskSeries.length} Days</span>
              </div>

              <div className="table-responsive">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Day</th>
                      <th>Completed</th>
                      <th>Pending</th>
                      <th>Total</th>
                      <th>Completion Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskSeries.map((row) => {
                      const pct = row.total > 0 ? Math.round((row.completed / row.total) * 100) : 0;
                      return (
                        <tr key={row.date}>
                          <td><strong>{row.date}</strong></td>
                          <td>{row.day}</td>
                          <td><span className="tag-comp">{row.completed}</span></td>
                          <td><span className="tag-pend">{row.pending}</span></td>
                          <td>{row.total}</td>
                          <td>
                            {row.total === 0 ? (
                              <span className="status-empty">No tasks</span>
                            ) : (
                              <div className="progress-bar-cell">
                                <div className="bar-bg">
                                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <span>{pct}%</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Analytics;
