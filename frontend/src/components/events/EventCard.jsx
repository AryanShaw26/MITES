import React from "react";

export function EventCard({ event, onEdit, onDelete }) {
  const startDate = new Date(event.start_at);
  const endDate = event.end_at ? new Date(event.end_at) : null;

  const formattedStart = startDate.toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = endDate
    ? endDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : null;

  const priorityColors = {
    low: { bg: "#eef8f4", color: "#20b981", border: "#b8ebdc" },
    medium: { bg: "#fff6eb", color: "#f4a62a", border: "#fce0ba" },
    high: { bg: "#fef0f0", color: "#ef5350", border: "#fbcbcb" },
  };

  const pConfig = priorityColors[event.priority?.toLowerCase()] || priorityColors.medium;

  return (
    <div
      style={{
        backgroundColor: "var(--mites-surface, #ffffff)",
        borderRadius: "var(--mites-radius-md, 16px)",
        border: "1px solid var(--mites-border, #e7eaf3)",
        boxShadow: "var(--mites-shadow-card, 0 4px 18px rgba(27, 35, 74, 0.045))",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--mites-text, #10152f)" }}>
          {event.title}
        </h4>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: "6px",
            backgroundColor: pConfig.bg,
            color: pConfig.color,
            border: `1px solid ${pConfig.border}`,
            flexShrink: 0,
          }}
        >
          {event.priority}
        </span>
      </div>

      {event.description && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "var(--mites-muted, #65708d)",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {event.description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "12px",
          color: "var(--mites-muted, #65708d)",
          marginTop: "4px",
          flexWrap: "wrap",
        }}
      >
        <span>
          🕒 {formattedStart} {formattedEndTime && `— ${formattedEndTime}`}
        </span>
        {event.reminder_at && (
          <span title="Reminder configured" style={{ color: "var(--mites-primary, #6254f5)" }}>
            🔔 Reminder
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "8px",
          paddingTop: "10px",
          borderTop: "1px solid #f2f4f8",
        }}
      >
        <button
          type="button"
          onClick={() => onEdit(event)}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--mites-primary, #6254f5)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(event.id)}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--mites-danger, #ef5350)",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default EventCard;
