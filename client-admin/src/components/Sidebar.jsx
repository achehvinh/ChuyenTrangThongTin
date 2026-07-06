import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const MENU_GROUPS = [
  {
    group: 'Tổng quan',
    items: [
      { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    ]
  },
  {
    group: 'Nội dung tuyên truyền',
    items: [
      { to: '/thong-bao', icon: '📢', label: 'Thông báo' },
      { to: '/bai-viet', icon: '📝', label: 'Bài viết' },
      { to: '/canh-bao', icon: '🚨', label: 'Cảnh báo khẩn' },
      { to: '/lich-hop', icon: '📅', label: 'Lịch họp thôn' },
      { to: '/chuyen-muc', icon: '📋', label: 'Chuyên mục' },
      { to: '/thu-vien', icon: '🖼️', label: 'Thư viện ảnh' },
    ]
  },
  {
    group: 'Phản hồi',
    items: [
      { to: '/gop-y', icon: '💬', label: 'Góp ý bà con' },
    ]
  },
  {
    group: 'Website',
    items: [
      { to: '/user', icon: '🌐', label: 'Xem trang người dùng' },
    ]
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/dang-nhap');
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛️</div>
        <div>
          <div className="sidebar-logo-title">UBND Xã</div>
          <div className="sidebar-logo-sub">Đăk Pxi — Quảng Ngãi</div>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-nav">
        {MENU_GROUPS.map((group) => (
          <div className="sidebar-group" key={group.group}>
            <div className="sidebar-group-label">{group.group}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          🔐 Đăng xuất
        </button>
        <div className="sidebar-version">v1.0.0 — Admin Panel</div>
      </div>
    </div>
  );
}