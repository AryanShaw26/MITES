import React from "react";
import { useNavigate } from "react-router-dom";

export function QuickActions({ onExportPDF }) {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New Task",
      icon: "➕",
      description: "Schedule your to-do",
      onClick: () => navigate("/tasks"),
      bg: "#f3f0ff",
      color: "#6254f5",
    },
    {
      title: "New Note",
      icon: "📝",
      description: "Capture thoughts in sections",
      onClick: () => navigate("/notes"),
      bg: "#eef8f4",
      color: "#20b981",
    },
    {
      title: "Export as PDF",
      icon: "📄",
      description: "Download progress report",
      onClick: onExportPDF,
      bg: "#fff6eb",
      color: "#f4a62a",
    },
    {
      title: "View Calendar",
      icon: "📅",
      description: "Monthly agenda & schedule",
      onClick: () => navigate("/calendar"),
      bg: "#edf5ff",
      color: "#3b82f6",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--mites-surface, #ffffff)",
        borderRadius: "var(--mites-radius-md, 16px)",
        border: "1px solid var(--mites-border, #e7eaf3)",
        boxShadow: "var(--mites-shadow-card, 0 4px 18px rgba(27, 35, 74, 0.045))",
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{ fontSize: "18px" }}>⚡</span>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--mites-text, #10152f)" }}>
          Quick Actions
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "12px",
        }}
      >
        {actions.map((act) => (
          <button
            key={act.title}
            type="button"
            onClick={act.onClick}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "12px 14px",
              borderRadius: "var(--mites-radius-sm, 10px)",
              border: "1px solid var(--mites-border, #e7eaf3)",
              backgroundColor: "var(--mites-bg, #f8f9fd)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = act.bg;
              e.currentTarget.style.borderColor = act.color;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--mites-bg, #f8f9fd)";
              e.currentTarget.style.borderColor = "var(--mites-border, #e7eaf3)";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: act.bg,
                color: act.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                marginBottom: "8px",
              }}
            >
              {act.icon}
            </div>
            <strong style={{ fontSize: "13.5px", color: "var(--mites-text, #10152f)", marginBottom: "2px" }}>
              {act.title}
            </strong>
            <span style={{ fontSize: "11px", color: "var(--mites-muted, #65708d)", lineHeight: 1.2 }}>
              {act.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
