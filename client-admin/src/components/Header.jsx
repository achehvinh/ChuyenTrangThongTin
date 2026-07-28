import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

const PAGE_METADATA = {
  "/admin/knowledge": {
    icon: "🤖",
    title: "Trợ lý AI - Phòng Văn hóa - Xã hội",
    sub: "Hỗ trợ tra cứu thủ tục hành chính, giải đáp và tuyên truyền"
  },
  "/dashboard": {
    icon: "📊",
    title: "Tổng quan Quản trị - UBND Xã Đăk Pxi",
    sub: "Theo dõi số liệu, thông báo và tình hình tuyên truyền xã Đăk Pxi"
  },
  "/thong-bao": {
    icon: "📢",
    title: "Quản lý Thông báo Tuyên truyền",
    sub: "Đăng tải và theo dõi danh sách thông báo chính thức UBND xã"
  },
  "/bai-viet": {
    icon: "✍️",
    title: "Viết & Quản lý Bài viết Tuyên truyền",
    sub: "Biên soạn bài viết tuyên truyền chủ trương, chính sách cho người dân"
  },
  "/canh-bao": {
    icon: "🚨",
    title: "Quản lý Cảnh báo Khẩn",
    sub: "Phát tin cảnh báo thiên tai, an ninh trật tự, lừa đảo mạng đến các thôn"
  },
  "/lich-hop": {
    icon: "📅",
    title: "Quản lý Lịch họp Thôn xã Đăk Pxi",
    sub: "Sắp xếp và ban hành lịch họp nhân dân 10 thôn thuộc xã"
  },
  "/chuyen-muc": {
    icon: "📋",
    title: "Quản lý Chuyên mục Thông tin",
    sub: "Phân loại chuyên mục tuyên truyền cho Cổng thông tin xã"
  },
  "/thu-vien": {
    icon: "🖼️",
    title: "Thư viện Ảnh & Tư liệu Tuyên truyền",
    sub: "Lưu trữ hình ảnh, tài liệu phục vụ công tác văn hóa xã"
  },
  "/gop-y": {
    icon: "💬",
    title: "Tiếp nhận Góp ý & Phản ánh Bà con",
    sub: "Lắng nghe tâm tư, nguyện vọng và ý kiến đóng góp của Nhân dân"
  },
  "/quan-ly-can-bo": {
    icon: "🔑",
    title: "Quản lý Đội ngũ Cán bộ & Phân quyền",
    sub: "Danh sách Trưởng phòng, Phó phòng và Cán bộ chuyên trách xã"
  },
  "/quan-ly-nguoi-dung": {
    icon: "👥",
    title: "Quản lý Người dùng & Thẻ BHYT Bà con",
    sub: "Cơ sở dữ liệu thông tin tham gia BHYT/BHXH của người dân"
  }
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [adminUser, setAdminUser] = useState(() => {
    return {
      fullName: localStorage.getItem("admin_fullname") || "Quản trị viên Hệ thống",
      username: localStorage.getItem("admin_username") || "admin_vhxh",
      roleTitle: localStorage.getItem("admin_role") === "truongphong" ? "Trưởng phòng VH-XH" : "Quản trị hệ thống",
      phone: "0987.654.321",
      email: "admin.vhxh@dakpxi.gov.vn"
    };
  });

  const [passForm, setPassForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: ""
  });

  const pageMeta = PAGE_METADATA[location.pathname] || {
    icon: "🏛️",
    title: "Hệ thống Quản trị - Phòng Văn hóa - Xã hội",
    sub: "UBND xã Đăk Pxi — Tỉnh Quảng Ngãi"
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_fullname");
    navigate("/dang-nhap");
  };

  return (
    <header className="admin-header-bar">
      {/* LEFT: ICON + TITLE + SUBTITLE */}
      <div className="admin-header-title-box">
        <div className="admin-header-logo-icon">{pageMeta.icon}</div>
        <div>
          <h2 className="admin-header-main-title">{pageMeta.title}</h2>
          <p className="admin-header-sub-title">{pageMeta.sub}</p>
        </div>
      </div>

      {/* RIGHT: CONTROLS (PILL, BELL, USER PROFILE BADGE) */}
      <div className="admin-header-controls">
        <div className="admin-subject-pill">
          <span style={{ fontSize: "13px" }}>👤</span>
          <span>Chủ đề: <strong style={{ color: "#1d4ed8" }}>Thủ tục hành chính</strong></span>
        </div>

        <button type="button" className="admin-notif-bell" title="Thông báo hệ thống">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="admin-notif-badge">3</span>
        </button>

        {/* USER PROFILE PILL BADGE (QUẢN TRỊ VIÊN HỆ THỐNG AD) */}
        <div className="admin-user-pill-wrapper">
          <div
            className="admin-user-pill"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="Bấm để xem Cài đặt tài khoản & Đăng xuất"
          >
            <div className="admin-user-text">
              <span className="admin-user-name">{adminUser.fullName}</span>
              <span className="admin-user-role">{adminUser.roleTitle}</span>
            </div>
            <div className="admin-user-avatar">
              AD
            </div>
          </div>

          {/* DROPDOWN MENU KHI BẤM VÀO USER PILL */}
          {showUserMenu && (
            <div className="admin-user-dropdown">
              <div className="admin-user-drop-head">
                <div className="admin-user-drop-name">{adminUser.fullName}</div>
                <div className="admin-user-drop-sub">🏛️ Phòng Văn hóa - Xã hội xã Đăk Pxi</div>
              </div>

              <div className="admin-user-drop-body">
                <button
                  type="button"
                  onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}
                  className="admin-user-drop-item"
                >
                  👤 <span>Cài đặt thông tin tài khoản</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setShowUserMenu(false); setShowPasswordModal(true); }}
                  className="admin-user-drop-item"
                >
                  🔑 <span>Đổi mật khẩu bảo mật</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setShowUserMenu(false); navigate("/admin/knowledge?tab=ai-config"); }}
                  className="admin-user-drop-item"
                >
                  ⚙️ <span>Cấu hình Trợ lý AI</span>
                </button>

                <div className="admin-user-drop-divider" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="admin-user-drop-item admin-user-drop-item--logout"
                >
                  🚪 <span>Đăng xuất khỏi hệ thống</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* POPUP 1: CÀI ĐẶT THÔNG TIN TÀI KHOẢN */}
      {showProfileModal && (
        <div className="admin-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="admin-modal-content" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>👤 CÀI ĐẶT THÔNG TIN TÀI KHOẢN CÁN BỘ</h3>
              <button className="admin-modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Họ và tên Cán bộ:</label>
                <input
                  type="text"
                  value={adminUser.fullName}
                  onChange={(e) => setAdminUser({ ...adminUser, fullName: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Tên đăng nhập hệ thống:</label>
                <input
                  type="text"
                  value={adminUser.username}
                  onChange={(e) => setAdminUser({ ...adminUser, username: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Chức danh / Vai trò nghiệp vụ:</label>
                <input
                  type="text"
                  value={adminUser.roleTitle}
                  onChange={(e) => setAdminUser({ ...adminUser, roleTitle: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Số điện thoại liên hệ:</label>
                <input
                  type="text"
                  value={adminUser.phone}
                  onChange={(e) => setAdminUser({ ...adminUser, phone: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Email công vụ:</label>
                <input
                  type="email"
                  value={adminUser.email}
                  onChange={(e) => setAdminUser({ ...adminUser, email: e.target.value })}
                  className="admin-input"
                />
              </div>

              <button
                type="button"
                className="admin-submit-btn"
                onClick={() => {
                  localStorage.setItem("admin_fullname", adminUser.fullName);
                  localStorage.setItem("admin_username", adminUser.username);
                  setShowProfileModal(false);
                  alert("✅ Đã cập nhật thông tin tài khoản thành công!");
                }}
              >
                💾 Cập Nhật Thông Tin Tài Khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: ĐỔI MẬT KHẨU BẢO MẬT */}
      {showPasswordModal && (
        <div className="admin-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="admin-modal-content" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>🔑 ĐỔI MẬT KHẨU TÀI KHOẢN ADMIN</h3>
              <button className="admin-modal-close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại..."
                  value={passForm.oldPass}
                  onChange={(e) => setPassForm({ ...passForm, oldPass: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới..."
                  value={passForm.newPass}
                  onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới..."
                  value={passForm.confirmPass}
                  onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                  className="admin-input"
                />
              </div>

              <button
                type="button"
                className="admin-submit-btn"
                onClick={() => {
                  if (!passForm.oldPass || !passForm.newPass) {
                    alert("⚠️ Vui lòng nhập đầy đủ thông tin mật khẩu!");
                    return;
                  }
                  if (passForm.newPass !== passForm.confirmPass) {
                    alert("⚠️ Mật khẩu mới xác nhận không trùng khớp!");
                    return;
                  }
                  setShowPasswordModal(false);
                  setPassForm({ oldPass: "", newPass: "", confirmPass: "" });
                  alert("✅ Đổi mật khẩu thành công!");
                }}
              >
                🔒 Đổi Mật Khẩu Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
