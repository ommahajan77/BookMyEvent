import api from "./api";

export const createBooking = (data) => api.post("/bookings", data);
export const getMyBookings = () => api.get("/bookings/my");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
export const downloadTicket = (id) =>
  api.get(`/bookings/${id}/ticket`, { responseType: "blob" });
