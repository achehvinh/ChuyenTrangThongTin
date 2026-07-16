import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import './HomeChoice.css';
import ChuyenTrangThongTin from './ChuyenTrangThongTin';
import Footer from './Footer';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

export default function HomePage() {
  const navigate = useNavigate();
  const [showTraCuu, setShowTraCuu] = useState(false);
  const [videoList, setVideoList] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [newReleases, setNewReleases] = useState([]); // 🆕 Danh sách tin mới nổi bật trong 24h qua

  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 20, page: 1 } })
      .then(r => {
        const items = r.data.data || [];

        // 1. Lọc video nạp cho Video Hub
        const filtered = items.filter(bv => bv.video && bv.video.trim() !== '');
        setVideoList(filtered);
        if (filtered.length > 0) {
          setActiveVideo(filtered[0]);
        }

        // 2. Lọc các bài viết / video đăng trong vòng 24 giờ qua
        const now = new Date();
        const freshItems = items.filter(bv => {
          const createdAt = new Date(bv.createdAt);
          const diffMs = now - createdAt;
          const diffHours = diffMs / (1000 * 60 * 60);
          return diffHours <= 24; // chưa đủ 24 tiếng
        });
        setNewReleases(freshItems);
      })
      .catch(err => console.error("Lỗi tải tin tức trang chủ:", err));
  }, []);

  return (
    <div className="home">

      {/* ── BẢN TIN NỔI BẬT KHẨN CẤP / MỚI ĐĂNG TRONG 24H ── */}
      {newReleases.length > 0 && (
        <section className="home-urgent-banner">
          {/* Dòng chữ chạy (Marquee) thông báo tin mới chưa quá 24h */}
          <div className="urgent-marquee-bar">
            <span className="urgent-marquee-label">🔥 TIN NÓNG 24H:</span>
            <div className="urgent-marquee-track">
              <span className="urgent-marquee-text" dangerouslySetInnerHTML={{
                __html: newReleases.map(bv => {
                  const time = new Date(bv.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  const date = new Date(bv.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                  const typeLabel = (bv.video && bv.video.trim() !== '') ? 'Xem video mới' : 'Xem bài viết mới';
                  return `[Đăng lúc ${time} ${date}] ${bv.tieu_de.toUpperCase()} (${typeLabel}) &nbsp;&nbsp;&nbsp;&nbsp;`;
                }).join(' &nbsp;&nbsp;·&nbsp;&nbsp; ')
              }} />
            </div>
          </div>

          {/* Grid các thẻ bài viết/video mới nổi bật */}
          <div className="urgent-grid-box">
            <div className="urgent-header-row">
              <h4>🆕 TIN MỚI CẬP NHẬT TRONG NGÀY</h4>
              <span className="urgent-timer-desc">Nội dung này sẽ tự động dừng nổi bật sau 24 giờ kể từ khi đăng</span>
            </div>

            <div className="urgent-cards-container">
              {newReleases.map(bv => {
                const isVideo = bv.video && bv.video.trim() !== '';
                const timeStr = new Date(bv.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={bv._id}
                    className={`urgent-card-item ${isVideo ? 'urgent-card--video' : 'urgent-card--article'}`}
                    onClick={() => {
                      if (isVideo) {
                        navigate('/video', { state: { activeVideoId: bv._id } });
                      } else {
                        window.open(`/tin-tuc/${bv._id}`, '_blank');
                      }
                    }}
                  >
                    <div className="urgent-card-badge">
                      <span className="badge-pulse">🔴</span>
                      MỚI ĐĂNG ({timeStr})
                    </div>

                    <div className="urgent-card-thumb-wrap">
                      {bv.anh_dai_dien ? (
                        <img src={bv.anh_dai_dien} alt="" />
                      ) : (
                        <div className="urgent-card-thumb-empty">{isVideo ? '🎥 Video' : '📝 Tin tức'}</div>
                      )}
                      {isVideo && <div className="urgent-play-overlay-icon">▶</div>}
                    </div>

                    <div className="urgent-card-info">
                      <span className="urgent-card-category-label">
                        {isVideo ? '🎥 Video tuyên truyền' : '📝 Bài viết mới'}
                      </span>
                      <h5 className="urgent-card-title">{bv.tieu_de}</h5>
                      <span className="urgent-card-click-cta">Nhấn vào đây để xem chi tiết →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── KHU VỰC CHỌN NHANH: Tuyên truyền / Hỗ trợ dịch vụ công ── */}
      <section className="home-choice">
        <h2 className="home-choice-title">
          Chào mừng bà con đến với Trang Tuyên truyền & Hỗ trợ Dịch vụ Công xã Đăk Pxi!<br />
          Bà con muốn hỗ trợ gì?
        </h2>
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

      <Footer />

    </div>
  );
}