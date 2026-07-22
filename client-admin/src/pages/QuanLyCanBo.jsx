import { useState, useEffect } from "react";
import axios from "axios";
import "./QuanLyCanBo.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function QuanLyCanBo() {
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---- State cho chỉnh sửa tài khoản ----
  const [editingUser, setEditingUser] = useState(null); // object user đang sửa, null = đóng modal
  const [editFullName, setEditFullName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState(""); // để trống nếu không đổi
  const [editRole, setEditRole] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const loggedInRole = localStorage.getItem("admin_role");
  const loggedInUser = localStorage.getItem("admin_username");

  // Quy định các quyền được phép tạo
  let roleOptions = [];
  if (loggedInRole === "admin") {
    roleOptions = [{ value: "truongphong", label: "Trưởng phòng" }];
  } else if (loggedInRole === "truongphong") {
    roleOptions = [
      { value: "phophong", label: "Phó phòng" },
      { value: "canbo", label: "Cán bộ" },
    ];
  }

  // Vai trò được phép chọn khi sửa (giống quyền tạo)
  const editRoleOptions = roleOptions;

  // Tự động gán vai trò mặc định trong form
  useEffect(() => {
    if (roleOptions.length > 0 && !role) {
      setRole(roleOptions[0].value);
    }
  }, [roleOptions, role]);

  // Lấy danh sách cán bộ
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách cán bộ");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tạo tài khoản mới
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username || !password || !role || !fullName) {
      setError("Vui lòng điền đầy đủ tất cả thông tin");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      await axios.post(
        `${API_URL}/auth/users`,
        { username, password, role, fullName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Tạo tài khoản cán bộ thành công!");
      setUsername("");
      setPassword("");
      setFullName("");
      if (roleOptions.length > 0) {
        setRole(roleOptions[0].value);
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi khi tạo tài khoản cán bộ");
    } finally {
      setLoading(false);
    }
  };

  // Xóa tài khoản
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản của cán bộ "${name}" không?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      await axios.delete(`${API_URL}/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi xóa tài khoản");
    }
  };

  // ---- Mở modal chỉnh sửa ----
  const openEditUser = (user) => {
    setEditingUser(user);
    setEditFullName(user.fullName || "");
    setEditUsername(user.username || "");
    setEditPassword("");
    setEditRole(user.role || (editRoleOptions[0]?.value ?? ""));
    setEditError("");
  };

  const closeEditUser = () => {
    setEditingUser(null);
    setEditError("");
  };

  // ---- Lưu chỉnh sửa tài khoản ----
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editFullName || !editUsername || !editRole) {
      setEditError("Vui lòng điền đầy đủ tất cả thông tin");
      return;
    }

    setEditLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        fullName: editFullName,
        username: editUsername,
        role: editRole,
      };
      if (editPassword) {
        payload.password = editPassword;
      }

      await axios.put(`${API_URL}/auth/users/${editingUser._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      closeEditUser();
      fetchUsers();
    } catch (err) {
      console.error(err);
      setEditError(err.response?.data?.message || "Lỗi khi cập nhật tài khoản cán bộ");
    } finally {
      setEditLoading(false);
    }
  };

  const getRoleLabel = (r) => {
    if (r === "admin") return "Quản trị viên";
    if (r === "truongphong") return "Trưởng phòng";
    if (r === "phophong") return "Phó phòng";
    return "Cán bộ";
  };

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    const last = parts[parts.length - 1];
    return last ? last.charAt(0).toUpperCase() : "??";
  };

  return (
    <div className="quanly-page">
      <div className="quanly-header">
        <div className="quanly-header-icon">👥</div>
        <div>
          <h1>Quản lý Tài khoản Cán bộ</h1>
          <p>Quản lý và cấp tài khoản đăng nhập cho cán bộ thuộc quyền quản lý</p>
        </div>
      </div>

      <div className="quanly-grid">
        {/* Khung Tạo tài khoản */}
        <div className="quanly-form-card">
          <h3><span className="card-icon">➕</span> Cấp tài khoản mới</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label>Họ và tên cán bộ</label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Tên đăng nhập (Username)</label>
              <input
                type="text"
                placeholder="Ví dụ: canbo01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu đăng nhập</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu ban đầu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Chức vụ / Vai trò</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="quanly-error">⚠️ {error}</div>}
            {message && <div className="quanly-success">✅ {message}</div>}

            <button type="submit" className="quanly-submit-btn" disabled={loading}>
              {loading ? "⏳ Đang tạo..." : "🔐 Cấp tài khoản"}
            </button>
          </form>
        </div>

        {/* Bảng Danh sách tài khoản */}
        <div className="quanly-list-card">
          <div className="quanly-list-header">
            <h3><span className="card-icon">📋</span> Danh sách tài khoản trực thuộc</h3>
            <span className="quanly-count-badge">{users.length} tài khoản</span>
          </div>
          <div className="table-responsive">
            <table className="quanly-table">
              <thead>
                <tr>
                  <th>Cán bộ</th>
                  <th>Tên đăng nhập</th>
                  <th>Chức vụ</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      Chưa có tài khoản nào được tạo hoặc không có quyền xem
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="quanly-user-cell">
                          <span className="quanly-avatar">{getInitials(user.fullName || user.username)}</span>
                          <strong>{user.fullName || "Chưa cập nhật"}</strong>
                        </div>
                      </td>
                      <td><code>{user.username}</code></td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="quanly-action-group">
                          <button
                            className="edit-user-btn"
                            onClick={() => openEditUser(user)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            className="delete-user-btn"
                            onClick={() => handleDeleteUser(user._id, user.fullName || user.username)}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---- Modal chỉnh sửa tài khoản ---- */}
      {editingUser && (
        <div className="quanly-modal-overlay" onClick={closeEditUser}>
          <div className="quanly-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quanly-modal-header">
              <h3><span className="card-icon">✏️</span> Chỉnh sửa tài khoản cán bộ</h3>
              <button className="quanly-modal-close" onClick={closeEditUser}>✕</button>
            </div>

            <form onSubmit={handleUpdateUser} className="quanly-modal-body">
              <div className="form-group">
                <label>Họ và tên cán bộ</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tên đăng nhập (Username)</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới (để trống nếu không đổi)</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới nếu muốn đổi"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Chức vụ / Vai trò</label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} required>
                  {editRoleOptions.length === 0 ? (
                    <option value={editingUser.role}>{getRoleLabel(editingUser.role)}</option>
                  ) : (
                    editRoleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {editError && <div className="quanly-error">⚠️ {editError}</div>}

              <div className="quanly-modal-actions">
                <button type="button" className="quanly-cancel-btn" onClick={closeEditUser}>
                  Hủy
                </button>
                <button type="submit" className="quanly-submit-btn" disabled={editLoading}>
                  {editLoading ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}