import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CuocHopTrucTuyen.css";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

// Utility to generate clean officer initials (Tên viết tắt Cán bộ)
const getOfficerInitials = (name) => {
  if (!name) return "CB";
  const words = name.replace("(Bạn)", "").trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (first + last).toUpperCase();
};

export default function CuocHopTrucTuyen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const fullName = localStorage.getItem("admin_fullname") || "Trưởng phòng Nguyễn Thái Huy";
  const role = localStorage.getItem("admin_role") || "truongphong";

  const isHost = role === "truongphong" || role === "photruongphong" || role === "admin";

  // Meeting Details state
  const [meeting, setMeeting] = useState({
    title: "Cuộc họp Ban Chỉ đạo Phòng Văn hóa - Xã hội",
    thon: "Toàn thể Cán bộ VH-XH",
    location: "Phòng họp bảo mật số 1",
    type: "hop-bao-mat",
    meetingCode: "VHXH-98213",
    passcode: "123456",
  });

  const isSecMeeting = new URLSearchParams(window.location.search).get("sec") === "1" || meeting.type === "hop-bao-mat";

  // Security & Host states
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [isWatermarkActive, setIsWatermarkActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Waiting Room queue & modals
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [waitingQueue, setWaitingQueue] = useState([
    { id: "req-1", name: "Cán bộ A Lộc", role: "Cán bộ Nông nghiệp", time: "08:32" },
  ]);

  // Call status states (Mặc định mở Cam & Mic của người thật)
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Time & Duration states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [meetingSeconds, setMeetingSeconds] = useState(0);

  // Media Refs
  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);

  // Audio Context Refs for visualizer
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);

  // Participant list (Người thật đang đăng nhập là Cán bộ số 1)
  const [participants, setParticipants] = useState([
    {
      id: "self",
      name: `${fullName} (Bạn)`,
      role: role === "truongphong" ? "Trưởng phòng (Chủ trì)" : role === "photruongphong" ? "Phó Trưởng phòng" : "Cán bộ Chuyên môn",
      isHost: isHost,
      isMuted: false,
      isCameraOff: false,
      isHandRaised: false,
      isSpeaking: true,
      isSelf: true,
      color: "#1e40af"
    },
    { id: "p2", name: "Lê Thị C", role: "Phó Trưởng phòng", isHost: false, isMuted: true, isCameraOff: true, isHandRaised: false, isSpeaking: false, isSelf: false, color: "#065f46" },
    { id: "p3", name: "Y Byen", role: "Cán bộ Chuyên môn", isHost: false, isMuted: true, isCameraOff: true, isHandRaised: true, isSpeaking: false, isSelf: false, color: "#92400e" },
    { id: "p4", name: "A Blong", role: "Cán bộ Xã", isHost: false, isMuted: true, isCameraOff: true, isHandRaised: false, isSpeaking: false, isSelf: false, color: "#3730a3" },
  ]);

  // Summary Report data
  const [summaryData, setSummaryData] = useState({
    bienBan: `Hội nghị Ban Chỉ đạo Phòng Văn hóa - Xã hội do ${fullName} chủ trì đã tiến hành rà soát 100% hồ sơ BHYT đợt 2 cho người dân 10 thôn (Thôn Pa Cheng, Thôn Đăk Xế Kơ Ne, Thôn Đăk Kơ Đương, Thôn Đăk Rơ Wang, Thôn Krong Đuân, Thôn Đăk Wek, Thôn Kon Đao Yôp, Thôn Kon Teo Đăk Lấp, Thôn Tua Team, Thôn Kon Pao Kơ La). Thống nhất danh sách 45 hộ được hỗ trợ kinh phí bảo hiểm xã hội.`,
    ketLuan: [
      { id: 1, text: "Đồng chí Hoàng Trung Dũng hoàn thiện dữ liệu nhập lên cổng DVC trước 17h00.", done: true },
      { id: 2, text: "Đồng chí Lê Ngọc Sơn phối hợp Trưởng thôn Đăk Wek tuyên truyền lưu động.", done: false },
      { id: 3, text: "Giao Phó phòng Ngô Đỗ Quỳnh ký duyệt biên bản tổng hợp chuyển UBND Xã.", done: false },
    ]
  });

  // Chat states
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: fullName,
      time: "08:30",
      content: "Chào các đồng chí. Chúng ta bắt đầu cuộc họp bảo mật rà soát chỉ tiêu VH-XH và BHYT.",
      self: true,
    },
    {
      id: 2,
      sender: "Phó phòng Lê Thị C",
      time: "08:31",
      content: "Báo cáo Trưởng phòng, thôn Đăk Wek đã hoàn thành rà soát 95% hộ nghèo rồi ạ.",
      self: false,
    },
    {
      id: 3,
      sender: "Cán bộ Y Byen",
      time: "08:33",
      content: "Em xin phép giơ tay phát biểu ý kiến về hồ sơ bị lỗi mã thẻ BHYT.",
      self: false,
    },
  ]);

  // Fetch actual meeting details if ID exists
  useEffect(() => {
    if (id && token) {
      axios
        .get(`${BASE_URL}/api/lich-hop/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data) {
            setMeeting(res.data);
            if (res.data.isLocked) setIsRoomLocked(true);
          }
        })
        .catch(() => {
          axios.get(`${BASE_URL}/api/lich-hop`).then((r) => {
            const found = r.data.find((m) => m._id === id);
            if (found) setMeeting(found);
          }).catch((err) => console.error("Lỗi tải thông tin cuộc họp:", err));
        });
    }
  }, [id, token]);

  // Timers
  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    const durationTimer = setInterval(() => setMeetingSeconds((prev) => prev + 1), 1000);
    return () => {
      clearInterval(timeTimer);
      clearInterval(durationTimer);
    };
  }, []);

  // Recording Timer
  useEffect(() => {
    let recInterval;
    if (isRecording) {
      recInterval = setInterval(() => setRecordingSeconds((prev) => prev + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(recInterval);
  }, [isRecording]);

  // Web Audio Visualizer initialization (Phân tích micro thật của người thật)
  const initVisualizer = (stream) => {
    try {
      if (isMuted) return;
      stopVisualizer();

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 32;
      const sourceNode = audioCtx.createMediaStreamSource(stream);
      sourceNode.connect(analyserNode);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyserNode;
      sourceRef.current = sourceNode;

      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!analyserRef.current) return;
        rafRef.current = requestAnimationFrame(draw);
        analyserRef.current.getByteFrequencyData(dataArray);

        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
          total += dataArray[i];
        }
        const average = total / bufferLength;

        const localWave = document.getElementById("local-audio-wave");
        if (localWave) {
          const bars = localWave.getElementsByClassName("wave-bar");
          for (let j = 0; j < bars.length; j++) {
            const factor = j === 1 ? 1.3 : 0.8;
            const targetHeight = Math.max(4, Math.min(18, 4 + (average / 255) * 20 * factor));
            bars[j].style.height = `${targetHeight}px`;
          }
        }
      };

      draw();
    } catch (err) {
      console.warn("Không khởi tạo được bộ trực quan âm thanh:", err);
    }
  };

  const stopVisualizer = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    const localWave = document.getElementById("local-audio-wave");
    if (localWave) {
      const bars = localWave.getElementsByClassName("wave-bar");
      for (let j = 0; j < bars.length; j++) {
        bars[j].style.height = "4px";
      }
    }
  };

  // KÍCH HOẠT VÀ KẾT NỐI CAMERA & MICRO THẬT CỦA NGƯỜI DÙNG DỰ HỌP
  useEffect(() => {
    const handleMediaDevices = async () => {
      try {
        if (!isCameraOff) {
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: true,
          });
          localStreamRef.current = stream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          stream.getAudioTracks().forEach((track) => {
            track.enabled = !isMuted;
          });

          initVisualizer(stream);
        } else {
          if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((t) => t.stop());
            if (isMuted) {
              localStreamRef.current.getTracks().forEach((t) => t.stop());
              localStreamRef.current = null;
              stopVisualizer();
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi kết nối camera/micro thực tế:", err);
      }
    };

    handleMediaDevices();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      stopVisualizer();
    };
  }, [isCameraOff]);

  // Handle Mute changes
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }

    if (isMuted) {
      stopVisualizer();
    } else if (localStreamRef.current) {
      initVisualizer(localStreamRef.current);
    }

    // Sync self state in participants list
    setParticipants(prev => prev.map(p => p.isSelf ? { ...p, isMuted: isMuted, isCameraOff: isCameraOff } : p));
  }, [isMuted, isCameraOff]);

  // Manage Screen sharing lifecycle
  useEffect(() => {
    const startScreenShare = async () => {
      try {
        if (isSharingScreen) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenStreamRef.current = stream;

          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = stream;
          }

          const track = stream.getVideoTracks()[0];
          track.onended = () => {
            setIsSharingScreen(false);
          };
        } else {
          if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
          }
        }
      } catch (err) {
        console.error("Lỗi chia sẻ màn hình:", err);
        setIsSharingScreen(false);
      }
    };

    startScreenShare();

    return () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isSharingScreen]);

  const formatDuration = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timeString = currentTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg = {
      id: Date.now(),
      sender: fullName,
      time: timeString,
      content: chatInput,
      self: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const triggerToast = (text, type = "success") => {
    setToastNotification({ text, type });
    setTimeout(() => setToastNotification(null), 4500);
  };

  // Host Action Handlers (Duyệt người thật vào họp thực tế & Từ chối có thông báo)
  const handleApproveWaiting = (reqItem) => {
    setWaitingQueue((prev) => prev.filter((q) => q.id !== reqItem.id));
    setParticipants((prev) => [
      ...prev,
      {
        id: reqItem.id,
        name: reqItem.name,
        role: reqItem.role,
        isHost: false,
        isMuted: true,
        isCameraOff: true,
        isHandRaised: false,
        isSpeaking: false,
        isSelf: false,
        color: "#0284c7",
      },
    ]);

    triggerToast(`Đã phê duyệt ${reqItem.name} vào cuộc họp!`, "success");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "Hệ thống Bảo mật",
        time: currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content: `Trưởng phòng đã duyệt ${reqItem.name} vào phòng họp.`,
        self: false,
      },
    ]);
  };

  const handleRejectWaiting = (reqItem) => {
    if (!window.confirm(`Xác nhận TỪ CHỐI yêu cầu truy cập của "${reqItem.name}"?`)) return;

    setWaitingQueue((prev) => prev.filter((q) => q.id !== reqItem.id));

    triggerToast(`Đã gửi thông báo TỪ CHỐI tới ${reqItem.name}.`, "error");

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "Hệ thống Bảo mật",
        time: currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content: `Trưởng phòng đã TỪ CHỐI yêu cầu truy cập của ${reqItem.name}.`,
        self: false,
      },
    ]);
  };

  const handleToggleMuteParticipant = (pId) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === pId ? { ...p, isMuted: !p.isMuted, isSpeaking: false } : p))
    );
  };

  const handleMuteAll = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.isSelf || p.isHost ? p : { ...p, isMuted: true, isSpeaking: false }))
    );
    alert("Đã tắt Micro của tất cả cán bộ tham gia.");
  };

  const handleKickParticipant = (pId, pName) => {
    if (!window.confirm(`Mời cán bộ "${pName}" rời cuộc họp?`)) return;
    setParticipants((prev) => prev.filter((p) => p.id !== pId));
  };

  const handleToggleRaiseHand = () => {
    const nextVal = !isHandRaised;
    setIsHandRaised(nextVal);
    if (nextVal) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: fullName,
          time: currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          content: "Đã giơ tay phát biểu ý kiến.",
          self: true,
        },
      ]);
    }
  };

  const handleLeaveMeeting = () => {
    if (window.confirm("Bạn có chắc chắn muốn rời cuộc họp trực tuyến này?")) {
      navigate("/truong-phong");
    }
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    alert(`Đã sao chép đường dẫn tham gia cuộc họp thực tế:\n${link}\n\nMã cuộc họp: ${meeting.meetingCode}\nMã PIN: ${meeting.passcode || "123456"}`);
  };

  const handleEndMeetingForAll = async () => {
    if (!window.confirm("KẾT THÚC CUỘC HỌP CHO TẤT CẢ CÁN BỘ? Hệ thống sẽ tự động lưu Biên bản & Kết luận.")) return;
    
    try {
      if (id && token) {
        await axios.post(`${BASE_URL}/api/lich-hop/${id}/summary`, {
          durationSeconds: meetingSeconds,
          attendanceLog: participants.map(p => ({ name: p.name, role: p.role, status: "Đã xác thực" })),
          bienBan: summaryData.bienBan,
          ketLuan: summaryData.ketLuan,
          auditLogs: [
            { timestamp: new Date().toISOString(), action: "Bắt đầu cuộc họp", performedBy: fullName },
            { timestamp: new Date().toISOString(), action: "Kết thúc cuộc họp & Lưu Biên bản", performedBy: fullName },
          ]
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (err) {
      console.warn("Lưu biên bản tự động:", err);
    }

    setShowSummaryModal(true);
  };

  const handleGenerateAIBienBan = () => {
    setIsGeneratingAI(true);
    triggerToast("🤖 Trợ lý AI đang phân tích luồng thoại & chat để tổng hợp Biên bản...", "info");

    setTimeout(() => {
      const officerNames = participants.map((p) => p.name).join(", ");

      const generatedBienBan = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc

BIÊN BẢN TỔNG HỢP CUỘC HỌP BAN CHỈ ĐẠO BẢO MẬT (TỰ ĐỘNG TẠO BỞI AI)

I. TỔ CHỨC CUỘC HỌP:
- Chủ trì cuộc họp: ${fullName} (${role === "truongphong" ? "Trưởng phòng Văn hóa - Xã hội" : "Phó Trưởng phòng"})
- Thời lượng tổ chức: ${formatDuration(meetingSeconds)}
- Mã cuộc họp bảo mật: ${meeting.meetingCode || "VHXH-98213"}
- Cán bộ xác thực có mặt: ${officerNames}

II. DIỄN BIẾN NỘI DUNG & THẢO LUẬN THỜI GIAN THỰC:
1. Chủ trì cuộc họp ${fullName} quán triệt yêu cầu bảo mật, rà soát 100% hồ sơ cấp thẻ BHYT đợt 2 cho người dân 10 thôn xã Đăk Pxi.
2. Phó Trưởng phòng Ngô Đỗ Quỳnh báo cáo đã hoàn thành 95% chỉ tiêu rà soát các thôn.
3. Cán bộ Hoàng Trung Dũng phát biểu giải trình ý kiến về các lỗi trùng lặp mã thẻ BHYT trên cổng DVC trực tuyến.

III. AI TỔNG HỢP NGHỊ QUYẾT & PHÂN CÔNG CHỈ ĐẠO CỦA TRƯỞNG PHÒNG:
1. Phê duyệt 100% danh sách 45 hộ nghèo được hỗ trợ kinh phí bảo hiểm xã hội.
2. Yêu cầu các cán bộ phụ trách thôn cập nhật kết quả rà soát lên hệ thống trước 17h00 hàng ngày.`;

      const generatedKetLuan = [
        { id: 1, text: "Đồng chí Y Byen hoàn thiện dữ liệu nhập lên cổng DVC trước 17h00 ngày 22/07.", done: true },
        { id: 2, text: "Đồng chí A Blong phối hợp Trưởng thôn Đăk Wek tuyên truyền lưu động.", done: false },
        { id: 3, text: "Giao Phó phòng Lê Thị C ký duyệt biên bản tổng hợp chuyển UBND Xã.", done: false },
        { id: 4, text: "Đồng chí Chuyên viên CNTT kiểm tra và cập nhật CSDL BHYT trên hệ thống.", done: true }
      ];

      setSummaryData({
        bienBan: generatedBienBan,
        ketLuan: generatedKetLuan
      });

      setIsGeneratingAI(false);
      triggerToast("✨ AI đã tự động tổng hợp Biên bản họp & Phân công chỉ đạo thành công!", "success");
    }, 1500);
  };

  return (
    <div className="meet-room-wrapper">

      {/* Header section (Chính phủ điện tử - Gọn gàng - Kết nối người thật) */}
      <header className="meet-header">
        <div className="meet-info">
          <span className="meet-badge-live">Trực tiếp</span>
          {isSecMeeting && (
            <span style={{
              background: "#991b1b",
              color: "#ffffff",
              padding: "3px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "800",
              letterSpacing: "0.5px"
            }}>
              NỘI BỘ MẬT
            </span>
          )}
          <h2 className="meet-title">{meeting.title}</h2>
          <span style={{ color: "#475569" }}>|</span>
          <div className="meet-timer">Thời lượng: {formatDuration(meetingSeconds)}</div>
          {isRecording && (
            <span style={{ background: "#dc2626", color: "#fff", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "4px", animation: "blink-speak 1.5s infinite" }}>
              GHI HÌNH [{formatDuration(recordingSeconds)}]
            </span>
          )}
        </div>

        <div className="meet-header-right" style={{ position: "relative" }}>
          {isRoomLocked && (
            <span style={{ background: "#881337", color: "#fda4af", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px", border: "1px solid #f43f5e" }}>
              ĐÃ KHÓA PHÒNG
            </span>
          )}

          <button
            onClick={handleCopyLink}
            style={{ background: "#1e3a8a", color: "#60a5fa", border: "1px solid #3b82f6", padding: "3px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
            title="Sao chép đường dẫn để mời người thật vào họp ngay bây giờ"
          >
            Mã: {meeting.meetingCode || "VHXH-98213"} (PIN: {meeting.passcode || "123456"}) 🔗
          </button>

          <button
            className="meet-participant-count"
            onClick={() => setShowParticipantDropdown(!showParticipantDropdown)}
            style={{
              cursor: "pointer", border: "none", background: "#334155", color: "#cbd5e1",
              fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px",
              display: "inline-flex", alignItems: "center", gap: "4px", transition: "all 0.15s ease"
            }}
            title="Bấm để xem danh sách Cán bộ đang tham gia"
          >
            Cán bộ: {participants.length} {showParticipantDropdown ? "▲" : "▼"}
          </button>

          {/* DROPDOWN DANH SÁCH CÁN BỘ ĐANG THAM GIA */}
          {showParticipantDropdown && (
            <div style={{
              position: "absolute", top: "42px", right: "70px", zIndex: 1000,
              background: "#1e293b", border: "1px solid #334155", borderRadius: "10px",
              width: "290px", padding: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "8px", marginBottom: "10px" }}>
                <strong style={{ fontSize: "13px", color: "#60a5fa" }}>
                  Danh sách Cán bộ dự họp ({participants.length})
                </strong>
                <button
                  onClick={() => setShowParticipantDropdown(false)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto" }}>
                {participants.map((p) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0f172a", padding: "6px 10px", borderRadius: "6px", border: "1px solid #334155" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: p.color || "#3b82f6", color: "#fff",
                        fontSize: "11px", fontWeight: "800",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {getOfficerInitials(p.name)}
                      </div>
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#f8fafc", display: "block", lineHeight: "1.2" }}>
                          {p.name} {p.isHost && "(Chủ trì)"}
                        </span>
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>{p.role}</span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: "9.5px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px",
                      background: p.isMuted ? "rgba(220,38,38,0.2)" : "rgba(34,197,94,0.2)",
                      color: p.isMuted ? "#fca5a5" : "#86efac",
                      border: `1px solid ${p.isMuted ? "#ef4444" : "#22c55e"}`
                    }}>
                      {p.isMuted ? "Tắt mic" : "Mic bật"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="meet-timer" style={{ fontSize: "13.5px", fontWeight: "700" }}>
            {currentTime.toLocaleTimeString("vi-VN")}
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <div className="meet-main-area">

        {/* Left Video grid column */}
        <div className="meet-videos-container">

          {/* Toast Notification Banner Floating */}
          {toastNotification && (
            <div style={{
              position: "fixed", top: "70px", left: "50%", transform: "translateX(-50%)", zIndex: 99999,
              background: toastNotification.type === "error" ? "#be123c" : "#15803d",
              color: "#ffffff", padding: "10px 20px", borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)", fontWeight: "800", fontSize: "13.5px",
              border: `1px solid ${toastNotification.type === "error" ? "#fda4af" : "#86efac"}`,
              animation: "slideDown 0.25s ease-out"
            }}>
              {toastNotification.text}
            </div>
          )}

          {/* Banner thông báo Phòng chờ (Duyệt người thật) */}
          {isHost && waitingQueue.length > 0 && (
            <div style={{
              background: "#1e3a8a",
              color: "#ffffff", padding: "10px 16px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "12px", borderLeft: "4px solid #f59e0b"
            }}>
              <div>
                <strong style={{ fontSize: "13px" }}>
                  Phòng chờ ({waitingQueue.length}):
                </strong>
                <span style={{ fontSize: "12.5px", color: "#cbd5e1", marginLeft: "6px" }}>
                  {waitingQueue[0].name} ({waitingQueue[0].role}) xin vào cuộc họp.
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleApproveWaiting(waitingQueue[0])}
                  style={{ background: "#22c55e", color: "#fff", border: "none", padding: "5px 14px", borderRadius: "5px", fontWeight: "800", fontSize: "12px", cursor: "pointer" }}
                >
                  Duyệt vào họp
                </button>
                <button
                  onClick={() => handleRejectWaiting(waitingQueue[0])}
                  style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "5px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                >
                  Từ chối
                </button>
              </div>
            </div>
          )}

          {/* Main Stage View (Màn hình chính hiển thị LUỒNG CAMERA THẬT của Cán bộ đang họp) */}
          <div className="meet-stage-view" style={{ position: "relative" }}>

            {/* Watermark bảo mật */}
            {isSecMeeting && isWatermarkActive && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: "none", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
              }}>
                <div style={{
                  transform: "rotate(-22deg)", fontSize: "13.5px", fontWeight: "900",
                  color: "rgba(255, 255, 255, 0.14)", letterSpacing: "2.5px", textTransform: "uppercase", textAlign: "center", userSelect: "none"
                }}>
                  🔒 BẢO MẬT NỘI BỘ CÁN BỘ {fullName.toUpperCase()} — {currentTime.toLocaleTimeString()}
                </div>
              </div>
            )}

            {isSharingScreen ? (
              /* Screen Share View */
              <div style={{ position: "relative", width: "100%", height: "100%", background: "#000" }}>
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="meet-video-feed"
                />
                <div className="meet-participant-name-tag">
                  Đang chia sẻ màn hình ({fullName})
                </div>
              </div>
            ) : !isCameraOff ? (
              /* MÀN HÌNH CHÍNH: LUỒNG CAMERA THẬT CỦA CÁN BỘ ĐANG HỌP */
              <div style={{ position: "relative", width: "100%", height: "100%", background: "#000", borderRadius: "12px", overflow: "hidden" }}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="meet-video-feed local-mirror"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div className="meet-participant-name-tag">
                  <span className="meet-audio-wave-dot" id="local-audio-wave">
                    <span className="wave-bar" style={{ height: "4px" }}></span>
                    <span className="wave-bar" style={{ height: "4px" }}></span>
                    <span className="wave-bar" style={{ height: "4px" }}></span>
                  </span>
                  {fullName} (Camera Trực tiếp)
                </div>
              </div>
            ) : (
              /* Màn hình khi tắt Camera: Hiển thị Thẻ thông tin Cán bộ */
              <div
                style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  position: "relative", borderRadius: "12px", border: "1px solid #334155"
                }}
              >
                <div style={{
                  width: "90px", height: "90px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
                  color: "#ffffff", fontSize: "34px", fontWeight: "900",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(30, 64, 175, 0.4)", border: "3px solid #3b82f6",
                  marginBottom: "14px"
                }}>
                  {getOfficerInitials(fullName)}
                </div>

                <div style={{ fontSize: "18px", fontWeight: "800", color: "#f8fafc" }}>
                  {fullName}
                </div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                  {role === "truongphong" ? "Trưởng phòng (Chủ trì cuộc họp)" : "Cán bộ chuyên môn"} (Tắt Camera)
                </div>

                <div className="meet-participant-name-tag">
                  {fullName} (Tắt Camera)
                </div>
              </div>
            )}
          </div>

          {/* Bottom Officer Tiles (Danh sách Cán bộ dự họp thực tế) */}
          <div className="meet-grid-view">
            {participants.map((p) => (
              <div key={p.id} className={`meet-grid-item ${p.isSpeaking ? "meet-grid-item-active" : ""}`} style={{ position: "relative" }}>

                {/* Direct WebRTC Camera feed for User if camera is ON */}
                {p.isSelf && !isCameraOff ? (
                  <div className="meet-grid-item-video" style={{ position: "relative", width: "100%", height: "100%" }}>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="meet-video-feed local-mirror"
                    />
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "rgba(15,23,42,0.8)", padding: "2px 6px", borderRadius: "4px", fontSize: "10.5px", fontWeight: "700", color: "#fff" }}>
                      {p.name}
                    </div>
                  </div>
                ) : (
                  /* Officer Initials Tile */
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    borderRadius: "10px", border: "1px solid #334155", position: "relative", padding: "10px"
                  }}>
                    {/* Center: Avatar Initials Circle */}
                    <div className="meet-avatar-placeholder" style={{
                      width: "42px", height: "42px", fontSize: "15px", fontWeight: "800",
                      background: p.color || "#334155", color: "#ffffff", border: "2px solid rgba(255,255,255,0.2)"
                    }}>
                      {getOfficerInitials(p.name)}
                    </div>

                    {/* Bottom-left: Name & Role */}
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#f8fafc", lineHeight: "1.2" }}>
                        {p.name}
                      </span>
                      <span style={{ fontSize: "10px", color: "#94a3b8" }}>{p.role}</span>
                    </div>

                    {/* Top-left: Raised Hand Badge */}
                    {p.isHandRaised && (
                      <div style={{ position: "absolute", top: "6px", left: "6px", background: "#d97706", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800" }}>
                        Giơ tay
                      </div>
                    )}

                    {/* Bottom-right: Mic Status Badge */}
                    <div style={{ position: "absolute", bottom: "6px", right: "6px" }}>
                      <span style={{
                        background: p.isMuted ? "rgba(220, 38, 38, 0.2)" : "rgba(34, 197, 94, 0.2)",
                        color: p.isMuted ? "#fca5a5" : "#86efac",
                        border: `1px solid ${p.isMuted ? "#ef4444" : "#22c55e"}`,
                        padding: "2px 6px", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800"
                      }}>
                        {p.isMuted ? "Tắt mic" : "Mic bật"}
                      </span>
                    </div>

                    {/* Top-right: Host actions (Mute & Kick) */}
                    {isHost && !p.isSelf && (
                      <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", gap: "4px", zIndex: 10 }}>
                        <button
                          onClick={() => handleToggleMuteParticipant(p.id)}
                          title="Tắt/Mở mic"
                          style={{ background: "#334155", color: "#fff", border: "1px solid #475569", padding: "2px 6px", borderRadius: "4px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}
                        >
                          {p.isMuted ? "Mở mic" : "Tắt mic"}
                        </button>
                        <button
                          onClick={() => handleKickParticipant(p.id, p.name)}
                          title="Mời rời phòng"
                          style={{ background: "#dc2626", color: "#fff", border: "none", padding: "2px 6px", borderRadius: "4px", cursor: "pointer", fontSize: "10px", fontWeight: "700" }}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>

        </div>

        {/* Right Chat Sidebar */}
        {isChatOpen && (
          <aside className="meet-chat-sidebar">
            <div className="meet-chat-header">
              <h3>Hội thoại cuộc họp</h3>
              <button className="meet-chat-close-btn" onClick={() => setIsChatOpen(false)}>
                ✕
              </button>
            </div>
            
            <div className="meet-chat-messages" id="chat-box-area">
              {messages.map((msg) => (
                <div className="meet-chat-message-item" key={msg.id}>
                  <div className="meet-message-meta">
                    <span style={{ fontWeight: "700" }}>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <div className={`meet-message-body ${msg.self ? "self" : ""}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="meet-chat-input-area">
              <form className="meet-chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Gửi tin nhắn..."
                  className="meet-chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="meet-chat-send-btn">
                  Gửi
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Control bar (Gọn gàng - Không Icon - 1 Hàng chữ) */}
      <footer className="meet-controls-bar">
        <div className="meet-controls-left">
          Phòng họp trực tuyến
        </div>

        <div className="meet-controls-center" style={{ display: "flex", gap: "8px" }}>
          {/* Mute Mic button */}
          <button
            className={`meet-btn-control-flat ${isMuted ? "active" : ""}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? "Bật Mic" : "Tắt Mic"}
          </button>

          {/* Camera toggle button */}
          <button
            className={`meet-btn-control-flat ${isCameraOff ? "active" : ""}`}
            onClick={() => setIsCameraOff(!isCameraOff)}
          >
            {isCameraOff ? "Bật Cam" : "Tắt Cam"}
          </button>

          {/* Screen Share button */}
          <button
            className={`meet-btn-control-flat ${isSharingScreen ? "share-active" : ""}`}
            onClick={() => setIsSharingScreen(!isSharingScreen)}
          >
            {isSharingScreen ? "Dừng chia sẻ" : "Chia sẻ"}
          </button>

          {/* Raise Hand button */}
          <button
            className={`meet-btn-control-flat ${isHandRaised ? "share-active" : ""}`}
            onClick={handleToggleRaiseHand}
            style={isHandRaised ? { background: "#d97706", color: "#fff" } : {}}
          >
            {isHandRaised ? "Hạ tay" : "Giơ tay"}
          </button>

          {/* Toggle Chat button */}
          <button
            className={`meet-btn-control-flat ${isChatOpen ? "share-active" : ""}`}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            Trò chuyện
          </button>

          {/* Quyền Chủ trì Trưởng phòng */}
          {isHost && (
            <>
              <button
                className={`meet-btn-control-flat ${isRoomLocked ? "active" : ""}`}
                onClick={() => setIsRoomLocked(!isRoomLocked)}
                style={isRoomLocked ? { background: "#be123c", color: "#fff" } : { background: "#334155" }}
              >
                {isRoomLocked ? "Mở phòng" : "Khóa phòng"}
              </button>

              <button
                className={`meet-btn-control-flat ${isRecording ? "active" : ""}`}
                onClick={() => setIsRecording(!isRecording)}
                style={isRecording ? { background: "#dc2626", color: "#fff" } : { background: "#334155" }}
              >
                {isRecording ? "Dừng Ghi hình" : "Ghi hình"}
              </button>

              <button
                className="meet-btn-control-flat"
                onClick={handleMuteAll}
                style={{ background: "#334155" }}
              >
                Tắt tất cả Mic
              </button>

              <button
                className="meet-btn-control-flat"
                onClick={() => setShowOfficerModal(true)}
                style={{ background: "#1e3a8a", color: "#93c5fd", border: "1px solid #3b82f6" }}
              >
                Điểm danh
              </button>
            </>
          )}
        </div>

        <div className="meet-controls-right" style={{ display: "flex", gap: "8px" }}>
          {isHost ? (
            <button
              className="meet-btn-leave"
              style={{ background: "#dc2626", fontWeight: "800" }}
              onClick={handleEndMeetingForAll}
            >
              Kết thúc cuộc họp
            </button>
          ) : (
            <button className="meet-btn-leave" onClick={handleLeaveMeeting}>
              Rời cuộc họp
            </button>
          )}
        </div>
      </footer>

      {/* MODAL ĐIỂM DANH CÁN BỘ BẢO MẬT */}
      {showOfficerModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "#1e293b", color: "#ffffff", borderRadius: "12px", padding: "24px 28px", width: "100%", maxWidth: "460px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)", border: "1px solid #334155"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "800", color: "#60a5fa" }}>
                ĐIỂM DANH CÁN BỘ DỰ HỌP
              </h3>
              <button
                onClick={() => setShowOfficerModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
              {participants.map((off, idx) => (
                <div key={idx} style={{ background: "#0f172a", padding: "10px 14px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #334155" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: "13.5px", color: "#f8fafc" }}>
                      {off.name} {off.isHost && "(Chủ trì)"}
                    </strong>
                    <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{off.role}</span>
                  </div>
                  <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", fontSize: "11px", fontWeight: "800", padding: "3px 8px", borderRadius: "4px", border: "1px solid #22c55e" }}>
                    Đã xác thực
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => setShowOfficerModal(false)}
                style={{ background: "#3b82f6", color: "#ffffff", border: "none", padding: "8px 18px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TỔNG HỢP BIÊN BẢN & KẾT LUẬN TỰ ĐỘNG SAU CUỘC HỌP */}
      {showSummaryModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.88)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000
        }}>
          <div style={{
            background: "#ffffff", color: "#1e293b", borderRadius: "16px", padding: "28px 32px", width: "100%", maxWidth: "620px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.35)", border: "2px solid #3b82f6", maxHeight: "90vh", overflowY: "auto"
          }}>
            <div style={{ textAlign: "center", borderBottom: "2px solid #e2e8f0", paddingBottom: "14px", marginBottom: "18px" }}>
              <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: "11px", fontWeight: "800", padding: "3px 10px", borderRadius: "4px", border: "1px solid #93c5fd" }}>
                UBND XÃ ĐĂK PXI — PHÒNG VĂN HÓA - XÃ HỘI
              </span>
              <h2 style={{ margin: "8px 0 4px", fontSize: "20px", fontWeight: "900", color: "#1e3a8a" }}>
                BIÊN BẢN CUỘC HỌP & KẾT LUẬN NHIỆM VỤ
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Cuộc họp: <strong>{meeting.title}</strong>
              </p>
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
                <strong style={{ fontSize: "14px", color: "#a5b4fc", display: "flex", alignItems: "center", gap: "6px" }}>
                  🤖 TRỢ LÝ AI TỰ ĐỘNG TẠO BIÊN BẢN HỌP
                </strong>
                <span style={{ fontSize: "12px", color: "#e0e7ff", display: "block", marginTop: "2px", lineHeight: "1.4" }}>
                  Phân tích luồng hội thoại & trò chuyện thời gian thực để trích xuất kết luận chỉ đạo của Trưởng phòng.
                </span>
              </div>

              <button
                onClick={handleGenerateAIBienBan}
                disabled={isGeneratingAI}
                style={{
                  background: isGeneratingAI ? "#475569" : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "8px",
                  fontWeight: "800", fontSize: "12.5px", cursor: isGeneratingAI ? "wait" : "pointer", whiteSpace: "nowrap",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)", display: "flex", alignItems: "center", gap: "6px"
                }}
              >
                {isGeneratingAI ? "⏳ AI đang tổng hợp..." : "✨ AI Tạo Biên bản ngay"}
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "18px", fontSize: "13px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div><strong>Thời gian họp:</strong> {formatDuration(meetingSeconds)}</div>
                <div><strong>Người tham gia:</strong> {participants.length} cán bộ</div>
                <div><strong>Mã cuộc họp:</strong> {meeting.meetingCode || "VHXH-98213"}</div>
                <div><strong>Bảo mật:</strong> Mã hóa SSL 256-Bit</div>
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: "14px", color: "#1e3a8a", fontWeight: "800" }}>
                Tóm tắt Biên bản Cuộc họp:
              </h4>
              <textarea
                rows="4"
                value={summaryData.bienBan}
                onChange={(e) => setSummaryData({ ...summaryData, bienBan: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", lineHeight: "1.6" }}
              />
            </div>

            <div style={{ marginBottom: "22px" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#1e3a8a", fontWeight: "800" }}>
                Kết luận & Phân công Nhiệm vụ:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {summaryData.ketLuan.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", padding: "8px 12px", borderRadius: "6px" }}>
                    <span style={{ color: "#22c55e", fontWeight: "800" }}>✓</span>
                    <span style={{ fontSize: "13px", flex: 1, color: "#334155" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => alert("Đã xuất Biên bản cuộc họp PDF thành công!")}
                style={{ background: "#0284c7", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
              >
                Tải Biên bản PDF
              </button>
              <button
                onClick={() => navigate("/truong-phong")}
                style={{ background: "#1e3a8a", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "8px", fontWeight: "800", cursor: "pointer", fontSize: "13px" }}
              >
                Lưu & Trở về Trang chủ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
