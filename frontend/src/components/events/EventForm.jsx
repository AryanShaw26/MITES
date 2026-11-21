import React, { useState, useEffect } from "react";

export function EventForm({ isOpen, onClose, onSave, initialData = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState("medium");
  const [reminderAt, setReminderAt] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPriority(initialData.priority || "medium");

      if (initialData.start_at) {
        const start = new Date(initialData.start_at);
        setStartDate(start.toISOString().split("T")[0]);
        setStartTime(start.toTimeString().slice(0, 5));
      }

      if (initialData.end_at) {
        const end = new Date(initialData.end_at);
        setEndDate(end.toISOString().split("T")[0]);
        setEndTime(end.toTimeString().slice(0, 5));
      } else {
        setEndDate("");
        setEndTime("");
      }

      if (initialData.reminder_at) {
        const rem = new Date(initialData.reminder_at);
        setReminderAt(rem.toISOString().slice(0, 16));
      } else {
        setReminderAt("");
      }
    } else {
      // Default to today + next hour
      const now = new Date();
      now.setMinutes(0, 0, 0);
      now.setHours(now.getHours() + 1);
      setStartDate(now.toISOString().split("T")[0]);
      setStartTime(now.toTimeString().slice(0, 5));

      const later = new Date(now.getTime() + 60 * 60 * 1000);
      setEndDate(later.toISOString().split("T")[0]);
      setEndTime(later.toTimeString().slice(0, 5));

      setTitle("");
      setDescription("");
      setPriority("medium");
      setReminderAt("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Event title is required");
      return;
    }

    if (!startDate || !startTime) {
      setError("Start date and time are required");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}:00`);

    let endDateTime = null;
    if (endDate && endTime) {
      endDateTime = new Date(`${endDate}T${endTime}:00`);
      if (endDateTime < startDateTime) {
        setError("End time cannot be earlier than start time");
        return;
      }
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      start_at: startDateTime.toISOString(),
      end_at: endDateTime ? endDateTime.toISOString() : null,
      priority,
      reminder_at: reminderAt ? new Date(reminderAt).toISOString() : null,
    };

    try {
      setSaving(true);
      await onSave(payload, initialData?.id);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(16, 21, 47, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "var(--mites-radius-lg, 20px)",
          padding: "26px 30px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--mites-text, #10152f)" }}>
            {initialData ? "Edit Event" : "Create New Event"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "var(--mites-muted, #65708d)",
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#fef0f0",
              color: "var(--mites-danger, #ef5350)",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Project Sprint Demo"
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "8px",
                border: "1px solid var(--mites-border, #e7eaf3)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--mites-border, #e7eaf3)",
                  fontSize: "13px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--mites-border, #e7eaf3)",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--mites-border, #e7eaf3)",
                  fontSize: "13px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
                End Time (Optional)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--mites-border, #e7eaf3)",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid var(--mites-border, #e7eaf3)",
                fontSize: "13px",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, notes, links..."
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid var(--mites-border, #e7eaf3)",
                fontSize: "13px",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--mites-muted, #65708d)", marginBottom: "4px" }}>
              Reminder (Optional)
            </label>
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid var(--mites-border, #e7eaf3)",
                fontSize: "13px",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid var(--mites-border, #e7eaf3)",
                background: "transparent",
                color: "var(--mites-muted, #65708d)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: "var(--mites-primary, #6254f5)",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {saving ? "Saving..." : initialData ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
