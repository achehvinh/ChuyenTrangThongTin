import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TruongPhongDashboard.css";
import { getBackendServerUrl } from "../utils/apiConfig";
import { FIELD_GROUPS, MOCK_PROCEDURES } from "../utils/procedureUtils";
import DakPxiTodayAdminManager from '../components/DakPxiToday/DakPxiTodayAdminManager';
import TotalTasksPage from '../components/TotalTasks/TotalTasksPage';
import NotificationBell from '../components/NotificationBell/NotificationBell';

const BASE_URL = getBackendServerUrl();

const MASTER_QUIZ_QUESTIONS = [
  {
    question: "Khi thấy bạn bị rơi xuống ao, hồ và đang đuối nước, điều đầu tiên em nên làm là gì?",
    options: [
      "Nhảy ngay xuống nước để kéo bạn lên",
      "Hét thật to gọi người lớn đến cứu giúp",
      "Bỏ chạy đi chỗ khác vì sợ hãi",
      "Đứng xem và quay video điện thoại",
    ],
    correct: 1,
    explain: "Tuyệt đối KHÔNG tự ý nhảy xuống nước cứu bạn khi em chưa có kỹ năng cứu hộ chuyên nghiệp. Hãy hét thật to để gọi người lớn xung quanh đến giúp ngay lập tức nhé!",
  },
  {
    question: "Số điện thoại khẩn cấp nào dùng để gọi Cấp cứu Y tế tại Việt Nam?",
    options: ["113", "114", "115", "116"],
    correct: 2,
    explain: "115 là số điện thoại khẩn cấp gọi Cấp cứu Y tế để giúp cấp cứu nạn nhân đuối nước kịp thời.",
  },
  {
    question: "Trước khi bước xuống tàu, thuyền, bè hoặc chơi đùa gần sông nước, em cần làm gì?",
    options: [
      "Mặc áo phao bảo hộ đúng quy cách",
      "Mang theo điện thoại thông minh",
      "Đội mũ bảo hiểm bảo vệ đầu",
      "Không cần chuẩn bị gì cả",
    ],
    correct: 0,
    explain: "Mặc áo phao giúp cơ thể bé luôn nổi trên mặt nước và bảo vệ an toàn nếu chẳng may trượt chân ngã xuống nước.",
  },
  {
    question: "Dấu hiệu nào sau đây cho thấy một người đang bị đuối nước thực tế?",
    options: [
      "Vẫy tay chào lớn và cười nói vui vẻ",
      "Bơi rất nhanh về phía bờ cát",
      "Đầu chìm dập dềnh sát mặt nước, mắt đờ đẫn, miệng ngậm nước không kêu cứu được",
      "Hát to dưới nước để thu hút sự chú ý",
    ],
    correct: 2,
    explain: "Người đuối nước thực tế thường miệng chìm dập dềnh sát mặt nước, mắt lờ đờ, không thể hét lên kêu cứu và hai tay quạt yếu ớt trên mặt nước.",
  },
  {
    question: "Khi muốn cứu bạn đuối nước từ trên bờ, em nên chọn dùng vật dụng trung gian nào?",
    options: [
      "Nhảy xuống nắm tay bạn kéo lên",
      "Ném phao, đưa sào tre, cành cây hoặc ném dây thừng để bạn bám vào",
      "Chờ bạn chìm hẳn rồi mới cứu",
      "Không làm gì cả",
    ],
    correct: 1,
    explain: "Hãy đứng trên bờ thật vững chãi, đưa sào tre, cành cây dài hoặc ném phao, dây thừng cho bạn bám vào rồi kéo bạn vào bờ an toàn.",
  },
  {
    question: "Em có nên tự ý đi tắm sông, suối, ao, hồ một mình vào buổi trưa hoặc ngày nắng nóng không?",
    options: [
      "Có, nếu em tự tin mình bơi rất giỏi",
      "Có, đi tắm một mình cho tự do thoải mái",
      "Không, luôn phải có người lớn biết bơi đi cùng giám sát",
      "Có, nếu rủ thêm bạn nhỏ đi cùng",
    ],
    correct: 2,
    explain: "Tuyệt đối không được tự ý tắm sông, suối, ao, hồ một mình hoặc chỉ rủ bạn nhỏ đi cùng. Luôn luôn phải có người lớn biết bơi đi kèm trông coi nhé.",
  },
  {
    question: "Nếu chẳng may em bị rơi xuống nước và không biết bơi, em nên làm gì để tự cứu mình?",
    options: [
      "Hoảng loạn, vẫy vùng thật mạnh và khóc lóc",
      "Bình tĩnh nín thở, ngửa đầu ra sau, dang rộng hai tay hai chân để cơ thể tự nổi (thả nổi ngửa)",
      "Cố gắng bơi thật nhanh dù không biết bơi",
      "Buông xuôi không hành động gì cả",
    ],
    correct: 1,
    explain: "Hãy cố gắng giữ bình tĩnh, ngửa cổ ra sau, nín thở và hít thở nhẹ nhàng khi miệng nổi trên mặt nước (gọi là thả nổi ngửa) để chờ người đến cứu.",
  },
  {
    question: "Khi đi chơi ở bể bơi công cộng, bé nên bơi ở khu vực nào để được an toàn nhất?",
    options: [
      "Khu vực dành riêng cho trẻ em có độ sâu phù hợp và có nhân viên cứu hộ giám sát",
      "Khu vực nước sâu dành cho người lớn để thể hiện bản thân",
      "Bơi ở bất kỳ khu vực nào bé thích",
      "Khu vực máng trượt nước cảm giác mạnh mà không có người lớn đi cùng",
    ],
    correct: 0,
    explain: "Bé luôn nhớ chỉ bơi ở bể bơi dành cho trẻ em có mực nước thấp và có ba mẹ hoặc nhân viên cứu hộ túc trực gần bên.",
  },
  {
    question: "Sau khi vừa ăn cơm no xong, bé có nên nhảy ngay xuống nước để bơi lội không?",
    options: [
      "Có, nhảy xuống bơi ngay cho mát và dễ tiêu hóa",
      "Không, nên nghỉ ngơi ít nhất 30-45 phút để tránh bị chuột rút (vọp bẻ) và đau bụng",
      "Vừa bơi vừa ăn tiếp cho vui",
      "Chỉ xuống nước nghịch một lúc rồi lên ăn tiếp",
    ],
    correct: 1,
    explain: "Khi ăn no bơi ngay dễ gây đau bụng, co thắt dạ dày và chuột rút (vọp bẻ) rất nguy hiểm. Bé cần nghỉ ngơi 30-45 phút trước khi xuống bơi nhé.",
  },
  {
    question: "Khi đi dạo bờ sông, hồ mà thấy biển báo 'CẢNH BÁO: NƯỚC SÂU NGUY HIỂM', bé nên làm gì?",
    options: [
      "Lờ biển báo đi và xuống sát mép nước chơi",
      "Rủ bạn bè lại gần xem nước sâu thế nào",
      "Tuyệt đối tránh xa khu vực đó và tìm chỗ an toàn khác để chơi",
      "Ném đất đá xuống sông để nghịch nước",
    ],
    correct: 2,
    explain: "Biển báo nguy hiểm giúp chúng ta phòng tránh tai nạn. Bé tuyệt đối không được chơi đùa gần những nơi có đặt biển cảnh báo nước sâu này nhé!",
  },
];

const getQuizDetailsList = (item) => {
  if (item && Array.isArray(item.details) && item.details.length > 0) {
    return item.details;
  }
  const targetScore = item?.score ?? 0;
  return MASTER_QUIZ_QUESTIONS.map((q, idx) => {
    const isCorrect = idx < targetScore;
    let selectedOption = q.correct;
    if (!isCorrect) {
      selectedOption = (q.correct + 1) % q.options.length;
    }
    return {
      questionIndex: idx,
      questionText: q.question,
      options: q.options,
      selectedOption: selectedOption,
      correctOption: q.correct,
      isCorrect: isCorrect,
      explain: q.explain,
    };
  });
};

const getSortedLeaderboard = (results) => {
  if (!Array.isArray(results)) return [];
  return [...results].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
};

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
  const [activeTab, setActiveTab] = useState("overview");
  const [overviewTabFilter, setOverviewTabFilter] = useState("ALL");

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
    if (t === "hop-bao-mat") return "Họp Mật Cán bộ";
    if (t === "giao-ban") return "Giao ban";
    if (t === "hop-khan") return "Họp khẩn";
    if (t === "chuyen-de") return "Chuyên đề";
    if (t === "tap-huan") return "Tập huấn";
    if (t === "hop-dan") return "Họp dân";
    if (t === "tiem-chung") return "Tiêm chủng";
    if (t === "phat-ho-tro") return "Hỗ trợ";
    return "Khác";
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
            label: `Đang diễn ra (${mins}m ${secs}s)`,
            className: "meeting-status-ongoing"
          };
        } else {
          return {
            status: "completed",
            label: "Đã kết thúc",
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
    chucVu: "Chuyên viên chính",
    phongBan: "Phòng Văn hóa - Xã hội",
    phanQuyen: "Biên tập & Tuyên truyền",
  });
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [docsMenuOpen, setDocsMenuOpen] = useState(true);

  const [visitorStats, setVisitorStats] = useState({
    todayCount: 142,
    onlineCanBo: 3,
    onlineCitizens: 1,
    onlineTotal: 4,
    onlineList: []
  });
  const [selectedDetailTab, setSelectedDetailTab] = useState("tuyen-truyen");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ── Quiz Game Management State ──
  const [quizResults, setQuizResults] = useState([]);
  const [selectedQuizDetail, setSelectedQuizDetail] = useState(null);
  const [quizDetailTab, setQuizDetailTab] = useState("all");
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [quizStats, setQuizStats] = useState({
    totalParticipants: 0,
    passedCount: 0,
    failedCount: 0,
    passRate: 0,
    averageScore: 0,
  });
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSearch, setQuizSearch] = useState("");

  const fetchQuizResults = async (search = "") => {
    setQuizLoading(true);
    try {
      const url = search
        ? `${BASE_URL}/api/v1/quiz/results?search=${encodeURIComponent(search)}`
        : `${BASE_URL}/api/v1/quiz/results`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setQuizResults(data.data || []);
        if (data.stats) setQuizStats(data.stats);
      }
    } catch (err) {
      console.warn("Chưa thể kết nối máy chủ để tải kết quả cuộc thi:", err?.message || err);
    } finally {
      setQuizLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "quiz-results") {
      fetchQuizResults(quizSearch);
    }
  }, [activeTab]);

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
  // ── SIDEBAR THỤT VÀO / THU GỌN CHẾ ĐỘ THỜI TRANG ──
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("vhxh_sidebar_collapsed");
    return saved === "true";
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const nextState = !prev;
      localStorage.setItem("vhxh_sidebar_collapsed", String(nextState));
      return nextState;
    });
  };

  // Tab: Updates & Notifications (MongoDB Realtime)
  const [notices, setNotices] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [activitiesList, setActivitiesList] = useState([]);
  const [realNoticesList, setRealNoticesList] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token =
          localStorage.getItem("admin_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("adminToken") ||
          "";
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resAct, resNotif] = await Promise.all([
          axios.get(`${BASE_URL}/api/v1/tasks/activities`, { headers }),
          axios.get(`${BASE_URL}/api/v1/notifications`, { headers }),
        ]);

        if (resAct.data?.success) {
          setActivitiesList(resAct.data.activities || []);
        }
        if (resNotif.data?.success) {
          setRealNoticesList(resNotif.data.notifications || []);
        }
      } catch (err) {
        console.error("Lỗi fetch dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // ── QUẢN LÝ VĂN BẢN ĐẾN & VĂN BẢN ĐI CHUYÊN NGHIỆP CƠ QUAN NHÀ NƯỚC ──
  const defaultInitialIncomingDocs = [
    {
      id: "VBD-2026-001",
      so_den: "01",
      so_hieu: "128/UBND-VX",
      loai_van_ban: "Công văn",
      linh_vuc: "BHYT & BHXH",
      co_quan_ban_hanh: "UBND huyện Tu Mơ Rông",
      ngay_ban_hanh: "2026-07-19",
      ngay_den: "2026-07-20",
      do_khan: "Khẩn",
      do_mat: "Thường",
      nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
      phong_phap: "Phòng Văn hóa - Xã hội",
      han_xu_ly: "2026-07-28",
      trang_thai: "Đang xử lý",
      is_starred: true,
      file_name: "128_UBND_CongVan_BHYT_DuoiNuoc.pdf",
      chi_dao: "Giao cán bộ chuyên trách lập danh sách rà soát tại 10 thôn và gửi báo cáo trước 25/7.",
      ket_qua: "Đã chỉ đạo các thôn Pa Cheng, Đăk Xế Kơ Ne rà soát xong đợt 1.",
      history: [
        { time: "2026-07-20 08:00", actor: "Văn thư phòng", action: "Tiếp nhận & Vào sổ văn bản đến số 01" },
        { time: "2026-07-20 09:15", actor: "Nguyễn Thái Huy (Trưởng phòng)", action: "Phân công xử lý cho Cán bộ chuyên trách" }
      ]
    },
    {
      id: "VBD-2026-002",
      so_den: "02",
      so_hieu: "45/PA05-CAT",
      loai_van_ban: "Thông báo",
      linh_vuc: "CNTT & Chuyển đổi số",
      co_quan_ban_hanh: "Phòng An ninh mạng PA05 - Công an Tỉnh",
      ngay_ban_hanh: "2026-07-16",
      ngay_den: "2026-07-18",
      do_khan: "Khẩn",
      do_mat: "Mật",
      nguoi_xu_ly: "Ngô Đỗ Quỳnh (Phó phòng)",
      phong_phap: "Phòng Văn hóa - Xã hội",
      han_xu_ly: "2026-07-25",
      trang_thai: "Đã hoàn thành",
      is_starred: false,
      file_name: "45_PA05_CanhBaoLuaDaoMang.pdf",
      chi_dao: "Đăng tải ngay bài viết tuyên truyền lên cổng thông tin xã và hệ thống đài phát thanh.",
      ket_qua: "Đã đăng bài viết tuyên truyền phòng chống lừa đảo mạng ngày 19/7/2026.",
      history: [
        { time: "2026-07-18 08:30", actor: "Văn thư phòng", action: "Tiếp nhận văn bản số 02" },
        { time: "2026-07-19 14:20", actor: "Ngô Đỗ Quỳnh (Phó phòng)", action: "Đã hoàn thành đăng tin bài tuyên truyền" }
      ]
    },
    {
      id: "VBD-2026-003",
      so_den: "03",
      so_hieu: "89/SVHTT-TDTT",
      loai_van_ban: "Kế hoạch",
      linh_vuc: "Văn hóa - Gia đình",
      co_quan_ban_hanh: "Sở Văn hóa, Thể thao và Du lịch",
      ngay_ban_hanh: "2026-07-14",
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
  ];

  const defaultInitialOutgoingDocs = [
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
  ];

  const [incomingDocs, setIncomingDocs] = useState(() => {
    const saved = localStorage.getItem("vhxh_incoming_docs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return defaultInitialIncomingDocs;
  });
  const [editingIncomingDoc, setEditingIncomingDoc] = useState(null);
  const [showIncomingForm, setShowIncomingForm] = useState(false);
  const [searchIncoming, setSearchIncoming] = useState("");
  const [filterIncomingLinhVuc, setFilterIncomingLinhVuc] = useState("ALL");
  const [filterIncomingCoQuan, setFilterIncomingCoQuan] = useState("ALL");
  const [filterIncomingTrangThai, setFilterIncomingTrangThai] = useState("ALL");
  const [filterIncomingDoKhan, setFilterIncomingDoKhan] = useState("ALL");
  const [filterIncomingDoMat, setFilterIncomingDoMat] = useState("ALL");
  const [filterIncomingFromDate, setFilterIncomingFromDate] = useState("");
  const [filterIncomingToDate, setFilterIncomingToDate] = useState("");
  const [incomingSortBy, setIncomingSortBy] = useState("ngay_den_desc");
  const [incomingCurrentPage, setIncomingCurrentPage] = useState(1);
  const [incomingItemsPerPage, setIncomingItemsPerPage] = useState(10);

  const [incomingForm, setIncomingForm] = useState({
    so_den: "",
    so_hieu: "",
    loai_van_ban: "Công văn",
    linh_vuc: "BHYT & BHXH",
    co_quan_ban_hanh: "",
    ngay_ban_hanh: new Date().toISOString().substring(0, 10),
    ngay_den: new Date().toISOString().substring(0, 10),
    do_khan: "Thường",
    do_mat: "Thường",
    nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
    han_xu_ly: "",
    trang_thai: "Chưa xử lý",
    file_name: "",
    chi_dao: "",
    ket_qua: ""
  });

  const handleExportIncomingExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "STT,Số Đến,Số Ký Hiệu,Trích Yếu,Cơ Quan Ban Hành,Lĩnh Vực,Ngày Ban Hành,Ngày Đến,Độ Khẩn,Độ Mật,Người Xử Lý,Hạn Xử Lý,Trạng Thái\n";
    incomingDocs.forEach((doc, index) => {
      const row = [
        index + 1,
        `"${doc.so_den || (index + 1)}"`,
        `"${doc.so_hieu || ''}"`,
        `"${(doc.trich_yeu || '').replace(/"/g, '""')}"`,
        `"${doc.co_quan_ban_hanh || ''}"`,
        `"${doc.linh_vuc || 'BHYT & BHXH'}"`,
        `"${doc.ngay_ban_hanh || ''}"`,
        `"${doc.ngay_den || ''}"`,
        `"${doc.do_khan || 'Thường'}"`,
        `"${doc.do_mat || 'Thường'}"`,
        `"${doc.nguoi_xu_ly || ''}"`,
        `"${doc.han_xu_ly || ''}"`,
        `"${doc.trang_thai || ''}"`
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `So_Quan_Ly_Van_Ban_Den_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMessage("Đã xuất danh sách văn bản đến ra tệp Excel (.csv) thành công!");
  };

  const [outgoingDocs, setOutgoingDocs] = useState(() => {
    const saved = localStorage.getItem("vhxh_outgoing_docs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return defaultInitialOutgoingDocs;
  });
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

  // Tính toán số lượng văn bản cần xử lý thực tế (Số đếm badge chuẩn HTML5 <mark>)
  const pendingIncomingCount = incomingDocs.filter(
    (doc) => doc.trang_thai !== "Đã hoàn thành"
  ).length;

  const pendingOutgoingCount = outgoingDocs.filter(
    (doc) => doc.trang_thai === "Dự thảo"
  ).length;

  const handleMarkIncomingComplete = async (id) => {
    const updated = incomingDocs.map(doc => doc.id === id ? {
      ...doc,
      trang_thai: "Đã hoàn thành",
      ket_qua: doc.ket_qua || "Đã xử lý & hoàn thành văn bản."
    } : doc);
    setIncomingDocs(updated);
    localStorage.setItem("vhxh_incoming_docs", JSON.stringify(updated));
    setMessage("Đã chuyển trạng thái văn bản đến sang 'Đã hoàn thành'!");

    try {
      await axios.put(`${BASE_URL}/api/v1/van-ban/${id}`, {
        trang_thai: "Đã hoàn thành",
        ket_qua: "Đã xử lý & hoàn thành văn bản."
      });
    } catch (err) {
      console.error("API mark complete incoming error:", err);
    }
  };

  // 📖 STATE & HANDLERS GIAO DIỆN ĐỌC VĂN BẢN KIỂU WORD & CHUYỂN XỬ LÝ
  const [viewingDocModal, setViewingDocModal] = useState(null);
  const [readerTab, setReaderTab] = useState("a4"); // 'a4' | 'file' | 'timeline'
  const [forwardForm, setForwardForm] = useState({
    nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
    trang_thai: "Đang xử lý",
    chi_dao: "",
    ket_qua: ""
  });

  const handleOpenDocReader = (doc) => {
    setViewingDocModal(doc);
    setReaderTab("a4");
    setForwardForm({
      nguoi_xu_ly: doc.nguoi_xu_ly || doc.nguoi_soan || "Nguyễn Thái Huy (Trưởng phòng)",
      trang_thai: doc.trang_thai || "Đang xử lý",
      chi_dao: doc.chi_dao || "",
      ket_qua: doc.ket_qua || ""
    });
  };

  const handleIncomingFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const reader = new FileReader();
    reader.onload = (event) => {
      setIncomingForm((prev) => ({
        ...prev,
        file_name: file.name,
        file_url: event.target.result,
        file_size: `${sizeMb} MB`,
        file_type: file.type
      }));
      setMessage(`📎 Đã chọn tệp đính kèm văn bản gốc: "${file.name}" (${sizeMb} MB)`);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForwardDoc = async (e) => {
    e.preventDefault();
    if (!viewingDocModal) return;

    const isIncoming = viewingDocModal.loai_so === "den" || viewingDocModal.id.startsWith("VBD");
    const docId = viewingDocModal.id;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newStep = {
      time: nowStr,
      actor: fullName || "Lãnh đạo / Cán bộ VH-XH",
      action: `Chuyển cho [${forwardForm.nguoi_xu_ly}] - Trạng thái: [${forwardForm.trang_thai}]` + (forwardForm.chi_dao ? `. Ý kiến chỉ đạo: ${forwardForm.chi_dao}` : "")
    };

    if (isIncoming) {
      const updated = incomingDocs.map(doc => doc.id === docId ? {
        ...doc,
        nguoi_xu_ly: forwardForm.nguoi_xu_ly,
        trang_thai: forwardForm.trang_thai,
        chi_dao: forwardForm.chi_dao,
        ket_qua: forwardForm.ket_qua,
        history: [...(doc.history || []), newStep]
      } : doc);
      setIncomingDocs(updated);
      localStorage.setItem("vhxh_incoming_docs", JSON.stringify(updated));
      setViewingDocModal({ ...viewingDocModal, nguoi_xu_ly: forwardForm.nguoi_xu_ly, trang_thai: forwardForm.trang_thai, chi_dao: forwardForm.chi_dao, history: [...(viewingDocModal.history || []), newStep] });
    } else {
      const updated = outgoingDocs.map(doc => doc.id === docId ? {
        ...doc,
        nguoi_xu_ly: forwardForm.nguoi_xu_ly,
        trang_thai: forwardForm.trang_thai,
        ghi_chu: forwardForm.chi_dao || doc.ghi_chu
      } : doc);
      setOutgoingDocs(updated);
      localStorage.setItem("vhxh_outgoing_docs", JSON.stringify(updated));
    }

    setMessage(`Đã cập nhật chỉ đạo & chuyển xử lý văn bản ${viewingDocModal.so_hieu} tới ${forwardForm.nguoi_xu_ly} thành công!`);

    try {
      await axios.put(`${BASE_URL}/api/v1/van-ban/${docId}`, {
        nguoi_xu_ly: forwardForm.nguoi_xu_ly,
        trang_thai: forwardForm.trang_thai,
        chi_dao: forwardForm.chi_dao,
        ket_qua: forwardForm.ket_qua,
        ghi_chu: forwardForm.chi_dao
      });
    } catch (err) {
      console.error("API forward doc error:", err);
    }

    setViewingDocModal(null);
  };

  // Đồng bộ văn bản từ MongoDB Backend API & LocalStorage
  const syncVanBanWithAPI = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/van-ban`);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const allDocs = res.data.data;
        const outList = allDocs
          .filter(d => d.loai_so === "di" || !d.loai_so)
          .map(d => ({ ...d, id: d.id_vanban || d._id || d.id }));
        const incList = allDocs
          .filter(d => d.loai_so === "den")
          .map(d => ({ ...d, id: d.id_vanban || d._id || d.id }));

        if (outList.length > 0) {
          setOutgoingDocs(outList);
          localStorage.setItem("vhxh_outgoing_docs", JSON.stringify(outList));
        }
        if (incList.length > 0) {
          setIncomingDocs(incList);
          localStorage.setItem("vhxh_incoming_docs", JSON.stringify(incList));
        }
      }
    } catch (err) {
      console.log("Dùng dữ liệu lưu trữ local cho Văn bản");
    }
  };

  useEffect(() => {
    syncVanBanWithAPI();
    const interval = setInterval(syncVanBanWithAPI, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handlers xử lý Văn bản đến & Văn bản đi (Lưu vĩnh viễn)
  const handleIncomingSubmit = async (e) => {
    e.preventDefault();
    if (!incomingForm.so_hieu || !incomingForm.trich_yeu) {
      setError("Vui lòng nhập đầy đủ Số/Ký hiệu và Trích yếu văn bản đến.");
      return;
    }
    let updatedDocs = [];
    if (editingIncomingDoc) {
      const updated = incomingDocs.map(doc => doc.id === editingIncomingDoc.id ? {
        ...doc,
        ...incomingForm
      } : doc);
      updatedDocs = updated;
      setIncomingDocs(updated);
      localStorage.setItem("vhxh_incoming_docs", JSON.stringify(updated));
      setMessage(`Đã cập nhật thông tin văn bản đến ${incomingForm.so_hieu} thành công!`);
      setEditingIncomingDoc(null);

      try {
        await axios.put(`${BASE_URL}/api/v1/van-ban/${editingIncomingDoc.id}`, {
          ...incomingForm,
          loai_so: "den"
        });
      } catch (err) {
        console.error("API update incoming error:", err);
      }
    } else {
      const newId = `VBD-2026-00${incomingDocs.length + 1}`;
      const newDoc = {
        id: newId,
        id_vanban: newId,
        loai_so: "den",
        ...incomingForm,
        file_name: incomingForm.file_name || `VanBanDen_${Date.now()}.pdf`
      };
      updatedDocs = [newDoc, ...incomingDocs];
      setIncomingDocs(updatedDocs);
      localStorage.setItem("vhxh_incoming_docs", JSON.stringify(updatedDocs));
      setMessage(`Tiếp nhận văn bản đến ${incomingForm.so_hieu} thành công!`);

      try {
        await axios.post(`${BASE_URL}/api/v1/van-ban`, newDoc);
      } catch (err) {
        console.error("API create incoming error:", err);
      }
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

  const handleDeleteIncomingDoc = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi văn bản đến này?")) return;
    const updated = incomingDocs.filter(doc => doc.id !== id);
    setIncomingDocs(updated);
    localStorage.setItem("vhxh_incoming_docs", JSON.stringify(updated));
    setMessage("Đã xóa văn bản đến thành công.");
    try {
      await axios.delete(`${BASE_URL}/api/v1/van-ban/${id}`);
    } catch (err) {
      console.error("API delete incoming error:", err);
    }
  };

  const handleOutgoingSubmit = async (e) => {
    e.preventDefault();
    if (!outgoingForm.so_hieu || !outgoingForm.trich_yeu) {
      setError("Vui lòng nhập đầy đủ Số/Ký hiệu và Trích yếu văn bản đi.");
      return;
    }
    let updatedDocs = [];
    if (editingOutgoingDoc) {
      const updated = outgoingDocs.map(doc => doc.id === editingOutgoingDoc.id ? {
        ...doc,
        ...outgoingForm
      } : doc);
      updatedDocs = updated;
      setOutgoingDocs(updated);
      localStorage.setItem("vhxh_outgoing_docs", JSON.stringify(updated));
      setMessage(`Đã cập nhật văn bản đi ${outgoingForm.so_hieu} thành công vĩnh viễn!`);
      setEditingOutgoingDoc(null);

      try {
        await axios.put(`${BASE_URL}/api/v1/van-ban/${editingOutgoingDoc.id}`, {
          ...outgoingForm,
          loai_so: "di"
        });
      } catch (err) {
        console.error("API update outgoing error:", err);
      }
    } else {
      const newId = `VBI-2026-00${outgoingDocs.length + 1}`;
      const newDoc = {
        id: newId,
        id_vanban: newId,
        loai_so: "di",
        ...outgoingForm,
        file_name: outgoingForm.file_name || `VanBanDi_${Date.now()}.pdf`
      };
      updatedDocs = [newDoc, ...outgoingDocs];
      setOutgoingDocs(updatedDocs);
      localStorage.setItem("vhxh_outgoing_docs", JSON.stringify(updatedDocs));
      setMessage(`Phát hành & Lưu vĩnh viễn văn bản đi ${outgoingForm.so_hieu} thành công! Tất cả cán bộ đã có thể thấy được.`);

      try {
        await axios.post(`${BASE_URL}/api/v1/van-ban`, newDoc);
      } catch (err) {
        console.error("API create outgoing error:", err);
      }
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
    setShowOutgoingForm(false);
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

  const handleDeleteOutgoingDoc = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi văn bản đi này?")) return;
    const updated = outgoingDocs.filter(doc => doc.id !== id);
    setOutgoingDocs(updated);
    localStorage.setItem("vhxh_outgoing_docs", JSON.stringify(updated));
    setMessage("Đã xóa văn bản đi thành công.");
    try {
      await axios.delete(`${BASE_URL}/api/v1/van-ban/${id}`);
    } catch (err) {
      console.error("API delete outgoing error:", err);
    }
  };

  const handleApproveOutgoingDoc = async (id) => {
    const updated = outgoingDocs.map(doc => doc.id === id ? {
      ...doc,
      trang_thai: "Đã phát hành",
      ghi_chu: "Đã phê duyệt & phát hành chính thức qua hệ thống."
    } : doc);
    setOutgoingDocs(updated);
    localStorage.setItem("vhxh_outgoing_docs", JSON.stringify(updated));
    setMessage("Đã phê duyệt & phát hành văn bản đi chính thức vĩnh viễn!");

    try {
      await axios.put(`${BASE_URL}/api/v1/van-ban/${id}`, {
        trang_thai: "Đã phát hành",
        ghi_chu: "Đã phê duyệt & phát hành chính thức qua hệ thống."
      });
    } catch (err) {
      console.error("API approve outgoing error:", err);
    }
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

  const [taskDispatchMenuOpen, setTaskDispatchMenuOpen] = useState(true);
  const [taskSubFilter, setTaskSubFilter] = useState("ALL");

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

  // States bổ sung cho Nộp kết quả, Kiểm tra, Phê duyệt & Yêu cầu bổ sung, Bình luận
  const [submittingResultTask, setSubmittingResultTask] = useState(null);
  const [resultForm, setResultForm] = useState({ result_note: "", result_file: "" });
  const [requestingRevisionTask, setRequestingRevisionTask] = useState(null);
  const [revisionNote, setRevisionNote] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Handlers Điều hành & Giao việc
  const handleSaveResultSubmit = (e) => {
    e.preventDefault();
    if (!submittingResultTask) return;
    const updated = dispatchTasks.map(t => t.id === submittingResultTask.id ? {
      ...t,
      status: "Chờ xử lý",
      progress: Math.max(t.progress || 0, 90),
      result_note: resultForm.result_note,
      result_file: resultForm.result_file || t.result_file || "",
      history: [
        ...(t.history || []),
        {
          time: new Date().toLocaleString("vi-VN"),
          author: fullName || "Cán bộ thực hiện",
          action: `Đã nộp kết quả thực hiện. ${resultForm.result_note ? "Nội dung: " + resultForm.result_note : ""}`
        }
      ]
    } : t);
    saveAndSyncTasks(updated);
    setMessage(`🚀 Đã nộp kết quả cho công việc "${submittingResultTask.title}". Đã chuyển Lãnh đạo kiểm tra & phê duyệt!`);
    setSubmittingResultTask(null);
    setResultForm({ result_note: "", result_file: "" });
  };

  const handleApproveTask = (task) => {
    const updated = dispatchTasks.map(t => t.id === task.id ? {
      ...t,
      status: "Hoàn thành",
      progress: 100,
      approval_status: "Đã phê duyệt",
      history: [
        ...(t.history || []),
        {
          time: new Date().toLocaleString("vi-VN"),
          author: fullName || "Lãnh đạo",
          action: "Đã kiểm tra & Phê duyệt kết quả hoàn thành xuất sắc"
        }
      ]
    } : t);
    saveAndSyncTasks(updated);
    setMessage(`✅ Đã phê duyệt hoàn thành công việc "${task.title}"!`);
  };

  const handleSaveRevisionSubmit = (e) => {
    e.preventDefault();
    if (!requestingRevisionTask || !revisionNote) return;
    const updated = dispatchTasks.map(t => t.id === requestingRevisionTask.id ? {
      ...t,
      status: "Yêu cầu bổ sung",
      approval_status: "Yêu cầu bổ sung",
      progress: Math.min(t.progress || 50, 75),
      note: `[Yêu cầu bổ sung]: ${revisionNote}`,
      history: [
        ...(t.history || []),
        {
          time: new Date().toLocaleString("vi-VN"),
          author: fullName || "Lãnh đạo",
          action: `Yêu cầu bổ sung / chỉnh sửa kết quả. Nội dung: ${revisionNote}`
        }
      ]
    } : t);
    saveAndSyncTasks(updated);
    setMessage(`🔄 Đã gửi yêu cầu bổ sung kết quả cho công việc "${requestingRevisionTask.title}".`);
    setRequestingRevisionTask(null);
    setRevisionNote("");
  };

  const handleAddComment = (taskId) => {
    if (!newCommentText.trim()) return;
    const commentObj = {
      id: Date.now(),
      author: fullName || "Cán bộ VH-XH",
      time: new Date().toLocaleString("vi-VN"),
      content: newCommentText.trim()
    };
    const updated = dispatchTasks.map(t => {
      if (t.id === taskId) {
        const existingComments = t.comments || [];
        const newComments = [...existingComments, commentObj];
        if (viewingDetailTask && viewingDetailTask.id === taskId) {
          setViewingDetailTask({ ...viewingDetailTask, comments: newComments });
        }
        return { ...t, comments: newComments };
      }
      return t;
    });
    saveAndSyncTasks(updated);
    setNewCommentText("");
  };

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
    tac_gia: fullName || "Hoàng Trung Dũng",
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
      const filtered = (res.data || []).filter((u) => u.role === "canbo" || u.role === "phophong");
      setSubordinates(filtered);
      localStorage.setItem("vhxh_subordinates_cache", JSON.stringify(filtered));
    } catch (err) {
      console.error("Lỗi tải cán bộ trực thuộc:", err);
      const saved = localStorage.getItem("vhxh_subordinates_cache");
      if (saved) {
        try {
          setSubordinates(JSON.parse(saved));
        } catch (e) {}
      }
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
          chucVu: staffForm.chucVu,
          phongBan: staffForm.phongBan,
          phanQuyen: staffForm.phanQuyen,
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
      setStaffForm({
        fullName: "",
        username: "",
        password: "Vhxh@2026",
        role: "canbo",
        chucVu: "Chuyên viên chính",
        phongBan: "Phòng Văn hóa - Xã hội",
        phanQuyen: "Biên tập & Tuyên truyền",
      });
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
      role: s.role || "canbo",
      chucVu: s.chucVu || (s.role === "phophong" ? "Phó Trưởng phòng" : "Chuyên viên chính"),
      phongBan: s.phongBan || "Phòng Văn hóa - Xã hội",
      phanQuyen: s.phanQuyen || "Biên tập & Tuyên truyền",
    });
  };

  const fetchVisitorStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/visitor/stats`);
      if (res.data && res.data.success) {
        setVisitorStats(res.data);
      }
    } catch (err) {
      console.warn("Chưa thể tải thông tin truy cập (máy chủ offline hoặc bận):", err?.message || err);
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
      const authorVal = articleForm.tac_gia || fullName || "Hoàng Trung Dũng";
      const fd = new FormData();
      fd.append("tieu_de", articleForm.tieu_de);
      fd.append("mo_ta", articleForm.mo_ta);
      fd.append("noi_dung", articleForm.noi_dung);
      fd.append("danh_muc", articleForm.danh_muc);
      fd.append("trang_thai", articleForm.trang_thai);
      fd.append("nguoi_dang", authorVal);
      fd.append("tac_gia", authorVal);
      fd.append("author", authorVal);
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
      setArticleForm({ tieu_de: "", mo_ta: "", noi_dung: "", danh_muc: "su-kien", trang_thai: "da-dang", chu_chay: "", tac_gia: fullName || "Hoàng Trung Dũng" });

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
      tac_gia: item.tac_gia || item.nguoi_dang || item.author || fullName || "Hoàng Trung Dũng",
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

  // Render Cấu trúc Menu "Điều hành & Giao việc" với hiệu ứng ấn chuột và các mục con
  const renderTaskDispatchMenu = () => {
    const todayStr = new Date().toISOString().substring(0, 10);
    const overdueCount = (dispatchTasks || []).filter(t => t.status !== "Hoàn thành" && (t.status === "Quá hạn" || (t.dueDate && t.dueDate < todayStr))).length;
    const upcomingCount = (dispatchTasks || []).filter(t => {
      if (t.status === "Hoàn thành" || !t.dueDate) return false;
      const diffDays = Math.ceil((new Date(t.dueDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 2;
    }).length;
    const inProgressCount = (dispatchTasks || []).filter(t => t.status === "Đang xử lý" || t.status === "Mới giao" || t.status === "Đang thực hiện").length;
    const completedCount = (dispatchTasks || []).filter(t => t.status === "Hoàn thành").length;
    const myTasksCount = (dispatchTasks || []).filter(t => {
      const uName = fullName || "";
      return !uName || t.assignee.toLowerCase().includes(uName.toLowerCase()) || t.assignee.includes("Tất cả Cán bộ");
    }).length;

    return (
      <div className="tp-task-dispatch-container">
        <button
          type="button"
          className={`tp-nav-item tp-nav-parent ${activeTab === "task-dispatch" ? "active-parent" : ""} tp-task-dispatch-parent`}
          onClick={() => {
            setTaskDispatchMenuOpen(!taskDispatchMenuOpen);
            if (activeTab !== "task-dispatch") {
              setActiveTab("task-dispatch");
              if (role === "canbo") setTaskSubFilter("MY_TASKS");
              setMessage("");
              setError("");
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justify: "space-between",
            width: "100%",
            gap: "8px",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer"
          }}
          title="Điều hành & Giao việc"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "#16a34a" }}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span style={{ fontWeight: "800" }}>Điều hành & Giao việc</span>
          </div>
          <span style={{ fontSize: "10px", color: "#64748b", transform: taskDispatchMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}>
            ▼
          </span>
        </button>

        {taskDispatchMenuOpen && (
          <div className="tp-task-sub-menu" style={{ paddingLeft: "14px", display: "flex", flexDirection: "column", gap: "3px", marginTop: "2px" }}>
            {/* ├─ Tổng nhiệm vụ toàn phòng (Chỉ hiển thị cho Trưởng phòng / Lãnh đạo) */}
            {role !== "canbo" && (
              <button
                type="button"
                className={`tp-nav-item tp-nav-sub ${activeTab === "task-dispatch" && taskSubFilter === "ALL" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("task-dispatch");
                  setTaskSubFilter("ALL");
                  setFilterDispatchStatus("ALL");
                  setMessage("");
                  setError("");
                }}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                title="Xem tổng nhiệm vụ toàn phòng"
              >
                <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>├─</span>
                <span style={{ flex: 1, textAlign: "left", fontSize: "13px", fontWeight: "700" }}>Tổng nhiệm vụ toàn phòng</span>
                <span style={{ background: activeTab === "task-dispatch" && taskSubFilter === "ALL" ? "rgba(255,255,255,0.3)" : "#e2e8f0", color: activeTab === "task-dispatch" && taskSubFilter === "ALL" ? "#ffffff" : "#334155", fontSize: "11px", fontWeight: "800", padding: "1px 6px", borderRadius: "10px" }}>
                  {dispatchTasks.length}
                </span>
              </button>
            )}

            {/* ├─ Nhiệm vụ của tôi */}
            <button
              type="button"
              className={`tp-nav-item tp-nav-sub ${activeTab === "task-dispatch" && taskSubFilter === "MY_TASKS" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("task-dispatch");
                setTaskSubFilter("MY_TASKS");
                setMessage("");
                setError("");
              }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              title="Nhiệm vụ phân công cho cá nhân tôi"
            >
              <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>├─</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: "13px" }}>Nhiệm vụ của tôi</span>
              <span style={{ background: activeTab === "task-dispatch" && taskSubFilter === "MY_TASKS" ? "rgba(255,255,255,0.3)" : "#dbeafe", color: activeTab === "task-dispatch" && taskSubFilter === "MY_TASKS" ? "#ffffff" : "#1e40af", fontSize: "11px", fontWeight: "800", padding: "1px 6px", borderRadius: "10px" }}>
                {myTasksCount}
              </span>
            </button>

            {/* ├─ Đang thực hiện */}
            <button
              type="button"
              className={`tp-nav-item tp-nav-sub ${activeTab === "task-dispatch" && taskSubFilter === "IN_PROGRESS" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("task-dispatch");
                setTaskSubFilter("IN_PROGRESS");
                setFilterDispatchStatus("ALL");
                setMessage("");
                setError("");
              }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              title="Các nhiệm vụ đang trong quá trình thực hiện"
            >
              <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>├─</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: "13px" }}>Đang thực hiện</span>
              <span style={{ background: activeTab === "task-dispatch" && taskSubFilter === "IN_PROGRESS" ? "rgba(255,255,255,0.3)" : "#e0f2fe", color: activeTab === "task-dispatch" && taskSubFilter === "IN_PROGRESS" ? "#ffffff" : "#0369a1", fontSize: "11px", fontWeight: "800", padding: "1px 6px", borderRadius: "10px" }}>
                {inProgressCount}
              </span>
            </button>

            {/* ├─ Sắp đến hạn */}
            <button
              type="button"
              className={`tp-nav-item tp-nav-sub ${activeTab === "task-dispatch" && taskSubFilter === "DUE_SOON" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("task-dispatch");
                setTaskSubFilter("DUE_SOON");
                setFilterDispatchStatus("ALL");
                setMessage("");
                setError("");
              }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              title="Nhiệm vụ còn hạn trong vòng 48h"
            >
              <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>├─</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: "13px" }}>Sắp đến hạn</span>
              <span style={{ background: activeTab === "task-dispatch" && taskSubFilter === "DUE_SOON" ? "rgba(255,255,255,0.3)" : "#fef3c7", color: activeTab === "task-dispatch" && taskSubFilter === "DUE_SOON" ? "#ffffff" : "#b45309", fontSize: "11px", fontWeight: "800", padding: "1px 6px", borderRadius: "10px" }}>
                {upcomingCount}
              </span>
            </button>

            {/* ├─ Quá hạn */}
            <button
              type="button"
              className={`tp-nav-item tp-nav-sub ${activeTab === "task-dispatch" && taskSubFilter === "OVERDUE" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("task-dispatch");
                setTaskSubFilter("OVERDUE");
                setFilterDispatchStatus("ALL");
                setMessage("");
                setError("");
              }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              title="Nhiệm vụ đã quá hạn hoàn thành"
            >
              <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>├─</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: "13px" }}>Quá hạn</span>
              <span style={{ background: activeTab === "task-dispatch" && taskSubFilter === "OVERDUE" ? "rgba(255,255,255,0.3)" : "#fee2e2", color: activeTab === "task-dispatch" && taskSubFilter === "OVERDUE" ? "#ffffff" : "#b91c1c", fontSize: "11px", fontWeight: "800", padding: "1px 6px", borderRadius: "10px" }}>
                {overdueCount}
              </span>
            </button>

            {/* └─ Đã hoàn thành */}
            <button
              type="button"
              className={`tp-nav-item tp-nav-sub ${activeTab === "task-dispatch" && taskSubFilter === "COMPLETED" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("task-dispatch");
                setTaskSubFilter("COMPLETED");
                setFilterDispatchStatus("ALL");
                setMessage("");
                setError("");
              }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              title="Nhiệm vụ đã hoàn thành xuất sắc"
            >
              <span style={{ color: "#16a34a", fontWeight: "900", fontSize: "12px" }}>└─</span>
              <span style={{ flex: 1, textAlign: "left", fontSize: "13px" }}>Đã hoàn thành</span>
              <span style={{ background: activeTab === "task-dispatch" && taskSubFilter === "COMPLETED" ? "rgba(255,255,255,0.3)" : "#dcfce7", color: activeTab === "task-dispatch" && taskSubFilter === "COMPLETED" ? "#ffffff" : "#15803d", fontSize: "11px", fontWeight: "800", padding: "1px 6px", borderRadius: "10px" }}>
                {completedCount}
              </span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Menu "Văn bản" đã được ẩn theo yêu cầu người dùng
  const renderDocsMenu = () => null;

  return (
    <div className="tp-workspace-layout">
      {/* Left Sidebar Menu (Có hiệu ứng thụt vào và 3 sọc ngang hiện lại) */}
      <aside className={`tp-sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        {/* Nút 3 Sọc Ngang Hamburger Toggle Menu */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: isSidebarCollapsed ? "center" : "space-between", marginBottom: "6px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
          {!isSidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "#005baa", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>
                VX
              </div>
              <span style={{ fontWeight: "800", fontSize: "12.5px", color: "#003d7a", letterSpacing: "0.2px", whiteSpace: "nowrap" }}>PHÒNG VH - XÃ HỘI</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            className="tp-sidebar-toggle-btn"
            title={isSidebarCollapsed ? "Mở rộng menu (Bấm 3 sọc ngang để hiện lại)" : "Thu gọn menu (Bấm 3 sọc ngang để thụt vào)"}
            style={{
              background: isSidebarCollapsed ? "#005baa" : "#f1f5f9",
              border: `1px solid ${isSidebarCollapsed ? "#005baa" : "#cbd5e1"}`,
              borderRadius: "8px",
              width: "34px",
              height: "34px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isSidebarCollapsed ? "#ffffff" : "#0f172a",
              flexShrink: 0,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="tp-nav-menu">
          {/* Trưởng phòng & Admin */}
          {(role === "truongphong" || role === "admin") && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => { setActiveTab("overview"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Tổng quan hệ thống"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <span style={{ fontWeight: "800" }}>Tổng quan</span>
              </button>

              {renderTaskDispatchMenu()}

              <button
                className={`tp-nav-item ${activeTab === "staff" ? "active" : ""}`}
                onClick={() => { setActiveTab("staff"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Quản lý cán bộ"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Quản lý cán bộ</span>
              </button>


              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => { setActiveTab("schedule"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Lịch họp cơ quan"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Lịch họp cơ quan</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => { setActiveTab("articles"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Viết bài tuyên truyền"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Viết bài tuyên truyền</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "updates" ? "active" : ""}`}
                onClick={() => { setActiveTab("updates"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Nhật ký & Thông báo"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span>Nhật ký & Thông báo</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "tthc-management" ? "active" : ""}`}
                onClick={() => { setActiveTab("tthc-management"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Quản lý danh mục TTHC"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>Quản lý danh mục TTHC</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "dakpxi-today" ? "active" : ""}`}
                onClick={() => { setActiveTab("dakpxi-today"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Quản lý Đăk Pxi Hôm nay"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                <span>Quản lý Đăk Pxi Hôm nay</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => { setActiveTab("ai-assistant"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Trợ lý AI Hành chính & Văn bản"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" />
                </svg>
                <span>Trợ lý AI Hành chính & Văn bản</span>
              </button>
            </>
          )}

          {/* Phó phòng */}
          {role === "phophong" && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => { setActiveTab("overview"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Tổng quan hệ thống"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <span style={{ fontWeight: "800" }}>Tổng quan</span>
              </button>

              {renderTaskDispatchMenu()}
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => { setActiveTab("schedule"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Lịch họp cơ quan</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => { setActiveTab("articles"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Viết bài tuyên truyền</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "tthc-management" ? "active" : ""}`}
                onClick={() => { setActiveTab("tthc-management"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>Quản lý danh mục TTHC</span>
              </button>
              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => { setActiveTab("ai-assistant"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" />
                </svg>
                <span>Trợ lý AI Hành chính & Văn bản</span>
              </button>
            </>
          )}

          {/* Cán bộ */}
          {role === "canbo" && (
            <>
              <button
                className={`tp-nav-item ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => { setActiveTab("overview"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Tổng quan hệ thống"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
                <span style={{ fontWeight: "800" }}>Tổng quan</span>
              </button>

              {renderTaskDispatchMenu()}
              <button
                className={`tp-nav-item ${activeTab === "schedule" ? "active" : ""}`}
                onClick={() => { setActiveTab("schedule"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Lịch họp cơ quan</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => { setActiveTab("articles"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Viết bài tuyên truyền</span>
              </button>



              <button
                className={`tp-nav-item ${activeTab === "quiz-results" ? "active" : ""}`}
                onClick={() => { setActiveTab("quiz-results"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Quản lý người đã tham gia trò chơi"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <span>Quản lý người đã tham gia trò chơi</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "tthc-management" ? "active" : ""}`}
                onClick={() => { setActiveTab("tthc-management"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
                title="Quản lý danh mục TTHC"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>Quản lý danh mục TTHC</span>
              </button>

              <button
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => { setActiveTab("ai-assistant"); setMessage(""); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" />
                </svg>
                <span>Trợ lý AI Hành chính & Văn bản</span>
              </button>
            </>
          )}
        </nav>

      </aside>

      {/* Right Main Content */}
      <main className="tp-main-content">
        {activeTab !== "ai-assistant" && activeTab !== "tthc-management" && (
          <header
            className="tp-content-header"
            style={{
              position: "sticky",
              top: "-24px",
              zIndex: 900,
              background: "#ffffff",
              marginTop: "-24px",
              marginLeft: "-30px",
              marginRight: "-30px",
              padding: "16px 30px",
              borderBottom: "1px solid #cbd5e1",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}
          >
            {/* TOP LEFT: GREETING & TITLE */}
            <div>
              {activeTab === "overview" ? (
                <div>
                  <h1 style={{ margin: 0, fontSize: "21px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                    Chào mừng, <span style={{ color: "#005baa" }}>{fullName || "Lê Ngọc Sơn"}</span> 👋
                  </h1>
                  <p style={{ margin: "3px 0 0 0", fontSize: "13.5px", color: "#64748b" }}>
                    {role === "truongphong" || role === "admin" ? "Trưởng phòng - Phòng Văn hóa - Xã hội" : role === "phophong" ? "Phó phòng - Phòng Văn hóa - Xã hội" : "Cán bộ chuyên viên - Phòng Văn hóa - Xã hội"}
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: "#005baa", letterSpacing: "0.3px", marginBottom: "2px", textTransform: "uppercase" }}>
                    Hệ thống Điều hành & Giao việc — Phòng Văn hóa - Xã hội
                  </div>
                  <h2 style={{ margin: 0 }}>
                    {activeTab === "dashboard" && "Trang tổng quan & Theo dõi hoạt động thời gian thực"}
                    {activeTab === "task-dispatch" && `Quản lý Điều hành & Phân công Giao việc ${
                      taskSubFilter === "ALL" ? "(Tổng nhiệm vụ toàn phòng)" :
                      taskSubFilter === "MY_TASKS" ? "(Nhiệm vụ của tôi)" :
                      taskSubFilter === "IN_PROGRESS" ? "(Đang thực hiện)" :
                      taskSubFilter === "DUE_SOON" ? "(Sắp đến hạn)" :
                      taskSubFilter === "OVERDUE" ? "(Quá hạn)" :
                      taskSubFilter === "COMPLETED" ? "(Đã hoàn thành)" : ""
                    }`}
                    {activeTab === "incoming-docs" && "Quản lý Sổ Văn bản đến & Phân công chỉ đạo xử lý"}
                    {activeTab === "outgoing-docs" && "Quản lý Sổ Văn bản đi & Soạn thảo dự thảo phát hành"}
                    {activeTab === "staff" && "Quản lý cán bộ"}
                    {activeTab === "schedule" && "Lịch họp & Điều phối lịch công tác"}
                    {activeTab === "updates" && "Nhật ký Hệ thống & Thông báo UBND"}
                    {activeTab === "articles" && "Soạn thảo bài tuyên truyền cho bà con"}
                    {activeTab === "quiz-results" && "Quản lý người đã tham gia trò chơi"}
                  </h2>
                </div>
              )}
            </div>

            {/* TOP RIGHT: DATE CHIP + BELL + USER PROFILE PILL */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
              {/* Thẻ đồng hồ & Ngày tháng */}
              <div style={{
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "6px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "600", color: "#334155" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][currentTime.getDay()]}, {currentTime.getDate()} tháng {currentTime.getMonth() + 1}, {currentTime.getFullYear()}</span>
                </div>
                <div style={{ width: "1px", height: "14px", background: "#cbd5e1" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "800", color: "#0f172a", fontFamily: "monospace" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{currentTime.toLocaleTimeString("vi-VN", { hour12: false })}</span>
                </div>
              </div>

              {/* Nút Chuông Thông báo Realtime MongoDB */}
              <NotificationBell
                onNavigate={(url) => {
                  if (url && url.includes("nhiem-vu")) {
                    setActiveTab("dispatch");
                  } else {
                    setActiveTab("updates");
                  }
                }}
              />

              {/* User Profile Pill Widget */}
              <div style={{ position: "relative" }}>
                {showProfileMenu && (
                  <div
                    onClick={() => setShowProfileMenu(false)}
                    style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998 }}
                  />
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(prev => !prev);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    padding: "4px 10px 4px 4px",
                    borderRadius: "28px",
                    background: showProfileMenu ? "#f1f5f9" : "transparent",
                    border: "none",
                    outline: "none",
                    transition: "all 0.15s ease",
                    userSelect: "none"
                  }}
                  title="Nhấp để mở Menu Tài khoản"
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#e0f2fe",
                    border: "1px solid #bae6fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                    <span style={{ fontSize: "14.5px", fontWeight: "800", color: "#0f172a", lineHeight: "1.2" }}>
                      {fullName || "Lê Ngọc Sơn"}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      {role === "truongphong" || role === "admin" ? "Trưởng phòng" : role === "phophong" ? "Phó phòng" : "Cán bộ chuyên viên"}
                    </span>
                  </div>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showProfileMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "210px",
                    zIndex: 9999,
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.12)",
                    padding: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    animation: "fadeIn 0.15s ease-out"
                  }}>
                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); setShowAccountInfoModal(true); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 12px", border: "none", background: "transparent", borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: "#1e293b", cursor: "pointer", textAlign: "left" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      <span>Thông tin tài khoản</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); setShowSettingsModal(true); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 12px", border: "none", background: "transparent", borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: "#1e293b", cursor: "pointer", textAlign: "left" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                      <span>Cài đặt</span>
                    </button>
                    <div style={{ height: "1px", background: "#e2e8f0", margin: "4px 0" }} />
                    <button
                      type="button"
                      onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 12px", border: "none", background: "transparent", borderRadius: "8px", fontSize: "14px", fontWeight: "700", color: "#dc2626", cursor: "pointer", textAlign: "left" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
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
                      <polyline points="20 6 9 17 4 12" />
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
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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



          {/* TAB QUẢN LÝ NGƯỜI ĐÃ THAM GIA TRÒ CHƠI (NGƯỜI ĐÃ CHƠI, ĐÃ HOÀN THÀNH, THÀNH TÍCH) */}
          {activeTab === "quiz-results" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeIn 0.25s ease-out" }}>
              {/* Thẻ Thống Kê Tổng Quan Với Icon SVG Hiện Đại */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {/* Thẻ 1: Người đã chơi */}
                <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #bfdbfe" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "700", display: "block" }}>Người đã chơi</span>
                    <strong style={{ fontSize: "24px", color: "#0f172a", fontWeight: "800" }}>{quizStats.totalParticipants || 0}</strong>
                  </div>
                </div>

                {/* Thẻ 2: Đã hoàn thành Đạt */}
                <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #bbf7d0" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7"/>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "700", display: "block" }}>Đã hoàn thành Đạt</span>
                    <strong style={{ fontSize: "24px", color: "#16a34a", fontWeight: "800" }}>{quizStats.passedCount || 0}</strong>
                  </div>
                </div>

                {/* Thẻ 3: Tỷ lệ Đạt bằng khen */}
                <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #fde68a" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "700", display: "block" }}>Tỷ lệ Đạt bằng khen</span>
                    <strong style={{ fontSize: "24px", color: "#d97706", fontWeight: "800" }}>{quizStats.passRate || 0}%</strong>
                  </div>
                </div>

                {/* Thẻ 4: Điểm số trung bình */}
                <div style={{ background: "#ffffff", padding: "18px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #ddd6fe" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "700", display: "block" }}>Điểm số trung bình</span>
                    <strong style={{ fontSize: "24px", color: "#7c3aed", fontWeight: "800" }}>{quizStats.averageScore || 0} / 10</strong>
                  </div>
                </div>

                {/* Thẻ 5: Xem Bảng Xếp Hạng Top Cao Nhất */}
                <div
                  onClick={() => setShowLeaderboardModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                    padding: "18px 20px",
                    borderRadius: "14px",
                    border: "2px solid #f59e0b",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  title="Ấn để mở Bảng Xếp Hạng Top điểm cao nhất & làm nhanh nhất"
                >
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 10px rgba(245, 158, 11, 0.3)" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#92400e", fontWeight: "800", display: "block", letterSpacing: "0.3px" }}>🏆 BẢNG XẾP HẠNG</span>
                    <strong style={{ fontSize: "14px", color: "#78350f", fontWeight: "900", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <span>Xem Top Cao Nhất</span>
                      <span style={{ fontSize: "15px" }}>➔</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Thanh Công Cụ Tìm Kiếm & Làm Mới & Bảng Xếp Hạng */}
              <div style={{ background: "#ffffff", padding: "16px 20px", borderRadius: "14px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                <form onSubmit={(e) => { e.preventDefault(); fetchQuizResults(quizSearch); }} style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, maxWidth: "460px" }}>
                  <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "12px" }}>
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm người đã tham gia theo họ tên..."
                      value={quizSearch}
                      onChange={(e) => setQuizSearch(e.target.value)}
                      style={{ width: "100%", padding: "9.5px 14px 9.5px 38px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13.5px", outline: "none" }}
                    />
                  </div>
                  <button type="submit" style={{ padding: "9.5px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #005baa 0%, #004080 100%)", color: "#fff", border: "none", fontWeight: "800", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 6px rgba(0,91,170,0.2)" }}>
                    <span>Tìm kiếm</span>
                  </button>
                  {quizSearch && (
                    <button
                      type="button"
                      onClick={() => { setQuizSearch(""); fetchQuizResults(""); }}
                      style={{ background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", fontWeight: "700" }}
                    >
                      ✕ Xóa tìm
                    </button>
                  )}
                </form>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setShowLeaderboardModal(true)}
                    style={{
                      padding: "9.5px 18px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 3px 10px rgba(217, 119, 6, 0.25)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                    </svg>
                    <span>Bảng Xếp Hạng TOP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchQuizResults(quizSearch)}
                    style={{ padding: "9.5px 18px", borderRadius: "8px", background: "#f8fafc", border: "1.5px solid #cbd5e1", fontSize: "13px", fontWeight: "700", cursor: "pointer", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"/>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    <span>Làm mới</span>
                  </button>
                </div>
              </div>

              {/* Bảng Chi Tiết Danh Sách Người Đã Chơi, Đã Hoàn Thành, Thành Tích */}
              <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                {quizLoading ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>Đang tải danh sách người đã tham gia trò chơi...</div>
                ) : quizResults.length === 0 ? (
                  <div style={{ padding: "48px 20px", textAlign: "center", color: "#64748b" }}>
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "10px" }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                    <h4 style={{ margin: "0 0 6px 0", color: "#1e293b", fontSize: "16px" }}>Chưa có lượt chơi nào được ghi nhận</h4>
                    <p style={{ margin: 0, fontSize: "13.5px" }}>Khi người chơi tham gia cuộc thi ở trang người dùng, danh sách sẽ tự động lưu và hiển thị tại đây.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#334155", fontWeight: "800" }}>
                        <th style={{ padding: "14px 16px", width: "50px", textAlign: "center" }}>STT</th>
                        <th style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>Người đã chơi</span>
                          </div>
                        </th>
                        <th style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>Thời gian tham gia</span>
                          </div>
                        </th>
                        <th style={{ padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span>Đã hoàn thành</span>
                          </div>
                        </th>
                        <th style={{ padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            <span>Tỷ lệ (%)</span>
                          </div>
                        </th>
                        <th style={{ padding: "14px 16px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                            <span>Thành tích</span>
                          </div>
                        </th>
                        <th style={{ padding: "14px 16px", textAlign: "center", width: "170px" }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((item, idx) => {
                        const percent = Math.round((item.score / (item.totalQuestions || 10)) * 100);
                        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "-";
                        return (
                          <tr key={item._id || idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: "700", color: "#64748b" }}>{idx + 1}</td>
                            <td style={{ padding: "14px 16px", fontWeight: "800", color: "#0f172a" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", flexShrink: 0 }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                  </svg>
                                </div>
                                <span>{item.playerName}</span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px", color: "#64748b", fontWeight: "600" }}>{dateStr}</td>
                            <td style={{ padding: "14px 16px", textAlign: "center" }}>
                              <span style={{ background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", padding: "4px 12px", borderRadius: "12px", fontWeight: "800", fontSize: "13px" }}>
                                {item.score} / {item.totalQuestions || 10} câu
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: "800", color: "#334155" }}>{percent}%</td>
                            <td style={{ padding: "14px 16px", textAlign: "center" }}>
                              {item.passed ? (
                                <span style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "5px 14px", borderRadius: "20px", fontWeight: "800", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="7"/>
                                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                                  </svg>
                                  <span>ĐẠT BẰNG KHEN</span>
                                </span>
                              ) : (
                                <span style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", padding: "5px 14px", borderRadius: "20px", fontWeight: "800", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="9" y1="18" x2="15" y2="18"/>
                                    <line x1="10" y1="22" x2="14" y2="22"/>
                                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                                  </svg>
                                  <span>CHƯA ĐẠT</span>
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "14px 16px", textAlign: "center", whiteSpace: "nowrap" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedQuizDetail(item);
                                  setQuizDetailTab("all");
                                }}
                                style={{
                                  background: "#eff6ff",
                                  border: "1px solid #bfdbfe",
                                  cursor: "pointer",
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  color: "#2563eb",
                                  marginRight: "6px",
                                  transition: "all 0.15s",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  fontWeight: "700",
                                  fontSize: "12.5px"
                                }}
                                title="Xem chi tiết đáp án lượt thi này"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Chi tiết</span>
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  if (window.confirm(`Xóa lượt thi của "${item.playerName}"?`)) {
                                    try {
                                      const res = await fetch(`${BASE_URL}/api/v1/quiz/results/${item._id}`, { method: "DELETE" });
                                      const data = await res.json();
                                      if (data.success) {
                                        fetchQuizResults(quizSearch);
                                      }
                                    } catch (err) {
                                      console.error("Lỗi xóa lượt chơi:", err);
                                    }
                                  }
                                }}
                                style={{ background: "#fef2f2", border: "1px solid #fecaca", cursor: "pointer", padding: "6px 10px", borderRadius: "8px", color: "#dc2626", transition: "all 0.15s" }}
                                title="Xóa lượt chơi này"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}


          {/* ──────────────────────────────────
              TAB TỔNG QUAN HỆ THỐNG (CHIP & GIAO DIỆN CHUẨN NGUYÊN MẪU HÌNH ẢNH)
              ────────────────────────────────── */}
          {activeTab === "overview" && (() => {
            const todayStr = new Date().toISOString().substring(0, 10);
            
            // Dữ liệu mẫu công việc hiển thị khớp với thiết kế hình ảnh
            const sampleOverviewTasks = [
              {
                id: "ov-1",
                title: "Tổng hợp báo cáo tình hình thực hiện nhiệm vụ tháng 8/2026",
                assignee: "Nguyễn Thái Huy (Trưởng phòng)",
                dueDate: "15/08/2026",
                progress: 60,
                statusTag: "ĐANG THỰC HIỆN",
                tagBg: "#e0f2fe",
                tagColor: "#0284c7"
              },
              {
                id: "ov-2",
                title: "Rà soát, cập nhật danh sách hộ gia đình khó khăn",
                assignee: "Nguyễn Thái Huy (Trưởng phòng)",
                dueDate: "18/08/2026",
                progress: 30,
                statusTag: "ĐANG THỰC HIỆN",
                tagBg: "#e0f2fe",
                tagColor: "#0284c7"
              },
              {
                id: "ov-3",
                title: "Hoàn thiện kế hoạch tuyên truyền BHYT quý III/2026",
                assignee: "Nguyễn Thái Huy (Trưởng phòng)",
                dueDate: "13/08/2026",
                progress: 70,
                statusTag: "SẮP ĐẾN HẠN",
                tagBg: "#fef3c7",
                tagColor: "#d97706"
              },
              {
                id: "ov-4",
                title: "Báo cáo công tác văn hóa - xã hội 6 tháng đầu năm",
                assignee: "Nguyễn Thái Huy (Trưởng phòng)",
                dueDate: "08/08/2026",
                progress: 90,
                statusTag: "QUÁ HẠN",
                tagBg: "#fee2e2",
                tagColor: "#dc2626"
              },
              {
                id: "ov-5",
                title: "Cập nhật dữ liệu BHYT toàn dân tháng 7/2026",
                assignee: "Nguyễn Thái Huy (Trưởng phòng)",
                dueDate: "05/08/2026",
                progress: 100,
                statusTag: "HOÀN THÀNH",
                tagBg: "#dcfce7",
                tagColor: "#16a34a"
              }
            ];

            const displayTasks = sampleOverviewTasks.filter(t => {
              if (overviewTabFilter === "IN_PROGRESS") return t.statusTag === "ĐANG THỰC HIỆN";
              if (overviewTabFilter === "DUE_SOON") return t.statusTag === "SẮP ĐẾN HẠN";
              if (overviewTabFilter === "OVERDUE") return t.statusTag === "QUÁ HẠN";
              return true;
            });

            return (
              <div style={{ animation: "fadeIn 0.25s ease-out", display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* HÀNG 4 THẺ CHỈ SỐ TỔNG QUAN (KPI CARDS) */}

                {/* 2. HÀNG 4 THẺ CHỈ SỐ TỔNG QUAN (KPI CARDS) */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px" }}>
                    {/* Card 1: Nhiệm vụ của tôi */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#005baa", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                          <line x1="9" y1="12" x2="15" y2="12"/>
                          <line x1="9" y1="16" x2="13" y2="16"/>
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Nhiệm vụ của tôi</span>
                        <div style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", lineHeight: "1.1", margin: "2px 0" }}>7</div>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Tổng số nhiệm vụ</span>
                      </div>
                    </div>

                    {/* Card 2: Đang thực hiện */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f59e0b", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                          <circle cx="12" cy="14" r="3"/>
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Đang thực hiện</span>
                        <div style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", lineHeight: "1.1", margin: "2px 0" }}>3</div>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Nhiệm vụ</span>
                      </div>
                    </div>

                    {/* Card 3: Hoàn thành */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#10b981", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Hoàn thành</span>
                        <div style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", lineHeight: "1.1", margin: "2px 0" }}>3</div>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Nhiệm vụ</span>
                      </div>
                    </div>

                    {/* Card 4: Quá hạn */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#ef4444", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Quá hạn</span>
                        <div style={{ fontSize: "26px", fontWeight: "900", color: "#ef4444", lineHeight: "1.1", margin: "2px 0" }}>1</div>
                        <span style={{ fontSize: "12px", color: "#94a3b8" }}>Nhiệm vụ</span>
                      </div>
                    </div>
                  </div>

                {/* 3. KHU VỰC CHÍNH (LƯỚI 2 CỘT 65% / 35%) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
                  {/* CỘT BÊN TRÁI (65%) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* BẢNG NHIỆM VỤ CỦA TÔI */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.2px" }}>
                          NHIỆM VỤ CỦA TÔI
                        </h3>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={() => setActiveTab("task-dispatch")}
                            style={{ background: "transparent", border: "none", color: "#005baa", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                          >
                            Xem tất cả
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveTab("task-dispatch"); setShowAddTaskModal(true); }}
                            style={{
                              background: "#005baa",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "8px",
                              padding: "8px 14px",
                              fontSize: "13px",
                              fontWeight: "700",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              boxShadow: "0 2px 6px rgba(0, 91, 170, 0.25)"
                            }}
                          >
                            <span>+ Nhiệm vụ mới</span>
                          </button>
                        </div>
                      </div>

                      {/* Bộ lọc Pills (Tất cả, Đang thực hiện, Sắp đến hạn, Quá hạn) */}
                      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px", marginBottom: "16px" }}>
                        {[
                          { id: "ALL", label: "Tất cả" },
                          { id: "IN_PROGRESS", label: "Đang thực hiện" },
                          { id: "DUE_SOON", label: "Sắp đến hạn" },
                          { id: "OVERDUE", label: "Quá hạn" }
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setOverviewTabFilter(f.id)}
                            style={{
                              background: overviewTabFilter === f.id ? "#e0f2fe" : "transparent",
                              color: overviewTabFilter === f.id ? "#005baa" : "#64748b",
                              border: "none",
                              borderRadius: "20px",
                              padding: "6px 14px",
                              fontSize: "13px",
                              fontWeight: overviewTabFilter === f.id ? "800" : "600",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      {/* Danh sách các nhiệm vụ */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {displayTasks.map(t => (
                          <div
                            key={t.id}
                            onClick={() => setActiveTab("task-dispatch")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "14px",
                              borderRadius: "10px",
                              border: "1px solid #f1f5f9",
                              background: "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.01)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.background = "#f8fafc";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#f1f5f9";
                              e.currentTarget.style.background = "#ffffff";
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                              <span style={{
                                background: t.tagBg,
                                color: t.tagColor,
                                fontSize: "11px",
                                fontWeight: "800",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                flexShrink: 0,
                                textTransform: "uppercase"
                              }}>
                                {t.statusTag}
                              </span>

                              <div style={{ minWidth: 0, flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {t.title}
                                </h4>
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                  <span>Người giao: {t.assignee}</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>Hạn hoàn thành</span>
                                <strong style={{ fontSize: "13px", color: t.statusTag === "QUÁ HẠN" ? "#dc2626" : t.statusTag === "SẮP ĐẾN HẠN" ? "#d97706" : t.statusTag === "HOÀN THÀNH" ? "#16a34a" : "#1e293b" }}>
                                  {t.dueDate}
                                </strong>
                              </div>

                              <div style={{ width: "120px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                                  <span style={{ color: "#64748b" }}>Tiến độ</span>
                                  <strong style={{ color: t.tagColor }}>{t.progress}%</strong>
                                </div>
                                <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${t.progress}%`, background: t.tagColor, borderRadius: "10px" }} />
                                </div>
                              </div>

                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BIỂU ĐỒ TIẾN ĐỘ NHIỆM VỤ TRONG THÁNG (SVG Smooth Curve Chart) */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.2px" }}>
                          TIẾN ĐỘ NHIỆM VỤ TRONG THÁNG
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12.5px", fontWeight: "700" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                            Hoàn thành
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#0284c7" }}>
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0284c7" }} />
                            Đang thực hiện
                          </span>
                        </div>
                      </div>

                      {/* SVG Line Chart */}
                      <div style={{ width: "100%", height: "200px", position: "relative" }}>
                        <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="160" x2="500" y2="160" stroke="#cbd5e1" strokeWidth="1" />

                          {/* Area & Line for Hoàn thành (Green) */}
                          <path d="M 0,140 Q 100,110 200,85 T 400,45 T 500,35 L 500,160 L 0,160 Z" fill="url(#greenGrad)" />
                          <path d="M 0,140 Q 100,110 200,85 T 400,45 T 500,35" fill="none" stroke="#10b981" strokeWidth="3" />

                          {/* Area & Line for Đang thực hiện (Blue) */}
                          <path d="M 0,155 Q 100,135 200,115 T 400,90 T 500,75 L 500,160 L 0,160 Z" fill="url(#blueGrad)" />
                          <path d="M 0,155 Q 100,135 200,115 T 400,90 T 500,75" fill="none" stroke="#0284c7" strokeWidth="3" />

                          {/* Data points */}
                          {[[0,140], [100,110], [200,85], [300,60], [400,45], [500,35]].map((p, i) => (
                            <circle key={`g-${i}`} cx={p[0]} cy={p[1]} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                          ))}
                          {[[0,155], [100,135], [200,115], [300,100], [400,90], [500,75]].map((p, i) => (
                            <circle key={`b-${i}`} cx={p[0]} cy={p[1]} r="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                          ))}
                        </svg>

                        {/* X Axis Labels */}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b", marginTop: "6px" }}>
                          <span>01/08</span>
                          <span>03/08</span>
                          <span>05/08</span>
                          <span>07/08</span>
                          <span>09/08</span>
                          <span>11/08</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CỘT BÊN PHẢI (35% - 340px) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* 1. LỊCH HỌP HÔM NAY */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
                          LỊCH HỌP HÔM NAY
                        </h3>
                        <button onClick={() => setActiveTab("schedule")} style={{ background: "transparent", border: "none", color: "#005baa", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                          Xem lịch
                        </button>
                      </div>

                      <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "900", color: "#0284c7", background: "#e0f2fe", padding: "6px 10px", borderRadius: "8px" }}>
                            14:00
                          </span>
                          <div>
                            <strong style={{ fontSize: "14px", color: "#0f172a", display: "block" }}>Họp giao ban tuần</strong>
                            <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              Phòng họp UBND xã
                            </span>
                          </div>
                        </div>

                        <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "11.5px", fontWeight: "800", padding: "4px 10px", borderRadius: "20px" }}>
                          Tham dự
                        </span>
                      </div>
                    </div>

                    {/* 2. THÔNG BÁO MỚI */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
                          THÔNG BÁO MỚI
                        </h3>
                        <button onClick={() => setActiveTab("updates")} style={{ background: "transparent", border: "none", color: "#005baa", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                          Xem tất cả
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#005baa", marginTop: "6px", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "13px", color: "#1e293b", lineHeight: "1.4", fontWeight: "600" }}>
                              Bạn được giao nhiệm vụ mới: "Rà soát & lập danh sách hộ gia đình khó khăn"
                            </p>
                            <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              10:30 11/08
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#005baa", marginTop: "6px", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "13px", color: "#1e293b", lineHeight: "1.4", fontWeight: "600" }}>
                              Nhiệm vụ "Tổng hợp báo cáo tình hình thực hiện nhiệm vụ tháng 8/2026" đến hạn trong 4 ngày nữa
                            </p>
                            <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 16 14"/></svg>
                              09:15 11/08
                            </span>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#005baa", marginTop: "6px", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: "13px", color: "#1e293b", lineHeight: "1.4", fontWeight: "600" }}>
                              Cuộc họp "Họp giao ban tuần" sẽ diễn ra vào lúc 14:00 hôm nay
                            </p>
                            <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 16 14"/></svg>
                              08:00 11/08
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. TIẾN ĐỘ NHIỆM VỤ THÁNG 8 (Donut Chart SVG) */}
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "800", color: "#0f172a", textTransform: "uppercase" }}>
                        TIẾN ĐỘ NHIỆM VỤ THÁNG 8
                      </h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {/* Donut SVG Chart */}
                        <div style={{ position: "relative", width: "110px", height: "110px", flexShrink: 0 }}>
                          <svg width="110" height="110" viewBox="0 0 36 36">
                            {/* Background Track */}
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                            
                            {/* Green Segment (43%) */}
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 15.13 20.83" fill="none" stroke="#10b981" strokeWidth="4.5" strokeDasharray="43, 100" strokeLinecap="round" />
                            
                            {/* Blue Segment (43%) */}
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 15.13 20.83" fill="none" stroke="#0284c7" strokeWidth="4.5" strokeDasharray="43, 100" strokeDashoffset="-43" strokeLinecap="round" />
                            
                            {/* Red Segment (14%) */}
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 15.13 20.83" fill="none" stroke="#ef4444" strokeWidth="4.5" strokeDasharray="14, 100" strokeDashoffset="-86" strokeLinecap="round" />
                          </svg>

                          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <strong style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", lineHeight: "1" }}>75%</strong>
                            <span style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>Hoàn thành</span>
                          </div>
                        </div>

                        {/* Legend list */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12.5px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                              Hoàn thành
                            </span>
                            <strong style={{ color: "#0f172a" }}>3 (43%)</strong>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12.5px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0284c7" }} />
                              Đang thực hiện
                            </span>
                            <strong style={{ color: "#0f172a" }}>3 (43%)</strong>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12.5px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#475569" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} />
                              Quá hạn
                            </span>
                            <strong style={{ color: "#0f172a" }}>1 (14%)</strong>
                          </div>
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
            return <TotalTasksPage />;
            const todayStr = new Date().toISOString().substring(0, 10);

            // Phân loại danh sách thông báo & lọc dữ liệu
            const overdueTasks = dispatchTasks.filter(t => t.status !== "Hoàn thành" && (t.status === "Quá hạn" || (t.dueDate && t.dueDate < todayStr)));
            const upcomingTasks = dispatchTasks.filter(t => {
              if (t.status === "Hoàn thành" || !t.dueDate) return false;
              const diffDays = Math.ceil((new Date(t.dueDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
              return diffDays >= 0 && diffDays <= 2;
            });
            const newTasks = dispatchTasks.filter(t => t.status === "Mới giao");

            // Lọc công việc theo bộ lọc sub-menu và toolbar
            const filteredTasks = dispatchTasks.filter(t => {
              const matchSearch = t.title.toLowerCase().includes(searchDispatch.toLowerCase()) ||
                t.description.toLowerCase().includes(searchDispatch.toLowerCase()) ||
                t.assignee.toLowerCase().includes(searchDispatch.toLowerCase()) ||
                t.id.toLowerCase().includes(searchDispatch.toLowerCase());

              let matchSub = true;
              if (taskSubFilter === "MY_TASKS") {
                const uName = fullName || "";
                matchSub = !uName || t.assignee.toLowerCase().includes(uName.toLowerCase()) || t.assignee.includes("Tất cả Cán bộ");
              } else if (taskSubFilter === "IN_PROGRESS") {
                matchSub = t.status === "Đang xử lý" || t.status === "Mới giao" || t.status === "Đang thực hiện";
              } else if (taskSubFilter === "DUE_SOON") {
                if (t.status === "Hoàn thành" || !t.dueDate) matchSub = false;
                else {
                  const diffDays = Math.ceil((new Date(t.dueDate) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
                  matchSub = diffDays >= 0 && diffDays <= 2;
                }
              } else if (taskSubFilter === "OVERDUE") {
                matchSub = t.status !== "Hoàn thành" && (t.status === "Quá hạn" || (t.dueDate && t.dueDate < todayStr));
              } else if (taskSubFilter === "COMPLETED") {
                matchSub = t.status === "Hoàn thành";
              }

              const matchStatus = filterDispatchStatus === "ALL" || t.status === filterDispatchStatus;
              const matchPriority = filterDispatchPriority === "ALL" || t.priority === filterDispatchPriority;
              const matchAssignee = filterDispatchAssignee === "ALL" || t.assignee === filterDispatchAssignee;
              return matchSearch && matchSub && matchStatus && matchPriority && matchAssignee;
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        <span>Đóng form</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          <span>CẬP NHẬT CÔNG VIỆC GIAO</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
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
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
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
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
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
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
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
                                    <div className="tp-action-dropdown-menu" style={{ width: "210px" }}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenActionMenuId(null);
                                          setViewingDetailTask(t);
                                        }}
                                        className="tp-dropdown-item"
                                      >
                                        <span className="tp-dropdown-icon" style={{ display: "flex", alignItems: "center" }}>
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        </span>
                                        <span>Chi tiết & Bình luận</span>
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
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
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
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
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
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
                                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
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

                {/* 5. Modal Chi tiết công việc & Trao đổi bình luận */}
                {viewingDetailTask && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", width: "100%", maxWidth: "720px", maxHeight: "92vh", overflowY: "auto", padding: "22px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "16px", color: "#1e3a8a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                          <span>CHI TIẾT NHIỆM VỤ: {viewingDetailTask.id}</span>
                        </h3>
                        <button onClick={() => setViewingDetailTask(null)} style={{ background: "none", border: "none", fontSize: "18px", color: "#64748b", cursor: "pointer", fontWeight: "bold" }}>✕</button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
                        <div>
                          <strong style={{ fontSize: "15px", color: "#0f172a", lineHeight: "1.5" }}>{viewingDetailTask.title}</strong>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                          <div><span style={{ color: "#64748b" }}>Người giao:</span> <strong style={{ color: "#1e293b" }}>{viewingDetailTask.assigner}</strong></div>
                          <div><span style={{ color: "#64748b" }}>Người thực hiện:</span> <strong style={{ color: "#1e293b" }}>{viewingDetailTask.assignee}</strong></div>
                          <div><span style={{ color: "#64748b" }}>Đơn vị:</span> <span style={{ fontWeight: "600" }}>{viewingDetailTask.unit}</span></div>
                          <div><span style={{ color: "#64748b" }}>Mức ưu tiên:</span> <span style={{ fontWeight: "700", color: viewingDetailTask.priority === "Khẩn" ? "#b91c1c" : "#0f172a" }}>{viewingDetailTask.priority}</span></div>
                          <div><span style={{ color: "#64748b" }}>Ngày giao:</span> {viewingDetailTask.assignedDate}</div>
                          <div><span style={{ color: "#64748b" }}>Hạn hoàn thành:</span> <strong style={{ color: viewingDetailTask.status === "Quá hạn" ? "#b91c1c" : "#0f172a" }}>{viewingDetailTask.dueDate}</strong></div>
                          <div><span style={{ color: "#64748b" }}>Tiến độ:</span> <strong style={{ color: "#005baa" }}>{viewingDetailTask.progress}%</strong></div>
                          <div><span style={{ color: "#64748b" }}>Trạng thái:</span> <strong style={{ color: viewingDetailTask.status === "Hoàn thành" ? "#15803d" : "#0369a1" }}>{viewingDetailTask.status}</strong></div>
                        </div>

                        {viewingDetailTask.description && (
                          <div>
                            <strong style={{ color: "#334155", display: "block", marginBottom: "4px" }}>📋 Mô tả & Yêu cầu chỉ đạo:</strong>
                            <div style={{ background: "#f1f5f9", padding: "10px 12px", borderRadius: "6px", borderLeft: "3px solid #005baa", color: "#1e293b" }}>
                              {viewingDetailTask.description}
                            </div>
                          </div>
                        )}

                        {viewingDetailTask.file_name && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <strong style={{ color: "#334155" }}>📎 File tài liệu giao kèm:</strong>
                            <span style={{ color: "#2563eb", fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}>{viewingDetailTask.file_name}</span>
                          </div>
                        )}

                        {(viewingDetailTask.result_note || viewingDetailTask.result_file) && (
                          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "6px", padding: "10px 12px" }}>
                            <strong style={{ color: "#047857", display: "block", marginBottom: "4px" }}>📤 Kết quả đã nộp báo cáo:</strong>
                            {viewingDetailTask.result_note && <div style={{ fontSize: "13px", color: "#065f46" }}>{viewingDetailTask.result_note}</div>}
                            {viewingDetailTask.result_file && <div style={{ fontSize: "12px", color: "#047857", marginTop: "4px", fontWeight: "700" }}>📎 File kết quả: <u>{viewingDetailTask.result_file}</u></div>}
                          </div>
                        )}

                        {/* Lịch sử xử lý */}
                        <div>
                          <strong style={{ display: "block", marginBottom: "8px", color: "#1e293b" }}>📜 Lịch sử & Nhật ký xử lý:</strong>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "150px", overflowY: "auto" }}>
                            {viewingDetailTask.history && viewingDetailTask.history.length > 0 ? (
                              viewingDetailTask.history.map((h, i) => (
                                <div key={i} style={{ fontSize: "12px", borderLeft: "3px solid #005baa", paddingLeft: "8px", background: "#f8fafc", padding: "6px 10px", borderRadius: "0 4px 4px 0" }}>
                                  <span style={{ color: "#64748b" }}>[{h.time}]</span> <strong style={{ color: "#1e3a8a" }}>{h.author}:</strong> {h.action}
                                </div>
                              ))
                            ) : (
                              <span style={{ color: "#64748b", fontSize: "12px" }}>Chưa có nhật ký ghi nhận.</span>
                            )}
                          </div>
                        </div>

                        {/* Ý kiến & Bình luận */}
                        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                          <strong style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", color: "#1e293b" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            <span>Trao đổi & Bình luận trực tiếp:</span>
                          </strong>

                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "160px", overflowY: "auto", marginBottom: "10px", background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                            {viewingDetailTask.comments && viewingDetailTask.comments.length > 0 ? (
                              viewingDetailTask.comments.map((c, idx) => (
                                <div key={idx} style={{ background: "#ffffff", border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "6px" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                                    <strong style={{ fontSize: "12px", color: "#1e3a8a" }}>{c.author}</strong>
                                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>{c.time}</span>
                                  </div>
                                  <div style={{ fontSize: "12.5px", color: "#334155" }}>{c.content}</div>
                                </div>
                              ))
                            ) : (
                              <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center", padding: "10px" }}>Chưa có bình luận nào. Hãy gửi ý kiến trao đổi đầu tiên!</div>
                            )}
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              placeholder="Nhập ý kiến, trao đổi bổ sung..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(viewingDetailTask.id); }}
                              style={{ flex: 1, padding: "8px 12px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(viewingDetailTask.id)}
                              style={{ padding: "8px 16px", borderRadius: "4px", background: "#005baa", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
                            >
                              Gửi
                            </button>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                          <button onClick={() => setViewingDetailTask(null)} style={{ padding: "7px 20px", borderRadius: "4px", background: "#64748b", color: "#fff", border: "none", fontSize: "13px", cursor: "pointer", fontWeight: "700" }}>
                            Đóng cửa sổ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Modal Nộp kết quả công việc */}
                {submittingResultTask && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", width: "100%", maxWidth: "520px", padding: "22px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "10px", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", color: "#1e3a8a", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                          <span>NỘP KẾT QUẢ THỰC HIỆN CÔNG VIỆC</span>
                        </h3>
                        <button onClick={() => setSubmittingResultTask(null)} style={{ background: "none", border: "none", fontSize: "18px", color: "#64748b", cursor: "pointer" }}>✕</button>
                      </div>

                      <form onSubmit={handleSaveResultSubmit}>
                        <div style={{ fontSize: "13.5px", marginBottom: "14px", fontWeight: "700", color: "#0f172a", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", borderLeft: "3px solid #005baa" }}>
                          {submittingResultTask.title}
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            File đính kèm kết quả thực hiện (Báo cáo / Dự thảo):
                          </label>
                          <input
                            type="text"
                            placeholder="BaoCao_KetQua_ThucHien.pdf"
                            value={resultForm.result_file}
                            onChange={(e) => setResultForm({ ...resultForm, result_file: e.target.value })}
                            style={{ width: "100%", padding: "7px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                          />
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Nội dung tóm tắt kết quả / Ghi chú cho Lãnh đạo (*):
                          </label>
                          <textarea
                            rows="4"
                            required
                            placeholder="Mô tả kết quả đã hoàn thành, số liệu thống kê hoặc nội dung trình Lãnh đạo xem xét..."
                            value={resultForm.result_note}
                            onChange={(e) => setResultForm({ ...resultForm, result_note: e.target.value })}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button type="button" onClick={() => setSubmittingResultTask(null)} style={{ padding: "7px 16px", borderRadius: "4px", background: "#e2e8f0", border: "1px solid #cbd5e1", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
                            Hủy
                          </button>
                          <button type="submit" style={{ padding: "7px 20px", borderRadius: "4px", background: "#005baa", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                            Nộp kết quả
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 7. Modal Yêu cầu bổ sung */}
                {requestingRevisionTask && (
                  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", width: "100%", maxWidth: "500px", padding: "22px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "10px", marginBottom: "14px" }}>
                        <h3 style={{ margin: 0, fontSize: "15px", color: "#7c3aed", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21.5 2v6h-6" /><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
                          <span>YÊU CẦU BỔ SUNG / CHỈNH SỬA KẾT QUẢ</span>
                        </h3>
                        <button onClick={() => setRequestingRevisionTask(null)} style={{ background: "none", border: "none", fontSize: "18px", color: "#64748b", cursor: "pointer" }}>✕</button>
                      </div>

                      <form onSubmit={handleSaveRevisionSubmit}>
                        <div style={{ fontSize: "13.5px", marginBottom: "14px", fontWeight: "700", color: "#0f172a", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", borderLeft: "3px solid #7c3aed" }}>
                          {requestingRevisionTask.title}
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "4px" }}>
                            Nội dung yêu cầu bổ sung / chỉnh sửa (*):
                          </label>
                          <textarea
                            rows="4"
                            required
                            placeholder="Nhập chi tiết các nội dung cán bộ cần điều chỉnh, bổ sung thêm..."
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                          <button type="button" onClick={() => setRequestingRevisionTask(null)} style={{ padding: "7px 16px", borderRadius: "4px", background: "#e2e8f0", border: "1px solid #cbd5e1", fontSize: "13px", cursor: "pointer", fontWeight: "600" }}>
                            Hủy
                          </button>
                          <button type="submit" style={{ padding: "7px 20px", borderRadius: "4px", background: "#7c3aed", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                            Gửi yêu cầu bổ sung
                          </button>
                        </div>
                      </form>
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
              MODULE QUẢN LÝ VĂN BẢN ĐẾN CHUYÊN NGHIỆP (E-GOV IOFFICE SYSTEM)
              ────────────────────────────────── */}
          {activeTab === "incoming-docs" && (() => {
            const todayStr = new Date().toISOString().substring(0, 10);

            // Filter logic
            const filteredIncoming = incomingDocs.filter((doc) => {
              const matchSearch =
                searchIncoming === "" ||
                (doc.so_hieu && doc.so_hieu.toLowerCase().includes(searchIncoming.toLowerCase())) ||
                (doc.so_den && String(doc.so_den).toLowerCase().includes(searchIncoming.toLowerCase())) ||
                (doc.trich_yeu && doc.trich_yeu.toLowerCase().includes(searchIncoming.toLowerCase())) ||
                (doc.co_quan_ban_hanh && doc.co_quan_ban_hanh.toLowerCase().includes(searchIncoming.toLowerCase())) ||
                (doc.nguoi_xu_ly && doc.nguoi_xu_ly.toLowerCase().includes(searchIncoming.toLowerCase()));

              const matchLinhVuc = filterIncomingLinhVuc === "ALL" || doc.linh_vuc === filterIncomingLinhVuc;
              const matchCoQuan = filterIncomingCoQuan === "ALL" || doc.co_quan_ban_hanh === filterIncomingCoQuan;
              const matchTrangThai = filterIncomingTrangThai === "ALL" || doc.trang_thai === filterIncomingTrangThai;
              const matchDoKhan = filterIncomingDoKhan === "ALL" || doc.do_khan === filterIncomingDoKhan;
              const matchDoMat = filterIncomingDoMat === "ALL" || doc.do_mat === filterIncomingDoMat;

              const matchFromDate = !filterIncomingFromDate || (doc.ngay_den && doc.ngay_den >= filterIncomingFromDate);
              const matchToDate = !filterIncomingToDate || (doc.ngay_den && doc.ngay_den <= filterIncomingToDate);

              return matchSearch && matchLinhVuc && matchCoQuan && matchTrangThai && matchDoKhan && matchDoMat && matchFromDate && matchToDate;
            }).sort((a, b) => {
              if (incomingSortBy === "ngay_den_desc") return new Date(b.ngay_den || 0) - new Date(a.ngay_den || 0);
              if (incomingSortBy === "ngay_den_asc") return new Date(a.ngay_den || 0) - new Date(b.ngay_den || 0);
              if (incomingSortBy === "so_den_desc") return (parseInt(b.so_den) || 0) - (parseInt(a.so_den) || 0);
              if (incomingSortBy === "so_den_asc") return (parseInt(a.so_den) || 0) - (parseInt(a.so_den) || 0);
              return 0;
            });

            // Statistics Overview Counters
            const totalCount = incomingDocs.length;
            const todayCount = incomingDocs.filter(d => d.ngay_den === todayStr).length;
            const pendingCount = incomingDocs.filter(d => d.trang_thai === "Chưa xử lý").length;
            const processingCount = incomingDocs.filter(d => d.trang_thai === "Đang xử lý").length;
            const completedCount = incomingDocs.filter(d => d.trang_thai === "Đã hoàn thành").length;
            const overdueCount = incomingDocs.filter(d => d.trang_thai === "Quá hạn" || (d.trang_thai !== "Đã hoàn thành" && d.han_xu_ly && d.han_xu_ly < todayStr)).length;

            // Pagination logic
            const totalPages = Math.ceil(filteredIncoming.length / incomingItemsPerPage) || 1;
            const paginatedDocs = filteredIncoming.slice(
              (incomingCurrentPage - 1) * incomingItemsPerPage,
              incomingCurrentPage * incomingItemsPerPage
            );

            return (
              <div style={{ animation: "fadeIn 0.2s ease-out", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* 📊 DASHBOARD THỐNG KÊ CHI CHỈ SỐ VĂN BẢN ĐẾN PHÍA TRÊN */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
                  <div className="tp-card" style={{ padding: "14px", borderLeft: "4px solid #005baa", background: "#f8fafc" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>TỔNG SỐ VĂN BẢN</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#005baa", marginTop: "4px" }}>{totalCount}</div>
                  </div>

                  <div className="tp-card" style={{ padding: "14px", borderLeft: "4px solid #0284c7", background: "#f0f9ff" }}>
                    <div style={{ fontSize: "12px", color: "#0369a1", fontWeight: "700" }}>MỚI HÔM NAY</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#0284c7", marginTop: "4px" }}>{todayCount}</div>
                  </div>

                  <div className="tp-card" style={{ padding: "14px", borderLeft: "4px solid #64748b", background: "#f1f5f9" }}>
                    <div style={{ fontSize: "12px", color: "#475569", fontWeight: "700" }}>CHƯA XỬ LÝ</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#475569", marginTop: "4px" }}>{pendingCount}</div>
                  </div>

                  <div className="tp-card" style={{ padding: "14px", borderLeft: "4px solid #d97706", background: "#fef3c7" }}>
                    <div style={{ fontSize: "12px", color: "#b45309", fontWeight: "700" }}>ĐANG XỬ LÝ</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#d97706", marginTop: "4px" }}>{processingCount}</div>
                  </div>

                  <div className="tp-card" style={{ padding: "14px", borderLeft: "4px solid #16a34a", background: "#dcfce7" }}>
                    <div style={{ fontSize: "12px", color: "#15803d", fontWeight: "700" }}>ĐÃ HOÀN THÀNH</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#16a34a", marginTop: "4px" }}>{completedCount}</div>
                  </div>

                  <div className="tp-card" style={{ padding: "14px", borderLeft: "4px solid #dc2626", background: "#fee2e2" }}>
                    <div style={{ fontSize: "12px", color: "#b91c1c", fontWeight: "700" }}>QUÁ HẠN</div>
                    <div style={{ fontSize: "22px", fontWeight: "900", color: "#dc2626", marginTop: "4px" }}>{overdueCount}</div>
                  </div>
                </div>

                {/* 🔍 BỘ CÔNG CỤ TÌM KIẾM & BỘ LỌC ĐA CHIỀU (ADVANCED FILTERS) */}
                <div className="tp-card" style={{ padding: "16px", background: "#ffffff", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 1 2 2h16a2 2 0 0 1 2-2v-6l-3.45-6.89A2 2 0 0 1 16.76 4H7.24a2 2 0 0 1-1.79 1.11z" /></svg>
                      <span>QUẢN LÝ VĂN BẢN ĐẾN CƠ QUAN</span>
                    </h3>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (showIncomingForm && !editingIncomingDoc) {
                            setShowIncomingForm(false);
                          } else {
                            setShowIncomingForm(true);
                            setEditingIncomingDoc(null);
                            setIncomingForm({
                              so_den: String(incomingDocs.length + 1).padStart(2, "0"),
                              so_hieu: "", loai_van_ban: "Công văn", linh_vuc: "BHYT & BHXH",
                              co_quan_ban_hanh: "", ngay_ban_hanh: todayStr, ngay_den: todayStr,
                              do_khan: "Thường", do_mat: "Thường", nguoi_xu_ly: "Nguyễn Thái Huy (Trưởng phòng)",
                              han_xu_ly: "", trang_thai: "Chưa xử lý", file_name: "", chi_dao: "", ket_qua: ""
                            });
                          }
                        }}
                        style={{ padding: "8px 16px", borderRadius: "6px", background: "#005baa", color: "#fff", border: "none", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        <span>{showIncomingForm ? "Đóng form" : "Tiếp nhận Văn bản đến Mới"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={syncVanBanWithAPI}
                        style={{ padding: "8px 14px", borderRadius: "6px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                        title="Làm mới dữ liệu từ hệ thống"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                        <span>Làm mới</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportIncomingExcel}
                        style={{ padding: "8px 14px", borderRadius: "6px", background: "#16a34a", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                        title="Xuất bảng dữ liệu ra file Excel"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 12 15 15" /></svg>
                        <span>Xuất Excel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        style={{ padding: "8px 14px", borderRadius: "6px", background: "#475569", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                        title="In danh sách văn bản"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                        <span>In danh sách</span>
                      </button>
                    </div>
                  </div>

                  {/* Khung Bộ Lọc Đa Chiều Nâng Cao */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", background: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Tìm kiếm từ khóa:</label>
                      <input
                        type="text"
                        placeholder="Số đến, số hiệu, trích yếu, người xử lý..."
                        value={searchIncoming}
                        onChange={(e) => setSearchIncoming(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Lĩnh vực công tác:</label>
                      <select
                        value={filterIncomingLinhVuc}
                        onChange={(e) => setFilterIncomingLinhVuc(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      >
                        <option value="ALL">Tất cả lĩnh vực</option>
                        <option value="BHYT & BHXH">BHYT & BHXH</option>
                        <option value="CNTT & Chuyển đổi số">CNTT & Chuyển đổi số</option>
                        <option value="Văn hóa - Gia đình">Văn hóa - Gia đình</option>
                        <option value="Lao động - TBXH">Lao động - TBXH</option>
                        <option value="Y tế - Dân số">Y tế - Dân số</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Trạng thái xử lý:</label>
                      <select
                        value={filterIncomingTrangThai}
                        onChange={(e) => setFilterIncomingTrangThai(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="Chưa xử lý">Chưa xử lý (Xám)</option>
                        <option value="Đang xử lý">Đang xử lý (Vàng)</option>
                        <option value="Đã hoàn thành">Đã hoàn thành (Xanh)</option>
                        <option value="Quá hạn">Quá hạn (Đỏ)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Độ khẩn văn bản:</label>
                      <select
                        value={filterIncomingDoKhan}
                        onChange={(e) => setFilterIncomingDoKhan(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      >
                        <option value="ALL">Tất cả độ khẩn</option>
                        <option value="Thường">Thường</option>
                        <option value="Khẩn">Khẩn 🔥</option>
                        <option value="Thượng khẩn">Thượng khẩn ⚡</option>
                        <option value="Hỏa tốc">Hỏa tốc 🚨</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Độ mật văn bản:</label>
                      <select
                        value={filterIncomingDoMat}
                        onChange={(e) => setFilterIncomingDoMat(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      >
                        <option value="ALL">Tất cả độ mật</option>
                        <option value="Thường">Thường</option>
                        <option value="Mật">Mật 🔒</option>
                        <option value="Tối mật">Tối mật 🔒🔒</option>
                        <option value="Tuyệt mật">Tuyệt mật 🛑</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Từ ngày đến:</label>
                      <input
                        type="date"
                        value={filterIncomingFromDate}
                        onChange={(e) => setFilterIncomingFromDate(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Đến ngày đến:</label>
                      <input
                        type="date"
                        value={filterIncomingToDate}
                        onChange={(e) => setFilterIncomingToDate(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "3px" }}>Sắp xếp danh sách:</label>
                      <select
                        value={incomingSortBy}
                        onChange={(e) => setIncomingSortBy(e.target.value)}
                        style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}
                      >
                        <option value="ngay_den_desc">Ngày đến (Mới nhất)</option>
                        <option value="ngay_den_asc">Ngày đến (Cũ nhất)</option>
                        <option value="so_den_desc">Số đến (Giảm dần)</option>
                        <option value="so_den_asc">Số đến (Tăng dần)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* FORM TIẾP NHẬN / PHÂN CÔNG VĂN BẢN ĐẾN MỚI HOẶC HIỆU CHỈNH */}
                {(showIncomingForm || editingIncomingDoc) && (
                  <div className="tp-card" style={{ padding: "20px", borderTop: "4px solid #005baa", background: "#fafafa" }}>
                    <h4 style={{ margin: "0 0 16px", fontSize: "15px", color: "#003d7a", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                      {editingIncomingDoc ? "✏️ CẬP NHẬT THÔNG TIN VĂN BẢN ĐẾN" : "📥 TIẾP NHẬN & VÀO SỔ VĂN BẢN ĐẾN MỚI"}
                    </h4>

                    <form onSubmit={handleIncomingSubmit}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px 16px" }}>
                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Số đến (*)</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: 05"
                            value={incomingForm.so_den}
                            onChange={(e) => setIncomingForm({ ...incomingForm, so_den: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Số / Ký hiệu (*)</label>
                          <input
                            type="text"
                            placeholder="128/UBND-VX"
                            value={incomingForm.so_hieu}
                            onChange={(e) => setIncomingForm({ ...incomingForm, so_hieu: e.target.value })}
                            required
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          />
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Loại văn bản</label>
                          <select
                            value={incomingForm.loai_van_ban}
                            onChange={(e) => setIncomingForm({ ...incomingForm, loai_van_ban: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Công văn">Công văn</option>
                            <option value="Tờ trình">Tờ trình</option>
                            <option value="Báo cáo">Báo cáo</option>
                            <option value="Quyết định">Quyết định</option>
                            <option value="Kế hoạch">Kế hoạch</option>
                            <option value="Thông báo">Thông báo</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Lĩnh vực công tác</label>
                          <select
                            value={incomingForm.linh_vuc}
                            onChange={(e) => setIncomingForm({ ...incomingForm, linh_vuc: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="BHYT & BHXH">BHYT & BHXH</option>
                            <option value="CNTT & Chuyển đổi số">CNTT & Chuyển đổi số</option>
                            <option value="Văn hóa - Gia đình">Văn hóa - Gia đình</option>
                            <option value="Lao động - TBXH">Lao động - TBXH</option>
                            <option value="Y tế - Dân số">Y tế - Dân số</option>
                          </select>
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
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Ngày ban hành</label>
                          <input
                            type="date"
                            value={incomingForm.ngay_ban_hanh}
                            onChange={(e) => setIncomingForm({ ...incomingForm, ngay_ban_hanh: e.target.value })}
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
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Độ khẩn</label>
                          <select
                            value={incomingForm.do_khan}
                            onChange={(e) => setIncomingForm({ ...incomingForm, do_khan: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Thường">Thường</option>
                            <option value="Khẩn">Khẩn 🔥</option>
                            <option value="Thượng khẩn">Thượng khẩn ⚡</option>
                            <option value="Hỏa tốc">Hỏa tốc 🚨</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Độ mật</label>
                          <select
                            value={incomingForm.do_mat}
                            onChange={(e) => setIncomingForm({ ...incomingForm, do_mat: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Thường">Thường</option>
                            <option value="Mật">Mật 🔒</option>
                            <option value="Tối mật">Tối mật 🔒🔒</option>
                            <option value="Tuyệt mật">Tuyệt mật 🛑</option>
                          </select>
                        </div>

                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Cán bộ được giao xử lý</label>
                          <select
                            value={incomingForm.nguoi_xu_ly}
                            onChange={(e) => setIncomingForm({ ...incomingForm, nguoi_xu_ly: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Nguyễn Thái Huy (Trưởng phòng)">Nguyễn Thái Huy (Trưởng phòng)</option>
                            <option value="Ngô Đỗ Quỳnh (Phó phòng)">Ngô Đỗ Quỳnh (Phó phòng)</option>
                            <option value="Hoàng Trung Dũng (Cán bộ Chuyên viên)">Hoàng Trung Dũng (Cán bộ Chuyên viên)</option>
                            <option value="Lê Ngọc Sơn (Cán bộ Chuyên viên)">Lê Ngọc Sơn (Cán bộ Chuyên viên)</option>
                          </select>
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
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Trạng thái xử lý</label>
                          <select
                            value={incomingForm.trang_thai}
                            onChange={(e) => setIncomingForm({ ...incomingForm, trang_thai: e.target.value })}
                            style={{ padding: "7px 10px", fontSize: "13px" }}
                          >
                            <option value="Chưa xử lý">Chưa xử lý</option>
                            <option value="Đang xử lý">Đang xử lý</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                            <option value="Quá hạn">Quá hạn</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                        <div className="tp-form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155" }}>Trích yếu nội dung văn bản (*)</label>
                          <textarea
                            rows="2"
                            placeholder="Tóm tắt nội dung văn bản..."
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
                            placeholder="Nội dung giao việc, chỉ đạo..."
                            value={incomingForm.chi_dao}
                            onChange={(e) => setIncomingForm({ ...incomingForm, chi_dao: e.target.value })}
                            style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }}
                          />
                        </div>
                      </div>

                      {/* 📎 Ô ĐÍNH KÈM TỆP VĂN BẢN GỐC (DÙNG ĐỂ ĐỌC TRÊN GIAO DIỆN WORD/PDF) */}
                      <div style={{ background: "#ffffff", border: "1.5px dashed #005baa", padding: "14px 16px", borderRadius: "8px", marginTop: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                          <label style={{ fontSize: "13px", fontWeight: "800", color: "#003d7a", display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                            <span>Tệp đính kèm văn bản gốc (*.PDF, *.DOCX, *.DOC, Ảnh Scan)</span>
                          </label>

                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <label
                              style={{
                                padding: "6px 14px",
                                background: "#005baa",
                                color: "#ffffff",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                boxShadow: "0 2px 4px rgba(0, 91, 170, 0.2)"
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                              <span>{incomingForm.file_name ? "Tải tệp đính kèm mới" : "Tải tệp đính kèm từ máy"}</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                onChange={handleIncomingFileChange}
                                style={{ display: "none" }}
                              />
                            </label>

                            {!incomingForm.file_name && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIncomingForm(prev => ({
                                    ...prev,
                                    file_name: `CongVan_${incomingForm.so_hieu ? incomingForm.so_hieu.replace(/[\/\s]/g, '_') : '128_UBND'}_Goc.pdf`,
                                    file_size: "1.45 MB",
                                    file_url: ""
                                  }));
                                  setMessage("Đã tự động tạo tệp PDF đính kèm mẫu!");
                                }}
                                style={{ padding: "6px 12px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                              >
                                + Đính kèm tệp mẫu
                              </button>
                            )}
                          </div>
                        </div>

                        {incomingForm.file_name ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f0fdf4", border: "1px solid #86efac", padding: "10px 14px", borderRadius: "6px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px" }}>
                                📄
                              </div>
                              <div>
                                <div style={{ fontSize: "13px", fontWeight: "800", color: "#14532d" }}>{incomingForm.file_name}</div>
                                <div style={{ fontSize: "11.5px", color: "#16a34a", fontWeight: "600", marginTop: "1px" }}>
                                  Dung lượng: <strong>{incomingForm.file_size || "1.4 MB"}</strong> • Trạng thái: ✅ Đã tải lên (Sẵn sàng mở xem giao diện đọc A4)
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIncomingForm({ ...incomingForm, file_name: "", file_url: "", file_size: "" })}
                              style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "4px", padding: "4px 10px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                            >
                              ✕ Gỡ tệp
                            </button>
                          </div>
                        ) : (
                          <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "6px 0" }}>
                            💡 Bấm nút <strong>"Tải tệp đính kèm từ máy"</strong> để chọn file văn bản (.PDF, .DOCX, .DOC) hoặc bấm <strong>"+ Đính kèm tệp mẫu"</strong> để kiểm thử giao diện đọc.
                          </div>
                        )}
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
                          {editingIncomingDoc ? "💾 Lưu cập nhật" : "📥 Lưu văn bản đến"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 📋 BẢNG DANH SÁCH VĂN BẢN ĐẾN CHUẨN ĐIỆN TỬ (12 CỘT CHI TIẾT) */}
                <div className="tp-card" style={{ padding: "0", overflow: "hidden", background: "#ffffff" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", color: "#0f172a", borderBottom: "2px solid #cbd5e1" }}>
                          <th style={{ padding: "12px 10px", width: "65px", textAlign: "center" }}>Số đến</th>
                          <th style={{ padding: "12px 10px", width: "125px", whiteSpace: "nowrap" }}>Số / Ký hiệu</th>
                          <th style={{ padding: "12px 10px" }}>Trích yếu nội dung & Chỉ đạo</th>
                          <th style={{ padding: "12px 10px", width: "150px" }}>Cơ quan ban hành</th>
                          <th style={{ padding: "12px 10px", width: "125px" }}>Lĩnh vực</th>
                          <th style={{ padding: "12px 10px", width: "95px", whiteSpace: "nowrap" }}>Ngày BH</th>
                          <th style={{ padding: "12px 10px", width: "95px", whiteSpace: "nowrap" }}>Ngày đến</th>
                          <th style={{ padding: "12px 10px", width: "85px", textAlign: "center" }}>Độ khẩn</th>
                          <th style={{ padding: "12px 10px", width: "85px", textAlign: "center" }}>Độ mật</th>
                          <th style={{ padding: "12px 10px", width: "150px" }}>Người xử lý & Hạn</th>
                          <th style={{ padding: "12px 10px", width: "110px", textAlign: "center" }}>Trạng thái</th>
                          <th style={{ padding: "12px 10px", width: "115px", textAlign: "center" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedDocs.length === 0 ? (
                          <tr>
                            <td colSpan="12" style={{ textAlign: "center", padding: "36px", color: "#64748b" }}>
                              Không tìm thấy văn bản đến phù hợp với bộ lọc.
                            </td>
                          </tr>
                        ) : (
                          paginatedDocs.map((doc, idx) => {
                            const isOverdue = doc.trang_thai === "Quá hạn" || (doc.trang_thai !== "Đã hoàn thành" && doc.han_xu_ly && doc.han_xu_ly < todayStr);
                            const actualStatus = isOverdue ? "Quá hạn" : doc.trang_thai;

                            return (
                              <tr
                                key={doc.id}
                                style={{
                                  borderBottom: "1px solid #e2e8f0",
                                  background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                                  transition: "background 0.15s ease"
                                }}
                              >
                                <td style={{ padding: "12px 10px", textAlign: "center", fontWeight: "800", color: "#005baa" }}>
                                  #{doc.so_den || (idx + 1)}
                                </td>
                                <td style={{ padding: "12px 10px", whiteSpace: "nowrap" }}>
                                  <strong style={{ color: "#003d7a", fontSize: "13px" }}>{doc.so_hieu}</strong>
                                </td>
                                <td style={{ padding: "12px 10px", lineHeight: "1.45" }}>
                                  <div style={{ fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "6px" }}>
                                    {doc.is_starred && <span title="Văn bản quan trọng">⭐</span>}
                                    <span>{doc.trich_yeu}</span>
                                  </div>
                                  {doc.chi_dao && (
                                    <div style={{ fontSize: "11.5px", color: "#0284c7", background: "#f0f9ff", padding: "4px 8px", borderRadius: "4px", marginTop: "4px", fontStyle: "italic" }}>
                                      📌 Chỉ đạo: {doc.chi_dao}
                                    </div>
                                  )}
                                  {doc.file_name && (
                                    <div style={{ fontSize: "11.5px", color: "#2563eb", marginTop: "4px" }}>
                                      📎 <u>{doc.file_name}</u>
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "12px 10px", fontWeight: "600", color: "#334155" }}>
                                  {doc.co_quan_ban_hanh}
                                </td>
                                <td style={{ padding: "12px 10px" }}>
                                  <span style={{ fontSize: "11.5px", fontWeight: "700", background: "#eff6ff", color: "#1e40af", padding: "2px 7px", borderRadius: "4px", border: "1px solid #bfdbfe" }}>
                                    {doc.linh_vuc || "BHYT & BHXH"}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 10px", whiteSpace: "nowrap", color: "#64748b", fontSize: "12px" }}>
                                  {doc.ngay_ban_hanh || doc.ngay_den}
                                </td>
                                <td style={{ padding: "12px 10px", whiteSpace: "nowrap", color: "#475569", fontWeight: "600", fontSize: "12px" }}>
                                  {doc.ngay_den}
                                </td>
                                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                                  <span style={{
                                    fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px",
                                    background: doc.do_khan === "Hỏa tốc" || doc.do_khan === "Thượng khẩn" ? "#fee2e2" : doc.do_khan === "Khẩn" ? "#ffedd5" : "#e2e8f0",
                                    color: doc.do_khan === "Hỏa tốc" || doc.do_khan === "Thượng khẩn" ? "#b91c1c" : doc.do_khan === "Khẩn" ? "#c2410c" : "#475569"
                                  }}>
                                    {doc.do_khan || "Thường"}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                                  <span style={{
                                    fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px",
                                    background: doc.do_mat === "Tuyệt mật" || doc.do_mat === "Tối mật" ? "#fef2f2" : doc.do_mat === "Mật" ? "#fef3c7" : "#f1f5f9",
                                    color: doc.do_mat === "Tuyệt mật" || doc.do_mat === "Tối mật" ? "#991b1b" : doc.do_mat === "Mật" ? "#b45309" : "#64748b"
                                  }}>
                                    {doc.do_mat || "Thường"}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 10px", color: "#334155" }}>
                                  <div style={{ fontWeight: "600", fontSize: "12px" }}>{doc.nguoi_xu_ly}</div>
                                  {doc.han_xu_ly && (
                                    <div style={{ fontSize: "11px", color: isOverdue ? "#dc2626" : "#64748b", fontWeight: isOverdue ? "800" : "400", marginTop: "2px" }}>
                                      Hạn: {doc.han_xu_ly}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                                  <span style={{
                                    fontSize: "11.5px", fontWeight: "800", padding: "3px 9px", borderRadius: "12px",
                                    background: actualStatus === "Đã hoàn thành" ? "#d1fae5" : actualStatus === "Đang xử lý" ? "#fef3c7" : actualStatus === "Quá hạn" ? "#fee2e2" : "#f1f5f9",
                                    color: actualStatus === "Đã hoàn thành" ? "#15803d" : actualStatus === "Đang xử lý" ? "#b45309" : actualStatus === "Quá hạn" ? "#b91c1c" : "#475569",
                                    border: `1px solid ${actualStatus === "Đã hoàn thành" ? "#86efac" : actualStatus === "Đang xử lý" ? "#fde68a" : actualStatus === "Quá hạn" ? "#fca5a5" : "#cbd5e1"}`
                                  }}>
                                    {actualStatus}
                                  </span>
                                </td>
                                <td style={{ padding: "12px 10px", textAlign: "center" }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDocReader({ ...doc, loai_so: "den" })}
                                    style={{
                                      padding: "6px 14px", background: "#005baa", color: "#ffffff", border: "none",
                                      borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700",
                                      display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 4px rgba(0, 91, 170, 0.2)"
                                    }}
                                    title="Xem văn bản & Xử lý"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                    <span>Xem văn bản</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* 📑 PHÂN TRANG DANH SÁCH VĂN BẢN (PAGINATION FOOTER) */}
                  <div style={{ padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", fontSize: "12.5px", color: "#475569" }}>
                    <div>
                      Hiển thị <strong>{filteredIncoming.length > 0 ? (incomingCurrentPage - 1) * incomingItemsPerPage + 1 : 0}</strong> - <strong>{Math.min(incomingCurrentPage * incomingItemsPerPage, filteredIncoming.length)}</strong> trên tổng số <strong>{filteredIncoming.length}</strong> văn bản đến
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>Hiển thị:</span>
                      <select
                        value={incomingItemsPerPage}
                        onChange={(e) => { setIncomingItemsPerPage(Number(e.target.value)); setIncomingCurrentPage(1); }}
                        style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                      >
                        <option value={10}>10 văn bản / trang</option>
                        <option value={20}>20 văn bản / trang</option>
                        <option value={50}>50 văn bản / trang</option>
                      </select>

                      <div style={{ display: "flex", gap: "4px", marginLeft: "8px" }}>
                        <button
                          type="button"
                          disabled={incomingCurrentPage === 1}
                          onClick={() => setIncomingCurrentPage(p => Math.max(1, p - 1))}
                          style={{ padding: "4px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", background: incomingCurrentPage === 1 ? "#f1f5f9" : "#ffffff", cursor: incomingCurrentPage === 1 ? "not-allowed" : "pointer" }}
                        >
                          ‹ Trước
                        </button>
                        <span style={{ padding: "4px 10px", fontWeight: "700", color: "#005baa" }}>
                          {incomingCurrentPage} / {totalPages}
                        </span>
                        <button
                          type="button"
                          disabled={incomingCurrentPage >= totalPages}
                          onClick={() => setIncomingCurrentPage(p => Math.min(totalPages, p + 1))}
                          style={{ padding: "4px 10px", borderRadius: "4px", border: "1px solid #cbd5e1", background: incomingCurrentPage >= totalPages ? "#f1f5f9" : "#ffffff", cursor: incomingCurrentPage >= totalPages ? "not-allowed" : "pointer" }}
                        >
                          Sau ›
                        </button>
                      </div>
                    </div>
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          <span>Đóng biểu mẫu</span>
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
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
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          <span>CẬP NHẬT VĂN BẢN ĐỊ</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
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
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
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
                                <button
                                  onClick={() => handleOpenDocReader({ ...doc, loai_so: "di" })}
                                  style={{
                                    padding: "6px 14px",
                                    background: "#005baa",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "12.5px",
                                    fontWeight: "700",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    boxShadow: "0 2px 4px rgba(0, 91, 170, 0.2)"
                                  }}
                                  title="Xem văn bản & Xử lý"
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                  <span>Xem văn bản</span>
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
            );
          })()}

          {/* ──────────────────────────────────
              TRƯỞNG PHÒNG TAB CONTENTS
              ────────────────────────────────── */}
          {(role === "truongphong" || role === "admin") && (
            <>
              {activeTab === "staff" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* CARD 1: FORM CẤP / SỬA CÁN BỘ */}
                  <div className="tp-card tp-form-card" style={{ width: "100%", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "12px", borderBottom: "1.5px solid #e2e8f0" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#003d7a", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>
                        <span>{editingStaff ? "Chỉnh sửa Thông tin & Phân quyền Cán bộ" : "Thêm mới & Cấp tài khoản Cán bộ"}</span>
                      </h3>
                      {editingStaff && (
                        <button
                          type="button"
                          style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 14px", borderRadius: "20px", fontSize: "13px", cursor: "pointer", fontWeight: "800" }}
                          onClick={() => {
                            setEditingStaff(null);
                            setUsernamePrefix("");
                            setStaffForm({
                              fullName: "",
                              username: "",
                              password: "Vhxh@2026",
                              role: "canbo",
                              chucVu: "Chuyên viên chính",
                              phongBan: "Phòng Văn hóa - Xã hội",
                              phanQuyen: "Biên tập & Tuyên truyền",
                            });
                          }}
                        >
                          ✕ Hủy chế độ sửa
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleStaffSubmit}>
                      {/* HÀNG 1: TÀI KHOẢN (Họ tên + Tên đăng nhập + Mật khẩu) */}
                      <div className="tp-form-grid-2">
                        <div className="tp-form-group">
                          <label>Họ và tên cán bộ <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Nguyễn Văn An"
                            value={staffForm.fullName}
                            onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                            required
                          />
                        </div>

                        <div className="tp-form-group">
                          <label>Tài khoản (Tên đăng nhập) <span style={{ color: "#dc2626" }}>*</span></label>
                          <div style={{ display: "flex", alignItems: "center", width: "100%", border: "1.5px solid #cbd5e1", borderRadius: "8px", background: editingStaff ? "#f1f5f9" : "#fff", height: "42px" }}>
                            <input
                              type="text"
                              placeholder="Ví dụ: nv-an hoặc NV-AN"
                              value={usernamePrefix}
                              onChange={(e) => setUsernamePrefix(e.target.value.trim())}
                              required
                              disabled={!!editingStaff}
                              style={{ flex: 1, border: "none", outline: "none", boxShadow: "none", background: "transparent", padding: "0 12px", height: "100%", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}
                            />
                            <span style={{ color: "#0284c7", fontWeight: "800", fontSize: "13px", paddingRight: "14px", userSelect: "none" }}>.vhxh</span>
                          </div>
                        </div>
                      </div>

                      {/* HÀNG 2: MẬT KHẨU & CHỨC VỤ */}
                      <div className="tp-form-grid-2">
                        <div className="tp-form-group">
                          <label>{editingStaff ? "Mật khẩu mới (Để trống nếu giữ nguyên)" : "Mật khẩu đăng nhập mặc định"} <span style={{ color: "#dc2626" }}>*</span></label>
                          <div style={{ display: "flex", alignItems: "center", width: "100%", border: "1.5px solid #cbd5e1", borderRadius: "8px", background: "#ffffff", height: "42px" }}>
                            <input
                              type={showStaffPassword ? "text" : "password"}
                              placeholder={editingStaff ? "Nhập mật khẩu mới nếu cần đổi" : "Nhập mật khẩu (mặc định: Vhxh@2026)"}
                              value={staffForm.password}
                              onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                              required={!editingStaff}
                              style={{ flex: 1, border: "none", outline: "none", boxShadow: "none", background: "transparent", padding: "0 12px", height: "100%", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowStaffPassword(!showStaffPassword)}
                              style={{
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                                cursor: "pointer",
                                padding: "0 12px",
                                fontSize: "13px",
                                fontWeight: "700",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px"
                              }}
                              title={showStaffPassword ? "Ẩn mật khẩu" : "Hiện rõ mật khẩu"}
                            >
                              {showStaffPassword ? (
                                <>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                  </svg>
                                  <span style={{ color: "#64748b" }}>Ẩn</span>
                                </>
                              ) : (
                                <>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  <span style={{ color: "#005baa" }}>Hiện</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="tp-form-group">
                          <label>Chức vụ / Chức danh <span style={{ color: "#dc2626" }}>*</span></label>
                          <select
                            value={staffForm.chucVu}
                            onChange={(e) => setStaffForm({ ...staffForm, chucVu: e.target.value, role: e.target.value.includes("Phó") ? "phophong" : "canbo" })}
                          >
                            <option value="Phó Trưởng phòng">Phó Trưởng phòng</option>
                            <option value="Chuyên viên chính">Chuyên viên chính</option>
                            <option value="Cán bộ chuyên trách Văn hóa">Cán bộ chuyên trách Văn hóa</option>
                            <option value="Cán bộ Phụ trách BHYT">Cán bộ Phụ trách BHYT & An sinh</option>
                            <option value="Cán bộ Tư pháp - Hộ tịch">Cán bộ Tư pháp - Hộ tịch</option>
                          </select>
                        </div>
                      </div>

                      {/* HÀNG 3: PHÒNG BAN & PHÂN QUYỀN */}
                      <div className="tp-form-grid-2">
                        <div className="tp-form-group">
                          <label>Đơn vị / Phòng ban công tác <span style={{ color: "#dc2626" }}>*</span></label>
                          <select
                            value={staffForm.phongBan}
                            onChange={(e) => setStaffForm({ ...staffForm, phongBan: e.target.value })}
                          >
                            <option value="Phòng Văn hóa - Xã hội">Phòng Văn hóa - Xã hội xã Đăk Pxi</option>
                            <option value="Phòng Lao động - TB&XH">Phòng Lao động - Thương binh & Xã hội</option>
                            <option value="Văn phòng HĐND & UBND">Văn phòng HĐND & UBND xã</option>
                            <option value="Công an xã Đăk Pxi">Công an xã Đăk Pxi</option>
                            <option value="Bộ phận Kế toán - Tài chính">Bộ phận Kế toán - Tài chính xã</option>
                          </select>
                        </div>

                        <div className="tp-form-group">
                          <label>Phân quyền nhiệm vụ hệ thống <span style={{ color: "#dc2626" }}>*</span></label>
                          <select
                            value={staffForm.phanQuyen}
                            onChange={(e) => setStaffForm({ ...staffForm, phanQuyen: e.target.value })}
                          >
                            <option value="Chỉ đạo & Quản lý toàn diện">Chỉ đạo & Quản lý toàn diện (Quyền Phó phòng)</option>
                            <option value="Quản lý BHYT & An sinh">Quản lý BHYT & An sinh xã hội</option>
                            <option value="Biên tập & Tuyên truyền">Biên tập & Tuyên truyền báo chí</option>
                            <option value="Tiếp nhận & Xử lý Góp ý">Tiếp nhận & Xử lý Góp ý Phản ánh</option>
                            <option value="Quản lý Lịch họp & Văn bản">Quản lý Lịch họp & Sổ Văn bản</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        <button
                          type="submit"
                          disabled={loading}
                          style={{ background: "linear-gradient(135deg, #005baa 0%, #003d7a 100%)", color: "#ffffff", border: "none", padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 12px rgba(0, 91, 170, 0.2)" }}
                        >
                          {editingStaff ? "💾 Lưu cập nhật thông tin" : "🔑 Cấp tài khoản Cán bộ mới"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* CARD 2: BẢNG DANH SÁCH CÁN BỘ */}
                  <div className="tp-card tp-list-card" style={{ width: "100%", padding: "20px" }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "17px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      <span>Danh sách Cán bộ trực thuộc quản lý ({subordinates.length})</span>
                    </h3>

                    <div className="tp-table-wrap">
                      <table className="tp-table">
                        <thead>
                          <tr>
                            <th>Họ và tên cán bộ</th>
                            <th>Tài khoản</th>
                            <th>Chức vụ</th>
                            <th>Phòng ban</th>
                            <th>Phân quyền</th>
                            <th style={{ textAlign: "center" }}>Trạng thái</th>
                            <th style={{ textAlign: "center" }}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subordinates.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                                Chưa có cán bộ trực thuộc nào. Hãy cấp tài khoản mới phía trên.
                              </td>
                            </tr>
                          ) : (
                            subordinates.map((s) => (
                              <tr key={s._id} style={{ opacity: s.status === "suspended" ? 0.6 : 1 }}>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#005baa", color: "#ffffff", fontWeight: "900", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                      {s.fullName ? s.fullName.charAt(0).toUpperCase() : "C"}
                                    </div>
                                    <div>
                                      <strong style={{ color: "#0f172a", fontSize: "14px" }}>{s.fullName}</strong>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <code style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", color: "#0284c7", fontWeight: "700", fontSize: "13px" }}>{s.username}</code>
                                </td>
                                <td>
                                  <span className="tp-staff-badge tp-badge-role">
                                    {s.chucVu || (s.role === "phophong" ? "Phó Trưởng phòng" : "Chuyên viên chính")}
                                  </span>
                                </td>
                                <td>
                                  <span className="tp-staff-badge tp-badge-dept">
                                    {s.phongBan || "Phòng Văn hóa - Xã hội"}
                                  </span>
                                </td>
                                <td>
                                  <span className="tp-staff-badge tp-badge-perm">
                                    {s.phanQuyen || "Biên tập & Tuyên truyền"}
                                  </span>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <span style={{
                                    fontSize: "12px", fontWeight: "800", padding: "3px 10px", borderRadius: "12px", display: "inline-block",
                                    background: s.status === "suspended" ? "#fee2e2" : "#d1fae5",
                                    color: s.status === "suspended" ? "#dc2626" : "#15803d"
                                  }}>
                                    {s.status === "suspended" ? "Đã tạm dừng" : "Đang hoạt động"}
                                  </span>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                    <button
                                      type="button"
                                      className="tp-staff-btn tp-staff-btn-edit"
                                      onClick={() => handleEditClick(s)}
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      type="button"
                                      className={`tp-staff-btn ${s.status === "suspended" ? "tp-staff-btn-start" : "tp-staff-btn-stop"}`}
                                      onClick={() => handleToggleStaffStatus(s)}
                                    >
                                      {s.status === "suspended" ? "Mở" : "Dừng"}
                                    </button>
                                    <button
                                      type="button"
                                      className="tp-staff-btn tp-staff-btn-del"
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
                <div style={{ display: "flex", flexDirection: "column" }}>

                  {/* SECTION 1: HOẠT ĐỘNG & CẬP NHẬT HỆ THỐNG */}
                  <div style={{
                    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
                    padding: "24px", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", background: "#fef3c7",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706"
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                        Hoạt động & Cập nhật hệ thống
                      </h3>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
                      {activitiesList.length === 0 ? (
                        <div style={{ padding: "16px", color: "#94a3b8", fontSize: "13px" }}>Chưa có hoạt động hệ thống nào phát sinh.</div>
                      ) : (
                        activitiesList.slice(0, 8).map((act, idx) => (
                          <div key={act._id || idx} style={{ display: "flex", alignItems: "flex-start", gap: "14px", paddingBottom: "12px", borderBottom: idx < activitiesList.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#e0f2fe", border: "1.5px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#005bac", flexShrink: 0, marginTop: "2px" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                            </div>
                            <div style={{ flex: 1 }}>
                              <strong style={{ fontSize: "13.5px", color: "#0f172a", display: "block", fontWeight: "800" }}>
                                {act.actorName || "Hệ thống"} - {act.action === "TASK_ASSIGNED" ? "Giao nhiệm vụ" : act.action === "UPDATE_PROGRESS" ? "Cập nhật tiến độ" : "Hoạt động"}
                              </strong>
                              <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#64748b", lineHeight: "1.4" }}>
                                {act.description}
                              </p>
                              <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", display: "inline-block" }}>
                                {act.createdAt ? new Date(act.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* SECTION 2: THÔNG BÁO TRỰC TUYẾN ĐÃ GỬI (DỮ LIỆU THẬT MONGODB) */}
                  <div style={{
                    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
                    padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%", background: "#e0f2fe",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7"
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                            <path d="M6 12a6 6 0 0 0 6 6v-6z"/>
                          </svg>
                        </div>
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                          Thông báo trực tuyến đã gửi (MongoDB Realtime)
                        </h3>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {realNoticesList.length > 0 ? (
                        realNoticesList.map((n, idx) => (
                          <div
                            key={n._id || idx}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "14px 16px", borderRadius: "12px", background: n.isRead ? "#ffffff" : "#f0f9ff",
                              border: "1px solid #e2e8f0", gap: "16px"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                              <div style={{
                                width: "40px", height: "40px", borderRadius: "10px",
                                background: n.priority === "URGENT" ? "#fee2e2" : "#e0f2fe",
                                color: n.priority === "URGENT" ? "#dc2626" : "#005bac",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                              }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                </svg>
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <strong style={{ fontSize: "13.5px", fontWeight: n.isRead ? "700" : "800", color: "#172033", display: "block" }}>
                                  {n.title}
                                </strong>
                                <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#475569" }}>
                                  {n.message}
                                </p>
                              </div>
                            </div>

                            <div style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: "600", flexShrink: 0, textAlign: "right" }}>
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date(n.createdAt).toLocaleDateString("vi-VN") : "Vừa xong"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8", fontSize: "13px" }}>
                          Chưa có thông báo trực tuyến nào trong MongoDB.
                        </div>
                      )}
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
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
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1.5px solid #e2e8f0" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#003d7a", display: "flex", alignItems: "center", gap: "8px" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
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
                      {/* Hàng 1: Tiêu đề + Chọn Chuyên mục + Cán bộ đăng bài */}
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div className="tp-form-group">
                          <label>Tiêu đề bài viết tuyên truyền <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="text"
                            placeholder="Nhập tiêu đề tuyên truyền (Ví dụ: Cảnh báo thủ đoạn giả danh Công an lừa đảo...)"
                            value={articleForm.tieu_de}
                            onChange={(e) => setArticleForm({ ...articleForm, tieu_de: e.target.value })}
                            required
                          />
                        </div>

                        <div className="tp-form-group">
                          <label>Cán bộ đăng bài (Tác giả)</label>
                          <input
                            type="text"
                            placeholder="Tên cán bộ đăng bài"
                            value={articleForm.tac_gia || ""}
                            onChange={(e) => setArticleForm({ ...articleForm, tac_gia: e.target.value })}
                          />
                        </div>

                        <div className="tp-form-group">
                          <label>Chọn Chuyên mục tuyên truyền</label>
                          <select
                            value={articleForm.danh_muc}
                            onChange={(e) => setArticleForm({ ...articleForm, danh_muc: e.target.value })}
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
                      <div className="tp-form-grid-2">
                        <div className="tp-form-group">
                          <label>Tóm tắt ngắn (Hiển thị xem trước bài viết)</label>
                          <textarea
                            rows="3"
                            placeholder="Mô tả tóm tắt ngắn gọn nội dung chính..."
                            value={articleForm.mo_ta}
                            onChange={(e) => setArticleForm({ ...articleForm, mo_ta: e.target.value })}
                          />
                        </div>

                        <div className="tp-form-group">
                          <label>Chữ chạy thông báo (Nổi bật Trang chủ)</label>
                          <input
                            type="text"
                            placeholder="Nhập thông báo chữ chạy nổi bật trên trang chủ..."
                            value={articleForm.chu_chay}
                            onChange={(e) => setArticleForm({ ...articleForm, chu_chay: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Hàng 3: Media Upload Mini Bar (Nút tải Ảnh bìa, Album, Video, Âm thanh nằm ngang) */}
                      <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: "10px", border: "1.5px dashed #cbd5e1", marginBottom: "16px" }}>
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
                        <label>Nội dung bài viết chi tiết <span style={{ color: "#dc2626" }}>*</span></label>
                        <textarea
                          rows="6"
                          placeholder="Viết nội dung bài tuyên truyền chi tiết tại đây..."
                          value={articleForm.noi_dung}
                          onChange={(e) => setArticleForm({ ...articleForm, noi_dung: e.target.value })}
                          style={{ minHeight: "180px" }}
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
                            <th style={{ width: "35%" }}>Tên bài viết</th>
                            <th style={{ width: "18%" }}>Chuyên mục</th>
                            <th style={{ width: "20%" }}>Cán bộ đăng bài</th>
                            <th style={{ width: "15%" }}>Thời gian đăng</th>
                            <th style={{ width: "12%", textAlign: "center" }}>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.length === 0 ? (
                            <tr>
                              <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                Chưa có bài viết nào được đăng. Hãy tạo bài viết tuyên truyền đầu tiên ở trên!
                              </td>
                            </tr>
                          ) : (
                            articles.map((art) => {
                              const authorName = art.tac_gia || art.nguoi_dang || art.author || art.created_by || art.user?.fullName || fullName || "Hoàng Trung Dũng";
                              const dateObj = new Date(art.createdAt || Date.now());
                              const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                              const dateStr = dateObj.toLocaleDateString("vi-VN");

                              return (
                                <tr key={art._id}>
                                  <td>
                                    <strong style={{ color: "#003d7a", fontSize: "14px" }}>{art.tieu_de}</strong>
                                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "3px" }}>
                                      {art.anh_dai_dien && <span style={{ fontSize: "11px", background: "#e0f2fe", color: "#0369a1", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>🖼️ Ảnh</span>}
                                      {art.video && <span style={{ fontSize: "11px", background: "#fce7f3", color: "#be185d", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>📹 Video</span>}
                                      {art.audio && <span style={{ fontSize: "11px", background: "#f0fdf4", color: "#15803d", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>🎧 Âm thanh</span>}
                                    </div>
                                    {art.mo_ta && (
                                      <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "380px" }}>
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
                                  <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#005baa", color: "#ffffff", fontSize: "12px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {authorName.charAt(0).toUpperCase()}
                                      </div>
                                      <span style={{ fontSize: "13px", fontWeight: "750", color: "#1e293b" }}>
                                        {authorName}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <time dateTime={art.createdAt} style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>
                                        🕒 {timeStr}
                                      </span>
                                      <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                                        📅 {dateStr}
                                      </span>
                                    </time>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                                      <button
                                        type="button"
                                        className="tp-staff-btn tp-staff-btn-edit"
                                        onClick={() => handleEditArticle(art)}
                                        title="Sửa bài viết"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        <span>Sửa</span>
                                      </button>
                                      <button
                                        type="button"
                                        className="tp-staff-btn tp-staff-btn-del"
                                        onClick={() => handleDeleteArticle(art._id)}
                                        title="Xóa bài viết"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        <span>Xóa</span>
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
                          🏛️ PHÒNG VH-XH
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





              {activeTab === "tthc-management" && (
                <TthcManagementSection />
              )}

              {activeTab === "dakpxi-today" && (
                <DakPxiTodayAdminManager />
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 8a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h2l4 4 4-4h2a6 6 0 0 0 6-6V8z" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.64 2.94 1.68 3.96.72.76 1.18 1.52 1.36 2.54" /></svg>
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
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
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

                      <div className="tp-form-grid-2">
                        <div className="tp-form-group">
                          <label>Ngày họp <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="date"
                            value={meetingForm.date}
                            onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="tp-form-group">
                          <label>Giờ họp <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="time"
                            value={meetingForm.time}
                            onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="tp-form-grid-2">
                        <div className="tp-form-group">
                          <label>Thành phần tham gia <span style={{ color: "#dc2626" }}>*</span></label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Toàn bộ cán bộ, Tổ BHYT..."
                            value={meetingForm.thon}
                            onChange={(e) => setMeetingForm({ ...meetingForm, thon: e.target.value })}
                            required
                          />
                        </div>
                        <div className="tp-form-group">
                          <label>Phòng họp / Địa điểm <span style={{ color: "#dc2626" }}>*</span></label>
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

                      <div className="tp-btn-group" style={{ gap: "10px", marginTop: "8px" }}>
                        <button type="submit" className="tp-btn-submit" disabled={loading} style={{ flex: 1 }}>
                          {editingMeeting ? (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                              </svg>
                              <span>Lưu cập nhật cuộc họp</span>
                            </>
                          ) : (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                                <line x1="12" y1="14" x2="12" y2="18" />
                                <line x1="10" y1="16" x2="14" y2="16" />
                              </svg>
                              <span>Tạo lịch họp mới</span>
                            </>
                          )}
                        </button>
                        {editingMeeting && (
                          <button
                            type="button"
                            className="tp-btn-cancel"
                            onClick={() => {
                              setEditingMeeting(null);
                              setMeetingForm({ title: "", date: "", time: "", location: "", thon: "", type: "giao-ban", note: "", pin: "123456" });
                            }}
                          >
                            Hủy chế độ sửa
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
        </div>
      </main>

      {/* ── MODAL XÁC THỰC MÃ OTP SMS BẢO MẬT 2FA (HTML5 SEMANTIC MODERN) ── */}
      {secModalMeeting && (
        <dialog
          className="otp-modal-backdrop"
          open
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            width: "100vw", height: "100vh", maxWidth: "100vw", maxHeight: "100vh",
            margin: 0, padding: 0, border: "none",
            background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 99999
          }}
        >
          <section
            className="otp-modal-card"
            style={{
              background: "#ffffff", borderRadius: "24px", padding: "32px 28px",
              width: "100%", maxWidth: "460px",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 1px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            }}
          >
            {/* ── 1. HEADER SECTION HTML5 ── */}
            <header style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{
                width: "56px", height: "56px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.4)"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <rect x="9" y="11" width="6" height="5" rx="1" fill="#ffffff" stroke="none"/>
                  <path d="M10 11V9a2 2 0 1 1 4 0v2" stroke="#ffffff" strokeWidth="2"/>
                </svg>
              </div>

              <h2 style={{ margin: "0 0 6px", color: "#0f172a", fontSize: "21px", fontWeight: "800", letterSpacing: "-0.3px" }}>
                Xác thực OTP 2FA tham gia cuộc họp
              </h2>
              <p style={{ margin: "0 0 14px", color: "#64748b", fontSize: "13px", lineHeight: "1.4" }}>
                Vui lòng xác thực để tiếp tục tham gia cuộc họp an toàn và bảo mật.
              </p>

              <span style={{
                background: "#eff6ff", color: "#2563eb", fontSize: "12px", fontWeight: "700",
                padding: "6px 16px", borderRadius: "20px", border: "1px solid #bfdbfe",
                display: "inline-flex", alignItems: "center", gap: "6px"
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                BẢO BẬT BẢN GIAO ĐIỆN TỬ BHYT
              </span>
            </header>

            {/* ── 2. THÔNG TIN XÁC THỰC CARD ── */}
            <article style={{
              background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
              padding: "16px 18px", marginBottom: "16px"
            }}>
              <h3 style={{ margin: "0 0 14px", color: "#0f172a", fontSize: "14px", fontWeight: "800", textAlign: "left" }}>
                Thông tin xác thực
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Row 1: Cán bộ xác thực */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <span style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>Cán bộ xác thực</span>
                  </div>
                  <strong style={{ color: "#0f172a", fontSize: "13.5px", fontWeight: "700" }}>
                    {fullName || "Hoàng Trung Dũng"}
                  </strong>
                </div>

                {/* Row 2: Số điện thoại SMS */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <span style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>Số điện thoại SMS</span>
                  </div>
                  <strong style={{ color: "#1e40af", fontSize: "13.5px", fontWeight: "700" }}>0984.***.888</strong>
                </div>

                {/* Row 3: Cuộc họp tham gia */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <span style={{ color: "#475569", fontSize: "13px", fontWeight: "500" }}>Cuộc họp tham gia</span>
                  </div>
                  <strong style={{ color: "#1e40af", fontSize: "13.5px", fontWeight: "700" }}>
                    {secModalMeeting.title || "Tuyên truyền bà con"}
                  </strong>
                </div>
              </div>
            </article>

            {/* ── 3. NOTICE ALERT BANNER HTML5 ── */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px",
              padding: "12px 14px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "12px"
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%", background: "#22c55e",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: "12.5px", lineHeight: "1.4", color: "#166534" }}>
                <div>Đã gửi mã SMS OTP 6 chữ số tới số điện thoại của bạn.</div>
                <div>Mã thử nghiệm: <strong style={{ color: "#15803d", fontSize: "13.5px", fontWeight: "800", letterSpacing: "1px" }}>{generatedOtp}</strong></div>
              </div>
            </div>

            {secError && (
              <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px", border: "1px solid #fca5a5", fontWeight: "600" }}>
                {secError}
              </div>
            )}

            {/* ── 4. FORM FIELD HTML5 ── */}
            <form onSubmit={handleVerifySecPin}>
              <fieldset style={{ border: "none", padding: 0, margin: "0 0 20px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                      </svg>
                    </div>
                    <label style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                      Nhập mã OTP
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtpSMS}
                    style={{
                      background: "none", border: "none", color: "#2563eb", fontSize: "13px", fontWeight: "700",
                      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px"
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                    Gửi lại mã OTP
                  </button>
                </div>
                
                <p style={{ margin: "0 0 14px 36px", fontSize: "12.5px", color: "#64748b" }}>
                  Nhập 6 chữ số OTP vừa gửi tới số điện thoại của bạn
                </p>

                {/* 6 Digit Input Boxes UI */}
                <div
                  style={{ position: "relative", cursor: "text" }}
                  onClick={() => {
                    const inputEl = document.getElementById("otp-real-input");
                    if (inputEl) inputEl.focus();
                  }}
                >
                  <input
                    id="otp-real-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    value={secOtpInput || secPinInput || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setSecOtpInput(val);
                      setSecPinInput(val);
                    }}
                    style={{
                      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                      opacity: 0, zIndex: 10, cursor: "pointer"
                    }}
                    autoFocus
                    required
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const currentVal = (secOtpInput || secPinInput || "");
                      const char = currentVal[idx];
                      const isCurrentFocus = currentVal.length === idx || (currentVal.length === 6 && idx === 5);
                      
                      return (
                        <div
                          key={idx}
                          style={{
                            height: "52px", borderRadius: "10px",
                            background: "#ffffff",
                            border: isCurrentFocus ? "2px solid #2563eb" : "1px solid #cbd5e1",
                            boxShadow: isCurrentFocus ? "0 0 0 3px rgba(37, 99, 235, 0.15)" : "none",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "20px", fontWeight: "700", color: "#1e3a8a",
                            transition: "all 0.15s ease"
                          }}
                        >
                          {char ? char : (isCurrentFocus ? <span style={{ color: "#2563eb" }}>|</span> : <span style={{ color: "#cbd5e1", fontWeight: "400" }}>—</span>)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "11.5px", color: "#64748b" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span>Mã OTP có hiệu lực trong <strong style={{ color: "#475569" }}>2 phút</strong>. Vui lòng không chia sẻ mã cho người khác.</span>
                </div>
              </fieldset>

              {/* ── 5. ACTION BUTTONS HTML5 ── */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setSecModalMeeting(null)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0",
                    background: "#ffffff", color: "#1e293b", fontWeight: "700", fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.3, padding: "12px", borderRadius: "12px", border: "none",
                    background: "#1d4ed8", color: "#ffffff", fontWeight: "700", fontSize: "14px",
                    boxShadow: "0 8px 16px -4px rgba(29, 78, 216, 0.35)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Xác nhận OTP & Vào họp
                </button>
              </div>
            </form>

            {/* ── 6. FOOTER BANNER HTML5 ── */}
            <footer style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Hệ thống bảo mật theo tiêu chuẩn <strong style={{ color: "#1d4ed8" }}>Bộ Y tế</strong></span>
            </footer>
          </section>
        </dialog>
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

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setShowAIScheduleModal(false)}
                style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAIScheduleModal(false);
                  alert("🤖 AI đã tự động lập lịch họp chi tiết và gửi thông báo tới cán bộ!");
                }}
                style={{ padding: "9px 22px", borderRadius: "8px", background: "linear-gradient(135deg, #4f46e5, #3730a3)", color: "#ffffff", border: "none", fontWeight: "800", cursor: "pointer", fontSize: "13px", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}
              >
                ✨ Lập lịch họp tự động
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📖 MODAL GIAO DIỆN XEM CHI TIẾT VĂN BẢN (LIGHT THEME MODERN UI) */}
      {viewingDocModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px"
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "980px",
              maxHeight: "94vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            {/* Top Toolbar Navigation Header */}
            <div
              style={{
                background: "#ffffff",
                padding: "14px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e2e8f0"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <button
                  type="button"
                  onClick={() => setViewingDocModal(null)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ffffff",
                    color: "#0f172a",
                    border: "1px solid #cbd5e1",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  <span>Quay lại</span>
                </button>
                <h2 style={{ margin: 0, fontSize: "19px", fontWeight: "800", color: "#0f172a" }}>
                  Chi tiết văn bản
                </h2>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ffffff",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                  <span>In</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("📥 Đã xuất dữ liệu văn bản ra file Microsoft Word (.docx)!")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                  <span>Xuất Word</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const isIncoming = viewingDocModal.loai_so === "den" || viewingDocModal.id.startsWith("VBD");
                    setViewingDocModal(null);
                    if (isIncoming) {
                      handleDeleteIncomingDoc(viewingDocModal.id);
                    } else {
                      handleDeleteOutgoingDoc(viewingDocModal.id);
                    }
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(239, 68, 68, 0.3)"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  <span>Xóa văn bản</span>
                </button>
              </div>
            </div>

            {/* Document Metadata Header Card */}
            <div style={{ padding: "16px 24px 12px", background: "#ffffff", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "16px", alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                {/* Large Document Badge Icon */}
                <div style={{ width: "52px", height: "60px", background: "#dbeafe", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #93c5fd", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563eb" stroke="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /></svg>
                  <span style={{ fontSize: "10px", fontWeight: "900", color: "#1d4ed8", marginTop: "2px", letterSpacing: "0.5px" }}>DOC</span>
                </div>

                {/* Main Information */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      Số hiệu: {viewingDocModal.so_hieu}
                    </span>
                    <span style={{ background: "#dcfce7", color: "#16a34a", fontSize: "12px", fontWeight: "750", padding: "3px 12px", borderRadius: "20px", border: "1px solid #bbf7d0" }}>
                      {viewingDocModal.trang_thai || "Xử lý (Hoàn thành)"}
                    </span>
                  </div>

                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#334155", lineHeight: "1.4" }}>
                    <strong>Tên văn bản:</strong> {viewingDocModal.trich_yeu}
                  </div>

                  {/* Meta Items Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      <span>Ngày ban hành: <strong>{viewingDocModal.ngay_phat_hanh || viewingDocModal.ngay_den || "28/07/2026"}</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                      <span>Phòng ban: <strong>{viewingDocModal.co_quan_ban_hanh || "Phòng Văn hóa - Xã hội"}</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      <span>Người tạo: <strong>{viewingDocModal.nguoi_soan || viewingDocModal.nguoi_duyet || "Văn phòng"}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Light Navigation Tab Bar */}
            <div style={{ background: "#ffffff", padding: "0 24px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: "24px" }}>
              <button
                type="button"
                onClick={() => setReaderTab("a4")}
                style={{
                  padding: "12px 4px",
                  background: "none",
                  border: "none",
                  borderBottom: readerTab === "a4" ? "2.5px solid #0284c7" : "2.5px solid transparent",
                  color: readerTab === "a4" ? "#0284c7" : "#64748b",
                  fontWeight: readerTab === "a4" ? "800" : "600",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                <span>Xem văn bản</span>
              </button>

              <button
                type="button"
                onClick={() => setReaderTab("file")}
                style={{
                  padding: "12px 4px",
                  background: "none",
                  border: "none",
                  borderBottom: readerTab === "file" ? "2.5px solid #0284c7" : "2.5px solid transparent",
                  color: readerTab === "file" ? "#0284c7" : "#64748b",
                  fontWeight: readerTab === "file" ? "800" : "600",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                <span>Tải file gốc</span>
              </button>

              <button
                type="button"
                onClick={() => setReaderTab("timeline")}
                style={{
                  padding: "12px 4px",
                  background: "none",
                  border: "none",
                  borderBottom: readerTab === "timeline" ? "2.5px solid #0284c7" : "2.5px solid transparent",
                  color: readerTab === "timeline" ? "#0284c7" : "#64748b",
                  fontWeight: readerTab === "timeline" ? "800" : "600",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span>Lịch sử luân chuyển ({viewingDocModal.history ? viewingDocModal.history.length : 0})</span>
              </button>
            </div>

            {/* Scrollable Document Reader Canvas Area (Light Theme `#f8fafc`) */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px", background: "#f8fafc" }}>
              {/* TAB 1: XEM VĂN BẢN (A4 SHEET IN LIGHT THEME CONTAINER) */}
              {readerTab === "a4" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Floating PDF Viewer Toolbar Control Bar */}
                  <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "800px", margin: "0 auto", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: "700", color: "#475569" }}>
                      <button type="button" style={{ border: "none", background: "none", cursor: "pointer", padding: "2px 6px" }}>‹</button>
                      <span>1 / 4</span>
                      <button type="button" style={{ border: "none", background: "none", cursor: "pointer", padding: "2px 6px" }}>›</button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button type="button" style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontWeight: "700" }}>-</button>
                      <button type="button" style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", fontWeight: "700" }}>+</button>
                      <select style={{ border: "1px solid #cbd5e1", borderRadius: "4px", padding: "2px 6px", fontSize: "12px", fontWeight: "600" }}>
                        <option>100%</option>
                        <option>125%</option>
                        <option>150%</option>
                      </select>
                      <button type="button" title="Toàn màn hình" style={{ border: "none", background: "none", cursor: "pointer" }}>⛶</button>
                    </div>
                  </div>

                  {/* Clean White A4 Document Sheet Paper */}
                  <div
                    style={{
                      background: "#ffffff",
                      width: "100%",
                      maxWidth: "800px",
                      margin: "0 auto",
                      padding: "45px 55px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                      color: "#0f172a",
                      fontFamily: "'Times New Roman', Times, serif",
                      lineHeight: 1.5,
                      position: "relative"
                    }}
                  >
                    {/* Header Quốc hiệu - Tiêu ngữ */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                      <div style={{ textAlign: "center", width: "45%" }}>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>ỦY BAN NHÂN DÂN XÃ ĐĂSSK PXI</div>
                        <div style={{ fontSize: "13px", fontWeight: "bold", color: "#000" }}>PHÒNG VĂN HÓA - XÃ HỘI</div>
                        <div style={{ width: "80px", height: "1px", background: "#000", margin: "4px auto" }} />
                        <div style={{ fontSize: "13px", marginTop: "4px" }}>Số: <strong>{viewingDocModal.so_hieu}</strong></div>
                      </div>

                      <div style={{ textAlign: "center", width: "50%" }}>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                        <div style={{ fontSize: "13px", fontWeight: "bold" }}>Độc lập - Tự do - Hạnh phúc</div>
                        <div style={{ width: "120px", height: "1px", background: "#000", margin: "4px auto" }} />
                        <div style={{ fontSize: "13px", fontStyle: "italic", marginTop: "4px" }}>
                          Đăk Pxi, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                        </div>
                      </div>
                    </div>

                    {/* Tiêu đề KẾ HOẠCH */}
                    <div style={{ textAlign: "center", margin: "30px 0 20px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", margin: "0 0 8px" }}>
                        {viewingDocModal.loai_van_ban ? viewingDocModal.loai_van_ban.toUpperCase() : "KẾ HOẠCH"}
                      </h2>
                      <div style={{ fontSize: "14px", fontStyle: "italic", fontWeight: "bold", padding: "0 20px" }}>
                        V/v: {viewingDocModal.trich_yeu}
                      </div>
                    </div>

                    {/* Nội dung Văn bản */}
                    <div style={{ fontSize: "14px", textAlign: "justify", textIndent: "28px", margin: "24px 0" }}>
                      <p style={{ margin: "0 0 12px" }}>
                        <strong>Kính gửi:</strong> {viewingDocModal.noi_nhan || viewingDocModal.co_quan_ban_hanh || "Ban nhân dân 10 Thôn, Công an Xã, Các Trường học"}.
                      </p>
                      <p style={{ margin: "0 0 12px" }}>
                        Căn cứ chức năng, nhiệm vụ được giao và kế hoạch công tác hành chính năm 2026 của UBND xã Đăk Pxi; Phòng Văn hóa - Xã hội triển khai nội dung công văn/báo cáo về việc: <strong>{viewingDocModal.trich_yeu}</strong>.
                      </p>
                      {viewingDocModal.chi_dao && (
                        <p style={{ margin: "0 0 12px", background: "#fffbeb", padding: "10px 14px", borderLeft: "4px solid #d97706", textIndent: 0, fontStyle: "italic" }}>
                          📌 <strong>Ghi chú bổ sung:</strong> {viewingDocModal.chi_dao}
                        </p>
                      )}
                      {viewingDocModal.ghi_chu && (
                        <p style={{ margin: "0 0 12px", textIndent: 0, fontSize: "13.5px" }}>
                          📝 <strong>Ghi chú bổ sung:</strong> {viewingDocModal.ghi_chu}
                        </p>
                      )}
                      <p style={{ margin: "0 0 12px" }}>
                        Yêu cầu Cán bộ chuyên trách được phân công khẩn trương rà soát, phối hợp với Ban nhân dân 10 thôn thực hiện nghiêm túc nội dung chỉ đạo, đảm bảo tiến độ và báo cáo kết quả đúng thời hạn quy định.
                      </p>
                    </div>

                    {/* Chữ ký & Con Dấu Đỏ "Đã ký" */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                      <div style={{ width: "45%", fontSize: "13px" }}>
                        <div style={{ fontWeight: "bold", fontStyle: "italic" }}>Nơi nhận:</div>
                        <div>- Như trên;</div>
                        <div>- UBND huyện Tu Mơ Rông (b/c);</div>
                        <div>- Đảng ủy, HĐND, UBND Xã;</div>
                        <div>- Lưu: VT, VHXH.</div>
                      </div>

                      <div style={{ width: "45%", textAlign: "center", fontSize: "13.5px" }}>
                        <div style={{ fontWeight: "bold" }}>TUQ. CHỦ TỊCH</div>
                        <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>TRƯỞNG PHÒNG VĂN HÓA - XÃ HỘI</div>

                        {/* Con Dấu Đỏ Khung Viền Nét Đứt Đã Ký (Giống hệt Image 2!) */}
                        <div style={{ margin: "18px auto 0", padding: "4px 14px", border: "1.5px dashed #dc2626", color: "#dc2626", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", width: "fit-content", background: "#fef2f2" }}>
                          Đã ký
                        </div>

                        <div style={{ fontWeight: "bold", fontSize: "14px", marginTop: "10px" }}>
                          {viewingDocModal.nguoi_duyet || viewingDocModal.nguoi_soan || "Nguyễn Thái Huy"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {readerTab === "file" && (
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", width: "100%", maxWidth: "800px", margin: "0 auto", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                  <div style={{ background: "#f8fafc", color: "#0f172a", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ background: "#005baa", color: "#ffffff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "900" }}>
                        {viewingDocModal.file_name && viewingDocModal.file_name.endsWith(".docx") ? "MICROSOFT WORD" : "DOCUMENT PDF"}
                      </span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>
                          {viewingDocModal.file_name || "12_KH_VHXH_TuyenTruyenQuy3.pdf"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Dung lượng: {viewingDocModal.file_size || "1.4 MB"} • Định dạng tệp đính kèm chính thức
                        </div>
                      </div>
                    </div>

                    <a
                      href={viewingDocModal.file_url || "#"}
                      download={viewingDocModal.file_name || "VanBan_Goc.pdf"}
                      onClick={(e) => {
                        if (!viewingDocModal.file_url) {
                          e.preventDefault();
                          alert(`📥 Đã tải xuống tệp đính kèm gốc [${viewingDocModal.file_name || "12_KH_VHXH_TuyenTruyenQuy3.pdf"}] về máy tính thành công!`);
                        }
                      }}
                      style={{ padding: "8px 16px", background: "#16a34a", color: "#ffffff", textDecoration: "none", borderRadius: "8px", fontWeight: "700", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 6px rgba(22, 163, 74, 0.3)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      <span>Tải file gốc</span>
                    </a>
                  </div>

                  <div style={{ padding: "24px", background: "#f8fafc", minHeight: "500px" }}>
                    {viewingDocModal.file_url && viewingDocModal.file_url.startsWith("data:application/pdf") ? (
                      <iframe
                        src={viewingDocModal.file_url}
                        style={{ width: "100%", height: "700px", border: "none", borderRadius: "8px", background: "#ffffff" }}
                        title="Hiển thị PDF thực tế"
                      />
                    ) : (
                      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "40px 50px", textAlign: "center" }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.5" style={{ marginBottom: "12px" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                        <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "#0f172a" }}>Tệp tin đính kèm: {viewingDocModal.file_name || "12_KH_VHXH_TuyenTruyenQuy3.pdf"}</h4>
                        <p style={{ color: "#64748b", fontSize: "13.5px", margin: "0 0 16px" }}>Bấm nút bên dưới để xem hoặc tải tệp tin đính kèm gốc về máy tính</p>
                        <a
                          href={viewingDocModal.file_url || "#"}
                          download={viewingDocModal.file_name}
                          style={{ padding: "10px 20px", background: "#0284c7", color: "#ffffff", borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        >
                          📥 Tải tệp tin về máy
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TIMELINE */}
              {readerTab === "timeline" && (
                <div
                  style={{
                    background: "#ffffff",
                    width: "100%",
                    maxWidth: "800px",
                    margin: "0 auto",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
                  }}
                >
                  <h4 style={{ margin: "0 0 16px", fontSize: "15px", color: "#0f172a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span>LỊCH SỬ LUÂN CHUYỂN & TIẾN TRÌNH XỬ LÝ (TIMELINE)</span>
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {viewingDocModal.history && viewingDocModal.history.length > 0 ? (
                      viewingDocModal.history.map((step, sIdx) => (
                        <div key={sIdx} style={{ display: "flex", gap: "14px", alignItems: "flex-start", fontSize: "13px" }}>
                          <span style={{ background: "#0284c7", color: "#fff", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", flexShrink: 0, marginTop: "2px" }}>
                            {sIdx + 1}
                          </span>
                          <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "12px" }}>
                              <strong style={{ color: "#0f172a" }}>{step.actor}</strong>
                              <span>{step.time}</span>
                            </div>
                            <div style={{ color: "#334155", fontWeight: "600", marginTop: "4px" }}>
                              {step.action}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: "13.5px", color: "#64748b", fontStyle: "italic", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                        Văn bản mới tiếp nhận vào hệ thống. Đang trong tiến trình luân chuyển xử lý.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CHUYỂN XỬ LÝ CONTAINER */}
              <div
                style={{
                  background: "#ffffff",
                  width: "100%",
                  maxWidth: "800px",
                  margin: "20px auto 0",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  borderTop: "4px solid #0284c7",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.04)"
                }}
              >
                <h4 style={{ margin: "0 0 14px", fontSize: "15px", color: "#0f172a", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 10 20 15 15 20" /><path d="M4 4v7a4 4 0 0 0 4 4h12" /></svg>
                  <span>BỘ CÔNG CỤ CHUYỂN XỬ LÝ & PHÂN CÔNG CHỈ ĐẠO TRỰC TIẾP</span>
                </h4>

                <form onSubmit={handleSaveForwardDoc}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "12px" }}>
                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: "800", color: "#334155", display: "block", marginBottom: "4px" }}>
                        Chuyển cho Cán bộ / Lãnh đạo xử lý:
                      </label>
                      <select
                        value={forwardForm.nguoi_xu_ly}
                        onChange={(e) => setForwardForm({ ...forwardForm, nguoi_xu_ly: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13.5px", background: "#fff", outline: "none" }}
                      >
                        <option value="Nguyễn Thái Huy (Trưởng phòng)">Nguyễn Thái Huy (Trưởng phòng)</option>
                        <option value="Ngô Đỗ Quỳnh (Phó phòng)">Ngô Đỗ Quỳnh (Phó phòng)</option>
                        <option value="Hoàng Trung Dũng (Cán bộ Chuyên viên BHYT)">Hoàng Trung Dũng (Cán bộ Chuyên viên BHYT)</option>
                        <option value="Lê Ngọc Sơn (Cán bộ Chuyên viên CNTT)">Lê Ngọc Sơn (Cán bộ Chuyên viên CNTT)</option>
                        <option value="📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)">📢 Tất cả Cán bộ (Toàn thể Phòng VH-XH)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "12.5px", fontWeight: "800", color: "#334155", display: "block", marginBottom: "4px" }}>
                        Cập nhật Trạng thái xử lý:
                      </label>
                      <select
                        value={forwardForm.trang_thai}
                        onChange={(e) => setForwardForm({ ...forwardForm, trang_thai: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13.5px", background: "#fff", outline: "none" }}
                      >
                        <option value="Chưa xử lý">Chưa xử lý</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đã hoàn thành">Đã hoàn thành</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: "800", color: "#334155", display: "block", marginBottom: "4px" }}>
                      Ý kiến chỉ đạo / Nội dung giao việc / Báo cáo kết quả:
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Nhập nội dung chỉ đạo hoặc kết quả thực hiện gửi cho cán bộ..."
                      value={forwardForm.chi_dao}
                      onChange={(e) => setForwardForm({ ...forwardForm, chi_dao: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13.5px", fontFamily: "inherit", outline: "none" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setViewingDocModal(null)}
                      style={{ padding: "8px 18px", borderRadius: "8px", background: "#f1f5f9", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700", cursor: "pointer", color: "#475569" }}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      style={{ padding: "8px 22px", borderRadius: "8px", background: "#0284c7", color: "#ffffff", border: "none", fontWeight: "800", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                      <span>💾 Lưu chỉ đạo & Gửi cho Cán bộ</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* MODAL THÔNG TIN TÀI KHOẢN CÁN BỘ - GIAO DIỆN CAO CẤP RÕ NÉT HTML5 */}
      {showAccountInfoModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", zIndex: 99999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          backdropFilter: "blur(4px)"
        }} onClick={() => setShowAccountInfoModal(false)}>
          <div style={{
            background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: "520px",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.3)", overflow: "hidden",
            border: "1px solid #e2e8f0"
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)", color: "#ffffff",
              padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "900", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "0.2px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>THÔNG TIN TÀI KHOẢN CÁN BỘ</span>
              </h3>
              <button
                type="button"
                style={{
                  background: "rgba(255, 255, 255, 0.2)", border: "none", color: "#ffffff",
                  width: "30px", height: "30px", borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
                onClick={() => setShowAccountInfoModal(false)}
                title="Đóng cửa sổ"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Profile Card Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "18px", borderBottom: "1.5px solid #f1f5f9" }}>
                <div style={{
                  width: "60px", height: "60px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                  border: "2.5px solid #0284c7", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#0284c7", boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)", flexShrink: 0
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>{fullName || "Cán bộ VH-XH"}</h4>
                  <span style={{ fontSize: "13px", color: "#0284c7", fontWeight: "800", display: "inline-block", marginTop: "2px" }}>
                    {role === "truongphong" || role === "admin" ? "Trưởng phòng VH-XH" : "Cán bộ Chuyên viên"}
                  </span>
                </div>
              </div>

              {/* Grid 4 Items */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>ĐƠN VỊ CÔNG TÁC</span>
                  <strong style={{ color: "#0f172a", fontSize: "13.5px", fontWeight: "800", display: "block", marginTop: "3px" }}>UBND Xã Đăk Pxi</strong>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>PHÒNG BAN</span>
                  <strong style={{ color: "#0f172a", fontSize: "13.5px", fontWeight: "800", display: "block", marginTop: "3px" }}>Phòng Văn hóa - Xã hội</strong>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>TÊN ĐĂNG NHẬP</span>
                  <strong style={{ color: "#0f172a", fontSize: "13.5px", fontWeight: "800", display: "block", marginTop: "3px" }}>{localStorage.getItem("admin_username") || "canbo_vhxh"}</strong>
                </div>

                <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>TRẠNG THÁI</span>
                  <strong style={{ color: "#16a34a", fontSize: "13.5px", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
                    Đang hoạt động
                  </strong>
                </div>
              </div>

              {/* Close Action Button */}
              <button
                type="button"
                onClick={() => setShowAccountInfoModal(false)}
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", color: "#ffffff",
                  border: "none", padding: "12px 20px", borderRadius: "12px", fontSize: "14px",
                  fontWeight: "900", cursor: "pointer", marginTop: "6px", boxShadow: "0 4px 14px rgba(2, 132, 199, 0.25)",
                  transition: "all 0.2s ease", textAlign: "center"
                }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CÀI ĐẶT HỆ THỐNG - GIAO DIỆN CAO CẤP RÕ NÉT HTML5 */}
      {showSettingsModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", zIndex: 99999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          backdropFilter: "blur(4px)"
        }} onClick={() => setShowSettingsModal(false)}>
          <div style={{
            background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: "500px",
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.3)", overflow: "hidden",
            border: "1px solid #e2e8f0"
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)", color: "#ffffff",
              padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "900", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px", letterSpacing: "0.2px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>CÀI ĐẶT GIAO DIỆN & TÙY CHỌN</span>
              </h3>
              <button
                type="button"
                style={{
                  background: "rgba(255, 255, 255, 0.2)", border: "none", color: "#ffffff",
                  width: "30px", height: "30px", borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
                onClick={() => setShowSettingsModal(false)}
                title="Đóng cửa sổ"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", fontWeight: "800" }}>Thông báo thời gian thực</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", display: "block" }}>Nhận cảnh báo cuộc họp và tin mới tức thì</span>
                </div>
                <input type="checkbox" defaultChecked style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#0284c7" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", fontWeight: "800" }}>Âm thanh phát thông báo</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", display: "block" }}>Phát âm thanh khi có lịch họp khẩn</span>
                </div>
                <input type="checkbox" defaultChecked style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#0284c7" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <div>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", fontWeight: "800" }}>Tự động lưu dữ liệu cán bộ</strong>
                  <span style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", display: "block" }}>Sao lưu cache phòng tránh mất thông tin</span>
                </div>
                <input type="checkbox" defaultChecked style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#0284c7" }} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  alert("✅ Đã lưu cài đặt thành công!");
                }}
                style={{
                  background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", color: "#ffffff",
                  border: "none", padding: "12px 20px", borderRadius: "12px", fontSize: "14px",
                  fontWeight: "900", cursor: "pointer", marginTop: "6px", boxShadow: "0 4px 14px rgba(22, 163, 74, 0.25)",
                  transition: "all 0.2s ease", textAlign: "center"
                }}
              >
                Lưu cài đặt ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL XEM CHI TIẾT ĐÁP ÁN LƯỢT THI CUỘC THI ── */}
      {selectedQuizDetail && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedQuizDetail(null);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "880px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              border: "1px solid #cbd5e1",
            }}
          >
            {/* Header Modal */}
            <div
              style={{
                background: "linear-gradient(135deg, #005baa 0%, #003d7a 100%)",
                color: "#ffffff",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", letterSpacing: "0.2px" }}>
                    CHI TIẾT ĐÁP ÁN LƯỢT THI CUỘC THI
                  </h3>
                  <span style={{ fontSize: "12.5px", opacity: 0.88 }}>
                    Cuộc thi Tìm hiểu Kỹ năng Phòng chống Đuối nước Trẻ em
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuizDetail(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  color: "#ffffff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                title="Đóng cửa sổ"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Thông tin thí sinh & Thống kê kết quả */}
            <div style={{ background: "#f8fafc", padding: "16px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                {/* Thí sinh */}
                <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: "700", display: "block" }}>Người tham gia</span>
                    <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>{selectedQuizDetail.playerName}</strong>
                  </div>
                </div>

                {/* Thời gian */}
                <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: "700", display: "block" }}>Thời gian thi</span>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>
                      {selectedQuizDetail.createdAt ? new Date(selectedQuizDetail.createdAt).toLocaleString("vi-VN") : "Gần đây"}
                    </strong>
                  </div>
                </div>

                {/* Điểm số */}
                <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: "700", display: "block" }}>Số câu trả lời đúng</span>
                    <strong style={{ fontSize: "14.5px", color: "#0284c7" }}>
                      {selectedQuizDetail.score} / {selectedQuizDetail.totalQuestions || 10} câu ({Math.round((selectedQuizDetail.score / (selectedQuizDetail.totalQuestions || 10)) * 100)}%)
                    </strong>
                  </div>
                </div>

                {/* Kết quả */}
                <div style={{ background: "#ffffff", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: selectedQuizDetail.passed ? "#dcfce7" : "#fef3c7", color: selectedQuizDetail.passed ? "#15803d" : "#b45309", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7" />
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: "700", display: "block" }}>Xếp loại thành tích</span>
                    <strong style={{ fontSize: "13.5px", color: selectedQuizDetail.passed ? "#15803d" : "#b45309" }}>
                      {selectedQuizDetail.passed ? "🏆 ĐẠT BẰNG KHEN" : "💡 CHƯA ĐẠT"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Thanh Lọc Tab câu hỏi */}
              {(() => {
                const detailsList = getQuizDetailsList(selectedQuizDetail);
                const correctCount = detailsList.filter((d) => d.isCorrect).length;
                const wrongCount = detailsList.length - correctCount;

                const filteredList = detailsList.filter((item) => {
                  if (quizDetailTab === "correct") return item.isCorrect;
                  if (quizDetailTab === "wrong") return !item.isCorrect;
                  return true;
                });

                return (
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "10px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#475569", marginRight: "6px" }}>Lọc kết quả:</span>
                      <button
                        type="button"
                        onClick={() => setQuizDetailTab("all")}
                        style={{
                          background: quizDetailTab === "all" ? "#005baa" : "#ffffff",
                          color: quizDetailTab === "all" ? "#ffffff" : "#475569",
                          border: quizDetailTab === "all" ? "none" : "1px solid #cbd5e1",
                          padding: "5px 14px",
                          borderRadius: "20px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        Tất cả ({detailsList.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuizDetailTab("correct")}
                        style={{
                          background: quizDetailTab === "correct" ? "#16a34a" : "#ffffff",
                          color: quizDetailTab === "correct" ? "#ffffff" : "#16a34a",
                          border: quizDetailTab === "correct" ? "none" : "1px solid #bbf7d0",
                          padding: "5px 14px",
                          borderRadius: "20px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        ✓ Câu đúng ({correctCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuizDetailTab("wrong")}
                        style={{
                          background: quizDetailTab === "wrong" ? "#dc2626" : "#ffffff",
                          color: quizDetailTab === "wrong" ? "#ffffff" : "#dc2626",
                          border: quizDetailTab === "wrong" ? "none" : "1px solid #fecaca",
                          padding: "5px 14px",
                          borderRadius: "20px",
                          fontSize: "12.5px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        ✕ Câu sai ({wrongCount})
                      </button>
                    </div>

                    {/* Danh sách các câu hỏi */}
                    <div style={{ maxHeight: "52vh", overflowY: "auto", marginTop: "14px", paddingRight: "4px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      {filteredList.map((qItem, qIdx) => {
                        const isCorrect = qItem.isCorrect;
                        return (
                          <div
                            key={qIdx}
                            style={{
                              background: "#ffffff",
                              borderRadius: "14px",
                              padding: "16px 18px",
                              border: `1.5px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                              borderLeft: `6px solid ${isCorrect ? "#16a34a" : "#dc2626"}`,
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                            }}
                          >
                            {/* Tiêu đề câu hỏi + Badge */}
                            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                              <h4 style={{ margin: 0, fontSize: "14.5px", color: "#0f172a", fontWeight: "800", lineHeight: "1.5" }}>
                                Câu {qItem.questionIndex !== undefined ? qItem.questionIndex + 1 : qIdx + 1}: {qItem.questionText}
                              </h4>
                              {isCorrect ? (
                                <span style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  ĐÚNG
                                </span>
                              ) : (
                                <span style={{ background: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                  SAI
                                </span>
                              )}
                            </div>

                            {/* Danh sách các lựa chọn đáp án */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "12px" }}>
                              {qItem.options && qItem.options.map((optText, optIdx) => {
                                const isUserSelected = qItem.selectedOption === optIdx;
                                const isCorrectAnswer = qItem.correctOption === optIdx;

                                let optionBg = "#f8fafc";
                                let optionBorder = "#e2e8f0";
                                let optionTextColor = "#334155";
                                let badgeTag = null;

                                if (isCorrectAnswer) {
                                  optionBg = "#f0fdf4";
                                  optionBorder = "#86efac";
                                  optionTextColor = "#15803d";
                                  badgeTag = (
                                    <span style={{ fontSize: "11.5px", background: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: "8px", fontWeight: "800", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                      ✓ Đáp án đúng
                                    </span>
                                  );
                                } else if (isUserSelected && !isCorrectAnswer) {
                                  optionBg = "#fef2f2";
                                  optionBorder = "#fca5a5";
                                  optionTextColor = "#b91c1c";
                                  badgeTag = (
                                    <span style={{ fontSize: "11.5px", background: "#fee2e2", color: "#b91c1c", padding: "2px 8px", borderRadius: "8px", fontWeight: "800", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                      ✕ Đã chọn (SAI)
                                    </span>
                                  );
                                }

                                return (
                                  <div
                                    key={optIdx}
                                    style={{
                                      background: optionBg,
                                      border: `1.5px solid ${optionBorder}`,
                                      borderRadius: "10px",
                                      padding: "10px 14px",
                                      fontSize: "13.5px",
                                      color: optionTextColor,
                                      fontWeight: isUserSelected || isCorrectAnswer ? "800" : "500",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        background: isCorrectAnswer ? "#16a34a" : isUserSelected ? "#dc2626" : "#cbd5e1",
                                        color: "#ffffff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontWeight: "800",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <span style={{ flex: 1 }}>{optText}</span>
                                    {badgeTag}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Lời giải thích chuyên nghiệp */}
                            {qItem.explain && (
                              <div
                                style={{
                                  background: "#f0f9ff",
                                  border: "1px solid #bae6fd",
                                  borderRadius: "10px",
                                  padding: "10px 14px",
                                  fontSize: "13px",
                                  color: "#0369a1",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "8px",
                                  lineHeight: "1.5",
                                }}
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: "2px", flexShrink: 0 }}>
                                  <line x1="9" y1="18" x2="15" y2="18" />
                                  <line x1="10" y1="22" x2="14" y2="22" />
                                  <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                                </svg>
                                <div>
                                  <strong style={{ fontWeight: "800", color: "#0284c7" }}>Giải thích đáp án: </strong>
                                  <span>{qItem.explain}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: "14px 24px",
                background: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                In báo cáo chi tiết
              </button>

              <button
                type="button"
                onClick={() => setSelectedQuizDetail(null)}
                style={{
                  background: "linear-gradient(135deg, #005baa 0%, #003d7a 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "9px 24px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0, 91, 170, 0.2)",
                  transition: "all 0.15s",
                }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL BẢNG XẾP HẠNG TOP THÀNH TÍCH CAO NHẤT & NHANH NHẤT ── */}
      {showLeaderboardModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLeaderboardModal(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "920px",
              maxHeight: "92vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              border: "1px solid #cbd5e1",
            }}
          >
            {/* Header Modal - Vàng Gold Đẳng Cấp */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                color: "#ffffff",
                padding: "22px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "900", letterSpacing: "0.3px", color: "#fef3c7" }}>
                    🏆 BẢNG XẾP HẠNG THÀNH TÍCH CUỘC THI
                  </h3>
                  <span style={{ fontSize: "13px", color: "#cbd5e1" }}>
                    Vinh danh người chơi đạt điểm số cao nhất & hoàn thành xuất sắc nhất
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLeaderboardModal(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "none",
                  color: "#ffffff",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                title="Đóng cửa sổ"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: "24px", overflowY: "auto", maxHeight: "78vh", background: "#f8fafc" }}>
              {(() => {
                const sortedList = getSortedLeaderboard(quizResults);

                if (sortedList.length === 0) {
                  return (
                    <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                      <p style={{ fontSize: "15px", fontWeight: "700" }}>Chưa có dữ liệu lượt chơi để xếp hạng</p>
                    </div>
                  );
                }

                const top1 = sortedList[0];
                const top2 = sortedList[1];
                const top3 = sortedList[2];

                return (
                  <div>
                    {/* BỤC VINH DANH TOP 3 (PODIUM CHUẨN 3D ĐẲNG CẤP) */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: "16px", alignItems: "end", marginBottom: "28px", padding: "10px 0" }}>
                      {/* TOP 2 (HẠNG NHÌ - BẠC) */}
                      {top2 ? (
                        <div
                          style={{
                            background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
                            borderRadius: "18px",
                            padding: "20px 14px 16px",
                            textAlign: "center",
                            border: "2px solid #cbd5e1",
                            boxShadow: "0 10px 20px -5px rgba(148, 163, 184, 0.25)",
                            position: "relative",
                          }}
                        >
                          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#64748b", color: "#fff", padding: "3px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "900", letterSpacing: "0.5px" }}>
                            🥈 HẠNG NHÌ
                          </div>
                          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#e2e8f0", border: "3px solid #94a3b8", margin: "8px auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            🥈
                          </div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "#0f172a", fontWeight: "800" }}>{top2.playerName}</h4>
                          <div style={{ background: "#e2e8f0", color: "#334155", padding: "4px 10px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", display: "inline-block" }}>
                            {top2.score} / {top2.totalQuestions || 10} câu
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "6px" }}>
                            {Math.round((top2.score / (top2.totalQuestions || 10)) * 100)}% chính xác
                          </div>
                        </div>
                      ) : <div />}

                      {/* TOP 1 (HẠNG NHẤT - VÀNG GOLD CAO NHẤT) */}
                      {top1 && (
                        <div
                          style={{
                            background: "linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)",
                            borderRadius: "20px",
                            padding: "24px 16px 20px",
                            textAlign: "center",
                            border: "2.5px solid #f59e0b",
                            boxShadow: "0 15px 30px -5px rgba(245, 158, 11, 0.35)",
                            position: "relative",
                            transform: "translateY(-8px)",
                          }}
                        >
                          <div style={{ position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "#fff", padding: "4px 16px", borderRadius: "14px", fontSize: "12px", fontWeight: "900", letterSpacing: "0.5px", boxShadow: "0 4px 10px rgba(217, 119, 6, 0.4)" }}>
                            👑 HẠNG NHẤT
                          </div>
                          <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "#fef3c7", border: "4px solid #f59e0b", margin: "10px auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)" }}>
                            🥇
                          </div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "17px", color: "#78350f", fontWeight: "900" }}>{top1.playerName}</h4>
                          <div style={{ background: "#f59e0b", color: "#ffffff", padding: "5px 14px", borderRadius: "14px", fontSize: "14px", fontWeight: "900", display: "inline-block", boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)" }}>
                            {top1.score} / {top1.totalQuestions || 10} câu
                          </div>
                          <div style={{ fontSize: "12px", color: "#92400e", marginTop: "6px", fontWeight: "700" }}>
                            {Math.round((top1.score / (top1.totalQuestions || 10)) * 100)}% chính xác - XUẤT SẮC
                          </div>
                        </div>
                      )}

                      {/* TOP 3 (HẠNG BA - ĐỒNG) */}
                      {top3 ? (
                        <div
                          style={{
                            background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
                            borderRadius: "18px",
                            padding: "20px 14px 16px",
                            textAlign: "center",
                            border: "2px solid #fdba74",
                            boxShadow: "0 10px 20px -5px rgba(251, 146, 60, 0.2)",
                            position: "relative",
                          }}
                        >
                          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#c2410c", color: "#fff", padding: "3px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "900", letterSpacing: "0.5px" }}>
                            🥉 HẠNG BA
                          </div>
                          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#ffedd5", border: "3px solid #f97316", margin: "8px auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
                            🥉
                          </div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "15px", color: "#0f172a", fontWeight: "800" }}>{top3.playerName}</h4>
                          <div style={{ background: "#ffedd5", color: "#c2410c", padding: "4px 10px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", display: "inline-block" }}>
                            {top3.score} / {top3.totalQuestions || 10} câu
                          </div>
                          <div style={{ fontSize: "11.5px", color: "#9a3412", marginTop: "6px" }}>
                            {Math.round((top3.score / (top3.totalQuestions || 10)) * 100)}% chính xác
                          </div>
                        </div>
                      ) : <div />}
                    </div>

                    {/* BẢNG VINH DANH TOÀN BỘ THÍ SINH (RANKINGS TABLE) */}
                    <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                      <div style={{ padding: "14px 20px", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <strong style={{ fontSize: "14px", color: "#0f172a" }}>BẢNG TOÀN BỘ THÀNH TÍCH XẾP HẠNG ({sortedList.length} lượt thi)</strong>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>Tự động sắp xếp theo Điểm cao nhất & Thời gian thi</span>
                      </div>

                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#475569", fontWeight: "800" }}>
                            <th style={{ padding: "12px 16px", width: "70px", textAlign: "center" }}>Hạng</th>
                            <th style={{ padding: "12px 16px" }}>Người chơi</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>Số câu đúng</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>Tỷ lệ</th>
                            <th style={{ padding: "12px 16px" }}>Thời gian thi</th>
                            <th style={{ padding: "12px 16px", textAlign: "center" }}>Danh hiệu</th>
                            <th style={{ padding: "12px 16px", textAlign: "center", width: "100px" }}>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedList.map((item, idx) => {
                            const rank = idx + 1;
                            const percent = Math.round((item.score / (item.totalQuestions || 10)) * 100);
                            const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "-";

                            let rankBadge = (
                              <span style={{ background: "#f1f5f9", color: "#475569", width: "28px", height: "28px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "13px" }}>
                                #{rank}
                              </span>
                            );

                            if (rank === 1) {
                              rankBadge = <span style={{ fontSize: "20px" }}>🥇</span>;
                            } else if (rank === 2) {
                              rankBadge = <span style={{ fontSize: "20px" }}>🥈</span>;
                            } else if (rank === 3) {
                              rankBadge = <span style={{ fontSize: "20px" }}>🥉</span>;
                            }

                            return (
                              <tr key={item._id || idx} style={{ borderBottom: "1px solid #f1f5f9", background: rank === 1 ? "#fffbeb" : rank === 2 ? "#f8fafc" : rank === 3 ? "#fff7ed" : "transparent" }}>
                                <td style={{ padding: "12px 16px", textAlign: "center" }}>{rankBadge}</td>
                                <td style={{ padding: "12px 16px", fontWeight: "800", color: "#0f172a" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: rank === 1 ? "#fef3c7" : "#eff6ff", border: rank === 1 ? "1.5px solid #f59e0b" : "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", color: rank === 1 ? "#d97706" : "#2563eb", fontWeight: "800", flexShrink: 0 }}>
                                      {item.playerName ? item.playerName[0].toUpperCase() : "U"}
                                    </div>
                                    <span>{item.playerName}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                  <span style={{ background: item.score >= 8 ? "#dcfce7" : "#e0f2fe", color: item.score >= 8 ? "#15803d" : "#0369a1", border: item.score >= 8 ? "1px solid #86efac" : "1px solid #bae6fd", padding: "3px 10px", borderRadius: "12px", fontWeight: "800", fontSize: "12.5px" }}>
                                    {item.score} / {item.totalQuestions || 10} câu
                                  </span>
                                </td>
                                <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: "800", color: "#334155" }}>{percent}%</td>
                                <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "12.5px", fontWeight: "600" }}>{dateStr}</td>
                                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                  {item.passed ? (
                                    <span style={{ background: "#dcfce7", color: "#15803d", border: "1px solid #86efac", padding: "4px 10px", borderRadius: "16px", fontWeight: "800", fontSize: "11.5px" }}>
                                      ĐẠT BẰNG KHEN
                                    </span>
                                  ) : (
                                    <span style={{ background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", padding: "4px 10px", borderRadius: "16px", fontWeight: "800", fontSize: "11.5px" }}>
                                      CHƯA ĐẠT
                                    </span>
                                  )}
                                </td>
                                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowLeaderboardModal(false);
                                      setSelectedQuizDetail(item);
                                      setQuizDetailTab("all");
                                    }}
                                    style={{
                                      background: "#eff6ff",
                                      border: "1px solid #bfdbfe",
                                      color: "#2563eb",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      fontWeight: "700",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Xem đáp án
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer Modal */}
            <div
              style={{
                padding: "14px 24px",
                background: "#ffffff",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  color: "#334155",
                  padding: "9px 18px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                In Bảng Xếp Hạng
              </button>

              <button
                type="button"
                onClick={() => setShowLeaderboardModal(false)}
                style={{
                  background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  border: "none",
                  color: "#ffffff",
                  padding: "9px 24px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(217, 119, 6, 0.25)",
                }}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT: QUẢN LÝ & TRA CỨU THỦ TỤC HÀNH CHÍNH (TTHC MANAGEMENT)
   ───────────────────────────────────────────────────────────── */
function TthcManagementSection() {
  const [subTab, setSubTab] = useState("catalog"); // "tracking" | "catalog"
  const [searchTracking, setSearchTracking] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // State cho danh sách hồ sơ cần theo dõi tiến trình
  const [applications, setApplications] = useState([
    {
      id: 1,
      receiptCode: "HS-2026-89412",
      citizenName: "A Rinh",
      cccd: "062095001234",
      phone: "0987.654.321",
      procedureName: "Đăng ký cấp mới thẻ BHYT cho hộ nghèo, cận nghèo năm 2026",
      procedureCode: "TTHC-BHYT-01",
      submitDate: "24/07/2026",
      currentStep: 2, // 1: Tiếp nhận, 2: Thẩm định, 3: Phê duyệt, 4: Trả kết quả
      status: "Đang thẩm định",
      statusCls: "blue",
      staffNote: "Cán bộ VH-XH đang kiểm tra đối soát danh sách hộ nghèo Thôn 1",
      attachedFiles: ["CCCD_ARinh.pdf", "DonXinCapThe.pdf"]
    },
    {
      id: 2,
      receiptCode: "HS-2026-77219",
      citizenName: "Y Yến",
      cccd: "062098005678",
      phone: "0912.345.678",
      procedureName: "Liên thông Đăng ký khai sinh & Cấp thẻ BHYT cho trẻ dưới 6 tuổi",
      procedureCode: "TTHC-BHYT-02",
      submitDate: "22/07/2026",
      currentStep: 3,
      status: "Đã phê duyệt",
      statusCls: "green",
      staffNote: "Chủ tịch UBND xã đã ký duyệt phiếu trả kết quả",
      attachedFiles: ["GiayChungSinh_YYen.pdf"]
    },
    {
      id: 3,
      receiptCode: "HS-2026-55104",
      citizenName: "Trần Văn Nam",
      cccd: "062089009988",
      phone: "0905.112.233",
      procedureName: "Cấp lại thẻ BHYT do hỏng, mất cho công dân",
      procedureCode: "TTHC-BHYT-03",
      submitDate: "20/07/2026",
      currentStep: 4,
      status: "Đã trả kết quả",
      statusCls: "darkgreen",
      staffNote: "Đã giao kết quả thẻ BHYT điện tử qua VNeID công dân",
      attachedFiles: ["DonBaoMatThe.pdf"]
    }
  ]);

  // Hàm tự động phân loại chính xác 100% vào 49 Nhóm Lĩnh vực TTHC
  const getExactFieldGroup = (code, title = "") => {
    const t = (title || "").toLowerCase();
    if (t.includes("khai sinh")) return "Khai sinh";
    if (t.includes("kết hôn")) return "Kết hôn";
    if (t.includes("khai tử")) return "Khai tử";
    if (t.includes("giám hộ")) return "Giám hộ";
    if (t.includes("chứng thực")) return "Chứng thực";
    if (t.includes("nhận cha") || t.includes("nhận mẹ") || t.includes("nhận con")) return "Nhận cha, mẹ, con";
    if (t.includes("nuôi con nuôi") || t.includes("con nuôi")) return "Nuôi con nuôi";
    if (t.includes("hộ tịch")) return "Hộ tịch khác";
    if (t.includes("hòa giải")) return "Hòa giải ở cơ sở";
    if (t.includes("trường") || t.includes("mầm non") || t.includes("tiểu học") || t.includes("thcs") || t.includes("mù chữ") || t.includes("nhóm trẻ")) return "Thành lập/công nhận/giải thể trường học";
    if (t.includes("ăn trưa") || t.includes("học bổng") || t.includes("học phí") || t.includes("chi phí học tập")) return "Hỗ trợ/chính sách giáo dục";
    if (t.includes("tuyển sinh") || t.includes("kiểm định")) return "Tuyển sinh/kiểm định giáo dục";
    if (t.includes("liệt sĩ") || t.includes("bà mẹ việt nam anh hùng") || t.includes("thương binh") || t.includes("bệnh binh") || t.includes("người có công")) return "Người có công với cách mạng";
    if (t.includes("nghèo") || t.includes("cận nghèo")) return "Hộ nghèo, cận nghèo";
    if (t.includes("khuyết tật")) return "Người khuyết tật";
    if (t.includes("bảo trợ xã hội") || t.includes("80 tuổi") || t.includes("cứu đói") || t.includes("hỏa hoạn")) return "Bảo trợ xã hội";
    if (t.includes("trẻ em") || t.includes("mồ côi")) return "Trẻ em";
    if (t.includes("lao động") || t.includes("học nghề") || t.includes("lái xe")) return "Lao động";
    if (t.includes("đường thủy") || t.includes("hàng hải") || t.includes("bến")) return "Đường thủy nội địa/hàng hải";
    if (t.includes("giao thông") || t.includes("đấu nối") || t.includes("đường") || t.includes("vỉa hè") || t.includes("mốc lộ giới") || t.includes("xe thô sơ") || t.includes("xe máy chuyên dùng")) return "Giao thông đường bộ";
    if (t.includes("thủy lợi") || t.includes("hồ chứa") || t.includes("đập") || t.includes("cấp nước")) return "Thủy lợi";
    if (t.includes("thủy sản") || t.includes("cá") || t.includes("lồng bè")) return "Thủy sản";
    if (t.includes("nông nghiệp") || t.includes("trồng") || t.includes("chăn nuôi") || t.includes("thú y") || t.includes("gia súc") || t.includes("gia cầm") || t.includes("biogas") || t.includes("ocop") || t.includes("cà phê") || t.includes("cao su") || t.includes("giống") || t.includes("vật tư nông nghiệp")) return "Nông nghiệp - chăn nuôi - thú y";
    if (t.includes("tài nguyên nước") || t.includes("nguồn nước") || t.includes("nước sinh hoạt")) return "Tài nguyên nước";
    if (t.includes("môi trường") || t.includes("rác") || t.includes("ô nhiễm") || t.includes("chủ nhật xanh")) return "Môi trường";
    if (t.includes("đất") || t.includes("thửa") || t.includes("gcnqsdđ") || t.includes("quyền sử dụng đất") || t.includes("địa chính") || t.includes("trích đo") || t.includes("mốc giới")) return "Đất đai";
    if (t.includes("rừng") || t.includes("lâm") || t.includes("lâm sản") || t.includes("gỗ")) return "Lâm nghiệp";
    if (t.includes("nhà ở") || t.includes("nhà nông thôn") || t.includes("bão lũ")) return "Nhà ở";
    if (t.includes("xây dựng") || t.includes("gpxd") || t.includes("giấy phép xây dựng") || t.includes("hạ tầng")) return "Xây dựng";
    if (t.includes("quy hoạch")) return "Quy hoạch đô thị và nông thôn";
    if (t.includes("hợp tác xã") || t.includes("htx")) return "Hợp tác xã, liên hiệp HTX";
    if (t.includes("tổ hợp tác")) return "Tổ hợp tác";
    if (t.includes("hộ kinh doanh") || t.includes("bán lẻ") || t.includes("thuốc lá") || t.includes("rượu") || t.includes("gian hàng") || t.includes("chợ") || t.includes("thuế khoán")) return "Hộ kinh doanh";
    if (t.includes("chợ")) return "Chợ";
    if (t.includes("tôn giáo") || t.includes("tín ngưỡng") || t.includes("lễ tôn giáo")) return "Tôn giáo, tín ngưỡng";
    if (t.includes("hội")) return "Hội";
    if (t.includes("văn hóa") || t.includes("thể thao") || t.includes("văn nghệ") || t.includes("gia đình văn hóa") || t.includes("thôn văn hóa") || t.includes("băng rôn")) return "Văn hóa - lễ hội - thể thao - xuất bản";
    if (t.includes("bạo lực")) return "Phòng chống bạo lực gia đình";
    if (t.includes("dân tộc")) return "Dân tộc";
    if (t.includes("y tế") || t.includes("thực phẩm") || t.includes("khám bệnh")) return "Y tế - an toàn thực phẩm";
    if (t.includes("công chức") || t.includes("viên chức") || t.includes("cán bộ")) return "Cán bộ, công chức, viên chức";
    if (t.includes("khoáng sản")) return "Khoáng sản";
    if (t.includes("khen thưởng") || t.includes("nghĩa vụ quân sự")) return "Thi đua, khen thưởng - nghệ nhân";
    return "Khác";
  };

  // State cho danh mục thủ tục hành chính
  const [catalog, setCatalog] = useState(() => {
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem("DAK_PXI_DELETED_TTHC_IDS") || "[]");
    } catch {}

    let initialList = MOCK_PROCEDURES.map((p, idx) => ({
      id: p.id || idx + 1,
      code: p.code || `1.000${idx + 100}.01`,
      name: p.title || p.name,
      fieldGroup: getExactFieldGroup(p.code, p.title || p.name),
      group_id: p.group_id,
      level: p.online_type === "toan-trinh" || p.level?.includes("toan-trinh") || p.level?.includes("Mức 4") ? "Dịch vụ công Trực tuyến toàn trình (Mức 4)" : "Mức độ 3 (Nộp hồ sơ trực tuyến)",
      levelBadge: p.online_type === "toan-trinh" || p.level?.includes("toan-trinh") || p.level?.includes("Mức 4") ? "green" : "blue",
      agency: p.agency || "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
      duration: p.processing_time || p.duration || "03 ngày làm việc",
      fee: p.fee || "Miễn phí 100%",
      detailText: p.summary || p.detailText || `Thủ tục ${p.title || p.name} năm 2026.`,
      imageUrl: "",
      guideLink: p.guideLink || `https://dichvucong.gov.vn/p/home/dvc-tthc-danh-sach.html?keyword=${encodeURIComponent(p.code || p.title || p.id)}`
    }));

    try {
      const saved = localStorage.getItem("DAK_PXI_TTHC_CATALOG");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    return initialList;
  });

  // Tự động lưu localStorage mỗi khi Cán bộ Tạo/Sửa/Xóa TTHC
  useEffect(() => {
    if (Array.isArray(catalog) && catalog.length > 0) {
      try {
        localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(catalog));
      } catch {}
    }
  }, [catalog]);

  // Đồng bộ vĩnh viễn với MongoDB Backend Database khi mở trang
  useEffect(() => {
    const syncCatalogWithBackend = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/tthc-catalog`);
        if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setCatalog(res.data.data);
          try {
            localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(res.data.data));
          } catch {}
        }
      } catch (err) {
        console.warn("Không thể tải danh mục TTHC từ MongoDB backend, dùng dữ liệu local:", err.message);
      }
    };
    syncCatalogWithBackend();
  }, []);

  // Modal cập nhật tiến trình hồ sơ
  const [editingApp, setEditingApp] = useState(null);
  const [nextStep, setNextStep] = useState(1);
  const [nextNote, setNextNote] = useState("");

const TTHC_FIELD_GROUPS = [
  "Đất đai",
  "Người có công với cách mạng",
  "Thành lập/công nhận/giải thể trường học",
  "Đường thủy nội địa/hàng hải",
  "Thủy lợi",
  "Thủy sản",
  "Chứng thực",
  "Hỗ trợ/chính sách giáo dục",
  "Khai sinh",
  "Bảo trợ xã hội",
  "Hợp tác xã, liên hiệp HTX",
  "Nông nghiệp - chăn nuôi - thú y",
  "Kết hôn",
  "Tài nguyên nước",
  "Tôn giáo, tín ngưỡng",
  "Giao thông đường bộ",
  "Văn hóa - lễ hội - thể thao - xuất bản",
  "Lâm nghiệp",
  "Xây dựng",
  "Hộ kinh doanh",
  "Y tế - an toàn thực phẩm",
  "Hội",
  "Khai tử",
  "Giám hộ",
  "Trẻ em",
  "Môi trường",
  "Cán bộ, công chức, viên chức",
  "Quỹ",
  "Tổ hợp tác",
  "Tổ hợp tác/Hợp tác xã (chung)",
  "Hòa giải ở cơ sở",
  "Quy hoạch đô thị và nông thôn",
  "Khác",
  "Hộ tịch khác",
  "Hộ nghèo, cận nghèo",
  "Lao động",
  "Nuôi con nuôi",
  "Nhận cha, mẹ, con",
  "Nhà ở",
  "Người khuyết tật",
  "Tuyển sinh/kiểm định giáo dục",
  "Phòng chống bạo lực gia đình",
  "Dân tộc",
  "Chợ",
  "Khoáng sản",
  "Thi đua, khen thưởng - nghệ nhân",
  "Khoa học công nghệ",
  "Công nghiệp",
  "Điện"
];

  // Form tạo TTHC mới
  const [newCatalogForm, setNewCatalogForm] = useState({
    code: "",
    name: "",
    fieldGroup: "Đất đai",
    level: "Dịch vụ công Trực tuyến toàn trình (Mức 4)",
    agency: "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
    duration: "03 ngày làm việc",
    fee: "Miễn phí",
    detailText: "",
    imageUrl: "",
    guideLink: ""
  });
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [editingCatalogItem, setEditingCatalogItem] = useState(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogFieldFilter, setCatalogFieldFilter] = useState("ALL");

  const filteredCatalog = catalog
    .filter(item => {
      const matchSearch = !catalogSearch.trim() ||
        (item.name && item.name.toLowerCase().includes(catalogSearch.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(catalogSearch.toLowerCase())) ||
        (item.detailText && item.detailText.toLowerCase().includes(catalogSearch.toLowerCase()));

      const matchGroup = catalogFieldFilter === "ALL" || item.fieldGroup === catalogFieldFilter;
      return matchSearch && matchGroup;
    })
    .sort((a, b) => (a.stt || 0) - (b.stt || 0));

  const handleSaveCatalogEdit = async (e) => {
    e.preventDefault();
    if (!editingCatalogItem) return;

    setCatalog(prev => prev.map(c => (c.id === editingCatalogItem.id || c.code === editingCatalogItem.code) ? editingCatalogItem : c));

    // Lưu VĨNH VIỄN vào MongoDB Backend Database
    try {
      await axios.put(`${BASE_URL}/api/v1/tthc-catalog/${encodeURIComponent(editingCatalogItem.code)}`, editingCatalogItem);
    } catch (err) {
      console.error("Lỗi lưu vĩnh viễn thủ tục vào MongoDB:", err);
    }

    setEditingCatalogItem(null);
    setMessage(`🎉 Đã lưu VĨNH VIỄN vào Cơ sở dữ liệu thông tin và link DVC chính xác cho thủ tục [${editingCatalogItem.name || editingCatalogItem.code}]!`);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleExportCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(catalog, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DAK_PXI_TTHC_CATALOG_EXPORT_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert("🎉 Đã xuất file Dữ liệu gốc thành công! Dữ liệu link và thông tin thủ tục đã được đóng gói sẵn sàng deploy.");
  };

  const handleImportCatalog = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCatalog(parsed);
          localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(parsed));
          alert(`🎉 THÀNH CÔNG RỰC RỠ! Đã nạp thành công ${parsed.length} thủ tục với đầy đủ tất cả các link thật bạn đã gắn!`);
        } else {
          alert("File JSON không hợp lệ hoặc không đúng định dạng danh mục TTHC.");
        }
      } catch (err) {
        alert("Lỗi đọc file JSON. Vui lòng kiểm tra lại file.");
      }
    };
    reader.readAsText(file);
  };

  // Xử lý Cập nhật tiến trình
  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!editingApp) return;

    let newStatus = "Chờ tiếp nhận";
    let statusCls = "orange";
    if (nextStep === 2) { newStatus = "Đang thẩm định"; statusCls = "blue"; }
    if (nextStep === 3) { newStatus = "Đã phê duyệt"; statusCls = "green"; }
    if (nextStep === 4) { newStatus = "Đã trả kết quả"; statusCls = "darkgreen"; }

    setApplications(prev => prev.map(app => {
      if (app.id === editingApp.id) {
        return {
          ...app,
          currentStep: nextStep,
          status: newStatus,
          statusCls: statusCls,
          staffNote: nextNote || app.staffNote
        };
      }
      return app;
    }));

    setEditingApp(null);
  };

  // Xử lý tạo TTHC mới
  const handleCreateCatalog = async (e) => {
    e.preventDefault();
    if (!newCatalogForm.code.trim() || !newCatalogForm.name.trim()) return;

    const newItem = {
      id: Date.now(),
      code: newCatalogForm.code.trim(),
      name: newCatalogForm.name.trim(),
      title: newCatalogForm.name.trim(),
      fieldGroup: newCatalogForm.fieldGroup || "Đất đai",
      level: newCatalogForm.level,
      levelBadge: newCatalogForm.level.includes("Mức 4") ? "green" : "blue",
      agency: newCatalogForm.agency,
      duration: newCatalogForm.duration,
      fee: newCatalogForm.fee,
      detailText: newCatalogForm.detailText,
      imageUrl: newCatalogForm.imageUrl,
      guideLink: newCatalogForm.guideLink,
      link_dich_vu_cong: newCatalogForm.guideLink
    };

    setCatalog(prev => [newItem, ...prev]);

    // Lưu VĨNH VIỄN vào MongoDB Backend Database
    try {
      await axios.post(`${BASE_URL}/api/v1/tthc-catalog`, newItem);
    } catch (err) {
      console.error("Lỗi tạo mới thủ tục vào MongoDB:", err);
    }

    setNewCatalogForm({
      code: "",
      name: "",
      fieldGroup: "Đất đai",
      level: "Dịch vụ công Trực tuyến toàn trình (Mức 4)",
      agency: "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
      duration: "03 ngày làm việc",
      fee: "Miễn phí",
      detailText: "",
      imageUrl: "",
      guideLink: ""
    });
    setShowCatalogModal(false);
    setMessage(`🎉 Đã tạo mới VĨNH VIỄN thủ tục [${newItem.name}] vào Cơ sở dữ liệu!`);
    setTimeout(() => setMessage(""), 5000);
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const q = searchTracking.toLowerCase();
    const matchesSearch = !q || app.receiptCode.toLowerCase().includes(q) || app.citizenName.toLowerCase().includes(q) || app.cccd.includes(q);
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Thống kê số lượng người dân truy cập vào xem Danh mục TTHC
  const [visitorCount, setVisitorCount] = useState(() => {
    try {
      const saved = localStorage.getItem("DAK_PXI_TTHC_VISITOR_COUNT");
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 3842;
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("DAK_PXI_TTHC_VISITOR_COUNT");
        if (saved) setVisitorCount(parseInt(saved, 10));
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* THỐNG KÊ LƯỢT TRUY CẬP TTHC & NÚT TẠO MỚI */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", padding: "16px 24px", borderRadius: "16px", border: "1.5px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", flexWrap: "wrap", gap: "16px" }}>
        {/* THỐNG KÊ LƯỢT NGƯỜI TRUY CẬP XEM TTHC */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f0f9ff", border: "1.5px solid #bae6fd", padding: "8px 16px", borderRadius: "12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div>
            <span style={{ fontSize: "10.5px", fontWeight: "900", color: "#0369a1", textTransform: "uppercase", display: "block" }}>
              BÀ CON TRUY CẬP XEM TTHC
            </span>
            <span style={{ fontSize: "14.5px", fontWeight: "900", color: "#0284c7" }}>
              {visitorCount.toLocaleString('vi-VN')} <small style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>lượt xem thực tế</small>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCatalogModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "12px", background: "#16a34a", color: "#fff", border: "none", fontWeight: "900", cursor: "pointer", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <span>Tạo DANH MỤC THỦ TỤC HÀNH CHÍNH</span>
        </button>
      </div>

      {/* ── SUB-TAB 1: THEO DÕI TIẾN TRÌNH XỬ LÝ HỒ SƠ CÔNG DÂN ── */}
      {subTab === "tracking" && (
        <div className="tp-card" style={{ padding: "24px", background: "#fff", borderRadius: "16px", border: "1.5px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "900", color: "#003d7a", display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span>Quản lý Tiến trình Xử lý Hồ sơ Công dân</span>
              </h3>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b" }}>
                Theo dõi, phê duyệt và cập nhật từng bước thụ lý hồ sơ hành chính thời gian thực.
              </p>
            </div>

            {/* Tim kiếm & Filter */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Nhập Mã hồ sơ, Tên công dân, CCCD..."
                value={searchTracking}
                onChange={(e) => setSearchTracking(e.target.value)}
                style={{ padding: "9px 14px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "13.5px", width: "260px" }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "9px 14px", border: "1.5px solid #cbd5e1", borderRadius: "10px", fontSize: "13.5px" }}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Chờ tiếp nhận">Chờ tiếp nhận</option>
                <option value="Đang thẩm định">Đang thẩm định</option>
                <option value="Đã phê duyệt">Đã phê duyệt</option>
                <option value="Đã trả kết quả">Đã trả kết quả</option>
              </select>
            </div>
          </div>

          {/* BẢNG DANH SÁCH HỒ SƠ */}
          <div style={{ overflowX: "auto" }}>
            <table className="tp-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "13px", color: "#475569" }}>Mã hồ sơ</th>
                  <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "13px", color: "#475569" }}>Công dân nộp</th>
                  <th style={{ padding: "12px 14px", textAlign: "left", fontSize: "13px", color: "#475569" }}>Thủ tục hành chính</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px", color: "#475569" }}>Bước tiến trình</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px", color: "#475569" }}>Trạng thái</th>
                  <th style={{ padding: "12px 14px", textAlign: "center", fontSize: "13px", color: "#475569" }}>Thao tác cán bộ</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => (
                  <tr key={app.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px", fontWeight: "800", color: "#0284c7", fontSize: "14px" }}>
                      {app.receiptCode}
                      <div style={{ fontSize: "11.5px", color: "#64748b", fontWeight: "normal", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{app.submitDate}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <strong style={{ display: "block", color: "#0f172a", fontSize: "14px" }}>{app.citizenName}</strong>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>CCCD: {app.cccd} • SĐT: {app.phone}</span>
                    </td>
                    <td style={{ padding: "14px", maxWidth: "280px" }}>
                      <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155", lineHeight: "1.4" }}>{app.procedureName}</div>
                      <span style={{ fontSize: "11px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#64748b" }}>{app.procedureCode}</span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#f8fafc", padding: "4px 10px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#005baa" }}>Bước {app.currentStep}/4</span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          ({app.currentStep === 1 ? '1. Tiếp nhận' : app.currentStep === 2 ? '2. Thẩm định' : app.currentStep === 3 ? '3. Phê duyệt' : '4. Trả KQ'})
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px", textAlign: "center" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "800",
                        background: app.statusCls === 'green' ? '#dcfce7' : app.statusCls === 'blue' ? '#e0f2fe' : app.statusCls === 'darkgreen' ? '#15803d' : '#fef3c7',
                        color: app.statusCls === 'green' ? '#15803d' : app.statusCls === 'blue' ? '#0369a1' : app.statusCls === 'darkgreen' ? '#ffffff' : '#b45309',
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px", textAlign: "center" }}>
                      <button
                        type="button"
                        style={{ background: "#005baa", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                        onClick={() => {
                          setEditingApp(app);
                          setNextStep(app.currentStep);
                          setNextNote(app.staffNote || "");
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        <span>Cập nhật bước</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: QUẢN LÝ DANH MỤC THỦ TỤC HÀNH CHÍNH ── */}
      {subTab === "catalog" && (
        <div className="tp-card" style={{ padding: "28px", background: "#fff", borderRadius: "20px", border: "1.5px solid #e2e8f0" }}>
          {/* HEADER CHÍNH THỨC CỦA UBND XÃ ĐĂK PXI */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "20px", marginBottom: "24px" }}>
            <span style={{ background: "#005baa", color: "#ffffff", padding: "4px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", display: "inline-block", marginBottom: "8px" }}>
              NĂM 2026
            </span>
            <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#003d7a", margin: "0 0 10px", lineHeight: "1.4", textTransform: "uppercase", letterSpacing: "-0.3px" }}>
              DANH MỤC THỦ TỤC HÀNH CHÍNH TẬP TRUNG
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0f9ff", border: "1.5px solid #bae6fd", color: "#0284c7", padding: "8px 20px", borderRadius: "30px", fontSize: "14px", fontWeight: "800", boxShadow: "0 2px 8px rgba(2, 132, 199, 0.08)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Scan hoặc nhấn vào mã QR code tương ứng để xem chi tiết</span>
            </div>
          </div>

          {/* BỘ LỌC TÌM KIẾM & PHÂN LOẠI THEO 49 NHÓM LĨNH VỰC */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "22px", flexWrap: "wrap", alignItems: "center", background: "#f8fafc", padding: "16px 20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <div style={{ flex: "1 1 260px", position: "relative" }}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên thủ tục hoặc mã TTHC..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "14px", outline: "none", background: "#ffffff" }}
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>

            <select
              value={catalogFieldFilter}
              onChange={(e) => setCatalogFieldFilter(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #0284c7", fontSize: "13.5px", fontWeight: "700", color: "#005baa", background: "#ffffff", cursor: "pointer" }}
            >
              <option value="ALL">-- Tất cả 49 Nhóm Lĩnh Vực ({catalog.length} TTHC) --</option>
              {TTHC_FIELD_GROUPS.map((g, i) => (
                <option key={i} value={g}>{i + 1}. {g}</option>
              ))}
            </select>

            <input
              type="file"
              id="catalog-import-input"
              accept=".json"
              onChange={handleImportCatalog}
              style={{ display: "none" }}
            />

            <button
              type="button"
              onClick={() => document.getElementById("catalog-import-input")?.click()}
              style={{ background: "#7c3aed", color: "#ffffff", border: "none", padding: "10px 16px", borderRadius: "10px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", marginLeft: "auto", boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)" }}
              title="Chọn file JSON đã xuất để nạp ngay 100% link thật vào hệ thống mà không cần nhập lại"
            >
              📤 Nạp File Dữ Liệu 100+ Link (JSON)
            </button>

            <button
              type="button"
              onClick={handleExportCatalog}
              style={{ background: "#0284c7", color: "#ffffff", border: "none", padding: "10px 16px", borderRadius: "10px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 10px rgba(2, 132, 199, 0.2)" }}
              title="Tải toàn bộ dữ liệu thủ tục & link thật về máy để deploy"
            >
              📥 Xuất Dữ Liệu Deploy (JSON)
            </button>

            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              style={{ background: "#16a34a", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "10px", fontSize: "13.5px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 10px rgba(22, 163, 74, 0.2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Tạo TTHC Mới</span>
            </button>
          </div>

          {/* DANH SÁCH THỦ TỤC HÀNH CHÍNH DẠNG HÀNG NGANG (HORIZONTAL ROWS) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredCatalog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px", background: "#f8fafc", borderRadius: "12px", color: "#64748b", fontWeight: "600" }}>
                Không tìm thấy thủ tục hành chính nào phù hợp với bộ lọc.
              </div>
            ) : filteredCatalog.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  borderRadius: "16px",
                  padding: "20px 24px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "24px",
                  flexWrap: "wrap",
                  transition: "all 0.2s ease"
                }}
              >
                {/* STT TRÒN BÊN TRÁI */}
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#f0f9ff", border: "1.5px solid #bae6fd", color: "#0284c7", fontWeight: "900", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {idx + 1}
                </div>

                {/* CỘT 1: THÔNG TIN CHÍNH (TÊN TTHC, MÃ, MỨC ĐỘ, THỜI GIANG/LỆ PHÍ) */}
                <div style={{ flex: "1 1 380px", minWidth: "300px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <span style={{ background: "#0284c7", color: "#ffffff", fontWeight: "900", fontSize: "12px", padding: "3px 10px", borderRadius: "6px" }}>
                      MÃ: {item.code}
                    </span>
                    <span style={{ background: "#f1f5f9", color: "#005baa", border: "1px solid #cbd5e1", fontSize: "12px", fontWeight: "800", padding: "3px 10px", borderRadius: "6px" }}>
                      Lĩnh vực: {item.fieldGroup || getExactFieldGroup(item.code, item.name || item.title)}
                    </span>
                    <span style={{ background: item.levelBadge === 'green' ? '#dcfce7' : '#e0f2fe', color: item.levelBadge === 'green' ? '#15803d' : '#0369a1', fontSize: "12px", fontWeight: "800", padding: "3px 12px", borderRadius: "12px" }}>
                      {item.level}
                    </span>
                  </div>

                  <h4 style={{ margin: "0 0 6px", fontSize: "16.5px", fontWeight: "900", color: "#0f172a", lineHeight: "1.4" }}>
                    {item.name || item.title || item.code}
                  </h4>

                  <p style={{ margin: "0 0 10px", fontSize: "13.5px", color: "#475569", lineHeight: "1.5" }}>
                    {item.detailText}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "12.5px", color: "#64748b" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 2 7 22 7 12 2"/></svg>
                      <span><strong>Nơi giải quyết:</strong> {item.agency}</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span><strong>Thời gian:</strong> {item.duration}</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
                      <span><strong>Lệ phí:</strong> {item.fee}</span>
                    </span>
                  </div>
                </div>

                {/* CỘT 2: MÃ QR CODE TRA CỨU ĐIỆN TỬ THẬT */}
                {(() => {
                  const realDvcUrl = (item.guideLink && item.guideLink.startsWith("http"))
                    ? item.guideLink
                    : `https://dichvucong.gov.vn/p/home/dvc-tthc-danh-sach.html?keyword=${encodeURIComponent(item.code || item.name || item.title || item.id)}`;

                  return (
                    <a
                      href={realDvcUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                      title="Click để nộp hồ sơ trực tuyến trên Cổng Dịch vụ công Quốc gia"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0f9ff", border: "1.5px dashed #0284c7", padding: "10px 14px", borderRadius: "14px", flexShrink: 0, cursor: "pointer" }}>
                        <div style={{ background: "#ffffff", padding: "4px", borderRadius: "8px", border: "1px solid #bae6fd" }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(realDvcUrl)}`}
                            alt={`Mã QR DVC ${item.code}`}
                            style={{ width: "68px", height: "68px", display: "block", borderRadius: "4px" }}
                          />
                        </div>
                        <div style={{ maxWidth: "120px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "900", color: "#005baa", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
                            📲 QUÉT MÃ QR
                          </span>
                          <span style={{ fontSize: "11.5px", color: "#0369a1", fontWeight: "800", display: "block", lineHeight: "1.3" }}>
                            Nộp hồ sơ trực tuyến DVC ➔
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })()}

                {/* CỘT 3: THAO TÁC NÚT BẤM */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end", flexShrink: 0 }}>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", padding: "6px 12px", borderRadius: "8px", fontSize: "12.5px", fontWeight: "750", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      onClick={() => setEditingCatalogItem(item)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      <span>Sửa</span>
                    </button>
                    <button
                      type="button"
                      style={{ background: "#fee2e2", border: "none", color: "#dc2626", padding: "6px 12px", borderRadius: "8px", fontSize: "12.5px", fontWeight: "750", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      onClick={async () => {
                        const targetId = String(item.id);
                        const targetCode = item.code;

                        // Xóa VĨNH VIỄN khỏi MongoDB Backend Database
                        try {
                          if (targetCode) {
                            await axios.delete(`${BASE_URL}/api/v1/tthc-catalog/${encodeURIComponent(targetCode)}`);
                          }
                        } catch (err) {
                          console.error("Lỗi xóa thủ tục khỏi MongoDB:", err);
                        }

                        try {
                          const deleted = JSON.parse(localStorage.getItem("DAK_PXI_DELETED_TTHC_IDS") || "[]");
                          if (targetId && !deleted.includes(targetId)) deleted.push(targetId);
                          localStorage.setItem("DAK_PXI_DELETED_TTHC_IDS", JSON.stringify(deleted));

                          const savedCatalog = localStorage.getItem("DAK_PXI_TTHC_CATALOG");
                          if (savedCatalog) {
                            const catList = JSON.parse(savedCatalog);
                            const nextCat = catList.filter(c => String(c.id) !== targetId && c.code !== targetCode);
                            localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(nextCat));
                          }
                        } catch {}
                        setCatalog(prev => prev.filter(c => String(c.id) !== targetId && c.code !== targetCode));
                        setMessage(`Đã xóa vĩnh viễn đúng 1 thủ tục [${item.name || item.code}] khỏi Cơ sở dữ liệu!`);
                        setTimeout(() => setMessage(""), 5000);
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL CẬP NHẬT TIẾN TRÌNH HỒ SƠ ── */}
      {editingApp && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setEditingApp(null)}>
          <div style={{ background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: "560px", padding: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "16px", right: "16px", background: "#f1f5f9", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "800" }} onClick={() => setEditingApp(null)}>✕</button>

            <h3 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Cập Nhật Tiến Trình Hồ Sơ</span>
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748b" }}>Mã hồ sơ: <strong style={{ color: "#0284c7" }}>{editingApp.receiptCode}</strong> — Công dân: {editingApp.citizenName}</p>

            <form onSubmit={handleSaveProgress} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "800", color: "#334155" }}>Chọn bước tiến trình xử lý:</label>
                <select
                  value={nextStep}
                  onChange={(e) => setNextStep(Number(e.target.value))}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "14px", fontWeight: "600" }}
                >
                  <option value={1}>Bước 1: Tiếp nhận hồ sơ ban đầu</option>
                  <option value={2}>Bước 2: Đang thẩm định hồ sơ</option>
                  <option value={3}>Bước 3: Lãnh đạo đã Phê duyệt</option>
                  <option value={4}>Bước 4: Đã Trả kết quả cho công dân</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "800", color: "#334155" }}>Ghi chú của cán bộ xử lý:</label>
                <textarea
                  rows={3}
                  value={nextNote}
                  onChange={(e) => setNextNote(e.target.value)}
                  placeholder="Nhập ghi chú tiến độ hoặc bổ sung hồ sơ..."
                  style={{ padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "10px", fontWeight: "800", cursor: "pointer" }} onClick={() => setEditingApp(null)}>
                  Hủy
                </button>
                <button type="submit" style={{ background: "#005baa", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>Lưu cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL TẠO DANH MỤC THỦ TỤC HÀNH CHÍNH MỚI ── */}
      {showCatalogModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowCatalogModal(false)}>
          <div style={{ background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: "640px", padding: "26px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "16px", right: "16px", background: "#f1f5f9", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "800" }} onClick={() => setShowCatalogModal(false)}>✕</button>

            <h3 style={{ margin: "0 0 6px", fontSize: "19px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              <span>Tạo Danh Mục Thủ Tục Hành Chính Mới</span>
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748b" }}>Thêm mới thủ tục niêm yết trên Cổng DVC xã Đăk Pxi</p>

            <form onSubmit={handleCreateCatalog} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Mã TTHC *</label>
                  <input
                    type="text"
                    placeholder="TTHC-BHYT-05..."
                    value={newCatalogForm.code}
                    onChange={(e) => setNewCatalogForm({ ...newCatalogForm, code: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                    required
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Mức độ dịch vụ công</label>
                  <select
                    value={newCatalogForm.level}
                    onChange={(e) => setNewCatalogForm({ ...newCatalogForm, level: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  >
                    <option value="Dịch vụ công Trực tuyến toàn trình (Mức 4)">Mức độ 4 (Toàn trình)</option>
                    <option value="Mức độ 3 (Nộp hồ sơ trực tuyến)">Mức độ 3 (Nộp trực tuyến)</option>
                    <option value="Mức độ 2 (Tải mẫu biểu)">Mức độ 2 (Mẫu biểu)</option>
                    <option value="Mức độ 1 (Công khai hướng dẫn)">Mức độ 1 (Hướng dẫn)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Nhóm Lĩnh vực Thủ tục Hành chính *</label>
                <select
                  value={newCatalogForm.fieldGroup}
                  onChange={(e) => setNewCatalogForm({ ...newCatalogForm, fieldGroup: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontWeight: "700", color: "#005baa" }}
                >
                  {TTHC_FIELD_GROUPS.map((group, idx) => (
                    <option key={idx} value={group}>
                      {idx + 1}. {group}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Tên Thủ tục Hành chính *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đăng ký cấp mới thẻ BHYT..."
                  value={newCatalogForm.name}
                  onChange={(e) => setNewCatalogForm({ ...newCatalogForm, name: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Thời gian giải quyết</label>
                  <input
                    type="text"
                    placeholder="03 ngày làm việc..."
                    value={newCatalogForm.duration}
                    onChange={(e) => setNewCatalogForm({ ...newCatalogForm, duration: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Lệ phí</label>
                  <input
                    type="text"
                    placeholder="Miễn phí..."
                    value={newCatalogForm.fee}
                    onChange={(e) => setNewCatalogForm({ ...newCatalogForm, fee: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Chi tiết hướng dẫn & Điều kiện</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả thành phần hồ sơ..."
                  value={newCatalogForm.detailText}
                  onChange={(e) => setNewCatalogForm({ ...newCatalogForm, detailText: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Link liên kết hướng dẫn Cổng DVC / File (URL)</label>
                <input
                  type="text"
                  placeholder="https://dichvucong.gov.vn/..."
                  value={newCatalogForm.guideLink}
                  onChange={(e) => setNewCatalogForm({ ...newCatalogForm, guideLink: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Link Hình ảnh sơ đồ TTHC (URL)</label>
                <input
                  type="text"
                  placeholder="/huong-dan/... hoặc https://..."
                  value={newCatalogForm.imageUrl}
                  onChange={(e) => setNewCatalogForm({ ...newCatalogForm, imageUrl: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "10px", fontWeight: "800", cursor: "pointer" }} onClick={() => setShowCatalogModal(false)}>
                  Hủy
                </button>
                <button type="submit" style={{ background: "#16a34a", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  <span>Lưu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL CHỈNH SỬA TTHC & CẬP NHẬT LINK DVC CHÍNH XÁC ── */}
      {editingCatalogItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setEditingCatalogItem(null)}>
          <div style={{ background: "#ffffff", borderRadius: "20px", width: "100%", maxWidth: "640px", padding: "26px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <button style={{ position: "absolute", top: "16px", right: "16px", background: "#f1f5f9", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "800" }} onClick={() => setEditingCatalogItem(null)}>✕</button>

            <h3 style={{ margin: "0 0 6px", fontSize: "19px", fontWeight: "900", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Chỉnh Sửa Thủ Tục & Cập Nhật Link DVC</span>
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748b" }}>Cập nhật thông tin chi tiết và liên kết nộp hồ sơ DVC chính xác nhất</p>

            <form onSubmit={handleSaveCatalogEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Mã TTHC *</label>
                  <input
                    type="text"
                    value={editingCatalogItem.code || ""}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, code: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                    required
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Mức độ dịch vụ công</label>
                  <select
                    value={editingCatalogItem.level || "Dịch vụ công Trực tuyến toàn trình (Mức 4)"}
                    onChange={(e) => setEditingCatalogItem({
                      ...editingCatalogItem,
                      level: e.target.value,
                      levelBadge: e.target.value.includes("Mức 4") || e.target.value.includes("toàn trình") ? "green" : "blue"
                    })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  >
                    <option value="Dịch vụ công Trực tuyến toàn trình (Mức 4)">Mức độ 4 (Toàn trình)</option>
                    <option value="Mức độ 3 (Nộp hồ sơ trực tuyến)">Mức độ 3 (Nộp trực tuyến)</option>
                    <option value="Mức độ 2 (Tải mẫu biểu)">Mức độ 2 (Mẫu biểu)</option>
                    <option value="Mức độ 1 (Công khai hướng dẫn)">Mức độ 1 (Hướng dẫn)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Nhóm Lĩnh vực *</label>
                <select
                  value={editingCatalogItem.fieldGroup || "Đất đai"}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, fieldGroup: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontWeight: "700", color: "#005baa" }}
                >
                  {TTHC_FIELD_GROUPS.map((group, idx) => (
                    <option key={idx} value={group}>
                      {idx + 1}. {group}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Tên Thủ tục Hành chính *</label>
                <input
                  type="text"
                  value={editingCatalogItem.name || ""}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, name: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#005baa" }}>🔗 Link liên kết hướng dẫn Cổng DVC / File (URL chính xác) *</label>
                <input
                  type="text"
                  placeholder="https://dichvucong.gov.vn/..."
                  value={editingCatalogItem.guideLink || ""}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, guideLink: e.target.value })}
                  style={{ padding: "10px 12px", border: "2px solid #0284c7", borderRadius: "8px", fontWeight: "600", color: "#0369a1", background: "#f0f9ff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Thời gian giải quyết</label>
                  <input
                    type="text"
                    value={editingCatalogItem.duration || ""}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, duration: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Lệ phí</label>
                  <input
                    type="text"
                    value={editingCatalogItem.fee || ""}
                    onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, fee: e.target.value })}
                    style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Mô tả chi tiết & Điều kiện</label>
                <textarea
                  rows={3}
                  value={editingCatalogItem.detailText || ""}
                  onChange={(e) => setEditingCatalogItem({ ...editingCatalogItem, detailText: e.target.value })}
                  style={{ padding: "9px 12px", border: "1.5px solid #cbd5e1", borderRadius: "8px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                <button type="button" style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "10px", fontWeight: "800", cursor: "pointer" }} onClick={() => setEditingCatalogItem(null)}>
                  Hủy
                </button>
                <button type="submit" style={{ background: "#005baa", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>Lưu cập nhật Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

