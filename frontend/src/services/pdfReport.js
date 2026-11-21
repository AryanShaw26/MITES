import { jsPDF } from "jspdf";

export function generateProductivityPDF({
  user,
  periodName = "Weekly",
  periodInfo = {},
  summary = {},
  taskSeries = [],
  upcomingEvents = [],
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = [98, 84, 245]; // #6254f5
  const darkTextColor = [16, 21, 47];  // #10152f
  const mutedTextColor = [101, 112, 141]; // #65708d
  const lightBg = [248, 249, 253]; // #f8f9fd
  const cardBorder = [231, 234, 243]; // #e7eaf3

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header banner
  doc.setFillColor(...lightBg);
  doc.roundedRect(12, y, pageWidth - 24, 26, 3, 3, "F");
  doc.setDrawColor(...cardBorder);
  doc.roundedRect(12, y, pageWidth - 24, 26, 3, 3, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text("MITES", 18, y + 11);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedTextColor);
  doc.text("Personal Productivity & Study Management Platform", 18, y + 18);

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 18, y + 11, { align: "right" });
  doc.text(`User: ${user?.name || "Authenticated User"}`, pageWidth - 18, y + 18, { align: "right" });

  y += 34;

  // Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...darkTextColor);
  doc.text("Productivity & Task Performance Report", 14, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedTextColor);
  const rangeStr = periodInfo.start_date && periodInfo.end_date
    ? `${periodInfo.start_date} to ${periodInfo.end_date} (${periodName.toUpperCase()})`
    : `Period: ${periodName.toUpperCase()}`;
  doc.text(rangeStr, 14, y + 6);

  y += 15;

  // 4 Key Metric Tiles
  const metrics = [
    { label: "Total Tasks", value: summary.total_tasks ?? 0 },
    { label: "Completed Tasks", value: summary.completed_tasks ?? 0 },
    { label: "Pending Tasks", value: summary.pending_tasks ?? 0 },
    { label: "Completion Rate", value: `${summary.completion_rate ?? 0}%` },
    { label: "Active Days", value: summary.active_days ?? 0 },
    { label: "Notes Created", value: summary.notes_created ?? 0 },
  ];

  const colWidth = (pageWidth - 28 - 10) / 3;
  const tileHeight = 20;

  metrics.forEach((m, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const tileX = 14 + col * (colWidth + 5);
    const tileY = y + row * (tileHeight + 5);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...cardBorder);
    doc.roundedRect(tileX, tileY, colWidth, tileHeight, 2, 2, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...mutedTextColor);
    doc.text(m.label, tileX + 5, tileY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...darkTextColor);
    doc.text(String(m.value), tileX + 5, tileY + 15);
  });

  y += 2 * (tileHeight + 5) + 8;

  // Task Breakdown by Day Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text("Daily Task Breakdown", 14, y);
  y += 5;

  // Table header
  const tableX = 14;
  const tableW = pageWidth - 28;
  doc.setFillColor(...lightBg);
  doc.rect(tableX, y, tableW, 8, "F");
  doc.setDrawColor(...cardBorder);
  doc.line(tableX, y + 8, tableX + tableW, y + 8);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...mutedTextColor);
  doc.text("Date / Day", tableX + 4, y + 5.5);
  doc.text("Completed", tableX + 50, y + 5.5);
  doc.text("Pending", tableX + 85, y + 5.5);
  doc.text("Total", tableX + 120, y + 5.5);
  doc.text("Status", tableX + 155, y + 5.5);

  y += 8;

  if (taskSeries && taskSeries.length > 0) {
    taskSeries.forEach((item, i) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      if (i % 2 === 1) {
        doc.setFillColor(252, 252, 254);
        doc.rect(tableX, y, tableW, 7, "F");
      }
      doc.setDrawColor(...cardBorder);
      doc.line(tableX, y + 7, tableX + tableW, y + 7);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...darkTextColor);
      doc.text(`${item.date} (${item.day})`, tableX + 4, y + 5);
      doc.text(String(item.completed), tableX + 50, y + 5);
      doc.text(String(item.pending), tableX + 85, y + 5);
      doc.text(String(item.total), tableX + 120, y + 5);

      const statusText = item.total === 0 ? "No tasks" : (item.pending === 0 ? "All Done" : `${item.completed}/${item.total}`);
      doc.setTextColor(item.completed > 0 && item.pending === 0 ? 32 : 101, item.completed > 0 && item.pending === 0 ? 185 : 112, item.completed > 0 && item.pending === 0 ? 129 : 141);
      doc.text(statusText, tableX + 155, y + 5);

      y += 7;
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...mutedTextColor);
    doc.text("No task records found in this time range.", tableX + 4, y + 5);
    y += 8;
  }

  y += 10;

  // Upcoming Events Section
  if (y > 250) {
    doc.addPage();
    y = 15;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...darkTextColor);
  doc.text("Upcoming Scheduled Events", 14, y);
  y += 5;

  if (upcomingEvents && upcomingEvents.length > 0) {
    upcomingEvents.forEach((ev) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...cardBorder);
      doc.roundedRect(14, y, pageWidth - 28, 12, 1.5, 1.5, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...darkTextColor);
      doc.text(ev.title, 18, y + 5);

      const evDate = new Date(ev.start_at).toLocaleString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...mutedTextColor);
      doc.text(evDate, 18, y + 9.5);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...primaryColor);
      doc.text(ev.priority.toUpperCase(), pageWidth - 22, y + 7, { align: "right" });

      y += 14;
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...mutedTextColor);
    doc.text("No upcoming events scheduled.", 14, y + 4);
    y += 8;
  }

  // Footer on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedTextColor);
    doc.text(
      `MITES V3 Productivity Report — Page ${p} of ${totalPages}`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  const fileName = `mites-productivity-${periodName.toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
