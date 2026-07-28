import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLang } from '../LanguageContext';
import { useFontSize } from '../FontSizeContext';
import { User, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'TRANG CHỦ' },
  {
    label: 'GIỚI THIỆU',
    dropdown: [
      { to: '/co-cau-to-chuc', label: 'Cơ cấu tổ chức' },
      { to: '/lien-he', label: 'Lãnh đạo' },
    ]
  },
  { to: '/chuyen-doi-so', label: 'CHUYỂN ĐỔI SỐ' },
  { to: '/ban-do', label: 'BẢN ĐỒ' },
  {
    label: 'KHÁC',
    dropdown: [
      { to: '/huong-dan', label: 'Hướng dẫn sử dụng' },
      { to: '/lien-he', label: 'Liên hệ' },
      { to: '/video', label: 'Video' },
      { to: '/thu-vien-anh', label: 'Hình ảnh' },
    ]
  }
];

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const { increase, decrease, sizeIndex, max, currentLabel } = useFontSize();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});

  const isLoggedIn = !!localStorage.getItem("admin_token");
  const userFullName = localStorage.getItem("admin_fullname") || localStorage.getItem("admin_username") || "Cán bộ";
  const userRole = localStorage.getItem("admin_role");

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const toggleAccordion = (label) => {
    setOpenAccordions(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <header className="navbar">

      {/* Hàng 1 — Logo + Tên + Hamburger Button */}
      <div className="navbar-top">
        <NavLink to="/" className="navbar-brand" onClick={closeDrawer}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZ1BrruhiReTVU_7ul40Ev2emExnG9Moo4A&s"
            alt="Logo UBND"
            className="navbar-logo"
          />
          <div className="navbar-title">
            <span className="navbar-main">TRANG THÔNG TIN ĐIỆN TỬ PHÒNG VĂN HÓA - XÃ HỘI XÃ ĐĂK PXI</span>
          </div>
        </NavLink>

        {/* Nút Hamburger Menu trên Mobile */}
        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle menu nav"
        >
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Hàng 2 — Menu Desktop */}
      <div className="navbar-bottom">
        <nav className="navbar-nav">
          <div className="nav-links-left">
            {NAV_ITEMS.map(item =>
              item.dropdown ? (
                <div className="nav-dropdown" key={item.label}>
                  <span className="nav-link nav-dropdown-trigger">{item.label} ▾</span>
                  <div className="nav-dropdown-menu">
                    {item.dropdown.map(sub => (
                      <NavLink key={sub.to} to={sub.to} className="nav-dropdown-item">{sub.label}</NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>

          <div className="nav-actions-right">
            {/* 1. Cỡ chữ */}
            <div className="font-size-controls notranslate">
              <button className="font-btn" onClick={decrease} disabled={sizeIndex === 0} title="Giảm cỡ chữ">A−</button>
              <span className="font-label">{currentLabel}</span>
              <button className="font-btn" onClick={increase} disabled={sizeIndex === max} title="Tăng cỡ chữ">A+</button>
            </div>

            {/* 2. Ngôn ngữ */}
            <div className="lang-toggle-wrapper notranslate">
              <button
                className="lang-toggle-btn"
                onClick={toggleLang}
                title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              >
                <img
                  src={lang === 'vi' ? '/flag-vi.png' : '/flag-en.png'}
                  alt={lang === 'vi' ? 'Tiếng Việt' : 'English'}
                  className="lang-flag-img"
                />
              </button>
            </div>

            {/* 3. Đăng nhập */}
            <div className="navbar-user-actions">
              {isLoggedIn ? (
                <div className="navbar-user-logged-in-group">
                  <a
                    href="/truong-phong"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-user-btn"
                    title={`Chức danh: ${userRole === 'admin' ? 'Quản trị viên' : userRole === 'truongphong' ? 'Trưởng phòng' : 'Cán bộ'}`}
                  >
                    <User size={18} strokeWidth={2} />
                    <span>{userFullName}</span>
                  </a>
                </div>
              ) : (
                <NavLink to="/dang-nhap" className="header-login-btn">
                  <span className="login-text">Đăng nhập</span>
                  <User size={18} strokeWidth={2} />
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* DRAWER SLIDE-OVER MENU TRÊN MOBILE (<768px) VỚI DẠNG ACCORDION */}
      {drawerOpen && (
        <div className="navbar-drawer-overlay" onClick={closeDrawer}>
          <div className="navbar-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">MENU BÀN PHÍM / ĐIỀU HƯỚNG</span>
              <button className="drawer-close-btn" onClick={closeDrawer}><X size={20} /></button>
            </div>
            
            <div className="drawer-body">
              {NAV_ITEMS.map(item => (
                <div key={item.label} className="drawer-item-group">
                  {item.dropdown ? (
                    <>
                      <button
                        type="button"
                        className={`drawer-link drawer-accordion-btn ${openAccordions[item.label] ? 'expanded' : ''}`}
                        onClick={() => toggleAccordion(item.label)}
                      >
                        <span>{item.label}</span>
                        <span className="accordion-arrow">{openAccordions[item.label] ? '▴' : '▾'}</span>
                      </button>
                      {openAccordions[item.label] && (
                        <div className="drawer-sub-menu">
                          {item.dropdown.map(sub => (
                            <NavLink
                              key={sub.to}
                              to={sub.to}
                              className="drawer-link sub-link"
                              onClick={closeDrawer}
                            >
                              {sub.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.to}
                      className="drawer-link"
                      onClick={closeDrawer}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}

              <div className="drawer-divider"></div>

              {/* Utility buttons inside drawer */}
              <div className="drawer-utilities">
                <div className="font-size-controls notranslate">
                  <span>Cỡ chữ: </span>
                  <button className="font-btn" onClick={decrease} disabled={sizeIndex === 0}>A−</button>
                  <span className="font-label">{currentLabel}</span>
                  <button className="font-btn" onClick={increase} disabled={sizeIndex === max}>A+</button>
                </div>

                {isLoggedIn ? (
                  <a href="/truong-phong" className="drawer-user-btn" onClick={closeDrawer}>
                    <User size={18} />
                    <span>{userFullName} (Không gian làm việc)</span>
                  </a>
                ) : (
                  <NavLink to="/dang-nhap" className="drawer-user-btn" onClick={closeDrawer}>
                    <User size={18} />
                    <span>Đăng nhập cán bộ</span>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}