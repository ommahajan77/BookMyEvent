import api from "./api";

export const getAnalytics = () => api.get("/admin/analytics");

export const getAllEventsAdmin = () => api.get("/admin/events");
export const createEvent = (formData) =>
  api.post("/admin/events", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, formData) =>
  api.put(`/admin/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/admin/events/${id}`);

export const getAllBookings = () => api.get("/admin/bookings");

export const getAllUsers = () => api.get("/admin/users");
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
