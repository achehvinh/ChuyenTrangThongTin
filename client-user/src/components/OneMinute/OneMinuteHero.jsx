import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  Sparkle, 
  Heart, 
  Plant, 
  ShieldCheck, 
  UsersThree, 
  BookOpen, 
  BookmarkSimple, 
  ShareNetwork, 
  FirstAid,
  Lightbulb
} from '../icons';
import OneMinutePlayer from './OneMinutePlayer';

const getTopicIcon = (category) => {
  switch (category) {
    case 'health':
      return <Heart size={16} weight="fill" color="#ef4444" />;
    case 'agriculture':
      return <Plant size={16} weight="fill" color="#15803d" />;
    case 'safety':
      return <ShieldCheck size={16} weight="fill" color="#d97706" />;
    case 'education':
      return <BookOpen size={16} weight="fill" color="#8b5cf6" />;
    default:
      return <UsersThree size={16} weight="fill" color="#0284c7" />;
  }
};

export default function OneMinuteHero({ lesson, onLessonCompleted, showToast }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!lesson) return;
    try {
      const bookmarks = JSON.parse(localStorage.getItem('dakpxi_one_minute_bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(lesson.id));

      const completed = JSON.parse(localStorage.getItem('dakpxi_one_minute_completed') || '[]');
      setIsCompleted(completed.includes(lesson.id));
    } catch (e) {
      // Ignored
    }
  }, [lesson?.id]);

  const handleToggleBookmark = () => {
    if (!lesson) return;
    try {
      let bookmarks = JSON.parse(localStorage.getItem('dakpxi_one_minute_bookmarks') || '[]');
      if (bookmarks.includes(lesson.id)) {
        bookmarks = bookmarks.filter(id => id !== lesson.id);
        setIsBookmarked(false);
        if (showToast) showToast('Đã bỏ lưu bài học này');
      } else {
        bookmarks.push(lesson.id);
        setIsBookmarked(true);
        if (showToast) showToast('📌 Đã lưu bài học vào danh sách yêu thích!');
      }
      localStorage.setItem('dakpxi_one_minute_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Bookmark error:", e);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: lesson?.title || "1 Phút Hôm Nay | Đăk Pxi",
      text: `${lesson?.title} - Chuyên trang Văn hóa Xã hội xã Đăk Pxi`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        if (showToast) showToast('🔗 Đã sao chép liên kết bài học!');
      } catch (e) {
        if (showToast) showToast('Liên kết: ' + window.location.href);
      }
    }
  };

  const handlePlayerCompleted = () => {
    setIsCompleted(true);
    if (!lesson) return;
    try {
      let completed = JSON.parse(localStorage.getItem('dakpxi_one_minute_completed') || '[]');
      if (!completed.includes(lesson.id)) {
        completed.push(lesson.id);
        localStorage.setItem('dakpxi_one_minute_completed', JSON.stringify(completed));
      }
    } catch (e) {
      // Ignored
    }
    if (showToast) showToast('✓ Bạn đã hoàn thành bài học hôm nay!');
    if (onLessonCompleted) onLessonCompleted(lesson.id);
  };

  if (!lesson) return null;

  return (
    <div className="omh-today-featured-wrapper">
      
      {/* HEADER SECTION AS SPECIFIED IN D */}
      <div className="omh-section-header">
        <div className="omh-header-title-box">
          <div className="omh-timer-icon-animated">
            <Sparkle size={26} weight="duotone" color="#d49f53" />
          </div>
          <div>
            <h2 className="omh-header-main-title">
              1 PHÚT HÔM NAY
            </h2>
            <p className="omh-header-sub">⏱️ Mỗi ngày một kiến thức — Mỗi phút một giá trị</p>
          </div>
        </div>

        <div className="omh-daily-badge">
          <span>Cập nhật mỗi ngày</span>
        </div>
      </div>

      {/* TODAY'S LESSON MAIN CARD (DESKTOP 2-COL / MOBILE 1-COL) */}
      <div className="omh-hero-card">
        
        {/* LEFT COLUMN: HERO IMAGE (60% DESKTOP) */}
        <div className="omh-image-column">
          <div className="omh-image-frame">
            <img 
              src={lesson.image} 
              alt={lesson.title} 
              className="omh-hero-img" 
            />
            <div className="omh-image-overlay"></div>

            {/* BADGE CHỦ ĐỀ GÓC TRÊN TRÁI */}
            <div className="omh-topic-badge" style={{ borderColor: lesson.categoryColor || '#15803d' }}>
              {getTopicIcon(lesson.category)}
              <span>{lesson.categoryLabel || 'SỨC KHỎE'}</span>
            </div>

            {/* BADGE [SPARKLE] HÔM NAY */}
            {lesson.isToday && (
              <div className="omh-today-sparkle-badge">
                <Sparkle size={14} weight="fill" color="#f59e0b" />
                <span>HÔM NAY</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LESSON DETAILS & CUSTOM PLAYER (40% DESKTOP) */}
        <div className="omh-content-column">
          
          <div className="omh-topic-sublabel">
            <span>{lesson.categoryLabel || 'SỨC KHỎE'}</span>
            <span className="omh-dot">•</span>
            <span>{lesson.date}</span>
          </div>

          <h1 className="omh-lesson-title">
            {lesson.title}
          </h1>

          {/* 3-4 QUICK KEY POINTS CHECKLIST (CHECKCIRCLE) */}
          <div className="omh-points-list">
            {lesson.points && lesson.points.map((pt, idx) => (
              <div 
                key={idx} 
                className="omh-point-item"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <CheckCircle size={20} weight="fill" color="#15803d" className="omh-check-icon" />
                <span className="omh-point-text">{pt}</span>
              </div>
            ))}
          </div>

          {/* TIP / ADVICE BOX */}
          {lesson.tip && (
            <div className="omh-tip-box">
              <Lightbulb size={18} weight="fill" color="#b45309" />
              <span>{lesson.tip}</span>
            </div>
          )}

          {/* CUSTOM AUDIO PLAYER 60 SECONDS */}
          <div className="omh-player-wrapper">
            <OneMinutePlayer 
              lesson={lesson} 
              onComplete={handlePlayerCompleted} 
            />
          </div>

          {/* BOTTOM ACTION BAR (BOOKMARK & SHARE & COMPLETED STATUS) */}
          <div className="omh-hero-actions-bar">
            
            <div className="omh-left-actions">
              <button 
                className={`omh-action-btn ${isBookmarked ? 'active-bookmark' : ''}`}
                onClick={handleToggleBookmark}
                title={isBookmarked ? "Bỏ lưu bài này" : "Lưu bài này vào danh sách"}
                aria-label={isBookmarked ? "Bỏ lưu bài này" : "Lưu bài này"}
              >
                <BookmarkSimple size={20} weight={isBookmarked ? "fill" : "regular"} color={isBookmarked ? "#d97706" : "#475569"} />
                <span>{isBookmarked ? "Đã lưu bài" : "Lưu bài này"}</span>
              </button>

              <button 
                className="omh-action-btn"
                onClick={handleShare}
                title="Chia sẻ bài học tới bà con"
                aria-label="Chia sẻ bài học"
              >
                <ShareNetwork size={20} color="#475569" />
                <span>Chia sẻ</span>
              </button>
            </div>

            {/* COMPLETION INDICATOR */}
            <div className="omh-completion-status">
              {isCompleted ? (
                <span className="omh-completed-tag">
                  <CheckCircle size={16} weight="fill" color="#15803d" />
                  <span>✓ Đã hoàn thành</span>
                </span>
              ) : (
                <span className="omh-pending-tag">
                  <span>Chưa nghe bài hôm nay</span>
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
