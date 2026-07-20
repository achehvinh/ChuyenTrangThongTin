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
  const [latestArticles, setLatestArticles] = useState([]); // Danh sách tin mới tổng hợp

  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 30, page: 1 } })
      .then(r => {
        const items = r.data.data || [];

        // 1. Lọc video nạp cho Video Hub bên phải
        const filteredVideos = items.filter(bv => bv.video && bv.video.trim() !== '');
        setVideoList(filteredVideos);
        if (filteredVideos.length > 0) {
          setActiveVideo(filteredVideos[0]);
        }

        // 2. Tải bài viết tin tức (tất cả bài viết)
        setLatestArticles(items);
      })
      .catch(err => console.error("Lỗi tải tin tức trang chủ:", err));
  }, []);

  const featuredArticle = latestArticles[0];
  const timelineArticles = latestArticles.slice(1, 6);

  return (
    <div className="home">

      {/* ── PHÂN KHU TIN MỚI 3 CỘT (THEO ẢNH MẪU CỦA USER) ── */}
      {latestArticles.length > 0 && (
        <section className="home-news-hub">
          <div className="news-hub-header">
            <div className="news-hub-header-left">
              <span>TIN MỚI</span>
            </div>

            <div className="news-hub-header-marquee">
              <marquee
                behavior="scroll"
                direction="left"
                scrollamount="5"
                onMouseOver={(e) => e.currentTarget.stop()}
                onMouseOut={(e) => e.currentTarget.start()}
              >
                {latestArticles
                  .slice(0, 6)
                  .map((bv, idx, arr) => {
                    const txt = bv.chu_chay && bv.chu_chay.trim() !== '' ? bv.chu_chay : bv.tieu_de;
                    return (
                      <span key={bv._id} className="home-marquee-item">
                        <span
                          className="home-marquee-link"
                          onClick={() => window.open(`/tin-tuc/${bv._id}`, '_blank')}
                        >
                          {txt}
                        </span>
                        {idx < arr.length - 1 && <span className="home-marquee-sep"> &nbsp; &nbsp; &nbsp; &nbsp; · &nbsp; &nbsp; &nbsp; &nbsp; </span>}
                      </span>
                    );
                  })
                }
              </marquee>
            </div>
          </div>

          <div className="news-hub-grid">
            {/* 1. CỘT TRÁI: BÀI VIẾT NỔI BẬT LỚN */}
            <div className="news-hub-featured-column">
              {featuredArticle && (
                <div
                  className="featured-article-card"
                  onClick={() => window.open(`/tin-tuc/${featuredArticle._id}`, '_blank')}
                >
                  <div className="featured-article-img-wrap">
                    {featuredArticle.anh_dai_dien ? (
                      <img src={featuredArticle.anh_dai_dien} alt={featuredArticle.tieu_de} />
                    ) : (
                      <div className="featured-article-img-placeholder">📰</div>
                    )}
                  </div>
                  <h3 className="featured-article-title">
                    {featuredArticle.tieu_de}
                  </h3>
                </div>
              )}
            </div>

            {/* 2. CỘT GIỮA: DÒNG THỜI GIAN TIN TỨC (TIMELINE) */}
            <div className="news-hub-timeline-column">
              <div className="timeline-line"></div>
              <div className="timeline-items-list">
                {timelineArticles.map(bv => {
                  const dateObj = new Date(bv.createdAt);
                  const day = String(dateObj.getDate()).padStart(2, '0');
                  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                  return (
                    <div
                      key={bv._id}
                      className="timeline-item"
                      onClick={() => window.open(`/tin-tuc/${bv._id}`, '_blank')}
                    >
                      <div className="timeline-dot-wrapper">
                        <div className="timeline-dot"></div>
                      </div>
                      <div className="timeline-date-block">
                        <span className="timeline-day">{day}</span>
                        <span className="timeline-month">Tháng {month}</span>
                      </div>
                      <div className="timeline-title-block">
                        <p className="timeline-article-title">{bv.tieu_de}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. CỘT PHẢI: VIDEO & PHÁT THANH */}
            <div className="news-hub-video-column">
              {activeVideo ? (
                <div className="video-hub-player-wrapper">
                  <video
                    key={activeVideo._id}
                    src={activeVideo.video}
                    poster={activeVideo.anh_dai_dien || ''}
                    controls
                    className="video-hub-media"
                  />
                </div>
              ) : (
                <div className="video-hub-player-wrapper-empty">
                  🎥 Chưa có video phát thanh
                </div>
              )}

              <div className="video-hub-playlist">
                {videoList.slice(0, 3).map(v => (
                  <div
                    key={v._id}
                    className={`video-hub-playlist-item ${v._id === activeVideo?._id ? 'active' : ''}`}
                    onClick={() => setActiveVideo(v)}
                    title={v.tieu_de}
                  >
                    <div className="video-hub-playlist-thumb">
                      {v.anh_dai_dien ? (
                        <img src={v.anh_dai_dien} alt={v.tieu_de} />
                      ) : (
                        <div className="video-hub-playlist-thumb-empty">🎥</div>
                      )}
                      <div className="video-hub-playlist-thumb-overlay">▶</div>
                    </div>
                    <div className="video-hub-playlist-info">
                      <p className="video-hub-playlist-title">{v.tieu_de}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="video-hub-see-all-wrapper">
                <span className="video-hub-see-all-link" onClick={() => navigate('/video')}>
                  Xem tất cả video →
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── KHU VỰC CHỌN NHANH: Tuyên truyền / Hỗ trợ dịch vụ công ── */}
      <section className="home-choice">
        <h2 className="home-choice-title">
          Chào mừng bà con đến với Trang thông tin điện tử Phòng Văn hóa - Xã hội xã Đăk Pxi!<br />
          Bà con cần hỗ trợ về thông tin hay nội dung tuyên truyền nào?
        </h2>
        <div className="home-choice-grid">
          <button
            type="button"
            className="home-choice-card home-choice-card--tuyentruyen"
            onClick={() => navigate('/chuyen-muc')}
          >
            <div className="home-choice-card-header">
              <span className="home-choice-icon">📢</span>
              <span className="home-choice-tag">Tin tức & Pháp luật</span>
            </div>
            <span className="home-choice-name">Tuyên truyền</span>
            <span className="home-choice-desc">
              Tin tức, chủ trương, chính sách và tuyên truyền pháp luật của xã Đăk Pxi.
            </span>
            <div className="home-choice-cta-wrap">
              <span className="home-choice-cta">Xem ngay <span className="arrow">→</span></span>
            </div>
          </button>

          <button
            type="button"
            className="home-choice-card home-choice-card--dichvucong"
            onClick={() => navigate('/thu-tuc-hanh-chinh')}
          >
            <div className="home-choice-card-header">
              <span className="home-choice-icon">🧾</span>
              <span className="home-choice-tag">Thủ tục trực tuyến</span>
            </div>
            <span className="home-choice-name">Hỗ trợ dịch vụ công</span>
            <span className="home-choice-desc">
              Tra cứu, chuẩn bị hồ sơ và thực hiện thủ tục hành chính trực tuyến.
            </span>
            <div className="home-choice-cta-wrap">
              <span className="home-choice-cta">Xem ngay <span className="arrow">→</span></span>
            </div>
          </button>

          <button
            type="button"
            className="home-choice-card home-choice-card--tracuu"
            onClick={() => navigate('/tra-cuu')}
          >
            <div className="home-choice-card-header">
              <span className="home-choice-icon">🔍</span>
              <span className="home-choice-tag">BHYT · BHXH · VNeID</span>
            </div>
            <span className="home-choice-name">Hướng dẫn Tra cứu</span>
            <span className="home-choice-desc">
              Hướng dẫn tra cứu BHYT, BHXH và các thông tin cần thiết khác.
            </span>
            <div className="home-choice-cta-wrap">
              <span className="home-choice-cta">Xem ngay <span className="arrow">→</span></span>
            </div>
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