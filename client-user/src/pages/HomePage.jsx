import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import './HomePage.css';
import { FEATURES } from "../data";




const HERO_VIDEOS = [
  '/videos/video1.mp4',
];

const STATS = [
  { value: '5.000+', label: 'Người dân tiếp cận', icon: '👥' },
  { value: '24/7',   label: 'Cập nhật trực tuyến', icon: '🕐' },
  { value: '100%',   label: 'Thông tin chính thống', icon: '✅' },
  { value: 'UBND',   label: 'Xã Đăk Pxi', icon: '🏛️' },
];

// Nhóm chuyên mục nổi bật (featured) và bình thường
const FEATURED_PATHS = ['/thong-bao', '/tra-cuu', '/huong-dan-vneid', '/thu-tuc-hanh-chinh'];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('tat-ca');

  const TABS = [
    { id: 'tat-ca', label: 'Tất cả' },
    { id: 'huong-dan', label: 'Hướng dẫn', paths: ['/tra-cuu', '/huong-dan-bhxh', '/huong-dan-vneid'] },
    { id: 'tuyen-truyen', label: 'Tuyên truyền', paths: ['/duoi-nuoc', '/chay-rung', '/te-nan', '/thien-tai'] },
    { id: 'hanh-chinh', label: 'Hành chính', paths: ['/thong-bao', '/lich-hop', '/thu-tuc-hanh-chinh', '/phap-luat'] },
  ];
  
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) { setSuggestions([]); return; }
    setSuggestions(FEATURES.filter(f =>
      f.title.toLowerCase().includes(val.toLowerCase()) ||
      f.desc.toLowerCase().includes(val.toLowerCase())
    ));
  };

  const handleSelect = (path) => {
    setSearchQuery('');
    setSuggestions([]);
    navigate(path);
  };

  const getFiltered = () => {
    const tab = TABS.find(t => t.id === activeTab);
    let list = FEATURES;
    if (tab && tab.paths) list = FEATURES.filter(f => tab.paths.includes(f.path));
    if (searchQuery.trim()) list = list.filter(f =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return list;
  };

  const filteredFeatures = getFiltered();

  // Tách featured và normal
  const featured = filteredFeatures.filter(f => FEATURED_PATHS.includes(f.path));
  const normal = filteredFeatures.filter(f => !FEATURED_PATHS.includes(f.path));

  return (
    <div className="home">

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features — Charcoal Gold ── */}
      <section className="features-section">

        {/* Header */}
        <div className="section-header">
          <div className="section-tag">Dành cho bà con</div>
          <h2>Chuyên mục thông tin</h2>
          <p>Tra cứu, hướng dẫn và tuyên truyền dành cho người dân xã Đăk Pxi</p>

          {/* Search */}
          <div className="home-search-box">
            <div className="search-icon">🔍</div>
            <input type="text" className="home-search-input"
              placeholder="Tìm chuyên mục..." value={searchQuery} onChange={handleSearch} />
            {suggestions.length > 0 && (
              <div className="home-search-dropdown">
                {suggestions.map((f) => (
                  <div key={f.path} className="home-search-item" onClick={() => handleSelect(f.path)}>
                    <img src={f.image} alt={f.title} className="home-search-item-img" />
                    <div>
                      <p className="home-search-item-title">{f.title}</p>
                      <p className="home-search-item-desc">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs lọc */}
          <div className="features-tabs">
            {TABS.map(tab => (
              <button key={tab.id}
                className={`features-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid — Featured lớn */}
        {featured.length > 0 && !searchQuery && activeTab === 'tat-ca' && (
          <div className="bento-grid">
            {featured.slice(0, 4).map((f, i) => (
              <div key={f.title}
                className={`bento-card bento-card--${i === 0 ? 'hero' : i === 1 ? 'tall' : 'normal'}`}
                onClick={() => navigate(f.path)}>
                <img src={f.image} alt={f.title} className="bento-img" />
                <div className="bento-overlay">
                  <div className="bento-tag">Nổi bật</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="bento-link">Xem ngay →</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        {!searchQuery && activeTab === 'tat-ca' && normal.length > 0 && (
          <div className="features-divider">
            <span>Tất cả chuyên mục</span>
          </div>
        )}

        {/* List ngang cuộn */}
        <div className="features-list">
          {(searchQuery || activeTab !== 'tat-ca' ? filteredFeatures : normal).map((f) => (
            <div key={f.title} className="flist-card" onClick={() => navigate(f.path)}>
              <div className="flist-img-wrap">
                <img src={f.image} alt={f.title} className="flist-img" />
              </div>
              <div className="flist-body">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="flist-link">Xem chi tiết →</span>
              </div>
            </div>
          ))}
        </div>

      </section>
{/* ── Hero ── */}
<section className="hero">
  <video
    className="hero-video"
    src="/videos/hero.mp4"
    autoPlay
    muted
    loop
    playsInline
  />
  <div className="hero-overlay" />
  <div className="hero-inner">
    <div className="hero-tag">🏛️ UBND XÃ ĐĂK PXI · QUẢNG NGÃI</div>
    <h1 className="hero-title">
      Chuyên trang thông tin
      <span className="hero-accent">Chính quyền — Người dân</span>
    </h1>
    <p className="hero-desc">
      Kênh thông tin chính thức phục vụ bà con xã Đắk Pxi.
      Cập nhật thông báo, hướng dẫn thủ tục, tuyên truyền pháp luật.
    </p>
    <div className="hero-actions">
      <button className="hero-btn hero-btn--primary" onClick={() => navigate('/thong-bao')}>
        Xem thông báo
      </button>
      <button className="hero-btn hero-btn--outline" onClick={() => navigate('/Thu-tuc-hanh-chinh')}>
        Thủ tục hành chính
      </button>
    </div>
  </div>
</section>

    </div>
  );
}