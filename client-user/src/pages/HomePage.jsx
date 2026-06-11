import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { FEATURES } from "../data";

const HERO_IMAGES = [
  "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/484106471_1028733972633541_4025247298642484062_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dzW7loS1WeMQ7kNvwHsytLi&_nc_oc=AdqzoNsvadsK1X7vx8oYPmOZvlpdvfv0EcUHcb69sjncDUOtNbK5WKZbx2809lMFY8KUB8JmskP_TZsXpP-Atp7V&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=3WORjihvlcmSxbpjpCh_ZA&_nc_ss=7b2a8&oh=00_Af-bHSBZYhIC_1xDPETOVU7a88jDENGhqYfcEOj51ouDjg&oe=6A26BECE",
  "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/484326055_1028734052633533_9212664193593569105_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=mFxtGBuGXKQQ7kNvwHKm2nm&_nc_oc=AdpIETmMKlmtCThwGtednB1wa5LQz8cZcfoLRh-kpdKcLf72o4tg2W8aY_iGY9E8ScbTZSFLJOLfNODA6ptCIrgK&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=NQJS_OagTUWTJ_0PlAnlvQ&_nc_ss=7b2a8&oh=00_Af-OZOhgd6tkKbHJEMB1Ijz_720NGVrMgDrqq5H0i4i9MQ&oe=6A26B513",
  "https://scontent.fdad1-1.fna.fbcdn.net/v/t39.30808-6/482249941_1028004722706466_8177793115122124523_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=N_mUcDlB9ZYQ7kNvwGn-IxS&_nc_oc=Adr-NHKl4YQprNdrXTlPwH3sHMFhUTYuHovuZdGAbpYR6KmsJbPAryz9odNLUSnStHAB5JXxRzYALC_JrILWe0vV&_nc_zt=23&_nc_ht=scontent.fdad1-1.fna&_nc_gid=mycGyb2WSoeGxRkxs42cJA&_nc_ss=7b2a8&oh=00_Af-YcVIghGVd9MjpQgT75JXMhA2CbPbf498U5DKZN4D4MQ&oe=6A2693E3",
  "https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/472649407_1942409232914054_6110705543997189469_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=u5eaZSx0iAAQ7kNvwHIEwD6&_nc_oc=AdqyQJWYx4bSXxWuQ_Ab79ttzm5-P7ExUXlcbvWOHjiltdvlPP5U-umRY-_Z5bxIcCE_5eq8wCrSomeChWAt8BO8&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=rB6bDefxdCXGp3KdrBiFtQ&_nc_ss=7b2a8&oh=00_Af_0KP7S6VOObMr4tuP52oR-ZtA9fLwvDB_QaxPClwUWwA&oe=6A26AD69",
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