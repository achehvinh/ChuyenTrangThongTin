import React, { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { FEATURES, DETAILS } from "../data"; 
import './AllFeaturesPage.css';
import { useLang } from '../LanguageContext';

export default function AllFeaturesPage() {
  const navigate = useNavigate();
  const { category } = useParams();
  const path = `/${category}`;
const { lang } = useLang();
const [speaking, setSpeaking] = useState(false);

const data = DETAILS[path];

if (!data) {
  return <Navigate to="/" replace />;
}
  const audioRef = React.useRef(null);
  React.useEffect(() => {
  // Tự động đọc khi mở trang
  const text = lang === 'vi' ? data.content : (data.content_xd || data.content);
  setSpeaking(true);

  const timer = setTimeout(async () => {
    try {
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
        audio.play().catch(() => {
  console.log("Trình duyệt chặn autoplay");
  setSpeaking(false);
});
        audio.onended = () => setSpeaking(false);
      } else {
        setSpeaking(false);
      }
    } catch (err) {
      setSpeaking(false);
    }
  }, 1000); // chờ 1 giây sau khi trang load xong mới đọc

  return () => {
    clearTimeout(timer);
    // Dừng audio khi chuyển trang
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  };
}, [category, lang]); // chạy lại khi đổi chuyên mục hoặc đổi ngôn ngữ
  const handleSpeak = async () => {
    if (speaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
      return;
    }

    const text = lang === 'vi' ? data.content : (data.content_xd || data.content);
    setSpeaking(true);

    try {
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
        audio.play().catch(() => {
  console.log("Trình duyệt chặn autoplay");
  setSpeaking(false);
});
        audio.onended = () => setSpeaking(false);
      } else {
        setSpeaking(false);
      }

    } catch (err) {
      console.error('Lỗi TTS:', err);
      setSpeaking(false);
    }
  };

  if (!data) return <Navigate to="/" replace />;

  return (
    <div className="all-features-container">

      {/* 1. Phần tiêu đề chính */}
      <section className="feature-group-single">
<div className="header-content">
  <h1>{lang === 'vi' ? data.title : (data.title_xd || data.title)}</h1>
  <p>
  {lang === 'vi'
    ? data.content
    : (data.content_xd || data.content)}
</p>
<ul>
  {(data.warning || []).map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
</div>
        {/* 2. Gallery ảnh */}
        <div className="gallery-grid">
          {data.images && data.images.map((img, index) => (
            <img key={index} src={img} alt={`${data.title} ${index}`} className="gallery-item" />
          ))}
        </div>

        {/* 3. Video hướng dẫn */}
        {data.videos && data.videos.length > 0 && (
          <div className="video-section">
            <h2 className="video-section-title">🎬 Video hướng dẫn</h2>
            <div className="video-list">
 {data.videos.map((v, i) => (
  <div className="video-item" key={i}>

    {v.type === 'local' ? (
      // Video từ thư mục
      <video
  controls
  autoPlay
  muted
  className="video-frame"
  src={v.src}
>
        Trình duyệt không hỗ trợ video.
      </video>
    ) : (
      // Video YouTube
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${v.id}`}
        title={v.title}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="video-frame"
      />
    )}

    <p className="video-title">{v.title}</p>
  </div>
))}
            </div>
          </div>
        )}

      </section>

      {/* 4. Phần footer chuyên mục khác */}
      <section className="all-categories-footer">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#005bac' }}>
          {lang === 'vi' ? 'Khám phá các chuyên mục khác' : 'Lăng ngă chuyên mục pơlei'}
        </h2>
        <div className="footer-grid"> 
          {FEATURES.map((f) => (
            <div 
              className={`footer-card ${f.path === path ? 'active' : ''}`}
              key={f.title} 
              onClick={() => {
                navigate(f.path);
                window.scrollTo(0, 0);
              }}
            >
              <img src={f.image} alt={f.title} className="footer-card-image" />
              <div className="footer-card-content">
                <h3>{lang === 'vi' ? f.title : (f.title_xd || f.title)}</h3>
                <p>{lang === 'vi' ? f.desc : (f.desc_xd || f.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}