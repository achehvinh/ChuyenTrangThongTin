import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayCircle, 
  PauseCircle, 
  SpeakerHigh, 
  SpeakerSlash, 
  Waveform, 
  CheckCircle, 
  WarningCircle, 
  Timer 
} from '../icons';

export default function OneMinutePlayer({ lesson, onComplete }) {
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lesson?.duration || 60);
  const [isMuted, setIsMuted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    // Reset player state when lesson changes
    setIsPlaying(false);
    setCurrentTime(0);
    setHasEnded(false);
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [lesson?.id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setAudioError(false);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasEnded(false);
          })
          .catch((err) => {
            console.error("Audio playback error:", err);
            // Fallback timer simulation for seamless user experience if browser blocks cross-origin audio
            setIsPlaying(true);
            setHasEnded(false);
          });
      }
    }
  };

  // Timer simulation fallback for audio playback
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            setHasEnded(true);
            if (onComplete) onComplete();
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, onComplete]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.currentTime) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(Math.floor(audioRef.current.duration) || 60);
    }
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingSeconds = Math.max(0, duration - currentTime);
  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  return (
    <div className={`omp-custom-player-card ${isPlaying ? 'omp-is-playing-glow' : ''}`}>
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={lesson?.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => setAudioError(true)}
      />

      {/* TOP CONTROLS & TIMING DISPLAY */}
      <div className="omp-player-header">
        
        {/* BIG CIRCULAR PLAY/PAUSE BUTTON (56PX) */}
        <button
          className={`omp-big-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Tạm dừng audio" : "Phát bài 1 phút hôm nay"}
        >
          {isPlaying ? (
            <PauseCircle size={44} weight="fill" color="#ffffff" />
          ) : (
            <PlayCircle size={44} weight="fill" color="#ffffff" />
          )}
        </button>

        {/* PROGRESS SCRUBBER & WAVEFORM */}
        <div className="omp-middle-scrubber">
          <div className="omp-title-status-row">
            <div className="omp-player-status-badge">
              {isPlaying ? (
                <span className="omp-live-badge"><span className="omp-dot-pulse"></span> Đang phát</span>
              ) : hasEnded ? (
                <span className="omp-ended-badge"><CheckCircle size={14} color="#15803d" /> Đã hoàn thành</span>
              ) : (
                <span className="omp-idle-badge"><Timer size={14} color="#2d6a4f" /> Bài học 60 giây</span>
              )}
            </div>

            {/* WAVEFORM EQUALIZER ANIMATION */}
            {isPlaying && (
              <div className="omp-waveform-equalizer">
                <span className="bar b1"></span>
                <span className="bar b2"></span>
                <span className="bar b3"></span>
                <span className="bar b4"></span>
                <span className="bar b5"></span>
              </div>
            )}
          </div>

          {/* RANGE INPUT PROGRESS BAR */}
          <div className="omp-progress-container">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="omp-progress-bar"
              style={{
                background: `linear-gradient(to right, #1b4332 ${progressPercent}%, #e2d3be ${progressPercent}%)`
              }}
              aria-label="Thanh thời gian bài nói 60 giây"
            />
          </div>

          {/* TIMER DISPLAY */}
          <div className="omp-time-labels">
            <span className="omp-curr-time">{formatTime(currentTime)}</span>
            <span className="omp-total-time">{formatTime(duration)}</span>
          </div>
        </div>

        {/* CIRCULAR 60-SECOND COUNTDOWN RING */}
        <div className="omp-circular-timer-box" title="Thời gian còn lại">
          <svg className="omp-circle-svg" width="60" height="60" viewBox="0 0 60 60">
            <circle className="omp-circle-bg" cx="30" cy="30" r="24" />
            <circle
              className="omp-circle-bar"
              cx="30"
              cy="30"
              r="24"
              style={{
                strokeDasharray: 151,
                strokeDashoffset: 151 - (151 * progressPercent) / 100
              }}
            />
          </svg>
          <div className="omp-circle-text">
            <span className="omp-sec-num">{remainingSeconds}</span>
            <span className="omp-sec-label">giây</span>
          </div>
        </div>

        {/* VOLUME TOGGLE */}
        <button
          className="omp-mute-btn"
          onClick={toggleMute}
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? <SpeakerSlash size={22} color="#dc2626" /> : <SpeakerHigh size={22} color="#1b4332" />}
        </button>

      </div>

      {/* AUDIO ERROR STATE HANDLER */}
      {audioError && (
        <div className="omp-audio-error-banner">
          <WarningCircle size={18} color="#dc2626" />
          <span>Không thể phát tệp âm thanh trực tiếp. Hệ thống đã chuyển sang chế độ đọc mô phỏng.</span>
          <button className="omp-retry-btn" onClick={togglePlay}>Thử lại</button>
        </div>
      )}

    </div>
  );
}
