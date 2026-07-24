import { useState } from 'react';
import { EVENTS } from '../data';
import './LichHopPage.css';

const TYPE_LABELS = {
  'hop-dan': { label: 'Họp dân', color: '#005bac', bg: '#e8f0fe' },
  'tiem-chung': { label: 'Tiêm chủng', color: '#16a34a', bg: '#dcfce7' },
  'phat-ho-tro': { label: 'Phát hỗ trợ', color: '#d97706', bg: '#fef3c7' },
  'tap-huan': { label: 'Tập huấn', color: '#7c3aed', bg: '#ede9fe' },
  'khac': { label: 'Khác', color: '#64748b', bg: '#f1f5f9' },
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
    <div className="lich-hop-page">
      <div className="lich-hop-header">
        <h1>📅 Lịch họp & Sự kiện thôn</h1>
        <p>Lịch sinh hoạt cộng đồng xã Đăk Pxi</p>
      </div>

      {/* Bộ lọc */}
      <div className="lich-filters">
        <div className="filter-group">
          <label>Thôn:</label>
          <div className="filter-btns">
            {THON_LIST.map(t => (
              <button
                key={t}
                className={`filter-btn ${filterThon === t ? 'active' : ''}`}
                onClick={() => setFilterThon(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Loại:</label>
          <div className="filter-btns">
            <button
              className={`filter-btn ${filterType === 'Tất cả' ? 'active' : ''}`}
              onClick={() => setFilterType('Tất cả')}
            >Tất cả</button>
            {Object.entries(TYPE_LABELS).map(([key, val]) => (
              <button
                key={key}
                className={`filter-btn ${filterType === key ? 'active' : ''}`}
                onClick={() => setFilterType(key)}
                style={filterType === key ? { background: val.color, color: 'white' } : {}}
              >{val.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Sắp diễn ra */}
      <div className="lich-section">
        <h2>🔔 Sắp diễn ra ({upcoming.length})</h2>
        {upcoming.length === 0 ? (
          <p className="empty-msg">Không có sự kiện nào sắp tới</p>
        ) : (
          <div className="event-grid">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>

      {/* Đã qua */}
      {past.length > 0 && (
        <div className="lich-section past">
          <h2>✅ Đã diễn ra ({past.length})</h2>
          <div className="event-grid">
            {past.map(e => <EventCard key={e.id} event={e} isPast />)}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, isPast }) {
  const type = TYPE_LABELS[event.type] || TYPE_LABELS['khac'];
  const dateObj = new Date(event.date);
  const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

  return (
    <div className={`event-card ${isPast ? 'past' : ''}`}>
      <div className="event-date-box">
        <span className="event-day">{dateObj.getDate()}</span>
        <span className="event-month">Tháng {dateObj.getMonth() + 1}</span>
        <span className="event-weekday">{dayName}</span>
      </div>
      <div className="event-info">
        <span
          className="event-type-badge"
          style={{ background: type.bg, color: type.color }}
        >{type.label}</span>
        <h3>{event.title}</h3>
        <p>⏰ {event.time} | 📍 {event.location}</p>
        <p>🏘️ Thôn: {event.thon}</p>
        {event.note && <p className="event-note">📝 {event.note}</p>}
      </div>
    </div>
  );
}