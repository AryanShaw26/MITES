import React, { useState } from "react";

export function TaskOverviewChart({
  series = [],
  period = "weekly",
  onPeriodChange,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const maxTotal = Math.max(
    ...series.map((item) => (item.completed || 0) + (item.pending || 0)),
    5
  );

  const chartHeight = 160;
  const barWidth = 14;
  const barGap = 6;

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
        minWidth: "300px",
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
          <span style={{ fontSize: "20px" }}>📊</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--mites-text, #10152f)" }}>
              Task Overview
            </h3>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>
              Completed vs Pending tasks
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
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => onPeriodChange("monthly")}
              style={{
                border: "none",
                background: period === "monthly" ? "var(--mites-primary, #6254f5)" : "transparent",
                color: period === "monthly" ? "#ffffff" : "var(--mites-muted, #65708d)",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              This Month
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "18px", fontSize: "12px", color: "var(--mites-muted, #65708d)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              backgroundColor: "var(--mites-primary, #6254f5)",
              display: "inline-block",
            }}
          />
          <span>Completed</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              backgroundColor: "#d6d9e6",
              display: "inline-block",
            }}
          />
          <span>Pending</span>
        </div>
      </div>

      {/* Chart visualization */}
      {series.length === 0 ? (
        <div
          style={{
            height: `${chartHeight}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--mites-muted, #65708d)",
            fontSize: "13px",
            fontStyle: "italic",
          }}
        >
          No task data available for this period.
        </div>
      ) : (
        <div style={{ position: "relative", width: "100%", height: `${chartHeight + 35}px` }}>
          <svg
            width="100%"
            height={chartHeight + 35}
            viewBox={`0 0 ${Math.max(series.length * 48, 300)} ${chartHeight + 35}`}
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
            role="img"
            aria-label="Completed vs Pending tasks bar chart"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = chartHeight * (1 - pct);
              return (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#f0f2f7"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Bars */}
            {series.map((item, idx) => {
              const totalWidth = Math.max(series.length * 48, 300);
              const step = totalWidth / series.length;
              const xCenter = idx * step + step / 2;

              const compHeight = Math.max((item.completed / maxTotal) * chartHeight, item.completed > 0 ? 6 : 0);
              const pendHeight = Math.max((item.pending / maxTotal) * chartHeight, item.pending > 0 ? 6 : 0);

              const compY = chartHeight - compHeight;
              const pendY = chartHeight - pendHeight;

              const isHovered = hoveredIdx === idx;

              return (
                <g
                  key={item.date || idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Hover highlight background */}
                  {isHovered && (
                    <rect
                      x={xCenter - step / 2 + 2}
                      y={0}
                      width={step - 4}
                      height={chartHeight + 25}
                      fill="#f4f5fc"
                      rx="6"
                    />
                  )}

                  {/* Completed bar */}
                  <rect
                    x={xCenter - barWidth - barGap / 2}
                    y={compY}
                    width={barWidth}
                    height={compHeight}
                    rx="4"
                    fill="var(--mites-primary, #6254f5)"
                    style={{ transition: "all 0.2s ease" }}
                  />

                  {/* Pending bar */}
                  <rect
                    x={xCenter + barGap / 2}
                    y={pendY}
                    width={barWidth}
                    height={pendHeight}
                    rx="4"
                    fill="#d6d9e6"
                    style={{ transition: "all 0.2s ease" }}
                  />

                  {/* Label */}
                  <text
                    x={xCenter}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fill={isHovered ? "var(--mites-primary, #6254f5)" : "var(--mites-muted, #65708d)"}
                    fontSize="11"
                    fontWeight={isHovered ? "700" : "500"}
                  >
                    {item.day || item.display_date || `D${idx + 1}`}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredIdx !== null && series[hoveredIdx] && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "var(--mites-text, #10152f)",
                color: "#ffffff",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10,
              }}
            >
              <div><strong>{series[hoveredIdx].date} ({series[hoveredIdx].day})</strong></div>
              <div>Completed: {series[hoveredIdx].completed}</div>
              <div>Pending: {series[hoveredIdx].pending}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskOverviewChart;
