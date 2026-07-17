import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TruongPhongDashboard.css";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app";

export default function TruongPhongDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const fullName = localStorage.getItem("admin_fullname");
  const role = localStorage.getItem("admin_role");

  // Authentication check
  useEffect(() => {
    if (!token) {
      navigate("/dang-nhap");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_fullname");
    navigate("/");
    window.location.reload();
  };

  // Tab State
  // For manager (truongphong): 'staff', 'schedule', 'updates'
  // For officer (canbo): 'tasks', 'citizens', 'articles', 'feedback'
  const [activeTab, setActiveTab] = useState(
    role === "truongphong" || role === "admin" ? "staff" : "tasks"
  );

  // General messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ── TRƯỞNG PHÒNG STATES ──
  // Tab: Staff
  const [subordinates, setSubordinates] = useState([]);
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "canbo",
  });
  // Tab: Schedule
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
  // Tab: Updates & Notifications
  const [notices, setNotices] = useState([]);

  // ── CÂN BỘ (OFFICER) STATES ──
  // Tab: Citizens & BHYT Management
  const [citizens, setCitizens] = useState([]);
  const [searchCitizen, setSearchCitizen] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [activeInsurance, setActiveInsurance] = useState(null);
  const [citizenForm, setCitizenForm] = useState({
    fullName: "",
    cccd: "",
    dob: "",
    gender: "Nam",
    phone: "",
    address: "",
  });
  const [insuranceForm, setInsuranceForm] = useState({
    cardCode: "",
    startDate: "",
    endDate: "",
    note: "",
    status: "active",
  });
  const [editingCitizenId, setEditingCitizenId] = useState(null);

  // Tab: Articles Management
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    tieu_de: "",
    mo_ta: "",
    noi_dung: "",
    danh_muc: "su-kien",
    trang_thai: "da-dang",
    chu_chay: "",
  });

  // File upload states
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [secondaryPreviews, setSecondaryPreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  // Tab: Feedback Management (Citizens feedback mock data for realism)
  const [replyInputs, setReplyInputs] = useState({});
  const [feedbacks, setFeedbacks] = useState([
    {
      _id: "fb1",
      senderName: "A Blong",
      phone: "0392817263",
      content: "Tôi muốn hỏi thủ tục cấp lại thẻ BHYT bị mất cho hộ nghèo tại thôn Đăk Wek.",
      createdAt: "2026-07-16T14:30:00Z",
      status: "pending",
    },
    {
      _id: "fb2",
      senderName: "Y H'Nhân",
      phone: "0354728192",
      content: "Thẻ BHYT của con tôi bị sai ngày tháng năm sinh trên hệ thống, mong cán bộ sửa lại.",
      createdAt: "2026-07-15T09:15:00Z",
      status: "resolved",
      reply: "Dạ thẻ của con chị đã được cán bộ phòng Văn hóa - Xã hội cập nhật khớp đúng theo giấy khai sinh rồi nhé. Chị có thể tra cứu thử lại trên trang chủ.",
    },
  ]);

  // Tab: Static tasks directed by Trưởng phòng Nguyễn Thái Huy for Cán bộ
  const [assignedTasks, setAssignedTasks] = useState([
    {
      id: 1,
      title: "Rà soát & cấp mới thẻ BHYT đợt 2",
      description: "Tập trung rà soát danh sách công dân thuộc hộ nghèo và đồng bào thiểu số tại thôn Đăk Xế Kơ Ne để tiến hành cấp thẻ kịp thời trước ngày 25/07.",
      sender: "Trưởng phòng Nguyễn Thái Huy",
      deadline: "25/07/2026",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Viết bài tuyên truyền phòng dịch & BHYT học đường",
      description: "Soạn thảo bài viết tuyên truyền phòng chống dịch bệnh mùa hè kết hợp hướng dẫn tham gia BHYT học sinh cho năm học tới.",
      sender: "Trưởng phòng Nguyễn Thái Huy",
      deadline: "20/07/2026",
      status: "completed",
    },
  ]);

  // ── Fetch Operations ──
  const fetchSubordinates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter((u) => u.role === "canbo" || u.role === "phophong");
      setSubordinates(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/lich-hop`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeetings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/thong-bao`);
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCitizens = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/citizens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitizens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/bai-viet/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      if (role === "truongphong" || role === "admin") {
        fetchSubordinates();
        fetchMeetings();
        fetchNotices();
      } else {
        fetchCitizens();
        fetchArticles();
        fetchMeetings(); // Cán bộ also tracks meetings
      }
    }
  }, [token, role]);

  // ── TRƯỞNG PHÒNG: Staff actions ──
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/api/v1/auth/users`,
        staffForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Cấp tài khoản cán bộ thành công!");
      setStaffForm({ fullName: "", username: "", password: "", role: "canbo" });
      fetchSubordinates();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cấp tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Xóa tài khoản cán bộ "${name}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa cán bộ thành công.");
      fetchSubordinates();
    } catch (err) {
      setError("Lỗi khi xóa tài khoản.");
    }
  };

  // ── TRƯỞNG PHÒNG: Meeting actions ──
  const handleMeetingSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      if (editingMeeting) {
        await axios.put(`${BASE_URL}/api/lich-hop/${editingMeeting._id}`, meetingForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cập nhật lịch họp thành công!");
        setEditingMeeting(null);
      } else {
        await axios.post(`${BASE_URL}/api/lich-hop`, meetingForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Thêm lịch họp thôn thành công!");
      }
      setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "hop-dan", note: "" });
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi lưu lịch họp.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm("Xóa lịch họp này?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/lich-hop/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa lịch trình thành công.");
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi xóa lịch họp.");
    }
  };

  // ── CÁN BỘ: Citizen & BHYT actions ──
  const handleCitizenSelect = async (citizen) => {
    setSelectedCitizen(citizen);
    setActiveInsurance(null);
    setInsuranceForm({ cardCode: "", startDate: "", endDate: "", note: "", status: "active" });

    try {
      const res = await axios.get(`${BASE_URL}/api/insurances/citizen/${citizen._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setActiveInsurance(res.data);
        setInsuranceForm({
          cardCode: res.data.cardCode || "",
          startDate: res.data.startDate || "",
          endDate: res.data.endDate || "",
          note: res.data.note || "",
          status: res.data.status || "active",
        });
      }
    } catch (err) {
      console.log("Công dân này chưa được cấp thẻ BHYT.");
    }
  };

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      if (editingCitizenId) {
        await axios.put(`${BASE_URL}/api/citizens/${editingCitizenId}`, citizenForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cập nhật thông tin công dân thành công!");
        setEditingCitizenId(null);
      } else {
        await axios.post(`${BASE_URL}/api/citizens`, citizenForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Thêm công dân thành công!");
      }
      setCitizenForm({ fullName: "", cccd: "", dob: "", gender: "Nam", phone: "", address: "" });
      fetchCitizens();
      setSelectedCitizen(null);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu thông tin công dân.");
    } finally {
      setLoading(false);
    }
  };

  const handleInsuranceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCitizen) return;
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const payload = { ...insuranceForm, citizenId: selectedCitizen._id };

      if (activeInsurance) {
        // Edit existing card
        await axios.put(`${BASE_URL}/api/insurances/${activeInsurance._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cập nhật thẻ BHYT thành công!");
      } else {
        // Issue new card
        await axios.post(`${BASE_URL}/api/insurances`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cấp thẻ BHYT thành công!");
      }
      handleCitizenSelect(selectedCitizen);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu thẻ BHYT.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCitizen = async (id, name) => {
    if (!window.confirm(`Xóa công dân "${name}" và thẻ BHYT liên quan?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/citizens/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa công dân thành công.");
      fetchCitizens();
      setSelectedCitizen(null);
    } catch (err) {
      setError("Lỗi khi xóa công dân.");
    }
  };

  // ── CÁN BỘ: Articles actions ──
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!articleForm.tieu_de || !articleForm.noi_dung) {
      setError("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("tieu_de", articleForm.tieu_de);
      fd.append("mo_ta", articleForm.mo_ta);
      fd.append("noi_dung", articleForm.noi_dung);
      fd.append("danh_muc", articleForm.danh_muc);
      fd.append("trang_thai", articleForm.trang_thai);
      fd.append("nguoi_dang", fullName);
      fd.append("chu_chay", articleForm.chu_chay);

      if (coverImage) {
        fd.append("anh", coverImage);
      }
      if (secondaryImages.length > 0) {
        secondaryImages.forEach((img) => {
          fd.append("anh_phu", img);
        });
      }
      if (videoFile) {
        fd.append("video", videoFile);
      }

      if (editingArticle) {
        await axios.put(`${BASE_URL}/api/v1/bai-viet/${editingArticle._id}`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Cập nhật bài viết thành công!");
        setEditingArticle(null);
      } else {
        await axios.post(`${BASE_URL}/api/v1/bai-viet`, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setMessage("Đăng bài viết tuyên truyền thành công!");
      }
      setArticleForm({ tieu_de: "", mo_ta: "", noi_dung: "", danh_muc: "su-kien", trang_thai: "da-dang", chu_chay: "" });
      
      // Reset upload files
      setCoverImage(null);
      setCoverPreview("");
      setSecondaryImages([]);
      setSecondaryPreviews([]);
      setVideoFile(null);
      setVideoPreview("");

      fetchArticles();
    } catch (err) {
      setError("Lỗi khi đăng bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditArticle = (item) => {
    setEditingArticle(item);
    setArticleForm({
      tieu_de: item.tieu_de || "",
      mo_ta: item.mo_ta || "",
      noi_dung: item.noi_dung || "",
      danh_muc: item.danh_muc || "su-kien",
      trang_thai: item.trang_thai || "da-dang",
      chu_chay: item.chu_chay || "",
    });
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài tuyên truyền này?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/bai-viet/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa bài viết.");
      fetchArticles();
    } catch (err) {
      setError("Lỗi khi xóa bài viết.");
    }
  };

  // ── Helper filter ──
  const filteredCitizens = citizens.filter((c) => {
    const q = searchCitizen.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.cccd.includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  return (
    <div className="tp-workspace-layout">
      {/* Left Sidebar Menu */}
      <aside className="tp-sidebar">
        <div className="tp-profile-section">
          <div className="tp-avatar">
            {fullName ? fullName.split(" ").pop().substring(0, 2).toUpperCase() : "CB"}
          </div>
          <div className="tp-profile-info">
            <h4 className="tp-profile-name">{fullName}</h4>
            <span className="tp-profile-role">
              {role === "truongphong" || role === "admin" ? "Trưởng phòng VH-XH" : "Cán bộ chuyên viên"}
            </span>
          </div>
        </div>

        <nav className="tp-nav-menu">
          {role === "truongphong" || role === "admin" ? (
            <>
              <button
                className={`tp-nav-item ${activeTab === "staff" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("staff");
                  setMessage("");
                  setError("");
                }}
              >
                👥 Cán bộ cấp dưới
              </button>
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("schedule");
                  setMessage("");
                  setError("");
                }}
              >
                📅 Lịch trình họp
              </button>
              <button
                className={`tp-nav-item ${activeTab === "updates" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("updates");
                  setMessage("");
                  setError("");
                }}
              >
                🔔 Nhật ký & Thông báo
              </button>
            </>
          ) : (
            <>
              <button
                className={`tp-nav-item ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("tasks");
                  setMessage("");
                  setError("");
                }}
              >
                📋 Chỉ đạo & Nhiệm vụ
              </button>
              <button
                className={`tp-nav-item ${activeTab === "citizens" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("citizens");
                  setMessage("");
                  setError("");
                }}
              >
                👥 Quản lý người dân BHYT
              </button>
              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("articles");
                  setMessage("");
                  setError("");
                }}
              >
                ✍️ Viết bài tuyên truyền
              </button>
              <button
                className={`tp-nav-item ${activeTab === "feedback" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("feedback");
                  setMessage("");
                  setError("");
                }}
              >
                💬 Góp ý & Phản hồi
              </button>
            </>
          )}
        </nav>

        <div className="tp-sidebar-footer">
          <button onClick={handleLogout} className="tp-sidebar-logout-btn">
            🚪 Đăng xuất tài khoản
          </button>
        </div>
      </aside>

      {/* Right Main Content */}
      <main className="tp-main-content">
        <header className="tp-content-header">
          <div>
            <span className="tp-header-breadcrumb">Không gian làm việc / VH-XH</span>
            <h2>
              {activeTab === "staff" && "Quản lý Cán bộ cấp dưới"}
              {activeTab === "schedule" && "Điều phối Lịch trình & Lịch họp thôn"}
              {activeTab === "updates" && "Nhật ký Hệ thống & Thông báo UBND"}
              {activeTab === "tasks" && "Chỉ thị & Nhiệm vụ được giao"}
              {activeTab === "citizens" && "Quản lý dữ liệu Công dân & Cấp thẻ BHYT"}
              {activeTab === "articles" && "Soạn thảo bài tuyên truyền cho bà con"}
              {activeTab === "feedback" && "Phản hồi & Giải đáp góp ý từ người dân"}
            </h2>
          </div>
          <div className="tp-header-badge">UBND Xã Đăk Pxi</div>
        </header>

        <div className="tp-content-body">
          {message && <div className="tp-alert-success">✅ {message}</div>}
          {error && <div className="tp-alert-error">⚠️ {error}</div>}

          {/* ──────────────────────────────────
              TRƯỞNG PHÒNG TAB CONTENTS
              ────────────────────────────────── */}
          {(role === "truongphong" || role === "admin") && (
            <>
              {activeTab === "staff" && (
                <div className="tp-grid">
                  <div className="tp-card tp-form-card">
                    <h3>➕ Cấp tài khoản mới</h3>
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
                        <label>Tên đăng nhập</label>
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
                          required
                        />
                      </div>

                      <div className="tp-form-group">
                        <label>Chức danh cấp bậc</label>
                        <select
                          value={staffForm.role}
                          onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                        >
                          <option value="canbo">Cán bộ chuyên viên</option>
                          <option value="phophong">Phó trưởng phòng</option>
                        </select>
                      </div>

                      <button type="submit" className="tp-btn-submit" disabled={loading}>
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

              {activeTab === "schedule" && (
                <div className="tp-grid">
                  <div className="tp-card tp-form-card">
                    <h3>{editingMeeting ? "✏️ Sửa lịch họp" : "📅 Thêm lịch họp mới"}</h3>
                    <form onSubmit={handleMeetingSubmit}>
                      <div className="tp-form-group">
                        <label>Tiêu đề cuộc họp</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Họp tuyên truyền thẻ BHYT"
                          value={meetingForm.title}
                          onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="tp-form-group-row">
                        <div className="tp-form-group">
                          <label>Ngày họp</label>
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
                          placeholder="Nội dung ghi chú..."
                          value={meetingForm.note}
                          onChange={(e) => setMeetingForm({ ...meetingForm, note: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="tp-btn-submit" disabled={loading}>
                        💾 Lưu lịch trình
                      </button>
                    </form>
                  </div>

                  <div className="tp-card tp-list-card">
                    <h3>📋 Danh sách lịch họp</h3>
                    <div className="tp-table-wrapper">
                      <table className="tp-table">
                        <thead>
                          <tr>
                            <th>Thông tin</th>
                            <th>Thời gian</th>
                            <th>Địa điểm</th>
                            <th style={{ textAlign: "center" }}>Loại</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {meetings.length === 0 ? (
                            <tr>
                              <td colSpan="5">Chưa có lịch họp nào.</td>
                            </tr>
                          ) : (
                            meetings.map((m) => (
                              <tr key={m._id}>
                                <td>
                                  <strong>{m.title}</strong>
                                </td>
                                <td>{m.date} - {m.time}</td>
                                <td>{m.thon} ({m.location})</td>
                                <td style={{ textAlign: "center" }}>
                                  <span className={`tp-meeting-badge ${m.type}`}>
                                    {getMeetingBadgeLabel(m.type)}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="tp-delete-btn-small"
                                    onClick={() => handleDeleteMeeting(m._id)}
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

              {activeTab === "updates" && (
                <div className="tp-grid tp-updates-grid">
                  <div className="tp-card">
                    <h3>🔔 Hoạt động & Cập nhật hệ thống</h3>
                    <div className="tp-activity-list">
                      <div className="tp-activity-item">
                        <div className="activity-dot blue"></div>
                        <div className="activity-content">
                          <strong>Đồng bộ cơ sở dữ liệu BHYT</strong>
                          <p>Hệ thống hoàn tất đồng bộ danh sách thẻ BHYT toàn bộ các hộ dân xã Đăk Pxi.</p>
                          <span>Hôm nay 08:05</span>
                        </div>
                      </div>
                      <div className="tp-activity-item">
                        <div className="activity-dot green"></div>
                        <div className="activity-content">
                          <strong>Truy cập hệ thống</strong>
                          <p>Trưởng phòng {fullName} đã truy cập bảng quản lý cán bộ trực thuộc.</p>
                          <span>Vừa xong</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tp-card">
                    <h3>📢 Thông báo trực tuyến đã gửi</h3>
                    <div className="tp-notice-list">
                      {notices.map((n) => (
                        <div className="tp-notice-item" key={n._id}>
                          <strong>{n.title}</strong>
                          <p>{n.content ? n.content.substring(0, 100) : ""}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ──────────────────────────────────
              CÁN BỘ TAB CONTENTS
              ────────────────────────────────── */}
          {(role === "canbo" || role === "phophong") && (
            <>
              {activeTab === "tasks" && (
                <div className="tp-tasks-section">
                  <div className="tp-card">
                    <h3>⚠️ Chỉ đạo công việc từ Trưởng phòng Nguyễn Thái Huy</h3>
                    <div className="tp-activity-list" style={{ marginTop: "15px" }}>
                      {assignedTasks.map((task) => (
                        <div className="tp-notice-item" key={task.id} style={{ borderLeft: "4px solid #1a3a5c", background: "#f8fafc" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span className="notice-badge" style={{ background: task.status === "completed" ? "#d1fae5" : "#fef3c7", color: task.status === "completed" ? "#065f46" : "#92400e" }}>
                              {task.status === "completed" ? "✅ Đã hoàn thành" : "⚡ Đang thực hiện"}
                            </span>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Hạn chót: {task.deadline}</span>
                          </div>
                          <strong>📌 {task.title}</strong>
                          <p style={{ marginTop: "6px", color: "#334155" }}>{task.description}</p>
                          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "10px", textAlign: "right" }}>
                            Người giao: <em>{task.sender}</em>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "citizens" && (
                <div className="tp-grid" style={{ gridTemplateColumns: "360px 1fr" }}>
                  <div className="tp-card tp-form-card">
                    <h3>{editingCitizenId ? "✏️ Sửa công dân" : "➕ Thêm công dân mới"}</h3>
                    <form onSubmit={handleCitizenSubmit} style={{ marginBottom: "20px" }}>
                      <div className="tp-form-group">
                        <label>Họ và tên công dân</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Y Byen"
                          value={citizenForm.fullName}
                          onChange={(e) => setCitizenForm({ ...citizenForm, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="tp-form-group">
                        <label>Số CCCD (12 số)</label>
                        <input
                          type="text"
                          placeholder="062095000123"
                          value={citizenForm.cccd}
                          onChange={(e) => setCitizenForm({ ...citizenForm, cccd: e.target.value })}
                          required
                        />
                      </div>

                      <div className="tp-form-group-row">
                        <div className="tp-form-group">
                          <label>Ngày sinh</label>
                          <input
                            type="date"
                            value={citizenForm.dob}
                            onChange={(e) => setCitizenForm({ ...citizenForm, dob: e.target.value })}
                            required
                          />
                        </div>
                        <div className="tp-form-group">
                          <label>Giới tính</label>
                          <select
                            value={citizenForm.gender}
                            onChange={(e) => setCitizenForm({ ...citizenForm, gender: e.target.value })}
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>
                      </div>

                      <div className="tp-form-group">
                        <label>Số điện thoại</label>
                        <input
                          type="text"
                          placeholder="0392888123"
                          value={citizenForm.phone}
                          onChange={(e) => setCitizenForm({ ...citizenForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="tp-form-group">
                        <label>Địa chỉ thường trú</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Thôn Đăk Wek"
                          value={citizenForm.address}
                          onChange={(e) => setCitizenForm({ ...citizenForm, address: e.target.value })}
                        />
                      </div>

                      <div className="tp-btn-group">
                        <button type="submit" className="tp-btn-submit" disabled={loading}>
                          {editingCitizenId ? "💾 Lưu" : "➕ Thêm"}
                        </button>
                        {editingCitizenId && (
                          <button
                            type="button"
                            className="tp-btn-cancel"
                            onClick={() => {
                              setEditingCitizenId(null);
                              setCitizenForm({ fullName: "", cccd: "", dob: "", gender: "Nam", phone: "", address: "" });
                            }}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>

                    {selectedCitizen && (
                      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
                        <h3 style={{ textTransform: "none", fontSize: "14px", border: "none", padding: 0 }}>
                          🎫 Cấp thẻ BHYT cho: <strong>{selectedCitizen.fullName}</strong>
                        </h3>
                        <form onSubmit={handleInsuranceSubmit} style={{ marginTop: "12px" }}>
                          <div className="tp-form-group">
                            <label>Mã số thẻ BHYT</label>
                            <input
                              type="text"
                              placeholder="GD4797931885408"
                              value={insuranceForm.cardCode}
                              onChange={(e) => setInsuranceForm({ ...insuranceForm, cardCode: e.target.value })}
                              required
                            />
                          </div>

                          <div className="tp-form-group-row">
                            <div className="tp-form-group">
                              <label>Ngày cấp</label>
                              <input
                                type="date"
                                value={insuranceForm.startDate}
                                onChange={(e) => setInsuranceForm({ ...insuranceForm, startDate: e.target.value })}
                                required
                              />
                            </div>
                            <div className="tp-form-group">
                              <label>Ngày hết hạn</label>
                              <input
                                type="date"
                                value={insuranceForm.endDate}
                                onChange={(e) => setInsuranceForm({ ...insuranceForm, endDate: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="tp-form-group">
                            <label>Trạng thái</label>
                            <select
                              value={insuranceForm.status}
                              onChange={(e) => setInsuranceForm({ ...insuranceForm, status: e.target.value })}
                            >
                              <option value="active">🟢 Đang hoạt động</option>
                              <option value="inactive">🔴 Bị khóa</option>
                            </select>
                          </div>

                          <button type="submit" className="tp-btn-submit" style={{ background: "#10b981" }} disabled={loading}>
                            💾 Lưu thẻ BHYT
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  <div className="tp-card tp-list-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                      <h3 style={{ margin: 0, padding: 0, border: "none" }}>📋 Danh sách công dân ({citizens.length})</h3>
                      <input
                        type="text"
                        placeholder="🔍 Tìm tên, CCCD, SĐT..."
                        style={{ width: "200px", padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                        value={searchCitizen}
                        onChange={(e) => setSearchCitizen(e.target.value)}
                      />
                    </div>

                    <div className="tp-table-wrapper">
                      <table className="tp-table">
                        <thead>
                          <tr>
                            <th>Công dân</th>
                            <th>Liên hệ</th>
                            <th>Thẻ BHYT</th>
                            <th style={{ textAlign: "center" }}>Hành động BHYT</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCitizens.length === 0 ? (
                            <tr>
                              <td colSpan="5">Không tìm thấy công dân nào.</td>
                            </tr>
                          ) : (
                            filteredCitizens.map((c) => (
                              <tr key={c._id} className={selectedCitizen?._id === c._id ? "selected-row" : ""}>
                                <td>
                                  <strong>{c.fullName}</strong>
                                  <div className="text-muted" style={{ fontSize: "11px" }}>CCCD: {c.cccd}</div>
                                </td>
                                <td>
                                  <div>📞 {c.phone || "N/A"}</div>
                                  <div className="text-muted" style={{ fontSize: "11.5px" }}>🏠 {c.address || "N/A"}</div>
                                </td>
                                <td>
                                  {c.insuranceCard ? (
                                    <div style={{ fontSize: "13px" }}>
                                      <span style={{ color: "#1a3a5c", fontWeight: "700" }}>💳 {c.insuranceCard.cardCode}</span>
                                      <div style={{ fontSize: "11px", color: c.insuranceCard.status === "active" ? "#166534" : "#991b1b" }}>
                                        {c.insuranceCard.status === "active" ? "🟢 Đang hoạt động" : "🔴 Tạm khóa"}
                                      </div>
                                    </div>
                                  ) : (
                                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>Chưa cấp thẻ BHYT</span>
                                  )}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <button
                                    className="tp-edit-btn-small"
                                    style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
                                    onClick={() => handleCitizenSelect(c)}
                                  >
                                    🎫 Cấp/Sửa BHYT
                                  </button>
                                </td>
                                <td>
                                  <div className="tp-table-actions">
                                    <button
                                      className="tp-edit-btn-small"
                                      onClick={() => {
                                        setEditingCitizenId(c._id);
                                        setCitizenForm({
                                          fullName: c.fullName,
                                          cccd: c.cccd,
                                          dob: c.dob ? c.dob.substring(0, 10) : "",
                                          gender: c.gender || "Nam",
                                          phone: c.phone || "",
                                          address: c.address || "",
                                        });
                                      }}
                                    >
                                      ✏️ Sửa
                                    </button>
                                    <button
                                      className="tp-delete-btn-small"
                                      onClick={() => handleDeleteCitizen(c._id, c.fullName)}
                                    >
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

              {activeTab === "articles" && (
                <div className="tp-grid" style={{ gridTemplateColumns: "360px 1fr" }}>
                  <div className="tp-card tp-form-card">
                    <h3>{editingArticle ? "✏️ Sửa bài viết" : "✍️ Soạn bài viết"}</h3>
                    <form onSubmit={handleArticleSubmit}>
                      <div className="tp-form-group">
                        <label>Tiêu đề bài viết</label>
                        <input
                          type="text"
                          placeholder="Nhập tiêu đề..."
                          value={articleForm.tieu_de}
                          onChange={(e) => setArticleForm({ ...articleForm, tieu_de: e.target.value })}
                          required
                        />
                      </div>

                      <div className="tp-form-group">
                        <label>Chuyên mục</label>
                        <select
                          value={articleForm.danh_muc}
                          onChange={(e) => setArticleForm({ ...articleForm, danh_muc: e.target.value })}
                        >
                          <option value="su-kien">Sự kiện xã Đăk Pxi</option>
                          <option value="the-thao">Thể thao phong trào</option>
                          <option value="le-hoi">Lễ hội văn hóa truyền thống</option>
                          <option value="bau-cu">Tuyên truyền bầu cử</option>
                          <option value="khac">Khác</option>
                        </select>
                      </div>

                      <div className="tp-form-group">
                        <label>Tóm tắt ngắn</label>
                        <textarea
                          rows="2"
                          placeholder="Tóm tắt ngắn..."
                          value={articleForm.mo_ta}
                          onChange={(e) => setArticleForm({ ...articleForm, mo_ta: e.target.value })}
                        />
                      </div>

                      <div className="tp-form-group">
                        <label>Nội dung bài viết chi tiết</label>
                        <textarea
                          rows="6"
                          placeholder="Viết nội dung tại đây..."
                          value={articleForm.noi_dung}
                          onChange={(e) => setArticleForm({ ...articleForm, noi_dung: e.target.value })}
                          required
                        />
                      </div>

                      <div className="tp-form-group">
                        <label>Chữ chạy tùy chọn (Trang chủ)</label>
                        <input
                          type="text"
                          placeholder="Nhập chữ chạy thông báo..."
                          value={articleForm.chu_chay}
                          onChange={(e) => setArticleForm({ ...articleForm, chu_chay: e.target.value })}
                        />
                      </div>

                      {/* Cover Image Upload */}
                      <div className="tp-form-group">
                        <label>Ảnh đại diện bài tuyên truyền (Ảnh bìa)</label>
                        <div className="tp-file-uploader-box">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setCoverImage(file);
                                setCoverPreview(URL.createObjectURL(file));
                              }
                            }}
                            id="cover-upload-input"
                            style={{ display: "none" }}
                          />
                          <label htmlFor="cover-upload-input" className="tp-uploader-label" style={{ display: "block", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "16px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
                            {coverPreview ? (
                              <div className="tp-uploader-preview-container" style={{ position: "relative" }}>
                                <img src={coverPreview} alt="Cover Preview" className="tp-uploader-preview" style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "6px" }} />
                                <button
                                  type="button"
                                  className="tp-uploader-remove-btn"
                                  style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCoverImage(null);
                                    setCoverPreview("");
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="tp-uploader-placeholder" style={{ color: "#64748b", fontSize: "13.5px" }}>
                                🖼️ Chọn ảnh bìa bài viết
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Multiple Images Upload */}
                      <div className="tp-form-group">
                        <label>Bộ sưu tập ảnh chi tiết (Nhiều ảnh đính kèm)</label>
                        <div className="tp-file-uploader-box">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              if (files.length > 0) {
                                setSecondaryImages([...secondaryImages, ...files]);
                                const newPreviews = files.map((f) => URL.createObjectURL(f));
                                setSecondaryPreviews([...secondaryPreviews, ...newPreviews]);
                              }
                            }}
                            id="multi-upload-input"
                            style={{ display: "none" }}
                          />
                          <label htmlFor="multi-upload-input" className="tp-uploader-label-multi" style={{ display: "block", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "12px", textAlign: "center", cursor: "pointer", background: "#f8fafc", color: "#64748b", fontSize: "13px" }}>
                            📁 Chọn nhiều ảnh đính kèm bài viết (Album)
                          </label>
                        </div>
                        {secondaryPreviews.length > 0 && (
                          <div className="tp-multi-previews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "10px" }}>
                            {secondaryPreviews.map((p, index) => (
                              <div className="tp-multi-preview-item" key={index} style={{ position: "relative", width: "100%", paddingBottom: "100%", height: 0, borderRadius: "6px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                <img src={p} alt={`Preview ${index}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                                <button
                                  type="button"
                                  className="tp-multi-preview-remove"
                                  style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justify: "center", cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const newImages = [...secondaryImages];
                                    newImages.splice(index, 1);
                                    setSecondaryImages(newImages);

                                    const newPreviews = [...secondaryPreviews];
                                    newPreviews.splice(index, 1);
                                    setSecondaryPreviews(newPreviews);
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Video Upload */}
                      <div className="tp-form-group">
                        <label>Video tuyên truyền đính kèm (Nêu có)</label>
                        <div className="tp-file-uploader-box">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setVideoFile(file);
                                setVideoPreview(URL.createObjectURL(file));
                              }
                            }}
                            id="video-upload-input"
                            style={{ display: "none" }}
                          />
                          <label htmlFor="video-upload-input" className="tp-uploader-label" style={{ display: "block", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "16px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
                            {videoPreview ? (
                              <div className="tp-uploader-preview-container" style={{ position: "relative" }}>
                                <video src={videoPreview} controls className="tp-uploader-preview-video" style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "6px" }} />
                                <button
                                  type="button"
                                  className="tp-uploader-remove-btn"
                                  style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setVideoFile(null);
                                    setVideoPreview("");
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="tp-uploader-placeholder" style={{ color: "#64748b", fontSize: "13.5px" }}>
                                📹 Chọn video đính kèm bài viết
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="tp-btn-group">
                        <button type="submit" className="tp-btn-submit" disabled={loading}>
                          {editingArticle ? "💾 Lưu" : "📢 Đăng"}
                        </button>
                        {editingArticle && (
                          <button
                            type="button"
                            className="tp-btn-cancel"
                            onClick={() => {
                              setEditingArticle(null);
                              setArticleForm({ tieu_de: "", mo_ta: "", noi_dung: "", danh_muc: "su-kien", trang_thai: "da-dang", chu_chay: "" });
                            }}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className="tp-card tp-list-card">
                    <h3>📋 Danh sách bài viết đã đăng</h3>
                    <div className="tp-table-wrapper">
                      <table className="tp-table">
                        <thead>
                          <tr>
                            <th>Tên bài viết</th>
                            <th>Chuyên mục</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.length === 0 ? (
                            <tr>
                              <td colSpan="4">Chưa có bài viết nào.</td>
                            </tr>
                          ) : (
                            articles.map((art) => (
                              <tr key={art._id}>
                                <td>
                                  <strong>{art.tieu_de}</strong>
                                </td>
                                <td>
                                  <span className={`tp-meeting-badge ${art.danh_muc}`}>
                                    {art.danh_muc === "bau-cu" ? "🗳️ Bầu cử" : "📌 Chuyên mục"}
                                  </span>
                                </td>
                                <td>{new Date(art.createdAt).toLocaleDateString("vi-VN")}</td>
                                <td>
                                  <div className="tp-table-actions">
                                    <button className="tp-edit-btn-small" onClick={() => handleEditArticle(art)}>
                                      ✏️ Sửa
                                    </button>
                                    <button className="tp-delete-btn-small" onClick={() => handleDeleteArticle(art._id)}>
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

              {activeTab === "feedback" && (
                <div className="tp-feedback-section">
                  <div className="tp-alert-success" style={{ background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1", borderLeft: "4px solid #1a3a5c", marginBottom: "20px" }}>
                    💡 <strong>Hướng dẫn nghiệp vụ giải đáp góp ý công dân</strong>:
                    <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "13px", lineHeight: "1.6" }}>
                      <li>Với các câu hỏi chung, hãy khuyến khích bà con trao đổi với <strong>Trợ lý AI</strong> ở trang chủ để được hồi đáp tức thì.</li>
                      <li>Chỉ trực tiếp phản hồi tại đây hoặc nhắn <strong>Zalo riêng</strong> khi có công việc hành chính quan trọng.</li>
                    </ul>
                  </div>

                  <div className="tp-card">
                    <h3>💬 Ý kiến đóng góp từ bà con nhân dân</h3>
                    <div className="tp-notice-list" style={{ marginTop: "15px" }}>
                      {feedbacks.map((fb) => (
                        <div className="tp-notice-item" key={fb._id} style={{ borderLeft: "4px solid #1a3a5c" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>Bà con: {fb.senderName} (SĐT: {fb.phone})</strong>
                            <span style={{ fontSize: "11px", color: fb.status === "resolved" ? "#065f46" : "#991b1b", background: fb.status === "resolved" ? "#d1fae5" : "#fee2e2", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                              {fb.status === "resolved" ? "✅ Đã giải đáp" : "⚡ Đang xử lý"}
                            </span>
                          </div>
                          <p style={{ marginTop: "8px", color: "#334155" }}>{fb.content}</p>
                          
                          {fb.status === "resolved" ? (
                            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px 14px", borderRadius: "8px", marginTop: "10px", fontSize: "13.5px" }}>
                              <strong style={{ color: "#15803d" }}>💬 Phản hồi:</strong> {fb.reply}
                            </div>
                          ) : (
                            <div style={{ marginTop: "10px" }}>
                              <textarea
                                rows="2"
                                placeholder="Nhập câu trả lời cho bà con..."
                                style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13.5px", fontFamily: "inherit" }}
                                value={replyInputs[fb._id] || ""}
                                onChange={(e) => setReplyInputs({ ...replyInputs, [fb._id]: e.target.value })}
                              />
                            </div>
                          )}

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Ngày gửi: {new Date(fb.createdAt).toLocaleDateString("vi-VN")}</span>
                            
                            <div style={{ display: "flex", gap: "8px" }}>
                              {fb.status === "pending" && (
                                <button
                                  className="tp-edit-btn-small"
                                  style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
                                  onClick={() => {
                                    const replyText = replyInputs[fb._id] || "";
                                    if (!replyText.trim()) {
                                      alert("Vui lòng nhập nội dung phản hồi.");
                                      return;
                                    }
                                    setFeedbacks(feedbacks.map(f => f._id === fb._id ? { ...f, status: "resolved", reply: replyText } : f));
                                    setMessage("Đã gửi phản hồi thành công!");
                                  }}
                                >
                                  ✉️ Gửi phản hồi
                                </button>
                              )}
                              
                              <a
                                href={`https://zalo.me/${fb.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tp-edit-btn-small"
                                style={{ background: "#0068ff", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "700" }}
                              >
                                💬 Nhắn Zalo riêng
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
