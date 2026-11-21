import { apiRequest } from "./api";

export async function fetchEvents(status = "all", fromDate = null, toDate = null) {
  let query = `?status=${status}`;
  if (fromDate) query += `&from_date=${encodeURIComponent(fromDate)}`;
  if (toDate) query += `&to_date=${encodeURIComponent(toDate)}`;
  return apiRequest(`/events/${query}`);
}

export async function fetchUpcomingEvents(limit = 5) {
  return apiRequest(`/events/upcoming?limit=${limit}`);
}

export async function fetchEvent(eventId) {
  return apiRequest(`/events/${eventId}`);
}

export async function createEvent(eventData) {
  return apiRequest("/events/", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export async function updateEvent(eventId, eventData) {
  return apiRequest(`/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
}

export async function deleteEvent(eventId) {
  return apiRequest(`/events/${eventId}`, {
    method: "DELETE",
  });
}
