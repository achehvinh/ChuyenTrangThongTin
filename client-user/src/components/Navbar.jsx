import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLang } from '../LanguageContext';
import { useFontSize } from '../FontSizeContext';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/chuyen-doi-so', label: 'Chuyển đổi số' },
  { to: '/ban-do', label: 'Bản đồ' },
  {
    label: 'Khác',
    dropdown: [
      { to: '/huong-dan', label: 'Hướng dẫn sử dụng' },
      { to: '/lien-he', label: 'Liên hệ' },
      { to: '/video', label: 'Video' },
      { to: '/thu-vien-anh', label: 'Hình ảnh' },
      { to: '/gioi-thieu', label: 'Giới thiệu' },
    ]
  }
];

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const { increase, decrease, sizeIndex, max, currentLabel } = useFontSize();

  return (
    <header className="navbar">

      {/* Hàng 1 — Logo + Tên + Cỡ chữ */}
      <div className="navbar-top">
        <div className="navbar-brand">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZ1BrruhiReTVU_7ul40Ev2emExnG9Moo4A&s"
            alt="Logo UBND"
            className="navbar-logo"
          />
          <div className="navbar-title">
            <span className="navbar-sub">Phòng Văn hóa Xã hội — Xã Đăk Pxi</span>
            <span className="navbar-main">Tuyên truyền & Hỗ trợ Dịch vụ Công</span>
          </div>
        </div>

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
        </nav>
      </div>

    </header>
  );
}