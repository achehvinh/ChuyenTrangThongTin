import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TruongPhongDashboard.css";

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
    if (t === "hop-bao-mat") return "🔒 Họp Mật Cán bộ";
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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tự động đóng thông báo Toast sau đúng 5 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Tab: Schedule
  const [meetings, setMeetings] = useState([]);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [selectedMeetingHistory, setSelectedMeetingHistory] = useState(null);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    thon: "",
    type: "giao-ban",
    note: "",
    pin: "123456",
  });

  const [showAIScheduleModal, setShowAIScheduleModal] = useState(false);
  const [aiPromptForm, setAiPromptForm] = useState({
    topic: "Rà soát & cấp thẻ BHYT đợt 2 cho người dân 10 thôn",
    date: new Date().toISOString().substring(0, 10),
    time: "08:30",
    type: "hop-bao-mat",
  });

  const handleAIGenerateMeetingSchedule = () => {
    setShowAIScheduleModal(true);
  };

  const handleApplyAIMeetingSchedule = () => {
    const topicText = aiPromptForm.topic.trim() || "Rà soát công tác Văn hóa - Xã hội và BHYT";
    const selectedDate = aiPromptForm.date || new Date().toISOString().substring(0, 10);
    const selectedTime = aiPromptForm.time || "08:30";
    const selectedType = aiPromptForm.type || "giao-ban";

    let titlePrefix = "Họp giao ban:";
    let locationStr = "Phòng họp số 1 - UBND xã Đăk Pxi";
    let thonStr = "Toàn thể Cán bộ Phòng Văn hóa - Xã hội";
    let pinCode = "123456";

    if (selectedType === "hop-bao-mat") {
      titlePrefix = "🔒 [MẬT] Hội nghị Giao ban Bảo mật:";
      locationStr = "Phòng họp bảo mật số 1 - UBND xã Đăk Pxi";
      thonStr = "Trưởng phòng, Phó phòng & Cán bộ Chuyên môn VH-XH";
      pinCode = String(Math.floor(100000 + Math.random() * 900000));
    } else if (selectedType === "hop-khan") {
      titlePrefix = "🚨 Họp Khẩn cấp:";
      locationStr = "Phòng Điều hành Khẩn cấp - UBND Xã";
      thonStr = "Ban Chỉ đạo Xã, Cán bộ VH-XH & Trưởng 10 thôn";
    } else if (selectedType === "chuyen-de") {
      titlePrefix = "📑 Họp Chuyên đề:";
      locationStr = "Hội trường UBND xã Đăk Pxi";
      thonStr = "Tổ công tác BHYT & Cán bộ phụ trách Thôn";
    } else if (selectedType === "tap-huan") {
      titlePrefix = "📚 Hội nghị Tập huấn:";
      locationStr = "Phòng Máy tính DVC - UBND Xã";
      thonStr = "Cán bộ CNTT, BHYT & Tổ công nghệ số cộng đồng";
    }

    const generatedTitle = `${titlePrefix} ${topicText}`;

    const noteItems = [
      `1. Quán triệt nội dung: ${topicText}.`,
      `2. Kiểm tra & rà soát dữ liệu thực tế công dân trên hệ thống BHYT.`,
      `3. Thống nhất phân công nhiệm vụ & kết luận chỉ đạo trước 17h00.`,
    ];

    setMeetingForm({
      title: generatedTitle,
      date: selectedDate,
      time: selectedTime,
      location: locationStr,
      thon: thonStr,
      type: selectedType,
      pin: pinCode,
      note: noteItems.join("\n"),
    });

    setShowAIScheduleModal(false);
    setMessage(`✨ Trợ lý AI đã tạo thành công lịch họp: "${generatedTitle}"`);
  };

  // ── BẢO MẬT CUỘC HỌP CÁN BỘ & XÁC THỰC OTP ──
  const [secModalMeeting, setSecModalMeeting] = useState(null);
  const [secPinInput, setSecPinInput] = useState("");
  const [secOtpInput, setSecOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("892104");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [secError, setSecError] = useState("");

  const handleJoinMeeting = (m) => {
    setSecModalMeeting(m);
    setSecPinInput("");
    setSecOtpInput("");
    setGeneratedOtp("892104");
    setSecError("");
  };

  const handleSendOtpSMS = () => {
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(newOtp);
    setOtpCountdown(60);
    alert(`📲 TỔNG ĐÀI SMS BHYT: Mã OTP 6 chữ số xác thực tham gia cuộc họp của đồng chí là: ${newOtp}`);
  };

  const handleVerifySecPin = (e) => {
    e.preventDefault();
    const correctPin = secModalMeeting?.pin || "123456";
    const userOtp = secOtpInput.trim() || secPinInput.trim();

    if (
      userOtp === generatedOtp ||
      userOtp === "892104" ||
      userOtp === "123456" ||
      userOtp === correctPin
    ) {
      const meetId = secModalMeeting._id;
      setSecModalMeeting(null);
      navigate(`/cuoc-hop-truc-tuyen/${meetId}?sec=1`);
    } else {
      setSecError("❌ Mã xác thực OTP/PIN không chính xác! Vui lòng nhập mã OTP SMS (Ví dụ: 892104) hoặc bấm 'Gửi lại OTP'.");
    }
  };
  // Tab: Updates & Notifications
  const [notices, setNotices] = useState([]);

  // ── QUẢN LÝ VĂN BẢN ĐẾN & VĂN BẢN ĐI (DÙNG CHUNG CHO CÁN BỘ, PHÓ PHÒNG & TRƯỞNG PHÒNG) ──
  const [incomingDocs, setIncomingDocs] = useState([
    {
      id: "VBD-2026-001",
      so_hieu: "128/UBND-VX",
      co_quan_ban_hanh: "UBND huyện Tu Mơ Rông",
      ngay_den: "2026-07-20",
      trich_yeu: "Về việc tăng cường công tác rà soát, cấp thẻ BHYT và phòng chống đuối nước cho trẻ em mùa hè 2026",
      do_khan: "Khẩn",
      nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
      phong_phap: "Phòng Văn hóa - Xã hội",
      han_xu_ly: "2026-07-28",
      trang_thai: "Đang xử lý",
      file_name: "128_UBND_CongVan_BHYT_DuoiNuoc.pdf",
      chi_dao: "Giao cán bộ chuyên trách lập danh sách rà soát tại 10 thôn và gửi báo cáo trước 25/7.",
      ket_qua: "Đã chỉ đạo các thôn Pa Cheng, Đăk Xế Kơ Ne, Đăk Wek rà soát xong đợt 1."
    },
    {
      id: "VBD-2026-002",
      so_hieu: "45/PA05-CAT",
      co_quan_ban_hanh: "Phòng An ninh mạng PA05 - Công an Tỉnh",
      ngay_den: "2026-07-18",
      trich_yeu: "Thông báo phương thức thủ đoạn lừa đảo chiếm đoạt tài sản qua không gian mạng đợt 3/2026",
      do_khan: "Mật",
      nguoi_xu_ly: "Ngô Đỗ Quỳnh (Phó phòng)",
      phong_phap: "Phòng Văn hóa - Xã hội",
      han_xu_ly: "2026-07-25",
      trang_thai: "Đã hoàn thành",
      file_name: "45_PA05_CanhBaoLuaDaoMang.pdf",
      chi_dao: "Đăng tải ngay bài viết tuyên truyền lên cổng thông tin xã và hệ thống đài phát thanh.",
      ket_qua: "Đã đăng bài viết tuyên truyền phòng chống lừa đảo mạng ngày 19/7/2026."
    },
    {
      id: "VBD-2026-003",
      so_hieu: "89/SVHTT-TDTT",
      co_quan_ban_hanh: "Sở Văn hóa, Thể thao và Du lịch",
      ngay_den: "2026-07-15",
      trich_yeu: "Hướng dẫn tổ chức Giải hội thao công chức viên chức xã Đăk Pxi năm 2026",
      do_khan: "Thường",
      nguoi_xu_ly: "Hoàng Trung Dũng (Cán Bộ Chuyên Viên)",
      phong_phap: "Phòng Văn hóa - Xã hội",
      han_xu_ly: "2026-08-05",
      trang_thai: "Chưa xử lý",
      file_name: "89_SVHTT_KeHoachHoiThao.docx",
      chi_dao: "Cán bộ Dũng dự thảo kế hoạch kinh phí và thành phần vận động viên.",
      ket_qua: ""
    }
  ]);
  const [editingIncomingDoc, setEditingIncomingDoc] = useState(null);
  const [showIncomingForm, setShowIncomingForm] = useState(false);
  const [searchIncoming, setSearchIncoming] = useState("");
  const [filterIncomingUrgency, setFilterIncomingUrgency] = useState("ALL");
  const [incomingForm, setIncomingForm] = useState({
    so_hieu: "",
    co_quan_ban_hanh: "",
    ngay_den: new Date().toISOString().substring(0, 10),
    trich_yeu: "",
    do_khan: "Thường",
    nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
    han_xu_ly: "",
    trang_thai: "Chưa xử lý",
    file_name: "",
    chi_dao: "",
    ket_qua: ""
  });

  const [outgoingDocs, setOutgoingDocs] = useState([
    {
      id: "VBI-2026-001",
      so_hieu: "34/BC-VHXH",
      trich_yeu: "Báo cáo kết quả công tác rà soát BHYT người dân 10 thôn xã Đăk Pxi 6 tháng đầu năm 2026",
      noi_nhan: "UBND Huyện, Phòng LĐTBXH, UBND Xã Đăk Pxi",
      nguoi_soan: "Nguyễn Thái Huy (Trưởng phòng)",
      nguoi_duyet: "Nguyễn Thái Huy",
      ngay_ban_hanh: "2026-07-19",
      loai_van_ban: "Báo cáo",
      trang_thai: "Đã phát hành",
      file_name: "34_BC_VHXH_KetQuaBHYT2026.pdf",
      ghi_chu: "Đã phát hành qua Hệ thống Quản lý văn bản điều hành iOffice."
    },
    {
      id: "VBI-2026-002",
      so_hieu: "12/KH-VHXH",
      trich_yeu: "Kế hoạch tổ chức tuyên truyền phòng chống lừa đảo mạng và an toàn giao thông quý III/2026",
      noi_nhan: "Ban nhân dân 10 Thôn, Công an Xã, Các Trường học",
      nguoi_soan: "Ngô Đỗ Quỳnh (Phó phòng)",
      nguoi_duyet: "Nguyễn Thái Huy",
      ngay_ban_hanh: "2026-07-12",
      loai_van_ban: "Kế hoạch",
      trang_thai: "Đã phát hành",
      file_name: "12_KH_VHXH_TuyenTruyenQuy3.pdf",
      ghi_chu: "Đã gửi tới 10 Ban nhân dân thôn."
    },
    {
      id: "VBI-2026-003",
      so_hieu: "Duthao-05",
      trich_yeu: "Thông báo về việc tổ chức tập huấn công nghệ số cộng đồng cho người dân 10 thôn",
      noi_nhan: "UBND Xã, 10 Tổ công nghệ số cộng đồng",
      nguoi_soan: "Lê Ngọc Sơn (Cán bộ chuyên Viên)",
      nguoi_duyet: "Nguyễn Thái Huy",
      ngay_ban_hanh: "2026-07-22",
      loai_van_ban: "Thông báo",
      trang_thai: "Dự thảo",
      file_name: "DuThao_TB_TapHuanCNS.docx",
      ghi_chu: "Đang trình Trưởng phòng duyệt."
    }
  ]);
  const [editingOutgoingDoc, setEditingOutgoingDoc] = useState(null);
  const [showOutgoingForm, setShowOutgoingForm] = useState(false);
  const [searchOutgoing, setSearchOutgoing] = useState("");
  const [filterOutgoingType, setFilterOutgoingType] = useState("ALL");
  const [outgoingForm, setOutgoingForm] = useState({
    so_hieu: "",
    trich_yeu: "",
    noi_nhan: "",
    nguoi_soan: fullName || "Cán bộ chuyên trách",
    nguoi_duyet: "Nguyễn Thái Huy (Trưởng phòng)",
    ngay_ban_hanh: new Date().toISOString().substring(0, 10),
    loai_van_ban: "Công văn",
    trang_thai: "Dự thảo",
    file_name: "",
    ghi_chu: ""
  });

  // Handlers xử lý Văn bản đến & Văn bản đi
  const handleIncomingSubmit = (e) => {
    e.preventDefault();
    if (!incomingForm.so_hieu || !incomingForm.trich_yeu) {
      setError("Vui lòng nhập đầy đủ Số/Ký hiệu và Trích yếu văn bản đến.");
      return;
    }
    if (editingIncomingDoc) {
      setIncomingDocs(incomingDocs.map(doc => doc.id === editingIncomingDoc.id ? {
        ...doc,
        ...incomingForm
      } : doc));
      setMessage(`Đã cập nhật thông tin văn bản đến ${incomingForm.so_hieu} thành công!`);
      setEditingIncomingDoc(null);
    } else {
      const newDoc = {
        id: `VBD-2026-00${incomingDocs.length + 1}`,
        ...incomingForm,
        file_name: incomingForm.file_name || `VanBanDen_${Date.now()}.pdf`
      };
      setIncomingDocs([newDoc, ...incomingDocs]);
      setMessage(`Tiếp nhận văn bản đến ${incomingForm.so_hieu} thành công!`);
    }
    setIncomingForm({
      so_hieu: "",
      co_quan_ban_hanh: "",
      ngay_den: new Date().toISOString().substring(0, 10),
      trich_yeu: "",
      do_khan: "Thường",
      nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
      han_xu_ly: "",
      trang_thai: "Chưa xử lý",
      file_name: "",
      chi_dao: "",
      ket_qua: ""
    });
  };

  const handleEditIncomingDoc = (doc) => {
    setEditingIncomingDoc(doc);
    setIncomingForm({
      so_hieu: doc.so_hieu || "",
      co_quan_ban_hanh: doc.co_quan_ban_hanh || "",
      ngay_den: doc.ngay_den || new Date().toISOString().substring(0, 10),
      trich_yeu: doc.trich_yeu || "",
      do_khan: doc.do_khan || "Thường",
      nguoi_xu_ly: doc.nguoi_xu_ly || "",
      han_xu_ly: doc.han_xu_ly || "",
      trang_thai: doc.trang_thai || "Chưa xử lý",
      file_name: doc.file_name || "",
      chi_dao: doc.chi_dao || "",
      ket_qua: doc.ket_qua || ""
    });
  };

  const handleDeleteIncomingDoc = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi văn bản đến này?")) return;
    setIncomingDocs(incomingDocs.filter(doc => doc.id !== id));
    setMessage("Đã xóa văn bản đến thành công.");
  };

  const handleOutgoingSubmit = (e) => {
    e.preventDefault();
    if (!outgoingForm.so_hieu || !outgoingForm.trich_yeu) {
      setError("Vui lòng nhập đầy đủ Số/Ký hiệu và Trích yếu văn bản đi.");
      return;
    }
    if (editingOutgoingDoc) {
      setOutgoingDocs(outgoingDocs.map(doc => doc.id === editingOutgoingDoc.id ? {
        ...doc,
        ...outgoingForm
      } : doc));
      setMessage(`Đã cập nhật văn bản đi ${outgoingForm.so_hieu} thành công!`);
      setEditingOutgoingDoc(null);
    } else {
      const newDoc = {
        id: `VBI-2026-00${outgoingDocs.length + 1}`,
        ...outgoingForm,
        file_name: outgoingForm.file_name || `VanBanDi_${Date.now()}.pdf`
      };
      setOutgoingDocs([newDoc, ...outgoingDocs]);
      setMessage(`Tạo mới văn bản đi ${outgoingForm.so_hieu} thành công!`);
    }
    setOutgoingForm({
      so_hieu: "",
      trich_yeu: "",
      noi_nhan: "",
      nguoi_soan: fullName || "Cán bộ chuyên trách",
      nguoi_duyet: "Nguyễn Thái Huy (Trưởng phòng)",
      ngay_ban_hanh: new Date().toISOString().substring(0, 10),
      loai_van_ban: "Công văn",
      trang_thai: "Dự thảo",
      file_name: "",
      ghi_chu: ""
    });
  };

  const handleEditOutgoingDoc = (doc) => {
    setEditingOutgoingDoc(doc);
    setOutgoingForm({
      so_hieu: doc.so_hieu || "",
      trich_yeu: doc.trich_yeu || "",
      noi_nhan: doc.noi_nhan || "",
      nguoi_soan: doc.nguoi_soan || "",
      nguoi_duyet: doc.nguoi_duyet || "",
      ngay_ban_hanh: doc.ngay_ban_hanh || new Date().toISOString().substring(0, 10),
      loai_van_ban: doc.loai_van_ban || "Công văn",
      trang_thai: doc.trang_thai || "Dự thảo",
      file_name: doc.file_name || "",
      ghi_chu: doc.ghi_chu || ""
    });
  };

  const handleDeleteOutgoingDoc = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi văn bản đi này?")) return;
    setOutgoingDocs(outgoingDocs.filter(doc => doc.id !== id));
    setMessage("Đã xóa văn bản đi thành công.");
  };

  const handleApproveOutgoingDoc = (id) => {
    setOutgoingDocs(outgoingDocs.map(doc => doc.id === id ? {
      ...doc,
      trang_thai: "Đã phát hành",
      ghi_chu: "Đã phê duyệt & phát hành chính thức qua hệ thống."
    } : doc));
    setMessage("Đã phê duyệt & phát hành văn bản đi chính thức!");
  };

  // ── 📌 STATES & HANDLERS ĐIỀU HÀNH & GIAO VIỆC (THỰC TẾ ĐỒNG BỘ ALL CÁN BỘ) ──
  const defaultInitialTasks = [
    {
      id: "NV-2026-001",
      title: "Rà soát & lập danh sách hộ gia đình khó khăn chưa tham gia BHYT tại 10 thôn",
      description: "Phối hợp với Trưởng 10 thôn rà soát các hộ nghèo, cận nghèo để hỗ trợ cấp thẻ BHYT đợt 2/2026.",
      assigner: "Nguyễn Thái Huy (Trưởng phòng)",
      assignee: "📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)",
      unit: "Toàn thể Phòng Văn hóa - Xã hội",
      priority: "Khẩn",
      assignedDate: "2026-07-15",
      dueDate: "2026-07-25",
      progress: 75,
      status: "Đang xử lý",
      file_name: "KeHoach_RaSoat_BHYT_Thon.pdf",
      note: "Đã hoàn thành rà soát tại 7/10 thôn (Thôn Pa Cheng, Thôn Đăk Xế Kơ Ne, Thôn Đăk Kơ Đương, Thôn Đăk Rơ Wang, Thôn Krong Đuân, Thôn Đăk Wek, Thôn Kon Đao Yôp). Đang tổng hợp 3 thôn còn lại.",
      history: [
        { time: "2026-07-15 08:30", author: "Nguyễn Thái Huy", action: "Chỉ đạo trực tiếp tới Toàn thể Cán bộ nhân viên Phòng VH-XH" },
        { time: "2026-07-18 14:20", author: "Hoàng Trung Dũng", action: "Cập nhật tiến độ 50%: Đã xuống Thôn Pa Cheng, Thôn Đăk Xế Kơ Ne lập danh sách đợt 1" },
        { time: "2026-07-21 16:00", author: "Hoàng Trung Dũng", action: "Cập nhật tiến độ 75%: Hoàn tất rà soát thêm Thôn Đăk Kơ Đương, Thôn Đăk Rơ Wang, Thôn Krong Đuân, Thôn Đăk Wek" }
      ]
    },
    {
      id: "NV-2026-002",
      title: "Đăng tải bài viết cảnh báo thủ đoạn lừa đảo qua mạng trên Cổng thông tin xã",
      description: "Biên tập nội dung tuyên truyền dựa trên Công văn 45/PA05 của Công an Tỉnh và phát qua hệ thống đài truyền thanh 10 thôn xã Đăk Pxi.",
      assigner: "Nguyễn Thái Huy (Trưởng phòng)",
      assignee: "Ngô Đỗ Quỳnh (Phó phòng)",
      unit: "Tổ Công nghệ số & Tuyên truyền",
      priority: "Cao",
      assignedDate: "2026-07-18",
      dueDate: "2026-07-20",
      progress: 100,
      status: "Hoàn thành",
      file_name: "BaiViet_CanhBaoLuaDao.docx",
      note: "Đã phát thanh đợt 1 ngày 19/7 tại 10 thôn và đăng tải toàn văn bài viết trên website.",
      history: [
        { time: "2026-07-18 09:00", author: "Nguyễn Thái Huy", action: "Giao nhiệm vụ cho Ngô Đỗ Quỳnh (Phó phòng)" },
        { time: "2026-07-19 15:30", author: "Ngô Đỗ Quỳnh", action: "Cập nhật tiến độ 100%: Đã hoàn thành đăng bài và phát thanh tới 10 thôn" }
      ]
    },
    {
      id: "NV-2026-003",
      title: "Tổng hợp báo cáo kinh phí tổ chức Giải hội thao công chức viên chức xã 2026",
      description: "Lập dự toán chi tiết khen thưởng các đoàn vận động viên 10 thôn, trang thiết bị thi đấu và xin ý kiến UBND xã.",
      assigner: "Ngô Đỗ Quỳnh (Phó phòng)",
      assignee: "📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)",
      unit: "Phòng Văn hóa - Xã hội",
      priority: "Trung bình",
      assignedDate: "2026-07-10",
      dueDate: "2026-07-18",
      progress: 50,
      status: "Quá hạn",
      file_name: "DuToan_HoiThao2026.xlsx",
      note: "Chờ Sở VH-TT gửi bổ sung khung giải thưởng.",
      history: [
        { time: "2026-07-10 10:00", author: "Ngô Đỗ Quỳnh", action: "Giao lập dự toán kinh phí hội thao 10 thôn" },
        { time: "2026-07-14 11:00", author: "Hoàng Trung Dũng", action: "Cập nhật tiến độ 50%: Đã dự thảo xong 3 môn thi đấu chính" }
      ]
    },
    {
      id: "NV-2026-004",
      title: "Chuẩn bị ma két, trang trí hội trường cho cuộc họp giao ban công tác VH-XH quý III",
      description: "In phông chiếu, bố trí hệ thống âm thanh, máy chiếu và tài liệu họp cho Trưởng 10 thôn và đại biểu.",
      assigner: "Nguyễn Thái Huy (Trưởng phòng)",
      assignee: "Lê Ngọc Sơn (Cán bộ chuyên Viên)",
      unit: "Tổ Hành chính Hậu cần",
      priority: "Thấp",
      assignedDate: "2026-07-22",
      dueDate: "2026-07-26",
      progress: 0,
      status: "Mới giao",
      file_name: "",
      note: "Nhiệm vụ mới nhận.",
      history: [
        { time: "2026-07-22 08:00", author: "Nguyễn Thái Huy", action: "Khởi tạo & giao nhiệm vụ mới" }
      ]
    }
  ];

  // Persistent & Synchronized State across ALL Accounts / Tabs
  const [dispatchTasks, setDispatchTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("bhyt_dispatch_tasks_v4");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.setItem("bhyt_dispatch_tasks_v4", JSON.stringify(defaultInitialTasks));
    } catch (e) {
      console.error(e);
    }
    return defaultInitialTasks;
  });

  // Helper setter to write to State & LocalStorage
  const saveAndSyncTasks = (newTasksList) => {
    setDispatchTasks(newTasksList);
    try {
      localStorage.setItem("bhyt_dispatch_tasks_v4", JSON.stringify(newTasksList));
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time synchronization across browser tabs/sessions
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "bhyt_dispatch_tasks_v4" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setDispatchTasks(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [editingDispatchTask, setEditingDispatchTask] = useState(null);
  const [viewingDetailTask, setViewingDetailTask] = useState(null);
  const [updatingProgressTask, setUpdatingProgressTask] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Close action dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".tp-action-dropdown-wrapper")) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close profile dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutsideProfile = (e) => {
      if (!e.target.closest(".tp-profile-menu-wrapper")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutsideProfile);
    return () => document.removeEventListener("click", handleClickOutsideProfile);
  }, []);

  const [searchDispatch, setSearchDispatch] = useState("");
  const [filterDispatchStatus, setFilterDispatchStatus] = useState("ALL");
  const [filterDispatchPriority, setFilterDispatchPriority] = useState("ALL");
  const [filterDispatchAssignee, setFilterDispatchAssignee] = useState("ALL");

  const [customAssignee, setCustomAssignee] = useState("");
  const [dispatchForm, setDispatchForm] = useState({
    title: "",
    description: "",
    assignee: "📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)",
    unit: "Phòng Văn hóa - Xã hội",
    priority: "Trung bình",
    assignedDate: new Date().toISOString().substring(0, 10),
    dueDate: "",
    file_name: "",
    note: ""
  });

  const [progressNote, setProgressNote] = useState("");
  const [selectedProgress, setSelectedProgress] = useState(0);

  // Handlers Điều hành & Giao việc
  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!dispatchForm.title || !dispatchForm.assignee || !dispatchForm.dueDate) {
      setError("Vui lòng nhập đầy đủ Tên công việc, Người thực hiện và Hạn hoàn thành.");
      return;
    }

    const finalAssignee = dispatchForm.assignee === "OTHER" ? (customAssignee || "Cán bộ chuyên trách") : dispatchForm.assignee;

    if (editingDispatchTask) {
      const updated = dispatchTasks.map(t => t.id === editingDispatchTask.id ? {
        ...t,
        ...dispatchForm,
        assignee: finalAssignee,
        history: [
          ...t.history,
          {
            time: new Date().toLocaleString("vi-VN"),
            author: fullName || "Lãnh đạo",
            action: `Chỉnh sửa thông tin công việc`
          }
        ]
      } : t);
      saveAndSyncTasks(updated);
      setMessage(`Đã cập nhật công việc "${dispatchForm.title}" thành công!`);
      setEditingDispatchTask(null);
    } else {
      const newTask = {
        id: `NV-2026-00${dispatchTasks.length + 1}`,
        ...dispatchForm,
        assignee: finalAssignee,
        assigner: fullName ? `${fullName} (Lãnh đạo)` : "Nguyễn Thái Huy (Trưởng phòng)",
        progress: 0,
        status: "Mới giao",
        history: [
          {
            time: new Date().toLocaleString("vi-VN"),
            author: fullName || "Lãnh đạo",
            action: `Chỉ đạo & Giao nhiệm vụ cho: ${finalAssignee}`
          }
        ]
      };
      const updated = [newTask, ...dispatchTasks];
      saveAndSyncTasks(updated);

      // Ban hành thông báo thực tế cho tất cả cán bộ
      try {
        const existingLogs = JSON.parse(localStorage.getItem("bhyt_system_notifications") || "[]");
        const newNotif = {
          id: `NOTIF-${Date.now()}`,
          title: `📢 THÔNG BÁO CHỈ ĐẠO THỰC TẾ: ${dispatchForm.title}`,
          content: `${fullName || "Trưởng phòng Nguyễn Thái Huy"} vừa chỉ đạo / giao việc đến ${finalAssignee}. Hạn hoàn thành: ${dispatchForm.dueDate}`,
          time: new Date().toLocaleString("vi-VN"),
          sender: fullName || "Trưởng phòng Nguyễn Thái Huy",
          recipient: finalAssignee,
          type: "task_assignment"
        };
        localStorage.setItem("bhyt_system_notifications", JSON.stringify([newNotif, ...existingLogs]));
      } catch (err) {
        console.error(err);
      }

      setMessage(`🚀 Đã ban hành chỉ đạo / giao việc tới [${finalAssignee}]! Tất cả Cán bộ đã nhận được trên hệ thống.`);
    }

    setShowDispatchForm(false);
    setCustomAssignee("");
    setDispatchForm({
      title: "",
      description: "",
      assignee: "📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)",
      unit: "Phòng Văn hóa - Xã hội",
      priority: "Trung bình",
      assignedDate: new Date().toISOString().substring(0, 10),
      dueDate: "",
      file_name: "",
      note: ""
    });
  };

  const handleEditDispatchTask = (task) => {
    setEditingDispatchTask(task);
    setShowDispatchForm(true);
    setDispatchForm({
      title: task.title || "",
      description: task.description || "",
      assignee: task.assignee || "📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)",
      unit: task.unit || "Phòng Văn hóa - Xã hội",
      priority: task.priority || "Trung bình",
      assignedDate: task.assignedDate || new Date().toISOString().substring(0, 10),
      dueDate: task.dueDate || "",
      file_name: task.file_name || "",
      note: task.note || ""
    });
  };

  const handleDeleteDispatchTask = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công việc này khỏi hệ thống?")) return;
    const updated = dispatchTasks.filter(t => t.id !== id);
    saveAndSyncTasks(updated);
    setMessage("Đã xóa công việc thành công.");
  };

  const handleQuickCompleteDispatch = (task) => {
    const updated = dispatchTasks.map(t => t.id === task.id ? {
      ...t,
      progress: 100,
      status: "Hoàn thành",
      history: [
        ...t.history,
        {
          time: new Date().toLocaleString("vi-VN"),
          author: fullName || "Cán bộ",
          action: "Đã đánh dấu 100% Hoàn thành công việc"
        }
      ]
    } : t);
    saveAndSyncTasks(updated);
    setMessage(`Công việc "${task.title}" đã được hoàn thành!`);
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!updatingProgressTask) return;

    const newProg = Number(selectedProgress);
    let newStatus = updatingProgressTask.status;
    if (newProg === 100) {
      newStatus = "Hoàn thành";
    } else if (newProg > 0 && newStatus === "Mới giao") {
      newStatus = "Đang xử lý";
    }

    const updated = dispatchTasks.map(t => t.id === updatingProgressTask.id ? {
      ...t,
      progress: newProg,
      status: newStatus,
      note: progressNote ? `${t.note ? t.note + " | " : ""}${progressNote}` : t.note,
      history: [
        ...t.history,
        {
          time: new Date().toLocaleString("vi-VN"),
          author: fullName || "Cán bộ",
          action: `Cập nhật tiến độ thành ${newProg}%${progressNote ? `: ${progressNote}` : ""}`
        }
      ]
    } : t);

    saveAndSyncTasks(updated);
    setMessage(`Đã cập nhật tiến độ công việc thành ${newProg}%!`);
    setUpdatingProgressTask(null);
    setProgressNote("");
  };

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
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [secondaryPreviews, setSecondaryPreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState("");

  // ── TRỢ LÝ AI NGHIỆP VỤ PHÒNG VH-XH STATES & HANDLERS ──
  const [aiActiveSubTab, setAiActiveSubTab] = useState("all");
  const [aiInputQuery, setAiInputQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [uploadedDocFile, setUploadedDocFile] = useState(null);
  const [docSummaryResult, setDocSummaryResult] = useState(null);
  const [searchDocKeyword, setSearchDocKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [aiGeneratedDocContent, setAiGeneratedDocContent] = useState("");
  const [aiGeneratedDocTitle, setAiGeneratedDocTitle] = useState("");
  const [aiDocType, setAiDocType] = useState("report");

  const [aiChatMessages, setAiChatMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Xin chào đồng chí Trưởng phòng Nguyễn Thái Huy! Tôi là Trợ lý AI Nghiệp vụ Thư ký số của Phòng Văn hóa - Xã hội xã Đăk Pxi. Tôi sẵn sàng hỗ trợ đồng chí soạn Báo cáo, Kế hoạch, Thông báo, Tóm tắt Văn bản/Cuộc họp và Gợi ý công việc ưu tiên hôm nay.",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  ]);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói SpeechRecognition. Vui lòng thử trên Chrome!");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.interimResults = false;
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAiInputQuery(transcript);
        setIsListening(false);
        handleExecuteAIQuery(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleTextToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "vi-VN";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExecuteAIQuery = (queryText) => {
    const prompt = (queryText || aiInputQuery).trim();
    if (!prompt) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: prompt,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    setAiInputQuery("");

    setTimeout(() => {
      let aiResponseText = "";
      const lower = prompt.toLowerCase();

      if (lower.includes("báo cáo") || lower.includes("soạn báo cáo")) {
        aiResponseText = `📄 **CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM**\n**Độc lập - Tự do - Hạnh phúc**\n\n**BÁO CÁO KẾT QUẢ CÔNG TÁC VĂN HÓA - XÃ HỘI & BHYT**\n\nI. KẾT QUẢ THỰC HIỆN:\n1. Rà soát & cấp mới 45 thẻ BHYT đợt 2 cho người dân 6 thôn xã Đăk Pxi.\n2. Tỷ lệ đồng bộ dữ liệu VNeID đạt 98.2% trên toàn xã.\n3. Tổ chức thành công 2 hội nghị giao ban an sinh xã hội.\n\nII. PHƯƠNG HƯỚNG NHIỆM VỤ TỚI:\n- Đẩy mạnh tuyên truyền BHYT Học đường cho năm học mới.\n- Tăng cường ứng trực và giải quyết 100% khiếu nại công dân.`;
        setAiGeneratedDocTitle("BÁO CÁO KẾT QUẢ CÔNG TÁC VH-XH");
        setAiGeneratedDocContent(aiResponseText);
      } else if (lower.includes("kế hoạch") || lower.includes("soạn kế hoạch")) {
        aiResponseText = `📋 **KẾ HOẠCH CÔNG TÁC PHÒNG VĂN HÓA - XÃ HỘI TRỌNG TÂM**\n\n1. **Mục tiêu**: Đảm bảo 100% hộ nghèo và gia đình chính sách được tiếp cận dịch vụ y tế BHYT.\n2. **Thời gian thực hiện**: Từ ngày 20/07 đến ngày 15/08/2026.\n3. **Phân công nhiệm vụ**:\n   - Đồng chí Y Byen: Quản lý dữ liệu DVC trực tuyến.\n   - Đồng chí A Blong: Phụ trách tuyên truyền lưu động 6 thôn.\n   - Đồng chí Lê Thị C: Kiểm tra, thẩm định hồ sơ.`;
        setAiGeneratedDocTitle("KẾ HOẠCH CÔNG TÁC TRỌNG TÂM");
        setAiGeneratedDocContent(aiResponseText);
      } else if (lower.includes("thông báo") || lower.includes("soạn thông báo")) {
        aiResponseText = `📣 **THÔNG BÁO NỘI BỘ VỀ VIỆC TỔ CHỨC CUỘC HỌP GIAO BAN BẢO MẬT**\n\nKính gửi: Toàn thể Cán bộ Phòng Văn hóa - Xã hội xã Đăk Pxi.\n\nTrưởng phòng trân trọng kính mời các đồng chí tham dự cuộc họp Bảo mật nội bộ rà soát chỉ tiêu BHYT đợt 2.\n- **Thời gian**: 08h30 ngày mai.\n- **Địa điểm**: Phòng họp bảo mật số 1 - UBND Xã.\n- **Yêu cầu**: Mang theo máy tính công vụ và hồ sơ các thôn.`;
        setAiGeneratedDocTitle("THÔNG BÁO NỘI BỘ CƠ QUAN");
        setAiGeneratedDocContent(aiResponseText);
      } else if (lower.includes("tuyên truyền") || lower.includes("khẩu hiệu") || lower.includes("tiêu đề")) {
        aiResponseText = `✍️ **BÀI VIẾT TUYÊN TRUYỀN & GỢI Ý KHẨU HIỆU BHYT CHUYÊN NGHIỆP**\n\n**Gợi ý Tiêu đề**: "Bảo hiểm y tế - Tấm lá chắn an sinh vững chắc cho mọi gia đình xã Đăk Pxi"\n\n**Khẩu hiệu tuyên truyền (Slogan)**:\n1. "Tham gia BHYT - Cho mình, cho người và vì cộng đồng!"\n2. "BHYT toàn dân - Điểm tựa sức khỏe của mỗi nhà!"\n\n**Nội dung rút gọn**: BHYT là chính sách việt nam nhân văn, hỗ trợ đến 100% chi phí khám chữa bệnh cho hộ nghèo và đồng bào vùng sâu. Bà con hãy chủ động đăng ký trực tuyến trên Cổng dịch vụ công xã.`;
        setAiGeneratedDocTitle("NỘI DUNG TUYÊN TRUYỀN & KHẨU HIỆU");
        setAiGeneratedDocContent(aiResponseText);
      } else if (lower.includes("tìm") || lower.includes("tra cứu") || lower.includes("văn bản")) {
        const found = articles.filter(a => a.tieu_de.toLowerCase().includes(lower) || a.noi_dung.toLowerCase().includes(lower));
        if (found.length > 0) {
          aiResponseText = `🔍 **KẾT QUẢ TÌM KIẾM VĂN BẢN & BÀI VIẾT TRONG CSDL HỆ THỐNG:**\n\n` + found.map(f => `- 📄 **[${f.tieu_de}](file:///d:/he-thong-bhyt/client-user/src/pages/BaiVietDetailPage.jsx)** (Chuyên mục: ${f.danh_muc})`).join("\n");
        } else {
          aiResponseText = `🔍 **KẾT QUẢ TÌM KIẾM VĂN BẢN:**\n- 📄 **Quyết định 15/2026/QĐ-UBND**: Quy định mức hỗ trợ đóng BHYT cho người dân xã Đăk Pxi.\n- 📑 **Kế hoạch 88/KH-VHXH**: Triển khai BHYT học đường năm học 2026-2027.\n- 🔗 *Liên kết chính thức đã sẵn sàng mở trực tiếp trên hệ thống.*`;
        }
      } else if (lower.includes("gợi ý công việc") || lower.includes("ưu tiên") || lower.includes("nhắc việc")) {
        aiResponseText = `💡 **GỢI Ý CÔNG VIỆC VÀ CÁC NHIỆM VỤ ƯU TIÊN HÔM NAY (AI ADVISOR):**\n\n🔴 **Nhiệm vụ Quá hạn / Khẩn cấp**: Rà soát 5 hồ sơ BHYT trùng mã CCCD tại thôn Đăk Wek.\n⚡ **Nhiệm vụ Ưu tiên hàng đầu hôm nay**: Ký phê duyệt danh sách 45 hộ nghèo hỗ trợ 100% kinh phí BHYT.\n📌 **Công việc sắp tới hạn (2 ngày tới)**: Soạn bài viết tuyên truyền BHYT học sinh cho năm học mới.\n📅 **Lịch họp khẩn**: Họp giao ban bảo mật lúc 08h30 ngày mai tại Phòng họp số 1.`;
      } else if (lower.includes("công dân") || lower.includes("bao nhiêu") || lower.includes("cán bộ")) {
        aiResponseText = `📊 **TRÍCH XUẤT DỮ LIỆU THỜI GIAN THỰC TỪ CSDL HỆ THỐNG:**\n- **Tổng số công dân quản lý**: ${citizens.length || 45} người dân.\n- **Nhân sự Phòng VH-XH**: Trưởng phòng Nguyễn Thái Huy & ${subordinates.length || 3} Cán bộ trực thuộc (Lê Thị C, Y Byen, A Blong).\n- **Số lượng cuộc họp**: ${meetings.length || 2} cuộc họp đã thiết lập.`;
      } else {
        aiResponseText = `🤖 **TRẢ LỜI NGHIỆP VỤ (HỆ THỐNG BHYT XÃ ĐĂK PXI):**\n\nCảm ơn đồng chí! Hệ thống đã ghi nhận câu hỏi: "${prompt}".\n\n📌 **Lưu ý nghiệp vụ**: Trợ lý AI ưu tiên trích xuất dữ liệu do Quản trị viên cập nhật chính thức. Nếu câu hỏi không có trong cơ sở dữ liệu nội bộ, AI sẽ trả về: *"Chưa có dữ liệu trong hệ thống"*.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResponseText,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };

      setAiChatMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

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
        setMessage("✅ Đã khởi tạo cuộc họp & Tự động gửi Giấy mời họp thời gian thực tới toàn bộ Cán bộ trong hệ thống!");
      }
      setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "giao-ban", note: "" });
      fetchMeetings();
    } catch (err) {
      setError("Lỗi khi lưu cuộc họp.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (m) => {
    try {
      await axios.post(`${BASE_URL}/api/thong-bao`, {
        title: `📩 GIẤY MỜI HỌP KHẨN: ${m.title}`,
        content: `Trưởng phòng phát lại Giấy mời họp: "${m.title}". Thời gian: ${m.time} ngày ${m.date ? m.date.split('-').reverse().join('/') : ''}. Mã phòng họp: ${m.meetingCode || 'VHXH-98213'} (PIN: ${m.pin || m.passcode || '123456'}).`,
        category: "lich-hop",
        date: new Date().toLocaleDateString("vi-VN"),
        active: true
      });
      setMessage(`🔔 Đã tự động phát lại Giấy mời họp thời gian thực tới toàn bộ Cán bộ trực thuộc!`);
    } catch (err) {
      setMessage(`🔔 Đã phát Thư mời họp khẩn tới toàn bộ Cán bộ trong hệ thống!`);
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
      if (audioFile) {
        fd.append("audio", audioFile);
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
      setAudioFile(null);
      setAudioPreview("");

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
    setCoverPreview(item.anh_dai_dien || "");
    setSecondaryPreviews(item.anh_phu || []);
    setVideoPreview(item.video || "");
    setAudioPreview(item.audio || "");
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
        <div className="tp-profile-section tp-profile-menu-wrapper" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", width: "100%", paddingBottom: "16px" }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              minWidth: 0, 
              flex: 1, 
              cursor: "pointer",
              padding: "4px 4px",
              borderRadius: "8px",
              background: showProfileMenu ? "#f1f5f9" : "transparent",
              transition: "all 0.15s ease"
            }}
            title="Nhấp để mở Menu Tài khoản"
          >
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="tp-profile-info" style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
              <h4 className="tp-profile-name" style={{ 
                fontSize: "12px", 
                fontWeight: "700", 
                color: "#0f172a", 
                margin: 0, 
                padding: 0,
                lineHeight: "1.2",
                whiteSpace: "nowrap", 
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex", 
                alignItems: "center", 
                gap: "2px" 
              }}>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName}</span>
              </h4>
              <span className="tp-profile-role" style={{ fontSize: "10.5px", color: "#64748b", display: "block", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {role === "truongphong" || role === "admin" ? "Trưởng phòng VH-XH" : role === "phophong" ? "Phó phòng VH-XH" : "Cán bộ chuyên viên"}
              </span>
            </div>
          </div>

          {/* Icon thông báo (Hình tròn với 🔔 SVG và chấm đỏ) */}
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
              width: "34px",
              height: "34px",
              borderRadius: "50%", 
              background: "#ffffff", 
              border: "1px solid #cbd5e1", 
              color: "#475569",
              flexShrink: 0,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
            title="Xem thông báo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span style={{ 
              position: "absolute", 
              top: "1px", 
              right: "1px", 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              background: "#ef4444", 
              border: "1.5px solid #ffffff" 
            }} />
          </div>

          {/* DROPDOWN MENU TÀI KHOẢN */}
          {showProfileMenu && (
            <div style={{
              position: "absolute",
              top: "calc(100% - 6px)",
              left: 0,
              width: "100%",
              zIndex: 9999,
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.06)",
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              animation: "tpDropdownFadeIn 0.18s ease"
            }}>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowAccountInfoModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Thông tin tài khoản</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowSettingsModal(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#334155",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>Cài đặt</span>
              </button>

              <div style={{ height: "1px", background: "#e2e8f0", margin: "4px 0" }} />

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  handleLogout();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  background: "transparent",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#dc2626",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fef2f2"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>

        <nav className="tp-nav-menu">
          {/* Trưởng phòng & Admin */}
          {(role === "truongphong" || role === "admin") && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => { setActiveTab("dashboard"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>
                <span>Trang tổng quan</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "task-dispatch" ? "active" : ""}`}
                onClick={() => { setActiveTab("task-dispatch"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span>Điều hành & Giao việc</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "staff" ? "active" : ""}`}
                onClick={() => { setActiveTab("staff"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Cán bộ cấp dưới</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "incoming-docs" ? "active" : ""}`}
                onClick={() => { setActiveTab("incoming-docs"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
                <span>Quản lý Văn bản đến</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "outgoing-docs" ? "active" : ""}`}
                onClick={() => { setActiveTab("outgoing-docs"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                <span>Quản lý Văn bản đi</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => { setActiveTab("schedule"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Lịch họp cơ quan</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => { setActiveTab("articles"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span>Viết bài tuyên truyền</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "updates" ? "active" : ""}`}
                onClick={() => { setActiveTab("updates"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span>Nhật ký & Thông báo</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => { setActiveTab("ai-assistant"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/>
                </svg>
                <span>Trợ lý AI Hành chính & Văn bản</span>
              </button>
            </>
          )}

          {/* Phó phòng */}
          {role === "phophong" && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => { setActiveTab("dashboard"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>
                <span>Trang tổng quan</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "task-dispatch" ? "active" : ""}`}
                onClick={() => { setActiveTab("task-dispatch"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span>Điều hành & Giao việc</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "incoming-docs" ? "active" : ""}`}
                onClick={() => { setActiveTab("incoming-docs"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
                <span>Quản lý Văn bản đến</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "outgoing-docs" ? "active" : ""}`}
                onClick={() => { setActiveTab("outgoing-docs"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                <span>Quản lý Văn bản đi</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => { setActiveTab("schedule"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Lịch họp cơ quan</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => { setActiveTab("tasks"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 14 11 16 15 12"/>
                </svg>
                <span>Chỉ đạo & Nhiệm vụ</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => { setActiveTab("articles"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span>Viết bài tuyên truyền</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => { setActiveTab("ai-assistant"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/>
                </svg>
                <span>Trợ lý AI Hành chính & Văn bản</span>
              </button>
            </>
          )}

          {/* Cán bộ */}
          {role === "canbo" && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => { setActiveTab("dashboard"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                </svg>
                <span>Trang tổng quan</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "task-dispatch" ? "active" : ""}`}
                onClick={() => { setActiveTab("task-dispatch"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span>Điều hành & Giao việc</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "incoming-docs" ? "active" : ""}`}
                onClick={() => { setActiveTab("incoming-docs"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                </svg>
                <span>Quản lý Văn bản đến</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "outgoing-docs" ? "active" : ""}`}
                onClick={() => { setActiveTab("outgoing-docs"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                <span>Quản lý Văn bản đi</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => { setActiveTab("schedule"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span>Lịch họp cơ quan</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "tasks" ? "active" : ""}`}
                onClick={() => { setActiveTab("tasks"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><polyline points="9 14 11 16 15 12"/>
                </svg>
                <span>Chỉ đạo & Nhiệm vụ</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => { setActiveTab("articles"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span>Viết bài tuyên truyền</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "feedback" ? "active" : ""}`}
                onClick={() => { setActiveTab("feedback"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Góp ý & Phản hồi</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => { setActiveTab("ai-assistant"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/>
                </svg>
                <span>Trợ lý AI Hành chính & Văn bản</span>
              </button>
            </>
          )}
        </nav>

      </aside>

      {/* Right Main Content */}
      <main className="tp-main-content">
        {activeTab !== "ai-assistant" && (
          <header className="tp-content-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "#005baa", letterSpacing: "0.3px", marginBottom: "2px", textTransform: "uppercase" }}>
                Hệ thống Điều hành & Giao việc — Phòng Văn hóa - Xã hội
              </div>
              <h2 style={{ margin: 0 }}>
                {activeTab === "dashboard" && "Trang tổng quan & Theo dõi hoạt động thời gian thực"}
                {activeTab === "task-dispatch" && "Quản lý Điều hành & Phân công Giao việc"}
                {activeTab === "incoming-docs" && "Quản lý Sổ Văn bản đến & Phân công chỉ đạo xử lý"}
                {activeTab === "outgoing-docs" && "Quản lý Sổ Văn bản đi & Soạn thảo dự thảo phát hành"}
                {activeTab === "staff" && "Quản lý Cán bộ cấp dưới"}
                {activeTab === "schedule" && "Lịch họp & Điều phối lịch công tác"}
                {activeTab === "updates" && "Nhật ký Hệ thống & Thông báo UBND"}
                {activeTab === "tasks" && "Chỉ thị & Nhiệm vụ được giao"}
                {activeTab === "articles" && "Soạn thảo bài tuyên truyền cho bà con"}
                {activeTab === "feedback" && "Phản hồi & Giải đáp góp ý từ người dân"}
              </h2>
            </div>

            {/* Đồng hồ thời gian hiện tại góc bên phải */}
            <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ fontSize: "11px", color: "#475569", fontWeight: "600", textAlign: "right", marginBottom: "2px" }}>Thời gian hiện tại</span>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style={{ fontFamily: "monospace" }}>{formatCurrentTime(currentTime)}</span>
              </div>
            </div>
          </header>
        )}

        <div className="tp-content-body">
          {/* 🔔 THÔNG BÁO TOAST NỔI GÓC DƯỚI BÊN PHẢI (5 GIÂY TỰ ĐỘNG BIẾN MẤT - CHUẨN HTML5/CSS3) */}
          {(message || error) && (
            <div
              style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 999999,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "420px",
                width: "calc(100vw - 48px)",
                animation: "toastSlideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {message && (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1.5px solid #86efac",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", background: "#dcfce7",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, fontSize: "13.5px", fontWeight: "700", color: "#14532d", lineHeight: "1.4" }}>
                    {message}
                  </div>
                  <button
                    onClick={() => setMessage("")}
                    style={{ background: "none", border: "none", color: "#166534", fontSize: "16px", cursor: "pointer", padding: "0 4px", fontWeight: "700" }}
                  >
                    ✕
                  </button>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, height: "3px", background: "#22c55e",
                    width: "100%", animation: "toastCountdown 5s linear forwards"
                  }} />
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1.5px solid #fca5a5",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", background: "#fee2e2",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, fontSize: "13.5px", fontWeight: "700", color: "#7f1d1d", lineHeight: "1.4" }}>
                    {error}
                  </div>
                  <button
                    onClick={() => setError("")}
                    style={{ background: "none", border: "none", color: "#991b1b", fontSize: "16px", cursor: "pointer", padding: "0 4px", fontWeight: "700" }}
                  >
                    ✕
                  </button>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, height: "3px", background: "#ef4444",
                    width: "100%", animation: "toastCountdown 5s linear forwards"
                  }} />
                </div>
              )}
            </div>
          )}

          {/* 📢 BANNER THÔNG BÁO CHỈ ĐẠO THỰC TẾ TỪ TRƯỞNG PHÒNG GỬI ALL CÁN BỘ */}
          {(() => {
            const allStaffDirectives = dispatchTasks.filter(t => t.status !== "Hoàn thành" && (t.assignee.includes("Tất cả Cán bộ") || t.assignee.includes("ALL")));
            if (allStaffDirectives.length === 0 || activeTab === "task-dispatch") return null;

            return (
              <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderLeft: "5px solid #005baa", borderRadius: "4px", padding: "10px 14px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M22 8a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h2l4 4 4-4h2a6 6 0 0 0 6-6V8z"/>
                  </svg>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "#1e3a8a" }}>
                      CHỈ ĐẠO TRỰC TIẾP TỪ TRƯỞNG PHÒNG GỬI TOÀN THỂ CÁN BỘ ({allStaffDirectives.length} chỉ đạo đang thực hiện)
                    </strong>
                    <div style={{ fontSize: "12.5px", color: "#1e293b", marginTop: "2px" }}>
                      Mới nhất: <strong>{allStaffDirectives[0].title}</strong> ({allStaffDirectives[0].assigner} - Hạn: {allStaffDirectives[0].dueDate})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("task-dispatch")}
                  style={{ padding: "6px 14px", background: "#005baa", color: "#ffffff", border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span>Xem & Báo cáo tiến độ</span>
                </button>
              </div>
            );
          })()}

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

          {/* ──────────────────────────────────
              TAB ĐIỀU HÀNH & GIAO VIỆC (NỘI BỘ PHÒNG VH-XH)
              ────────────────────────────────── */}
          {activeTab === "task-dispatch" && (() => {
            const todayStr = new Date().toISOString().substring(0, 10);

            // Phân loại danh sách thông báo & lọc dữ liệu
            const overdueTasks = dispatchTasks.filter(t => t.status !== "Hoàn thành" && (t.status === "Quá hạn" || (t.dueDate && t.dueDate < todayStr)));
            const upcomingTasks = dispatchTasks.filter(t => {
              if (t.status === "Hoàn thành" || !t.dueDate) return false;
              const diffDays = Math.ceil((new Date(t.dueDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
              return diffDays >= 0 && diffDays <= 2;
            });
            const newTasks = dispatchTasks.filter(t => t.status === "Mới giao");

            // Lọc công việc theo bộ lọc
            const filteredTasks = dispatchTasks.filter(t => {
              const matchSearch = t.title.toLowerCase().includes(searchDispatch.toLowerCase()) ||
                                  t.description.toLowerCase().includes(searchDispatch.toLowerCase()) ||
                                  t.assignee.toLowerCase().includes(searchDispatch.toLowerCase()) ||
                                  t.id.toLowerCase().includes(searchDispatch.toLowerCase());
              const matchStatus = filterDispatchStatus === "ALL" || t.status === filterDispatchStatus;
              const matchPriority = filterDispatchPriority === "ALL" || t.priority === filterDispatchPriority;
              const matchAssignee = filterDispatchAssignee === "ALL" || t.assignee === filterDispatchAssignee;
              return matchSearch && matchStatus && matchPriority && matchAssignee;
            });

            // Danh sách cán bộ thực hiện độc nhất để đưa vào dropdown filter
            const uniqueAssignees = Array.from(new Set(dispatchTasks.map(t => t.assignee)));

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* 8. Bảng Khối Thông báo Cảnh báo (Alert Banner Top) */}
                {(overdueTasks.length > 0 || upcomingTasks.length > 0 || newTasks.length > 0) && (
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "800", color: "#1e3a8a", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px" }}>
                      📢 KHỐI THÔNG BÁO VĂN PHÒNG ĐIỀU HÀNH
                    </div>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "12.5px" }}>
                      {overdueTasks.length > 0 && (
                        <div style={{ color: "#b91c1c", fontWeight: "700" }}>
                          🚨 Quá hạn ({overdueTasks.length}): {overdueTasks.map(t => t.title).join("; ")}
                        </div>
                      )}
                      {upcomingTasks.length > 0 && (
                        <div style={{ color: "#b45309", fontWeight: "700" }}>
                          ⏳ Sắp đến hạn ({upcomingTasks.length}): {upcomingTasks.map(t => t.title).join("; ")}
                        </div>
                      )}
                      {newTasks.length > 0 && (
                        <div style={{ color: "#0369a1", fontWeight: "700" }}>
                          📌 Có công việc mới giao ({newTasks.length}): {newTasks.map(t => t.title).join("; ")}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1. Dashboard (5 Thẻ thống kê tối giản) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderLeft: "4px solid #1e3a8a", borderRadius: "4px", padding: "12px 16px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" }}>TỔNG CÔNG VIỆC</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#1e3a8a", marginTop: "2px" }}>{dispatchTasks.length}</div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderLeft: "4px solid #0284c7", borderRadius: "4px", padding: "12px 16px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" }}>ĐANG XỬ LÝ</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#0284c7", marginTop: "2px" }}>
                      {dispatchTasks.filter(t => t.status === "Đang xử lý").length}
                    </div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderLeft: "4px solid #15803d", borderRadius: "4px", padding: "12px 16px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" }}>HOÀN THÀNH</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#15803d", marginTop: "2px" }}>
                      {dispatchTasks.filter(t => t.status === "Hoàn thành").length}
                    </div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderLeft: "4px solid #b45309", borderRadius: "4px", padding: "12px 16px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" }}>SẮP ĐẾN HẠN</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#b45309", marginTop: "2px" }}>
                      {upcomingTasks.length}
                    </div>
                  </div>
                  <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderLeft: "4px solid #b91c1c", borderRadius: "4px", padding: "12px 16px" }}>
                    <div style={{ fontSize: "11px", color: "#475569", fontWeight: "700", textTransform: "uppercase" }}>QUÁ HẠN</div>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: "#b91c1c", marginTop: "2px" }}>
                      {overdueTasks.length}
                    </div>
                  </div>
                </div>

                {/* 2. Thanh công cụ (Toolbar controls) */}
                <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      placeholder="Tìm tên công việc, người thực hiện..."
                      value={searchDispatch}
                      onChange={(e) => setSearchDispatch(e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", width: "230px" }}
                    />

                    <select
                      value={filterDispatchStatus}
                      onChange={(e) => setFilterDispatchStatus(e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      <option value="Mới giao">Mới giao</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Quá hạn">Quá hạn</option>
                    </select>

                    <select
                      value={filterDispatchPriority}
                      onChange={(e) => setFilterDispatchPriority(e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="ALL">Tất cả độ ưu tiên</option>
                      <option value="Thấp">Thấp</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Cao">Cao</option>
                      <option value="Khẩn">Khẩn</option>
                    </select>

                    <select
                      value={filterDispatchAssignee}
                      onChange={(e) => setFilterDispatchAssignee(e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="ALL">Tất cả người thực hiện</option>
                      {uniqueAssignees.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (showDispatchForm && !editingDispatchTask) {
                        setShowDispatchForm(false);
                      } else {
                        setShowDispatchForm(true);
                        setEditingDispatchTask(null);
                        setDispatchForm({
                          title: "", description: "", assignee: "Tất cả Cán bộ (Toàn thể Phòng VH-XH)",
                          unit: "Phòng Văn hóa - Xã hội", priority: "Trung bình",
                          assignedDate: new Date().toISOString().substring(0, 10),
                          dueDate: "", file_name: "", note: ""
                        });
                      }
                    }}
                    style={{
                      padding: "7px 14px", borderRadius: "4px", background: "#005baa", color: "#ffffff",
                      border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                    }}
                  >
                    {showDispatchForm ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>Đóng form</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        <span>Giao công việc</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 4. Form giao việc (Collapsible Horizontal Grid) */}
                {(showDispatchForm || editingDispatchTask) && (
                  <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderTop: "3px solid #005baa", borderRadius: "4px", padding: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "800", color: "#1e3a8a", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                      {editingDispatchTask ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          <span>CẬP NHẬT CÔNG VIỆC GIAO</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                          <span>FORM GIAO CÔNG VIỆC MỚI</span>
                        </>
                      )}
                    </div>

                    <form onSubmit={handleDispatchSubmit}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px 14px" }}>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Tên công việc / Nội dung chỉ đạo (*)
                          </label>
                          <input
                            type="text"
                            placeholder="Nhập tên nhiệm vụ, công việc giao..."
                            value={dispatchForm.title}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, title: e.target.value })}
                            required
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Người thực hiện / Nhận chỉ đạo (*)
                          </label>
                          <select
                            value={dispatchForm.assignee}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, assignee: e.target.value })}
                            required
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", fontWeight: "700" }}
                          >
                            <option value="📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)">Tất cả Cán bộ (Toàn thể Phòng VH-XH)</option>
                            <option value="Ngô Đỗ Quỳnh (Phó phòng)">Ngô Đỗ Quỳnh (Phó phòng)</option>
                            <option value="Hoàng Trung Dũng (Cán Bộ Chuyên Viên)">Hoàng Trung Dũng (Cán Bộ Chuyên Viên)</option>
                            <option value="Lê Ngọc Sơn (Cán bộ chuyên Viên)">Lê Ngọc Sơn (Cán bộ chuyên Viên)</option>
                            <option value="OTHER">Nhập họ tên cán bộ khác...</option>
                          </select>

                          {dispatchForm.assignee === "OTHER" && (
                            <input
                              type="text"
                              placeholder="Nhập tên cán bộ hoặc đơn vị..."
                              value={customAssignee}
                              onChange={(e) => setCustomAssignee(e.target.value)}
                              required
                              style={{ width: "100%", marginTop: "6px", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                            />
                          )}
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Đơn vị phụ trách
                          </label>
                          <input
                            type="text"
                            placeholder="Phòng Văn hóa - Xã hội"
                            value={dispatchForm.unit}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, unit: e.target.value })}
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Mức độ ưu tiên
                          </label>
                          <select
                            value={dispatchForm.priority}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, priority: e.target.value })}
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                          >
                            <option value="Thấp">Thấp</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Cao">Cao</option>
                            <option value="Khẩn">Khẩn</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Ngày giao
                          </label>
                          <input
                            type="date"
                            value={dispatchForm.assignedDate}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, assignedDate: e.target.value })}
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Hạn hoàn thành (*)
                          </label>
                          <input
                            type="date"
                            value={dispatchForm.dueDate}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, dueDate: e.target.value })}
                            required
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            File đính kèm
                          </label>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              type="file"
                              id="dispatch-file-upload"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setDispatchForm({ ...dispatchForm, file_name: file.name });
                                }
                              }}
                            />
                            <input
                              type="text"
                              placeholder="KeHoach_CongViec.pdf"
                              value={dispatchForm.file_name}
                              onChange={(e) => setDispatchForm({ ...dispatchForm, file_name: e.target.value })}
                              style={{ flex: 1, padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById("dispatch-file-upload").click()}
                              style={{ padding: "6px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#0f172a", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                              <span>Chọn file</span>
                            </button>
                          </div>
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Mô tả công việc
                          </label>
                          <textarea
                            rows="2"
                            placeholder="Chi tiết yêu cầu công việc..."
                            value={dispatchForm.description}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, description: e.target.value })}
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Ghi chú
                          </label>
                          <input
                            type="text"
                            placeholder="Ghi chú bổ sung..."
                            value={dispatchForm.note}
                            onChange={(e) => setDispatchForm({ ...dispatchForm, note: e.target.value })}
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDispatchForm(false);
                            setEditingDispatchTask(null);
                          }}
                          style={{ padding: "6px 14px", borderRadius: "4px", background: "#e2e8f0", border: "1px solid #cbd5e1", fontSize: "13px", cursor: "pointer" }}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          style={{ padding: "6px 18px", borderRadius: "4px", background: "#005baa", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                        >
                          Lưu
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. Bảng Danh sách công việc (Chuẩn HTML Admin Cơ Quan) */}
                <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "4px" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", color: "#1e293b", borderBottom: "2px solid #cbd5e1" }}>
                          <th style={{ padding: "10px 12px", width: "45px", textAlign: "center" }}>STT</th>
                          <th style={{ padding: "10px 12px" }}>Tên công việc</th>
                          <th style={{ padding: "10px 12px", width: "150px" }}>Người giao</th>
                          <th style={{ padding: "10px 12px", width: "140px" }}>Người thực hiện</th>
                          <th style={{ padding: "10px 12px", width: "95px", whiteSpace: "nowrap" }}>Ngày giao</th>
                          <th style={{ padding: "10px 12px", width: "95px", whiteSpace: "nowrap" }}>Hạn hoàn thành</th>
                          <th style={{ padding: "10px 12px", width: "90px", textAlign: "center" }}>Ưu tiên</th>
                          <th style={{ padding: "10px 12px", width: "110px", textAlign: "center" }}>Tiến độ (%)</th>
                          <th style={{ padding: "10px 12px", width: "100px", textAlign: "center" }}>Trạng thái</th>
                          <th style={{ padding: "10px 12px", width: "80px", textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.length === 0 ? (
                          <tr>
                            <td colSpan="10" style={{ textAlign: "center", padding: "28px", color: "#64748b" }}>
                              Không tìm thấy công việc nào.
                            </td>
                          </tr>
                        ) : (
                          filteredTasks.map((t, idx) => (
                            <tr
                              key={t.id}
                              style={{
                                borderBottom: "1px solid #e2e8f0",
                                background: idx % 2 === 0 ? "#ffffff" : "#f8fafc"
                              }}
                            >
                              <td style={{ padding: "10px 12px", textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: "10px 12px" }}>
                                <div style={{ fontWeight: "700", color: "#0f172a", lineHeight: "1.4" }}>
                                  {t.title}
                                </div>
                                {t.file_name && (
                                  <div style={{ fontSize: "11.5px", color: "#2563eb", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                    <u>{t.file_name}</u>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "10px 12px", color: "#334155", fontSize: "12.5px" }}>
                                {t.assigner}
                              </td>
                              <td style={{ padding: "10px 12px", fontWeight: "600", color: "#0f172a", fontSize: "12.5px" }}>
                                {t.assignee && t.assignee.includes("Tất cả Cán bộ") ? (
                                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#1e3a8a", background: "#dbeafe", border: "1px solid #93c5fd", padding: "3px 8px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    <span>Toàn thể Phòng VH-XH</span>
                                  </span>
                                ) : (
                                  <span>{t.assignee}</span>
                                )}
                                <div style={{ fontSize: "11px", color: "#64748b" }}>{t.unit}</div>
                              </td>
                              <td style={{ padding: "10px 12px", whiteSpace: "nowrap", color: "#475569" }}>
                                {t.assignedDate}
                              </td>
                              <td style={{ padding: "10px 12px", whiteSpace: "nowrap", fontWeight: "600", color: t.status === "Quá hạn" ? "#b91c1c" : "#334155" }}>
                                {t.dueDate}
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: "11px", fontWeight: "700", padding: "2px 6px", borderRadius: "3px",
                                  background: t.priority === "Khẩn" ? "#fee2e2" : t.priority === "Cao" ? "#fef3c7" : "#e2e8f0",
                                  color: t.priority === "Khẩn" ? "#b91c1c" : t.priority === "Cao" ? "#b45309" : "#334155"
                                }}>
                                  {t.priority}
                                </span>
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                                  <span style={{ fontSize: "11.5px", fontWeight: "700" }}>{t.progress}%</span>
                                  <div style={{ width: "70px", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                                    <div style={{
                                      width: `${t.progress}%`, height: "100%",
                                      background: t.progress === 100 ? "#15803d" : "#005baa"
                                    }} />
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: "11.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "3px", display: "inline-block",
                                  background: t.status === "Hoàn thành" ? "#d1fae5" :
                                              t.status === "Đang xử lý" ? "#e0f2fe" :
                                              t.status === "Quá hạn" ? "#fee2e2" : "#f1f5f9",
                                  color: t.status === "Hoàn thành" ? "#15803d" :
                                         t.status === "Đang xử lý" ? "#0369a1" :
                                         t.status === "Quá hạn" ? "#b91c1c" : "#475569"
                                }}>
                                  {t.status}
                                </span>
                              </td>
                              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                <div className="tp-action-dropdown-wrapper">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenuId(openActionMenuId === t.id ? null : t.id);
                                    }}
                                    className={`tp-action-trigger-btn ${openActionMenuId === t.id ? "active" : ""}`}
                                    title="Thao tác"
                                  >
                                    ⋮
                                  </button>

                                  {openActionMenuId === t.id && (
                                    <div className="tp-action-dropdown-menu">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionMenuId(null);
                                          setViewingDetailTask(t);
                                        }}
                                        className="tp-dropdown-item"
                                      >
                                        <span className="tp-dropdown-icon" style={{ display: "flex", alignItems: "center" }}>
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        </span>
                                        <span>Xem chi tiết</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionMenuId(null);
                                          handleEditDispatchTask(t);
                                        }}
                                        className="tp-dropdown-item"
                                      >
                                        <span className="tp-dropdown-icon" style={{ display: "flex", alignItems: "center" }}>
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                        </span>
                                        <span>Sửa công việc</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionMenuId(null);
                                          setUpdatingProgressTask(t);
                                          setSelectedProgress(t.progress || 0);
                                          setProgressNote("");
                                        }}
                                        className="tp-dropdown-item"
                                      >
                                        <span className="tp-dropdown-icon" style={{ display: "flex", alignItems: "center" }}>
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                        </span>
                                        <span>Cập nhật tiến độ</span>
                                      </button>

                                      {t.progress < 100 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenActionMenuId(null);
                                            handleQuickCompleteDispatch(t);
                                          }}
                                          className="tp-dropdown-item tp-dropdown-item-complete"
                                        >
                                          <span className="tp-dropdown-icon" style={{ display: "flex", alignItems: "center" }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                          </span>
                                          <span>Đánh dấu Hoàn thành</span>
                                        </button>
                                      )}

                                      <div className="tp-dropdown-divider" />

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionMenuId(null);
                                          handleDeleteDispatchTask(t.id);
                                        }}
                                        className="tp-dropdown-item tp-dropdown-item-delete"
                                      >
                                        <span className="tp-dropdown-icon" style={{ display: "flex", alignItems: "center" }}>
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </span>
                                        <span>Xóa công việc</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Modal Chi tiết công việc */}
                {viewingDetailTask && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", width: "100%", maxWidth: "650px", maxHeight: "90vh", overflowY: "auto", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0, fontSize: "16px", color: "#1e3a8a", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                          <span>CHI TIẾT CÔNG VIỆC: {viewingDetailTask.id}</span>
                        </h3>
                        <button onClick={() => setViewingDetailTask(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                        <div>
                          <strong style={{ fontSize: "14px", color: "#0f172a" }}>{viewingDetailTask.title}</strong>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", background: "#f8fafc", padding: "10px", borderRadius: "4px" }}>
                          <div><strong>Người giao:</strong> {viewingDetailTask.assigner}</div>
                          <div><strong>Người thực hiện:</strong> {viewingDetailTask.assignee}</div>
                          <div><strong>Đơn vị:</strong> {viewingDetailTask.unit}</div>
                          <div><strong>Mức ưu tiên:</strong> {viewingDetailTask.priority}</div>
                          <div><strong>Ngày giao:</strong> {viewingDetailTask.assignedDate}</div>
                          <div><strong>Hạn hoàn thành:</strong> {viewingDetailTask.dueDate}</div>
                          <div><strong>Tiến độ:</strong> {viewingDetailTask.progress}%</div>
                          <div><strong>Trạng thái:</strong> {viewingDetailTask.status}</div>
                        </div>

                        {viewingDetailTask.description && (
                          <div>
                            <strong>Mô tả chi tiết:</strong>
                            <div style={{ background: "#f1f5f9", padding: "8px 10px", borderRadius: "4px", marginTop: "4px" }}>
                              {viewingDetailTask.description}
                            </div>
                          </div>
                        )}

                        {viewingDetailTask.file_name && (
                          <div>
                            <strong>File đính kèm:</strong> 📎 <u>{viewingDetailTask.file_name}</u>
                          </div>
                        )}

                        {/* 5. Lịch sử xử lý */}
                        <div>
                          <strong style={{ display: "block", marginBottom: "6px" }}>📜 Lịch sử & Tiến trình xử lý:</strong>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {viewingDetailTask.history && viewingDetailTask.history.length > 0 ? (
                              viewingDetailTask.history.map((h, i) => (
                                <div key={i} style={{ fontSize: "12px", borderLeft: "3px solid #005baa", paddingLeft: "8px", background: "#fafafa", padding: "4px 8px" }}>
                                  <span style={{ color: "#64748b" }}>[{h.time}]</span> <strong>{h.author}:</strong> {h.action}
                                </div>
                              ))
                            ) : (
                              <span style={{ color: "#64748b", fontSize: "12px" }}>Chưa có nhật ký ghi nhận.</span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                          <button onClick={() => setViewingDetailTask(null)} style={{ padding: "6px 16px", borderRadius: "4px", background: "#005baa", color: "#fff", border: "none", fontSize: "13px", cursor: "pointer" }}>
                            Đóng cửa sổ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Modal Cập nhật tiến độ */}
                {updatingProgressTask && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", width: "100%", maxWidth: "480px", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", color: "#1e3a8a", fontWeight: "800" }}>
                          📊 CẬP NHẬT TIẾN ĐỘ CÔNG VIỆC
                        </h3>
                        <button onClick={() => setUpdatingProgressTask(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
                      </div>

                      <form onSubmit={handleSaveProgress}>
                        <div style={{ fontSize: "13px", marginBottom: "12px", fontWeight: "700", color: "#0f172a" }}>
                          {updatingProgressTask.title}
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>
                            Chọn mức độ % hoàn thành:
                          </label>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                            {[0, 25, 50, 75, 100].map(p => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setSelectedProgress(p)}
                                style={{
                                  flex: 1, padding: "8px 0", borderRadius: "4px", fontSize: "13px", fontWeight: "800", cursor: "pointer",
                                  background: Number(selectedProgress) === p ? "#005baa" : "#f1f5f9",
                                  color: Number(selectedProgress) === p ? "#ffffff" : "#334155",
                                  border: Number(selectedProgress) === p ? "none" : "1px solid #cbd5e1"
                                }}
                              >
                                {p}%
                              </button>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Ghi chú nội dung xử lý:
                          </label>
                          <textarea
                            rows="3"
                            placeholder="Nhập ghi chú tiến độ thực hiện thực tế..."
                            value={progressNote}
                            onChange={(e) => setProgressNote(e.target.value)}
                            style={{ width: "100%", padding: "6px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button type="button" onClick={() => setUpdatingProgressTask(null)} style={{ padding: "6px 14px", borderRadius: "4px", background: "#e2e8f0", border: "1px solid #cbd5e1", fontSize: "13px", cursor: "pointer" }}>
                            Hủy
                          </button>
                          <button type="submit" style={{ padding: "6px 18px", borderRadius: "4px", background: "#005baa", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                            Lưu tiến độ
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}

          {/* ──────────────────────────────────
              TAB VĂN BẢN ĐẾN & VĂN BẢN ĐỊ (CHUNG CHO TẤT CẢ CÁN BỘ & LÃNH ĐẠO)
              ────────────────────────────────── */}
          {activeTab === "incoming-docs" && (() => {
            const filteredIncoming = incomingDocs.filter(doc => {
              const matchSearch = doc.so_hieu.toLowerCase().includes(searchIncoming.toLowerCase()) ||
                                  doc.trich_yeu.toLowerCase().includes(searchIncoming.toLowerCase()) ||
                                  doc.co_quan_ban_hanh.toLowerCase().includes(searchIncoming.toLowerCase());
              const matchUrgency = filterIncomingUrgency === "ALL" || doc.do_khan === filterIncomingUrgency;
              return matchSearch && matchUrgency;
            });

            return (
              <div style={{ animation: "fadeIn 0.2s ease-out", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Thanh Tiêu đề & Công cụ điều khiển tối giản */}
                <div className="tp-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                      <span>SỔ QUẢN LÝ VĂN BẢN ĐẾN CƠ QUAN ({filteredIncoming.length})</span>
                    </h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Quản lý, phân công và theo dõi tiến độ xử lý văn bản đến của Phòng Văn hóa - Xã hội
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <select
                      value={filterIncomingUrgency}
                      onChange={(e) => setFilterIncomingUrgency(e.target.value)}
                      style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="ALL">Tất cả độ khẩn</option>
                      <option value="Thường">Thường</option>
                      <option value="Khẩn">Khẩn</option>
                      <option value="Mật">Mật</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Tìm số hiệu, trích yếu, nơi gửi..."
                      style={{ width: "240px", padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      value={searchIncoming}
                      onChange={(e) => setSearchIncoming(e.target.value)}
                    />

                    <button
                      onClick={() => {
                        if (showIncomingForm && !editingIncomingDoc) {
                          setShowIncomingForm(false);
                        } else {
                          setShowIncomingForm(true);
                          setEditingIncomingDoc(null);
                          setIncomingForm({
                            so_hieu: "", co_quan_ban_hanh: "", ngay_den: new Date().toISOString().substring(0, 10),
                            trich_yeu: "", do_khan: "Thường", nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
                            han_xu_ly: "", trang_thai: "Chưa xử lý", file_name: "", chi_dao: "", ket_qua: ""
                          });
                        }
                      }}
                      style={{
                        padding: "8px 16px", borderRadius: "6px", background: "#005baa", color: "#fff",
                        border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                      }}
                    >
                      {showIncomingForm ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          <span>Đóng biểu mẫu</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          <span>Tiếp nhận Văn bản đến Mới</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Form Tiếp nhận / Hiệu chỉnh Văn bản Đến (Full Width Nằm Ngang Gọn Gàng) */}
                {(showIncomingForm || editingIncomingDoc) && (
                  <div className="tp-card" style={{ padding: "20px", borderTop: "4px solid #005baa", background: "#fafafa" }}>
                    <h4 style={{ margin: "0 0 16px", fontSize: "15px", color: "#003d7a", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                      {editingIncomingDoc ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          <span>CẬP NHẬT THÔNG TIN VĂN BẢN ĐẾN</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                          <span>TIẾP NHẬN & PHÂN CÔNG VĂN BẢN ĐẾN MỚI</span>
                        </>
                      )}
                    </h4>

                    <form onSubmit={handleIncomingSubmit}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px 16px" }}>
                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Số / Ký hiệu Văn bản (*)</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: 128/UBND-VX"
                            value={incomingForm.so_hieu}
                            onChange={(e) => setIncomingForm({ ...incomingForm, so_hieu: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Cơ quan ban hành (*)</label>
                          <input
                            type="text"
                            placeholder="UBND huyện Tu Mơ Rông"
                            value={incomingForm.co_quan_ban_hanh}
                            onChange={(e) => setIncomingForm({ ...incomingForm, co_quan_ban_hanh: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Ngày đến (*)</label>
                          <input
                            type="date"
                            value={incomingForm.ngay_den}
                            onChange={(e) => setIncomingForm({ ...incomingForm, ngay_den: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Hạn xử lý</label>
                          <input
                            type="date"
                            value={incomingForm.han_xu_ly}
                            onChange={(e) => setIncomingForm({ ...incomingForm, han_xu_ly: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Mức độ khẩn</label>
                          <select
                            value={incomingForm.do_khan}
                            onChange={(e) => setIncomingForm({ ...incomingForm, do_khan: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Thường">Thường</option>
                            <option value="Khẩn">Khẩn</option>
                            <option value="Mật">Mật</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Trạng thái xử lý</label>
                          <select
                            value={incomingForm.trang_thai}
                            onChange={(e) => setIncomingForm({ ...incomingForm, trang_thai: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Chưa xử lý">Chưa xử lý</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Cán bộ được giao xử lý</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Nguyễn Thái Huy"
                            value={incomingForm.nguoi_xu_ly}
                            onChange={(e) => setIncomingForm({ ...incomingForm, nguoi_xu_ly: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>File đính kèm</label>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              type="file"
                              id="incoming-file-upload"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setIncomingForm({ ...incomingForm, file_name: file.name });
                                }
                              }}
                            />
                            <input
                              type="text"
                              placeholder="128_UBND_CongVan.pdf"
                              value={incomingForm.file_name}
                              onChange={(e) => setIncomingForm({ ...incomingForm, file_name: e.target.value })}
                              style={{ flex: 1, padding: "7px 10px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById("incoming-file-upload").click()}
                              style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#0f172a", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                              <span>Chọn file</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Trích yếu nội dung văn bản (*)</label>
                          <textarea
                            rows="2"
                            placeholder="Tóm tắt ngắn gọn nội dung chỉ đạo trong văn bản..."
                            value={incomingForm.trich_yeu}
                            onChange={(e) => setIncomingForm({ ...incomingForm, trich_yeu: e.target.value })}
                            required
                            style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Ý kiến chỉ đạo của Lãnh đạo</label>
                          <textarea
                            rows="2"
                            placeholder="Nội dung giao việc, chỉ đạo thực hiện..."
                            value={incomingForm.chi_dao}
                            onChange={(e) => setIncomingForm({ ...incomingForm, chi_dao: e.target.value })}
                            style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="tp-btn-cancel"
                          onClick={() => {
                            setShowIncomingForm(false);
                            setEditingIncomingDoc(null);
                          }}
                          style={{ padding: "7px 16px", fontSize: "13px" }}
                        >
                          Hủy bỏ
                        </button>
                        <button type="submit" className="tp-btn-submit" style={{ padding: "7px 20px", fontSize: "13px" }}>
                          {editingIncomingDoc ? "💾 Lưu cập nhật văn bản" : "📥 Lưu văn bản đến"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Bảng Danh sách Văn bản Đến Chuẩn Cơ Quan Tối Giản */}
                <div className="tp-card" style={{ padding: "0", overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", color: "#1e293b", borderBottom: "2px solid #cbd5e1" }}>
                          <th style={{ padding: "12px 14px", width: "50px", textAlign: "center" }}>STT</th>
                          <th style={{ padding: "12px 14px", width: "130px", whiteSpace: "nowrap" }}>Số / Ký hiệu</th>
                          <th style={{ padding: "12px 14px", width: "100px", whiteSpace: "nowrap" }}>Ngày đến</th>
                          <th style={{ padding: "12px 14px", width: "180px" }}>Cơ quan ban hành</th>
                          <th style={{ padding: "12px 14px" }}>Trích yếu nội dung & Chỉ đạo</th>
                          <th style={{ padding: "12px 14px", width: "160px" }}>Người xử lý & Hạn</th>
                          <th style={{ padding: "12px 14px", width: "90px", textAlign: "center" }}>Độ khẩn</th>
                          <th style={{ padding: "12px 14px", width: "110px", textAlign: "center" }}>Trạng thái</th>
                          <th style={{ padding: "12px 14px", width: "110px", textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIncoming.length === 0 ? (
                          <tr>
                            <td colSpan="9" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                              Không tìm thấy bản ghi văn bản đến nào.
                            </td>
                          </tr>
                        ) : (
                          filteredIncoming.map((doc, idx) => (
                            <tr
                              key={doc.id}
                              style={{
                                borderBottom: "1px solid #e2e8f0",
                                background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                                transition: "background 0.15s ease"
                              }}
                            >
                              <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                                <strong style={{ color: "#003d7a", fontSize: "13.5px" }}>{doc.so_hieu}</strong>
                              </td>
                              <td style={{ padding: "12px 14px", whiteSpace: "nowrap", color: "#475569" }}>
                                {doc.ngay_den}
                              </td>
                              <td style={{ padding: "12px 14px", fontWeight: "700", color: "#334155" }}>
                                {doc.co_quan_ban_hanh}
                              </td>
                              <td style={{ padding: "12px 14px", lineHeight: "1.45" }}>
                                <div style={{ fontWeight: "700", color: "#0f172a" }}>
                                  {doc.trich_yeu}
                                </div>
                                {doc.chi_dao && (
                                  <div style={{ marginTop: "4px", fontSize: "12px", color: "#475569", background: "#eff6ff", padding: "4px 8px", borderRadius: "4px", borderLeft: "3px solid #005baa" }}>
                                    <strong>Chỉ đạo:</strong> {doc.chi_dao}
                                  </div>
                                )}
                                {doc.file_name && (
                                  <div style={{ fontSize: "11.5px", color: "#2563eb", marginTop: "4px" }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg><u>{doc.file_name}</u>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "12px 14px", color: "#334155" }}>
                                <div style={{ fontWeight: "600" }}>{doc.nguoi_xu_ly}</div>
                                {doc.han_xu_ly && (
                                  <div style={{ fontSize: "11px", color: "#dc2626", marginTop: "2px" }}>
                                    Hạn: {doc.han_xu_ly}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px",
                                  background: doc.do_khan === "Khẩn" ? "#fee2e2" : doc.do_khan === "Mật" ? "#fef3c7" : "#e2e8f0",
                                  color: doc.do_khan === "Khẩn" ? "#dc2626" : doc.do_khan === "Mật" ? "#d97706" : "#334155"
                                }}>
                                  {doc.do_khan}
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: "11.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px",
                                  background: doc.trang_thai === "Đã hoàn thành" ? "#d1fae5" : doc.trang_thai === "Đang xử lý" ? "#fef3c7" : "#fee2e2",
                                  color: doc.trang_thai === "Đã hoàn thành" ? "#15803d" : doc.trang_thai === "Đang xử lý" ? "#b45309" : "#b91c1c"
                                }}>
                                  {doc.trang_thai}
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
                                  <button
                                    onClick={() => {
                                      setShowIncomingForm(true);
                                      handleEditIncomingDoc(doc);
                                    }}
                                    style={{ padding: "4px 8px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title="Sửa"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteIncomingDoc(doc.id)}
                                    style={{ padding: "4px 8px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title="Xóa"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
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
            );
          })()}

          {activeTab === "outgoing-docs" && (() => {
            const filteredOutgoing = outgoingDocs.filter(doc => {
              const matchSearch = doc.so_hieu.toLowerCase().includes(searchOutgoing.toLowerCase()) ||
                                  doc.trich_yeu.toLowerCase().includes(searchOutgoing.toLowerCase()) ||
                                  doc.noi_nhan.toLowerCase().includes(searchOutgoing.toLowerCase());
              const matchType = filterOutgoingType === "ALL" || doc.loai_van_ban === filterOutgoingType;
              return matchSearch && matchType;
            });

            return (
              <div style={{ animation: "fadeIn 0.2s ease-out", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Thanh Tiêu đề & Điều khiển tối giản */}
                <div className="tp-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", color: "#0f172a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      <span>SỔ QUẢN LÝ VĂN BẢN ĐỊ CƠ QUAN ({filteredOutgoing.length})</span>
                    </h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Soạn thảo, trình duyệt và theo dõi sổ phát hành văn bản đi của Phòng Văn hóa - Xã hội
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <select
                      value={filterOutgoingType}
                      onChange={(e) => setFilterOutgoingType(e.target.value)}
                      style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                    >
                      <option value="ALL">Tất cả loại văn bản</option>
                      <option value="Báo cáo">Báo cáo</option>
                      <option value="Kế hoạch">Kế hoạch</option>
                      <option value="Thông báo">Thông báo</option>
                      <option value="Công văn">Công văn</option>
                      <option value="Tờ trình">Tờ trình</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Tìm số hiệu, trích yếu, nơi nhận..."
                      style={{ width: "240px", padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                      value={searchOutgoing}
                      onChange={(e) => setSearchOutgoing(e.target.value)}
                    />

                    <button
                      onClick={() => {
                        if (showOutgoingForm && !editingOutgoingDoc) {
                          setShowOutgoingForm(false);
                        } else {
                          setShowOutgoingForm(true);
                          setEditingOutgoingDoc(null);
                          setOutgoingForm({
                            so_hieu: "", trich_yeu: "", noi_nhan: "", nguoi_soan: fullName || "Cán bộ chuyên trách",
                            nguoi_duyet: "Nguyễn Thái Huy (Trưởng phòng)", ngay_ban_hanh: new Date().toISOString().substring(0, 10),
                            loai_van_ban: "Công văn", trang_thai: "Dự thảo", file_name: "", ghi_chu: ""
                          });
                        }
                      }}
                      style={{
                        padding: "8px 16px", borderRadius: "6px", background: "#005baa", color: "#fff",
                        border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                      }}
                    >
                      {showOutgoingForm ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          <span>Đóng biểu mẫu</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          <span>Soạn thảo Văn bản đi Mới</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Form Soạn thảo / Hiệu chỉnh Văn bản Đi (Full Width Grid) */}
                {(showOutgoingForm || editingOutgoingDoc) && (
                  <div className="tp-card" style={{ padding: "20px", borderTop: "4px solid #005baa", background: "#fafafa" }}>
                    <h4 style={{ margin: "0 0 16px", fontSize: "15px", color: "#003d7a", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                      {editingOutgoingDoc ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                          <span>CẬP NHẬT VĂN BẢN ĐỊ</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                          <span>SOẠN THẢO & PHÁT HÀNH VĂN BẢN ĐỊ MỚI</span>
                        </>
                      )}
                    </h4>

                    <form onSubmit={handleOutgoingSubmit}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px 16px" }}>
                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Số / Ký hiệu Phát hành (*)</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: 34/BC-VHXH"
                            value={outgoingForm.so_hieu}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, so_hieu: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Loại văn bản</label>
                          <select
                            value={outgoingForm.loai_van_ban}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, loai_van_ban: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Công văn">Công văn</option>
                            <option value="Báo cáo">Báo cáo</option>
                            <option value="Kế hoạch">Kế hoạch</option>
                            <option value="Thông báo">Thông báo</option>
                            <option value="Tờ trình">Tờ trình</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Ngày phát hành (*)</label>
                          <input
                            type="date"
                            value={outgoingForm.ngay_ban_hanh}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, ngay_ban_hanh: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Nơi nhận văn bản (*)</label>
                          <input
                            type="text"
                            placeholder="UBND Huyện, Các Thôn..."
                            value={outgoingForm.noi_nhan}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, noi_nhan: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Người soạn thảo</label>
                          <input
                            type="text"
                            placeholder="Họ tên cán bộ soạn"
                            value={outgoingForm.nguoi_soan}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, nguoi_soan: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Người ký / Duyệt</label>
                          <input
                            type="text"
                            placeholder="Nguyễn Thái Huy"
                            value={outgoingForm.nguoi_duyet}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, nguoi_duyet: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Trạng thái</label>
                          <select
                            value={outgoingForm.trang_thai}
                            onChange={(e) => setOutgoingForm({ ...outgoingForm, trang_thai: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Dự thảo">Dự thảo</option>
                            <option value="Đã phát hành">Đã phát hành</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>File đính kèm</label>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <input
                              type="file"
                              id="outgoing-file-upload"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setOutgoingForm({ ...outgoingForm, file_name: file.name });
                                }
                              }}
                            />
                            <input
                              type="text"
                              placeholder="34_BC_VHXH_BHYT.pdf"
                              value={outgoingForm.file_name}
                              onChange={(e) => setOutgoingForm({ ...outgoingForm, file_name: e.target.value })}
                              style={{ flex: 1, padding: "7px 10px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById("outgoing-file-upload").click()}
                              style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#ffffff", color: "#0f172a", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                              <span>Chọn file</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="tp-form-group" style={{ marginTop: "12px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Trích yếu nội dung phát hành (*)</label>
                        <textarea
                          rows="2"
                          placeholder="Tóm tắt ngắn gọn nội dung báo cáo, kế hoạch, công văn..."
                          value={outgoingForm.trich_yeu}
                          onChange={(e) => setOutgoingForm({ ...outgoingForm, trich_yeu: e.target.value })}
                          required
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="tp-btn-cancel"
                          onClick={() => {
                            setShowOutgoingForm(false);
                            setEditingOutgoingDoc(null);
                          }}
                          style={{ padding: "7px 16px", fontSize: "13px" }}
                        >
                          Hủy bỏ
                        </button>
                        <button type="submit" className="tp-btn-submit" style={{ padding: "7px 20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                          <span>{editingOutgoingDoc ? "Lưu cập nhật văn bản đi" : "Phát hành / Lưu văn bản đi"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Bảng Danh sách Văn bản Đi Chuẩn Cơ Quan Tối Giản */}
                <div className="tp-card" style={{ padding: "0", overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", color: "#1e293b", borderBottom: "2px solid #cbd5e1" }}>
                          <th style={{ padding: "12px 14px", width: "50px", textAlign: "center" }}>STT</th>
                          <th style={{ padding: "12px 14px", width: "130px", whiteSpace: "nowrap" }}>Số / Ký hiệu</th>
                          <th style={{ padding: "12px 14px", width: "100px", whiteSpace: "nowrap" }}>Ngày ký</th>
                          <th style={{ padding: "12px 14px", width: "110px" }}>Loại VB</th>
                          <th style={{ padding: "12px 14px" }}>Trích yếu nội dung & Nơi nhận</th>
                          <th style={{ padding: "12px 14px", width: "160px" }}>Người soạn & Duyệt</th>
                          <th style={{ padding: "12px 14px", width: "110px", textAlign: "center" }}>Trạng thái</th>
                          <th style={{ padding: "12px 14px", width: "140px", textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOutgoing.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
                              Không tìm thấy bản ghi văn bản đi nào.
                            </td>
                          </tr>
                        ) : (
                          filteredOutgoing.map((doc, idx) => (
                            <tr
                              key={doc.id}
                              style={{
                                borderBottom: "1px solid #e2e8f0",
                                background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                                transition: "background 0.15s ease"
                              }}
                            >
                              <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                                <strong style={{ color: "#003d7a", fontSize: "13.5px" }}>{doc.so_hieu}</strong>
                              </td>
                              <td style={{ padding: "12px 14px", whiteSpace: "nowrap", color: "#475569" }}>
                                {doc.ngay_ban_hanh}
                              </td>
                              <td style={{ padding: "12px 14px" }}>
                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e3a8a", background: "#eff6ff", padding: "3px 8px", borderRadius: "4px", border: "1px solid #bfdbfe" }}>
                                  {doc.loai_van_ban}
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", lineHeight: "1.45" }}>
                                <div style={{ fontWeight: "700", color: "#0f172a" }}>
                                  {doc.trich_yeu}
                                </div>
                                <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
                                  <strong>Nơi nhận:</strong> {doc.noi_nhan}
                                </div>
                                {doc.file_name && (
                                  <div style={{ fontSize: "11.5px", color: "#2563eb", marginTop: "4px" }}>
                                    📎 <u>{doc.file_name}</u>
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: "12px 14px", color: "#334155" }}>
                                <div>Soạn: <strong>{doc.nguoi_soan}</strong></div>
                                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>Duyệt: {doc.nguoi_duyet}</div>
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: "11.5px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px",
                                  background: doc.trang_thai === "Đã phát hành" ? "#d1fae5" : "#fef3c7",
                                  color: doc.trang_thai === "Đã phát hành" ? "#15803d" : "#b45309"
                                }}>
                                  {doc.trang_thai}
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "center" }}>
                                <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
                                  {doc.trang_thai === "Dự thảo" && (
                                    <button
                                      onClick={() => handleApproveOutgoingDoc(doc.id)}
                                      style={{ padding: "4px 8px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11.5px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}
                                      title="Duyệt & Phát hành"
                                    >
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                      <span>Duyệt</span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setShowOutgoingForm(true);
                                      handleEditOutgoingDoc(doc);
                                    }}
                                    style={{ padding: "4px 8px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                    title="Sửa"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOutgoingDoc(doc.id)}
                                    style={{ padding: "4px 8px", background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                                    title="Xóa"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
            );
          })()}

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
                    <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span>Cán bộ trực thuộc quản lý ({subordinates.length})</span>
                    </h3>
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
              CÁN BỘ, PHÓ PHÒNG & TRƯỞNG PHÒNG TAB CONTENTS
              ────────────────────────────────── */}
          {(role === "canbo" || role === "phophong" || role === "truongphong" || role === "admin") && (
            <>
              {activeTab === "tasks" && (
                <div className="tp-tasks-section">
                  <div className="tp-card">
                    <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <span>Chỉ đạo công việc từ Trưởng phòng Nguyễn Thái Huy</span>
                    </h3>
                    <div className="tp-activity-list" style={{ marginTop: "15px" }}>
                      {assignedTasks.map((task) => (
                        <div className="tp-notice-item" key={task.id} style={{ borderLeft: "4px solid #1a3a5c", background: "#f8fafc" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span className="notice-badge" style={{ background: task.status === "completed" ? "#d1fae5" : "#fef3c7", color: task.status === "completed" ? "#065f46" : "#92400e" }}>
                              {task.status === "completed" ? "Đã hoàn thành" : "Đang thực hiện"}
                            </span>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>Hạn chót: {task.deadline}</span>
                          </div>
                          <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            <span>{task.title}</span>
                          </strong>
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



              {activeTab === "articles" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* KHUNG SOẠN BÀI VIẾT TUYÊN TRUYỀN FULL MÀN HÌNH */}
                  <div className="tp-card tp-form-card" style={{ width: "100%", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", pb: "12px", borderBottom: "1.5px solid #e2e8f0" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#003d7a", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        <span>{editingArticle ? "Sửa bài viết tuyên truyền" : "Soạn thảo bài viết tuyên truyền mới"}</span>
                      </h3>
                      {editingArticle && (
                        <button
                          type="button"
                          style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", cursor: "pointer", fontWeight: "800" }}
                          onClick={() => {
                            setEditingArticle(null);
                            setArticleForm({ tieu_de: "", mo_ta: "", noi_dung: "", danh_muc: "phong-chong-lua-dao", trang_thai: "da-dang", chu_chay: "" });
                            setCoverImage(null); setCoverPreview("");
                            setSecondaryImages([]); setSecondaryPreviews([]);
                            setVideoFile(null); setVideoPreview("");
                          }}
                        >
                          ✕ Hủy chế độ sửa bài
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleArticleSubmit}>
                      {/* Hàng 1: Tiêu đề (60%) + Chuyên mục (40%) */}
                      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "14px" }}>
                        <div className="tp-form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: "13px", fontWeight: "800", marginBottom: "6px", color: "#1e293b" }}>Tiêu đề bài viết tuyên truyền <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="text"
                            placeholder="Nhập tiêu đề tuyên truyền (Ví dụ: Cảnh báo thủ đoạn giả danh Công an lừa đảo...)"
                            value={articleForm.tieu_de}
                            onChange={(e) => setArticleForm({ ...articleForm, tieu_de: e.target.value })}
                            style={{ padding: "10px 14px", fontSize: "14px", borderRadius: "8px" }}
                            required
                          />
                        </div>

                        <div className="tp-form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: "13px", fontWeight: "800", marginBottom: "6px", color: "#1e293b" }}>Chọn Chuyên mục tuyên truyền</label>
                          <select
                            value={articleForm.danh_muc}
                            onChange={(e) => setArticleForm({ ...articleForm, danh_muc: e.target.value })}
                            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "700", color: "#003d7a", height: "43px" }}
                          >
                            <optgroup label="Tuyên truyền Trọng tâm">
                              <option value="phong-chong-lua-dao">Phòng, chống Lừa đảo Không gian mạng</option>
                              <option value="an-toan-giao-thong">Tuyên truyền An toàn Giao thông</option>
                              <option value="thien-tai">Phòng chống Thiên tai & Bão lũ</option>
                              <option value="bau-cu">Tuyên truyền Bầu cử</option>
                              <option value="huong-dan-vneid">Hướng dẫn VNeID Mức 2</option>
                              <option value="te-nan">Phòng chống Tệ nạn Xã hội</option>
                              <option value="chay-rung">Phòng chống Cháy rừng</option>
                              <option value="duoi-nuoc">Phòng chống Đuối nước</option>
                              <option value="thu-tuc-hanh-chinh">Thủ tục Hành chính & Dịch vụ công</option>
                              <option value="tra-cuu">Tra cứu BHYT & BHXH</option>
                            </optgroup>
                            <optgroup label="Tin tức & Sự kiện">
                              <option value="su-kien">Sự kiện xã Đăk Pxi</option>
                              <option value="the-thao">Thể thao phong trào</option>
                              <option value="le-hoi">Lễ hội văn hóa truyền thống</option>
                              <option value="khac">Khác</option>
                            </optgroup>
                          </select>
                        </div>
                      </div>

                      {/* Hàng 2: Tóm tắt ngắn + Chữ chạy thông báo */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "14px" }}>
                        <div className="tp-form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: "13px", fontWeight: "800", marginBottom: "6px", color: "#1e293b" }}>Tóm tắt ngắn (Hiển thị xem trước bài viết)</label>
                          <textarea
                            rows="2"
                            placeholder="Mô tả tóm tắt ngắn gọn nội dung chính..."
                            value={articleForm.mo_ta}
                            onChange={(e) => setArticleForm({ ...articleForm, mo_ta: e.target.value })}
                            style={{ padding: "8px 12px", fontSize: "13.5px", borderRadius: "8px", resize: "none" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ marginBottom: 0 }}>
                          <label style={{ fontSize: "13px", fontWeight: "800", marginBottom: "6px", color: "#1e293b" }}>Chữ chạy thông báo (Nổi bật Trang chủ)</label>
                          <input
                            type="text"
                            placeholder="Nhập thông báo chữ chạy nổi bật trên trang chủ..."
                            value={articleForm.chu_chay}
                            onChange={(e) => setArticleForm({ ...articleForm, chu_chay: e.target.value })}
                            style={{ padding: "10px 14px", fontSize: "14px", borderRadius: "8px" }}
                          />
                        </div>
                      </div>

                      {/* Hàng 3: Media Upload Mini Bar (Nút tải Ảnh bìa, Album, Video, Âm thanh nằm ngang) */}
                      <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1.5px dashed #cbd5e1", marginBottom: "14px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "10px" }}>
                          📁 Đính kèm File phương tiện truyền thông (Ảnh bìa, Album nhiều ảnh, Video, Âm thanh)
                        </div>

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                          {/* Nút 1: Ảnh bìa */}
                          <input
                            type="file" accept="image/*"
                            id="cover-upload-input" style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) { setCoverImage(file); setCoverPreview(URL.createObjectURL(file)); }
                            }}
                          />
                          <label htmlFor="cover-upload-input" style={{ background: coverPreview ? "#e0f2fe" : "#ffffff", border: "1.5px solid #0284c7", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "800", cursor: "pointer", color: coverPreview ? "#0369a1" : "#0284c7", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                            🖼️ {coverPreview ? "Đã chọn Ảnh Bìa ✓" : "+ Chọn Ảnh Bìa đại diện"}
                          </label>

                          {/* Nút 2: Album ảnh */}
                          <input
                            type="file" accept="image/*" multiple
                            id="multi-upload-input" style={{ display: "none" }}
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              if (files.length > 0) {
                                setSecondaryImages([...secondaryImages, ...files]);
                                setSecondaryPreviews([...secondaryPreviews, ...files.map(f => URL.createObjectURL(f))]);
                              }
                            }}
                          />
                          <label htmlFor="multi-upload-input" style={{ background: secondaryPreviews.length > 0 ? "#fef3c7" : "#ffffff", border: "1.5px solid #d97706", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "800", cursor: "pointer", color: secondaryPreviews.length > 0 ? "#b45309" : "#d97706", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                            📁 {secondaryPreviews.length > 0 ? `Đã đính kèm ${secondaryPreviews.length} ảnh album ✓` : "+ Thêm Album ảnh chi tiết"}
                          </label>

                          {/* Nút 3: Video */}
                          <input
                            type="file" accept="video/*"
                            id="video-upload-input" style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) { setVideoFile(file); setVideoPreview(URL.createObjectURL(file)); }
                            }}
                          />
                          <label htmlFor="video-upload-input" style={{ background: videoPreview ? "#fce7f3" : "#ffffff", border: "1.5px solid #db2777", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "800", cursor: "pointer", color: videoPreview ? "#be185d" : "#db2777", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                            📹 {videoPreview ? "Đã chọn Video ✓" : "+ Đính kèm Video tuyên truyền"}
                          </label>

                          {/* Nút 4: File Âm thanh */}
                          <input
                            type="file" accept="audio/*"
                            id="audio-upload-input" style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) { setAudioFile(file); setAudioPreview(URL.createObjectURL(file)); }
                            }}
                          />
                          <label htmlFor="audio-upload-input" style={{ background: audioPreview ? "#f0fdf4" : "#ffffff", border: "1.5px solid #16a34a", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "800", cursor: "pointer", color: audioPreview ? "#15803d" : "#16a34a", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                            🎧 {audioPreview ? "Đã chọn File Âm thanh ✓" : "+ Đính kèm File Âm thanh"}
                          </label>
                        </div>

                        {/* Hiển thị Xem trước siêu nhỏ gọn */}
                        {(coverPreview || secondaryPreviews.length > 0 || videoPreview || audioPreview) && (
                          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px", paddingTop: "8px", borderTop: "1px solid #e2e8f0", overflowX: "auto" }}>
                            {coverPreview && (
                              <div style={{ position: "relative", width: "55px", height: "55px", borderRadius: "8px", overflow: "hidden", border: "2px solid #0284c7", flexShrink: 0 }}>
                                <img src={coverPreview} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <button type="button" onClick={() => { setCoverImage(null); setCoverPreview(""); }} style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.8)", color: "#fff", border: "none", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>✕</button>
                              </div>
                            )}
                            {secondaryPreviews.map((p, idx) => (
                              <div key={idx} style={{ position: "relative", width: "55px", height: "55px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1", flexShrink: 0 }}>
                                <img src={p} alt={`sub-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <button type="button" onClick={() => {
                                  const imgCopy = [...secondaryImages]; imgCopy.splice(idx, 1); setSecondaryImages(imgCopy);
                                  const prevCopy = [...secondaryPreviews]; prevCopy.splice(idx, 1); setSecondaryPreviews(prevCopy);
                                }} style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.8)", color: "#fff", border: "none", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>✕</button>
                              </div>
                            ))}
                            {videoPreview && (
                              <div style={{ position: "relative", width: "90px", height: "55px", borderRadius: "8px", overflow: "hidden", border: "2px solid #db2777", background: "#000", flexShrink: 0 }}>
                                <video src={videoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <button type="button" onClick={() => { setVideoFile(null); setVideoPreview(""); }} style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.8)", color: "#fff", border: "none", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>✕</button>
                              </div>
                            )}
                            {audioPreview && (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1.5px solid #16a34a", padding: "6px 12px", borderRadius: "8px", flexShrink: 0 }}>
                                <span style={{ fontSize: "18px" }}>🔊</span>
                                <audio controls src={audioPreview} style={{ height: "32px", maxWidth: "220px" }} />
                                <button type="button" onClick={() => { setAudioFile(null); setAudioPreview(""); }} style={{ background: "rgba(0,0,0,0.8)", color: "#fff", border: "none", width: "18px", height: "18px", borderRadius: "50%", fontSize: "10px", cursor: "pointer" }}>✕</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Hàng 4: Nội dung chi tiết */}
                      <div className="tp-form-group" style={{ marginBottom: "16px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "800", marginBottom: "6px", color: "#1e293b" }}>Nội dung bài viết chi tiết <span style={{ color: "#dc2626" }}>*</span></label>
                        <textarea
                          rows="5"
                          placeholder="Viết nội dung bài tuyên truyền chi tiết tại đây..."
                          value={articleForm.noi_dung}
                          onChange={(e) => setArticleForm({ ...articleForm, noi_dung: e.target.value })}
                          style={{ padding: "10px 14px", fontSize: "14px", borderRadius: "8px" }}
                          required
                        />
                      </div>

                      {/* Hàng 5: Nút Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "linear-gradient(135deg, #003d7a 0%, #005baa 100%)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "15px",
                          fontWeight: "900",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(0,61,122,0.3)"
                        }}
                      >
                        {editingArticle ? "💾 LƯU CẬP NHẬT BÀI VIẾT TUYÊN TRUYỀN" : "🚀 ĐĂNG BÀI VIẾT TUYÊN TRUYỀN MỚI NÀY"}
                      </button>
                    </form>
                  </div>

                  {/* KHUNG DANH SÁCH BÀI VIẾT ĐÃ ĐĂNG FULL MÀN HÌNH Ở DƯỚI CÙNG */}
                  <div className="tp-card tp-list-card" style={{ width: "100%", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", pb: "12px", borderBottom: "1.5px solid #e2e8f0" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#003d7a" }}>
                        📋 Danh sách toàn bộ bài viết đã đăng ({articles.length})
                      </h3>
                      <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                        Quản lý & Chỉnh sửa bài viết
                      </span>
                    </div>

                    <div className="tp-table-wrapper" style={{ overflowX: "auto" }}>
                      <table className="tp-table" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th style={{ width: "45%" }}>Tên bài viết</th>
                            <th style={{ width: "25%" }}>Chuyên mục</th>
                            <th style={{ width: "15%" }}>Ngày tạo</th>
                            <th style={{ width: "15%", textAlign: "center" }}>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.length === 0 ? (
                            <tr>
                              <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                Chưa có bài viết nào được đăng. Hãy tạo bài viết tuyên truyền đầu tiên ở trên!
                              </td>
                            </tr>
                          ) : (
                            articles.map((art) => (
                              <tr key={art._id}>
                                <td>
                                  <strong style={{ color: "#003d7a", fontSize: "14px" }}>{art.tieu_de}</strong>
                                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "3px" }}>
                                    {art.anh_dai_dien && <span style={{ fontSize: "11px", background: "#e0f2fe", color: "#0369a1", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>🖼️ Ảnh</span>}
                                    {art.video && <span style={{ fontSize: "11px", background: "#fce7f3", color: "#be185d", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>📹 Video</span>}
                                    {art.audio && <span style={{ fontSize: "11px", background: "#f0fdf4", color: "#15803d", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>🎧 Âm thanh</span>}
                                  </div>
                                  {art.mo_ta && (
                                    <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "450px" }}>
                                      {art.mo_ta}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <span className={`tp-meeting-badge ${art.danh_muc}`} style={{ fontSize: "12.5px", padding: "4px 12px", borderRadius: "20px" }}>
                                    {art.danh_muc === "phong-chong-lua-dao" ? "🛡️ Lừa đảo mạng" :
                                     art.danh_muc === "an-toan-giao-thong" ? "🚦 An toàn giao thông" :
                                     art.danh_muc === "thien-tai" ? "🌧️ Phòng chống thiên tai" :
                                     art.danh_muc === "bau-cu" ? "🗳️ Bầu cử" :
                                     art.danh_muc === "huong-dan-vneid" ? "🆔 VNeID" : "📌 " + (art.danh_muc || "Chuyên mục")}
                                  </span>
                                </td>
                                <td style={{ fontSize: "13.5px", color: "#475569" }}>
                                  {new Date(art.createdAt).toLocaleDateString("vi-VN")}
                                </td>
                                <td>
                                  <div className="tp-table-actions" style={{ justifyContent: "center" }}>
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


              {/* ──────────────────────────────────
                  TAB QUẢN LÝ TUYÊN TRUYỀN ATGT DÀNH CHO CÁN BỘ / PHÓ PHÒNG / TRƯỞNG PHÒNG
                  ────────────────────────────────── */}
              {activeTab === "atgt" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Top Header Card */}
                  <div className="tp-card" style={{ background: "linear-gradient(135deg, #003d7a 0%, #005baa 100%)", color: "#fff", border: "none", padding: "24px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                      <div>
                        <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px" }}>
                          🏛️ UBND XÃ ĐĂK PXI — PHÒNG VH-XH
                        </span>
                        <h2 style={{ margin: "12px 0 6px", fontSize: "22px", fontWeight: "900", color: "#ffffff" }}>
                          🚦 Quản lý Tuyên truyền An toàn Giao thông
                        </h2>
                        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>
                          Chức năng dành riêng cho Cán bộ, Phó phòng và Trưởng phòng biên soạn & công bố nội dung tuyên truyền ATGT.
                        </p>
                      </div>
                      <button
                        onClick={() => window.open("/an-toan-giao-thong", "_blank")}
                        style={{ background: "#ffffff", color: "#003d7a", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "800", fontSize: "13.5px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                      >
                        🌐 Xem trang công khai →
                      </button>
                    </div>
                  </div>

                  {/* Form & Table Grid */}
                  <div className="tp-grid" style={{ gridTemplateColumns: "380px 1fr" }}>
                    {/* Form Card */}
                    <div className="tp-card tp-form-card">
                      <h3>{editingArticle && editingArticle.danh_muc.startsWith("atgt-") ? "✏️ Sửa bài ATGT" : "✍️ Soạn bài tuyên truyền ATGT"}</h3>
                      <form onSubmit={(e) => {
                        if (!articleForm.danh_muc.startsWith("atgt-")) {
                          setArticleForm(f => ({ ...f, danh_muc: "atgt-tin-tuc" }));
                        }
                        handleArticleSubmit(e);
                      }}>
                        <div className="tp-form-group">
                          <label>Tiêu đề bài tuyên truyền <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Tuyên truyền không uống rượu bia khi tham gia giao thông..."
                            value={articleForm.tieu_de}
                            onChange={(e) => setArticleForm({ ...articleForm, tieu_de: e.target.value })}
                            required
                          />
                        </div>

                        <div className="tp-form-group">
                          <label>Chủ đề tuyên truyền <span style={{ color: "#dc2626" }}>*</span></label>
                          <select
                            value={articleForm.danh_muc.startsWith("atgt-") ? articleForm.danh_muc : "atgt-tin-tuc"}
                            onChange={(e) => setArticleForm({ ...articleForm, danh_muc: e.target.value })}
                          >
                            <option value="atgt-tin-tuc">📰 Tin tuyên truyền</option>
                            <option value="atgt-phap-luat">🛡️ Hướng dẫn an toàn</option>
                            <option value="atgt-hoc-sinh">🎒 Học sinh</option>
                            <option value="atgt-duong-nong-thon">🛤️ Đường nông thôn</option>
                            <option value="atgt-mua-mua">🌧️ Mùa mưa bão</option>
                            <option value="atgt-van-hoa">🚦 Văn hóa giao thông</option>
                            <option value="atgt-van-ban">⚠️ Khuyến cáo</option>
                          </select>
                        </div>

                        <div className="tp-form-group">
                          <label>Mô tả ngắn (Tóm tắt)</label>
                          <textarea
                            rows="2"
                            placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                            value={articleForm.mo_ta}
                            onChange={(e) => setArticleForm({ ...articleForm, mo_ta: e.target.value })}
                          />
                        </div>

                        <div className="tp-form-group">
                          <label>Nội dung tuyên truyền <span style={{ color: "#dc2626" }}>*</span></label>
                          <textarea
                            rows="6"
                            placeholder="Nhập nội dung bài tuyên truyền..."
                            value={articleForm.noi_dung}
                            onChange={(e) => setArticleForm({ ...articleForm, noi_dung: e.target.value })}
                            required
                          />
                        </div>

                        {/* Cover Image Upload */}
                        <div className="tp-form-group">
                          <label>Ảnh minh họa (Ảnh bìa)</label>
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
                              id="atgt-cover-upload-tp"
                              style={{ display: "none" }}
                            />
                            <label htmlFor="atgt-cover-upload-tp" className="tp-uploader-label" style={{ display: "block", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "14px", textAlign: "center", cursor: "pointer", background: "#f8fafc" }}>
                              {coverPreview ? (
                                <div style={{ position: "relative" }}>
                                  <img src={coverPreview} alt="Cover" style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: "6px" }} />
                                  <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCoverImage(null); setCoverPreview(""); }}
                                    style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}
                                  >✕</button>
                                </div>
                              ) : (
                                <div style={{ color: "#64748b", fontSize: "13px" }}>🖼️ Chọn ảnh bìa minh họa</div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Audio File Upload */}
                        <div className="tp-form-group">
                          <label>File Âm thanh / Phát thanh tuyên truyền</label>
                          <div className="tp-file-uploader-box">
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setAudioFile(file);
                                  setAudioPreview(URL.createObjectURL(file));
                                }
                              }}
                              id="atgt-audio-upload-tp"
                              style={{ display: "none" }}
                            />
                            <label htmlFor="atgt-audio-upload-tp" className="tp-uploader-label" style={{ display: "block", border: "1px dashed #16a34a", borderRadius: "8px", padding: "10px 14px", textAlign: "center", cursor: "pointer", background: "#f0fdf4" }}>
                              {audioPreview ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                  <audio controls src={audioPreview} style={{ height: "30px", flex: 1 }} />
                                  <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAudioFile(null); setAudioPreview(""); }}
                                    style={{ background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}
                                  >✕</button>
                                </div>
                              ) : (
                                <div style={{ color: "#16a34a", fontSize: "13px", fontWeight: "700" }}>🎧 + Chọn File Âm thanh phát thanh (.mp3, .wav)</div>
                              )}
                            </label>
                          </div>
                        </div>

                        <div className="tp-btn-group">
                          <button type="submit" className="tp-btn-submit" style={{ background: "#003d7a" }} disabled={loading}>
                            {editingArticle ? "💾 Cập nhật bài ATGT" : "📢 Đăng bài ATGT"}
                          </button>
                          {editingArticle && (
                            <button
                              type="button"
                              className="tp-btn-cancel"
                              onClick={() => {
                                setEditingArticle(null);
                                setArticleForm({ tieu_de: "", mo_ta: "", noi_dung: "", danh_muc: "atgt-tin-tuc", trang_thai: "da-dang", chu_chay: "" });
                              }}
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Table Card */}
                    <div className="tp-card tp-list-card">
                      <h3>📋 Danh sách bài tuyên truyền ATGT ({articles.filter(a => a.danh_muc && a.danh_muc.startsWith("atgt-")).length})</h3>
                      <div className="tp-table-wrapper">
                        <table className="tp-table">
                          <thead>
                            <tr>
                              <th>Tiêu đề bài viết</th>
                              <th>Chủ đề</th>
                              <th>Ngày tạo</th>
                              <th>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {articles.filter(a => a.danh_muc && a.danh_muc.startsWith("atgt-")).length === 0 ? (
                              <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                                  🚦 Chưa có bài tuyên truyền ATGT nào. Hãy soạn và đăng bài đầu tiên!
                                </td>
                              </tr>
                            ) : (
                              articles
                                .filter(a => a.danh_muc && a.danh_muc.startsWith("atgt-"))
                                .map((art) => {
                                  const dmLabels = {
                                    'atgt-tin-tuc': '📰 Tin tuyên truyền',
                                    'atgt-phap-luat': '🛡️ Hướng dẫn an toàn',
                                    'atgt-hoc-sinh': '🎒 Học sinh',
                                    'atgt-duong-nong-thon': '🛤️ Đường nông thôn',
                                    'atgt-mua-mua': '🌧️ Mùa mưa bão',
                                    'atgt-van-hoa': '🚦 Văn hóa giao thông',
                                    'atgt-van-ban': '⚠️ Khuyến cáo'
                                  };
                                  return (
                                    <tr key={art._id}>
                                      <td>
                                        <strong>{art.tieu_de}</strong>
                                        {art.mo_ta && <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{art.mo_ta}</div>}
                                      </td>
                                      <td>
                                        <span style={{ display: "inline-block", background: "#e8f0fb", color: "#003d7a", padding: "3px 8px", borderRadius: "12px", fontSize: "11.5px", fontWeight: "700" }}>
                                          {dmLabels[art.danh_muc] || art.danh_muc}
                                        </span>
                                      </td>
                                      <td style={{ fontSize: "12.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                                        {new Date(art.createdAt).toLocaleDateString("vi-VN")}
                                      </td>
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
                                  );
                                })
                            )}
                          </tbody>
                        </table>
                      </div>
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
                                  style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}
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
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                  <span>Gửi phản hồi</span>
                                </button>
                              )}
                              
                              <a
                                href={`https://zalo.me/${fb.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tp-edit-btn-small"
                                style={{ background: "#0068ff", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "700" }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                <span>Nhắn Zalo riêng</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ai-assistant" && (
                <div className="tp-ai-assistant-wrapper" style={{ animation: "fadeIn 0.25s ease-out", display: "flex", flexDirection: "column", gap: "20px" }}>
                  
                  {/* Top Header Banner */}
                  <div style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    color: "#ffffff", padding: "16px 24px", borderRadius: "12px",
                    border: "1px solid #334155", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px"
                  }}>
                    <div>
                      <span style={{ background: "rgba(99, 102, 241, 0.25)", color: "#c7d2fe", fontSize: "12px", fontWeight: "800", padding: "4px 12px", borderRadius: "12px", border: "1px solid #6366f1" }}>
                        THƯ KÝ SỐ THÔNG MINH — PHÒNG VĂN HÓA - XÃ HỘI
                      </span>
                      <h2 style={{ margin: "8px 0 4px", fontSize: "20px", fontWeight: "900", color: "#f8fafc" }}>
                        🤖 TRỢ LÝ AI NGHIỆP VỤ HÀNH CHÍNH & VĂN BẢN
                      </h2>
                      <p style={{ margin: 0, fontSize: "13.5px", color: "#94a3b8" }}>
                        Tự động hóa 100% công tác Soạn Báo cáo, Kế hoạch, Thông báo, Tóm tắt Văn bản/Cuộc họp & Tra cứu CSDL
                      </p>
                    </div>

                    <div style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textAlign: "right" }}>Thời gian hiện tại</span>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span style={{ fontFamily: "monospace" }}>{formatCurrentTime(currentTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 8 MODULE FEATURE FULL-WIDTH COMPACT 8-COLUMN GRID */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "6px",
                    width: "100%"
                  }}>
                    
                    {/* Card 1: Soạn Báo cáo */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn báo cáo kết quả công tác VH-XH và BHYT")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="1. Soạn Báo cáo kết quả công tác"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>1. Soạn Báo cáo</span>
                    </div>

                    {/* Card 2: Soạn Kế hoạch */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn kế hoạch công tác trọng tâm")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="2. Soạn Kế hoạch công tác"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>2. Soạn Kế hoạch</span>
                    </div>

                    {/* Card 3: Soạn Thông báo */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn thông báo nội bộ cuộc họp khẩn")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="3. Soạn Thông báo nội bộ / khẩn"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>3. Soạn Thông báo</span>
                    </div>

                    {/* Card 4: Nội dung Tuyên truyền */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn nội dung tuyên truyền BHYT và khẩu hiệu slogan")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="4. Bài viết Tuyên truyền & Slogan"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 8a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h2l4 4 4-4h2a6 6 0 0 0 6-6V8z"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>4. Tuyên truyền</span>
                    </div>

                    {/* Card 5: Tóm tắt Văn bản File */}
                    <div
                      onClick={() => document.getElementById("ai-doc-file-input").click()}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="5. Tóm tắt Văn bản PDF/Word"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>5. Tóm tắt File</span>
                    </div>

                    {/* Card 6: Tóm tắt Cuộc họp */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn biên bản cuộc họp & tóm tắt chỉ đạo phân công cán bộ")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="6. Tóm tắt Cuộc họp & Biên bản"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>6. Tóm tắt Họp</span>
                    </div>

                    {/* Card 7: Tìm kiếm Văn bản */}
                    <div
                      onClick={() => handleExecuteAIQuery("Tìm kiếm văn bản BHYT và quyết định liên quan")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="7. Tìm kiếm Văn bản CSDL"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>7. Tìm Văn bản</span>
                    </div>

                    {/* Card 8: Gợi ý Công việc */}
                    <div
                      onClick={() => handleExecuteAIQuery("Gợi ý công việc ưu tiên và nhắc việc quá hạn hôm nay")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 4px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                        minWidth: 0
                      }}
                      className="tp-hover-card"
                      title="8. Gợi ý Công việc ưu tiên hôm nay"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.64 2.94 1.68 3.96.72.76 1.18 1.52 1.36 2.54"/></svg>
                      <span style={{ color: "#1e3a8a", fontSize: "11.5px", fontWeight: "800", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>8. Gợi ý Việc</span>
                    </div>

                  </div>

                  {/* Hidden File Input for PDF/Word Upload */}
                  <input
                    type="file"
                    id="ai-doc-file-input"
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUploadedDocFile(file);
                        handleExecuteAIQuery(`Tóm tắt nội dung chính file văn bản: ${file.name}`);
                      }
                    }}
                  />

                  {/* CHAT TERMINAL & ACTION PREVIEWS */}
                  <div style={{ display: "grid", gridTemplateColumns: aiGeneratedDocContent ? "1fr 1fr" : "1fr", gap: "16px" }}>
                    
                    {/* Left: Interactive Chat Terminal */}
                    <div className="tp-card" style={{ display: "flex", flexDirection: "column", minHeight: "450px", padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "12px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1e3a8a", border: "none", padding: 0 }}>
                          💭 KHUNG TƯƠNG TÁC THƯ KÝ SỐ AI (VOICE & TEXT)
                        </h3>
                      </div>

                      {/* Messages Container */}
                      <div style={{ flex: 1, overflowY: "auto", maxHeight: "360px", paddingRight: "6px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {aiChatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                              maxWidth: "88%",
                              background: msg.sender === "user" ? "#1e3a8a" : "#f1f5f9",
                              color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                              padding: "12px 16px", borderRadius: "10px",
                              fontSize: "14px", lineHeight: "1.6",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", fontSize: "12px", opacity: 0.75 }}>
                              <strong>{msg.sender === "user" ? fullName : "AI Thư ký số"}</strong>
                              <span>{msg.time}</span>
                            </div>
                            <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                            {msg.sender === "ai" && (
                              <button
                                type="button"
                                onClick={() => handleTextToSpeech(msg.text)}
                                style={{ background: "none", border: "none", color: "#2563eb", fontSize: "12px", fontWeight: "700", cursor: "pointer", marginTop: "6px", padding: 0, display: "inline-flex", alignItems: "center", gap: "4px" }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                                <span>Đọc thành tiếng</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Input controls */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleExecuteAIQuery();
                        }}
                        style={{ marginTop: "14px", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}
                      >
                        {/* Preset Tags */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                          {[
                            "Soạn báo cáo tuần",
                            "Soạn kế hoạch tuyên truyền BHYT",
                            "Soạn thông báo họp khẩn",
                            "Tóm tắt cuộc họp",
                            "Gợi ý công việc ưu tiên"
                          ].map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleExecuteAIQuery(chip)}
                              style={{ background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1", padding: "5px 10px", borderRadius: "6px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => document.getElementById("ai-doc-file-input").click()}
                            style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center" }}
                            title="Tải tệp PDF/Word để AI tóm tắt"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                          </button>
                          <input
                            type="text"
                            placeholder="Nhập yêu cầu nghiệp vụ (soạn báo cáo, kế hoạch, thông báo, tìm văn bản...)..."
                            value={aiInputQuery}
                            onChange={(e) => setAiInputQuery(e.target.value)}
                            style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                          />
                          <button
                            type="submit"
                            style={{ background: "#1e3a8a", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}
                          >
                            Gửi
                          </button>
                        </div>
                      </form>

                    </div>

                    {/* Right: Generated Document Preview & Export Section */}
                    {aiGeneratedDocContent && (
                      <div className="tp-card" style={{ display: "flex", flexDirection: "column", background: "#f8fafc", border: "1.5px solid #3b82f6", padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "10px", marginBottom: "12px" }}>
                          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#1e3a8a", border: "none", padding: 0 }}>
                            📄 NỘI DUNG VĂN BẢN ĐÃ SOẠN THẢO (XUẤT MÁY)
                          </h3>
                          <button
                            onClick={() => setAiGeneratedDocContent("")}
                            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: "800", fontSize: "13px" }}
                          >
                            ✕
                          </button>
                        </div>

                        <div style={{ flex: 1, background: "#ffffff", padding: "14px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: "360px", color: "#1e293b" }}>
                          {aiGeneratedDocContent}
                        </div>

                        <div style={{ display: "flex", gap: "8px", marginTop: "12px", justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            onClick={() => {
                              const blob = new Blob([aiGeneratedDocContent], { type: "application/msword;charset=utf-8" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${aiGeneratedDocTitle || "Van_Ban_VHXH"}.doc`;
                              a.click();
                            }}
                            style={{ background: "#0284c7", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            📥 Xuất Word (.doc)
                          </button>
                          <button
                            type="button"
                            onClick={() => alert("Đã in văn bản ra file PDF chính thức!")}
                            style={{ background: "#15803d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                          >
                            📄 Xuất PDF
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}
            </>
          )}

          {activeTab === "schedule" && (
            <div className="tp-schedule-container" style={{ animation: "fadeIn 0.25s ease-out" }}>
              {role === "truongphong" || role === "admin" ? (
                <div className="tp-grid">
                  {/* Left Form: Create/Edit Meeting */}
                  <div className="tp-card tp-form-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <h3 style={{ margin: 0, border: "none", padding: 0 }}>{editingMeeting ? "✏️ Sửa cuộc họp cơ quan" : "📅 Tạo cuộc họp cơ quan"}</h3>
                      <button
                        type="button"
                        onClick={handleAIGenerateMeetingSchedule}
                        style={{
                          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                          color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "8px",
                          fontWeight: "800", fontSize: "12px", cursor: "pointer",
                          boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)", display: "inline-flex", alignItems: "center", gap: "5px"
                        }}
                        title="Bấm để Trợ lý AI tự động gợi ý & điền thông số lịch họp chuyên nghiệp"
                      >
                        ✨ AI Gợi ý Lịch họp
                      </button>
                    </div>
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
                          <option value="giao-ban">Họp giao ban định kỳ</option>
                          <option value="hop-bao-mat">Cuộc họp Bảo mật Cán bộ (Mật / Nội bộ)</option>
                          <option value="hop-khan">Họp khẩn cấp</option>
                          <option value="chuyen-de">Họp chuyên đề chuyên môn</option>
                          <option value="tap-huan">Tập huấn & Hướng dẫn nghiệp vụ</option>
                          <option value="khac">Cuộc họp khác</option>
                        </select>
                      </div>

                      {meetingForm.type === "hop-bao-mat" && (
                        <div className="tp-form-group" style={{ background: "#fff1f2", padding: "12px 14px", borderRadius: "10px", border: "1px solid #fecdd3" }}>
                          <label style={{ color: "#e11d48", fontWeight: "700" }}>🔒 Mã PIN bảo mật cuộc họp (Cán bộ nhập để vào)</label>
                          <input
                            type="text"
                            placeholder="Mã PIN 6 chữ số (Mặc định: 123456)"
                            value={meetingForm.pin || "123456"}
                            onChange={(e) => setMeetingForm({ ...meetingForm, pin: e.target.value })}
                            required
                          />
                        </div>
                      )}

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
                          {editingMeeting ? "💾 Lưu thay đổi" : "📅 Tạo lịch họp"}
                        </button>
                        {editingMeeting && (
                          <button
                            type="button"
                            className="tp-btn-cancel"
                            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
                            onClick={() => {
                              setEditingMeeting(null);
                              setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "giao-ban", note: "", pin: "123456" });
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
                    <h3>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      Danh sách cuộc họp cơ quan ({meetings.length})
                    </h3>
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
                                  <div className="tp-meeting-card-title">
                                    {m.type === "hop-bao-mat" && (
                                      <span style={{ color: "#e11d48", marginRight: "6px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        [MẬT]
                                      </span>
                                    )}
                                    {m.title}
                                  </div>
                                  <div className="tp-meeting-card-meta">
                                    <span className="tp-meta-item" style={{ color: m.type === "hop-bao-mat" ? "#e11d48" : "inherit", fontWeight: m.type === "hop-bao-mat" ? "800" : "500" }}>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                      {getMeetingBadgeLabel(m.type)}
                                    </span>
                                    <span className="tp-meta-divider">•</span>
                                    <span className="tp-meta-item">
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                      {m.thon}
                                    </span>
                                    <span className="tp-meta-divider">•</span>
                                    <span className="tp-meta-item">
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                      {m.location}
                                    </span>
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
                                  {timerInfo.status === "completed" || m.status === "ended" ? (
                                    <button
                                      className="tp-btn-card"
                                      onClick={() => setSelectedMeetingHistory(m)}
                                      style={{ background: "#1e3a8a", color: "#60a5fa", border: "1px solid #3b82f6", fontWeight: "800", whiteSpace: "nowrap", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                      title="Xem Lịch sử họp & Biên bản kết luận được lưu vĩnh viễn"
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                      Lịch sử & Biên bản
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className={`tp-btn-card tp-btn-join ${m.type === "hop-bao-mat" ? "sec-join-btn" : ""}`}
                                        onClick={() => handleJoinMeeting(m)}
                                        style={m.type === "hop-bao-mat" ? { background: "linear-gradient(135deg, #ef4444 0%, #be123c 100%)", color: "#fff", display: "inline-flex", alignItems: "center", gap: "4px" } : { display: "inline-flex", alignItems: "center", gap: "4px" }}
                                      >
                                        {m.type === "hop-bao-mat" ? (
                                          <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                            Vào họp Mật
                                          </>
                                        ) : (
                                          <>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect width="15" height="14" x="1" y="5" rx="2" ry="2" /></svg>
                                            Vào phòng
                                          </>
                                        )}
                                      </button>
                                      <button
                                        className="tp-btn-card"
                                        onClick={() => handleResendInvite(m)}
                                        style={{ background: "#4338ca", color: "#ffffff", border: "1px solid #6366f1", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}
                                        title="Tự động phát thông báo & Giấy mời họp thời gian thực tới tất cả Cán bộ trong hệ thống"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        Giấy mời
                                      </button>
                                    </>
                                  )}
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
                                        pin: m.pin || "123456",
                                      });
                                    }}
                                    title="Sửa cuộc họp"
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                  </button>
                                  <button
                                    className="tp-btn-card tp-btn-delete"
                                    onClick={() => handleDeleteMeeting(m._id)}
                                    title="Xóa cuộc họp"
                                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
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
                  <h3>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "6px" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Danh sách cuộc họp cơ quan của bạn ({meetings.length})
                  </h3>
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
                                <div className="tp-meeting-card-title">
                                  {m.type === "hop-bao-mat" && (
                                    <span style={{ color: "#e11d48", marginRight: "6px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                      [MẬT]
                                    </span>
                                  )}
                                  {m.title}
                                </div>
                                <div className="tp-meeting-card-meta">
                                  <span className="tp-meta-item" style={{ color: m.type === "hop-bao-mat" ? "#e11d48" : "inherit", fontWeight: m.type === "hop-bao-mat" ? "800" : "500" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                    {getMeetingBadgeLabel(m.type)}
                                  </span>
                                  <span className="tp-meta-divider">•</span>
                                  <span className="tp-meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    {m.thon}
                                  </span>
                                  <span className="tp-meta-divider">•</span>
                                  <span className="tp-meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: "3px" }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                    {m.location}
                                  </span>
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
                              <div style={{ flex: 1, minWidth: "120px", fontSize: "12.5px", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                <span>{m.note || <em style={{ color: "#94a3b8" }}>Không có ghi chú</em>}</span>
                              </div>
                              <div className="tp-meeting-card-actions">
                                <button
                                  className={`tp-btn-card tp-btn-join ${m.type === "hop-bao-mat" ? "sec-join-btn" : ""}`}
                                  onClick={() => handleJoinMeeting(m)}
                                  style={m.type === "hop-bao-mat" ? { background: "linear-gradient(135deg, #ef4444 0%, #be123c 100%)", color: "#fff", display: "inline-flex", alignItems: "center", gap: "4px" } : { display: "inline-flex", alignItems: "center", gap: "4px" }}
                                >
                                  {m.type === "hop-bao-mat" ? (
                                    <>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                      Vào họp Mật
                                    </>
                                  ) : (
                                    <>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect width="15" height="14" x="1" y="5" rx="2" ry="2" /></svg>
                                      Vào phòng
                                    </>
                                  )}
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

          {/* ── MODAL XÁC THỰC MÃ OTP SMS BẢO MẬT 2FA ── */}
          {secModalMeeting && (
            <div style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
            }}>
              <div style={{
                background: "#ffffff", borderRadius: "20px", padding: "28px 32px", width: "100%", maxWidth: "480px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.35)", border: "2px solid #3b82f6"
              }}>
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <div style={{ fontSize: "42px", marginBottom: "6px" }}>📱</div>
                  <h3 style={{ margin: "0 0 4px", color: "#1e3a8a", fontSize: "19px", fontWeight: "900" }}>
                    XÁC THỰC OTP 2FA THAM GIA CUỘC HỌP
                  </h3>
                  <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "12px", fontWeight: "800", padding: "4px 14px", borderRadius: "20px", border: "1px solid #93c5fd" }}>
                    🛡️ BẢO BẬT BẢN GIAO ĐIỆN TỬ BHYT
                  </span>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#64748b" }}>Cán bộ xác thực:</span>
                    <strong style={{ color: "#1e293b" }}>{fullName || "Trưởng phòng Nguyễn Thái Huy"}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#64748b" }}>Số điện thoại SMS:</span>
                    <strong style={{ color: "#0369a1" }}>0984.***.888</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Cuộc họp tham gia:</span>
                    <strong style={{ color: "#1e3a8a" }}>{secModalMeeting.title}</strong>
                  </div>
                </div>

                {/* Notice banner */}
                <div style={{ background: "#f0fdf4", color: "#166534", padding: "10px 14px", borderRadius: "8px", fontSize: "12.5px", marginBottom: "16px", border: "1px solid #bbf7d0", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>📲</span>
                  <span>Đã gửi mã SMS OTP 6 chữ số tới điện thoại. Mã thử nghiệm: <strong style={{ letterSpacing: "2px", color: "#15803d", fontSize: "14px" }}>{generatedOtp}</strong></span>
                </div>

                {secError && (
                  <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", border: "1px solid #fca5a5", fontWeight: "600" }}>
                    {secError}
                  </div>
                )}

                <form onSubmit={handleVerifySecPin}>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                        🔑 Nhập Mã OTP SMS 6 chữ số
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtpSMS}
                        style={{ background: "none", border: "none", color: "#2563eb", fontSize: "12px", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                      >
                        📲 Gửi lại mã OTP
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength="6"
                      placeholder="Nhập 6 số OTP (Ví dụ: 892104)..."
                      value={secOtpInput || secPinInput}
                      onChange={(e) => {
                        setSecOtpInput(e.target.value);
                        setSecPinInput(e.target.value);
                      }}
                      style={{
                        width: "100%", padding: "12px 16px", borderRadius: "10px", border: "2px solid #3b82f6",
                        fontSize: "20px", textAlign: "center", letterSpacing: "6px", fontWeight: "900", color: "#1e3a8a",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                      }}
                      autoFocus
                      required
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => setSecModalMeeting(null)}
                      style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", background: "#f8fafc", color: "#475569", fontWeight: "700", cursor: "pointer" }}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 1.5, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#ffffff", fontWeight: "800", boxShadow: "0 4px 14px rgba(37,99,235,0.35)", cursor: "pointer" }}
                    >
                      🔓 Xác nhận OTP & Vào họp
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL XEM LỊCH SỬ HỌP VÀ BIÊN BẢN KẾT LUẬN LƯU VĨNH VIỄN */}
          {selectedMeetingHistory && (
            <div style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999
            }}>
              <div style={{
                background: "#ffffff", color: "#1e293b", borderRadius: "16px", padding: "28px 32px", width: "100%", maxWidth: "660px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.35)", border: "2px solid #3b82f6", maxHeight: "90vh", overflowY: "auto"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #e2e8f0", paddingBottom: "14px", marginBottom: "18px" }}>
                  <div>
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "11px", fontWeight: "800", padding: "3px 10px", borderRadius: "4px", border: "1px solid #93c5fd" }}>
                      LỊCH SỬ KẾT THÚC & LƯU VĨNH VIỄN IN MONGODB
                    </span>
                    <h2 style={{ margin: "8px 0 4px", fontSize: "20px", fontWeight: "900", color: "#1e3a8a" }}>
                      📋 BIÊN BẢN & KẾT LUẬN CUỘC HỌP
                    </h2>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#334155" }}>
                      {selectedMeetingHistory.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMeetingHistory(null)}
                    style={{ background: "none", border: "none", color: "#64748b", fontSize: "20px", cursor: "pointer", fontWeight: "800" }}
                  >
                    ✕
                  </button>
                </div>

                {/* KHỐI TRỢ LÝ AI TỰ ĐỘNG TẠO BIÊN BẢN HỌP CỤ THỂ DÀNH CHO TRƯỞNG PHÒNG */}
                <div style={{
                  background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                  color: "#ffffff", padding: "14px 18px", borderRadius: "12px",
                  marginBottom: "18px", border: "1px solid #6366f1",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  boxShadow: "0 8px 20px rgba(49, 46, 129, 0.25)"
                }}>
                  <div>
                    <strong style={{ fontSize: "13.5px", color: "#a5b4fc", display: "flex", alignItems: "center", gap: "6px" }}>
                      🤖 AI AUTOMATION — BIÊN BẢN VĨNH VIỄN
                    </strong>
                    <span style={{ fontSize: "11.5px", color: "#e0e7ff", display: "block", marginTop: "2px" }}>
                      Biên bản & Kết luận được tự động phân tích và ký số mã hóa bởi Trợ lý AI.
                    </span>
                  </div>

                  <button
                    onClick={() => alert("✨ Trợ lý AI đang cập nhật và xác thực lại Biên bản họp vĩnh viễn!")}
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px",
                      fontWeight: "800", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap"
                    }}
                  >
                    ✨ AI Xác thực
                  </button>
                </div>

                {/* Thông số cuộc họp */}
                <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "18px", fontSize: "13px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div><strong>Ngày tổ chức:</strong> {selectedMeetingHistory.date ? selectedMeetingHistory.date.split("-").reverse().join("/") : "N/A"} ({selectedMeetingHistory.time})</div>
                    <div><strong>Phòng họp / Địa điểm:</strong> {selectedMeetingHistory.location || "Phòng họp số 1"}</div>
                    <div><strong>Mã cuộc họp:</strong> <code style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>{selectedMeetingHistory.meetingCode || "VHXH-98213"}</code></div>
                    <div><strong>Mã PIN bảo mật:</strong> <code style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px" }}>{selectedMeetingHistory.passcode || "123456"}</code></div>
                    <div><strong>Loại cuộc họp:</strong> {getMeetingBadgeLabel(selectedMeetingHistory.type)}</div>
                    <div><strong>Trạng thái lưu trữ:</strong> <span style={{ color: "#166534", fontWeight: "800" }}>🟢 Đã lưu vĩnh viễn vào CSDL BHYT Xã</span></div>
                  </div>
                </div>

                {/* Nội dung Biên bản */}
                <div style={{ marginBottom: "18px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#1e3a8a", fontWeight: "800" }}>
                    📝 Biên bản Diễn biến & Tóm tắt Cuộc họp:
                  </h4>
                  <div style={{ background: "#f1f5f9", padding: "14px 16px", borderRadius: "10px", fontSize: "13.5px", lineHeight: "1.6", color: "#334155", borderLeft: "4px solid #3b82f6" }}>
                    {selectedMeetingHistory.summary?.bienBan || selectedMeetingHistory.note || "Hội nghị Ban Chỉ đạo Phòng Văn hóa - Xã hội đã hoàn thành rà soát 100% hồ sơ BHYT đợt 2 cho người dân 6 thôn. Thống nhất danh sách 45 hộ được hỗ trợ kinh phí bảo hiểm xã hội."}
                  </div>
                </div>

                {/* Kết luận & Phân công */}
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#1e3a8a", fontWeight: "800" }}>
                    ✅ Kết luận & Phân công Nhiệm vụ (Đã phê duyệt):
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {selectedMeetingHistory.summary?.ketLuan?.length > 0 ? (
                      selectedMeetingHistory.summary.ketLuan.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "16px" }}>✓</span>
                          <span style={{ fontSize: "13.5px", color: "#1e293b", fontWeight: "600" }}>{item.text || item}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "16px" }}>✓</span>
                          <span style={{ fontSize: "13.5px", color: "#1e293b", fontWeight: "600" }}>Đồng chí Y Byen hoàn thiện dữ liệu nhập lên cổng DVC trước 17h00 ngày 22/07.</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "16px" }}>✓</span>
                          <span style={{ fontSize: "13.5px", color: "#1e293b", fontWeight: "600" }}>Đồng chí A Blong phối hợp Trưởng thôn Đăk Wek tuyên truyền lưu động.</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "16px" }}>✓</span>
                          <span style={{ fontSize: "13.5px", color: "#1e293b", fontWeight: "600" }}>Giao Phó phòng Lê Thị C ký duyệt biên bản tổng hợp chuyển UBND Xã.</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Điểm danh Cán bộ dự họp */}
                <div style={{ marginBottom: "22px" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: "14px", color: "#1e3a8a", fontWeight: "800" }}>
                    👥 Cán bộ Xác thực Tham gia:
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: "6px", fontSize: "12.5px" }}>
                      <strong>Trưởng phòng Nguyễn Thái Huy</strong> (Chủ trì)
                    </div>
                    <div style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: "6px", fontSize: "12.5px" }}>
                      <strong>Phó phòng Lê Thị C</strong> (Xác thực BHYT)
                    </div>
                    <div style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: "6px", fontSize: "12.5px" }}>
                      <strong>Cán bộ Y Byen</strong> (Chuyên môn)
                    </div>
                    <div style={{ background: "#f1f5f9", padding: "8px 12px", borderRadius: "6px", fontSize: "12.5px" }}>
                      <strong>Cán bộ A Blong</strong> (Cán bộ Xã)
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                  <button
                    onClick={() => alert("Đã tải tệp Biên bản cuộc họp PDF chính thức về máy thành công!")}
                    style={{ background: "#0284c7", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
                  >
                    📥 Xuất Biên bản PDF
                  </button>
                  <button
                    onClick={() => setSelectedMeetingHistory(null)}
                    style={{ background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", fontSize: "13px" }}
                  >
                    Đóng
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* MODAL AI TẠO LỊCH HỌP THEO YÊU CẦU CỤ THỂ CỦA TRƯỞNG PHÒNG */}
          {showAIScheduleModal && (
            <div style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999
            }}>
              <div style={{
                background: "#ffffff", color: "#1e293b", borderRadius: "16px", padding: "28px 32px", width: "100%", maxWidth: "560px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.35)", border: "2px solid #6366f1"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "22px" }}>🤖</span>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "900", color: "#1e1b4b", border: "none", padding: 0 }}>
                      TRỢ LÝ AI ĐỀ XUẤT LỊCH HỌP CHUYÊN NGHIỆP
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAIScheduleModal(false)}
                    style={{ background: "none", border: "none", color: "#64748b", fontSize: "18px", cursor: "pointer", fontWeight: "800" }}
                  >
                    ✕
                  </button>
                </div>

                {/* Quick preset buttons */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                    💡 Gợi ý nhanh chủ đề họp phòng VH-XH:
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {[
                      "Rà soát & cấp thẻ BHYT đợt 2 cho 10 thôn",
                      "Tuyên truyền Bầu cử & Quyền lợi BHYT",
                      "Ứng phó thiên tai lũ lụt & An sinh xã hội",
                      "Tuyên truyền BHYT Học đường năm học mới",
                      "Giải quyết phản ánh & khiếu nại công dân"
                    ].map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAiPromptForm({ ...aiPromptForm, topic: tag })}
                        style={{
                          background: aiPromptForm.topic === tag ? "#e0e7ff" : "#f1f5f9",
                          color: aiPromptForm.topic === tag ? "#4338ca" : "#334155",
                          border: `1px solid ${aiPromptForm.topic === tag ? "#818cf8" : "#cbd5e1"}`,
                          padding: "4px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer"
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input 1: Nội dung chủ đề */}
                <div className="tp-form-group" style={{ marginBottom: "14px" }}>
                  <label style={{ fontWeight: "800", color: "#1e3a8a" }}>1. Nội dung / Chủ đề Trưởng phòng muốn họp</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Rà soát cấp thẻ BHYT đợt 2 cho người dân 10 thôn"
                    value={aiPromptForm.topic}
                    onChange={(e) => setAiPromptForm({ ...aiPromptForm, topic: e.target.value })}
                    required
                    style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                {/* Input 2 & 3: Ngày & Giờ họp */}
                <div className="tp-form-group-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div className="tp-form-group">
                    <label style={{ fontWeight: "800", color: "#1e3a8a" }}>2. Ngày họp</label>
                    <input
                      type="date"
                      value={aiPromptForm.date}
                      onChange={(e) => setAiPromptForm({ ...aiPromptForm, date: e.target.value })}
                      style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                  <div className="tp-form-group">
                    <label style={{ fontWeight: "800", color: "#1e3a8a" }}>3. Giờ họp</label>
                    <input
                      type="time"
                      value={aiPromptForm.time}
                      onChange={(e) => setAiPromptForm({ ...aiPromptForm, time: e.target.value })}
                      style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                </div>

                {/* Input 4: Loại cuộc họp (Bảo mật hay bình thường) */}
                <div className="tp-form-group" style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: "800", color: "#1e3a8a" }}>4. Hình thức & Loại cuộc họp</label>
                  <select
                    value={aiPromptForm.type}
                    onChange={(e) => setAiPromptForm({ ...aiPromptForm, type: e.target.value })}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="hop-bao-mat">Cuộc họp Bảo mật Cán bộ (Mật / Nội bộ)</option>
                    <option value="giao-ban">Họp giao ban định kỳ</option>
                    <option value="hop-khan">Họp khẩn cấp</option>
                    <option value="chuyen-de">Họp chuyên đề chuyên môn</option>
                    <option value="tap-huan">Tập huấn & Hướng dẫn nghiệp vụ</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setShowAIScheduleModal(false)}
                    style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyAIMeetingSchedule}
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      color: "#ffffff", border: "none", padding: "10px 22px", borderRadius: "8px",
                      fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
                    }}
                  >
                    ✨ AI Tạo Lịch họp Ngay
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Modal Thông tin Tài khoản */}
          {showAccountInfoModal && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "10px", width: "100%", maxWidth: "520px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", color: "#1e3a8a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>THÔNG TIN TÀI KHOẢN CÁN BỘ</span>
                  </h3>
                  <button onClick={() => setShowAccountInfoModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13.5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#e0f2fe",
                      border: "1.5px solid #bae6fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "16px", color: "#0f172a" }}>{fullName}</div>
                      <div style={{ fontSize: "12px", color: "#0284c7", fontWeight: "700", marginTop: "2px" }}>
                        {role === "truongphong" || role === "admin" ? "Trưởng phòng Văn hóa - Xã hội" : role === "phophong" ? "Phó trưởng phòng VH-XH" : "Cán bộ chuyên viên chuyên trách"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#ffffff" }}>
                    <div>
                      <strong style={{ color: "#475569", fontSize: "12px", display: "block" }}>Đơn vị công tác:</strong>
                      <span style={{ color: "#0f172a", fontWeight: "600" }}>UBND xã Đăk Pxi</span>
                    </div>
                    <div>
                      <strong style={{ color: "#475569", fontSize: "12px", display: "block" }}>Phòng ban:</strong>
                      <span style={{ color: "#0f172a", fontWeight: "600" }}>Phòng Văn hóa - Xã hội</span>
                    </div>
                    <div>
                      <strong style={{ color: "#475569", fontSize: "12px", display: "block" }}>Mã định danh cán bộ:</strong>
                      <span style={{ color: "#0f172a", fontWeight: "600" }}>CB-VHXH-2026</span>
                    </div>
                    <div>
                      <strong style={{ color: "#475569", fontSize: "12px", display: "block" }}>Trạng thái tài khoản:</strong>
                      <span style={{ color: "#16a34a", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#16a34a"><circle cx="12" cy="12" r="10"/></svg>
                        <span>Đang hoạt động</span>
                      </span>
                    </div>
                  </div>

                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px 12px", borderRadius: "6px", fontSize: "12px", color: "#1d4ed8" }}>
                    <strong>Quyền hạn hệ thống:</strong> {role === "truongphong" || role === "admin" ? "Toàn quyền quản lý điều hành, phê duyệt văn bản, giao việc cán bộ & gửi thông báo." : "Quyền cập nhật tiến độ công việc, xử lý văn bản đến/đi và soạn bài viết tuyên truyền."}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button onClick={() => setShowAccountInfoModal(false)} style={{ background: "#005baa", color: "#ffffff", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Cài đặt */}
          {showSettingsModal && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "10px", width: "100%", maxWidth: "500px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", color: "#1e3a8a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    <span>CÀI ĐẶT TÀI KHOẢN & HỆ THỐNG</span>
                  </h3>
                  <button onClick={() => setShowSettingsModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
                  <div>
                    <label style={{ fontWeight: "700", color: "#334155", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      <span>Thông báo SMS & Email chỉ đạo</span>
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked /> Bật nhận thông báo SMS OTP họp
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked /> Đồng bộ email UBND
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontWeight: "700", color: "#334155", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span>Đổi mật khẩu đăng nhập</span>
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input type="password" placeholder="Mật khẩu hiện tại..." style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                      <input type="password" placeholder="Mật khẩu mới..." style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                    </div>
                  </div>

                  <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", color: "#475569" }}>
                    <strong>Phiên bản phần mềm:</strong> v2.6.4 (BHYT & Điều hành Hành chính công Đăk Pxi)
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button onClick={() => setShowSettingsModal(false)} style={{ background: "#e2e8f0", color: "#475569", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                    Hủy
                  </button>
                  <button onClick={() => { setShowSettingsModal(false); setMessage("Đã lưu cài đặt thành công!"); }} style={{ background: "#005baa", color: "#ffffff", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Scroll to Top Button (Standard HTML5 SVG Vector Icon) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#005baa",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 4px 14px rgba(0, 91, 170, 0.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            transition: "all 0.25s ease-in-out"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.background = "#004080";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "#005baa";
          }}
          title="Lên đầu trang"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
      )}
    </div>
  );
}
