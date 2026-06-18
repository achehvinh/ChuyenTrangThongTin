import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { FEATURES } from "../data";

const HERO_IMAGES = [
  "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/484106471_1028733972633541_4025247298642484062_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeF2d3g2yfALJbW7Cqv-DporAFNDqJShvOIAU0OolKG84o_cIRqxbi94zTm54pyrB1kENcFUPRlb5kHEHK_Wq08Y&_nc_ohc=craJaeR-vcoQ7kNvwHbce8X&_nc_oc=AdpUxvxKcoGV7jDMTQzogRJXYXB1LFgVWLKHVbYb6Y8szkxn-pij_tVhm3nNHFByYrWjAsUkORW1oZy5oSWacOCG&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=8WeXuJRQqzclIE_GnO82yg&_nc_ss=7b2a8&oh=00_Af_aRl7CrhcFUNfgksOt9YVJgmFArNBwl_cmng2EtQBR9A&oe=6A35778E",
  "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/484326055_1028734052633533_9212664193593569105_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=103&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeG89cmzDZpP9uqZ16nzMhIdRp_71m2OPXRGn_vWbY49dNmsTyyK_RTSF2R7yFIlGiAJileQ3eUkkp-In2Tw39IN&_nc_ohc=MTEQzfltkFoQ7kNvwHrJiCG&_nc_oc=AdreAgMtQl8edOG3FpT4ac9t7p4yGTdgAHSNnEtx7RrB9FPlZm0cCWtKKQwx59LhGSodqTYiwkgnY-XAETuYhoDF&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=xePBMyzJQXxZk8D2_0ATUA&_nc_ss=7b2a8&oh=00_Af-DAy5-55kw_6HIhlNJXrxJ9p7LBEQEqRc4VB8CTwQFPw&oe=6A356DD3",
  "https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/472649407_1942409232914054_6110705543997189469_n.jpg?stp=dst-jpg_tt6&cstp=mx1939x1076&ctp=s1939x1076&_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeGqP4nAENAYJAvEr5aJgTmgWRxs6dojyAFZHGzp2iPIAUU0fidca25xRKP9NYVlBgsnFoi53K9FX2qx2RRr1AaK&_nc_ohc=z1Ttx4_nneAQ7kNvwEycreD&_nc_oc=AdrHag-oRuo1A3_gtOVPeMFOnt2z74d6HYvTfLIMnY6BSaTykJZLbqJdJX-hJLlXw045erDgibiuRJb6WjJCrKdJ&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=Kwg76JY1Yx1CE2K4glORIg&_nc_ss=7b2a8&oh=00_Af867C13DqeNQIvDariHd47bwJu07Rz0ej4NP6_hahDzkw&oe=6A356629",
];

const STATS = [
  { value: '5.000+', label: 'Người dân tiếp cận thông tin' },
  { value: '24/7', label: 'Cập nhật trực tuyến' },
  { value: '100%', label: 'Thông tin chính thống' },
  { value: 'UBND', label: 'Xã Đăk Pxi' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
const [suggestions, setSuggestions] = useState([]);

const handleSearch = (e) => {
  const val = e.target.value;
  setSearchQuery(val);
  if (val.trim() === '') {
    setSuggestions([]);
    return;
  }
  const filtered = FEATURES.filter(f =>
    f.title.toLowerCase().includes(val.toLowerCase()) ||
    f.desc.toLowerCase().includes(val.toLowerCase())
  );
  setSuggestions(filtered);
};

const handleSelect = (path) => {
  setSearchQuery('');
  setSuggestions([]);
  navigate(path);
};

  return (
    <div className="home">

      <section className="hero">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className="hero-slide"
            style={{
              backgroundImage: `url(${img})`,
              animationDelay: `${index * 5}s`,
            }}
          />
        ))}
        <div className="hero-inner">
          <h1 className="hero-title">
            CHUYÊN TRANG THÔNG TIN
            <br />
            <span className="hero-accent">CHÍNH QUYỀN - NGƯỜI DÂN</span>
          </h1>
          <p className="hero-desc">
            Kênh thông tin chính thức phục vụ người dân.
            Cập nhật thông báo, tuyên truyền pháp luật,
            chuyển đổi số, phòng chống đuối nước,
            phòng chống cháy rừng và các hoạt động của địa phương.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/thong-bao')}>
              Xem thông báo
            </button>
            <button className="btn-secondary" onClick={() => navigate('/chuyen-doi-so')}>
              Chuyển đổi số
            </button>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Chuyên mục thông tin</h2>
          <p>Các nội dung tuyên truyền và hỗ trợ dành cho người dân xã Đăk Pxi</p>
          <div className="home-search-box">
  <input
    type="text"
    className="home-search-input"
    placeholder="🔍 Tìm chuyên mục..."
    value={searchQuery}
    onChange={handleSearch}
  />
  {suggestions.length > 0 && (
    <div className="home-search-dropdown">
      {suggestions.map((f) => (
        <div
          key={f.path}
          className="home-search-item"
          onClick={() => handleSelect(f.path)}
        >
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
        </div>

        <div className="features-grid">
          {FEATURES.filter(f =>
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.desc.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((f) => (
            <div
              className="feature-card"
              key={f.title}
              onClick={() => navigate(f.path)}
            >
              <img src={f.image} alt={f.title} className="feature-image" />
              <div className="feature-content">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2>Cùng xây dựng cộng đồng an toàn và phát triển</h2>
          <p>
            Theo dõi thông báo mới nhất, kiến thức pháp luật,
            chuyển đổi số và các hoạt động tuyên truyền của UBND xã Đăk Pxi.
          </p>
          <button className="btn-primary large" onClick={() => navigate('/thong-bao')}>
            Xem thông báo mới nhất
          </button>
        </div>
      </section>

    </div>
  );
}