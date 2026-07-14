import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import './HomeChoice.css';
import ChuyenTrangThongTin from './ChuyenTrangThongTin';

export default function HomePage() {
  const navigate = useNavigate();
  const [showTraCuu, setShowTraCuu] = useState(false);

  return (
    <div className="home">

      {/* ── KHU VỰC CHỌN NHANH: Tuyên truyền / Hỗ trợ dịch vụ công ── */}
      <section className="home-choice">
        <h2 className="home-choice-title">Bà con muốn hỗ trợ gì?</h2>
        <div className="home-choice-grid">
          <button
            type="button"
            className="home-choice-card home-choice-card--tuyentruyen"
            onClick={() => navigate('/chuyen-muc')}
          >
            <span className="home-choice-icon">📢</span>
            <span className="home-choice-name">Tuyên truyền</span>
            <span className="home-choice-desc">
              Tin tức, chủ trương, chính sách và tuyên truyền pháp luật của xã Đăk Pxi.
            </span>
            <span className="home-choice-cta">Xem ngay →</span>
          </button>

          <button
            type="button"
            className="home-choice-card home-choice-card--dichvucong"
            onClick={() => navigate('/thu-tuc-hanh-chinh')}
          >
            <span className="home-choice-icon">🧾</span>
            <span className="home-choice-name">Hỗ trợ dịch vụ công</span>
            <span className="home-choice-desc">
              Tra cứu, chuẩn bị hồ sơ và thực hiện thủ tục hành chính trực tuyến.
            </span>
            <span className="home-choice-cta">Xem ngay →</span>
          </button>

          <button
            type="button"
            className="home-choice-card home-choice-card--tracuu"
            onClick={() => navigate('/tra-cuu')}
          >
            <span className="home-choice-icon">🔍</span>
            <span className="home-choice-name">Hướng dẫn Tra cứu</span>
            <span className="home-choice-desc">
              Hướng dẫn tra cứu BHYT, BHXH và các thông tin cần thiết khác.
            </span>
            <span className="home-choice-cta">Xem ngay →</span>
          </button>
        </div>
      </section>

      {/* ── Layout 2 cột ── */}
      <div className="home-body">

        {/* CỘT TRÁI — Bài viết */}
        <main className="home-main">
          <div className="section-header">
            <h2>Chuyên trang thông tin Đăk Pxi</h2>
          </div>
          <ChuyenTrangThongTin showHeader={false} />
        </main>

        {/* CỘT PHẢI — Sidebar */}
        <aside className="home-sidebar">

          {/* Tiện ích dịch vụ */}
          <div className="sidebar-box">
            <div className="sidebar-box-title">Tiện ích dịch vụ</div>
            <ul className="sidebar-list">
              <li onClick={() => navigate('/thu-tuc-hanh-chinh')}>Thủ tục hành chính</li>
              <li onClick={() => navigate('/huong-dan-vneid')}>Hướng dẫn VNeID</li>

              {/* Dropdown tra cứu */}
              <li
                className={`sidebar-list-dropdown${showTraCuu ? ' open' : ''}`}
                onMouseEnter={() => setShowTraCuu(true)}
                onMouseLeave={() => setShowTraCuu(false)}
              >
                <span>
                  Hướng dẫn tra cứu
                  <span className="dropdown-arrow">{showTraCuu ? ' ▴' : ' ▾'}</span>
                </span>
                {showTraCuu && (
                  <ul className="sidebar-submenu">
                    <li onClick={() => navigate('/tra-cuu')}>Tra cứu BHYT</li>
                    <li onClick={() => navigate('/huong-dan-bhxh')}>Tra cứu BHXH</li>
                  </ul>
                )}
              </li>

              <li onClick={() => navigate('/phap-luat')}>Góc pháp luật</li>
              <li onClick={() => navigate('/chuyen-muc')}>Tuyên truyền</li>
            </ul>
          </div>

          {/* Giá nông sản */}
          <div className="sidebar-box">
            <div className="sidebar-box-title">Giá nông sản</div>
            <table className="agri-table">
              <tbody>
                <tr><td>Cà phê nhân</td><td>125.000đ/kg</td></tr>
                <tr><td>Hồ tiêu</td><td>145.000đ/kg</td></tr>
                <tr><td>Sắn lát khô</td><td>4.200đ/kg</td></tr>
              </tbody>
            </table>
            <button className="sidebar-link-btn" onClick={() => navigate('/gia-nong-san')}>
              Xem đầy đủ →
            </button>
          </div>

          {/* Liên hệ */}
          <div className="sidebar-box">
            <div className="sidebar-box-title">Liên hệ UBND xã</div>
            <div className="contact-info">
              <p>📞 <strong>0339.310.915</strong></p>
              <p>🕐 Thứ 2 – Thứ 6</p>
              <p>7:30–11:30 và 13:30–17:00</p>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}