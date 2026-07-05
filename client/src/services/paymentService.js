import api from "./api";

export const createOrder = (bookingId) => api.post("/payment/create-order", { bookingId });
export const verifyPayment = (data) => api.post("/payment/verify", data);
