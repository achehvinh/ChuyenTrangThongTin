import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ChuyenDoiSoPage.css";

// ── BỘ ICON VECTOR SVG CHUẨN HTML5 ──
const SvgIcons = {
  Search: ({ className = "" }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Globe: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Newspaper: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8z" />
    </svg>
  ),
  Atom: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.4-2.4 2.4-6.3 0-8.7L13 4.3c-2.4-2.4-6.3-2.4-8.7 0s-2.4 6.3 0 8.7l7.2 7.2c2.4 2.4 6.3 2.4 8.7 0z" />
      <path d="M3.8 20.2c-2.4-2.4-2.4-6.3 0-8.7L11 4.3c2.4-2.4 6.3-2.4 8.7 0s2.4 6.3 0 8.7l-7.2 7.2c-2.4 2.4-6.3 2.4-8.7 0z" />
    </svg>
  ),
  Bot: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="12" x="3" y="8" rx="2" />
      <path d="M12 2v6" />
      <circle cx="8" cy="14" r="1.5" />
      <circle cx="16" cy="14" r="1.5" />
    </svg>
  ),
  Smartphone: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  FileText: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Radio: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.83a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
};

// ── DANH MỤC CÁC CHUYÊN MỤC CHÍNH ──
const CATEGORIES = [
  { id: "all", name: "Tất cả bài viết", icon: null },
  { id: "quoc-gia", name: "Chuyển đổi số Quốc gia", icon: SvgIcons.Globe },
  { id: "quang-ngai", name: "Tỉnh Quảng Ngãi", icon: SvgIcons.Newspaper },
  { id: "dak-pxi", name: "Xã Đăk Pxi", icon: SvgIcons.Atom },
  { id: "ai-cong-nghe", name: "AI & Công nghệ mới", icon: SvgIcons.Bot },
  { id: "huong-dan-app", name: "Hướng dẫn App số", icon: SvgIcons.Smartphone },
  { id: "van-ban-tai-lieu", name: "Văn bản & Video", icon: SvgIcons.FileText },
];

// ── DỮ LIỆU BÀI VIẾT MẪU NỔI BẬT KHỚP Y HỆT ẢNH MẪU ──
const MOCK_NEWS = [
  {
    id: 1,
    category_id: "quoc-gia",
    category_name: "Chuyển đổi số Quốc gia",
    title: "Chính phủ đẩy mạnh triển khai Đề án 06 và Phát triển Kinh tế số năm 2026",
    summary: "Thủ tướng Chính phủ yêu cầu 100% dịch vụ công thiết yếu được tích hợp trên Cổng Dịch vụ công Quốc gia và ứng dụng VNeID.",
    image: "https://baochinhphu.vn/Uploaded/hoangchienthang/2023_02_25/chinh-phu-so.jpg",
    date: "24/07/2026",
    views: 1850,
    featured: true,
  },
  {
    id: 2,
    category_id: "quang-ngai",
    category_name: "Tỉnh Quảng Ngãi",
    title: "Quảng Ngãi xếp thứ hạng cao trong chỉ số Chuyển đổi số (DTI) cấp tỉnh",
    summary: "Ủy ban nhân dân tỉnh Quảng Ngãi ban hành kế hoạch mở rộng hạ tầng cáp quang và phủ sóng 5G tại 100% các xã miền núi.",
    image: "https://baoquangngai.vn/dataimages/202210/original/images2509172_cds_quang_ngai.jpg",
    date: "23/07/2026",
    views: 1420,
    featured: true,
  },
  {
    id: 3,
    category_id: "dak-pxi",
    category_name: "Xã Đăk Pxi",
    title: "Tổ Công nghệ số cộng đồng xã Đắc Pxi đi từng ngõ, gõ từng nhà: hướng dẫn VNeID mức 2",
    summary: "Đoàn thanh niên phối hợp công an xã Đăk Pxi đã hỗ trợ trực tiếp hơn 850 hộ dân kích hoạt thành công tài khoản định danh điện tử VNeID.",
    image: "https://baokontum.com.vn/uploads/images/2023/to-cong-nghe-so-cong-dong.jpg",
    date: "22/07/2026",
    views: 2310,
    featured: true,
  },
  {
    id: 4,
    category_id: "ai-cong-nghe",
    category_name: "AI & Công nghệ mới",
    title: "Ứng dụng Trợ lý Trí tuệ nhân tạo (AI) trong giải đáp dịch vụ công cho bà con nhân dân",
    summary: "Công nghệ AI tự nhiên giúp người dân hỏi đáp nhanh về hồ sơ khai sinh, đất đai, BHYT mọi lúc mọi nơi.",
    image: "https://vneconomy.vn/stores/news_dataimages/2023/052023/tri-tue-nhan-tao.jpg",
    date: "21/07/2026",
    views: 980,
  },
  {
    id: 5,
    category_id: "huong-dan-app",
    category_name: "Hướng dẫn App số",
    title: "Hướng dẫn tích hợp Thẻ Bảo hiểm y tế và Giấy phép lái xe vào ứng dụng VNeID",
    summary: "Bà con chỉ cần 3 bước đơn giản trên điện thoại thông minh để xuất trình thẻ BHYT số khi đi khám chữa bệnh.",
    image: "https://vcdn1-sohoa.vnecdn.net/2022/03/10/dscf4772jpg-1646901308-1646901-2295-6368-1646902052.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=jtLZcHEg6N212T6gTFd01Q",
    date: "20/07/2026",
    views: 3120,
  },
  {
    id: 6,
    category_id: "huong-dan-app",
    category_name: "Hướng dẫn App số",
    title: "Sử dụng ứng dụng VssID - BHXH Số để theo dõi quá trình đóng và hưởng bảo hiểm",
    summary: "Tra cứu sổ BHXH, lịch sử khám chữa bệnh BHYT và nhận thông báo thụ hưởng trực tiếp trên điện thoại.",
    image: "https://baohiemxahoi.gov.vn/images/Upload/2022/9/the-bhyt.jpg",
    date: "19/07/2026",
    views: 1640,
  },
  {
    id: 7,
    category_id: "van-ban-tai-lieu",
    category_name: "Văn bản & Video",
    title: "Quyết định số 749/QĐ-TTg phê duyệt 'Chương trình Chuyển đổi số quốc gia đến năm 2025'",
    summary: "Tài liệu văn bản chỉ đạo của Thủ tướng Chính phủ về định hướng chiến lược hạ tầng số và chính quyền số.",
    image: "https://chuyendoiso.quangngai.gov.vn/images/van-ban-chi-dao.jpg",
    date: "18/07/2026",
    views: 890,
  },
  {
    id: 8,
    category_id: "dak-pxi",
    category_name: "Xã Đăk Pxi",
    title: "Xã Đăk Pxi triển khai mô hình 'Chợ dân sinh không dùng tiền mặt' tại chợ trung tâm xã",
    summary: "Hơn 90% tiểu thương và bà con đi chợ đã thanh toán qua mã QR Code quét ngân hàng tiện lợi.",
    image: "https://baodantoc.vn/wp-content/uploads/2022/08/thanh-toan-khong-tien-mat.jpg",
    date: "17/07/2026",
    views: 1950,
  }
];

export default function ChuyenDoiSoPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const filteredArticles = useMemo(() => {
    return MOCK_NEWS.filter((item) => {
      const matchCat = activeCategory === "all" || item.category_id === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredArticles = useMemo(() => {
    return MOCK_NEWS.filter((item) => item.featured);
  }, []);

  return (
    <div className="cds-app-root">
      {/* ── BREADCRUMB CHUẨN HTML5 ── */}
      <nav className="cds-breadcrumb">
        <div className="cds-breadcrumb-inner">
          <Link to="/" className="home-link">Trang chủ</Link>
          <span className="sep">›</span>
          <span className="current">Trung tâm Chuyển đổi số</span>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="cds-main-container">
        {/* 1. THANH TÌM KIẾM TOÀN CHIỀU NGANG CHUẨN GIAO DIỆN MẪU */}
        <section className="cds-search-section">
          <form className="cds-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="cds-input-wrap">
              <SvgIcons.Search className="search-icon-inside" />
              <input
                type="text"
                className="cds-search-input"
                placeholder="Tìm kiếm tin tức, ứng dụng VNeID, VNeID, Dịch vụ công, chỉ đạo chuyển đổi số..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="cds-search-btn">
              <SvgIcons.Search />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </section>

        {/* 2. CHUYÊN MỤC DẠNG CHIP HÀNG NGANG KHỚP 100% ẢNH MẪU */}
        <nav className="cds-chip-nav">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`cds-chip-btn ${isActive ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {Icon && <Icon />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </nav>

        {/* 3. KHU VỰC "BÀI VIẾT NỔI BẬT" (FEATURED HERO GRID KHỚP Y HỆT MẪU) */}
        {!searchQuery && activeCategory === "all" && featuredArticles.length > 0 && (
          <section className="cds-featured-section">
            <div className="cds-featured-header">
              <h2 className="cds-featured-title">
                <span className="fire-icon">🔥</span> Bài viết nổi bật
              </h2>
              <div className="cds-featured-sub">
                Xem các định hướng chỉ đạo trọng tâm và <a href="#all-articles" className="red-link">kết quả chuyển đổi số nổi bật ➔</a>
              </div>
            </div>

            <div className="cds-featured-grid">
              {/* BÀI VIẾT CHÍNH BÊN TRÁI (HERO CARD) */}
              <article className="cds-hero-card">
                <div className="hero-img-wrap">
                  <img src={featuredArticles[0].image} alt={featuredArticles[0].title} />
                  <span className="hero-badge">CHUYỂN ĐỔI SỐ QUỐC GIA</span>
                </div>
                <div className="hero-body">
                  <div className="hero-meta">
                    <SvgIcons.Clock />
                    <span>{featuredArticles[0].date}</span>
                    <span className="sep">•</span>
                    <span>{featuredArticles[0].views} lượt xem</span>
                  </div>
                  <h3 className="hero-title">{featuredArticles[0].title}</h3>
                  <p className="hero-excerpt">{featuredArticles[0].summary}</p>
                  <button type="button" className="hero-read-btn">
                    <span>Đọc chi tiết</span>
                    <SvgIcons.ArrowRight />
                  </button>
                </div>
              </article>

              {/* 2 BÀI BÊN PHẢI (SIDE STACK CARDS) */}
              <div className="cds-side-stack">
                {/* CARD 1: TỈNH QUẢNG NGÃI */}
                <article className="cds-side-card">
                  <div className="side-thumb-box cream-bg">
                    <div className="side-thumb-graphic">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="side-thumb-label">QUẢNG NGÃI</span>
                  </div>
                  <div className="side-card-body">
                    <span className="side-cat-tag">TỈNH QUẢNG NGÃI</span>
                    <h4 className="side-card-title">{featuredArticles[1]?.title}</h4>
                    <div className="side-card-footer">
                      <span className="side-date"><SvgIcons.Calendar /> {featuredArticles[1]?.date}</span>
                      <button type="button" className="circle-arrow-btn">
                        <SvgIcons.ArrowRight />
                      </button>
                    </div>
                  </div>
                </article>

                {/* CARD 2: XÃ ĐẮK PXI */}
                <article className="cds-side-card">
                  <div className="side-thumb-box teal-bg">
                    <div className="side-thumb-graphic">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="7" r="3" />
                        <circle cx="6" cy="17" r="2.5" />
                        <circle cx="18" cy="17" r="2.5" />
                        <line x1="12" y1="10" x2="6" y2="14.5" />
                        <line x1="12" y1="10" x2="18" y2="14.5" />
                      </svg>
                    </div>
                    <span className="side-thumb-label">TỔ CÔNG NGHỆ SỐ CỘNG ĐỒNG</span>
                  </div>
                  <div className="side-card-body">
                    <span className="side-cat-tag">XÃ ĐẮK PXI</span>
                    <h4 className="side-card-title">{featuredArticles[2]?.title}</h4>
                    <div className="side-card-footer">
                      <span className="side-date"><SvgIcons.Calendar /> {featuredArticles[2]?.date}</span>
                      <button type="button" className="circle-arrow-btn">
                        <SvgIcons.ArrowRight />
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        )}

        {/* 4. TẤT CẢ BÀI VIẾT & HOẠT ĐỘNG CHUYỂN ĐỔI SỐ */}
        <section className="cds-articles-section" id="all-articles">
          <div className="cds-all-header">
            <div className="cds-all-title-wrap">
              <span className="newspaper-icon">📰</span>
              <h2>
                {activeCategory === "all"
                  ? "Tất cả bài viết & Hoạt động chuyển đổi số"
                  : CATEGORIES.find((c) => c.id === activeCategory)?.name}
              </h2>
            </div>
            <div className="cds-all-controls">
              <select className="cds-select-sort">
                <option value="newest">Mới nhất</option>
                <option value="popular">Xem nhiều nhất</option>
              </select>
              <button type="button" className="cds-grid-btn" title="Chế độ xem lưới">
                <SvgIcons.Grid />
              </button>
              <span className="cds-total-count">({filteredArticles.length} bài viết)</span>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="cds-articles-grid">
              {filteredArticles.map((item) => (
                <article key={item.id} className="cds-article-card">
                  <div className="card-thumb">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <span className="cds-cat-badge">{item.category_name}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-meta">
                      <SvgIcons.Clock />
                      <span>{item.date}</span>
                      <span className="sep">•</span>
                      <span>{item.views} lượt xem</span>
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-summary">{item.summary}</p>
                    <button type="button" className="card-read-link">
                      <span>Đọc tiếp</span>
                      <SvgIcons.ArrowRight />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cds-empty-box">
              <p>Không tìm thấy bài viết phù hợp với từ khóa "{searchQuery}".</p>
              <button
                type="button"
                className="cds-reset-btn"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Xem tất cả bài viết
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}