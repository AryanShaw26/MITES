import React from "react";
import { Link } from "react-router-dom";

export function UpcomingEvents({ events = [], loading = false }) {
  const priorityColors = {
    low: { bg: "#eef8f4", color: "#20b981" },
    medium: { bg: "#fff6eb", color: "#f4a62a" },
    high: { bg: "#fef0f0", color: "#ef5350" },
  };

  return (
    <div
      style={{
        backgroundColor: "var(--mites-surface, #ffffff)",
        borderRadius: "var(--mites-radius-md, 16px)",
        border: "1px solid var(--mites-border, #e7eaf3)",
        boxShadow: "var(--mites-shadow-card, 0 4px 18px rgba(27, 35, 74, 0.045))",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🎯</span>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--mites-text, #10152f)" }}>
            Upcoming Events
          </h3>
        </div>
        <Link
          to="/events"
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--mites-primary, #6254f5)",
            textDecoration: "none",
          }}
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <div style={{ color: "var(--mites-muted, #65708d)", fontSize: "13px", padding: "10px 0" }}>
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div
          style={{
            padding: "18px 0",
            textAlign: "center",
            color: "var(--mites-muted, #65708d)",
            fontSize: "13px",
          }}
        >
          No upcoming events scheduled.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {events.map((ev) => {
            const date = new Date(ev.start_at);
            const dateStr = date.toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            });
            const timeStr = date.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const p = priorityColors[ev.priority?.toLowerCase()] || priorityColors.medium;

            return (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--mites-radius-sm, 10px)",
                  backgroundColor: "var(--mites-bg, #f8f9fd)",
                  border: "1px solid var(--mites-border, #e7eaf3)",
                  gap: "10px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--mites-text, #10152f)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ev.title}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--mites-muted, #65708d)", marginTop: "2px" }}>
                    {dateStr} at {timeStr}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: p.bg,
                    color: p.color,
                    flexShrink: 0,
                  }}
                >
                  {ev.priority}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UpcomingEvents;
