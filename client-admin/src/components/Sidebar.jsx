import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <nav className="sidebar-nav" style={{ paddingTop: "14px" }}>
        {/* NHÓM TỔNG QUAN */}
        <div className="sidebar-group">
          <div className="sidebar-group-label">Tổng quan</div>

          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="12" width="4" height="9" rx="1" fill="#3b82f6"/>
                <rect x="10" y="5" width="4" height="16" rx="1" fill="#ec4899"/>
                <rect x="17" y="9" width="4" height="12" rx="1" fill="#10b981"/>
              </svg>
            </span>
            <span>Tổng quan & Thống kê</span>
          </NavLink>

          <NavLink to="/admin/knowledge" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#f3e8ff" />
                <rect x="36" y="62" width="28" height="24" rx="10" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
                <circle cx="50" cy="74" r="6" fill="#2563eb" />
                <rect x="26" y="28" width="48" height="34" rx="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
                <rect x="31" y="33" width="38" height="24" rx="10" fill="#7c3aed" />
                <circle cx="43" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="57" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="44" cy="44" r="1.2" fill="#000000" />
                <circle cx="58" cy="44" r="1.2" fill="#000000" />
                <line x1="50" y1="28" x2="50" y2="20" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="18" r="4" fill="#a855f7" />
              </svg>
            </span>
            <span>Tri thức AI</span>
          </NavLink>
        </div>

        {/* NHÓM NGHIỆP VỤ XÃ */}
        <div className="sidebar-group" style={{ marginTop: "14px" }}>
          <div className="sidebar-group-label">Nghiệp vụ xã</div>

          <NavLink to="/thong-bao" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M13.4 2.12a1 1 0 0 0-1.17.26L6.5 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.5l5.73 5.62A1 1 0 0 0 14 21V3a1 1 0 0 0-.6-1.88z" fill="#ec4899"/>
                <path d="M18 12c0-2.21-1.19-4.14-2.98-5.18v10.36C16.81 16.14 18 14.21 18 12z" fill="#f59e0b"/>
              </svg>
            </span>
            <span>Thông báo</span>
          </NavLink>

          <NavLink to="/quan-ly-nguoi-dung" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7e22ce">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </span>
            <span>Quản lý BHYT</span>
          </NavLink>

          <NavLink to="/bai-viet" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#f59e0b"/>
                <path d="M20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#ef4444"/>
              </svg>
            </span>
            <span>Bài viết tuyên truyền</span>
          </NavLink>

          <NavLink to="/lich-hop" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="3" fill="#ffffff" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M3 8h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2z" fill="#3b82f6"/>
                <circle cx="8" cy="12" r="1.5" fill="#60a5fa"/>
                <circle cx="12" cy="12" r="1.5" fill="#60a5fa"/>
                <circle cx="16" cy="12" r="1.5" fill="#60a5fa"/>
                <circle cx="8" cy="16" r="1.5" fill="#60a5fa"/>
                <circle cx="12" cy="16" r="1.5" fill="#60a5fa"/>
                <circle cx="16" cy="16" r="1.5" fill="#60a5fa"/>
              </svg>
            </span>
            <span>Lịch họp thôn</span>
          </NavLink>

          <NavLink to="/thu-vien" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="3" fill="#ffffff" stroke="#f59e0b" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="2" fill="#ef4444"/>
                <path d="M20 16l-4.5-5-4 4.5L9 12l-5 6h16z" fill="#10b981"/>
              </svg>
            </span>
            <span>Thư viện tài liệu</span>
          </NavLink>

          <NavLink to="/quan-ly-can-bo" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v2h2v-2h2v-2h-8.35zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#eab308"/>
              </svg>
            </span>
            <span>Cán bộ & Cài đặt hệ thống</span>
          </NavLink>

          <NavLink to="/gop-y" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="#a855f7"/>
              </svg>
            </span>
            <span>Phản ánh & Hỏi đáp</span>
          </NavLink>

          <NavLink to="/quan-ly-quiz" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <span className="sidebar-item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
            </span>
            <span>Kết quả Cuộc thi Hiệp sĩ</span>
          </NavLink>
        </div>
      </nav>

      {/* THẺ TRỢ LÝ AI Ở CHÂN SIDEBAR */}
      <div className="sidebar-ai-box">
        <div className="sidebar-ai-card">
          <div className="sidebar-ai-title">Trợ lý AI</div>
          <div className="sidebar-ai-desc">Hỗ trợ tra cứu, giải đáp và tạo nội dung tuyên truyền</div>
          <div className="sidebar-ai-row">
            <div className="sidebar-ai-avatar-box">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="46" fill="#f3e8ff" />
                <circle cx="50" cy="50" r="38" fill="#e9d5ff" opacity="0.6" />
                <rect x="36" y="62" width="28" height="24" rx="10" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
                <circle cx="50" cy="74" r="6" fill="#2563eb" />
                <circle cx="50" cy="74" r="2.5" fill="#ffffff" />
                <rect x="26" y="28" width="48" height="34" rx="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
                <rect x="31" y="33" width="38" height="24" rx="10" fill="#7c3aed" />
                <circle cx="43" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="57" cy="45" r="3.5" fill="#ffffff" />
                <circle cx="44" cy="44" r="1.2" fill="#000000" />
                <circle cx="58" cy="44" r="1.2" fill="#000000" />
                <line x1="50" y1="28" x2="50" y2="20" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="18" r="4" fill="#a855f7" />
                <rect x="22" y="38" width="5" height="14" rx="2.5" fill="#a855f7" />
                <rect x="73" y="38" width="5" height="14" rx="2.5" fill="#a855f7" />
              </svg>
            </div>
            <button type="button" className="sidebar-ai-btn" onClick={() => navigate('/admin/knowledge')}>
              Chat ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}