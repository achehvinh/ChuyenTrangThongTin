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

  const getRoleLabel = (r) => {
    if (r === "admin") return "Quản trị viên";
    if (r === "truongphong") return "Trưởng phòng";
    if (r === "phophong") return "Phó phòng";
    return "Cán bộ";
  };

  return (
    <div className="quanly-page">
      <div className="quanly-header">
        <h1>👥 Quản lý Tài khoản Cán bộ</h1>
        <p>Quản lý và cấp tài khoản đăng nhập cho cán bộ thuộc quyền quản lý</p>
      </div>

      <div className="quanly-grid">
        {/* Khung Tạo tài khoản */}
        <div className="quanly-form-card">
          <h3>➕ Cấp tài khoản mới</h3>
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
          <h3>📋 Danh sách tài khoản trực thuộc</h3>
          <div className="table-responsive">
            <table className="quanly-table">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Tên đăng nhập</th>
                  <th>Chức vụ</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Hành động</th>
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
                        <strong>{user.fullName || "Chưa cập nhật"}</strong>
                      </td>
                      <td><code>{user.username}</code></td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="delete-user-btn"
                          onClick={() => handleDeleteUser(user._id, user.fullName || user.username)}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
