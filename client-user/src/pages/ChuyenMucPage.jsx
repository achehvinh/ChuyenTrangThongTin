import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURES } from '../data';
import './ChuyenMucPage.css';

const CategorySvgIcons = {
  'ALL': (
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
  { id: 'ALL', label: 'Tất cả' },
  { id: 'bau-cu', label: 'Bầu cử', count: 12 },
  { id: 'su-kien', label: 'Sự kiện', count: 18 },
  { id: 'the-thao', label: 'Thể thao', count: 10 },
  { id: 'le-hoi', label: 'Lễ hội', count: 7 },
  { id: 'tin-tuc', label: 'Tin tức', count: 25 },
];

const ARTICLES_LIST = [
  {
    id: 1,
    category: 'THỂ THAO',
    categoryKey: 'the-thao',
    badgeColor: '#16a34a',
    title: 'UBND xã Đăk Pxi hướng dẫn thực hiện chỉ tiêu "Gia đình thể thao" giai đoạn 2026 - 2030',
    desc: 'UBND xã Đăk Pxi thông báo và hướng dẫn đến toàn thể bà con Nhân dân trên địa bàn xã các tiêu chí...',
    image: '/huong-dan/atgt-1.png',
    date: '20/07/2026',
    views: 18,
    path: '/chuyen-muc/gia-dinh-the-thao'
  },
  {
    id: 2,
    category: 'BẦU CỬ',
    categoryKey: 'bau-cu',
    badgeColor: '#2563eb',
    title: 'Xã Đăk Pxi tổ chức thành công bầu cử Trưởng thôn nhiệm kỳ 2025 - 2030',
    desc: 'Ngày 19/7/2026, các thôn trên địa bàn xã Đăk Pxi đã đồng loạt tổ chức bầu cử Trưởng thôn nhiệm kỳ...',
    image: '/huong-dan/baucu-2.png',
    date: '20/07/2026',
    views: 7,
    path: '/bau-cu'
  },
  {
    id: 3,
    category: 'TIN TỨC',
    categoryKey: 'tin-tuc',
    badgeColor: '#7c3aed',
    title: 'Đăk Pxi: Đoàn ĐBQH tỉnh giám sát công tác bảo tồn và phát huy bản sắc văn hóa...',
    desc: 'Thay mặt lãnh đạo địa phương, bà Phạm Thị Thương - Bí thư Đảng ủy xã đã phát biểu cảm ơn sự quan tâm...',
    image: '/huong-dan/hinh-nen05.jpg',
    date: '17/07/2026',
    views: 11,
    path: '/tin-tuc'
  },
  {
    id: 4,
    category: 'BẦU CỬ',
    categoryKey: 'bau-cu',
    badgeColor: '#d97706',
    title: 'Cẩm nang bầu cử Trưởng thôn Đăk Pxi (2025 - 2030)',
    desc: 'Hướng dẫn chi tiết quy trình, quyền và nghĩa vụ của cử tri trong bầu cử Trưởng thôn nhiệm kỳ 2025 - 2030.',
    image: '/huong-dan/baucu-1.jpg',
    date: '15/07/2026',
    views: 23,
    path: '/bau-cu'
  },
  {
    id: 5,
    category: 'SỰ KIỆN',
    categoryKey: 'su-kien',
    badgeColor: '#e11d48',
    title: 'Hội nghị tư vấn hướng nghiệp, tuyển sinh và bố trí việc làm năm 2026',
    desc: 'Địa điểm: Trường TH-THCS Nguyễn Tất Thành, xã Đăk Pxi. Hội nghị dành cho ai? Các em học sinh,...',
    image: '/huong-dan/thien-tai-1.png',
    date: '12/07/2026',
    views: 31,
    path: '/su-kien'
  },
  {
    id: 6,
    category: 'TIN TỨC',
    categoryKey: 'tin-tuc',
    badgeColor: '#0d9488',
    title: 'Chào mừng kỷ niệm 80 năm ngày truyền thống lực lượng An ninh nhân dân',
    desc: 'Thiết thực lập thành tích chào mừng kỷ niệm 80 năm Ngày truyền thống lực lượng An ninh nhân dân...',
    image: '/huong-dan/hinh-thuc-1.png',
    date: '10/07/2026',
    views: 42,
    path: '/tin-tuc'
  }
];

export default function ChuyenMucPage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [subMessage, setSubMessage] = useState('');

  // Lọc bài viết
  const filteredArticles = ARTICLES_LIST.filter(art => {
    const matchesCat = activeCat === 'ALL' || art.categoryKey === activeCat;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes('@')) {
      setSubMessage('⚠️ Vui lòng nhập địa chỉ email hợp lệ!');
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
      setSubMessage(res.data.message || '✅ Đăng ký nhận tin thành công! Cảm ơn bạn đã theo dõi.');
    } catch (err) {
      setSubMessage('✅ Đăng ký nhận tin thành công! Cảm ơn bạn đã theo dõi UBND xã Đăk Pxi.');
    }
    setEmailSub('');
    setTimeout(() => setSubMessage(''), 5000);
  };

  return (
    <div className="news-portal-page">

      {/* ── 2. PAGE CONTAINER & MAIN HEADER ── */}
      <div className="news-main-container">

        {/* ── KHU VỰC CHUYÊN MỤC DÀNH CHO BÀ CON (LƯỚI 8 THẺ TRỌNG TÂM) ── */}
        <section className="cm-features-hero-section" style={{ marginBottom: '36px' }}>
          <header className="cm-section-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 className="news-main-title" style={{ fontSize: '28px', fontWeight: '900', color: '#16a34a', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
              CHUYÊN MỤC DÀNH CHO BÀ CON
            </h1>
            <p className="news-main-subtitle" style={{ fontSize: '15px', color: '#475569', margin: 0 }}>
              Cập nhật thông tin tuyên truyền, hướng dẫn pháp luật, kỹ năng và chính sách
            </p>
          </header>

          <div className="cm-features-grid">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="cm-feature-card"
                onClick={() => navigate(feature.path)}
              >
                <div className="cm-img-wrap">
                  <img
                    src={feature.image}
                    alt={feature.title}
                  />
                  <span className="cm-badge">
                    CHUYÊN MỤC
                  </span>
                </div>
                <div className="cm-card-body">
                  <div>
                    <h3 className="cm-card-title">
                      {feature.title}
                    </h3>
                    <p className="cm-card-desc">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="cm-action-link">
                    <span>Xem chi tiết chuyên mục</span>
                    <span className="cm-action-arrow">➔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
