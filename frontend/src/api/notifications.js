import API from "./axios";

export async function getNotifications() {
  const res = await API.get("/notifications");
  return res.data;
}

export async function markNotificationRead(id) {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data.notification;
}

export async function markAllNotificationsRead() {
  const res = await API.put("/notifications/read-all");
  return res.data;
}

export async function dismissNotification(id) {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
}

