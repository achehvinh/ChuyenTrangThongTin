import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLang } from '../LanguageContext';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ' },
    { 
    label: 'Thông báo', 
    dropdown: [
      { to: '/thong-bao', label: '📋 Thông báo' },
      { to: '/lich-hop', label: '📅 Lịch họp' },
    ]
  },
  { to: '/chuyen-doi-so', label: 'Chuyển đổi số' },
  { to: '/Thu-vien-anh', label: 'Thư viện ảnh' },
  {
  label: 'Hướng dẫn tra cứu',
  dropdown: [
    { to: '/tra-cuu', label: '🔍 Tra cứu BHYT' },
    { to: '/huong-dan-bhxh', label: '📋 Tra cứu BHXH' },
  ]
},
];

export default function Navbar() {
  const { lang, toggleLang } = useLang(); // ✅ trong component

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <img
            src="https://cdc.ninhbinh.gov.vn/upload/100765/20240118/dinh_huong_thong_tin_tuyen_truyen_7d94a.jpg"
            alt="Logo UBND"
            className="navbar-logo"
          />
          <div className="navbar-title">
            <span className="navbar-sub">UBND XÃ ĐĂK PXI</span>
            <span className="navbar-main">PHÒNG VĂN HÓA - XÃ HỘI</span>
          </div>
        </div>

        <nav className="navbar-nav">
  {NAV_ITEMS.map((item) => (
    item.dropdown ? (
      <div className="nav-dropdown" key={item.label}>
        <span className="nav-link nav-dropdown-trigger">
          {item.label} ▾
        </span>
        <div className="nav-dropdown-menu">
          {item.dropdown.map(sub => (
            <NavLink
              key={sub.to}
              to={sub.to}
              className="nav-dropdown-item"
            >
              {sub.label}
            </NavLink>
          ))}
        </div>
      </div>
    ) : (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          `nav-link ${isActive ? 'nav-link--active' : ''}`
        }
      >
        {item.label}
      </NavLink>
    )
  ))}
</nav>

        {/* ✅ nằm trong return */}
        <button className="lang-toggle" onClick={toggleLang}>
          {lang === 'vi' ? '🌐 Xê Đăng' : '🌐 Tiếng Việt'}
        </button>

      </div>
    </header>
  );
}