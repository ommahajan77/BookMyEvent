import api from "./api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const updateProfile = (formData) =>
  api.put("/auth/profile", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const changePassword = (data) => api.put("/auth/change-password", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (token, data) => api.put(`/auth/reset-password/${token}`, data);
