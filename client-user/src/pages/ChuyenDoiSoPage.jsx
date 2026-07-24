import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./ChuyenDoiSoPage.css";

// ── BỘ ICON VECTOR SVG CHUẨN HTML5 ──
const SvgIcons = {
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Globe: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
    </svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Cpu: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  Smartphone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
    </svg>
  ),
  Radio: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.83a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
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
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="12" x="3" y="8" rx="2" />
      <path d="M12 2v6" />
      <circle cx="8" cy="14" r="1.5" />
      <circle cx="16" cy="14" r="1.5" />
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
};

// ── DANH MỤC CÁC CHUYÊN MỤC CHÍNH ──
const CATEGORIES = [
  { id: "all", name: "Tất cả bài viết" },
  { id: "quoc-gia", name: "Chuyển đổi số Quốc gia", icon: SvgIcons.Globe },
  { id: "quang-ngai", name: "Tỉnh Quảng Ngãi", icon: SvgIcons.Building },
  { id: "dak-pxi", name: "Xã Đăk Pxi", icon: SvgIcons.MapPin },
  { id: "ai-cong-nghe", name: "AI & Công nghệ mới", icon: SvgIcons.Cpu },
  { id: "huong-dan-app", name: "Hướng dẫn App số", icon: SvgIcons.Smartphone },
  { id: "van-ban-tai-lieu", name: "Văn bản & Video", icon: SvgIcons.FileText },
];

// ── DỮ LIỆU BÀI VIẾT CHUYỂN ĐỔI SỐ MẪU (ĐỄ DÀNG MỞ RỘNG VÀ KẾT NỐI API) ──
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
    title: "Tổ Công nghệ số cộng đồng xã Đăk Pxi 'đi từng ngõ, gõ từng nhà' hướng dẫn VNeID mức 2",
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

// ── DANH SÁCH VIDEO HƯỚNG DẪN ──
const TUTORIAL_VIDEOS = [
  {
    id: "v1",
    title: "Hướng dẫn Kích hoạt tài khoản Định danh điện tử VNeID Mức 2",
    duration: "04:15",
    agency: "Công an xã Đăk Pxi",
    src: "/video/huongdan-khai-sinh.mp4",
    poster: "https://baodantoc.vn/wp-content/uploads/2022/08/dang-ky-khai-sinh.jpg"
  },
  {
    id: "v2",
    title: "Hướng dẫn Nộp hồ sơ Dịch vụ công trực tuyến trên Cổng Quốc gia",
    duration: "05:30",
    agency: "UBND xã Đăk Pxi",
    src: "/video/huongdan-so-do.mp4",
    poster: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2022/06/so-do-dat.jpg"
  },
  {
    id: "v3",
    title: "Hướng dẫn Sử dụng Ứng dụng VssID khi đi khám bệnh BHYT",
    duration: "03:45",
    agency: "BHXH tỉnh Quảng Ngãi",
    src: "/video/huongdan-tra-cuu-the-bhyt.mp4",
    poster: "https://baohiemxahoi.gov.vn/images/Upload/2022/9/the-bhyt.jpg"
  }
];

// ── CÂU HỎI THƯỜNG GẶP FAQ CHUYỂN ĐỔI SỐ ──
const CDS_FAQS = [
  {
    q: "VNeID mức 2 khác gì so với VNeID mức 1?",
    a: "VNeID mức 2 được làm trực tiếp tại Công an xã/huyện có chụp ảnh chân dung và lấy vân tay. Tài khoản mức 2 thay thế hoàn toàn CCCD gắn chip vật lý, Giấy phép lái xe, Thẻ BHYT và cho phép ký số các giao dịch Dịch vụ công."
  },
  {
    q: "Bà con không có điện thoại thông minh thì có nộp được dịch vụ công trực tuyến không?",
    a: "Bà con có thể đến trực tiếp Bộ phận Một cửa UBND xã Đăk Pxi. Cán bộ Một cửa và Tổ Công nghệ số cộng đồng sẽ hỗ trợ bà con thao tác nộp hồ sơ điện tử ngay tại máy tính dùng chung của xã."
  },
  {
    q: "Làm sao để biết thẻ BHYT của tôi đã tích hợp vào VNeID thành công?",
    a: "Mở ứng dụng VNeID -> Chọn 'Ví giấy tờ' -> Chọn 'Thẻ BHYT' -> Nhập passcode. Nếu màn hình hiển thị thẻ BHYT có mã QR xanh kèm hạn sử dụng là đã tích hợp thành công."
  },
  {
    q: "Dịch vụ công trực tuyến có tốn thêm phí dịch vụ không?",
    a: "Hoàn toàn không. Sử dụng Dịch vụ công trực tuyến còn giúp bà con tiết kiệm chi phí đi lại, một số lệ phí nhà nước được giảm giá theo chính sách ưu đãi nộp trực tuyến."
  }
];

export default function ChuyenDoiSoPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // Lọc bài viết theo chuyên mục và từ khóa tìm kiếm
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

  // Lấy các bài viết nổi bật cho Hero Banner
  const featuredArticles = useMemo(() => {
    return MOCK_NEWS.filter((item) => item.featured).slice(0, 3);
  }, []);

  return (
    <div className="cds-app-root">
      {/* ── HEADER CỔNG CHUYỂN ĐỔI SỐ ── */}
      <header className="cds-header">
        <div className="cds-header-inner">
          <div className="cds-brand">
            <div className="cds-brand-icon">
              <SvgIcons.Cpu />
            </div>
            <div className="cds-brand-titles">
              <span className="sub-gov">UBND XÃ ĐĂK PXI • PHÒNG VH-XH</span>
              <h1>Trung tâm Chuyển đổi số xã Đăk Pxi</h1>
              <p>Phát triển Chính quyền số – Kinh tế số – Xã hội số vì lợi ích nhân dân</p>
            </div>
          </div>

          <nav className="cds-nav-top">
            <Link to="/" className="cds-top-link">Trang chủ</Link>
            <Link to="/thu-tuc-hanh-chinh" className="cds-top-link">Dịch vụ công</Link>
            <Link to="/tro-giup" className="cds-top-link">Trợ giúp</Link>
          </nav>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <nav className="cds-breadcrumb">
        <div className="cds-breadcrumb-inner">
          <Link to="/">Trang chủ</Link>
          <span className="sep">›</span>
          <span className="current">Trung tâm Chuyển đổi số</span>
        </div>
      </nav>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="cds-main-container">
        {/* 1. THANH TÌM KIẾM TOÀN CHIỀU NGANG */}
        <section className="cds-search-section">
          <form
            className="cds-search-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              className="cds-search-input"
              placeholder="Tìm kiếm tin tức, ứng dụng VNeID, VssID, Dịch vụ công, chỉ đạo chuyển đổi số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="cds-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
            <button type="submit" className="cds-search-btn">
              <SvgIcons.Search />
              <span>Tìm kiếm</span>
            </button>
          </form>
        </section>

        {/* 2. CHUYÊN MỤC DẠNG CHIP HÀNG NGANG */}
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

        {/* 3. KHU VỰC "BÀI VIẾT NỔI BẬT" (FEATURED HERO GRID) */}
        {!searchQuery && activeCategory === "all" && featuredArticles.length > 0 && (
          <section className="cds-featured-section">
            <div className="cds-section-title">
              <h2>🔥 Bài viết nổi bật</h2>
              <span>Các định hướng chỉ đạo trọng tâm và kết quả chuyển đổi số nổi bật</span>
            </div>

            <div className="cds-featured-grid">
              {/* Bài chính bên trái */}
              <article className="cds-featured-main">
                <div className="featured-img-box">
                  <img src={featuredArticles[0].image} alt={featuredArticles[0].title} />
                  <span className="cds-cat-tag">{featuredArticles[0].category_name}</span>
                </div>
                <div className="featured-content">
                  <div className="featured-meta">
                    <span>{featuredArticles[0].date}</span>
                    <span className="sep">•</span>
                    <span>{featuredArticles[0].views} lượt xem</span>
                  </div>
                  <h3>{featuredArticles[0].title}</h3>
                  <p>{featuredArticles[0].summary}</p>
                </div>
              </article>

              {/* 2 bài phụ bên phải */}
              <div className="cds-featured-side">
                {featuredArticles.slice(1, 3).map((item) => (
                  <article key={item.id} className="cds-featured-side-card">
                    <img src={item.image} alt={item.title} />
                    <div className="side-card-content">
                      <span className="cds-cat-tag-sm">{item.category_name}</span>
                      <h4>{item.title}</h4>
                      <span className="side-date">{item.date}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. DANH SÁCH BÀI VIẾT TƯƠNG ỨNG VOỚI BỘ LỌC CHUYÊN MỤC */}
        <section className="cds-articles-section">
          <div className="cds-section-title">
            <h2>
              {activeCategory === "all"
                ? "📰 Tất cả bài viết & Hoạt động chuyển đổi số"
                : CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </h2>
            <span className="cds-count">({filteredArticles.length} bài viết)</span>
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
                      <span>{item.date}</span>
                      <span className="sep">•</span>
                      <span>{item.views} lượt xem</span>
                    </div>
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-summary">{item.summary}</p>
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

        {/* 5. KHU VỰC VIDEO HƯỚNG DẪN ỨNG DỤNG SỐ */}
        <section className="cds-videos-section">
          <div className="cds-section-title">
            <h2>🎥 Video Hướng dẫn Ứng dụng số</h2>
            <span>Xem video từng bước hướng dẫn cài đặt và sử dụng ứng dụng số dễ hiểu</span>
          </div>

          <div className="cds-video-grid">
            {TUTORIAL_VIDEOS.map((v) => (
              <div key={v.id} className="cds-video-card">
                <div className="video-player-wrap">
                  <video controls poster={v.poster} preload="none">
                    <source src={v.src} type="video/mp4" />
                    Trình duyệt không hỗ trợ phát video.
                  </video>
                  <span className="video-duration">{v.duration}</span>
                </div>
                <div className="video-card-body">
                  <span className="video-agency">{v.agency}</span>
                  <h3>{v.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. KHU VỰC PODCAST / ÂM THANH TUYÊN TRUYỀN */}
        <section className="cds-audio-section">
          <div className="audio-card">
            <div className="audio-header">
              <div className="audio-icon">
                <SvgIcons.Radio />
              </div>
              <div className="audio-info">
                <h2>📻 Phát thanh Tuyên truyền Chuyển đổi số xã Đăk Pxi</h2>
                <p>Bản tin phát thanh số phát sóng hàng tuần hướng dẫn bà con đăng ký dịch vụ công và phòng tránh lừa đảo mạng.</p>
              </div>
            </div>

            <div className="audio-player-box">
              <audio controls style={{ width: "100%" }}>
                <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                Trình duyệt không hỗ trợ nghe âm thanh phát thanh.
              </audio>
              <div className="audio-actions">
                <a
                  href="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                  download
                  className="audio-download-link"
                >
                  <SvgIcons.Download />
                  <span>Tải bản tin âm thanh (MP3)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 7. CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
        <section className="cds-faq-section">
          <div className="cds-section-title">
            <h2>📖 Câu hỏi thường gặp về Chuyển đổi số</h2>
            <span>Giải đáp các thắc mắc phổ biến của người dân xã Đăk Pxi</span>
          </div>

          <div className="cds-faq-list">
            {CDS_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <details
                  key={idx}
                  className={`cds-faq-item ${isOpen ? "is-open" : ""}`}
                  open={isOpen}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFaq(isOpen ? null : idx);
                  }}
                >
                  <summary className="cds-faq-summary">
                    <span className="faq-q-num">Q{idx + 1}.</span>
                    <span className="faq-q-text">{item.q}</span>
                    <span className="faq-q-toggle">
                      {isOpen ? <SvgIcons.ChevronUp /> : <SvgIcons.ChevronDown />}
                    </span>
                  </summary>
                  {isOpen && (
                    <div className="cds-faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </section>

        {/* 8. KHU VỰC BANNER TRỢ LÝ AI HỖ TRỢ */}
        <section className="cds-ai-banner">
          <div className="ai-banner-content">
            <div className="ai-banner-icon">
              <SvgIcons.Bot />
            </div>
            <div className="ai-banner-text">
              <h2>Bà con chưa rõ về Chuyển đổi số & Thủ tục hành chính?</h2>
              <p>Hỏi Trợ lý AI ở góc dưới màn hình để được hướng dẫn giải đáp tự động 24/7 tức thì.</p>
            </div>
          </div>
          <Link to="/thu-tuc-hanh-chinh" className="ai-banner-btn">
            Xem Thủ tục Dịch vụ công
          </Link>
        </section>
      </main>

      {/* ── FOOTER CHUẨN CỔNG ĐIỆN TỬ NHÀ NƯỚC ── */}
      <footer className="cds-footer">
        <div className="cds-footer-inner">
          <div className="footer-left">
            <p><strong>Cổng Thông tin Chuyển đổi số UBND Xã Đăk Pxi</strong></p>
            <p>Đơn vị quản lý: Phòng Văn hóa - Xã hội UBND xã Đăk Pxi, tỉnh Quảng Ngãi</p>
          </div>
          <div className="footer-right">
            <span>Ngày cập nhật: <strong>24/07/2026</strong></span>
            <span className="sep">•</span>
            <span>Phiên bản: <strong>v2.4.0 (HTML5 Standard)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}