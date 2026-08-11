import { useState } from 'react';
import {
  MapPin,
  Search,
  ChevronRight,
  Map,
  ExternalLink,
  Navigation,
  Star,
  Building2,
  Building,
  Layers,
  Sparkles,
  HeartPulse,
  School,
  BookOpen,
  GraduationCap,
  Phone,
  Clock,
  Info
} from 'lucide-react';
import './Bando.css';

const LOCATIONS = [
  {
    id: 1,
    name: 'HĐND xã Đăk Pxi',
    desc: 'Cơ quan đại diện cho ý chí và nguyện vọng của nhân dân xã Đăk Pxi',
    category: 'Hành chính',
    iconType: 'building2',
    color: '#005bac',
    bg: '#dbeafe',
    rating: '4.2 ★★★★☆ (18)',
    address: 'Long, Đăk, Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Hội đồng nhân dân xã Đăk Pxi, Kon Tum',
  },
  {
    id: 2,
    name: 'Văn phòng HĐND - UBND Xã Đăk Pxi',
    desc: 'Trụ sở quản lý, điều hành và tiếp công dân xã Đăk Pxi',
    category: 'Hành chính',
    iconType: 'building',
    color: '#0284c7',
    bg: '#e0f2fe',
    rating: '3.9 ★★★★☆ (37)',
    address: 'Long, Đăk, Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'UBND xã Đăk Pxi, Đăk Hà, Kon Tum',
  },
  {
    id: 3,
    name: 'Phòng Kinh tế Xã Đăk Pxi',
    desc: 'Tham mưu quản lý phát triển kinh tế, nông lâm nghiệp và tài chính xã',
    category: 'Hành chính',
    iconType: 'layers',
    color: '#d97706',
    bg: '#fef3c7',
    rating: '4.0 ★★★★☆ (12)',
    address: 'Long, Đăk, Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Bộ phận Kinh tế UBND xã Đăk Pxi, Kon Tum',
  },
  {
    id: 4,
    name: 'Phòng Văn hóa - Xã hội Xã Đăk Pxi',
    desc: 'Quản lý văn hóa, xã hội, thông tin tuyên truyền và các chính sách an sinh',
    category: 'Hành chính',
    iconType: 'sparkles',
    color: '#c026d3',
    bg: '#f3e8ff',
    rating: '4.5 ★★★★★ (24)',
    address: 'Long, Đăk, Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Phòng Văn hóa Xã hội xã Đăk Pxi, Kon Tum',
  },
  {
    id: 5,
    name: 'Trung tâm Phục vụ hành chính công xã Đăk Pxi',
    desc: 'Bộ phận Một cửa tiếp nhận và trả kết quả thủ tục hành chính',
    category: 'Dịch vụ công',
    iconType: 'building2',
    color: '#2563eb',
    bg: '#dbeafe',
    rating: '4.4 ★★★★☆ (45)',
    address: 'Long, Đăk, Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Bộ phận Một cửa UBND xã Đăk Pxi, Kon Tum',
  },
  {
    id: 6,
    name: 'Trạm Y tế xã Đăk Pxi',
    desc: 'Cơ sở y tế chăm sóc sức khỏe ban đầu và sơ cấp cứu phục vụ nhân dân',
    category: 'Y tế',
    iconType: 'heart',
    color: '#e11d48',
    bg: '#ffe4e6',
    rating: '4.6 ★★★★★ (52)',
    address: 'Thôn Pa Cheng, Xã Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trạm y tế xã Đăk Pxi, Đăk Hà, Kon Tum',
  },
  {
    id: 7,
    name: 'Trung tâm cung ứng Dịch vụ công ích xã Đăk Pxi',
    desc: 'Đơn vị cung cấp dịch vụ hạ tầng, môi trường và công ích xã',
    category: 'Dịch vụ công',
    iconType: 'building',
    color: '#475569',
    bg: '#f1f5f9',
    rating: '4.1 ★★★★☆ (15)',
    address: 'Long, Đăk, Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trung tâm dịch vụ công ích xã Đăk Pxi, Kon Tum',
  },
  {
    id: 8,
    name: 'Trường Mầm Non Hoa Hướng Dương',
    desc: 'Cơ sở mầm non chăm sóc và giáo dục mầm non chất lượng cho các bé',
    category: 'Giáo dục',
    iconType: 'sparkles',
    color: '#d97706',
    bg: '#fef3c7',
    rating: '4.8 ★★★★★ (29)',
    address: 'Thôn 2, Xã Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trường Mầm non Hoa Hướng Dương, Đăk Pxi, Kon Tum',
  },
  {
    id: 9,
    name: 'Trường Mầm Non Sao Mai',
    desc: 'Trường mầm non uy tín chăm sóc các cháu thiếu nhi xã Đăk Pxi',
    category: 'Giáo dục',
    iconType: 'star',
    color: '#0284c7',
    bg: '#e0f2fe',
    rating: '4.7 ★★★★★ (31)',
    address: 'Thôn Pa Cheng, Xã Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trường Mầm non Sao Mai, Đăk Pxi, Kon Tum',
  },
  {
    id: 10,
    name: 'Trường Tiểu Học Xã Đăk Pxi',
    desc: 'Cơ sở giáo dục tiểu học phục vụ học sinh tiểu học trên địa bàn xã',
    category: 'Giáo dục',
    iconType: 'school',
    color: '#16a34a',
    bg: '#dcfce7',
    rating: '4.5 ★★★★★ (40)',
    address: 'Thôn Pa Cheng, Xã Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trường Tiểu học Đăk Pxi, Đăk Hà, Kon Tum',
  },
  {
    id: 11,
    name: 'Trường TH - THCS Nguyễn Tất Thành',
    desc: 'Trường liên cấp Tiểu học & THCS Nguyễn Tất Thành xã Đăk Pxi',
    category: 'Giáo dục',
    iconType: 'book',
    color: '#7c3aed',
    bg: '#f3e8ff',
    rating: '4.6 ★★★★★ (58)',
    address: 'Thôn 3, Xã Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trường TH và THCS Nguyễn Tất Thành, Đăk Pxi, Kon Tum',
  },
  {
    id: 12,
    name: 'Trường THCS Xã Đăk Pxi',
    desc: 'Trường trung học cơ sở xã Đăk Pxi đào tạo học sinh THCS',
    category: 'Giáo dục',
    iconType: 'cap',
    color: '#4f46e5',
    bg: '#e0e7ff',
    rating: '4.4 ★★★★☆ (33)',
    address: 'Thôn Pa Cheng, Xã Đăk Pxi, Kon Tum, Việt Nam',
    searchQuery: 'Trường THCS Đăk Pxi, Đăk Hà, Kon Tum',
  },
];

const renderLocIcon = (type, color) => {
  switch (type) {
    case 'building2':
      return <Building2 size={20} color={color} />;
    case 'building':
      return <Building size={20} color={color} />;
    case 'layers':
      return <Layers size={20} color={color} />;
    case 'sparkles':
      return <Sparkles size={20} color={color} />;
    case 'heart':
      return <HeartPulse size={20} color={color} />;
    case 'star':
      return <Star size={20} color={color} fill={color} />;
    case 'school':
      return <School size={20} color={color} />;
    case 'book':
      return <BookOpen size={20} color={color} />;
    case 'cap':
      return <GraduationCap size={20} color={color} />;
    default:
      return <Building size={20} color={color} />;
  }
};

export default function BanDo() {
  const [selectedLoc, setSelectedLoc] = useState(LOCATIONS[1]); // Mặc định Văn phòng HĐND - UBND xã Đăk Pxi
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMapEmbedUrl = (loc) => {
    if (loc.embedUrl) return loc.embedUrl;
    const query = encodeURIComponent(`${loc.name}, Đăk Pxi, Đăk Hà, Kon Tum`);
    return `https://maps.google.com/maps?q=${query}&t=m&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  const directMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(selectedLoc.searchQuery)}`;

  return (
    <div className="bando-page">
      {/* ── Hero Header ── */}
      <div className="bando-hero">
        <div className="bando-hero-inner">
          <div className="bando-hero-badge">
            <MapPin size={15} color="#fbbf24" /> Bản đồ Địa chính Trực tuyến
          </div>
          <h1>
            Bản đồ Hành chính & Cảnh quan <span>Xã Đăk Pxi</span>
          </h1>
          <p>
            Tra cứu vị trí chính xác các cơ quan hành chính, trụ sở làm việc, trường học, trạm y tế và trung tâm dịch vụ công ích trên địa bàn xã
          </p>
        </div>
      </div>

      <div className="bando-content">
        {/* ── Wide Grid Layout (2 columns) ── */}
        <div className="bando-layout">
          
          {/* Cột trái — Danh sách địa điểm */}
          <aside className="bando-sidebar">
            <div className="bando-sidebar-header">
              <div className="bando-sidebar-title-group">
                <div className="bando-sidebar-pin-box">
                  <MapPin size={20} color="#e11d48" />
                </div>
                <div>
                  <h2>Danh sách địa điểm</h2>
                  <div className="bando-count-badge">
                    {filteredLocations.length} / {LOCATIONS.length} địa điểm
                  </div>
                </div>
              </div>
            </div>

            {/* Thanh tìm kiếm nhanh địa điểm */}
            <div className="bando-search-box">
              <div className="bando-search-wrapper">
                <Search size={17} className="bando-search-icon" />
                <input
                  type="text"
                  placeholder="Tìm nhanh địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bando-search-input"
                />
                {searchTerm && (
                  <button className="bando-search-clear" onClick={() => setSearchTerm('')}>
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Danh sách địa điểm */}
            <div className="bando-location-list">
              {filteredLocations.length === 0 ? (
                <div className="bando-empty-state">
                  <Info size={24} color="#94a3b8" />
                  <p>Không tìm thấy địa điểm phù hợp</p>
                </div>
              ) : (
                filteredLocations.map((loc) => {
                  const isActive = selectedLoc.id === loc.id;
                  return (
                    <div
                      key={loc.id}
                      className={`bando-location-item ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedLoc(loc)}
                    >
                      <div
                        className="bando-loc-icon"
                        style={{ background: loc.bg, color: loc.color }}
                      >
                        {renderLocIcon(loc.iconType, loc.color)}
                      </div>
                      <div className="bando-loc-body">
                        <h3>{loc.name}</h3>
                        <p>{loc.desc}</p>
                      </div>
                      <div className="bando-loc-arrow">
                        <ChevronRight size={16} color={isActive ? '#2563eb' : '#94a3b8'} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Nút mở chỉ đường Google Maps ngoài */}
            <a
              className="bando-open-btn"
              href={directMapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Map size={18} />
              <span>Mở trong Google Maps</span>
              <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
            </a>
          </aside>

          {/* Cột phải — Bản đồ Google Maps Embed */}
          <div className="bando-map-container">
            
            {/* Topbar hiển thị địa điểm đang chọn */}
            <div className="bando-map-topbar">
              <div className="map-active-title">
                <span className="map-active-dot" style={{ background: selectedLoc.color }}></span>
                <span className="map-active-label">Đang xem địa điểm:</span>
                <strong className="map-active-name">{selectedLoc.name}</strong>
              </div>

              <a
                className="map-direct-btn"
                href={directMapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={14} />
                <span>Chỉ đường Google Maps ↗</span>
              </a>
            </div>

            {/* Khung bản đồ kèm Floating Info Card overlay */}
            <div className="bando-map-wrap">
              
              {/* Overlay card nằm góc trên trái bản đồ giống screenshot reference */}
              <div className="bando-floating-card">
                <div className="bfc-header">
                  <div>
                    <h4 className="bfc-title">{selectedLoc.name}</h4>
                    <p className="bfc-address">{selectedLoc.address}</p>
                  </div>
                  <div className="bfc-action-btns">
                    <a href={directMapUrl} target="_blank" rel="noreferrer" className="bfc-btn" title="Mở trang mới">
                      <ExternalLink size={14} color="#2563eb" />
                    </a>
                    <a href={directMapUrl} target="_blank" rel="noreferrer" className="bfc-btn bfc-btn-primary" title="Chỉ đường">
                      <Navigation size={14} color="#ffffff" />
                    </a>
                  </div>
                </div>

                <div className="bfc-rating">
                  <span className="bfc-score">{selectedLoc.rating}</span>
                </div>
              </div>

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
            <div className="bci-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
              <MapPin size={22} />
            </div>
            <div>
              <strong>Địa chỉ UBND xã</strong>
              <p>Thôn Pa Cheng, Xã Đăk Pxi, Tỉnh Kon Tum</p>
            </div>
          </div>

          <div className="bando-contact-item">
            <div className="bci-icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Phone size={22} />
            </div>
            <div>
              <strong>Điện thoại liên hệ</strong>
              <p>0339.310.915 — (0260) 385 1234</p>
            </div>
          </div>

          <div className="bando-contact-item">
            <div className="bci-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <Clock size={22} />
            </div>
            <div>
              <strong>Giờ làm việc Bộ phận Một cửa</strong>
              <p>Thứ 2 – Thứ 6: 07:30 – 11:30 & 13:30 – 17:00</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}