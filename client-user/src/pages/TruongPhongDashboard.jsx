import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TruongPhongDashboard.css";
import ChatWindow from "../components/ai/ChatWindow";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

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
  const [activeTab, setActiveTab] = useState("dashboard");

  // General messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleTimeString("vi-VN") + " - " + date.toLocaleDateString("vi-VN");
  };

  const getMeetingBadgeLabel = (t) => {
    if (t === "giao-ban") return "👥 Giao ban";
    if (t === "hop-khan") return "🚨 Họp khẩn";
    if (t === "chuyen-de") return "📑 Chuyên đề";
    if (t === "tap-huan") return "📚 Tập huấn";
    if (t === "hop-dan") return "👥 Họp dân";
    if (t === "tiem-chung") return "💉 Tiêm chủng";
    if (t === "phat-ho-tro") return "🎁 Hỗ trợ";
    return "📌 Khác";
  };

  const getMeetingCountdown = (dateStr, timeStr) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const [hour, minute] = timeStr.split(":").map(Number);
      const meetingTime = new Date(year, month - 1, day, hour, minute, 0);
      const now = currentTime;
      const diffMs = meetingTime - now;

      if (diffMs > 0) {
        const diffSecs = Math.floor(diffMs / 1000);
        const secs = diffSecs % 60;
        const mins = Math.floor(diffSecs / 60) % 60;
        const hours = Math.floor(diffSecs / 3600) % 24;
        const days = Math.floor(diffSecs / 86400);

        let label = "";
        if (days > 0) {
          label = `Còn ${days} ngày ${hours}h`;
        } else if (hours > 0) {
          label = `Còn ${hours}h ${mins}m`;
        } else {
          label = `Còn ${mins}m ${secs}s`;
        }

        return {
          status: "upcoming",
          label,
          className: "meeting-status-upcoming"
        };
      } else {
        const durationMs = 2 * 60 * 60 * 1000; // 2 hour duration
        if (now - meetingTime < durationMs) {
          const remainingMs = durationMs - (now - meetingTime);
          const mins = Math.floor(remainingMs / 60000);
          const secs = Math.floor((remainingMs % 60000) / 1000);
          return {
            status: "ongoing",
            label: `⚡ Đang diễn ra (${mins}m ${secs}s)`,
            className: "meeting-status-ongoing"
          };
        } else {
          return {
            status: "completed",
            label: "✅ Đã kết thúc",
            className: "meeting-status-completed"
          };
        }
      }
    } catch (e) {
      return {
        status: "unknown",
        label: "Không rõ thời gian",
        className: "meeting-status-unknown"
      };
    }
  };

  // ── TRƯỞNG PHÒNG STATES ──
  // Tab: Staff
  const [subordinates, setSubordinates] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [usernamePrefix, setUsernamePrefix] = useState("");
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    username: "",
    password: "Vhxh@2026",
    role: "canbo",
  });

  const [visitorStats, setVisitorStats] = useState({
    todayCount: 142,
    onlineCanBo: 3,
    onlineCitizens: 1,
    onlineTotal: 4,
    onlineList: []
  });
  const [selectedDetailTab, setSelectedDetailTab] = useState("tuyen-truyen");
  // Tab: Schedule
  const [meetings, setMeetings] = useState([]);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    thon: "",
    type: "giao-ban",
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
      fetchCitizens();
      fetchArticles();
      fetchMeetings();
      fetchNotices();
      fetchSubordinates();
    }
  }, [token]);

  // ── TRƯỞNG PHÒNG: Staff actions ──
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      if (editingStaff) {
        const payload = {
          fullName: staffForm.fullName,
          role: staffForm.role,
        };
        if (staffForm.password) {
          payload.password = staffForm.password;
        }
        await axios.put(
          `${BASE_URL}/api/v1/auth/users/${editingStaff._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Cập nhật tài khoản cán bộ thành công!");
        setEditingStaff(null);
      } else {
        const fullUsername = usernamePrefix.trim() + ".vhxh";
        await axios.post(
          `${BASE_URL}/api/v1/auth/users`,
          { ...staffForm, username: fullUsername },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Cấp tài khoản cán bộ thành công!");
      }
      setStaffForm({ fullName: "", username: "", password: "Vhxh@2026", role: "canbo" });
      setUsernamePrefix("");
      fetchSubordinates();
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi lưu tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (s) => {
    setEditingStaff(s);
    const prefix = s.username.endsWith(".vhxh") ? s.username.slice(0, -5) : s.username;
    setUsernamePrefix(prefix);
    setStaffForm({
      fullName: s.fullName,
      username: s.username,
      password: "",
      role: s.role
    });
  };

  const fetchVisitorStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/visitor/stats`);
      if (res.data && res.data.success) {
        setVisitorStats(res.data);
      }
    } catch (err) {
      console.error("Lỗi tải thông tin truy cập:", err);
    }
  };

  useEffect(() => {
    fetchVisitorStats();
    const interval = setInterval(fetchVisitorStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrentTime = (date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    return `${hh}:${mm}:${ss} - ${d}/${m}/${y}`;
  };

  const handleToggleStaffStatus = async (staff) => {
    setMessage("");
    setError("");
    try {
      const newStatus = staff.status === "suspended" ? "active" : "suspended";
      const confirmMsg = newStatus === "suspended" 
        ? `Bạn có muốn tạm dừng tài khoản cán bộ "${staff.fullName}"?`
        : `Bạn có muốn kích hoạt lại tài khoản cán bộ "${staff.fullName}"?`;
      
      if (!window.confirm(confirmMsg)) return;

      await axios.put(
        `${BASE_URL}/api/v1/auth/users/${staff._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`${newStatus === "suspended" ? "Đã tạm dừng" : "Đã kích hoạt"} tài khoản thành công!`);
      fetchSubordinates();
    } catch (err) {
      setError("Lỗi khi thay đổi trạng thái tài khoản.");
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
        setMessage("Cập nhật cuộc họp thành công!");
        setEditingMeeting(null);
      } else {
        await axios.post(`${BASE_URL}/api/lich-hop`, meetingForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Tạo cuộc họp cơ quan thành công!");
      }
      setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "giao-ban", note: "" });
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi lưu cuộc họp.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc họp này?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/lich-hop/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa cuộc họp thành công.");
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi xóa cuộc họp.");
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
        <div className="tp-profile-section" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", width: "100%", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
            <div className="tp-avatar" style={{ width: "40px", height: "40px", fontSize: "14px", flexShrink: 0 }}>
              {fullName ? fullName.split(" ").pop().substring(0, 2).toUpperCase() : "CB"}
            </div>
            <div className="tp-profile-info" style={{ minWidth: 0 }}>
              <h4 className="tp-profile-name" style={{ fontSize: "14.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName}</h4>
              <span className="tp-profile-role" style={{ fontSize: "11px" }}>
                {role === "truongphong" || role === "admin" ? "Trưởng phòng VH-XH" : role === "phophong" ? "Phó phòng VH-XH" : "Cán bộ chuyên viên"}
              </span>
            </div>
          </div>

          {/* Icon thông báo đơn giản */}
          <div 
            onClick={() => {
              if (role === "truongphong" || role === "admin") {
                setActiveTab("updates");
              } else {
                setActiveTab("schedule");
              }
            }}
            style={{ 
              position: "relative", 
              cursor: "pointer", 
              display: "inline-flex", 
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%", 
              background: "#f8fafc", 
              border: "1px solid #cbd5e1", 
              color: "#475569",
              flexShrink: 0
            }}
            title="Xem thông báo"
          >
            <span style={{ fontSize: "15px" }}>🔔</span>
            <span style={{ 
              position: "absolute", 
              top: "1px", 
              right: "1px", 
              width: "7px", 
              height: "7px", 
              borderRadius: "50%", 
              background: "#ef4444", 
              border: "1.5px solid #fff" 
            }} />
          </div>
        </div>

        <nav className="tp-nav-menu">
          {/* Trưởng phòng & Admin */}
          {(role === "truongphong" || role === "admin") && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("dashboard");
                  setMessage("");
                  setError("");
                }}
              >
                📊 Trang tổng quan
              </button>
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
                📅 Lịch họp cơ quan
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
              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("ai-assistant");
                  setMessage("");
                  setError("");
                }}
              >
                🤖 Trợ lý AI nghiệp vụ
              </button>
            </>
          )}

          {/* Phó phòng */}
          {role === "phophong" && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("dashboard");
                  setMessage("");
                  setError("");
                }}
              >
                📊 Trang tổng quan
              </button>
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("schedule");
                  setMessage("");
                  setError("");
                }}
              >
                📅 Lịch họp cơ quan
              </button>
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
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("ai-assistant");
                  setMessage("");
                  setError("");
                }}
              >
                🤖 Trợ lý AI nghiệp vụ
              </button>
            </>
          )}

          {/* Cán bộ */}
          {role === "canbo" && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("dashboard");
                  setMessage("");
                  setError("");
                }}
              >
                📊 Trang tổng quan
              </button>
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("schedule");
                  setMessage("");
                  setError("");
                }}
              >
                📅 Lịch họp cơ quan
              </button>
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
              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("ai-assistant");
                  setMessage("");
                  setError("");
                }}
              >
                🤖 Trợ lý AI nghiệp vụ
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
        <header className="tp-content-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="tp-header-breadcrumb">Không gian làm việc / VH-XH</span>
            <h2>
              {activeTab === "dashboard" && "Trang tổng quan & Theo dõi hoạt động thời gian thực"}
              {activeTab === "staff" && "Quản lý Cán bộ cấp dưới"}
              {activeTab === "schedule" && "Lịch họp & Điều phối lịch công tác"}
              {activeTab === "updates" && "Nhật ký Hệ thống & Thông báo UBND"}
              {activeTab === "tasks" && "Chỉ thị & Nhiệm vụ được giao"}
              {activeTab === "citizens" && "Quản lý dữ liệu Công dân & Cấp thẻ BHYT"}
              {activeTab === "articles" && "Soạn thảo bài tuyên truyền cho bà con"}
              {activeTab === "feedback" && "Phản hồi & Giải đáp góp ý từ người dân"}
              {activeTab === "ai-assistant" && "Trợ lý AI hỗ trợ nghiệp vụ & Giải đáp thắc mắc"}
            </h2>
          </div>

          {/* Đồng hồ thời gian hiện tại góc bên phải */}
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", color: "#475569", fontWeight: "600", textAlign: "right", marginBottom: "2px" }}>Thời gian hiện tại</span>
            <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🕒</span>
              <span style={{ fontFamily: "monospace" }}>{formatCurrentTime(currentTime)}</span>
            </div>
          </div>
        </header>

        <div className="tp-content-body">
          {message && <div className="tp-alert-success">✅ {message}</div>}
          {error && <div className="tp-alert-error">⚠️ {error}</div>}

          {activeTab === "dashboard" && (() => {
            // Tính toán số liệu thực tế từ database
            const activeCardsCount = citizens.filter(c => c.insuranceCard && c.insuranceCard.status === 'active').length;
            const pendingCardsCount = citizens.filter(c => !c.insuranceCard).length;
            
            // Phân bổ thôn dân cư thực tế
            let dakWek = 0;
            let dakXe = 0;
            let dakPxi = 0;
            citizens.forEach(c => {
              const addr = (c.address || "").toLowerCase();
              if (addr.includes("wek")) dakWek++;
              else if (addr.includes("xế") || addr.includes("xe")) dakXe++;
              else dakPxi++;
            });
            const totalThon = dakWek + dakXe + dakPxi || 1;
            const wekPct = parseFloat(((dakWek / totalThon) * 100).toFixed(1));
            const xePct = parseFloat(((dakXe / totalThon) * 100).toFixed(1));
            const pxiPct = parseFloat(((dakPxi / totalThon) * 100).toFixed(1));

            // Số công dân đăng ký theo tháng (12 tháng)
            const countsByMonth = Array(12).fill(0);
            citizens.forEach(c => {
              if (c.createdAt) {
                const month = new Date(c.createdAt).getMonth();
                countsByMonth[month]++;
              }
            });
            const maxMonthCount = Math.max(...countsByMonth, 0);

            // Tỷ lệ phản hồi đã giải quyết
            const resolvedFeedbacks = feedbacks.filter(f => f.status === 'resolved').length;
            const feedbackRate = ((resolvedFeedbacks / (feedbacks.length || 1)) * 100).toFixed(1);

            return (
              <div className="tp-dashboard-wrapper" style={{ animation: "fadeIn 0.25s ease-out", display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {/* CSS cục bộ cho Tooltip và Hover */}
                <style>{`
                  .tp-tooltip-container {
                    position: relative;
                  }
                  .tp-tooltip-box {
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    bottom: 125%;
                    left: 50%;
                    transform: translateX(-50%) translateY(4px);
                    background: #0f172a;
                    color: #ffffff;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    white-space: nowrap;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    pointer-events: none;
                    transition: opacity 0.15s ease, transform 0.15s ease;
                    z-index: 999;
                  }
                  .tp-tooltip-box::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 5px;
                    border-style: solid;
                    border-color: #0f172a transparent transparent transparent;
                  }
                  .tp-tooltip-container:hover .tp-tooltip-box {
                    visibility: visible;
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                  }
                  
                  .tp-hover-bar {
                    transition: all 0.2s ease-in-out;
                  }
                  .tp-hover-bar:hover {
                    transform: scaleY(1.15);
                    background: #3b82f6 !important;
                    cursor: pointer;
                  }
                  .tp-hover-bar-white {
                    transition: all 0.2s ease-in-out;
                  }
                  .tp-hover-bar-white:hover {
                    transform: scaleY(1.15);
                    filter: brightness(1.2);
                    cursor: pointer;
                  }
                  
                  .tp-hover-donut {
                    transition: all 0.2s ease-in-out;
                    transform-origin: center;
                  }
                  .tp-hover-donut:hover {
                    transform: scale(1.05);
                    cursor: pointer;
                  }
                  
                  .tp-hover-pie {
                    transition: all 0.2s ease-in-out;
                    transform-origin: center;
                  }
                  .tp-hover-pie:hover {
                    filter: brightness(1.15);
                    transform: scale(1.03);
                    cursor: pointer;
                  }
                  
                  .tp-hover-wave {
                    transition: all 0.2s ease-in-out;
                  }
                  .tp-hover-wave:hover {
                    filter: brightness(1.1);
                    cursor: pointer;
                  }
                `}</style>

                {/* Khối phía trên: Nền Xanh dương đậm (Navy) */}
                <div style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #2b5c8f 100%)", borderRadius: "8px", padding: "24px", color: "#ffffff", display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr", gap: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  
                  {/* Cột 1: 3 hàng chỉ số thực tế */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
                    <div className="tp-tooltip-container" style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "24px", fontWeight: "850", lineHeight: 1 }}>{visitorStats.onlineTotal} người</div>
                      <div style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase", fontWeight: "700", marginTop: "4px", letterSpacing: "0.5px" }}>ĐANG TRỰC TUYẾN THỜI GIAN THỰC</div>
                      <div className="tp-tooltip-box" style={{ bottom: "auto", top: "105%", left: "0", transform: "none" }}>Chi tiết: {visitorStats.onlineCanBo} cán bộ, {visitorStats.onlineCitizens} người dân</div>
                    </div>

                    <div className="tp-tooltip-container" style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "24px", fontWeight: "850", lineHeight: 1 }}>{visitorStats.todayCount} lượt</div>
                      <div style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase", fontWeight: "700", marginTop: "4px", letterSpacing: "0.5px" }}>LƯỢT TRUY CẬP HỆ THỐNG / HÔM NAY</div>
                      <div className="tp-tooltip-box" style={{ bottom: "auto", top: "105%", left: "0", transform: "none" }}>Lượt truy cập IP duy nhất trong ngày</div>
                    </div>

                    <div className="tp-tooltip-container" style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "24px", fontWeight: "850", lineHeight: 1 }}>{citizens.filter(c => c.insuranceCard).length} thẻ BHYT</div>
                      <div style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase", fontWeight: "700", marginTop: "4px", letterSpacing: "0.5px" }}>THẺ BHYT ĐÃ CẤP TRÊN HỆ THỐNG</div>
                      <div className="tp-tooltip-box" style={{ bottom: "auto", top: "105%", left: "0", transform: "none" }}>Hoạt động: {activeCardsCount} | Chưa cấp: {pendingCardsCount} công dân</div>
                    </div>
                  </div>

                  {/* Cột 2: Chỉ số lớn + Biểu đồ cột màu trắng từ database */}
                  <div style={{ borderLeft: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)", padding: "0 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "26px", fontWeight: "850", lineHeight: 1 }}>8 giờ / ngày</div>
                      <div style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase", fontWeight: "700", marginTop: "4px", letterSpacing: "0.5px" }}>Thời gian hoạt động hành chính</div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "85px", padding: "0 10px" }}>
                      {countsByMonth.map((val, i) => {
                        const h = maxMonthCount === 0 
                          ? [20, 25, 30, 35, 30, 25, 20, 28, 35, 42, 38, 45][i] 
                          : (val / maxMonthCount) * 65 + 15;
                        return (
                          <div key={i} className="tp-tooltip-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "6%" }}>
                            <div className="tp-hover-bar-white" style={{ height: `${h}px`, background: "#ffffff", borderRadius: "1px", width: "100%" }}></div>
                            <span style={{ fontSize: "9px", opacity: 0.8, marginTop: "4px" }}>
                              {["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"][i]}
                            </span>
                            <div className="tp-tooltip-box">Đăng ký mới: {val} công dân</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cột 3: Chỉ số hoàn thành + Donut chart khuyết */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "24px", fontWeight: "850", lineHeight: 1 }}>{feedbackRate}%</div>
                      <div style={{ fontSize: "11px", opacity: 0.85, textTransform: "uppercase", fontWeight: "700", marginTop: "4px", letterSpacing: "0.5px" }}>Tỷ lệ phản hồi công dân đã xử lý</div>
                    </div>

                    <div className="tp-tooltip-container tp-hover-donut" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <svg width="105" height="105" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="12" />
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#ffffff" strokeWidth="12"
                          strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * parseFloat(feedbackRate)) / 100}
                          strokeLinecap="round" transform="rotate(-90 60 60)" />
                        <text x="60" y="66" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">{feedbackRate}%</text>
                      </svg>
                      <div className="tp-tooltip-box">Đã giải quyết: {resolvedFeedbacks} | Đang chờ: {feedbacks.length - resolvedFeedbacks} phản hồi</div>
                    </div>
                  </div>

                </div>

                {/* Khối phía dưới: Nền trắng 3 Cột */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: "20px" }}>
                  
                  {/* Hộp 1: Tăng trưởng cộng dồn thực tế */}
                  <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#475569", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>Quy mô dân cư đăng ký tích lũy</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ background: "#1a3a5c", color: "#ffffff", padding: "6px 14px", borderRadius: "20px", fontSize: "16px", fontWeight: "800" }}>{citizens.length} người</span>
                        <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>CƠ SỞ DỮ LIỆU THỰC TẾ</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "110px", padding: "10px 0" }}>
                      {(() => {
                        let sum = 0;
                        const cumulative = countsByMonth.map(val => {
                          sum += val;
                          return sum;
                        });
                        const maxCumulative = Math.max(...cumulative, 0);
                        return cumulative.map((val, i) => {
                          const h = maxCumulative === 0 
                            ? [10, 18, 25, 38, 48, 55, 62, 75, 88, 98, 110, 120][i] 
                            : (val / maxCumulative) * 95 + 15;
                          return (
                            <div key={i} className="tp-tooltip-container tp-hover-bar" style={{ width: "6%", height: `${h}px`, background: "#1a3a5c", borderRadius: "1px" }}>
                              <div className="tp-tooltip-box" style={{ bottom: "105%" }}>Tháng {i+1}: Tích lũy {maxCumulative === 0 ? i * 2 + 1 : val} người</div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center", fontWeight: "700", textTransform: "uppercase", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                      Số lượng công dân tích lũy | 12 tháng qua
                    </div>
                  </div>

                  {/* Hộp 2: Phân bổ BHYT theo thôn thực tế */}
                  <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#475569", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>Phân bổ công dân theo địa bàn thôn</div>

                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "130px" }}>
                      <svg width="120" height="120" viewBox="0 0 100 100">
                        {/* Biểu đồ tròn dùng stroke-dasharray (chu vi = 157.08) */}
                        <circle cx="50" cy="50" r="25" fill="none" stroke="#1a3a5c" strokeWidth="50"
                          strokeDasharray="157.08"
                          strokeDashoffset="0" />
                        <circle cx="50" cy="50" r="25" fill="none" stroke="#3b82f6" strokeWidth="50"
                          strokeDasharray="157.08"
                          strokeDashoffset={157.08 - (157.08 * wekPct) / 100} />
                        <circle cx="50" cy="50" r="25" fill="none" stroke="#93c5fd" strokeWidth="50"
                          strokeDasharray="157.08"
                          strokeDashoffset={157.08 - (157.08 * (wekPct + xePct)) / 100} />
                      </svg>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", fontSize: "10px", color: "#64748b", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                      <span className="tp-tooltip-container" style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1a3a5c" }}></span> 
                        Đăk Wek ({wekPct}%)
                        <div className="tp-tooltip-box">Địa bàn: {dakWek} công dân</div>
                      </span>
                      <span className="tp-tooltip-container" style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }}></span> 
                        Đăk Xế Kơ Ne ({xePct}%)
                        <div className="tp-tooltip-box">Địa bàn: {dakXe} công dân</div>
                      </span>
                      <span className="tp-tooltip-container" style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#93c5fd" }}></span> 
                        Đăk Pxi ({pxiPct}%)
                        <div className="tp-tooltip-box">Địa bàn: {dakPxi} công dân</div>
                      </span>
                    </div>
                  </div>

                  {/* Hộp 3: Chi tiết chỉ số công tác thực tế */}
                  <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "15px", minHeight: "260px" }}>
                    
                    {/* Cột trái: 3 chỉ số thực tế */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: "750", color: "#475569", textTransform: "uppercase", letterSpacing: "0.3px" }}>Tổng số công dân quản lý</div>
                        <div className="tp-tooltip-container" style={{ display: "inline-block", marginTop: "4px" }}>
                          <div style={{ background: "#1a3a5c", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontSize: "14px", fontWeight: "800" }}>{citizens.length} người</div>
                          <div className="tp-tooltip-box">Tổng số hồ sơ trong CSDL</div>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "750", color: "#475569", textTransform: "uppercase", letterSpacing: "0.3px" }}>Nhân sự hoạt động</div>
                        <div className="tp-tooltip-container" style={{ display: "inline-block", marginTop: "4px" }}>
                          <div style={{ background: "#1a3a5c", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontSize: "14px", fontWeight: "800" }}>{subordinates.length + 1} cán bộ</div>
                          <div className="tp-tooltip-box">1 Trưởng phòng & {subordinates.length} nhân viên</div>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <div style={{ fontSize: "10px", fontWeight: "750", color: "#475569", textTransform: "uppercase", letterSpacing: "0.3px" }}>Lịch họp & Giao ban</div>
                        <div className="tp-tooltip-container" style={{ display: "inline-block", marginTop: "4px" }}>
                          <div style={{ background: "#1a3a5c", color: "#ffffff", padding: "4px 10px", borderRadius: "4px", fontSize: "14px", fontWeight: "800" }}>{meetings.length} cuộc họp</div>
                          <div className="tp-tooltip-box">Lịch làm việc đã thiết lập</div>
                        </div>
                      </div>
                    </div>

                    {/* Cột phải: Đồ thị SVG lượn sóng */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                      
                      <div className="tp-tooltip-container tp-hover-wave" style={{ height: "45px" }}>
                        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d="M 0 30 Q 15 10 30 25 T 60 15 T 90 20 T 100 15 L 100 40 L 0 40 Z" fill="rgba(26, 58, 92, 0.15)" stroke="#1a3a5c" strokeWidth="2" />
                        </svg>
                        <div className="tp-tooltip-box">Hiệu suất mạng: Ổn định ở mức 98.4%</div>
                      </div>

                      <div className="tp-tooltip-container tp-hover-wave" style={{ height: "45px" }}>
                        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <path d="M 0 25 Q 20 5 40 20 T 80 15 T 100 22 L 100 40 L 0 40 Z" fill="rgba(26, 58, 92, 0.15)" stroke="#1a3a5c" strokeWidth="2" />
                        </svg>
                        <div className="tp-tooltip-box">Tiến trình xử lý: Đang tăng trưởng nhẹ</div>
                      </div>

                      <div className="tp-tooltip-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "45px" }}>
                        {[20, 35, 15, 30, 45, 25, 40, 30, 20, 35].map((h, i) => (
                          <div key={i} className="tp-hover-bar" style={{ width: "7%", height: `${h}px`, background: "#1a3a5c", borderRadius: "1px" }}></div>
                        ))}
                        <div className="tp-tooltip-box">Thời gian phản hồi: 250ms - 320ms</div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Khối thống kê chi tiết Dịch vụ & Hoạt động Công dân */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "750", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Đường theo dõi quy trình & tương tác công dân thời gian thực</span>
                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "none", fontWeight: "600" }}>Nhấp chọn chuyên mục dưới đây để xem sơ đồ quy trình chi tiết</span>
                  </div>

                  {/* Danh sách 7 mục dịch vụ dưới dạng các Tab/Thẻ bấm chọn */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                    {[
                      { id: "tuyen-truyen", label: "Tuyên truyền bài viết", count: visitorStats.totalArticles || 0, unit: "bài viết", desc: `Kênh video: ${visitorStats.totalVideos || 0} video` },
                      { id: "ai", label: "Trợ lý ảo AI", count: visitorStats.totalAIQueries || 0, unit: "câu hỏi", desc: "Hỏi đáp tự động" },
                      { id: "nghe-dai", label: "Nghe đài phát thanh", count: visitorStats.categoryHits?.nghe_dai || 0, unit: "lượt nghe", desc: "Đọc tin trực tuyến" },
                      { id: "nong-san", label: "Cổng giá nông sản", count: visitorStats.categoryHits?.nong_san || 0, unit: "truy cập", desc: "Cập nhật thị trường" },
                      { id: "tra-cuu", label: "Tra cứu thông tin", count: visitorStats.categoryHits?.tra_cuu || 0, unit: "lượt tra cứu", desc: "BHXH, VNeID..." },
                      { id: "thu-tuc", label: "Thủ tục hành chính", count: visitorStats.categoryHits?.thu_tuc || 0, unit: "lượt nộp", desc: `Đã cấp: ${citizens.filter(c => c.insuranceCard).length} thẻ` },
                      { id: "tro-choi", label: "Trò chơi học tập", count: visitorStats.categoryHits?.tro_choi || 0, unit: "lượt chơi", desc: "Quiz Game pháp luật" }
                    ].map((tab) => {
                      const isActive = selectedDetailTab === tab.id;
                      return (
                        <div
                          key={tab.id}
                          onClick={() => setSelectedDetailTab(tab.id)}
                          style={{
                            background: isActive ? "linear-gradient(135deg, #1a3a5c 0%, #2b5c8f 100%)" : "#f8fafc",
                            border: isActive ? "1px solid #1a3a5c" : "1px solid #e2e8f0",
                            color: isActive ? "#ffffff" : "#1e293b",
                            borderRadius: "6px",
                            padding: "12px 15px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            boxShadow: isActive ? "0 4px 10px rgba(26,58,92,0.15)" : "none"
                          }}
                          className="tp-hover-card-tab"
                        >
                          <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", opacity: isActive ? 0.85 : 0.7 }}>
                            {tab.label}
                          </span>
                          <div style={{ fontSize: "18px", fontWeight: "800", color: isActive ? "#ffffff" : "#1a3a5c" }}>
                            {tab.count} {tab.unit}
                          </div>
                          <div style={{ fontSize: "11px", opacity: isActive ? 0.85 : 0.7, fontWeight: "500" }}>
                            {tab.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sơ đồ quy trình & Đường theo dõi chi tiết */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "20px", marginTop: "5px" }}>
                    
                    <div style={{ fontSize: "12px", color: "#475569", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6" }}></span>
                      Sơ đồ quy trình & Đường theo dõi: {
                        selectedDetailTab === "tuyen-truyen" && "Truyền thông & Tuyên truyền" ||
                        selectedDetailTab === "ai" && "Tương tác trợ lý ảo AI" ||
                        selectedDetailTab === "nghe-dai" && "Phát loa nghe đài phát thanh" ||
                        selectedDetailTab === "nong-san" && "Cổng giá nông sản Đăk Pxi" ||
                        selectedDetailTab === "tra-cuu" && "Cổng tra cứu thông tin (BHXH, VNeID)" ||
                        selectedDetailTab === "thu-tuc" && "Quy trình thủ tục hành chính công" ||
                        selectedDetailTab === "tro-choi" && "Trò chơi học tập & Giải trí Quiz"
                      }
                    </div>

                    {/* Sơ đồ Timeline ngang chuyên nghiệp */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", padding: "10px 0 20px 0", minHeight: "90px" }}>
                      
                      {/* Đường nối ngang phía sau */}
                      <div style={{ position: "absolute", top: "25px", left: "10%", right: "10%", height: "2px", background: "#cbd5e1", zIndex: 1 }} />
                      
                      {/* Các bước quy trình */}
                      {(() => {
                        const stepsMap = {
                          "tuyen-truyen": [
                            { num: "1", title: "Biên tập", desc: "Soạn thảo bài viết & gắn kèm video tuyên truyền" },
                            { num: "2", title: "Phê duyệt", desc: "Trưởng/Phó phòng kiểm duyệt chất lượng nội dung" },
                            { num: "3", title: "Xuất bản", desc: "Đăng tải bài lên hệ thống, hiển thị ở trang chủ" },
                            { num: "4", title: "Đọc & Xem", desc: "Người dân truy cập xem bài viết và video trực tuyến" }
                          ],
                          "ai": [
                            { num: "1", title: "Đặt câu hỏi", desc: "Người dân gửi thắc mắc liên quan tới BHYT, VNeID" },
                            { num: "2", title: "Phân tích NLP", desc: "Trí tuệ nhân tạo phân tích nội dung ngôn ngữ tự nhiên" },
                            { num: "3", title: "Tra cứu CSDL", desc: "Hệ thống trích xuất dữ liệu và ghi vào Conversation" },
                            { num: "4", title: "Trả lời", desc: "Trả về hướng dẫn chi tiết, chính xác tức thời" }
                          ],
                          "nghe-dai": [
                            { num: "1", title: "Nhấp phát (🔊)", desc: "Click biểu tượng loa đọc phát thanh tại bài viết" },
                            { num: "2", title: "Khởi tạo Speech", desc: "SpeechSynthesis kích hoạt luồng giọng đọc vi-VN" },
                            { num: "3", title: "Phát âm thanh", desc: "Phát âm thanh đọc bài viết trực tiếp trên máy công dân" },
                            { num: "4", title: "Ghi nhận", desc: "Gửi log lên database tăng đếm lượt nghe đài phát thanh" }
                          ],
                          "nong-san": [
                            { num: "1", title: "Truy cập cổng", desc: "Bà con nông dân vào mục xem giá nông sản hôm nay" },
                            { num: "2", title: "Đọc dữ liệu", desc: "Hệ thống truy vấn thông tin thị trường thời gian thực" },
                            { num: "3", title: "Bảng giá", desc: "Hiển thị giá Cà phê, Cao su, Tiêu, Sắn tại địa phương" },
                            { num: "4", title: "Định hướng", desc: "Hỗ trợ bà con buôn bán nông sản đúng thời giá" }
                          ],
                          "tra-cuu": [
                            { num: "1", title: "Nhập thông tin", desc: "Công dân nhập CCCD hoặc số điện thoại định danh" },
                            { num: "2", title: "Đối chiếu CSDL", desc: "Hệ thống kiểm tra thông tin công dân khớp đúng" },
                            { num: "3", title: "Đồng bộ", desc: "Trích xuất dữ liệu thẻ BHYT lưu trong cơ sở dữ liệu" },
                            { num: "4", title: "Trả kết quả", desc: "Hiển thị thông tin thẻ BHYT & Hạn dùng lên màn hình" }
                          ],
                          "thu-tuc": [
                            { num: "1", title: "Chọn dịch vụ", desc: "Chọn đăng ký mới hoặc xin cấp lại thẻ BHYT bị mất" },
                            { num: "2", title: "Nộp hồ sơ", desc: "Nhập dữ liệu và gửi yêu cầu hành chính trực tuyến" },
                            { num: "3", title: "Duyệt hồ sơ", desc: "Cán bộ tiếp nhận, thẩm định hồ sơ công dân" },
                            { num: "4", title: "Cấp thẻ", desc: "Phê duyệt kích hoạt thẻ, lưu vào CSDL BHYT xã" }
                          ],
                          "tro-choi": [
                            { num: "1", title: "Vào trò chơi", desc: "Bắt đầu Quiz Game trắc nghiệm luật BHYT & Pháp luật" },
                            { num: "2", title: "Trả lời câu hỏi", desc: "Hệ thống hiển thị câu hỏi đố vui kèm giải thích" },
                            { num: "3", title: "Tính điểm", desc: "Chấm điểm và hướng dẫn chi tiết đáp án đúng" },
                            { num: "4", title: "Hoàn thành", desc: "Công dân ghi nhớ kiến thức phòng dịch & pháp luật" }
                          ]
                        };

                        const steps = stepsMap[selectedDetailTab] || stepsMap["tuyen-truyen"];

                        return steps.map((s, idx) => (
                          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "22%", zIndex: 2, textAlign: "center" }}>
                            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#1a3a5c", color: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "15px", fontWeight: "800", border: "4px solid #f8fafc", boxShadow: "0 2px 5px rgba(0,0,0,0.15)" }}>
                              {s.num}
                            </div>
                            <div style={{ fontSize: "12px", fontWeight: "750", color: "#1a3a5c", marginTop: "8px" }}>{s.title}</div>
                            <div style={{ fontSize: "10.5px", color: "#64748b", marginTop: "3px", lineHeight: "1.3", padding: "0 10px" }}>{s.desc}</div>
                          </div>
                        ));
                      })()}

                    </div>

                    {/* Dữ liệu và Trạng thái chi tiết tương ứng với tab được chọn */}
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Chỉ số thời gian thực từ Database</div>
                        {selectedDetailTab === "tuyen-truyen" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Xuất bản: <strong>{visitorStats.totalArticles || 0} bài tuyên truyền</strong> | Video: <strong>{visitorStats.totalVideos || 0} clip</strong>
                          </div>
                        )}
                        {selectedDetailTab === "ai" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Tổng số yêu cầu trợ lý xử lý: <strong>{visitorStats.totalAIQueries || 0} hội thoại</strong>
                          </div>
                        )}
                        {selectedDetailTab === "nghe-dai" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Tổng lượt nghe đọc tự động: <strong>{visitorStats.categoryHits?.nghe_dai || 0} lượt nghe</strong>
                          </div>
                        )}
                        {selectedDetailTab === "nong-san" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Tổng số lượt xem bảng giá: <strong>{visitorStats.categoryHits?.nong_san || 0} lượt cập nhật</strong>
                          </div>
                        )}
                        {selectedDetailTab === "tra-cuu" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Lượt tra cứu BHYT/VNeID thành công: <strong>{visitorStats.categoryHits?.tra_cuu || 0} lượt</strong>
                          </div>
                        )}
                        {selectedDetailTab === "thu-tuc" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Hồ sơ đã nộp: <strong>{visitorStats.categoryHits?.thu_tuc || 0} lượt</strong> | Đã cấp BHYT: <strong>{citizens.filter(c => c.insuranceCard).length} thẻ</strong>
                          </div>
                        )}
                        {selectedDetailTab === "tro-choi" && (
                          <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: "600" }}>
                            Tổng lượt tham gia Quiz Game: <strong>{visitorStats.categoryHits?.tro_choi || 0} lượt chơi</strong>
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>Trạng thái vận hành kênh</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
                          Hệ thống hoạt động bình thường (🟢 Tự động)
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })()}

          {activeTab === "ai-assistant" && (
            <div className="tp-card" style={{ height: "650px", padding: "0px", overflow: "hidden", border: "1px solid #cbd5e1", borderRadius: "12px" }}>
              <ChatWindow />
            </div>
          )}

          {/* ──────────────────────────────────
              TRƯỞNG PHÒNG TAB CONTENTS
              ────────────────────────────────── */}
          {(role === "truongphong" || role === "admin") && (
            <>
              {activeTab === "staff" && (
                <div className="tp-grid">
                  <div className="tp-card tp-form-card">
                    <h3>{editingStaff ? "Chỉnh sửa tài khoản" : "Cấp tài khoản mới"}</h3>
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
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px", background: editingStaff ? "#f1f5f9" : "#fff", paddingRight: "12px", height: "40px" }}>
                          <input
                            type="text"
                            placeholder="Ví dụ: Acv"
                            value={usernamePrefix}
                            onChange={(e) => setUsernamePrefix(e.target.value.trim().toLowerCase())}
                            required
                            disabled={!!editingStaff}
                            style={{ flex: 1, border: "none", outline: "none", boxShadow: "none", background: "transparent", padding: "0 12px", height: "100%", fontSize: "14px", fontFamily: "inherit" }}
                          />
                          <span style={{ color: "#475569", fontWeight: "700", fontSize: "14px", userSelect: "none" }}>.vhxh</span>
                        </div>
                      </div>

                      <div className="tp-form-group">
                        <label>{editingStaff ? "Mật khẩu đăng nhập mới (Để trống nếu giữ nguyên)" : "Mật khẩu đăng nhập"}</label>
                        <input
                          type="password"
                          placeholder={editingStaff ? "Nhập mật khẩu mới" : "Nhập mật khẩu mặc định"}
                          value={staffForm.password}
                          onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                          required={!editingStaff}
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

                      <div className="tp-btn-group" style={{ display: "flex", gap: "8px" }}>
                        <button type="submit" className="tp-btn-submit" disabled={loading}>
                          {editingStaff ? "Lưu thay đổi" : "Cấp tài khoản mới"}
                        </button>
                        {editingStaff && (
                          <button
                            type="button"
                            className="tp-btn-cancel"
                            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: "700" }}
                            onClick={() => {
                              setEditingStaff(null);
                              setUsernamePrefix("");
                              setStaffForm({ fullName: "", username: "", password: "Vhxh@2026", role: "canbo" });
                            }}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
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
                              <tr key={s._id} style={{ opacity: s.status === "suspended" ? 0.6 : 1 }}>
                                <td>
                                  <strong>{s.fullName}</strong>
                                  {s.status === "suspended" && (
                                    <span style={{ fontSize: "11px", color: "#ef4444", marginLeft: "8px", fontWeight: "bold", background: "#fee2e2", padding: "2px 6px", borderRadius: "4px" }}>
                                      [Đã tạm dừng]
                                    </span>
                                  )}
                                </td>
                                <td><code>{s.username}</code></td>
                                <td>
                                  <span className={`tp-role-badge ${s.role}`}>
                                    {s.role === "phophong" ? "Phó phòng" : "Cán bộ"}
                                  </span>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                    <button
                                      className="tp-edit-btn-small"
                                      style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}
                                      onClick={() => handleEditClick(s)}
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      className="tp-edit-btn-small"
                                      style={{
                                        background: s.status === "suspended" ? "#d1fae5" : "#fee2e2",
                                        color: s.status === "suspended" ? "#065f46" : "#991b1b",
                                        border: s.status === "suspended" ? "1px solid #a7f3d0" : "1px solid #fecaca",
                                        fontWeight: "750"
                                      }}
                                      onClick={() => handleToggleStaffStatus(s)}
                                    >
                                      {s.status === "suspended" ? "Mở" : "Dừng"}
                                    </button>
                                    <button
                                      className="tp-delete-btn"
                                      onClick={() => handleDeleteStaff(s._id, s.fullName)}
                                    >
                                      Xóa
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

          {activeTab === "schedule" && (
            <div className="tp-schedule-container" style={{ animation: "fadeIn 0.25s ease-out" }}>
              {/* Real-time Clock display */}
              <div className="tp-realtime-clock-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: "800" }}>Hệ thống Lịch họp cơ quan</span>
                  <h2 style={{ margin: "4px 0 0 0", color: "#1e3a8a", border: "none", padding: 0, textTransform: "none", fontSize: "20px", fontWeight: "850" }}>Điều phối họp Trưởng phòng & Cán bộ</h2>
                </div>
                <div style={{ textAlign: "right", background: "#f8fafc", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", display: "block" }}>Thời gian hiện tại</span>
                  <strong style={{ fontSize: "14px", color: "#0f172a", fontFamily: "monospace", display: "block", marginTop: "2px" }}>
                    🕒 {formatDateTime(currentTime)}
                  </strong>
                </div>
              </div>

              {role === "truongphong" || role === "admin" ? (
                <div className="tp-grid">
                  {/* Left Form: Create/Edit Meeting */}
                  <div className="tp-card tp-form-card">
                    <h3>{editingMeeting ? "✏️ Sửa cuộc họp cơ quan" : "📅 Tạo cuộc họp cơ quan"}</h3>
                    <form onSubmit={handleMeetingSubmit}>
                      <div className="tp-form-group">
                        <label>Tiêu đề cuộc họp</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Họp triển khai tuyên truyền thẻ BHYT"
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
                          <label>Thành phần tham gia</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Toàn bộ cán bộ, Tổ BHYT..."
                            value={meetingForm.thon}
                            onChange={(e) => setMeetingForm({ ...meetingForm, thon: e.target.value })}
                            required
                          />
                        </div>
                        <div className="tp-form-group">
                          <label>Phòng họp / Địa điểm</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Phòng họp số 1 - UBND xã"
                            value={meetingForm.location}
                            onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="tp-form-group">
                        <label>Loại cuộc họp</label>
                        <select
                          value={meetingForm.type}
                          onChange={(e) => setMeetingForm({ ...meetingForm, type: e.target.value })}
                        >
                          <option value="giao-ban">👥 Họp giao ban định kỳ</option>
                          <option value="hop-khan">🚨 Họp khẩn cấp</option>
                          <option value="chuyen-de">📑 Họp chuyên đề chuyên môn</option>
                          <option value="tap-huan">📚 Tập huấn & Hướng dẫn nghiệp vụ</option>
                          <option value="khac">📌 Cuộc họp khác</option>
                        </select>
                      </div>

                      <div className="tp-form-group">
                        <label>Nội dung ghi chú / Hướng dẫn chuẩn bị</label>
                        <textarea
                          rows="3"
                          placeholder="Nội dung tóm tắt hoặc chuẩn bị tài liệu..."
                          value={meetingForm.note}
                          onChange={(e) => setMeetingForm({ ...meetingForm, note: e.target.value })}
                        />
                      </div>

                      <div className="tp-btn-group" style={{ gap: "10px" }}>
                        <button type="submit" className="tp-btn-submit" disabled={loading} style={{ flex: 1 }}>
                          💾 Lưu lịch họp
                        </button>
                        {editingMeeting && (
                          <button
                            type="button"
                            className="tp-btn-cancel"
                            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                            onClick={() => {
                              setEditingMeeting(null);
                              setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "giao-ban", note: "" });
                            }}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right: List of meetings with countdown */}
                  <div className="tp-card tp-list-card">
                    <h3>📋 Danh sách cuộc họp cơ quan ({meetings.length})</h3>
                    <div className="tp-meetings-list">
                      {meetings.length === 0 ? (
                        <div className="text-center" style={{ padding: "30px", color: "#64748b" }}>Chưa có cuộc họp nào được lên lịch.</div>
                      ) : (
                        meetings.map((m) => {
                          const timerInfo = getMeetingCountdown(m.date, m.time);
                          return (
                            <div key={m._id} className="tp-meeting-card">
                              <div className={`tp-meeting-indicator ${m.type}`}></div>
                              
                              <div className="tp-meeting-card-left">
                                <div className="tp-meeting-card-info">
                                  <div className="tp-meeting-card-title">{m.title}</div>
                                  <div className="tp-meeting-card-meta">
                                    <span className="tp-meta-item">📁 {getMeetingBadgeLabel(m.type)}</span>
                                    <span className="tp-meta-divider">•</span>
                                    <span className="tp-meta-item">👥 {m.thon}</span>
                                    <span className="tp-meta-divider">•</span>
                                    <span className="tp-meta-item">📍 {m.location}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="tp-meeting-card-right">
                                <div className="tp-meeting-card-time">
                                  <div className="tp-time-val">{m.time}</div>
                                  <div className="tp-date-val">{m.date ? m.date.split("-").reverse().join("/") : ""}</div>
                                </div>
                                <div className="tp-meeting-card-countdown">
                                  <span className={`tp-countdown-pill ${timerInfo.status}`}>
                                    {timerInfo.label}
                                  </span>
                                </div>
                                <div className="tp-meeting-card-actions">
                                  <button
                                    className="tp-btn-card tp-btn-join"
                                    onClick={() => navigate(`/cuoc-hop-truc-tuyen/${m._id}`)}
                                  >
                                    🎥 Vào phòng
                                  </button>
                                  <button
                                    className="tp-btn-card tp-btn-edit"
                                    onClick={() => {
                                      setEditingMeeting(m);
                                      setMeetingForm({
                                        title: m.title,
                                        date: m.date,
                                        time: m.time,
                                        location: m.location,
                                        thon: m.thon,
                                        type: m.type,
                                        note: m.note || "",
                                      });
                                    }}
                                    title="Sửa cuộc họp"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="tp-btn-card tp-btn-delete"
                                    onClick={() => handleDeleteMeeting(m._id)}
                                    title="Xóa cuộc họp"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Officer view: Full width list, no create/edit/delete form */
                <div className="tp-card tp-list-card" style={{ width: "100%" }}>
                  <h3>📋 Danh sách cuộc họp cơ quan của bạn ({meetings.length})</h3>
                  <div className="tp-meetings-list">
                    {meetings.length === 0 ? (
                      <div className="text-center" style={{ padding: "30px", color: "#64748b" }}>Chưa có cuộc họp nào được lên lịch.</div>
                    ) : (
                      meetings.map((m) => {
                        const timerInfo = getMeetingCountdown(m.date, m.time);
                        return (
                          <div key={m._id} className="tp-meeting-card">
                            <div className={`tp-meeting-indicator ${m.type}`}></div>
                            
                            <div className="tp-meeting-card-left">
                              <div className="tp-meeting-card-info">
                                <div className="tp-meeting-card-title">{m.title}</div>
                                <div className="tp-meeting-card-meta">
                                  <span className="tp-meta-item">📁 {getMeetingBadgeLabel(m.type)}</span>
                                  <span className="tp-meta-divider">•</span>
                                  <span className="tp-meta-item">👥 {m.thon}</span>
                                  <span className="tp-meta-divider">•</span>
                                  <span className="tp-meta-item">📍 {m.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="tp-meeting-card-right">
                              <div className="tp-meeting-card-time" style={{ marginRight: "10px" }}>
                                <div className="tp-time-val">{m.time}</div>
                                <div className="tp-date-val">{m.date ? m.date.split("-").reverse().join("/") : ""}</div>
                              </div>
                              <div className="tp-meeting-card-countdown" style={{ marginRight: "10px" }}>
                                <span className={`tp-countdown-pill ${timerInfo.status}`}>
                                  {timerInfo.label}
                                </span>
                              </div>
                              <div style={{ flex: 1, minWidth: "120px", fontSize: "12.5px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                📝 {m.note || <em style={{ color: "#94a3b8" }}>Không có ghi chú</em>}
                              </div>
                              <div className="tp-meeting-card-actions">
                                <button
                                  className="tp-btn-card tp-btn-join"
                                  onClick={() => navigate(`/cuoc-hop-truc-tuyen/${m._id}`)}
                                >
                                  🎥 Vào phòng
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
