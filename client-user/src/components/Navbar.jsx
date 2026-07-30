import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Info, Settings, MapPin, Newspaper, FileText,
  BookOpen, Phone, ChevronDown, Search, User, Sliders, Menu, X
} from 'lucide-react';
import { useFontSize } from '../FontSizeContext';
import { useLang } from '../LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Language & Font size contexts
  const { lang, toggleLang } = useLang() || { lang: 'vi', toggleLang: () => { } };
  const { increase, decrease, sizeIndex } = useFontSize() || { increase: () => { }, decrease: () => { }, sizeIndex: 1 };

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  const [showIntroMenu, setShowIntroMenu] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isLoggedIn = !!localStorage.getItem("admin_token");
  const userFullName = localStorage.getItem("admin_fullname") || localStorage.getItem("admin_username") || "Cán bộ";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_fullname");
    setShowUserDropdown(false);
    navigate('/');
    window.location.reload();
  };

  const openOfficerPage = (path = '/truong-phong-dashboard') => {
    setShowUserDropdown(false);
    window.open(path, '_blank');
  };

  const handleUserClick = (e) => {
    if (e) e.stopPropagation();
    if (isLoggedIn) {
      window.open('/truong-phong-dashboard', '_blank');
    } else {
      navigate('/dang-nhap');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tra-cuu?q=${encodeURIComponent(searchTerm.trim())}`);
      closeDrawer();
    }
  };

  const closeDrawer = () => setDrawerOpen(false);

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
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

          {/* BRANDING: LOGO + TITLES */}
          <Link to="/" className="header-brand-box" onClick={closeDrawer}>
            <div className="brand-emblem-wrap">
              <img
                src="/huong-dan/anh-logo.jpg"
                alt="Logo Xã Đăk Pxi"
                className="brand-logo-img"
              />
            </div>

            <div className="brand-text-group">
              <span className="brand-subtext">TRANG THÔNG TIN ĐIỆN TỬ</span>
              <h1 className="brand-main-title">PHÒNG VĂN HÓA - XÃ HỘI</h1>
              <h2 className="brand-sub-title">XÃ ĐĂK PXI</h2>
              <p className="brand-slogan">Kết nối – Dân chủ – Minh bạch – Phát triển</p>
            </div>
          </Link>

          {/* TOP RIGHT CONTROLS: SEARCH + FONT SIZE + LANGUAGE + ACCOUNT + MOBILE MENU */}
          <div className="header-top-controls">

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} className="header-search-form desktop-only-search">
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
                onClick={decrease}
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
                onClick={increase}
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* LANGUAGE SELECTION FLAG BUTTON */}
            <button
              type="button"
              className="header-circle-icon-btn flag-btn"
              onClick={toggleLang}
              title={lang === 'vi' ? 'Tiếng Việt (Đổi sang Tiếng Anh)' : 'English (Switch to Vietnamese)'}
            >
              <span className="vn-flag-circle">
                <img
                  src={lang === 'vi' ? '/flag-vi.png' : '/flag-en.png'}
                  alt={lang === 'vi' ? 'VN Flag' : 'EN Flag'}
                  style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </span>
            </button>

            {/* USER ACCOUNT BADGE */}
            <div className="header-user-account-container">
              {isLoggedIn ? (
                <button
                  type="button"
                  className="header-user-logged-badge"
                  onClick={handleUserClick}
                  title={`Trang Quản lý Cán bộ (${userFullName})`}
                >
                  <span className="user-online-dot"></span>
                  <span className="user-name-text">{userFullName}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="header-circle-icon-btn user-btn"
                  onClick={handleUserClick}
                  title="Đăng nhập Cán bộ / Công dân"
                >
                  <User size={18} color="#4a3423" />
                </button>
              )}
            </div>

            {/* MOBILE HAMBURGER TOGGLE BUTTON */}
            <button
              type="button"
              className="mobile-menu-toggle-btn"
              onClick={() => setDrawerOpen(!drawerOpen)}
              title="Danh mục menu"
              aria-label="Mở menu di động"
            >
              {drawerOpen ? <X size={22} color="#4a3423" /> : <Menu size={22} color="#4a3423" />}
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

            {/* VĂN BẢN */}
            <li className="nav-item">
              <Link to="/phap-luat" className={`nav-link ${isActive('/phap-luat') ? 'active' : ''}`}>
                <FileText size={17} className="nav-icon" />
                <span>VĂN BẢN</span>
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
                  <li><Link to="/quiz/bhyt">Trắc nghiệm BHYT</Link></li>
                  <li><Link to="/chuyen-muc">Tất cả Chuyên mục</Link></li>
                </ul>
              )}
            </li>

          </ul>
        </div>

        {/* BROCADE PATTERN BORDER BOTTOM */}
        <div className="brocade-border-strip bottom" />

      </nav>

      {/* ════════════════════════════════════════════════════════════════
         MOBILE SLIDE-OUT DRAWER MENU
         ════════════════════════════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="mobile-drawer-overlay" onClick={closeDrawer}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="drawer-title">DANH MỤC TRANG</span>
              <button type="button" onClick={closeDrawer} className="drawer-close-btn">
                <X size={20} color="#ffffff" />
              </button>
            </div>

            {/* MOBILE SEARCH BAR */}
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                placeholder="Tìm kiếm thông tin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-btn">
                <Search size={16} color="#ffffff" />
              </button>
            </form>

            <ul className="mobile-drawer-menu">
              <li>
                <Link to="/" onClick={closeDrawer}>🏠 Trang chủ</Link>
              </li>

              {/* GIỚI THIỆU ACCORDION */}
              <li>
                <div className="accordion-item-head" onClick={() => toggleAccordion('intro')}>
                  <span>📋 Giới thiệu</span>
                  <ChevronDown size={16} className={`accordion-icon ${openAccordions['intro'] ? 'open' : ''}`} />
                </div>
                {openAccordions['intro'] && (
                  <ul className="accordion-sub-menu">
                    <li><Link to="/co-cau-to-chuc" onClick={closeDrawer}>Cơ cấu tổ chức</Link></li>
                    <li><Link to="/thong-tin" onClick={closeDrawer}>Tổng quan xã Đăk Pxi</Link></li>
                  </ul>
                )}
              </li>

              <li><Link to="/chuyen-doi-so" onClick={closeDrawer}>⚙ Chuyển đổi số</Link></li>
              <li><Link to="/Ban-do" onClick={closeDrawer}>🗺 Bản đồ</Link></li>
              <li><Link to="/tin-tuc" onClick={closeDrawer}>📰 Tin tức – Sự kiện</Link></li>
              <li><Link to="/phap-luat" onClick={closeDrawer}>📜 Văn bản pháp luật</Link></li>
              <li><Link to="/thu-vien-anh" onClick={closeDrawer}>📚 Thư viện tài liệu</Link></li>
              <li><Link to="/lien-he" onClick={closeDrawer}>📞 Liên hệ</Link></li>

              {/* KHÁC ACCORDION */}
              <li>
                <div className="accordion-item-head" onClick={() => toggleAccordion('other')}>
                  <span>🔲 Chuyên mục khác</span>
                  <ChevronDown size={16} className={`accordion-icon ${openAccordions['other'] ? 'open' : ''}`} />
                </div>
                {openAccordions['other'] && (
                  <ul className="accordion-sub-menu">
                    <li><Link to="/gia-nong-san" onClick={closeDrawer}>Giá nông sản hôm nay</Link></li>
                    <li><Link to="/lich-hop" onClick={closeDrawer}>Lịch họp Ủy ban</Link></li>
                    <li><Link to="/bau-cu" onClick={closeDrawer}>Tuyên truyền Bầu cử</Link></li>
                    <li><Link to="/video" onClick={closeDrawer}>Kênh Video</Link></li>
                    <li><Link to="/quiz/bhyt" onClick={closeDrawer}>Trắc nghiệm BHYT</Link></li>
                    <li><Link to="/chuyen-muc" onClick={closeDrawer}>Tất cả Chuyên mục</Link></li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}

    </header>
  );
}
