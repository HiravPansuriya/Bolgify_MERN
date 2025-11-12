import api from "./axiosConfig";

export const fetchNotifications = () => api.get("/notifications");
export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);
