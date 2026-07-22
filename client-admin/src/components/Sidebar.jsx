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
      { to: '/thong-bao',   icon: '📢', label: 'Thông báo' },
      { to: '/bai-viet',    icon: '✍️', label: 'Viết bài tuyên truyền' },
      { to: '/canh-bao',   icon: '🚨', label: 'Cảnh báo khẩn' },
      { to: '/lich-hop',   icon: '📅', label: 'Lịch họp thôn' },
      { to: '/chuyen-muc', icon: '📋', label: 'Chuyên mục' },
      { to: '/thu-vien',   icon: '🖼️', label: 'Thư viện ảnh' },
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
  const role = localStorage.getItem('admin_role');
  const fullName = localStorage.getItem('admin_fullname');
  const showUserManagement = role === 'admin' || role === 'truongphong';
  // Chỉ hiện ATGT với: cán bộ, phó phòng, trưởng phòng (KHÔNG hiện với admin hệ thống)
  const showATGT = ['canbo', 'phophong', 'truongphong'].includes(role);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_fullname');
    navigate('/dang-nhap');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏛️</div>
        <div>
          <div className="sidebar-logo-title">UBND Xã</div>
          <div className="sidebar-logo-sub">Đăk Pxi — Quảng Ngãi</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Mục AI riêng biệt */}
        <div className="sidebar-group">
          <div className="sidebar-group-label">Trợ lý AI</div>
          <NavLink to="/admin/knowledge" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">🤖</span>
            <span>Quản lý Tri thức AI</span>
          </NavLink>
        </div>

        {/* Mục Hệ thống quản lý */}
        <div className="sidebar-group">
          <div className="sidebar-group-label">Hệ thống</div>
          <NavLink to="/quan-ly-nguoi-dung" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">👥</span>
            <span>Quản lý người dùng BHYT</span>
          </NavLink>
          {showUserManagement && (
            <NavLink to="/quan-ly-can-bo" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`}>
              <span className="sidebar-item-icon">🔑</span>
              <span>Quản lý cán bộ</span>
            </NavLink>
          )}
        </div>

        {/* Các mục menu khác */}
        {MENU_GROUPS.map((group) => (
          <div className="sidebar-group" key={group.group}>
            <div className="sidebar-group-label">{group.group}</div>
            {group.items.map((item) => (
               <NavLink
                 key={item.to}
                 to={item.to}
                 className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
               >
                 <span className="sidebar-item-icon">{item.icon}</span>
                 <span>{item.label}</span>
               </NavLink>
            ))}
          </div>
        ))}

      </nav>

      <div className="sidebar-footer">
        {fullName && (
          <div className="sidebar-user-info" style={{ marginBottom: '12px', padding: '0 8px', fontSize: '13px', color: '#94a3b8', textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>👤 {fullName}</div>
            <div style={{ fontSize: '11px', marginTop: '2px' }}>Vai trò: {role === 'admin' ? 'Quản trị viên' : role === 'truongphong' ? 'Trưởng phòng' : role === 'phophong' ? 'Phó phòng' : 'Cán bộ'}</div>
          </div>
        )}
        <button className="sidebar-logout" onClick={handleLogout}>
          🔐 Đăng xuất
        </button>
        <div className="sidebar-version">v1.0.0 — Admin Panel</div>
      </div>
    </div>
  );
}