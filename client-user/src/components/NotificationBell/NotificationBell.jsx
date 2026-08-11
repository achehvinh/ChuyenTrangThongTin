import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, FileText, ClipboardList, Calendar, Info, AlertTriangle, X } from "lucide-react";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, formatRelativeTime } from "../../services/notificationService";
import { useTaskRealtime } from "../../hooks/useTaskRealtime";
import "./NotificationBell.css";

const NotificationBell = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD
  const [loading, setLoading] = useState(false);
  const [toastNotif, setToastNotif] = useState(null);

  const panelRef = useRef(null);

  // Fetch số lượng chưa đọc & danh sách thông báo từ API MongoDB
  const fetchUnread = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  };

  const fetchList = async () => {
    setLoading(true);
    const data = await getNotifications({ limit: 20 });
    if (data?.success) {
      setNotifications(data.notifications || []);
      if (data.unreadCount !== undefined) {
        setUnreadCount(data.unreadCount);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchList();
    }
  }, [isOpen]);

  // Đóng panel khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lắng nghe Socket.IO Realtime Event cho thông báo mới
  useTaskRealtime({
    onNotificationNew: (payload) => {
      const newNotif = payload?.notification || payload;
      if (newNotif && newNotif.title) {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => (payload.unreadCount !== undefined ? payload.unreadCount : prev + 1));

        // Toast Realtime popup
        setToastNotif(newNotif);
        setTimeout(() => setToastNotif(null), 5000);
      }
    },
  });

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id || notif.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) => ((n._id || n.id) === (notif._id || notif.id) ? { ...n, isRead: true } : n))
      );
    }

    if (onNavigate && notif.actionUrl) {
      onNavigate(notif.actionUrl, notif);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    return true;
  });

  const getNotifIcon = (type, priority) => {
    if (priority === "URGENT" || priority === "HIGH") {
      return <AlertTriangle size={18} color="#DC2626" />;
    }
    if (type?.startsWith("TASK")) {
      return <ClipboardList size={18} color="#005BAC" />;
    }
    if (type?.startsWith("DOCUMENT")) {
      return <FileText size={18} color="#0284C7" />;
    }
    if (type?.startsWith("MEETING")) {
      return <Calendar size={18} color="#D97706" />;
    }
    return <Info size={18} color="#16A34A" />;
  };

  return (
    <div className="notif-bell-container" ref={panelRef}>
      {/* TOAST THÔNG BÁO REALTIME GÓC TRÊN */}
      {toastNotif && (
        <div className="notif-toast-popup">
          <div className="notif-toast-icon">
            <Bell size={20} color="#005BAC" />
          </div>
          <div className="notif-toast-content">
            <div className="notif-toast-title">{toastNotif.title}</div>
            <div className="notif-toast-msg">{toastNotif.message}</div>
          </div>
          <button className="notif-toast-close" onClick={() => setToastNotif(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ICON CHUÔNG + BADGE */}
      <button
        type="button"
        className={`notif-bell-btn ${unreadCount > 0 ? "has-unread" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Thông báo hệ thống (Realtime MongoDB)"
      >
        <Bell size={20} color="#475569" />
        {unreadCount > 0 && (
          <span className="notif-badge-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN PANEL THÔNG BÁO */}
      {isOpen && (
        <div className="notif-dropdown-panel">
          <div className="notif-dropdown-header">
            <div className="notif-header-title">
              <h3>THÔNG BÁO HỆ THỐNG</h3>
              {unreadCount > 0 && <span className="notif-unread-tag">{unreadCount} chưa đọc</span>}
            </div>
            {unreadCount > 0 && (
              <button type="button" className="notif-btn-readall" onClick={handleMarkAllRead}>
                <CheckCheck size={15} />
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
            )}
          </div>

          {/* TAB BỘ LỌC */}
          <div className="notif-tabs-bar">
            <button
              className={`notif-tab-item ${filter === "ALL" ? "active" : ""}`}
              onClick={() => setFilter("ALL")}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              className={`notif-tab-item ${filter === "UNREAD" ? "active" : ""}`}
              onClick={() => setFilter("UNREAD")}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          {/* DANH SÁCH THÔNG BÁO */}
          <div className="notif-list-body">
            {loading ? (
              <div className="notif-loading-state">Đang tải thông báo từ MongoDB...</div>
            ) : filteredNotifs.length === 0 ? (
              <div className="notif-empty-state">
                <Bell size={36} color="#CBD5E1" />
                <p>Bạn chưa có thông báo mới</p>
              </div>
            ) : (
              filteredNotifs.map((item) => (
                <div
                  key={item._id || item.id}
                  className={`notif-item-row ${!item.isRead ? "unread" : ""}`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="notif-item-icon">{getNotifIcon(item.type, item.priority)}</div>
                  <div className="notif-item-content">
                    <div className="notif-item-title">{item.title}</div>
                    <div className="notif-item-message">{item.message}</div>
                    <div className="notif-item-time">{formatRelativeTime(item.createdAt)}</div>
                  </div>
                  {!item.isRead && <div className="notif-item-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
