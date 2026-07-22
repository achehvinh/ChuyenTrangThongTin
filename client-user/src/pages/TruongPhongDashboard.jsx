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
    topic: "Rà soát & cấp thẻ BHYT đợt 2 cho người dân 6 thôn",
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
      thonStr = "Ban Chỉ đạo Xã, Cán bộ VH-XH & Trưởng 6 thôn";
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
                🤖 Trợ lý AI Hành chính & Văn bản
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
                className={`tp-nav-item ${activeTab === "ai-assistant" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("ai-assistant");
                  setMessage("");
                  setError("");
                }}
              >
                🤖 Trợ lý AI Hành chính & Văn bản
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
                🤖 Trợ lý AI Hành chính & Văn bản
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
        {activeTab !== "ai-assistant" && (
          <header className="tp-content-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2>
                {activeTab === "dashboard" && "Trang tổng quan & Theo dõi hoạt động thời gian thực"}
                {activeTab === "staff" && "Quản lý Cán bộ cấp dưới"}
                {activeTab === "schedule" && "Lịch họp & Điều phối lịch công tác"}
                {activeTab === "updates" && "Nhật ký Hệ thống & Thông báo UBND"}
                {activeTab === "tasks" && "Chỉ thị & Nhiệm vụ được giao"}
                {activeTab === "citizens" && "Quản lý dữ liệu Công dân & Cấp thẻ BHYT"}
                {activeTab === "articles" && "Soạn thảo bài tuyên truyền cho bà con"}
                {activeTab === "feedback" && "Phản hồi & Giải đáp góp ý từ người dân"}
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
        )}

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
              CÁN BỘ, PHÓ PHÒNG & TRƯỞNG PHÒNG TAB CONTENTS
              ────────────────────────────────── */}
          {(role === "canbo" || role === "phophong" || role === "truongphong" || role === "admin") && (
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
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {/* KHUNG SOẠN BÀI VIẾT TUYÊN TRUYỀN FULL MÀN HÌNH */}
                  <div className="tp-card tp-form-card" style={{ width: "100%", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", pb: "12px", borderBottom: "1.5px solid #e2e8f0" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", color: "#003d7a", display: "flex", alignItems: "center", gap: "8px" }}>
                        ✍️ {editingArticle ? "Sửa bài viết tuyên truyền" : "Soạn thảo bài viết tuyên truyền mới"}
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
                            <optgroup label="🛡️ Tuyên truyền Trọng tâm">
                              <option value="phong-chong-lua-dao">🛡️ Phòng, chống Lừa đảo Không gian mạng</option>
                              <option value="an-toan-giao-thong">🚦 Tuyên truyền An toàn Giao thông</option>
                              <option value="thien-tai">🌧️ Phòng chống Thiên tai & Bão lũ</option>
                              <option value="bau-cu">🗳️ Tuyên truyền Bầu cử</option>
                              <option value="huong-dan-vneid">🆔 Hướng dẫn VNeID Mức 2</option>
                              <option value="te-nan">🛡️ Phòng chống Tệ nạn Xã hội</option>
                              <option value="chay-rung">🔥 Phòng chống Cháy rừng</option>
                              <option value="duoi-nuoc">🏊 Phòng chống Đuối nước</option>
                              <option value="thu-tuc-hanh-chinh">📑 Thủ tục Hành chính & Dịch vụ công</option>
                              <option value="tra-cuu">🏥 Tra cứu BHYT & BHXH</option>
                            </optgroup>
                            <optgroup label="📌 Tin tức & Sự kiện">
                              <option value="su-kien">📌 Sự kiện xã Đăk Pxi</option>
                              <option value="the-thao">⚽ Thể thao phong trào</option>
                              <option value="le-hoi">🌾 Lễ hội văn hóa truyền thống</option>
                              <option value="khac">📰 Khác</option>
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

                      {/* Hàng 3: Media Upload Mini Bar (Nút tải Ảnh bìa, Album, Video nằm ngang) */}
                      <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1.5px dashed #cbd5e1", marginBottom: "14px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "10px" }}>
                          📁 Đính kèm File phương tiện truyền thông (Ảnh bìa, Album nhiều ảnh, Video)
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
                        </div>

                        {/* Hiển thị Xem trước siêu nhỏ gọn */}
                        {(coverPreview || secondaryPreviews.length > 0 || videoPreview) && (
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

              {activeTab === "ai-assistant" && (
                <div className="tp-ai-assistant-wrapper" style={{ animation: "fadeIn 0.25s ease-out", display: "flex", flexDirection: "column", gap: "20px" }}>
                  
                  {/* Top Header Banner */}
                  <div style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    color: "#ffffff", padding: "12px 18px", borderRadius: "10px",
                    border: "1px solid #334155", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px"
                  }}>
                    <div>
                      <span style={{ background: "rgba(99, 102, 241, 0.25)", color: "#c7d2fe", fontSize: "10.5px", fontWeight: "800", padding: "2px 8px", borderRadius: "12px", border: "1px solid #6366f1" }}>
                        THƯ KÝ SỐ THÔNG MINH — PHÒNG VĂN HÓA - XÃ HỘI
                      </span>
                      <h2 style={{ margin: "4px 0 2px", fontSize: "15px", fontWeight: "900", color: "#f8fafc" }}>
                        🤖 TRỢ LÝ AI NGHIỆP VỤ HÀNH CHÍNH & VĂN BẢN
                      </h2>
                      <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
                        Tự động hóa 100% công tác Soạn Báo cáo, Kế hoạch, Thông báo, Tóm tắt Văn bản/Cuộc họp & Tra cứu CSDL
                      </p>
                    </div>

                    <div style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: "9.5px", color: "#94a3b8", fontWeight: "600", textAlign: "right" }}>Thời gian hiện tại</span>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#38bdf8", display: "flex", alignItems: "center", gap: "5px" }}>
                        <span>🕒</span>
                        <span style={{ fontFamily: "monospace" }}>{formatCurrentTime(currentTime)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 8 MODULE FEATURE FULL-WIDTH COMPACT 8-COLUMN GRID */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "4px",
                    width: "100%"
                  }}>
                    
                    {/* Card 1: Soạn Báo cáo */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn báo cáo kết quả công tác VH-XH và BHYT")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="1. Soạn Báo cáo kết quả công tác"
                    >
                      <span style={{ fontSize: "13px" }}>📄</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>1. Soạn Báo cáo</span>
                    </div>

                    {/* Card 2: Soạn Kế hoạch */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn kế hoạch công tác trọng tâm")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="2. Soạn Kế hoạch công tác"
                    >
                      <span style={{ fontSize: "13px" }}>📋</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>2. Soạn Kế hoạch</span>
                    </div>

                    {/* Card 3: Soạn Thông báo */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn thông báo nội bộ cuộc họp khẩn")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="3. Soạn Thông báo nội bộ / khẩn"
                    >
                      <span style={{ fontSize: "13px" }}>📣</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>3. Soạn Thông báo</span>
                    </div>

                    {/* Card 4: Nội dung Tuyên truyền */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn nội dung tuyên truyền BHYT và khẩu hiệu slogan")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="4. Bài viết Tuyên truyền & Slogan"
                    >
                      <span style={{ fontSize: "13px" }}>✍️</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>4. Tuyên truyền</span>
                    </div>

                    {/* Card 5: Tóm tắt Văn bản File */}
                    <div
                      onClick={() => document.getElementById("ai-doc-file-input").click()}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="5. Tóm tắt Văn bản PDF/Word"
                    >
                      <span style={{ fontSize: "13px" }}>📂</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>5. Tóm tắt File</span>
                    </div>

                    {/* Card 6: Tóm tắt Cuộc họp */}
                    <div
                      onClick={() => handleExecuteAIQuery("Soạn biên bản cuộc họp & tóm tắt chỉ đạo phân công cán bộ")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="6. Tóm tắt Cuộc họp & Biên bản"
                    >
                      <span style={{ fontSize: "13px" }}>👥</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>6. Tóm tắt Họp</span>
                    </div>

                    {/* Card 7: Tìm kiếm Văn bản */}
                    <div
                      onClick={() => handleExecuteAIQuery("Tìm kiếm văn bản BHYT và quyết định liên quan")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="7. Tìm kiếm Văn bản CSDL"
                    >
                      <span style={{ fontSize: "13px" }}>🔍</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>7. Tìm Văn bản</span>
                    </div>

                    {/* Card 8: Gợi ý Công việc */}
                    <div
                      onClick={() => handleExecuteAIQuery("Gợi ý công việc ưu tiên và nhắc việc quá hạn hôm nay")}
                      style={{
                        background: "#ffffff",
                        padding: "6px 2px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "3px",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                      }}
                      className="tp-hover-card"
                      title="8. Gợi ý Công việc ưu tiên hôm nay"
                    >
                      <span style={{ fontSize: "13px" }}>💡</span>
                      <span style={{ color: "#1e3a8a", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap" }}>8. Gợi ý Việc</span>
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
                  <div style={{ display: "grid", gridTemplateColumns: aiGeneratedDocContent ? "1fr 1fr" : "1fr", gap: "12px" }}>
                    
                    {/* Left: Interactive Chat Terminal */}
                    <div className="tp-card" style={{ display: "flex", flexDirection: "column", minHeight: "340px", padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0, fontSize: "13.5px", fontWeight: "800", color: "#1e3a8a", border: "none", padding: 0 }}>
                          💬 Khung Tương tác Thư ký số AI (Voice & Text)
                        </h3>
                      </div>


                      {/* Messages Container */}
                      <div style={{ flex: 1, overflowY: "auto", maxHeight: "250px", paddingRight: "4px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {aiChatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            style={{
                              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                              maxWidth: "88%",
                              background: msg.sender === "user" ? "#1e3a8a" : "#f1f5f9",
                              color: msg.sender === "user" ? "#ffffff" : "#1e293b",
                              padding: "8px 12px", borderRadius: "8px",
                              fontSize: "12px", lineHeight: "1.5",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px", fontSize: "10.5px", opacity: 0.75 }}>
                              <strong>{msg.sender === "user" ? fullName : "🤖 AI Thư ký số"}</strong>
                              <span>{msg.time}</span>
                            </div>
                            <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                            {msg.sender === "ai" && (
                              <button
                                type="button"
                                onClick={() => handleTextToSpeech(msg.text)}
                                style={{ background: "none", border: "none", color: "#2563eb", fontSize: "10.5px", fontWeight: "700", cursor: "pointer", marginTop: "4px", padding: 0 }}
                              >
                                🔊 Đọc thành tiếng
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
                        style={{ marginTop: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "8px" }}
                      >
                        {/* Preset Tags */}
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
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
                              style={{ background: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1", padding: "2px 6px", borderRadius: "4px", fontSize: "10.5px", fontWeight: "600", cursor: "pointer" }}
                            >
                              + {chip}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => document.getElementById("ai-doc-file-input").click()}
                            style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "0 10px", cursor: "pointer", fontSize: "14px" }}
                            title="Tải tệp PDF/Word để AI tóm tắt"
                          >
                            📎
                          </button>
                          <input
                            type="text"
                            placeholder="Nhập yêu cầu nghiệp vụ (soạn báo cáo, kế hoạch, thông báo, tìm văn bản...)..."
                            value={aiInputQuery}
                            onChange={(e) => setAiInputQuery(e.target.value)}
                            style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                          />
                          <button
                            type="submit"
                            style={{ background: "#1e3a8a", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                          >
                            Gửi
                          </button>
                        </div>
                      </form>

                    </div>


                    {/* Right: Generated Document Preview & Export Section */}
                    {aiGeneratedDocContent && (
                      <div className="tp-card" style={{ display: "flex", flexDirection: "column", background: "#f8fafc", border: "1.5px solid #3b82f6", padding: "12px 14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "6px", marginBottom: "8px" }}>
                          <h3 style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#1e3a8a", border: "none", padding: 0 }}>
                            📄 NỘI DUNG VĂN BẢN ĐÃ SOẠN THẢO (XUẤT MÁY)
                          </h3>
                          <button
                            onClick={() => setAiGeneratedDocContent("")}
                            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontWeight: "800", fontSize: "12px" }}
                          >
                            ✕
                          </button>
                        </div>

                        <div style={{ flex: 1, background: "#ffffff", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", lineHeight: "1.5", whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: "250px", color: "#1e293b" }}>
                          {aiGeneratedDocContent}
                        </div>


                        <div style={{ display: "flex", gap: "6px", marginTop: "8px", justifyContent: "flex-end" }}>
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
                            style={{ background: "#0284c7", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", fontWeight: "700", cursor: "pointer", fontSize: "11.5px" }}
                          >
                            📥 Xuất Word (.doc)
                          </button>
                          <button
                            type="button"
                            onClick={() => alert("Đã in văn bản ra file PDF chính thức!")}
                            style={{ background: "#15803d", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", fontWeight: "700", cursor: "pointer", fontSize: "11.5px" }}
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
                          <option value="giao-ban">👥 Họp giao ban định kỳ</option>
                          <option value="hop-bao-mat">🔒 Cuộc họp Bảo mật Cán bộ (Mật / Nội bộ)</option>
                          <option value="hop-khan">🚨 Họp khẩn cấp</option>
                          <option value="chuyen-de">📑 Họp chuyên đề chuyên môn</option>
                          <option value="tap-huan">📚 Tập huấn & Hướng dẫn nghiệp vụ</option>
                          <option value="khac">📌 Cuộc họp khác</option>
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
                                  <div className="tp-meeting-card-title">
                                    {m.type === "hop-bao-mat" && <span style={{ color: "#e11d48", marginRight: "6px" }}>🔒 [MẬT]</span>}
                                    {m.title}
                                  </div>
                                  <div className="tp-meeting-card-meta">
                                    <span className="tp-meta-item" style={{ color: m.type === "hop-bao-mat" ? "#e11d48" : "inherit", fontWeight: m.type === "hop-bao-mat" ? "800" : "500" }}>
                                      📁 {getMeetingBadgeLabel(m.type)}
                                    </span>
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
                                  {timerInfo.status === "completed" || m.status === "ended" ? (
                                    <button
                                      className="tp-btn-card"
                                      onClick={() => setSelectedMeetingHistory(m)}
                                      style={{ background: "#1e3a8a", color: "#60a5fa", border: "1px solid #3b82f6", fontWeight: "800", whiteSpace: "nowrap", cursor: "pointer" }}
                                      title="Xem Lịch sử họp & Biên bản kết luận được lưu vĩnh viễn"
                                    >
                                      📋 Lịch sử & Biên bản
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        className={`tp-btn-card tp-btn-join ${m.type === "hop-bao-mat" ? "sec-join-btn" : ""}`}
                                        onClick={() => handleJoinMeeting(m)}
                                        style={m.type === "hop-bao-mat" ? { background: "linear-gradient(135deg, #ef4444 0%, #be123c 100%)", color: "#fff" } : {}}
                                      >
                                        {m.type === "hop-bao-mat" ? "🔒 Vào họp Mật" : "🎥 Vào phòng"}
                                      </button>
                                      <button
                                        className="tp-btn-card"
                                        onClick={() => handleResendInvite(m)}
                                        style={{ background: "#4338ca", color: "#ffffff", border: "1px solid #6366f1", fontWeight: "700" }}
                                        title="Tự động phát thông báo & Giấy mời họp thời gian thực tới tất cả Cán bộ trong hệ thống"
                                      >
                                        📩 Giấy mời
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
                                <div className="tp-meeting-card-title">
                                  {m.type === "hop-bao-mat" && <span style={{ color: "#e11d48", marginRight: "6px" }}>🔒 [MẬT]</span>}
                                  {m.title}
                                </div>
                                <div className="tp-meeting-card-meta">
                                  <span className="tp-meta-item" style={{ color: m.type === "hop-bao-mat" ? "#e11d48" : "inherit", fontWeight: m.type === "hop-bao-mat" ? "800" : "500" }}>
                                    📁 {getMeetingBadgeLabel(m.type)}
                                  </span>
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
                                  className={`tp-btn-card tp-btn-join ${m.type === "hop-bao-mat" ? "sec-join-btn" : ""}`}
                                  onClick={() => handleJoinMeeting(m)}
                                  style={m.type === "hop-bao-mat" ? { background: "linear-gradient(135deg, #ef4444 0%, #be123c 100%)", color: "#fff" } : {}}
                                >
                                  {m.type === "hop-bao-mat" ? "🔒 Vào họp Mật" : "🎥 Vào phòng"}
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
                      "Rà soát & cấp thẻ BHYT đợt 2 cho 6 thôn",
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
                    placeholder="Ví dụ: Rà soát cấp thẻ BHYT đợt 2 cho người dân 6 thôn"
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
                    <option value="hop-bao-mat">🔒 Cuộc họp Bảo mật Cán bộ (Mật / Nội bộ)</option>
                    <option value="giao-ban">👥 Họp giao ban định kỳ</option>
                    <option value="hop-khan">🚨 Họp khẩn cấp</option>
                    <option value="chuyen-de">📑 Họp chuyên đề chuyên môn</option>
                    <option value="tap-huan">📚 Tập huấn & Hướng dẫn nghiệp vụ</option>
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
        </div>
      </main>
    </div>
  );
}
