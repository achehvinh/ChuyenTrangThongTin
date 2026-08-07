import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import Footer from './Footer';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

// Danh mục Filter Chips kiểu YouTube
const YOUTUBE_CHIPS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'TUYEN_TRUYEN', label: '📢 Tuyên truyền xã' },
  { id: 'BHYT', label: '🏥 Bảo hiểm Y tế' },
  { id: 'TTHC', label: '🏛️ Thủ tục hành chính' },
  { id: 'TRUONG_THON', label: '🗳️ 10 Thôn & Trưởng thôn' },
  { id: 'NONG_NGHIEP', label: '🌾 Kinh tế & Nông nghiệp' },
  { id: 'DUOI_NUOC', label: '🏊 An toàn nguồn nước' },
  { id: 'KHAN_CAP', label: '🚨 Cảnh báo khẩn cấp' }
];

// Danh sách YouTube Shorts / Tin ngắn nổi bật mẫu
const YOUTUBE_SHORTS = [
  {
    id: 'short-1',
    tieu_de: 'Hướng dẫn đổi thẻ BHYT trên VNeID Mức 2 trong 1 phút',
    luot_xem: '2.4K',
    anh_dai_dien: '/huong-dan/suckhoe_step1.jpg',
    tag: 'BHYT'
  },
  {
    id: 'short-2',
    tieu_de: '10 Trưởng thôn xã Đăk Pxi nhiệm kỳ 2025 - 2030 chính thức',
    luot_xem: '5.1K',
    anh_dai_dien: '/dak_pxi_cultural_card.png',
    tag: 'BẦU CỬ'
  },
  {
    id: 'short-3',
    tieu_de: 'Quy trình nộp hồ sơ Khai sinh trực tuyến tại nhà',
    luot_xem: '1.8K',
    anh_dai_dien: '/huong-dan/suckhoe_step2.jpg',
    tag: 'DỊCH VỤ CÔNG'
  },
  {
    id: 'short-4',
    tieu_de: 'Thi trắc nghiệm cấp Chứng nhận Hiệp sĩ An toàn Nguồn nước',
    luot_xem: '3.9K',
    anh_dai_dien: '/anhnen1.png',
    tag: 'ĐUỐI NƯỚC'
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [activeChip, setActiveChip] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 24, page: 1 } })
      .then(r => {
        const items = r.data.data || r.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setArticles(items);
        }
      })
      .catch(err => console.error("Lỗi tải bài viết trang chủ:", err))
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (img) => {
    if (!img) return '/huong-dan/hinhnen1.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `/${img}`;
  };

  // Lọc bài viết theo Filter Chip
  const filteredArticles = activeChip === 'ALL' 
    ? articles 
    : articles.filter(art => {
        const cat = (art.danh_muc || '').toUpperCase();
        if (activeChip === 'BHYT') return cat.includes('BHYT') || cat.includes('BAO_HIEM');
        if (activeChip === 'TTHC') return cat.includes('TTHC') || cat.includes('HANH_CHINH');
        if (activeChip === 'TRUONG_THON') return cat.includes('BAU_CU') || cat.includes('THON');
        if (activeChip === 'NONG_NGHIEP') return cat.includes('NONG_NGHIEP') || cat.includes('KINH_TE');
        if (activeChip === 'KHAN_CAP') return cat.includes('KHAN_CAP') || cat.includes('CANH_BAO');
        return true;
      });

  const featuredSpotlight = articles.length > 0 ? articles[0] : null;
  const feedList = articles.length > 0 ? (filteredArticles.length > 0 ? filteredArticles : articles) : [];

  return (
    <main className="yt-home-wrapper">
      
      {/* ════════════════════════════════════════════════════════════════
         1. THANH LỌC THỂ LOẠI KIỂU YOUTUBE (YOUTUBE FILTER CHIPS BAR)
         ════════════════════════════════════════════════════════════════ */}
      <nav className="yt-chips-bar" aria-label="Danh mục nội dung YouTube">
        <div className="yt-chips-container">
          {YOUTUBE_CHIPS.map(chip => (
            <button
              key={chip.id}
              type="button"
              className={`yt-chip-btn ${activeChip === chip.id ? 'active' : ''}`}
              onClick={() => setActiveChip(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="yt-home-container">

        {/* ════════════════════════════════════════════════════════════════
           2. SPOTLIGHT HERO BANNER PHONG CÁCH YOUTUBE FEATURED CINEMA
           ════════════════════════════════════════════════════════════════ */}
        <header className="yt-featured-hero">
          <div className="yt-hero-card">
            <div className="yt-hero-media">
              {featuredSpotlight?.video ? (
                <video 
                  src={featuredSpotlight.video} 
                  poster={getImageUrl(featuredSpotlight.anh_dai_dien)}
                  controls
                  className="yt-hero-video"
                />
              ) : (
                <img 
                  src={getImageUrl(featuredSpotlight?.anh_dai_dien || '/huong-dan/hinhnen1.jpg')} 
                  alt="Spotlight"
                  className="yt-hero-img" 
                />
              )}
              <span className="yt-badge-live">🔴 TIÊU ĐIỂM XÃ ĐĂK PXI</span>
            </div>

            <div className="yt-hero-info">
              <span className="yt-hero-tag">ỦY BAN NHÂN DÂN XÃ ĐĂK PXI • NĂM 2026</span>
              <h1 className="yt-hero-title">
                {featuredSpotlight?.tieu_de || 'UBND Xã Đăk Pxi hướng dẫn thực hiện chỉ tiêu An sinh Xã hội & Bảo hiểm Y tế toàn dân'}
              </h1>
              <p className="yt-hero-desc">
                {featuredSpotlight?.mo_ta || 'Kênh thông tin trực tuyến tuyên truyền dịch vụ công, bảo hiểm y tế, 10 thôn buôn làng và hướng dẫn thủ tục hành chính công cho công dân xã Đăk Pxi.'}
              </p>
              
              <div className="yt-hero-actions">
                <button 
                  type="button" 
                  className="yt-btn-play"
                  onClick={() => navigate(featuredSpotlight ? `/tin-tuc/${featuredSpotlight._id}` : '/video')}
                >
                  ► Xem ngay bản tin
                </button>
                <button 
                  type="button" 
                  className="yt-btn-secondary"
                  onClick={() => navigate('/thu-tuc-hanh-chinh')}
                >
                  🏛️ Nộp hồ sơ TTHC
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════════════
           3. LƯỚI BÀI VIẾT & VIDEO YOUTUBE FEED GRID (4 CỘT CHUẨN YOUTUBE)
           ════════════════════════════════════════════════════════════════ */}
        <section className="yt-section-feed">
          <div className="yt-section-title-bar">
            <h2>🔥 Video & Bản tin Tuyên truyền Mới nhất</h2>
            <button 
              type="button" 
              className="yt-see-all-btn"
              onClick={() => navigate('/tin-tuc')}
            >
              Xem tất cả →
            </button>
          </div>

          <div className="yt-video-grid">
            {feedList.slice(0, 12).map((item, idx) => (
              <article 
                key={item._id || item.id || idx}
                className="yt-card-item"
                onClick={() => navigate(`/tin-tuc/${item._id || item.id}`)}
              >
                {/* Thumbnail Box */}
                <div className="yt-card-thumb-box">
                  <img 
                    src={getImageUrl(item.anh_dai_dien || item.image)} 
                    alt={item.tieu_de} 
                    className="yt-card-thumb-img"
                    onError={(e) => { e.target.src = '/huong-dan/hinhnen1.jpg'; }}
                  />
                  {item.video ? (
                    <span className="yt-duration-badge">🎥 VIDEO</span>
                  ) : (
                    <span className="yt-duration-badge">HD</span>
                  )}
                  <div className="yt-play-overlay">
                    <span className="yt-play-icon">▶</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="yt-card-details">
                  <div className="yt-card-avatar">
                    <span>🏛️</span>
                  </div>
                  <div className="yt-card-meta">
                    <h3 className="yt-card-title" title={item.tieu_de}>
                      {item.tieu_de}
                    </h3>
                    <span className="yt-card-channel">UBND Xã Đăk Pxi • Cổng Thông tin</span>
                    <div className="yt-card-stats">
                      <span>👁️ {item.luot_xem || (120 + idx * 45)} lượt xem</span>
                      <span>• {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Vừa cập nhật'}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
           4. YOUTUBE SHORTS SHELF (VIDEO NGẮN & TIN NỔI BẬT DẠNG DỌC)
           ════════════════════════════════════════════════════════════════ */}
        <section className="yt-shorts-shelf">
          <div className="yt-shorts-header">
            <div className="yt-shorts-title">
              <span className="shorts-icon">⚡</span>
              <h2>YouTube Shorts • Tin ngắn Nổi bật</h2>
            </div>
            <span className="shorts-sub">Video hướng dẫn nhanh cho bà con</span>
          </div>

          <div className="yt-shorts-grid">
            {YOUTUBE_SHORTS.map(short => (
              <article 
                key={short.id} 
                className="yt-short-card"
                onClick={() => navigate('/video')}
              >
                <div className="yt-short-thumb-wrapper">
                  <img src={short.anh_dai_dien} alt={short.tieu_de} className="yt-short-img" />
                  <span className="yt-short-tag">{short.tag}</span>
                  <div className="yt-short-overlay">
                    <span className="yt-short-play">▶</span>
                  </div>
                </div>
                <div className="yt-short-info">
                  <h3 className="yt-short-title">{short.tieu_de}</h3>
                  <span className="yt-short-views">👁️ {short.luot_xem} lượt xem</span>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
}