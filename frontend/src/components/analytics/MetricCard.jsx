import React from "react";

export function MetricCard({
  icon,
  iconBg = "#efedff",
  iconColor = "#6254f5",
  label,
  value,
  trend,
  subtitle,
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--mites-surface, #ffffff)",
        borderRadius: "var(--mites-radius-md, 16px)",
        border: "1px solid var(--mites-border, #e7eaf3)",
        boxShadow: "var(--mites-shadow-card, 0 4px 18px rgba(27, 35, 74, 0.045))",
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        gap: "18px",
        flex: 1,
        minWidth: "200px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          backgroundColor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 4px 0",
            fontSize: "13px",
            color: "var(--mites-muted, #65708d)",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
          }}
        >
          {label}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              fontWeight: 700,
              color: "var(--mites-text, #10152f)",
              lineHeight: 1.1,
            }}
          >
            {value}
          </h2>
          {trend && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: trend.isPositive ? "var(--mites-success, #20b981)" : "var(--mites-danger, #ef5350)",
              }}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.text}
            </span>
          )}
        </div>
        {subtitle && (
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
