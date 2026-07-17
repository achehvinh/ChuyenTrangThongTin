import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLang } from '../LanguageContext';
import { useFontSize } from '../FontSizeContext';
import { User } from 'lucide-react';

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

  const isLoggedIn = !!localStorage.getItem("admin_token");
  const userFullName = localStorage.getItem("admin_fullname") || localStorage.getItem("admin_username") || "Cán bộ";
  const userRole = localStorage.getItem("admin_role");

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_fullname");
    window.location.reload();
  };

  return (
    <header className="navbar">

      {/* Hàng 1 — Logo + Tên + Cỡ chữ */}
      <div className="navbar-top">
        <NavLink to="/" className="navbar-brand">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZ1BrruhiReTVU_7ul40Ev2emExnG9Moo4A&s"
            alt="Logo UBND"
            className="navbar-logo"
          />
          <div className="navbar-title">

            <span className="navbar-main">TRANG THÔNG TIN ĐIỆN TỬ PHÒNG VĂN HÓA - XÃ HỘI XÃ ĐĂK PXI</span>
          </div>
        </NavLink>

        <div className="navbar-actions">
          <div className="font-size-controls notranslate">
            <button className="font-btn" onClick={decrease} disabled={sizeIndex === 0} title="Giảm cỡ chữ">A−</button>
            <span className="font-label">{currentLabel}</span>
            <button className="font-btn" onClick={increase} disabled={sizeIndex === max} title="Tăng cỡ chữ">A+</button>
          </div>

          <div className="lang-toggle-wrapper notranslate">
            <button
              className="lang-toggle-btn"
              onClick={toggleLang}
              title={lang === 'vi' ? 'Switch to English / Chuyển sang Tiếng Anh' : 'Chuyển sang Tiếng Việt / Switch to Vietnamese'}
            >
              <img
                src={lang === 'vi' ? '/flag-vi.png' : '/flag-en.png'}
                alt={lang === 'vi' ? 'Tiếng Việt' : 'English'}
                className="lang-flag-img"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Hàng 2 — Menu */}
      <div className="navbar-bottom">
        <nav className="navbar-nav">
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

          {isLoggedIn ? (
            <div className="nav-user-dropdown">
              <span className="nav-user-trigger">
                <User size={18} strokeWidth={2} />
                <span>{userFullName}</span>
              </span>
              <div className="nav-user-menu">
                <div className="nav-user-role-label">
                  Chức danh: {userRole === 'admin' ? 'Quản trị viên' : userRole === 'truongphong' ? 'Trưởng phòng' : userRole === 'phophong' ? 'Phó phòng' : 'Cán bộ'}
                </div>
                <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="nav-user-item">
                  ⚙️ Trang quản trị
                </a>
                <button onClick={handleLogout} className="nav-user-item logout-btn">
                  🔐 Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/dang-nhap" className="nav-login-btn">
              <User size={18} strokeWidth={2} />
            </NavLink>
          )}
        </nav>
      </div>

    </header>
  );
}