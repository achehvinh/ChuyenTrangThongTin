import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLang } from '../LanguageContext';
import { useFontSize } from '../FontSizeContext';

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
  { to: '/Thu-tuc-hanh-chinh', label: 'Thủ tục hành chính' },
  {
    label: 'Hướng dẫn tra cứu',
    dropdown: [
      { to: '/tra-cuu', label: '🔍 Tra cứu BHYT' },
      { to: '/huong-dan-bhxh', label: '📋 Tra cứu BHXH' },
    ]
  },
    { to: '/Ban-do', label: 'Bản đồ' },
  { to: '/gia-nong-san', label: '🌾 Giá nông sản' }
];

export default function Navbar() {
  const { lang, toggleLang } = useLang();
   const { increase, decrease, sizeIndex, max } = useFontSize();

  return (
    <header className="navbar">

      {/* Hàng 1 — Logo + Tên + Nút ngôn ngữ */}
      <div className="navbar-top">
        <div className="navbar-brand">
          <img
            src="https://cdc.ninhbinh.gov.vn/upload/100765/20240118/dinh_huong_thong_tin_tuyen_truyen_7d94a.jpg"
            alt="Logo UBND"
            className="navbar-logo"
          />
         <div className="navbar-title">
  <div className="navbar-sub">
    ỦY BAN NHÂN DÂN XÃ ĐĂK PXI
  </div>

  <div className="navbar-main">
    CỔNG THÔNG TIN ĐIỆN TỬ
  </div>
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
            <span className="font-label">Cỡ chữ</span>
            <button
              className="font-btn"
              onClick={increase}
              disabled={sizeIndex === max}
              title="Tăng cỡ chữ"
            >
              A+
            </button>
          </div>

          <button className="lang-toggle" onClick={toggleLang}>
            {lang === 'vi' ? '🌐 Xê Đăng' : '🌐 Tiếng Việt'}
          </button>
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