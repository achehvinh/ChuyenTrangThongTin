import './Bando.css';
// src/pages/BanDo.jsx
export default function BanDo() {
  const locations = [
    {
      id: 1,
      name: 'UBND Xã Đăk Pxi',
      desc: 'Trụ sở Ủy ban Nhân dân xã Đăk Pxi',
      icon: '🏛️',
      color: '#005bac',
    },
    {
      id: 2,
      name: 'Trạm Y tế Xã Đăk Pxi',
      desc: 'Cơ sở y tế phục vụ bà con trong xã',
      icon: '🏥',
      color: '#16a34a',
    },
    {
      id: 3,
      name: 'Trường Tiểu học Đăk Pxi',
      desc: 'Trường tiểu học phục vụ học sinh trong xã',
      icon: '🏫',
      color: '#d97706',
    },
    {
      id: 4,
      name: 'Trường THCS Đăk Pxi',
      desc: 'Trường trung học cơ sở xã Đăk Pxi',
      icon: '🎓',
      color: '#7c3aed',
    },
  ];

  // Tọa độ UBND xã Đăk Pxi — Kon Tum
  const UBND_LAT = 14.8953;
  const UBND_LNG = 107.9245;

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15000!2d${UBND_LNG}!3d${UBND_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDUzJzQzLjEiTiAxMDfCsDU1JzI4LjIiRQ!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn`;

  return (
    <div className="bando-page">

      {/* ── Hero ── */}
      <div className="bando-hero">
        <div className="bando-hero-inner">
          <div className="bando-hero-badge">🗺️ Bản đồ</div>
          <h1>Bản đồ <span>Xã Đăk Pxi</span></h1>
          <p>Vị trí các địa điểm hành chính, y tế, giáo dục trên địa bàn xã Đăk Pxi · Tỉnh Quảng Ngãi</p>
        </div>
      </div>

      <div className="bando-content">

        {/* ── Layout 2 cột ── */}
        <div className="bando-layout">

          {/* Cột trái — danh sách địa điểm */}
          <aside className="bando-sidebar">
            <div className="bando-sidebar-header">
              <h2>📍 Địa điểm</h2>
              <span>{locations.length} địa điểm</span>
            </div>

            <div className="bando-location-list">
              {locations.map(loc => (
                <a
                  key={loc.id}
                  className="bando-location-item"
                  href={`https://www.google.com/maps/search/${encodeURIComponent(loc.name + ' Đăk Pxi - Quảng Ngãi')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="bando-loc-icon" style={{ background: loc.color + '18', color: loc.color }}>
                    {loc.icon}
                  </div>
                  <div className="bando-loc-body">
                    <h3>{loc.name}</h3>
                    <p>{loc.desc}</p>
                  </div>
                  <span className="bando-loc-arrow">↗</span>
                </a>
              ))}
            </div>

            {/* Nút mở GG Maps */}
            <a
              className="bando-open-btn"
              href={`https://www.google.com/maps/search/UBND+xã+Đăk+Pxi+Kon+Tum`}
              target="_blank"
              rel="noreferrer"
            >
              🗺️ Mở Google Maps
            </a>
          </aside>

          {/* Cột phải — Google Maps embed */}
          <div className="bando-map-wrap">
            <iframe
              className="bando-map-iframe"
              src={mapSrc}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ xã Đăk Pxi"
            />
          </div>

        </div>

        {/* ── Thông tin liên hệ nhanh ── */}
        <div className="bando-contact-bar">
          <div className="bando-contact-item">
            <span>📍</span>
            <div>
              <strong>Địa chỉ</strong>
              <p>Thôn Pa Cheng, Xã Đăk Pxi, Tỉnh Quảng Ngãi</p>
            </div>
          </div>
          <div className="bando-contact-item">
            <span>📞</span>
            <div>
              <strong>Điện thoại</strong>
              <p>(0260) 123 4567</p>
            </div>
          </div>
          <div className="bando-contact-item">
            <span>🕐</span>
            <div>
              <strong>Giờ làm việc</strong>
              <p>Thứ 2 – Thứ 6: 7:30 – 11:30 và 13:30 – 17:00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}