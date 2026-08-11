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
 * Lấy danh sách cán bộ thực tế thuộc Phòng Văn hóa - Xã hội từ Backend MongoDB
 */
export const getStaffList = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/users/staff`, {
      headers: getAuthHeader(),
    });
    if (res.data?.success) {
      return res.data.staff || res.data.users || [];
    }
    return [];
  } catch (err) {
    console.error("Lỗi khi lấy danh sách cán bộ:", err);
    try {
      const resFallback = await axios.get(`${BASE_URL}/api/v1/tasks/staff`, {
        headers: getAuthHeader(),
      });
      return resFallback.data?.staff || [];
    } catch (e) {
      return [];
    }
  }
};

/**
 * Trưởng phòng phân công Giao nhiệm vụ mới (Lưu MongoDB + Gửi Thông báo)
 */
export const createTask = async (taskData) => {
  const res = await axios.post(`${BASE_URL}/api/v1/tasks`, taskData, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * Lấy danh sách nhiệm vụ của cá nhân cán bộ ("Nhiệm vụ của tôi")
 */
export const getMyTasks = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/tasks/my`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * Lấy toàn bộ nhiệm vụ của Phòng Văn hóa - Xã hội
 */
export const getDepartmentTasks = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/tasks/department`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * Lấy thống kê KPI nhiệm vụ trực tiếp từ MongoDB
 */
export const getTaskStatistics = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/tasks/statistics`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

/**
 * Lấy thông tin chi tiết nhiệm vụ và lịch sử tiến độ
 */
export const getTaskById = async (id) => {
  const res = await axios.get(`${BASE_URL}/api/v1/tasks/${id}/history`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export default {
  getStaffList,
  createTask,
  getMyTasks,
  getDepartmentTasks,
  getTaskStatistics,
  getTaskById,
};
