import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, Filter, AlertTriangle, FileText, ClipboardList, Calendar, Info, RefreshCw } from "lucide-react";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification, formatRelativeTime } from "../services/notificationService";
import { useTaskRealtime } from "../hooks/useTaskRealtime";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTypeTab, setActiveTypeTab] = useState("ALL");
  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllNotifications = async () => {
    setLoading(true);
    const params = { limit: 50 };
    if (activeTypeTab !== "ALL") params.type = activeTypeTab;
    if (isUnreadOnly) params.isRead = false;

    const data = await getNotifications(params);
    if (data?.success) {
      setNotifications(data.notifications || []);
      if (data.unreadCount !== undefined) {
        setUnreadCount(data.unreadCount);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllNotifications();
  }, [activeTypeTab, isUnreadOnly]);

  useTaskRealtime({
    onNotificationNew: (payload) => {
      const newNotif = payload?.notification || payload;
      if (newNotif) {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => (payload.unreadCount !== undefined ? payload.unreadCount : prev + 1));
      }
    },
  });

  const handleMarkOneRead = async (id) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => ((n._id || n.id) === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDeleteOne = async (id, e) => {
    e.stopPropagation();
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => (n._id || n.id) !== id));
  };

  const getTypeIcon = (type, priority) => {
    if (priority === "URGENT" || priority === "HIGH") {
      return <AlertTriangle size={20} color="#DC2626" />;
    }
    if (type?.startsWith("TASK")) return <ClipboardList size={20} color="#005BAC" />;
    if (type?.startsWith("DOCUMENT")) return <FileText size={20} color="#0284C7" />;
    if (type?.startsWith("MEETING")) return <Calendar size={20} color="#D97706" />;
    return <Info size={20} color="#16A34A" />;
  };

  return (
    <div className="notif-page-container">
      {/* HEADER TỔNG */}
      <div className="notif-page-header">
        <div>
          <h1 className="notif-page-title">CENTRAL NOTIFICATION CENTER</h1>
          <p className="notif-page-subtitle">
            Trung tâm quản lý thông báo trực tuyến toàn diện Phòng Văn hóa - Xã hội (MongoDB Realtime)
          </p>
        </div>

        <div className="notif-page-actions">
          <button type="button" className="btn-secondary-gov" onClick={fetchAllNotifications}>
            <RefreshCw size={16} />
            <span>Làm mới</span>
          </button>

          {unreadCount > 0 && (
            <button type="button" className="btn-primary-gov" onClick={handleMarkAllRead}>
              <CheckCheck size={18} />
              <span>Đánh dấu tất cả đã đọc ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER CATEGORY TABS */}
      <div className="notif-type-tabs">
        <button className={`type-tab-item ${activeTypeTab === "ALL" ? "active" : ""}`} onClick={() => setActiveTypeTab("ALL")}>
          Tất cả
        </button>
        <button className={`type-tab-item ${activeTypeTab === "TASK_ASSIGNED" ? "active" : ""}`} onClick={() => setActiveTypeTab("TASK_ASSIGNED")}>
          Nhiệm vụ
        </button>
        <button className={`type-tab-item ${activeTypeTab === "DOCUMENT_ASSIGNED" ? "active" : ""}`} onClick={() => setActiveTypeTab("DOCUMENT_ASSIGNED")}>
          Văn bản
        </button>
        <button className={`type-tab-item ${activeTypeTab === "MEETING_INVITATION" ? "active" : ""}`} onClick={() => setActiveTypeTab("MEETING_INVITATION")}>
          Lịch họp
        </button>
        <button className={`type-tab-item ${activeTypeTab === "SYSTEM_ALERT" ? "active" : ""}`} onClick={() => setActiveTypeTab("SYSTEM_ALERT")}>
          Hệ thống
        </button>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "13px", color: "#475569", fontWeight: "600", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isUnreadOnly}
              onChange={(e) => setIsUnreadOnly(e.target.checked)}
              style={{ marginRight: "6px" }}
            />
            Chỉ xem chưa đọc
          </label>
        </div>
      </div>

      {/* NOTIFICATION LIST CONTENT */}
      <div className="notif-full-list">
        {loading ? (
          <div className="notif-loading-box">Đang tải danh sách thông báo từ Database MongoDB...</div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty-box">
            <Bell size={48} color="#CBD5E1" />
            <h3>Không tìm thấy thông báo nào</h3>
            <p>Toàn bộ thông báo nghiệp vụ của bạn sẽ xuất hiện ở đây khi có phát sinh mới.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id || n.id}
              className={`notif-card-item ${!n.isRead ? "unread" : ""}`}
              onClick={() => handleMarkOneRead(n._id || n.id)}
            >
              <div className="notif-card-icon">{getTypeIcon(n.type, n.priority)}</div>

              <div className="notif-card-main">
                <div className="notif-card-top">
                  <span className="notif-type-badge">{n.type}</span>
                  <span className="notif-card-time">{formatRelativeTime(n.createdAt)}</span>
                </div>
                <h4 className="notif-card-title">{n.title}</h4>
                <p className="notif-card-msg">{n.message}</p>
              </div>

              <button
                type="button"
                className="btn-delete-notif"
                title="Xóa thông báo"
                onClick={(e) => handleDeleteOne(n._id || n.id, e)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
