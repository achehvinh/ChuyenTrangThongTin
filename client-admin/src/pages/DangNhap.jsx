import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DangNhap.css";

export default function DangNhap() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === "Vhxh" && password === "Vhxh@2026") {
        localStorage.setItem("admin_token", "da-dang-nhap");
        navigate("/dashboard");
      } else {
        setError("Sai tài khoản hoặc mật khẩu!");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="login-logo">🏛️</div>
        <h2>UBND Xã Đăk Pxi</h2>
        <p className="login-sub">Hệ thống quản lý nội dung</p>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="login-field">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="login-error">⚠️ {error}</div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🔐 Đăng nhập'}
          </button>
        </form>

        <div className="login-footer">
          UBND Xã Đăk Pxi — Quảng Ngãi © 2026
        </div>

      </div>
    </div>
  );
}