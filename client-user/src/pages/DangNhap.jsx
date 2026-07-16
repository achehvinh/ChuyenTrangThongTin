import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DangNhap.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function DangNhap() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      const { token, role, fullName } = response.data;
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_role", role);
      localStorage.setItem("admin_username", response.data.username);
      localStorage.setItem("admin_fullname", fullName);

      // Đăng nhập thành công, về trang chủ
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Sai tài khoản hoặc mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">
      <div className="user-login-box">
        <div className="user-login-logo">🏛️</div>
        <h2>CỔNG THÔNG TIN XÃ ĐĂK PXI</h2>
        <p className="user-login-sub">Đăng nhập dành cho Cán bộ</p>

        <form onSubmit={handleLogin}>
          <div className="user-login-field">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="user-login-field">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="user-login-error">⚠️ {error}</div>}

          <button type="submit" className="user-login-btn-submit" disabled={loading}>
            {loading ? "⏳ Đang đăng nhập..." : "🔐 Đăng nhập"}
          </button>
        </form>

        <div className="user-login-footer">
          UBND Xã Đăk Pxi — Quảng Ngãi © 2026
        </div>
      </div>
    </div>
  );
}
