import { useState, useRef } from "react";
import axios from "axios";
import "./TTSButton.css";

const TTS_TEXTS = {
  child:
    "Các em nhỏ ơi! Không được tắm sông suối một mình. Luôn có bố mẹ đi cùng. Khi thấy bạn bị ngã xuống nước hãy kêu to gọi người lớn ngay nhé!",
  adult:
    "Người đuối nước thường không kêu cứu được và chìm dần. Không nhảy xuống nước nếu bạn không biết bơi. Hãy ném dây, sào, phao để cứu và gọi 115 ngay.",
};

export default function TTSButton({ type = "child", label = "Nhấn để nghe", title }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const handlePlay = () => {
    if (!("speechSynthesis" in window)) return;

    if (playing) {
      window.speechSynthesis.cancel();
      clearInterval(intervalRef.current);
      setPlaying(false);
      setProgress(0);
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
      const visitorUrl = apiBase.replace("/api/v1", "/api/visitor/hit");
      const username = localStorage.getItem("admin_username") || "citizen";
      const role = localStorage.getItem("admin_role") || "citizen";
      axios.post(visitorUrl, { username, role, pathname: "/nghe-dai" }).catch(() => {});
    } catch (err) {}

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(TTS_TEXTS[type]);
    utt.lang = "vi-VN";
    utt.rate = 0.85;

    setPlaying(false);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 95));
    }, 200);

    utt.onend = () => {
      clearInterval(intervalRef.current);
      setProgress(100);
      setPlaying(false);
      setTimeout(() => setProgress(0), 1500);
    };

    utt.onerror = () => {
      clearInterval(intervalRef.current);
      setPlaying(false);
      setProgress(0);
    };

    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="tts-card">
      <div className="tts-row">
        <button className="tts-icon-wrap" onClick={handlePlay} aria-label={playing ? "Dừng" : "Phát"}>
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
        <div className="tts-texts">
          <div className="tts-label">{label}</div>
          <div className="tts-title">{title}</div>
        </div>
      </div>
      <div className="tts-bar">
        <div className="tts-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}