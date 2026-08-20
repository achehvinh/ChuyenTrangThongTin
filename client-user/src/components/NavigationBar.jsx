import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Info, Settings, MapPin, Newspaper,
  BookOpen, Phone, ChevronDown, Search, User, Sliders
} from 'lucide-react';
import { useFontSize } from '../FontSizeContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  const [showIntroMenu, setShowIntroMenu] = useState(false);

  const fontSizeData = useFontSize ? useFontSize() : null;
  const increaseFont = fontSizeData?.increase || (() => { });
  const decreaseFont = fontSizeData?.decrease || (() => { });
  const sizeIndex = fontSizeData?.sizeIndex ?? 1;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tra-cuu?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="site-header-redesign">

      {/* ════════════════════════════════════════════════════════════════
         TOP BANNER HEADER WITH SCENIC MOUNTAIN & COMMUNAL HOUSE BG
         ════════════════════════════════════════════════════════════════ */}
      <div className="header-banner-top">
        <div className="header-banner-overlay" />
        <div className="header-banner-content">

          {/* BRANDING: TITLE ONLY (SINGLE LINE) */}
          <Link to="/" className="header-brand-box">
            <div className="brand-text-group">
              <h1 className="brand-main-title">CHUYÊN TRANG VĂN HÓA - XÃ HỘI XÃ ĐĂK PXI</h1>
            </div>
          </Link>

          {/* TOP RIGHT CONTROLS: SEARCH + FONT SIZE + FLAG + ACCOUNT */}
          <div className="header-top-controls">

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="header-search-form">
              <input
                type="text"
                placeholder="Tìm kiếm thông tin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="header-search-input"
              />
              <button type="submit" className="header-search-btn" title="Tìm kiếm">
                <Search size={16} color="#ffffff" />
              </button>
            </form>

            {/* FONT SIZE SELECTOR PILL */}
            <div className="font-size-pill">
              <button
                type="button"
                className={`font-size-btn ${sizeIndex === 0 ? 'active' : ''}`}
                onClick={decreaseFont}
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <button
                type="button"
                className={`font-size-btn ${sizeIndex === 1 ? 'active' : ''}`}
                title="Cỡ chữ mặc định"
              >
                A
              </button>
              <button
                type="button"
                className={`font-size-btn ${sizeIndex > 1 ? 'active' : ''}`}
                onClick={increaseFont}
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* VIETNAM FLAG CIRCLE BUTTON */}
            <button type="button" className="header-circle-icon-btn flag-btn" title="Tiếng Việt">
              <span className="vn-flag-circle">
                <svg viewBox="0 0 30 30" width="22" height="22">
                  <circle cx="15" cy="15" r="14" fill="#DA251D" />
                  <polygon points="15,6 17.6,12.5 24.5,12.8 19.1,17 21,23.5 15,19.3 9,23.5 10.9,17 5.5,12.8 12.4,12.5" fill="#FFFF00" />
                </svg>
              </span>
            </button>

            {/* USER ACCOUNT CIRCLE BUTTON */}
            <button
              type="button"
              className="header-circle-icon-btn user-btn"
              onClick={() => navigate('/dang-nhap')}
              title="Đăng nhập Cán bộ / Công dân"
            >
              <User size={18} color="#4a3423" />
            </button>

          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
         MAIN NAVIGATION BAR WITH ETHNIC BROCADE BORDER & RIBBON TABS
         ════════════════════════════════════════════════════════════════ */}
      <nav className="header-nav-bar">

        {/* BROCADE PATTERN BORDER TOP */}
        <div className="brocade-border-strip top" />

        <div className="nav-container">
          <ul className="nav-menu-list">

            {/* TRANG CHỦ (RIBBON TAB HIGHLIGHT) */}
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link nav-link--home ${isActive('/') ? 'active-home-ribbon' : ''}`}
              >
                <Home size={18} className="nav-icon" />
                <span>TRANG CHỦ</span>
              </Link>
            </li>

            {/* GIỚI THIỆU */}
            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setShowIntroMenu(true)}
              onMouseLeave={() => setShowIntroMenu(false)}
            >
              <Link to="/co-cau-to-chuc" className={`nav-link ${isActive('/co-cau-to-chuc') ? 'active' : ''}`}>
                <Info size={17} className="nav-icon" />
                <span>GIỚI THIỆU</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </Link>
              {showIntroMenu && (
                <ul className="nav-dropdown-menu">
                  <li><Link to="/co-cau-to-chuc">Cơ cấu tổ chức</Link></li>
                  <li><Link to="/thong-tin">Tổng quan xã Đăk Pxi</Link></li>
                </ul>
              )}
            </li>

            {/* CHUYỂN ĐỔI SỐ */}
            <li className="nav-item">
              <Link to="/chuyen-doi-so" className={`nav-link ${isActive('/chuyen-doi-so') ? 'active' : ''}`}>
                <Settings size={17} className="nav-icon" />
                <span>CHUYỂN ĐỔI SỐ</span>
              </Link>
            </li>

            {/* BẢN ĐỒ */}
            <li className="nav-item">
              <Link to="/Ban-do" className={`nav-link ${isActive('/Ban-do') ? 'active' : ''}`}>
                <MapPin size={17} className="nav-icon" />
                <span>BẢN ĐỒ</span>
              </Link>
            </li>

            {/* TIN TỨC - SỰ KIỆN */}
            <li className="nav-item">
              <Link to="/tin-tuc" className={`nav-link ${isActive('/tin-tuc') ? 'active' : ''}`}>
                <Newspaper size={17} className="nav-icon" />
                <span>TIN TỨC – SỰ KIỆN</span>
              </Link>
            </li>

            {/* THƯ VIỆN */}
            <li className="nav-item">
              <Link to="/thu-vien-anh" className={`nav-link ${isActive('/thu-vien-anh') ? 'active' : ''}`}>
                <BookOpen size={17} className="nav-icon" />
                <span>THƯ VIỆN</span>
              </Link>
            </li>

            {/* LIÊN HỆ */}
            <li className="nav-item">
              <Link to="/lien-he" className={`nav-link ${isActive('/lien-he') ? 'active' : ''}`}>
                <Phone size={17} className="nav-icon" />
                <span>LIÊN HỆ</span>
              </Link>
            </li>

            {/* KHÁC */}
            <li
              className="nav-item has-dropdown"
              onMouseEnter={() => setShowOtherMenu(true)}
              onMouseLeave={() => setShowOtherMenu(false)}
            >
              <button type="button" className="nav-link dropdown-toggle">
                <Sliders size={17} className="nav-icon" />
                <span>KHÁC</span>
                <ChevronDown size={14} className="dropdown-caret" />
              </button>
              {showOtherMenu && (
                <ul className="nav-dropdown-menu right-aligned">
                  <li><Link to="/gia-nong-san">Giá nông sản hôm nay</Link></li>
                  <li><Link to="/lich-hop">Lịch họp Ủy ban</Link></li>
                  <li><Link to="/bau-cu">Tuyên truyền Bầu cử</Link></li>
                  <li><Link to="/video">Kênh Video</Link></li>
                  <li><Link to="/chuyen-muc">Tất cả Chuyên mục</Link></li>
                </ul>
              )}
            </li>

          </ul>
        </div>

        {/* BROCADE PATTERN BORDER BOTTOM */}
        <div className="brocade-border-strip bottom" />

      </nav>

    </header>
  );
}
