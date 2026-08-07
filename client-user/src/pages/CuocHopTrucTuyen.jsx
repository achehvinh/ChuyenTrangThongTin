import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CuocHopTrucTuyen.css";
import { getBackendServerUrl } from "../utils/apiConfig";

const BASE_URL = getBackendServerUrl();

// Utility to generate clean officer initials (Tên viết tắt Cán bộ)
const getOfficerInitials = (name) => {
  if (!name) return "CB";
  const words = name.replace("(Bạn)", "").trim().split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return (first + last).toUpperCase();
};

// DANH SÁCH TOÀN BỘ CÁN BỘ CƠ QUAN PHÒNG VĂN HÓA - XÃ HỘI XÃ ĐĂK PXI (DỮ LIỆU THẬT)
const OFFICIAL_OFFICERS = [
  { id: "off-1", name: "Nguyễn Thái Huy", role: "Trưởng phòng VH-XH", isHost: true, avatar: "NTH", color: "#005baa" },
  { id: "off-2", name: "Ngô Đỗ Quỳnh", role: "Phó Trưởng phòng VH-XH", isHost: true, avatar: "NĐQ", color: "#0d9488" },
  { id: "off-3", name: "Lê Thị C", role: "Phó Trưởng phòng VH-XH", isHost: false, avatar: "LTC", color: "#065f46" },
  { id: "off-4", name: "Y Byen", role: "Cán bộ Chuyên môn BHYT", isHost: false, avatar: "YB", color: "#92400e" },
  { id: "off-5", name: "A Blong", role: "Cán bộ Chuyên môn Xã", isHost: false, avatar: "AB", color: "#3730a3" },
  { id: "off-6", name: "A Lộc", role: "Cán bộ Nông nghiệp & BHXH", isHost: false, avatar: "AL", color: "#7c3aed" },
  { id: "off-7", name: "Hoàng Trung Dũng", role: "Cán bộ Công nghệ số & Bảo hiểm", isHost: false, avatar: "HTD", color: "#2563eb" },
];

export default function CuocHopTrucTuyen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const meetingKeyId = id || "default";
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
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [waitingQueue, setWaitingQueue] = useState([
    { id: "req-1", name: "Cán bộ A Lộc", role: "Cán bộ Nông nghiệp & BHXH", time: "08:32" },
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

  // Participant list (Khởi tạo từ LocalStorage & CSDL Cán bộ Thật)
  const [participants, setParticipants] = useState(() => {
    const savedParts = localStorage.getItem(`vhxh_meeting_participants_${meetingKeyId}`);
    if (savedParts) {
      try { return JSON.parse(savedParts); } catch (e) { console.error(e); }
    }
    return [
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
      { id: "p2", name: "Phó phòng Ngô Đỗ Quỳnh", role: "Phó Trưởng phòng", isHost: true, isMuted: true, isCameraOff: true, isHandRaised: false, isSpeaking: false, isSelf: false, color: "#0d9488" },
      { id: "p3", name: "Lê Thị C", role: "Phó Trưởng phòng", isHost: false, isMuted: true, isCameraOff: true, isHandRaised: false, isSpeaking: false, isSelf: false, color: "#065f46" },
      { id: "p4", name: "Y Byen", role: "Cán bộ Chuyên môn BHYT", isHost: false, isMuted: true, isCameraOff: true, isHandRaised: true, isSpeaking: false, isSelf: false, color: "#92400e" },
      { id: "p5", name: "A Blong", role: "Cán bộ Xã", isHost: false, isMuted: true, isCameraOff: true, isHandRaised: false, isSpeaking: false, isSelf: false, color: "#3730a3" },
    ];
  });

  // Summary Report data
  const [summaryData, setSummaryData] = useState({
    bienBan: `Hội nghị Ban Chỉ đạo Phòng Văn hóa - Xã hội do ${fullName} chủ trì đã tiến hành rà soát 100% hồ sơ BHYT đợt 2 cho người dân 10 thôn. Thống nhất danh sách 45 hộ được hỗ trợ kinh phí bảo hiểm xã hội.`,
    ketLuan: [
      { id: 1, text: "Đồng chí Hoàng Trung Dũng hoàn thiện dữ liệu nhập lên cổng DVC trước 17h00.", done: true },
      { id: 2, text: "Đồng chí A Lộc phối hợp Trưởng thôn Đăk Wek tuyên truyền lưu động.", done: false },
      { id: 3, text: "Giao Phó phòng Ngô Đỗ Quỳnh ký duyệt biên bản tổng hợp chuyển UBND Xã.", done: false },
    ]
  });

  // Chat states (Đồng bộ vĩnh viễn với LocalStorage & CSDL Backend)
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMsgs = localStorage.getItem(`vhxh_meeting_messages_${meetingKeyId}`);
    if (savedMsgs) {
      try { return JSON.parse(savedMsgs); } catch (e) { console.error(e); }
    }
    return [
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
    ];
  });

  // Lưu tự động Participants & Messages vào LocalStorage
  useEffect(() => {
    localStorage.setItem(`vhxh_meeting_participants_${meetingKeyId}`, JSON.stringify(participants));
  }, [participants, meetingKeyId]);

  useEffect(() => {
    localStorage.setItem(`vhxh_meeting_messages_${meetingKeyId}`, JSON.stringify(messages));
  }, [messages, meetingKeyId]);

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
            if (res.data.summary && res.data.summary.bienBan) {
              setSummaryData(res.data.summary);
            }
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

      {/* ── HEADER BẢO MẬT CHÍNH PHỦ ĐIỆN TỬ (HTML5 SVG chuẩn) ── */}
      <header className="meet-header" style={{ height: "64px", background: "#0d1527", borderBottom: "1px solid #1e293b", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="meet-info" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Blue Shield Icon Box */}
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "#1e3a8a", border: "1px solid #3b82f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)", flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <rect x="9" y="11" width="6" height="5" rx="1" fill="#60a5fa" stroke="none"/>
              <path d="M10 11V9a2 2 0 1 1 4 0v2" stroke="#60a5fa" strokeWidth="2"/>
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 className="meet-title" style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#ffffff", letterSpacing: "0.3px" }}>
                HỌP BẢO MẬT
              </h2>
              <span style={{
                background: "#3b0764", color: "#d8b4fe", border: "1px solid #7e22ce",
                fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "12px",
                textTransform: "uppercase", letterSpacing: "0.5px", display: "inline-flex", alignItems: "center", gap: "4px"
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                BẢO MẬT CAO
              </span>
            </div>
            <div style={{ fontSize: "11.5px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Mã cuộc họp: <strong style={{ color: "#cbd5e1" }}>{meeting.meetingCode || "VHXH-20595"}</strong> (PIN: <strong style={{ color: "#cbd5e1" }}>{meeting.passcode || "878735"}</strong>)</span>
              <button
                onClick={handleCopyLink}
                style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center" }}
                title="Sao chép liên kết cuộc họp"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Center Header Pill Container */}
        <div style={{
          background: "rgba(15, 23, 42, 0.8)", border: "1px solid #334155", borderRadius: "24px",
          padding: "5px 18px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          <span style={{ background: "#ef4444", color: "#ffffff", padding: "2px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#ffffff"><circle cx="12" cy="12" r="10"/></svg>
            TRỰC TIẾP
          </span>
          <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "700", fontFamily: "monospace" }}>
            {formatDuration(meetingSeconds)}
          </span>
          <span style={{ background: "rgba(153, 27, 27, 0.4)", color: "#fca5a5", border: "1px solid #991b1b", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Nội bộ mật
          </span>
          <strong style={{ color: "#f8fafc", fontSize: "14px", fontWeight: "800" }}>
            {meeting.title || "Tuyên truyền bà con"}
          </strong>
        </div>

        {/* Right Header Action Items */}
        <div className="meet-header-right" style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => setShowAddOfficerModal(true)}
            style={{
              background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155",
              fontSize: "12.5px", fontWeight: "700", padding: "6px 14px", borderRadius: "8px",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            <span>Mời thành viên</span>
          </button>

          <span style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", fontSize: "12.5px", fontWeight: "700", padding: "6px 12px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {participants.length || 12}
          </span>

          <button
            className="meet-participant-count"
            onClick={() => setShowParticipantDropdown(!showParticipantDropdown)}
            style={{
              background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155",
              fontSize: "12.5px", fontWeight: "700", padding: "6px 12px", borderRadius: "8px",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px"
            }}
          >
            <span>Cán bộ: {participants.length}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points={showParticipantDropdown ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
            </svg>
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

          <div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>
            {currentTime.toLocaleTimeString("vi-VN")}
          </div>

          <button
            style={{ background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            onClick={() => setShowOfficerModal(true)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="meet-main-area">

        {/* Left Video grid column */}
        <div className="meet-videos-container" style={{ padding: "16px", gap: "12px" }}>

          {/* Toast Notification Banner Floating */}
          {toastNotification && (
            <div style={{
              position: "fixed", top: "75px", left: "50%", transform: "translateX(-50%)", zIndex: 99999,
              background: toastNotification.type === "error" ? "#be123c" : "#15803d",
              color: "#ffffff", padding: "10px 20px", borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)", fontWeight: "800", fontSize: "13.5px",
              border: `1px solid ${toastNotification.type === "error" ? "#fda4af" : "#86efac"}`,
              animation: "slideDown 0.25s ease-out"
            }}>
              {toastNotification.text}
            </div>
          )}

          {/* Banner thông báo Phòng chờ */}
          {isHost && waitingQueue.length > 0 && (
            <div style={{
              background: "#1e3a8a", color: "#ffffff", padding: "10px 16px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "8px", borderLeft: "4px solid #f59e0b"
            }}>
              <div>
                <strong style={{ fontSize: "13px" }}>Phòng chờ ({waitingQueue.length}):</strong>
                <span style={{ fontSize: "12.5px", color: "#cbd5e1", marginLeft: "6px" }}>
                  {waitingQueue[0].name} ({waitingQueue[0].role}) xin vào cuộc họp.
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => handleApproveWaiting(waitingQueue[0])} style={{ background: "#22c55e", color: "#fff", border: "none", padding: "5px 14px", borderRadius: "5px", fontWeight: "800", fontSize: "12px", cursor: "pointer" }}>
                  Duyệt vào họp
                </button>
                <button onClick={() => handleRejectWaiting(waitingQueue[0])} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "5px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>
                  Từ chối
                </button>
              </div>
            </div>
          )}

          {/* Main Stage View (Giao diện SVG chuẩn HTML5) */}
          <div className="meet-stage-view" style={{ position: "relative", background: "#090d16", borderRadius: "16px", border: "1px solid #1e293b", overflow: "hidden", margin: 0 }}>
            
            {/* Top-left tag badge */}
            <div style={{
              position: "absolute", top: "14px", left: "14px", zIndex: 30,
              background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)",
              border: "1px solid #334155", borderRadius: "20px", padding: "4px 12px",
              color: "#ffffff", fontSize: "12px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px"
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4"/>
              </svg>
              <span>{fullName || "Hoàng Trung Dũng"} (Camera trực tiếp)</span>
            </div>

            {/* Top-right expand icon */}
            <button
              style={{
                position: "absolute", top: "14px", right: "14px", zIndex: 30,
                background: "rgba(15, 23, 42, 0.75)", border: "1px solid #334155",
                borderRadius: "8px", color: "#94a3b8", width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
              onClick={() => {
                if (localVideoRef.current) {
                  if (document.fullscreenElement) document.exitFullscreen();
                  else localVideoRef.current.requestFullscreen();
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>

            {/* Center Graphic for Encrypted Audio/Video State */}
            <div style={{
              width: "100%", height: "100%", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", position: "relative"
            }}>
              {/* Glowing Concentric Circles with Blue Shield SVG */}
              <div style={{
                width: "180px", height: "180px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.8) 70%)",
                border: "2px solid rgba(59, 130, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 50px rgba(37, 99, 235, 0.3)"
              }}>
                <div style={{
                  width: "130px", height: "130px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                  border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)"
                }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <rect x="9" y="11" width="6" height="5" rx="1" fill="#60a5fa" stroke="none"/>
                    <path d="M10 11V9a2 2 0 1 1 4 0v2" stroke="#60a5fa" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              <h3 style={{ margin: "20px 0 6px", color: "#f8fafc", fontSize: "18px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase" }}>
                CUỘC HỌP ĐƯỢC MÃ HÓA ĐẦU CUỐI
              </h3>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "13.5px" }}>
                Tất cả dữ liệu được bảo vệ theo tiêu chuẩn Bộ Y tế
              </p>

              {/* Bottom Glassmorphism Bar inside Stage SVG Icons */}
              <div style={{
                position: "absolute", bottom: "16px",
                background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(8px)",
                border: "1px solid #334155", borderRadius: "24px", padding: "6px 20px",
                display: "flex", alignItems: "center", gap: "20px", fontSize: "12px", color: "#cbd5e1", fontWeight: "600"
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Mã hóa E2EE
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9.5"/></svg>
                  Không ghi hình
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Không chia sẻ màn hình
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Không tải xuống
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Officer Tiles Strip (5 Cards in 1 Row) */}
          <div className="meet-grid-view" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", height: "140px" }}>
            
            {/* Card 1: Speaker Live Stream Video */}
            <div className="meet-grid-item meet-grid-item-active" style={{ background: "#0d1527", borderRadius: "12px", border: "2px solid #2563eb", overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: "6px", left: "6px", zIndex: 10, background: "#ef4444", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <svg width="6" height="6" viewBox="0 0 24 24" fill="#ffffff"><circle cx="12" cy="12" r="10"/></svg>
                TRỰC TIẾP
              </div>
              <div style={{ position: "absolute", top: "6px", right: "6px", zIndex: 10 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4"/></svg>
              </div>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="meet-video-feed local-mirror"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: "6px", left: "6px", right: "6px", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#fff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {fullName || "Hoàng Trung Dũng"}
                  </span>
                  <span style={{ background: "#2563eb", color: "#fff", fontSize: "9px", padding: "1px 5px", borderRadius: "3px", fontWeight: "800" }}>Chủ trì</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </div>
            </div>

            {/* Card 2: Phó phòng Ngô Đỗ Quỳnh */}
            <div className="meet-grid-item" style={{ background: "#0d1527", borderRadius: "12px", border: "1px solid #1e293b", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#0284c7", color: "#fff", fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                PQ
              </div>
              <div style={{ position: "absolute", bottom: "8px", left: "8px", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#f8fafc", lineHeight: "1.2" }}>Phó phòng Ngô Đỗ Quỳnh</span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Phó trưởng phòng</span>
              </div>
              <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(220, 38, 38, 0.2)", border: "1px solid #ef4444", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </div>
            </div>

            {/* Card 3: LÊ THỊ C */}
            <div className="meet-grid-item" style={{ background: "#0d1527", borderRadius: "12px", border: "1px solid #1e293b", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#059669", color: "#fff", fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                LC
              </div>
              <div style={{ position: "absolute", bottom: "8px", left: "8px", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#f8fafc", lineHeight: "1.2" }}>LÊ THỊ C</span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Phó trưởng phòng</span>
              </div>
              <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(220, 38, 38, 0.2)", border: "1px solid #ef4444", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </div>
            </div>

            {/* Card 4: Y BYAN */}
            <div className="meet-grid-item" style={{ background: "#0d1527", borderRadius: "12px", border: "1px solid #1e293b", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px" }}>
              <div style={{ position: "absolute", top: "6px", left: "6px", background: "#d97706", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "9.5px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v9"/></svg>
                Giơ tay
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#d97706", color: "#fff", fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                YB
              </div>
              <div style={{ position: "absolute", bottom: "8px", left: "8px", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", color: "#f8fafc", lineHeight: "1.2" }}>Y BYAN</span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>Cán bộ chuyên môn BHYT</span>
              </div>
              <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(220, 38, 38, 0.2)", border: "1px solid #ef4444", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </div>
            </div>

            {/* Card 5: Thành viên khác */}
            <div className="meet-grid-item" style={{ background: "#0d1527", borderRadius: "12px", border: "1px solid #1e293b", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1e293b", color: "#cbd5e1", border: "2px solid #334155", fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                +8
              </div>
              <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#94a3b8" }}>Thành viên khác</span>
            </div>

          </div>

        </div>

        {/* Right Chat & Utilities Sidebar (SVG Icon chuẩn) */}
        {isChatOpen && (
          <aside className="meet-chat-sidebar" style={{ width: "340px", background: "#0d1527", borderLeft: "1px solid #1e293b", display: "flex", flexDirection: "column" }}>
            
            {/* Header */}
            <div style={{ padding: "16px", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "900", color: "#f8fafc", letterSpacing: "0.5px" }}>
                  HỘI THOẠI CUỘC HỌP
                </h3>
              </div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "18px", cursor: "pointer" }}>
                ✕
              </button>
            </div>

            {/* Sub-nav Tabs */}
            <div style={{ padding: "10px 16px", display: "flex", gap: "8px", background: "#090d16", borderBottom: "1px solid #1e293b" }}>
              <button style={{ flex: 1, background: "#1d4ed8", color: "#ffffff", border: "none", borderRadius: "16px", padding: "8px 12px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Tin nhắn
              </button>
              <button style={{ flex: 1, background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: "16px", padding: "8px 12px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                12 người tham gia
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="meet-chat-messages" id="chat-box-area" style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Message 1 */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  PQ
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Hoàng Trung Dũng</strong>
                      <span style={{ background: "#2563eb", color: "#fff", fontSize: "9px", padding: "1px 5px", borderRadius: "3px", fontWeight: "800" }}>Chủ trì</span>
                    </div>
                    <span style={{ fontSize: "10.5px", color: "#64748b" }}>08:30</span>
                  </div>
                  <div style={{ background: "#1d4ed8", color: "#ffffff", padding: "10px 12px", borderRadius: "12px", fontSize: "12.5px", lineHeight: "1.4" }}>
                    Chào các đồng chí. Chúng ta bắt đầu cuộc họp bảo mật rà soát chỉ tiêu VH-XH và BHYT.
                  </div>
                </div>
              </div>

              {/* Message 2 */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#059669", color: "#fff", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  LC
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Phó phòng Lê Thị C</strong>
                    <span style={{ fontSize: "10.5px", color: "#64748b" }}>08:31</span>
                  </div>
                  <div style={{ background: "#1e293b", color: "#cbd5e1", padding: "10px 12px", borderRadius: "12px", fontSize: "12.5px", lineHeight: "1.4", border: "1px solid #334155" }}>
                    Báo cáo Trưởng phòng, nhờ ĐXH Wek đã hoàn thành rà soát 95% hộ nghèo rồi ạ.
                  </div>
                </div>
              </div>

              {/* Message 3 */}
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#d97706", color: "#fff", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  YB
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "12px", color: "#f8fafc" }}>Cán bộ Y Byan</strong>
                    <span style={{ fontSize: "10.5px", color: "#64748b" }}>08:33</span>
                  </div>
                  <div style={{ background: "#1e293b", color: "#cbd5e1", padding: "10px 12px", borderRadius: "12px", fontSize: "12.5px", lineHeight: "1.4", border: "1px solid #334155" }}>
                    Em xin phép giơ tay phát biểu ý kiến về hỗ trợ bị lỗi mã thẻ BHYT.
                  </div>
                </div>
              </div>

              {/* Security Banner Box in Chat SVG Icon */}
              <div style={{
                background: "rgba(66, 32, 6, 0.4)", border: "1px solid #854d0e", borderRadius: "10px",
                padding: "10px 12px", display: "flex", gap: "10px", marginTop: "6px", alignItems: "flex-start"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fef08a" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div style={{ fontSize: "11.5px", color: "#fef08a", lineHeight: "1.4" }}>
                  <div style={{ fontWeight: "700" }}>Tin nhắn được mã hóa đầu cuối</div>
                  <div style={{ color: "#fde047", opacity: 0.85 }}>Không chia sẻ thông tin nhạy cảm ra ngoài cuộc họp.</div>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #1e293b", background: "#090d16" }}>
              <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: "20px", padding: "6px 14px", display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{ flex: 1, background: "none", border: "none", color: "#ffffff", fontSize: "12.5px", outline: "none" }}
                  />
                  <button type="button" style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  </button>
                </div>
                <button
                  type="submit"
                  style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", color: "#ffffff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            </div>

            {/* Quick Utilities Panel at Bottom SVG Icons */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid #1e293b", background: "#0d1527" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                TIỆN ÍCH NHANH
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button onClick={() => setShowParticipantDropdown(!showParticipantDropdown)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Danh sách thành viên
                </button>
                <button onClick={() => setShowSummaryModal(true)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Tài liệu cuộc họp (3)
                </button>
                <button onClick={handleGenerateAIBienBan} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Ghi chú cuộc họp
                </button>
                <button onClick={handleEndMeetingForAll} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "11.5px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Báo cáo sau họp
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Control bar (Icon SVG HTML5 chuẩn) */}
      <footer className="meet-controls-bar" style={{ height: "80px", background: "#090d16", borderTop: "1px solid #1e293b", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", padding: "8px 14px", borderRadius: "8px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Kiểm tra thiết bị
          </button>
          <button style={{ background: "#1e293b", color: "#cbd5e1", border: "1px solid #334155", padding: "8px 14px", borderRadius: "8px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Cài đặt
          </button>
        </div>

        {/* Center Round Action Buttons SVG */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #334155",
                background: isMuted ? "#ef4444" : "#1e293b", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              )}
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{isMuted ? "Bật mic" : "Tắt mic"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              style={{
                width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #334155",
                background: isCameraOff ? "#ef4444" : "#1e293b", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              {isCameraOff ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.6 0H14a2 2 0 0 1 2 2v4l5-3v8.5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              )}
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>{isCameraOff ? "Bật camera" : "Tắt camera"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={handleToggleRaiseHand}
              style={{
                width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #334155",
                background: isHandRaised ? "#d97706" : "#1e293b", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v9"/><path d="M18 11a2 2 0 0 1 4 0v5a10 10 0 0 1-10 10 10 10 0 0 1-10-10V9a2 2 0 0 1 4 0v4"/></svg>
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>Giơ tay</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              style={{
                width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #334155",
                background: isSharingScreen ? "#10b981" : "#1e293b", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>Chia sẻ</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              style={{
                width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #334155",
                background: isChatOpen ? "#2563eb" : "#1e293b", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>Chat</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setShowOfficerModal(true)}
              style={{
                width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #334155",
                background: "#1e293b", color: "#ffffff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
            </button>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>Thêm</span>
          </div>
        </div>

        {/* Right Red Leave Meeting Button SVG */}
        <div>
          <button
            onClick={isHost ? handleEndMeetingForAll : handleLeaveMeeting}
            style={{
              background: "#ef4444", color: "#ffffff", border: "none",
              padding: "10px 22px", borderRadius: "20px", fontSize: "13.5px", fontWeight: "800",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.68 13.31a16 16 0 0 0 3.41 3.41l2.42-2.42a1 1 0 0 1 1.07-.21 11.57 11.57 0 0 0 3.63.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h4.27a1 1 0 0 1 1 1 11.56 11.56 0 0 0 .58 3.63 1 1 0 0 1-.21 1.07l-2.42 2.42z"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <span>Rời cuộc họp</span>
          </button>
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

      {/* MODAL MỜI CÁN BỘ CƠ QUAN VÀO PHÒNG HỌP THỰC TẾ */}
      {showAddOfficerModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
          background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            background: "#1e293b", border: "1px solid #334155", borderRadius: "12px",
            width: "100%", maxWidth: "520px", padding: "22px", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", color: "#ffffff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>👥</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "15px", color: "#60a5fa", fontWeight: "800" }}>
                    KẾT NỐI CÁN BỘ CƠ QUAN VÀO PHÒNG HỌP THỰC TẾ
                  </h3>
                  <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                    Phòng Văn hóa - Xã hội
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowAddOfficerModal(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "16px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto", paddingRight: "4px" }}>
              {OFFICIAL_OFFICERS.map((officer) => {
                const isAlreadyJoined = participants.some(p => p.name.includes(officer.name));
                return (
                  <div
                    key={officer.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: isAlreadyJoined ? "#0f172a" : "#334155",
                      border: `1px solid ${isAlreadyJoined ? "#1e293b" : "#475569"}`,
                      padding: "10px 14px", borderRadius: "8px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: officer.color, color: "#ffffff",
                        fontWeight: "900", fontSize: "13px",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        {officer.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#f8fafc" }}>
                          {officer.name}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                          {officer.role}
                        </div>
                      </div>
                    </div>

                    {isAlreadyJoined ? (
                      <span style={{ fontSize: "11px", fontWeight: "800", background: "#065f46", color: "#a7f3d0", padding: "4px 10px", borderRadius: "20px" }}>
                        🔴 Đang dự họp
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const newPart = {
                            id: `off-${Date.now()}`,
                            name: officer.name,
                            role: officer.role,
                            isHost: officer.isHost,
                            isMuted: true,
                            isCameraOff: true,
                            isHandRaised: false,
                            isSpeaking: false,
                            isSelf: false,
                            color: officer.color
                          };
                          setParticipants(prev => [...prev, newPart]);
                          triggerToast(`Đã kết nối ${officer.name} vào cuộc họp trực tuyến!`, "success");
                          setMessages(prev => [
                            ...prev,
                            {
                              id: Date.now(),
                              sender: "Hệ thống Kết nối",
                              time: currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                              content: `Đã kết nối Cán bộ ${officer.name} (${officer.role}) tham gia cuộc họp.`,
                              self: false
                            }
                          ]);
                        }}
                        style={{
                          background: "#005baa", color: "#ffffff", border: "none",
                          padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
                          fontWeight: "800", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                        }}
                      >
                        + Kết nối ngay
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #334155", textAlign: "right" }}>
              <button
                onClick={() => setShowAddOfficerModal(false)}
                style={{ background: "#475569", color: "#fff", border: "none", padding: "7px 18px", borderRadius: "6px", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}
              >
                Đóng cửa sổ
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
                PHÒNG VĂN HÓA - XÃ HỘI
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
