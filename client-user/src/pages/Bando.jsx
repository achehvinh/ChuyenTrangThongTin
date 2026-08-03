import { useState } from 'react';
import './Bando.css';

const LOCATIONS = [
  {
    id: 1,
    name: 'HĐND xã Đăk Pxi',
    desc: 'Cơ quan đại diện cho ý chí và nguyện vọng của nhân dân xã Đăk Pxi',
    category: 'Hành chính',
    icon: '🏛️',
    color: '#005bac',
    lat: 14.8955,
    lng: 107.9247,
    searchQuery: 'Hội đồng nhân dân xã Đăk Pxi, Kon Tum',
  },
  {
    id: 2,
    name: 'Văn phòng HĐND - UBND Xã Đăk Pxi',
    desc: 'Trụ sở quản lý, điều hành và tiếp công dân xã Đăk Pxi',
    category: 'Hành chính',
    icon: '🏢',
    color: '#0284c7',
    lat: 14.8953,
    lng: 107.9245,
    searchQuery: 'UBND xã Đăk Pxi, Đăk Hà, Kon Tum',
  },
  {
    id: 3,
    name: 'Phòng Kinh tế Xã Đăk Pxi',
    desc: 'Tham mưu quản lý phát triển kinh tế, nông lâm nghiệp và tài chính xã',
    category: 'Hành chính',
    icon: '📊',
    color: '#d97706',
    lat: 14.8951,
    lng: 107.9243,
    searchQuery: 'Bộ phận Kinh tế UBND xã Đăk Pxi, Kon Tum',
  },
  {
    id: 4,
    name: 'Phòng Văn hóa - Xã hội Xã Đăk Pxi',
    desc: 'Quản lý văn hóa, xã hội, thông tin tuyên truyền và các chính sách an sinh',
    category: 'Hành chính',
    icon: '📜',
    color: '#c026d3',
    lat: 14.8954,
    lng: 107.9246,
    searchQuery: 'Phòng Văn hóa Xã hội xã Đăk Pxi, Kon Tum',
  },
  {
    id: 5,
    name: 'Trung tâm Phục vụ hành chính công xã Đăk Pxi',
    desc: 'Bộ phận Một cửa tiếp nhận và trả kết quả thủ tục hành chính',
    category: 'Dịch vụ công',
    icon: '📋',
    color: '#2563eb',
    lat: 14.8952,
    lng: 107.9244,
    searchQuery: 'Bộ phận Một cửa UBND xã Đăk Pxi, Kon Tum',
  },
  {
    id: 6,
    name: 'Trạm Y tế xã Đăk Pxi',
    desc: 'Cơ sở y tế chăm sóc sức khỏe ban đầu và sơ cấp cứu phục vụ nhân dân',
    category: 'Y tế',
    icon: '🏥',
    color: '#16a34a',
    lat: 14.8935,
    lng: 107.9220,
    searchQuery: 'Trạm y tế xã Đăk Pxi, Đăk Hà, Kon Tum',
  },
  {
    id: 7,
    name: 'Trung tâm cung ứng Dịch vụ công ích xã Đăk Pxi',
    desc: 'Đơn vị cung cấp dịch vụ hạ tầng, môi trường và công ích xã',
    category: 'Dịch vụ công',
    icon: '🛠️',
    color: '#475569',
    lat: 14.8948,
    lng: 107.9240,
    searchQuery: 'Trung tâm dịch vụ công ích xã Đăk Pxi, Kon Tum',
  },
  {
    id: 8,
    name: 'Trường Mầm Non Hoa Hướng Dương',
    desc: 'Cơ sở mầm non chăm sóc và giáo dục mầm non chất lượng cho các bé',
    category: 'Giáo dục',
    icon: '🌻',
    color: '#eab308',
    lat: 14.8968,
    lng: 107.9262,
    searchQuery: 'Trường Mầm non Hoa Hướng Dương, Đăk Pxi, Kon Tum',
  },
  {
    id: 9,
    name: 'Trường Mầm Non Sao Mai',
    desc: 'Trường mầm non uy tín chăm sóc các cháu thiếu nhi xã Đăk Pxi',
    category: 'Giáo dục',
    icon: '⭐',
    color: '#ea580c',
    lat: 14.8920,
    lng: 107.9205,
    searchQuery: 'Trường Mầm non Sao Mai, Đăk Pxi, Kon Tum',
  },
  {
    id: 10,
    name: 'Trường Tiểu Học Xã Đăk Pxi',
    desc: 'Cơ sở giáo dục tiểu học phục vụ học sinh tiểu học trên địa bàn xã',
    category: 'Giáo dục',
    icon: '🏫',
    color: '#0284c7',
    lat: 14.8972,
    lng: 107.9275,
    searchQuery: 'Trường Tiểu học Đăk Pxi, Đăk Hà, Kon Tum',
  },
  {
    id: 11,
    name: 'Trường TH - THCS Nguyễn Tất Thành',
    desc: 'Trường liên cấp Tiểu học & THCS Nguyễn Tất Thành xã Đăk Pxi',
    category: 'Giáo dục',
    icon: '📚',
    color: '#7c3aed',
    lat: 14.8985,
    lng: 107.9290,
    searchQuery: 'Trường TH và THCS Nguyễn Tất Thành, Đăk Pxi, Kon Tum',
  },
  {
    id: 12,
    name: 'Trường THCS Xã Đăk Pxi',
    desc: 'Trường trung học cơ sở xã Đăk Pxi đào tạo học sinh THCS',
    category: 'Giáo dục',
    icon: '🎓',
    color: '#4f46e5',
    lat: 14.8980,
    lng: 107.9282,
    searchQuery: 'Trường THCS Đăk Pxi, Đăk Hà, Kon Tum',
  },
];

export default function BanDo() {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[1]); // Mặc định Văn phòng HĐND - UBND xã Đăk Pxi
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // URL Google Map embed chính xác theo địa danh & chế độ bản đồ đường xá (Roadmap mode t=m)
  const getMapEmbedUrl = (loc) => {
    if (loc.embedUrl) return loc.embedUrl;
    const query = encodeURIComponent(`${loc.name}, Đăk Pxi, Đăk Hà, Kon Tum`);
    return `https://maps.google.com/maps?q=${query}&t=m&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="bando-page">
      {/* ── Hero Header ── */}
      <div className="bando-hero">
        <div className="bando-hero-inner">
          <div className="bando-hero-badge">🗺️ Bản đồ Địa chính</div>
          <h1>Bản đồ <span>Xã Đăk Pxi</span></h1>
          <p>Vị trí các cơ quan hành chính, y tế, giáo dục & trung tâm dịch vụ công ích xã Đăk Pxi</p>
        </div>
      </div>

      <div className="bando-content">
        {/* ── Layout 2 cột ── */}
        <div className="bando-layout">
          {/* Cột trái — Danh sách địa điểm */}
          <aside className="bando-sidebar">
            <div className="bando-sidebar-header">
              <div>
                <h2>📍 Danh sách địa điểm</h2>
                <span className="bando-count-badge">{filteredLocations.length} / {LOCATIONS.length} địa điểm</span>
              </div>
            </div>

            {/* Thanh tìm kiếm nhanh địa điểm */}
            <div className="bando-search-box">
              <input
                type="text"
                placeholder="🔍 Tìm nhanh địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bando-search-input"
              />
            </div>

            {/* Danh sách địa điểm */}
            <div className="bando-location-list">
              {filteredLocations.map((loc) => {
                const isActive = selectedLoc.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    className={`bando-location-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedLoc(loc)}
                  >
                    <div
                      className="bando-loc-icon"
                      style={{ background: loc.color + '18', color: loc.color }}
                    >
                      {loc.icon}
                    </div>
                    <div className="bando-loc-body">
                      <h3>{loc.name}</h3>
                      <p>{loc.desc}</p>
                    </div>
                    <span className="bando-loc-arrow">
                      {isActive ? '📍' : '↗'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Nút mở chỉ đường Google Maps ngoài */}
            <a
              className="bando-open-btn"
              href={`https://www.google.com/maps/search/${encodeURIComponent(selectedLoc.searchQuery)}`}
              target="_blank"
              rel="noreferrer"
            >
              🗺️ Mở trong Google Maps ↗
            </a>
          </aside>

          {/* Cột phải — Bản đồ Google Maps Embed */}
          <div className="bando-map-container">
            <div className="bando-map-topbar">
              <div className="map-active-title">
                <span className="map-active-dot" style={{ background: selectedLoc.color }}></span>
                <strong>Đang xem địa điểm:</strong>
                <span className="map-active-name">{selectedLoc.name}</span>
              </div>
              <a
                className="map-direct-btn"
                href={`https://www.google.com/maps/search/${encodeURIComponent(selectedLoc.searchQuery)}`}
                target="_blank"
                rel="noreferrer"
              >
                Chỉ đường Google Maps ↗
              </a>
            </div>

            <div className="bando-map-wrap">
              <iframe
                key={selectedLoc.id}
                className="bando-map-iframe"
                src={getMapEmbedUrl(selectedLoc)}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={selectedLoc.name}
              />
            </div>
          </div>
        </div>

        {/* ── Thông tin liên hệ nhanh ── */}
        <div className="bando-contact-bar">
          <div className="bando-contact-item">
            <span>📍</span>
            <div>
              <strong>Địa chỉ UBND xã</strong>
              <p>Thôn Pa Cheng, Xã Đăk Pxi, Tỉnh Quảng Ngãi</p>
            </div>
          </div>
          <div className="bando-contact-item">
            <span>📞</span>
            <div>
              <strong>Điện thoại liên hệ</strong>
              <p>0339.310.915 - (0260) 123 4567</p>
            </div>
          </div>
          <div className="bando-contact-item">
            <span>🕐</span>
            <div>
              <strong>Giờ làm việc Bộ phận Một cửa</strong>
              <p>Thứ 2 – Thứ 6: 7:30 – 11:30 và 13:30 – 17:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}