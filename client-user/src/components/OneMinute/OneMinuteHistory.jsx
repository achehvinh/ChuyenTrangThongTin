import React, { useRef, useState, useEffect } from 'react';
import { 
  PlayCircle, 
  CaretLeft, 
  CaretRight, 
  ClockCountdown, 
  Sparkle, 
  CheckCircle 
} from '../icons';

export default function OneMinuteHistory({ lessons, currentLessonId, onSelectLesson }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [lessons]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') scrollLeft();
    if (e.key === 'ArrowRight') scrollRight();
  };

  return (
    <div className="om-history-carousel-section" tabIndex={0} onKeyDown={handleKeyDown}>
      
      {/* SECTION HEADER WITH NAV BUTTONS */}
      <div className="om-history-header">
        <div>
          <h3 className="om-history-title">
            <ClockCountdown size={24} weight="duotone" color="#1b4332" />
            <span>CÁC BÀI 1 PHÚT ĐÃ PHÁT HÀNH</span>
          </h3>
          <p className="om-history-sub">Kho lưu trữ bài học hữu ích các ngày trước dành cho bà con</p>
        </div>

        <div className="om-carousel-nav-buttons">
          <button
            className={`om-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Trượt về bài học trước"
            title="Trượt sang trái"
          >
            <CaretLeft size={20} weight="bold" />
          </button>

          <button
            className={`om-nav-btn ${!canScrollRight ? 'disabled' : ''}`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Trượt xem bài học tiếp theo"
            title="Trượt sang phải"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* CAROUSEL STRIP CONTAINER */}
      <div className="om-carousel-track" ref={scrollRef}>
        {lessons.map((item) => {
          const isCurrent = item.id === currentLessonId;

          return (
            <div
              key={item.id}
              className={`om-history-card ${isCurrent ? 'is-active-card' : ''}`}
              onClick={() => onSelectLesson(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectLesson(item)}
              aria-label={`Nghe bài học: ${item.title}`}
            >
              {/* IMAGE FRAME & OVERLAYS */}
              <div className="om-card-img-wrapper">
                <img src={item.image} alt={item.title} className="om-card-img" />
                <div className="om-card-img-overlay"></div>

                {/* BADGE CHỦ ĐỀ */}
                <div className="om-card-badge" style={{ background: item.categoryColor || '#15803d' }}>
                  <span>{item.categoryLabel || 'KIẾN THỨC'}</span>
                </div>

                {/* PLAY CIRCLE DURATION OVERLAY */}
                <div className="om-card-play-duration">
                  <PlayCircle size={22} weight="fill" color="#ffffff" />
                  <span>01:00</span>
                </div>

                {/* BADGE HÔM NAY IF TODAY */}
                {item.isToday && (
                  <div className="om-card-today-badge">
                    <Sparkle size={12} weight="fill" color="#f59e0b" />
                    <span>HÔM NAY</span>
                  </div>
                )}
              </div>

              {/* CARD BODY */}
              <div className="om-card-content">
                <h4 className="om-card-title" title={item.title}>
                  {item.title}
                </h4>

                <div className="om-card-footer">
                  <span className="om-card-date">{item.date}</span>
                  <span className="om-card-action-text">
                    {isCurrent ? "Đang mở" : "Nghe ngay →"}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
