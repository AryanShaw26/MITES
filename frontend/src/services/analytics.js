import { apiRequest } from "./api";

export async function fetchAnalyticsSummary(period = "weekly", startDate = null, endDate = null) {
  let query = `?period=${period}`;
  if (startDate) query += `&start_date=${startDate}`;
  if (endDate) query += `&end_date=${endDate}`;
  return apiRequest(`/analytics/summary${query}`);
}

export async function fetchTaskSeries(period = "weekly", startDate = null, endDate = null) {
  let query = `?period=${period}`;
  if (startDate) query += `&start_date=${startDate}`;
  if (endDate) query += `&end_date=${endDate}`;
  return apiRequest(`/analytics/tasks${query}`);
}

export async function fetchProductivityStats(period = "weekly", startDate = null, endDate = null) {
  let query = `?period=${period}`;
  if (startDate) query += `&start_date=${startDate}`;
  if (endDate) query += `&end_date=${endDate}`;
  return apiRequest(`/analytics/productivity${query}`);
}

export async function fetchDashboardAnalytics(period = "weekly") {
  return apiRequest(`/analytics/dashboard?period=${period}`);
}
