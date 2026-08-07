import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Timer, 
  ClockCountdown, 
  Sparkle, 
  CaretLeft, 
  CheckCircle, 
  WarningCircle, 
  Heart, 
  Plant, 
  ShieldCheck, 
  UsersThree, 
  BookOpen 
} from '../components/icons';

import OneMinuteHero from '../components/OneMinute/OneMinuteHero';
import TopicList from '../components/OneMinute/TopicList';
import OneMinuteHistory from '../components/OneMinute/OneMinuteHistory';
import SuggestionBanner from '../components/OneMinute/SuggestionBanner';
import { 
  getOneMinuteToday, 
  getAllOneMinuteLessons, 
  TOPICS 
} from '../services/oneMinuteService';

import './OneMinutePage.css';

export default function OneMinutePage() {
  const navigate = useNavigate();

  const [featuredLesson, setFeaturedLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [activeTopic, setActiveTopic] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // SEO Document Title
  useEffect(() => {
    document.title = "1 Phút Hôm Nay | Chuyên trang Văn hóa - Xã hội xã Đăk Pxi";
    window.scrollTo(0, 0);
  }, []);

  // Fetch Lessons Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = await getOneMinuteToday();
        const list = await getAllOneMinuteLessons();
        setFeaturedLesson(today);
        setAllLessons(list);
      } catch (err) {
        console.error("Lỗi tải bài học 1 phút:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for custom update events from admin manager
    const handleUpdate = () => {
      fetchData();
    };
    window.addEventListener('one_minute_updated', handleUpdate);
    return () => window.removeEventListener('one_minute_updated', handleUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSelectTopic = (topicId) => {
    setActiveTopic(topicId);
    if (topicId === 'all') {
      if (allLessons.length > 0) setFeaturedLesson(allLessons[0]);
    } else {
      const filtered = allLessons.filter(l => l.category === topicId);
      if (filtered.length > 0) {
        setFeaturedLesson(filtered[0]);
      } else {
        showToast(`Chủ đề này chưa có bài mới, hiển thị bài nổi bật`);
      }
    }
  };

  const handleSelectLesson = (lesson) => {
    setFeaturedLesson(lesson);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Filter lessons for history carousel
  const filteredHistory = activeTopic === 'all' 
    ? allLessons 
    : allLessons.filter(l => l.category === activeTopic);

  return (
    <div className="omp-page-container">
      
      {/* HEADER BANNER */}
      <div className="omp-header-banner">
        <div className="omp-header-inner">
          <button 
            className="omp-back-home-btn" 
            onClick={() => navigate('/')}
            aria-label="Về trang chủ Chuyên trang Đăk Pxi"
          >
            <CaretLeft size={16} weight="bold" />
            <span>VỀ TRANG CHỦ</span>
          </button>

          <div className="omp-header-badge-tag">
            <Timer size={18} weight="duotone" color="#1b4332" />
            <span>CHUYÊN MỤC TRUYỀN THÔNG CỘNG ĐỒNG</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="omp-main-grid">
        
        {/* LEFT COLUMN: HERO FEATURED LESSON & CAROUSEL */}
        <div className="omp-left-column">
          
          {loading ? (
            /* SKELETON LOADER STATE */
            <div className="omh-today-featured-wrapper" style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#64748b' }}>
                <Timer size={36} className="omp-dot-pulse" color="#1b4332" />
                <p style={{ marginTop: '12px', fontWeight: 700 }}>Đang tải nội dung 1 Phút Hôm Nay...</p>
              </div>
            </div>
          ) : featuredLesson ? (
            /* FEATURED LESSON HERO CARD */
            <OneMinuteHero 
              lesson={featuredLesson}
              onLessonCompleted={() => {}}
              showToast={showToast}
            />
          ) : (
            /* EMPTY STATE */
            <div className="omh-today-featured-wrapper" style={{ padding: '40px', textAlign: 'center' }}>
              <Timer size={48} color="#d49f53" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1b4332', marginTop: '12px' }}>
                Chưa có bài 1 phút hôm nay
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Chúng tôi đang chuẩn bị một nội dung hữu ích cho bà con xã Đăk Pxi.
              </p>
            </div>
          )}

          {/* CAROUSEL "CÁC BÀI 1 PHÚT ĐÃ PHÁT HÀNH" */}
          <OneMinuteHistory 
            lessons={filteredHistory.length > 0 ? filteredHistory : allLessons}
            currentLessonId={featuredLesson?.id}
            onSelectLesson={handleSelectLesson}
          />

          {/* SUGGESTION BANNER */}
          <SuggestionBanner showToast={showToast} />

        </div>

        {/* RIGHT COLUMN: TOPIC SELECTION PANEL */}
        <div className="omp-right-column">
          <TopicList 
            topics={TOPICS}
            activeTopic={activeTopic}
            onSelectTopic={handleSelectTopic}
          />
        </div>

      </div>

      {/* TOAST NOTICE FEEDBACK */}
      {toastMessage && (
        <div className="om-toast-notice">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
