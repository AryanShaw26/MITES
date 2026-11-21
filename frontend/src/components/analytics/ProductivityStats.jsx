import React from "react";

export function ProductivityStats({
  productivity = {},
  period = "weekly",
  onPeriodChange,
}) {
  const completionRate = productivity.completion_rate ?? 0;
  const tasksCompleted = productivity.tasks_completed ?? 0;
  const notesCreated = productivity.notes_created ?? 0;
  const activeDays = productivity.active_days ?? 0;

  // Circular gauge calculations
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div
      style={{
        backgroundColor: "var(--mites-surface, #ffffff)",
        borderRadius: "var(--mites-radius-md, 16px)",
        border: "1px solid var(--mites-border, #e7eaf3)",
        boxShadow: "var(--mites-shadow-card, 0 4px 18px rgba(27, 35, 74, 0.045))",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        flex: 1,
        minWidth: "280px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🎯</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--mites-text, #10152f)" }}>
              Productivity Stats
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>
              Performance summary
            </p>
          </div>
        </div>

        {onPeriodChange && (
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--mites-bg, #f8f9fd)",
              borderRadius: "8px",
              padding: "3px",
              border: "1px solid var(--mites-border, #e7eaf3)",
            }}
          >
            <button
              type="button"
              onClick={() => onPeriodChange("weekly")}
              style={{
                border: "none",
                background: period === "weekly" ? "var(--mites-primary, #6254f5)" : "transparent",
                color: period === "weekly" ? "#ffffff" : "var(--mites-muted, #65708d)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("monthly")}
              style={{
                border: "none",
                background: period === "monthly" ? "var(--mites-primary, #6254f5)" : "transparent",
                color: period === "monthly" ? "#ffffff" : "var(--mites-muted, #65708d)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Month
            </button>
          </div>
        )}
      </div>

      {/* Body: Ring + Stats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", gap: "16px", flexWrap: "wrap" }}>
        {/* Ring Gauge */}
        <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--mites-primary-soft, #efedff)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--mites-primary, #6254f5)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--mites-text, #10152f)" }}>
              {completionRate}%
            </span>
            <div style={{ fontSize: "10px", color: "var(--mites-muted, #65708d)", textTransform: "uppercase" }}>
              Rate
            </div>
          </div>
        </div>

        {/* 3 Metric Counts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "130px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>Tasks Completed</span>
            <strong style={{ fontSize: "14px", color: "var(--mites-text, #10152f)" }}>{tasksCompleted}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>Notes Created</span>
            <strong style={{ fontSize: "14px", color: "var(--mites-text, #10152f)" }}>{notesCreated}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>Active Days</span>
            <strong style={{ fontSize: "14px", color: "var(--mites-text, #10152f)" }}>{activeDays}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductivityStats;
