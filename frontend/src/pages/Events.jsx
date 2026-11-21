import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import EventCard from "../components/events/EventCard";
import EventForm from "../components/events/EventForm";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../services/events";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchEvents(filter);
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError(err.message || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = async (formData, eventId) => {
    if (eventId) {
      await updateEvent(eventId, formData);
    } else {
      await createEvent(formData);
    }
    await loadEvents();
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteEvent(deletingId);
      setDeletingId(null);
      await loadEvents();
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        {/* Page Header */}
        <header className="events-header">
          <div>
            <h1 className="events-title">Events & Schedule</h1>
            <p className="events-subtitle">Manage personal events, meetings, deadlines, and milestones.</p>
          </div>

          <button
            type="button"
            className="create-event-btn"
            onClick={handleOpenCreate}
          >
            <span>+</span> Create Event
          </button>
        </header>

        {/* Filter Tabs */}
        <div className="events-controls">
          <div className="filter-tabs">
            {["upcoming", "past", "all"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${filter === tab ? "active" : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <span className="events-count">
            {events.length} {events.length === 1 ? "Event" : "Events"}
          </span>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="events-loading">
            <div className="spinner" />
            <p>Loading your events...</p>
          </div>
        ) : error ? (
          <div className="events-error">
            <p>{error}</p>
            <button type="button" onClick={loadEvents} className="retry-btn">
              Retry
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="events-empty">
            <div className="empty-icon">📅</div>
            <h3>No {filter !== "all" ? filter : ""} events found</h3>
            <p>Stay organized by scheduling your upcoming events and commitments.</p>
            <button
              type="button"
              className="create-event-btn"
              onClick={handleOpenCreate}
            >
              + Create Your First Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleOpenEdit}
                onDelete={(id) => setDeletingId(id)}
              />
            ))}
          </div>
        )}

        {/* Create / Edit Modal Form */}
        <EventForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveEvent}
          initialData={editingEvent}
        />

        {/* Delete Confirmation Modal */}
        {deletingId && (
          <div className="modal-backdrop" onClick={() => setDeletingId(null)}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Event</h3>
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Events;
