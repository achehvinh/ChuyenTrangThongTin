import axios from "axios";
import { getBackendServerUrl } from "../utils/apiConfig";

const BASE_URL = getBackendServerUrl();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * 1. Lấy danh sách thông báo phân trang từ Backend MongoDB
 */
export const getNotifications = async (params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/notifications`, {
      headers: getAuthHeader(),
      params,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi getNotifications:", err);
    return { success: false, notifications: [], unreadCount: 0 };
  }
};

/**
 * 2. Lấy số lượng thông báo chưa đọc từ MongoDB
 */
export const getUnreadCount = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/notifications/unread-count`, {
      headers: getAuthHeader(),
    });
    return res.data?.unreadCount ?? res.data?.count ?? 0;
  } catch (err) {
    return 0;
  }
};

/**
 * 3. Đánh dấu 1 thông báo là đã đọc
 */
export const markAsRead = async (id) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/v1/notifications/${id}/read`, {}, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

/**
 * 4. Đánh dấu tất cả thông báo là đã đọc
 */
export const markAllAsRead = async () => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/v1/notifications/read-all`, {}, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

/**
 * 5. Xóa 1 thông báo của chính user
 */
export const deleteNotification = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/v1/notifications/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

/**
 * Helper: Định dạng thời gian thân thiện chuẩn Tiếng Việt
 * "Vừa xong", "2 phút trước", "Hôm nay, 14:20", "Hôm qua, 08:05", "11/08/2026, 14:20"
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "Vừa xong";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Vừa xong";

  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 45) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24 && now.getDate() === d.getDate()) {
    return `Hôm nay, ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.getDate() === d.getDate() && yesterday.getMonth() === d.getMonth()) {
    return `Hôm qua, ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  }

  return `${d.toLocaleDateString("vi-VN")}, ${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  formatRelativeTime,
};
