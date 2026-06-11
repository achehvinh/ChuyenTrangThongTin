import { useState, useRef, useEffect } from 'react';
import { ALERTS } from '../data';
import './AlertBanner.css';

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState([]);
  const audioRef = useRef(null);

  const activeAlerts = ALERTS.filter(a => a.active && !dismissed.includes(a.id));

  // Tự động đọc thông báo khẩn đầu tiên có autoRead
  useEffect(() => {
    const toRead = activeAlerts.find(a => a.autoRead);
    if (!toRead) return;

    const timer = setTimeout(async () => {
      try {
        const text = `Thông báo khẩn. ${toRead.title}. ${toRead.content}`;
        const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
          method: 'POST',
          headers: {
            'api-key': 't0GDbvE0lBxIjW3SKxcGeoaKMxrACwOH',
            'speed': '',
            'voice': 'linhsan',
          },
          body: text,
        });
        const result = await response.json();
        if (result.async) {
          const audio = new Audio(result.async);
          audioRef.current = audio;
          audio.play();
        }
      } catch (err) {
        console.error('TTS error:', err);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="alert-banner-wrapper">
      {activeAlerts.map(alert => (
        <div
          key={alert.id}
          className={`alert-banner alert-${alert.level}`}
        >
          <div className="alert-banner-inner">

            {/* Icon nhấp nháy */}
            <div className="alert-icon-wrap">
              <span className="alert-pulse" />
              <span className="alert-icon">
                {alert.level === 'danger' ? '🚨' : '⚠️'}
              </span>
            </div>

            {/* Nội dung */}
            <div className="alert-content">
              <div className="alert-meta">
                <span className="alert-level-badge">
                  {alert.level === 'danger' ? 'KHẨN CẤP' : 'CHÚ Ý'}
                </span>
                <span className="alert-thon">📍 {alert.thon}</span>
                <span className="alert-time">🕐 {alert.time}</span>
              </div>
              <h3 className="alert-title">{alert.title}</h3>
              <p className="alert-text">{alert.content}</p>
            </div>

            {/* Nút đọc + đóng */}
            <div className="alert-actions">
              <button
                className="alert-read-btn"
                onClick={async () => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                    return;
                  }
                  try {
                    const text = `${alert.title}. ${alert.content}`;
                    const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
                      method: 'POST',
                      headers: {
                        'api-key': 't0GDbvE0lBxIjW3SKxcGeoaKMxrACwOH',
                        'speed': '',
                        'voice': 'linhsan',
                      },
                      body: text,
                    });
                    const result = await response.json();
                    if (result.async) {
                      const audio = new Audio(result.async);
                      audioRef.current = audio;
                      audio.play();
                      audio.onended = () => { audioRef.current = null; };
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                🔊 Nghe
              </button>

              <button
                className="alert-dismiss-btn"
                onClick={() => setDismissed(prev => [...prev, alert.id])}
                title="Đóng thông báo"
              >
                ✕
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}