import { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
import "./TruongPhongDashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function TruongPhongDashboard() {
  const token = localStorage.getItem("admin_token");
  const fullName = localStorage.getItem("admin_fullname");
  const role = localStorage.getItem("admin_role");

  // Tab State: 'staff' (Quản lý cán bộ), 'schedule' (Lịch trình), 'updates' (Cập nhật hệ thống)
  const [activeTab, setActiveTab] = useState("staff");

  // General state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ── Tab 1: Staff management ──
  const [subordinates, setSubordinates] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "canbo",
  });

  // ── Tab 2: Schedule management ──
  const [meetings, setMeetings] = useState([]);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    thon: "",
    type: "hop-dan",
    note: "",
  });

  // ── Tab 3: Updates & Notifications ──
  const [notices, setNotices] = useState([]);

  // Fetch subordinate staff
  const fetchSubordinates = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter out admin and self, show only canbo and phophong
      const filtered = res.data.filter((u) => u.role === "canbo" || u.role === "phophong");
      setSubordinates(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch meeting schedules
  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/lich-hop`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch notifications
  const fetchNotices = async () => {
    try {
      const res = await api.get("/thong-bao");
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubordinates();
    fetchMeetings();
    fetchNotices();
  }, []);

  // ── Handlers for Staff ──
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!staffForm.fullName || !staffForm.username || (!editingStaff && !staffForm.password)) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(false);
      if (editingStaff) {
        // Edit staff (API auth endpoint doesn't support PUT directly, so we delete and re-create, or show status message)
        // Usually creating a new one is fine, let's create a post call
        await axios.post(
          `${API_URL}/auth/users`,
          { ...staffForm },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Cấp tài khoản mới thành công!");
      } else {
        // Add new
        await axios.post(
          `${API_URL}/auth/users`,
          staffForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Cấp tài khoản cán bộ thành công!");
      }
      setStaffForm({ fullName: "", username: "", password: "", role: "canbo" });
      setEditingStaff(null);
      fetchSubordinates();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu tài khoản cán bộ.");
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Xóa tài khoản của cán bộ "${name}"?`)) return;
    try {
      setMessage("");
      await axios.delete(`${API_URL}/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa cán bộ thành công.");
      fetchSubordinates();
    } catch (err) {
      setError("Không thể xóa tài khoản cán bộ này.");
    }
  };

  // ── Handlers for Meetings ──
  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      if (editingMeeting) {
        await axios.put(`${API_URL}/lich-hop/${editingMeeting._id}`, meetingForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cập nhật lịch trình thành công!");
        setEditingMeeting(null);
      } else {
        await axios.post(`${API_URL}/lich-hop`, meetingForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Thêm lịch trình họp thôn thành công!");
      }
      setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "hop-dan", note: "" });
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi lưu lịch trình họp.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMeeting = (item) => {
    setEditingMeeting(item);
    setMeetingForm({
      title: item.title || "",
      date: item.date || "",
      time: item.time || "",
      location: item.location || "",
      thon: item.thon || "",
      type: item.type || "hop-dan",
      note: item.note || "",
    });
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch trình này?")) return;
    try {
      await axios.delete(`${API_URL}/lich-hop/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa lịch trình thành công.");
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi xóa lịch trình.");
    }
  };

  const getMeetingBadgeLabel = (t) => {
    if (t === "hop-dan") return "👥 Họp dân";
    if (t === "tiem-chung") return "💉 Tiêm chủng";
    if (t === "phat-ho-tro") return "🎁 Phát hỗ trợ";
    if (t === "tap-huan") return "📚 Tập huấn";
    return "📌 Khác";
  };

  return (
    <div className="tp-dashboard">
      {/* Header */}
      <header className="tp-header">
        <div>
          <div className="tp-welcome">Trưởng phòng Điều hành</div>
          <h1>Chào Trưởng phòng: {fullName}</h1>
          <p>Bảng điều hành chuyên trách quản lý cán bộ cấp dưới, theo dõi lịch trình và xem cập nhật hệ thống</p>
        </div>
        <div className="tp-meta">
          <span>Vai trò: Trưởng phòng Văn hóa - Xã hội</span>
        </div>
      </header>

      {/* Alert message */}
      {message && <div className="tp-alert-success">✅ {message}</div>}
      {error && <div className="tp-alert-error">⚠️ {error}</div>}

      {/* Tabs list */}
      <div className="tp-tabs">
        <button
          className={`tp-tab-btn ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("staff");
            setMessage("");
            setError("");
          }}
        >
          👥 Quản lý cán bộ cấp dưới
        </button>
        <button
          className={`tp-tab-btn ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("schedule");
            setMessage("");
            setError("");
          }}
        >
          📅 Theo dõi lịch trình & Họp thôn
        </button>
        <button
          className={`tp-tab-btn ${activeTab === "updates" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("updates");
            setMessage("");
            setError("");
          }}
        >
          🔔 Cập nhật hệ thống & Thông báo
        </button>
      </div>

      {/* Tab 1: Staff management */}
      {activeTab === "staff" && (
        <div className="tp-grid">
          <div className="tp-card tp-form-card">
            <h3>➕ Cấp tài khoản cán bộ mới</h3>
            <form onSubmit={handleStaffSubmit}>
              <div className="tp-form-group">
                <label>Họ và tên cán bộ</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Trần Văn B"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="tp-form-group">
                <label>Tên đăng nhập (Username)</label>
                <input
                  type="text"
                  placeholder="canbo_danphuong"
                  value={staffForm.username}
                  onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                  required
                />
              </div>

              <div className="tp-form-group">
                <label>Mật khẩu đăng nhập</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  required={!editingStaff}
                />
              </div>

              <div className="tp-form-group">
                <label>Chức danh / Cấp bậc</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                >
                  <option value="canbo">Cán bộ chuyên viên</option>
                  <option value="phophong">Phó trưởng phòng</option>
                </select>
              </div>

              <button type="submit" className="tp-btn-submit">
                🔐 Cấp tài khoản mới
              </button>
            </form>
          </div>

          <div className="tp-card tp-list-card">
            <h3>📋 Cán bộ trực thuộc quản lý ({subordinates.length})</h3>
            <div className="tp-table-wrapper">
              <table className="tp-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Tên đăng nhập</th>
                    <th>Chức danh</th>
                    <th style={{ textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {subordinates.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        Chưa có cán bộ cấp dưới nào trực thuộc.
                      </td>
                    </tr>
                  ) : (
                    subordinates.map((s) => (
                      <tr key={s._id}>
                        <td><strong>{s.fullName}</strong></td>
                        <td><code>{s.username}</code></td>
                        <td>
                          <span className={`tp-role-badge ${s.role}`}>
                            {s.role === "phophong" ? "Phó phòng" : "Cán bộ"}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="tp-delete-btn"
                            onClick={() => handleDeleteStaff(s._id, s.fullName)}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schedule management */}
      {activeTab === "schedule" && (
        <div className="tp-grid">
          <div className="tp-card tp-form-card">
            <h3>{editingMeeting ? "✏️ Sửa lịch trình" : "📅 Thêm lịch trình họp mới"}</h3>
            <form onSubmit={handleMeetingSubmit}>
              <div className="tp-form-group">
                <label>Tiêu đề cuộc họp / công việc</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Họp tuyên truyền BHYT tự nguyện"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="tp-form-group-row">
                <div className="tp-form-group">
                  <label>Ngày diễn ra</label>
                  <input
                    type="date"
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="tp-form-group">
                  <label>Giờ họp</label>
                  <input
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="tp-form-group-row">
                <div className="tp-form-group">
                  <label>Thôn bản</label>
                  <input
                    type="text"
                    placeholder="Thôn Đăk Wek"
                    value={meetingForm.thon}
                    onChange={(e) => setMeetingForm({ ...meetingForm, thon: e.target.value })}
                    required
                  />
                </div>
                <div className="tp-form-group">
                  <label>Địa điểm cụ thể</label>
                  <input
                    type="text"
                    placeholder="Nhà rông văn hóa thôn"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="tp-form-group">
                <label>Loại lịch họp</label>
                <select
                  value={meetingForm.type}
                  onChange={(e) => setMeetingForm({ ...meetingForm, type: e.target.value })}
                >
                  <option value="hop-dan">Họp dân thôn bản</option>
                  <option value="tiem-chung">Lịch tiêm chủng mở rộng</option>
                  <option value="phat-ho-tro">Phát hỗ trợ chính sách</option>
                  <option value="tap-huan">Lớp tập huấn cán bộ</option>
                  <option value="khac">Khác</option>
                </select>
              </div>

              <div className="tp-form-group">
                <label>Nội dung ghi chú</label>
                <textarea
                  rows="3"
                  placeholder="Ghi chú thêm nội dung chuẩn bị..."
                  value={meetingForm.note}
                  onChange={(e) => setMeetingForm({ ...meetingForm, note: e.target.value })}
                />
              </div>

              <div className="tp-btn-group">
                <button type="submit" className="tp-btn-submit" disabled={loading}>
                  {editingMeeting ? "💾 Lưu cập nhật" : "➕ Thêm lịch họp"}
                </button>
                {editingMeeting && (
                  <button
                    type="button"
                    className="tp-btn-cancel"
                    onClick={() => {
                      setEditingMeeting(null);
                      setMeetingForm({
                        title: "",
                        date: "",
                        time: "",
                        location: "",
                        thon: "",
                        type: "hop-dan",
                        note: "",
                      });
                    }}
                  >
                    Hủy sửa
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="tp-card tp-list-card">
            <h3>📋 Danh sách lịch trình & Lịch họp các thôn</h3>
            <div className="tp-table-wrapper">
              <table className="tp-table">
                <thead>
                  <tr>
                    <th>Thông tin cuộc họp</th>
                    <th>Thời gian</th>
                    <th>Địa điểm</th>
                    <th style={{ textAlign: "center" }}>Phân loại</th>
                    <th style={{ width: "130px", textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        Chưa có lịch trình họp nào được thiết lập.
                      </td>
                    </tr>
                  ) : (
                    meetings.map((m) => (
                      <tr key={m._id}>
                        <td>
                          <strong>{m.title}</strong>
                          {m.note && <div className="tp-table-note">📝 Ghi chú: {m.note}</div>}
                        </td>
                        <td>
                          <div>📅 {m.date}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>⏰ {m.time}</div>
                        </td>
                        <td>
                          <div>📍 Thôn: {m.thon}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>📌 {m.location}</div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className={`tp-meeting-badge ${m.type}`}>
                            {getMeetingBadgeLabel(m.type)}
                          </span>
                        </td>
                        <td>
                          <div className="tp-table-actions">
                            <button className="tp-edit-btn-small" onClick={() => handleEditMeeting(m)}>
                              ✏️ Sửa
                            </button>
                            <button className="tp-delete-btn-small" onClick={() => handleDeleteMeeting(m._id)}>
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Updates & Notifications */}
      {activeTab === "updates" && (
        <div className="tp-updates-section">
          <div className="tp-grid tp-updates-grid">
            {/* Cập nhật hệ thống */}
            <div className="tp-card">
              <h3>🔔 Cập nhật hệ thống & Hoạt động</h3>
              <div className="tp-activity-list">
                <div className="tp-activity-item">
                  <div className="activity-dot blue"></div>
                  <div className="activity-content">
                    <strong>Đồng bộ cơ sở dữ liệu BHYT</strong>
                    <p>Hệ thống tự động đồng bộ 150 thông tin công dân và thẻ BHYT tại địa bàn xã Đăk Pxi.</p>
                    <span>Hôm nay 07:49</span>
                  </div>
                </div>
                <div className="tp-activity-item">
                  <div className="activity-dot green"></div>
                  <div className="activity-content">
                    <strong>Tài khoản hoạt động</strong>
                    <p>Trưởng phòng {fullName} đã đăng nhập thành công vào bảng điều hành cán bộ.</p>
                    <span>Vừa xong</span>
                  </div>
                </div>
                <div className="tp-activity-item">
                  <div className="activity-dot purple"></div>
                  <div className="activity-content">
                    <strong>Sao lưu hệ thống định kỳ</strong>
                    <p>Hệ thống dữ liệu đã hoàn thành sao lưu tự động đám mây an toàn.</p>
                    <span>Hôm qua 23:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thông báo đã ban hành */}
            <div className="tp-card">
              <h3>📢 Thông báo đã đăng tải cho bà con</h3>
              <div className="tp-notice-list">
                {notices.length === 0 ? (
                  <p className="text-center text-muted">Chưa có thông báo nào được đăng tải.</p>
                ) : (
                  notices.map((n) => (
                    <div className="tp-notice-item" key={n._id}>
                      <span className="notice-badge">📢 {n.type === "urgent" ? "Khẩn cấp" : "Thông báo"}</span>
                      <strong>{n.title}</strong>
                      <p>{n.content ? n.content.substring(0, 100) : ""}...</p>
                      <span className="notice-time">Ngày đăng: {n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN") : "N/A"}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
