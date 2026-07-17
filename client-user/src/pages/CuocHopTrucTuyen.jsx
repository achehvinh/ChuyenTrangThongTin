import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CuocHopTrucTuyen.css";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export default function CuocHopTrucTuyen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const fullName = localStorage.getItem("admin_fullname") || "Cán bộ chuyên viên";
  const role = localStorage.getItem("admin_role");

  // Call status states
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

  // Meeting Details
  const [meeting, setMeeting] = useState({
    title: "Cuộc họp Ban Chỉ đạo BHYT Xã Đăk Pxi",
    thon: "Toàn thể Cán bộ",
    location: "Phòng họp trực tuyến",
  });

  // Chat states
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Trưởng phòng Nguyễn Thái Huy",
      time: "12:00",
      content: "Chào các đồng chí. Hôm nay chúng ta họp rà soát tiến độ cấp thẻ BHYT đợt 2 cho các thôn khó khăn.",
      self: false,
    },
    {
      id: 2,
      sender: "Phó phòng Lê Thị C",
      time: "12:02",
      content: "Báo cáo Trưởng phòng, thôn Đăk Wek đã hoàn thành rà soát 95% hộ nghèo rồi ạ.",
      self: false,
    },
    {
      id: 3,
      sender: "Cán bộ Y Byen",
      time: "12:03",
      content: "Em cũng đã tổng hợp danh sách thôn Đăk Xế Kơ Ne gửi lên hệ thống, nhờ Trưởng phòng phê duyệt.",
      self: false,
    },
  ]);

  // Fetch actual meeting details if ID exists
  useEffect(() => {
    if (id && token) {
      axios
        .get(`${BASE_URL}/api/lich-hop`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const found = res.data.find((m) => m._id === id);
          if (found) {
            setMeeting(found);
          }
        })
        .catch((err) => console.error("Không tải được chi tiết cuộc họp", err));
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

  // Web Audio Visualizer initialization
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

        // Apply scale directly to local bars in DOM
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

    // Reset local bars height
    const localWave = document.getElementById("local-audio-wave");
    if (localWave) {
      const bars = localWave.getElementsByClassName("wave-bar");
      for (let j = 0; j < bars.length; j++) {
        bars[j].style.height = "4px";
      }
    }
  };

  // Manage camera/mic media stream lifecycle
  useEffect(() => {
    const handleMediaDevices = async () => {
      try {
        if (!isCameraOff) {
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
          localStreamRef.current = stream;

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          stream.getAudioTracks().forEach(track => {
            track.enabled = !isMuted;
          });

          initVisualizer(stream);
        } else {
          // Camera is off, we still keep mic stream if not muted
          if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(t => t.stop());
            if (isMuted) {
              localStreamRef.current.getTracks().forEach(t => t.stop());
              localStreamRef.current = null;
              stopVisualizer();
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi mở camera/micro:", err);
      }
    };

    handleMediaDevices();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      stopVisualizer();
    };
  }, [isCameraOff]);

  // Handle Mute changes
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }

    if (isMuted) {
      stopVisualizer();
    } else if (localStreamRef.current) {
      initVisualizer(localStreamRef.current);
    }
  }, [isMuted]);

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

          // Handle when user stops sharing from browser toolbar
          const track = stream.getVideoTracks()[0];
          track.onended = () => {
            setIsSharingScreen(false);
          };
        } else {
          if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
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
        screenStreamRef.current.getTracks().forEach(t => t.stop());
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

    setMessages([...messages, newMsg]);
    setChatInput("");

    setTimeout(() => {
      const chatBox = document.getElementById("chat-box-area");
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 50);
  };

  const handleLeaveMeeting = () => {
    if (window.confirm("Bạn có chắc chắn muốn rời cuộc họp trực tuyến này?")) {
      navigate("/truong-phong");
    }
  };

  return (
    <div className="meet-room-wrapper">
      {/* Header section */}
      <header className="meet-header">
        <div className="meet-info">
          <span className="meet-badge-live">Trực tiếp</span>
          <h2 className="meet-title">{meeting.title}</h2>
          <span style={{ color: "#475569" }}>|</span>
          <div className="meet-timer">Thời lượng: {formatDuration(meetingSeconds)}</div>
        </div>
        <div className="meet-header-right">
          <span className="meet-participant-count">👥 5 người tham gia</span>
          <div className="meet-timer" style={{ fontSize: "14px", fontWeight: "700" }}>
            🕒 {currentTime.toLocaleTimeString("vi-VN")}
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <div className="meet-main-area">
        {/* Left Video grid column */}
        <div className="meet-videos-container">
          {/* Main big screen: Speaker or Screen Share */}
          <div className="meet-stage-view">
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
                  🖥️ Đang chia sẻ màn hình của bạn ({fullName})
                </div>
              </div>
            ) : (
              /* Standard camera view (mocking active speaker stream) */
              <div
                className="meet-stage-video-mock"
                style={{
                  background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=640') no-repeat center/cover",
                }}
              >
                {/* Active speaker highlight */}
                <div className="meet-active-speaker-ring"></div>
                
                <div className="meet-participant-name-tag">
                  <span className="meet-audio-wave-dot">
                    <span className="wave-bar" style={{ animationDelay: "0s" }}></span>
                    <span className="wave-bar" style={{ animationDelay: "0.15s" }}></span>
                    <span className="wave-bar" style={{ animationDelay: "0.3s" }}></span>
                  </span>
                  Trưởng phòng Nguyễn Thái Huy (Đang phát biểu)
                </div>
              </div>
            )}
          </div>

          {/* Bottom Video Row grid */}
          <div className="meet-grid-view">
            {/* Grid 1: Phó phòng Lê Thị C */}
            <div className="meet-grid-item meet-grid-item-active">
              <div
                className="meet-grid-item-video"
                style={{
                  background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300') no-repeat center/cover",
                }}
              >
                <div className="meet-grid-name-tag">
                  <span className="meet-audio-wave-dot">
                    <span className="wave-bar" style={{ animationDelay: "0s" }}></span>
                    <span className="wave-bar" style={{ animationDelay: "0.15s" }}></span>
                    <span className="wave-bar" style={{ animationDelay: "0.3s" }}></span>
                  </span>
                  Phó phòng Lê Thị C
                </div>
                <div className="meet-status-indicator">
                  <span className="meet-badge-status green">🎙️</span>
                </div>
              </div>
            </div>

            {/* Grid 2: Cán bộ Y Byen */}
            <div className="meet-grid-item">
              <div
                className="meet-grid-item-video"
                style={{
                  background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300') no-repeat center/cover",
                }}
              >
                <div className="meet-grid-name-tag">Cán bộ Y Byen</div>
                <div className="meet-status-indicator">
                  <span className="meet-badge-status red">🔇</span>
                </div>
              </div>
            </div>

            {/* Grid 3: Cán bộ A Blong */}
            <div className="meet-grid-item">
              <div
                className="meet-grid-item-video"
                style={{
                  background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300') no-repeat center/cover",
                }}
              >
                <div className="meet-grid-name-tag">Cán bộ A Blong</div>
                <div className="meet-status-indicator">
                  <span className="meet-badge-status red">🔇</span>
                </div>
              </div>
            </div>

            {/* Grid 4: User feed (You - Live camera with audio visualizer) */}
            <div className="meet-grid-item">
              {isCameraOff ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div className="meet-avatar-placeholder" style={{ width: "42px", height: "42px", fontSize: "14px" }}>
                    {fullName.split(" ").pop().substring(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>Bạn (Tắt cam)</span>
                </div>
              ) : (
                <div className="meet-grid-item-video">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="meet-video-feed local-mirror"
                  />
                  <div className="meet-grid-name-tag">
                    <span className="meet-audio-wave-dot" id="local-audio-wave">
                      <span className="wave-bar" style={{ height: "4px" }}></span>
                      <span className="wave-bar" style={{ height: "4px" }}></span>
                      <span className="wave-bar" style={{ height: "4px" }}></span>
                    </span>
                    Bạn ({fullName})
                  </div>
                  <div className="meet-status-indicator">
                    <span className={`meet-badge-status ${isMuted ? "red" : "green"}`}>
                      {isMuted ? "🔇" : "🎙️"}
                    </span>
                  </div>
                </div>
              )}
            </div>
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
                  placeholder="Gửi tin nhắn cho phòng họp..."
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

      {/* Control bar */}
      <footer className="meet-controls-bar">
        <div className="meet-controls-left">
          Phòng họp trực tuyến / Đăk Pxi
        </div>

        <div className="meet-controls-center" style={{ display: "flex", gap: "10px" }}>
          {/* Mute Mic button */}
          <button
            className={`meet-btn-control-flat ${isMuted ? "active" : ""}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? "🔇 Bật Mic" : "🎙️ Tắt Mic"}
          </button>

          {/* Camera toggle button */}
          <button
            className={`meet-btn-control-flat ${isCameraOff ? "active" : ""}`}
            onClick={() => setIsCameraOff(!isCameraOff)}
          >
            {isCameraOff ? "📷 Bật Cam" : "📹 Tắt Cam"}
          </button>

          {/* Screen Share button */}
          <button
            className={`meet-btn-control-flat ${isSharingScreen ? "share-active" : ""}`}
            onClick={() => setIsSharingScreen(!isSharingScreen)}
          >
            {isSharingScreen ? "🛑 Dừng chia sẻ" : "🖥️ Chia sẻ"}
          </button>

          {/* Toggle Chat button */}
          <button
            className={`meet-btn-control-flat ${isChatOpen ? "share-active" : ""}`}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            💬 Trò chuyện
          </button>
        </div>

        <div className="meet-controls-right">
          {/* Leave meeting button */}
          <button className="meet-btn-leave" onClick={handleLeaveMeeting}>
            🚪 Rời cuộc họp
          </button>
        </div>
      </footer>
    </div>
  );
}
