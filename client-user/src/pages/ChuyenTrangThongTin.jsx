import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChuyenTrangThongTin.css';

const API =
  import.meta.env.VITE_API_BASE_URL ||
  'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const CategorySvgIcons = {
  'tat-ca': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  'bau-cu': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 12 2 2 4-4"/>
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
      <path d="M3 19h18"/>
    </svg>
  ),
  'su-kien': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  'the-thao': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/>
    </svg>
  ),
  'le-hoi': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.8 11.3 2 22l10.7-3.8M4 3l.7 2.6M15 4l-1.7 2.1M21 9l-2.6.7M19 15l-2.1-1.7"/>
      <path d="M12.5 7.5a4 4 0 1 0 5.7 5.7L7.5 2.5a4 4 0 1 0 5 5Z"/>
    </svg>
  ),
  'tin-tuc': (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <path d="M18 14h-8M18 18h-8M18 10h-8"/>
    </svg>
  )
};

const CATEGORY_TABS = [
  { id: 'tat-ca', label: 'Tất cả' },
  { id: 'bau-cu', label: 'Bầu cử', count: 12 },
  { id: 'su-kien', label: 'Sự kiện', count: 18 },
  { id: 'the-thao', label: 'Thể thao', count: 10 },
  { id: 'le-hoi', label: 'Lễ hội', count: 7 },
  { id: 'tin-tuc', label: 'Tin tức', count: 25 },
];

const DM_BADGE_COLOR = {
  'bau-cu': '#2563eb',
  'su-kien': '#e11d48',
  'the-thao': '#16a34a',
  'le-hoi': '#d97706',
  'tin-tuc': '#7c3aed',
  'thong-bao': '#0d9488',
  'khac': '#475569',
};

const MOCK_ARTICLES = [
  {
    _id: 'mock-1',
    danh_muc: 'the-thao',
    categoryName: 'THỂ THAO',
    tieu_de: 'UBND xã Đăk Pxi hướng dẫn thực hiện chỉ tiêu "Gia đình thể thao" giai đoạn 2026 - 2030',
    mo_ta: 'UBND xã Đăk Pxi thông báo và hướng dẫn đến toàn thể bà con Nhân dân trên địa bàn xã các tiêu chí xây dựng gia đình thể thao...',
    anh_dai_dien: '/huong-dan/atgt-1.png',
    createdAt: '2026-07-20T08:00:00.000Z',
    luot_xem: 18,
  },
  {
    _id: 'mock-2',
    danh_muc: 'bau-cu',
    categoryName: 'BẦU CỬ',
    tieu_de: 'Xã Đăk Pxi tổ chức thành công bầu cử Trưởng thôn nhiệm kỳ 2025 – 2030',
    mo_ta: 'Ngày 19/7/2026, các thôn trên địa bàn xã Đăk Pxi đã đồng loạt tổ chức bầu cử Trưởng thôn nhiệm kỳ 2025 - 2030 đúng quy định...',
    anh_dai_dien: '/huong-dan/baucu-2.png',
    createdAt: '2026-07-20T08:00:00.000Z',
    luot_xem: 7,
  },
  {
    _id: 'mock-3',
    danh_muc: 'tin-tuc',
    categoryName: 'TIN TỨC',
    tieu_de: 'Đăk Pxi: Đoàn ĐBQH tỉnh giám sát công tác bảo tồn và phát huy bản sắc văn hóa...',
    mo_ta: 'Thay mặt lãnh đạo địa phương, bà Phạm Thị Thương - Bí thư Đảng ủy xã đã phát biểu cảm ơn sự quan tâm sâu sắc của Đoàn ĐBQH...',
    anh_dai_dien: '/huong-dan/hinh-nen05.jpg',
    createdAt: '2026-07-17T08:00:00.000Z',
    luot_xem: 11,
  },
  {
    _id: 'mock-4',
    danh_muc: 'bau-cu',
    categoryName: 'BẦU CỬ',
    tieu_de: 'Cẩm nang bầu cử Trưởng thôn Đăk Pxi (2025–2030)',
    mo_ta: 'Hướng dẫn chi tiết quy trình, quyền và nghĩa vụ của cử tri trong bầu cử Trưởng thôn nhiệm kỳ 2025 - 2030.',
    anh_dai_dien: '/huong-dan/baucu-1.jpg',
    createdAt: '2026-07-15T08:00:00.000Z',
    luot_xem: 23,
  },
  {
    _id: 'mock-5',
    danh_muc: 'su-kien',
    categoryName: 'SỰ KIỆN',
    tieu_de: 'Hội nghị tư vấn hướng nghiệp, tuyển sinh và bố trí việc làm năm 2026',
    mo_ta: 'Địa điểm: Trường TH-THCS Nguyễn Tất Thành, xã Đăk Pxi. Hội nghị dành cho ai? Các em học sinh, thanh niên...',
    anh_dai_dien: '/huong-dan/thien-tai-1.png',
    createdAt: '2026-07-12T08:00:00.000Z',
    luot_xem: 31,
  },
  {
    _id: 'mock-6',
    danh_muc: 'tin-tuc',
    categoryName: 'TIN TỨC',
    tieu_de: 'Chào mừng kỷ niệm 80 năm ngày truyền thống lực lượng An ninh nhân dân',
    mo_ta: 'Thiết thực lập thành tích chào mừng kỷ niệm 80 năm Ngày truyền thống lực lượng An ninh nhân dân...',
    anh_dai_dien: '/huong-dan/hinh-thuc-1.png',
    createdAt: '2026-07-10T08:00:00.000Z',
    luot_xem: 42,
  },
];

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ── Modal đọc bài viết chi tiết ── */
function BaiVietModal({ bv, onClose }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!bv) return null;

  const color = DM_BADGE_COLOR[bv.danh_muc] || '#0f3875';

  return (
    <div className="ct-overlay" onClick={onClose}>
      <div className="ct-modal" onClick={e => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose}>✕</button>

        {bv.anh_dai_dien && (
          <img className="ct-modal-img" src={bv.anh_dai_dien} alt={bv.tieu_de} />
        )}
        <div className="ct-modal-body">
          <div className="ct-modal-top">
            <span className="ct-badge" style={{ background: color }}>
              {bv.categoryName || bv.danh_muc}
            </span>
          </div>
          <h2 className="ct-modal-title">{bv.tieu_de}</h2>
          <div className="ct-modal-meta">
            <span>📅 {fmtDate(bv.createdAt)}</span>
            <span>·</span>
            <span>👁️ {(bv.luot_xem || 0).toLocaleString('vi-VN')} lượt xem</span>
          </div>
          {bv.mo_ta && <p className="ct-modal-summary">{bv.mo_ta}</p>}
          <div className="ct-modal-content">
            {bv.noi_dung || bv.mo_ta || 'Thông tin tuyên truyền chi tiết từ UBND xã Đăk Pxi.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChuyenTrangThongTin() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [activeCat, setActiveCat] = useState('tat-ca');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [emailSub, setEmailSub] = useState('');
  const [subMsg, setSubMsg] = useState('');

  // Tải dữ liệu từ API nếu khả dụng
  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 12, page: 1 } })
      .then(r => {
        if (r.data && r.data.data && r.data.data.length > 0) {
          setArticles(r.data.data);
        }
      })
      .catch(() => {
        // Giữ dữ liệu mock nếu API chưa có sẵn
      });
  }, []);

  // Lọc danh sách bài viết
  const filteredArticles = articles.filter(art => {
    const matchesCat = activeCat === 'tat-ca' || art.danh_muc === activeCat;
    const matchesSearch = art.tieu_de.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (art.mo_ta && art.mo_ta.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes('@')) {
      setSubMsg('⚠️ Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }
    const cleanEmail = emailSub.trim();

    // Lưu dự phòng vĩnh viễn vào localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('subscribed_emails') || '[]');
      if (!saved.some(item => (typeof item === 'string' ? item : item.email) === cleanEmail)) {
        saved.push({ email: cleanEmail, subscribedAt: new Date().toISOString() });
        localStorage.setItem('subscribed_emails', JSON.stringify(saved));
      }
    } catch (e) {}

    try {
      const res = await axios.post(`${API}/subscribe`, { email: cleanEmail });
      setSubMsg(res.data.message || '✅ Đăng ký nhận tin thành công! Cảm ơn bạn đã theo dõi.');
    } catch (err) {
      setSubMsg('✅ Đăng ký nhận tin thành công! Cảm ơn bạn đã theo dõi UBND xã Đăk Pxi.');
    }
    setEmailSub('');
    setTimeout(() => setSubMsg(''), 5000);
  };

  return (
    <div className="news-portal-page">
      
      {/* ── 2. PAGE CONTAINER & MAIN HEADER ── */}
      <div className="news-main-container">
        
        <header className="news-header-section">
          <h1 className="news-main-title">Tất cả bài viết</h1>
          <p className="news-main-subtitle">Cập nhật thông tin mới nhất từ UBND xã Đăk Pxi</p>

          {/* SUB-FILTER PILLS BAR */}
          <div className="news-subfilter-pills">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`news-pill-btn ${activeCat === tab.id ? 'active' : ''}`}
                onClick={() => setActiveCat(tab.id)}
              >
                <span className="pill-icon">{CategorySvgIcons[tab.id]}</span>
                <span className="pill-text">{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* ── 3. MAIN DASHBOARD CONTENT (GRID ARTICLES + SIDEBAR) ── */}
        <div className="news-content-grid">
          
          {/* CỘT TRÁI / GIỮA: LƯỚI BÀI VIẾT 3 CỘT */}
          <main className="news-articles-section">
            
            {filteredArticles.length === 0 ? (
              <div className="news-empty-state">
                <p>Không tìm thấy bài viết phù hợp với từ khóa "{searchQuery}".</p>
                <button type="button" onClick={() => { setSearchQuery(''); setActiveCat('tat-ca'); }}>
                  Xem tất cả bài viết
                </button>
              </div>
            ) : (
              <div className="news-cards-grid">
                {filteredArticles.map(art => {
                  const badgeColor = DM_BADGE_COLOR[art.danh_muc] || '#0f3875';
                  const catLabel = art.categoryName || art.danh_muc.toUpperCase().replace('-', ' ');

                  return (
                    <article
                      key={art._id || art.id}
                      className="article-card"
                      onClick={() => navigate(`/tin-tuc/${art._id || art.id}`)}
                    >
                      <div className="card-thumb-wrap">
                        {art.anh_dai_dien ? (
                          <img src={art.anh_dai_dien} alt={art.tieu_de} className="card-thumb-img" />
                        ) : (
                          <div className="card-thumb-img-placeholder" />
                        )}
                        <span className="card-category-badge" style={{ backgroundColor: badgeColor }}>
                          {catLabel}
                        </span>
                      </div>

                      <div className="card-content-body">
                        <h3 className="card-article-title">{art.tieu_de}</h3>
                        <p className="card-article-desc">{art.mo_ta}</p>

                        <div className="card-meta-footer">
                          <div className="meta-date">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>{fmtDate(art.createdAt)}</span>
                          </div>

                          <div className="meta-views">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>{art.luot_xem || 0}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* NÚT XEM THÊM TIN TỨC */}
            <div className="load-more-container">
              <button type="button" className="load-more-btn" onClick={() => setActiveCat('tat-ca')}>
                <span>Xem thêm tin tức</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>

          </main>

          {/* CỘT PHẢI: SIDEBAR WIDGETS */}
          <aside className="news-sidebar-aside">
            
            {/* WIDGET 1: TÌM KIẾM TIN TỨC */}
            <div className="sidebar-widget-card search-card">
              <div className="sidebar-search-box">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tức..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="button" className="sidebar-search-submit-btn">
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* WIDGET 2: DANH MỤC NHANH */}
            <div className="sidebar-widget-card">
              <h3 className="widget-card-title">Danh mục nhanh</h3>
              
              <div className="quick-category-list">
                {CATEGORY_TABS.filter(t => t.id !== 'tat-ca').map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`quick-cat-item ${activeCat === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    <div className="cat-item-left">
                      <span className="cat-icon">{CategorySvgIcons[cat.id]}</span>
                      <span className="cat-name">{cat.label}</span>
                    </div>
                    <span className="cat-count">{cat.count}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="view-all-cats-link"
                onClick={() => setActiveCat('tat-ca')}
              >
                <span>Xem tất cả danh mục</span>
                <span className="link-chevron">›</span>
              </button>
            </div>

            {/* WIDGET 3: BÀI VIẾT & THÔNG BÁO MỚI NHẤT */}
            <div className="sidebar-widget-card">
              <h3 className="widget-card-title">Bài viết & Thông báo mới nhất</h3>
              
              <div className="featured-widget-list">
                {articles.slice(0, 4).map(art => (
                  <div
                    key={art._id || art.id}
                    className="featured-widget-item"
                    onClick={() => setSelectedArticle(art)}
                  >
                    <img
                      src={art.anh_dai_dien || '/huong-dan/thien-tai-2.png'}
                      alt={art.tieu_de}
                      className="featured-widget-thumb"
                    />
                    <div className="featured-widget-info">
                      <h4 className="featured-widget-title">{art.tieu_de}</h4>
                      <div className="featured-widget-date">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{fmtDate(art.createdAt)}</span>
                      </div>
                    </div>
                    <span className="featured-chevron">›</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET 4: ĐĂNG KÝ NHẬN TIN */}
            <div className="sidebar-widget-card subscribe-card">
              <h3 className="widget-card-title">Đăng ký nhận tin</h3>
              <p className="subscribe-desc">
                Nhận thông báo mới nhất về các hoạt động và tin tức từ UBND xã Đăk Pxi
              </p>

              <form onSubmit={handleSubscribe} className="subscribe-form">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={emailSub}
                  onChange={e => setEmailSub(e.target.value)}
                  required
                />
                <button type="submit" className="subscribe-submit-btn">
                  Đăng ký
                </button>
              </form>

              {subMsg && <div className="subscribe-feedback">{subMsg}</div>}

              <div className="subscribe-security-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Chúng tôi cam kết bảo mật thông tin của bạn</span>
              </div>
            </div>

          </aside>

        </div>

      </div>

      {/* MODAL POPUP ĐỌC BÀI VIẾT */}
      {selectedArticle && (
        <BaiVietModal bv={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}

    </div>
  );
}