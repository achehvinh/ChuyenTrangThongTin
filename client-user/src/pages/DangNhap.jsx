import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";
import "./DangNhap.css";

const API_URL = getApiUrl();

export default function DangNhap() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      <div className="user-login-card">
        {/* Left column: Form */}
        <div className="user-login-left">
          <h2 className="user-login-title">Đăng nhập</h2>

          <form onSubmit={handleLogin}>
            <div className="user-login-field">
              <label>Tài khoản <span className="required-star">*</span></label>
              <input
                type="text"
                placeholder="Nhập tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="user-login-field">
              <label>Mật khẩu <span className="required-star">*</span></label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="user-login-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-label">Ghi nhớ mật khẩu</span>
              </label>
              <span
                className="forgot-password-link"
                onClick={() => alert("Vui lòng liên hệ Admin của Ủy ban xã để được cấp lại mật khẩu.")}
              >
                Quên mật khẩu?
              </span>
            </div>

            {error && <div className="user-login-error">⚠️ {error}</div>}

            <button type="submit" className="user-login-btn-submit" disabled={loading}>
              {loading ? "⏳ Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <button className="user-login-btn-back" onClick={() => navigate("/")}>
            ← Quay về trang chủ
          </button>
        </div>

        {/* Right column: Vector Illustration */}
        <div className="user-login-right">
          <svg width="100%" height="100%" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="250" cy="200" r="180" fill="#3b82f6" fillOpacity="0.05" />
            <circle cx="120" cy="120" r="6" fill="#fbbf24" fillOpacity="0.6" />
            <circle cx="380" cy="80" r="4" fill="#3b82f6" fillOpacity="0.6" />
            <circle cx="420" cy="220" r="8" fill="#10b981" fillOpacity="0.4" />

            <path d="M100 250 L180 180 L280 230 L380 130" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="100" cy="250" r="6" fill="#3b82f6" />
            <circle cx="180" cy="180" r="6" fill="#3b82f6" />
            <circle cx="280" cy="230" r="6" fill="#3b82f6" />
            <circle cx="380" cy="130" r="8" fill="#fbbf24" />

            <rect x="150" y="240" width="24" height="60" rx="4" fill="#fbbf24" fillOpacity="0.8" />
            <rect x="210" y="200" width="24" height="100" rx="4" fill="#3b82f6" fillOpacity="0.4" />
            <rect x="270" y="170" width="24" height="130" rx="4" fill="#3b82f6" fillOpacity="0.6" />
            <rect x="330" y="120" width="24" height="180" rx="4" fill="#003d73" fillOpacity="0.7" />

            <g transform="translate(360, 60) rotate(-15)">
              <path d="M-10 40 L0 60 L10 40 Z" fill="#ef4444" />
              <path d="M-5 40 L0 50 L5 40 Z" fill="#f97316" />
              <rect x="-15" y="-30" width="30" height="70" rx="15" fill="#f8fafc" stroke="#003d73" strokeWidth="3" />
              <path d="M-15 0 L-25 35 L-15 30 Z" fill="#003d73" />
              <path d="M15 0 L25 35 L15 30 Z" fill="#003d73" />
              <path d="M-15 -10 C-15 -35 0 -45 0 -45 C0 -45 15 -35 15 -10 Z" fill="#ef4444" stroke="#003d73" strokeWidth="3" />
              <circle cx="0" cy="0" r="8" fill="#93c5fd" stroke="#003d73" strokeWidth="3" />
            </g>

            <g transform="translate(110, 270)">
              <circle cx="0" cy="-30" r="10" fill="#003d73" />
              <path d="M-15 10 C-15 -10 15 -10 15 10" fill="#003d73" />
              <rect x="-25" y="10" width="40" height="4" rx="2" fill="#64748b" />
              <path d="M-10 10 L-5 2" stroke="#3b82f6" strokeWidth="2" />
            </g>

            <g transform="translate(230, 280)">
              <circle cx="0" cy="-30" r="10" fill="#10b981" />
              <path d="M-15 10 C-15 -10 15 -10 15 10" fill="#10b981" />
            </g>

            <circle cx="390" cy="240" r="15" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <text x="390" y="245" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#d97706" textAnchor="middle">$</text>

            <circle cx="430" cy="180" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <text x="430" y="184" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="#d97706" textAnchor="middle">$</text>

            <circle cx="440" cy="280" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <text x="440" y="285" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#d97706" textAnchor="middle">$</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
