import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLang } from '../LanguageContext';
import { useFontSize } from '../FontSizeContext';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/chuyen-doi-so', label: 'Chuyển đổi số' },
  { to: '/ban-do', label: 'Bản đồ' },

  {
    label: 'Hỗ trợ',
    dropdown: [
      { to: '/huong-dan', label: '📘 Hướng dẫn sử dụng' },
      { to: '/lien-he', label: '📞 Liên hệ' },
      { to: '/video', label: '🎥 Video' },
      { to: '/thu-vien-anh', label: '🖼️ Hình ảnh' },
      { to: '/gioi-thieu', label: '🏛️ Giới thiệu' },
    ]
  }
];

// ← Thêm link ảnh nền vào đây
const NAVBAR_BG_IMAGE = 'http://localhost:3000/anhnen1.png';

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const { increase, decrease, sizeIndex, max, currentLabel } = useFontSize();

  return (
    <header
      className="navbar"
      style={NAVBAR_BG_IMAGE ? {
        backgroundImage: `url('${NAVBAR_BG_IMAGE}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      {/* Overlay tối nhẹ để chữ dễ đọc khi có ảnh nền */}
      {NAVBAR_BG_IMAGE && <div className="navbar-bg-overlay" />}

      {/* Hàng 1 — Logo + Tên + Nút ngôn ngữ */}
      <div className="navbar-top">
        <div className="navbar-brand">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZ1BrruhiReTVU_7ul40Ev2emExnG9Moo4A&s"
            alt="Logo UBND"
            className="navbar-logo"
          />
          <div className="navbar-title">
            <div className="navbar-sub">
              PHÒNG VĂN HÓA XÃ HỘI - XÃ ĐĂK PXI
            </div>
            <div className="navbar-main">
              TUYÊN TRUYỀN
            </div>
            <div className="navbar-main"> 
              VÀ HỖ TRỢ DỊCH VỤ CÔNG TRỰC TUYẾN </div>
          </div>
        </div>
        <div className="navbar-actions">
          {/* Nút A+ / A- */}
          <div className="font-size-controls">
  <button
    className="font-btn"
    onClick={decrease}
    disabled={sizeIndex === 0}
    title="Giảm cỡ chữ"
  >
    A−
  </button>
  <span className="font-label">{currentLabel}</span>
  <button
    className="font-btn"
    onClick={increase}
    disabled={sizeIndex === max}
    title="Tăng cỡ chữ"
  >
    A+
  </button>
</div>
        </div>
      </div>

      {/* Hàng 2 — Menu điều hướng */}
      <div className="navbar-bottom">
        <nav className="navbar-nav">
          {NAV_ITEMS.map((item) => (
            item.dropdown ? (
              <div className="nav-dropdown" key={item.label}>
                <span className="nav-link nav-dropdown-trigger">
                  {item.label} ▾
                </span>
                <div className="nav-dropdown-menu">
                  {item.dropdown.map(sub => (
                    <NavLink key={sub.to} to={sub.to} className="nav-dropdown-item">
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
      </div>
    </header>
  );
}