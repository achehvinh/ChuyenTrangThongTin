import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { FEATURES } from "../data";

const FEATURED_PATHS = ['/thong-bao', '/tra-cuu', '/huong-dan-vneid', '/thu-tuc-hanh-chinh'];

export default function HomePage() {
  const navigate = useNavigate();
  const [showTraCuu, setShowTraCuu] = useState(false);

  return (
    <div className="home">

      {/* ── Ảnh nền + 2 cột ── */}
      <div className="quick-services-wrapper">
        <div className="home-layout">

          {/* CỘT TRÁI */}
          <main className="home-main">
            <div className="main-section-header">
              <h2>CHUYÊN TRANG THÔNG TIN ĐĂK PXI</h2>
            </div>
            <div className="main-content-area">
              <div className="main-placeholder">
                <span>📰</span>
                <p>Khu vực tin tức & nội dung chính</p>
                <small>Thêm component tin tức, bài viết vào đây</small>
              </div>
            </div>
          </main>

          {/* CỘT PHẢI — Sidebar */}
          <aside className="home-sidebar">

            <div className="sidebar-card">
              <div className="sidebar-card-header">TIỆN ÍCH DỊCH VỤ</div>
              <ul className="sidebar-links">
                <li onClick={() => navigate('/thu-tuc-hanh-chinh')}>Thủ tục hành chính</li>
                <li onClick={() => navigate('/huong-dan-vneid')}>Hướng dẫn VNeID</li>

                {/* Dropdown mở xuống khi hover */}
                <li
                  className={`sidebar-link-dropdown ${showTraCuu ? 'open' : ''}`}
                  onMouseEnter={() => setShowTraCuu(true)}
                  onMouseLeave={() => setShowTraCuu(false)}
                >
                  <span>
                    Hướng dẫn tra cứu
                    <span className="sidebar-dropdown-arrow">{showTraCuu ? '▴' : '▾'}</span>
                  </span>
                  {showTraCuu && (
                    <ul className="sidebar-link-submenu">
                      <li onClick={() => navigate('/tra-cuu')}>🔍 Tra cứu BHYT</li>
                      <li onClick={() => navigate('/huong-dan-bhxh')}>📋 Tra cứu BHXH</li>
                    </ul>
                  )}
                </li>

                <li onClick={() => navigate('/phap-luat')}>Góc pháp luật</li>
                <li onClick={() => navigate('/chuyen-muc')}>Tuyên truyền</li>
              </ul>
            </div>

            <div className="sidebar-card">
              <div className="sidebar-card-header">🌾 GIÁ NÔNG SẢN</div>
              <div className="sidebar-agri">
                <div className="sidebar-agri-item">
                  <span>Cà phê nhân</span>
                  <strong>125.000đ/kg</strong>
                </div>
                <div className="sidebar-agri-item">
                  <span>Hồ tiêu</span>
                  <strong>145.000đ/kg</strong>
                </div>
                <div className="sidebar-agri-item">
                  <span>Sắn lát khô</span>
                  <strong>4.200đ/kg</strong>
                </div>
              </div>
              <button className="sidebar-agri-btn" onClick={() => navigate('/gia-nong-san')}>
                Xem đầy đủ →
              </button>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
}