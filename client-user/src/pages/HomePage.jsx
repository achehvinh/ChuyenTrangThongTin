import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import Footer from './Footer';
import {
  FileText, Calendar, Bell, MessageSquare, BookOpen, Monitor,
  Users, Home as HomeIcon, UserCheck, Award, Eye, ArrowRight,
  Vote, GraduationCap, ShieldCheck, LayoutGrid, Scale
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

// Sample articles matching exact picture titles & data
const DEFAULT_HERO_SLIDES = [
  {
    id: 'hero-1',
    tieu_de: 'UBND XÃ ĐĂK PXI HƯỚNG DẪN THỰC HIỆN CHỈ TIÊU “GIA ĐÌNH THỂ THAO” GIAI ĐOẠN 2026 – 2030 (ẢNH TƯ LIỆU)',
    anh_dai_dien: '/huong-dan/hinhnen1.jpg',
    tag: 'TIÊU ĐIỂM'
  },
  {
    id: 'hero-2',
    tieu_de: 'ĐĂK PXI: ĐOÀN ĐBQH TỈNH GIÁM SÁT CÔNG TÁC BẢO TỒN VÀ PHÁT HUY BẢN SẮC VĂN HÓA ĐỒNG BÀO XƠ ĐĂNG',
    anh_dai_dien: '/dak_pxi_cultural_card.png',
    tag: 'TIÊU ĐIỂM'
  },
  {
    id: 'hero-3',
    tieu_de: 'HỘI NGHỊ TƯ VẤN HƯỚNG NGHIỆP, TUYỂN SINH VÀ BỐ TRÍ VIỆC LÀM CHO THANH NIÊN XÃ ĐĂK PXI NĂM 2026',
    anh_dai_dien: '/anhnen1.png',
    tag: 'TIÊU ĐIỂM'
  }
];

const DEFAULT_LATEST_NEWS = [
  {
    id: 'news-1',
    day: '20',
    monthYear: '07/2025',
    tieu_de: 'XÃ ĐĂK PXI TỔ CHỨC THÀNH CÔNG BẦU CỬ TRƯỞNG THÔN NHIỆM KỲ 2025 – 2030',
    iconType: 'vote',
    link: '/bau-cu'
  },
  {
    id: 'news-2',
    day: '17',
    monthYear: '07/2025',
    tieu_de: 'ĐĂK PXI: ĐOÀN ĐBQH TỈNH GIÁM SÁT CÔNG TÁC BẢO TỒN VÀ PHÁT HUY BẢN SẮC VĂN HÓA ĐỒNG BÀO...',
    iconType: 'culture',
    link: '/tin-tuc'
  },
  {
    id: 'news-3',
    day: '16',
    monthYear: '07/2025',
    tieu_de: 'CẨM NANG BẦU CỬ TRƯỞNG THÔN ĐĂK PXI (2025–2030)',
    iconType: 'document',
    link: '/phap-luat'
  },
  {
    id: 'news-4',
    day: '13',
    monthYear: '07/2025',
    tieu_de: 'HỘI NGHỊ TƯ VẤN HƯỚNG NGHIỆP, TUYỂN SINH VÀ BỐ TRÍ VIỆC LÀM NĂM 2026',
    iconType: 'career',
    link: '/tin-tuc'
  },
  {
    id: 'news-5',
    day: '13',
    monthYear: '07/2025',
    tieu_de: 'CHÀO MỪNG KỶ NIỆM 80 NĂM NGÀY TRUYỀN THỐNG LỰC LƯỢNG AN NINH NHÂN DÂN',
    iconType: 'shield',
    link: '/tin-tuc'
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 20, page: 1 } })
      .then(r => {
        const items = r.data.data || r.data || [];
        if (Array.isArray(items) && items.length > 0) {
          setArticles(items);
        }
      })
      .catch(err => console.error("Lỗi tải bài viết trang chủ:", err));
  }, []);

  const getImageUrl = (img) => {
    if (!img) return '/huong-dan/hinhnen1.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/')) return img;
    return `/${img}`;
  };

  // Build dynamic hero slides from newly published articles if available
  const heroSlides = articles.length > 0
    ? articles.slice(0, 5).map((art, idx) => ({
      id: art._id || art.id || `hero-${idx}`,
      tieu_de: art.tieu_de || art.title,
      anh_dai_dien: getImageUrl(art.anh_dai_dien || art.image || art.thumbnail),
      tag: art.danh_muc ? String(art.danh_muc).toUpperCase() : 'TIÊU ĐIỂM',
      link: `/tin-tuc/${art._id || art.id}`
    }))
    : DEFAULT_HERO_SLIDES;

  // Build dynamic latest news items from API articles
  const latestNews = articles.length > 0
    ? articles.slice(0, 5).map((art, idx) => {
      const dateObj = new Date(art.created_at || art.createdAt || art.ngay_dang || Date.now());
      const day = String(dateObj.getDate()).padStart(2, '0');
      const monthYear = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
      const iconTypes = ['vote', 'culture', 'document', 'career', 'shield'];
      return {
        id: art._id || art.id || `news-${idx}`,
        day,
        monthYear,
        tieu_de: art.tieu_de || art.title,
        iconType: iconTypes[idx % iconTypes.length],
        link: `/tin-tuc/${art._id || art.id}`
      };
    })
    : DEFAULT_LATEST_NEWS;

  // Auto rotate hero slide every 5 seconds
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentHero = heroSlides[heroIndex] || heroSlides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <div className="homepage-redesign">
      <div className="homepage-container">

        {/* ════════════════════════════════════════════════════════════════
           TOP SECTION: 3-COLUMN LAYOUT (HERO SLIDER | TIN MỚI | TRUY CẬP NHANH)
           ════════════════════════════════════════════════════════════════ */}
        <section className="top-grid-section">

          {/* CỘT 1: HERO FEATURED SLIDER ("TIÊU ĐIỂM") */}
          <div className="hero-featured-col">
            <div className="hero-card-frame">

              {/* IMAGE PREVIEW */}
              <div className="hero-img-wrapper">
                <img
                  src={currentHero.anh_dai_dien}
                  alt={currentHero.tieu_de}
                  className="hero-main-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/huong-dan/hinhnen1.jpg';
                  }}
                />
              </div>

              {/* OVERLAY CAPTION CARD */}
              <div className="hero-caption-card">
                <span className="hero-badge">{currentHero.tag || 'TIÊU ĐIỂM'}</span>
                <div className="hero-caption-body">
                  <h2 className="hero-title">{currentHero.tieu_de}</h2>
                  <button
                    type="button"
                    className="hero-arrow-btn"
                    onClick={() => navigate(currentHero.link || '/tin-tuc')}
                    title="Xem chi tiết"
                  >
                    <ArrowRight size={18} color="#954617" />
                  </button>
                </div>

                {/* DOTS PAGINATION */}
                <div className="hero-dots-bar">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`hero-dot ${idx === heroIndex ? 'hero-dot--active' : ''}`}
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Chuyển đến slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* CỘT 2: TIN MỚI NHẤT */}
          <div className="latest-news-col">
            <div className="latest-news-card">

              {/* RIBBON HEADER */}
              <div className="news-ribbon-header">
                <div className="ribbon-title">
                  <span className="ribbon-star">✴</span>
                  <span>TIN MỚI NHẤT</span>
                </div>
                <button
                  type="button"
                  className="news-see-all-link"
                  onClick={() => navigate('/tin-tuc')}
                >
                  Xem tất cả →
                </button>
              </div>

              {/* NEWS ITEMS LIST */}
              <div className="news-items-list">
                {latestNews.map((item) => (
                  <div
                    key={item.id}
                    className="news-row-item"
                    onClick={() => navigate(item.link)}
                  >
                    {/* DATE BADGE */}
                    <div className="news-date-badge">
                      <span className="news-date-day">{item.day}</span>
                      <span className="news-date-my">{item.monthYear}</span>
                    </div>

                    {/* TITLE */}
                    <div className="news-title-content">
                      <p className="news-title-text">{item.tieu_de}</p>
                    </div>

                    {/* CATEGORY ICON */}
                    <div className="news-category-icon-wrap">
                      {item.iconType === 'vote' && <Vote size={19} color="#2e7d32" />}
                      {item.iconType === 'culture' && <Users size={19} color="#2e7d32" />}
                      {item.iconType === 'document' && <FileText size={19} color="#2e7d32" />}
                      {item.iconType === 'career' && <GraduationCap size={19} color="#2e7d32" />}
                      {item.iconType === 'shield' && <ShieldCheck size={19} color="#2e7d32" />}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* CỘT 3: TRUY CẬP NHANH & CULTURAL CARD */}
          <div className="quick-access-col">

            {/* QUICK ACCESS GRID */}
            <div className="quick-access-card">
              <div className="quick-access-header">
                <span className="qa-diamond">✦</span>
                <h3 className="qa-title">TRUY CẬP NHANH</h3>
                <span className="qa-diamond">✦</span>
              </div>

              <div className="quick-access-grid">

                {/* TILE 1: DỊCH VỤ CÔNG */}
                <button
                  type="button"
                  className="qa-tile qa-tile--green"
                  onClick={() => navigate('/thu-tuc-hanh-chinh')}
                >
                  <div className="qa-tile-icon-box green">
                    <Monitor size={22} color="#00897b" />
                  </div>
                  <span className="qa-tile-label">Dịch vụ công</span>
                </button>

                {/* TILE 2: GÓC PHÁP LUẬT */}
                <button
                  type="button"
                  className="qa-tile qa-tile--blue"
                  onClick={() => navigate('/phap-luat')}
                >
                  <div className="qa-tile-icon-box blue">
                    <Scale size={22} color="#1e88e5" />
                  </div>
                  <span className="qa-tile-label">Góc pháp luật</span>
                </button>

                {/* TILE 3: HƯỚNG DẪN TRA CỨU BHYT */}
                <button
                  type="button"
                  className="qa-tile qa-tile--orange"
                  onClick={() => navigate('/huong-dan-bhxh')}
                >
                  <div className="qa-tile-icon-box orange">
                    <ShieldCheck size={22} color="#f57c00" />
                  </div>
                  <span className="qa-tile-label">Hướng dẫn tra cứu BHYT</span>
                </button>

                {/* TILE 4: THÔNG BÁO */}
                <button
                  type="button"
                  className="qa-tile qa-tile--red"
                  onClick={() => navigate('/thong-bao')}
                >
                  <div className="qa-tile-icon-box red">
                    <Bell size={22} color="#e53935" />
                  </div>
                  <span className="qa-tile-label">Thông báo</span>
                </button>

                {/* TILE 5: HỎI ĐÁP - GÓP Ý */}
                <button
                  type="button"
                  className="qa-tile qa-tile--purple"
                  onClick={() => navigate('/lien-he')}
                >
                  <div className="qa-tile-icon-box purple">
                    <MessageSquare size={22} color="#8e24aa" />
                  </div>
                  <span className="qa-tile-label">Hỏi đáp – Góp ý</span>
                </button>

                {/* TILE 6: TẤT CẢ CHUYÊN MỤC */}
                <button
                  type="button"
                  className="qa-tile qa-tile--teal"
                  onClick={() => navigate('/chuyen-muc')}
                >
                  <div className="qa-tile-icon-box teal">
                    <LayoutGrid size={22} color="#00796b" />
                  </div>
                  <span className="qa-tile-label">Tất cả chuyên mục</span>
                </button>

              </div>
            </div>

            {/* CULTURAL PHOTO CARD */}
            <div className="cultural-banner-card">
              <div className="cultural-img-wrap">
                <img
                  src="/huong-dan/dan-toc-xo-dang.jpg"
                  alt="Văn hóa đồng bào Xơ Đăng xã Đăk Pxi"
                  className="cultural-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/huong-dan/hinh-nen05.jpg';
                  }}
                />
              </div>
              <div className="cultural-text-box">
                <p className="cultural-slogan-line1">Gần dân – Hiểu dân – Vì dân</p>
                <p className="cultural-slogan-line2">Chung tay xây dựng Đăk Pxi phát triển!</p>
              </div>
            </div>

          </div>

        </section>

        {/* ════════════════════════════════════════════════════════════════
           MIDDLE SECTION: RUNNING ETHNIC SLOGAN BANNER BAR
           ════════════════════════════════════════════════════════════════ */}
        <section className="ethnic-slogan-banner">
          <div className="ethnic-slogan-inner">
            <span className="ethnic-symbol">❖</span>
            <span className="slogan-text">
              ĐOÀN KẾT – GIỮ GÌN BẢN SẮC – PHÁT TRIỂN BỀN VỮNG
            </span>
            <span className="ethnic-symbol">❖</span>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}