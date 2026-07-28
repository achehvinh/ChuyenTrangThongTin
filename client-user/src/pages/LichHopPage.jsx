import { useState } from 'react';
import { EVENTS } from '../data';
import './LichHopPage.css';

const TYPE_LABELS = {
  'hop-dan': { label: 'Họp dân', color: '#0284c7', bg: '#e0f2fe' },
  'tiem-chung': { label: 'Tiêm chủng', color: '#16a34a', bg: '#dcfce7' },
  'phat-ho-tro': { label: 'Phát hỗ trợ', color: '#d97706', bg: '#fef3c7' },
  'tap-huan': { label: 'Tập huấn', color: '#7c3aed', bg: '#ede9fe' },
  'khac': { label: 'Khác', color: '#475569', bg: '#f1f5f9' },
};

const THON_LIST = ['Tất cả', 'Đăk Xế Kơ Ne', 'Đăk Pxi', 'Đăk Kơ Đương', 'Đăk Rơ Wang'];

export default function LichHopPage() {
  const [filterThon, setFilterThon] = useState('Tất cả');
  const [filterType, setFilterType] = useState('Tất cả');

  const today = new Date().toISOString().split('T')[0];

  const filtered = EVENTS
    .filter(e => filterThon === 'Tất cả' || e.thon === filterThon)
    .filter(e => filterType === 'Tất cả' || e.type === filterType)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcoming = filtered.filter(e => e.date >= today);
  const past = filtered.filter(e => e.date < today);

  return (
    <main className="lich-hop-page">
      {/* ── HEADER BANNER ── */}
      <header className="lich-hop-header">
        <div className="lich-header-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>LỊCH SINH HOẠT CỘNG ĐỒNG</span>
        </div>
        <h1>Lịch họp & Sự kiện Thôn Xã</h1>
        <p>Theo dõi lịch sinh hoạt, họp dân và các chương trình hỗ trợ cộng đồng tại xã Đăk Pxi</p>
      </header>

      {/* ── BỘ LỌC TÌM KIẾM CHUẨN HTML5 ── */}
      <section className="lich-filters" aria-label="Bộ lọc sự kiện">
        <div className="filter-group">
          <label className="filter-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Địa bàn Thôn:</span>
          </label>
          <div className="filter-btns">
            {THON_LIST.map(t => (
              <button
                key={t}
                type="button"
                className={`filter-btn ${filterThon === t ? 'active' : ''}`}
                onClick={() => setFilterThon(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <span>Loại sự kiện:</span>
          </label>
          <div className="filter-btns">
            <button
              type="button"
              className={`filter-btn ${filterType === 'Tất cả' ? 'active' : ''}`}
              onClick={() => setFilterType('Tất cả')}
            >
              Tất cả
            </button>
            {Object.entries(TYPE_LABELS).map(([key, val]) => (
              <button
                key={key}
                type="button"
                className={`filter-btn ${filterType === key ? 'active' : ''}`}
                onClick={() => setFilterType(key)}
                style={filterType === key ? { background: val.color, color: '#ffffff', borderColor: val.color } : {}}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SỰ KIỆN SẮP DIỄN RA ── */}
      <section className="lich-section">
        <div className="section-title-row">
          <h2>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span>Sự kiện sắp diễn ra ({upcoming.length})</span>
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <div className="empty-msg-box">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <line x1="9" y1="16" x2="15" y2="16"/>
            </svg>
            <p>Không có sự kiện hoặc cuộc họp nào phù hợp với bộ lọc</p>
          </div>
        ) : (
          <div className="event-grid">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* ── SỰ KIỆN ĐÃ QUA ── */}
      {past.length > 0 && (
        <section className="lich-section past">
          <div className="section-title-row">
            <h2>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Sự kiện đã diễn ra ({past.length})</span>
            </h2>
          </div>
          <div className="event-grid">
            {past.map(e => <EventCard key={e.id} event={e} isPast />)}
          </div>
        </section>
      )}
    </main>
  );
}

function EventCard({ event, isPast }) {
  const type = TYPE_LABELS[event.type] || TYPE_LABELS['khac'];
  const dateObj = new Date(event.date);
  const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

  return (
    <article className={`event-card ${isPast ? 'past' : ''}`}>
      <time dateTime={event.date} className="event-date-box">
        <span className="event-day">{dateObj.getDate()}</span>
        <span className="event-month">Tháng {dateObj.getMonth() + 1}</span>
        <span className="event-weekday">{dayName}</span>
      </time>

      <div className="event-info">
        <div className="event-meta-top">
          <span className="event-type-badge" style={{ background: type.bg, color: type.color, borderColor: type.color }}>
            {type.label}
          </span>
          <span className="event-thon-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Thôn {event.thon}
          </span>
        </div>

        <h3 className="event-title">{event.title}</h3>

        <div className="event-details-row">
          <div className="detail-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{event.time}</span>
          </div>

          <address className="detail-item location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{event.location}</span>
          </address>
        </div>

        {event.note && (
          <div className="event-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span>Ghi chú: {event.note}</span>
          </div>
        )}
      </div>
    </article>
  );
}