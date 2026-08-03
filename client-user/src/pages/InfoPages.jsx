import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './InfoPages.css';

/* ─────────────────────────────────────────────────────────────
   DANH SÁCH THÔNG BÁO CHÍNH THỨC TỪ UBND XÃ ĐĂK PXI
   ───────────────────────────────────────────────────────────── */
const NOTICES_DATA = [
  {
    id: 1,
    docNumber: "Số: 88/TB-UBND",
    title: "Thông báo lịch tiếp công dân và đối thoại trực tiếp của Chủ tịch UBND xã Đăk Pxi tháng 07/2026",
    category: "HANH_CHINH",
    categoryLabel: "🔵 HÀNH CHÍNH",
    typeCls: "notice-blue",
    date: "24/07/2026",
    unit: "Bộ phận Một cửa - UBND Xã Đăk Pxi",
    isPinned: true,
    isUrgent: false,
    summary: "UBND xã Đăk Pxi thông báo lịch tiếp công dân định kỳ tháng 07/2026 của Chủ tịch UBND xã vào ngày 28/07/2026 tại Bộ phận Một cửa xã Đăk Pxi.",
    content: `Căn cứ Luật Tiếp công dân và Quy chế làm việc của UBND xã Đăk Pxi, UBND xã trân trọng thông báo lịch tiếp công dân định kỳ tháng 07/2026 như sau:

1. Thời gian tiếp công dân:
- Buổi sáng: Từ 07h30 đến 11h30, ngày 28/07/2026 (Thứ Ba).
- Buổi chiều: Từ 13h30 đến 17h00, ngày 28/07/2026.

2. Địa điểm:
- Phòng Tiếp công dân - Bộ phận Tiếp nhận và Trả kết quả (Một cửa) UBND xã Đăk Pxi, tỉnh Quảng Ngãi.

3. Thành phần chủ trì:
- Đồng chí Phan Văn Cường - Chủ tịch UBND xã Đăk Pxi.
- Cùng đại diện Cán bộ Tư pháp - Hộ tịch, Địa chính - Xây dựng, Văn hóa - Xã hội và Công an xã.

4. Nội dung tiếp nhận:
- Lắng nghe, tiếp nhận và giải quyết các phản ánh, kiến nghị, khiếu nại, tố cáo của công dân về đất đai, thủ tục hành chính, bảo hiểm y tế, chính sách an sinh xã hội và an ninh trật tự trên địa bàn xã.

Đề nghị bà con nhân dân khi đến tiếp công dân mang theo CCCD và các văn bản, giấy tờ có liên quan.`,
    attachments: [
      { name: "TB_TiepCongDan_Thang07_2026.pdf", size: "1.2 MB", type: "pdf" },
      { name: "QuyChe_TiepCongDan_DakPxi.docx", size: "640 KB", type: "docx" }
    ]
  },
  {
    id: 2,
    docNumber: "Số: 102/TB-PCTT",
    title: "CẢNH BÁO KHẨN CẤP: Phòng chống mưa bão, lũ quét & nguy cơ đuối nước mùa mưa bão năm 2026",
    category: "KHAN_CAP",
    categoryLabel: "🔴 KHẨN CẤP",
    typeCls: "notice-red",
    date: "22/07/2026",
    unit: "Ban Chỉ huy PCTT & TKCN Xã Đăk Pxi",
    isPinned: true,
    isUrgent: true,
    summary: "Cảnh báo nguy cơ mực nước dâng cao đột ngột tại sông Đăk Pxi. Đề nghị người dân và gia đình quản lý chặt chẽ trẻ em, tuyệt đối không tắm sông suối.",
    content: `Theo dự báo của Trung tâm Khí tượng Thủy văn, khu vực xã Đăk Pxi đang xuất hiện mưa lớn kéo dài. Mực nước sông Đăk Pxi và các khe suối dâng cao nhanh, dòng chảy xiết, nguy cơ sạt lở bờ sông và lũ quét nguy hiểm.

Ban Chỉ huy Phòng chống thiên tai & Tìm kiếm cứu nạn xã Đăk Pxi khẩn thiết yêu cầu:

1. Tất cả gia đình và phụ huynh học sinh:
- Quản lý chặt chẽ con em, trẻ nhỏ. Tuyệt đối KHÔNG cho trẻ em đến gần ao, hồ, sông, suối, ngầm tràn hoặc đi tắm sông trong thời gian mưa lũ.
- Chủ động kiểm tra lu, bể nước, giếng nước gia đình và đậy nắp kín an toàn.

2. Người dân khi lưu thông qua ngầm tràn, cầu tràn:
- Tuyệt đối không cố tình vượt qua các đoạn đường ngập nước chảy xiết.
- Chấp hành nghiêm biển cảnh báo và rào chắn của Lực lượng Cứu hộ xã.

3. Số điện thoại đường dây nóng hỗ trợ khẩn cấp 24/7:
- Công an xã Đăk Pxi: 0255.389.114
- Trạm Y tế xã Đăk Pxi: 0255.389.115`,
    attachments: [
      { name: "CanhBao_AnToan_PhongChongDuoiNuoc.pdf", size: "2.4 MB", type: "pdf" }
    ]
  },
  {
    id: 3,
    docNumber: "Số: 45/TB-VHXH",
    title: "Thông báo lịch rà soát, cấp mới và đổi thẻ BHYT miễn phí cho hộ nghèo, hộ cận nghèo năm 2026",
    category: "Y_TE",
    categoryLabel: "🟢 BHYT - Y TẾ",
    typeCls: "notice-green",
    date: "20/07/2026",
    unit: "Phòng Văn hóa - Xã hội UBND Xã Đăk Pxi",
    isPinned: false,
    isUrgent: false,
    summary: "UBND xã Đăk Pxi tổ chức rà soát danh sách và hỗ trợ đổi thẻ BHYT có mã miễn phí 100% chi phí khám chữa bệnh cho người dân thuộc diện chính sách.",
    content: `Nhằm đảm bảo 100% người dân thuộc diện hộ nghèo, hộ cận nghèo và gia đình chính sách trên địa bàn xã Đăk Pxi được hưởng đầy đủ quyền lợi Bảo hiểm y tế năm 2026:

Phòng Văn hóa - Xã hội phối hợp cùng Bảo hiểm xã hội tỉnh tổ chức cấp mới và đổi thẻ BHYT miễn phí như sau:

1. Đối tượng được cấp đổi thẻ BHYT miễn 100%:
- Hộ nghèo, hộ cận nghèo theo chuẩn nghèo đa chiều năm 2026.
- Người dân tộc thiểu số đang sinh sống tại vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn.
- Trẻ em dưới 6 tuổi và người cao tuổi từ đủ 80 tuổi trở lên.

2. Lịch tiếp nhận và trả thẻ BHYT:
- Từ ngày 25/07/2026 đến hết ngày 30/07/2026 (Giờ hành chính).
- Địa điểm: Nhà văn hóa các thôn trên địa bàn xã Đăk Pxi.

3. Hồ sơ mang theo:
- Bản sao CCCD/CMND hoặc mã định danh VNeID.
- Thẻ BHYT cũ (nếu có) để đối soát cập nhật mã số BHXH.`,
    attachments: [
      { name: "DanhSach_CapTheBHYT_MienPhi_2026.xlsx", size: "890 KB", type: "xlsx" },
      { name: "HuongDan_QuyenLoi_BHYT_HoNgheo.pdf", size: "1.1 MB", type: "pdf" }
    ]
  },
  {
    id: 4,
    docNumber: "Số: 31/TB-CAX",
    title: "Thông báo đợt cao điểm kích hoạt tài khoản định danh điện tử VNeID mức 2 tích hợp thẻ BHYT",
    category: "HANH_CHINH",
    categoryLabel: "🔵 HÀNH CHÍNH",
    typeCls: "notice-blue",
    date: "18/07/2026",
    unit: "Công an Xã Đăk Pxi",
    isPinned: false,
    isUrgent: false,
    summary: "Công an xã Đăk Pxi tổ chức tổ lưu động thu nhận hồ sơ định danh điện tử VNeID mức 2 và tích hợp thẻ BHYT, Giấy phép lái xe cho người dân.",
    content: `Thực hiện Đề án 06 của Chính phủ về phát triển dữ liệu dân cư và chuyển đổi số quốc gia, Công an xã Đăk Pxi thông báo tổ chức đợt cao điểm thu nhận hồ sơ cấp tài khoản Định danh điện tử VNeID Mức độ 2 lưu động tại các thôn:

1. Lịch trình lưu động:
- Ngày 26/07/2026: Tại Nhà văn hóa Thôn 1 & Thôn 2.
- Ngày 27/07/2026: Tại Nhà văn hóa Thôn 3 & Thôn 4.
- Giờ làm việc: Phục vụ liên tục từ 07h30 đến 21h00 hằng ngày (kể cả buổi tối).

2. Quyền lợi khi kích hoạt VNeID mức 2:
- Tích hợp sẵn thẻ BHYT điện tử (khi đi khám chữa bệnh không cần mang thẻ giấy).
- Tích hợp Giấy phép lái xe, Đăng ký xe, Thông tin thuế và Giấy khai sinh.
- Thực hiện nộp hồ sơ Dịch vụ công trực tuyến ngay trên điện thoại di động.`,
    attachments: [
      { name: "HuongDan_TichHop_BHYT_VNeID.pdf", size: "2.8 MB", type: "pdf" }
    ]
  },
  {
    id: 5,
    docNumber: "Số: 19/TB-NN",
    title: "Thông báo chương trình đăng ký nhận hỗ trợ cây giống nông nghiệp & tập huấn vụ Hè Thu 2026",
    category: "NONG_NGHIEP",
    categoryLabel: "🟠 NÔNG NGHIỆP",
    typeCls: "notice-orange",
    date: "15/07/2026",
    unit: "Bộ phận Nông nghiệp & Phát triển Nông thôn",
    isPinned: false,
    isUrgent: false,
    summary: "UBND xã Đăk Pxi thông báo đăng ký nhận cây giống cà phê, cao su chất lượng cao và tham gia lớp tập huấn kỹ thuật chăm sóc cây trồng vụ Hè Thu.",
    content: `Để hỗ trợ bà con nông dân nâng cao năng suất cây trồng vụ Hè Thu năm 2026, UBND xã Đăk Pxi triển khai chương trình hỗ trợ cây giống nông nghiệp:

1. Loại cây giống hỗ trợ:
- Cà phê vối ghép chất lượng cao.
- Cây giống cao su và cây ăn quả nhiệt đới.

2. Thời gian đăng ký: Từ nay đến hết ngày 31/07/2026 tại Trưởng thôn hoặc Cán bộ Nông nghiệp xã.`,
    attachments: [
      { name: "Don_DangKy_NhanCayGiong_2026.docx", size: "450 KB", type: "docx" }
    ]
  },
  {
    id: 6,
    docNumber: "Số: 12/TB-TYT",
    title: "Thông báo kế hoạch tiêm chủng mở rộng định kỳ tháng 08/2026 cho trẻ em dưới 5 tuổi",
    category: "Y_TE",
    categoryLabel: "🟢 BHYT - Y TẾ",
    typeCls: "notice-green",
    date: "10/07/2026",
    unit: "Trạm Y tế Xã Đăk Pxi",
    isPinned: false,
    isUrgent: false,
    summary: "Trạm Y tế xã Đăk Pxi thông báo lịch tiêm chủng định kỳ vắc xin 5 trong 1, sởi, quai bị cho trẻ em dưới 5 tuổi vào ngày 05 và 20 hằng tháng.",
    content: `Trạm Y tế xã Đăk Pxi thông báo lịch tiêm chủng mở rộng định kỳ tháng 08/2026 cho tất cả trẻ em trong độ tuổi tiêm chủng:

- Địa điểm: Trạm Y tế xã Đăk Pxi.
- Ngày tiêm đợt 1: Ngày 05/08/2026.
- Ngày tiêm đợt 2: Ngày 20/08/2026.
Đề nghị phụ huynh mang theo Sổ tiêm chủng của bé khi đưa con đi tiêm.`,
    attachments: []
  }
];

// ── MODAL CHI TIẾT THÔNG BÁO (POPUP CHUYÊN NGHIỆP) ──
function NoticeDetailModal({ notice, onClose }) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `${notice.title}. Số văn bản: ${notice.docNumber}. Cơ quan phát hành: ${notice.unit}. Nội dung: ${notice.content}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "vi-VN";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="notice-modal-overlay" onClick={onClose}>
      <div className="notice-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="notice-modal-close" onClick={onClose} title="Đóng cửa sổ">✕</button>

        <div className="notice-modal-header">
          <div className="notice-modal-tags">
            <span className={`notice-badge-pill ${notice.typeCls}`}>{notice.categoryLabel}</span>
            <span className="notice-doc-num">{notice.docNumber}</span>
          </div>
          <h2 className="notice-modal-title">{notice.title}</h2>
          <div className="notice-modal-meta">
            <span>🏛️ <strong>Phát hành:</strong> {notice.unit}</span>
            <span className="sep">•</span>
            <span>📅 <strong>Ngày ban hành:</strong> {notice.date}</span>
          </div>
        </div>

        <div className="notice-modal-toolbar">
          <button
            type="button"
            className={`notice-tool-btn ${speaking ? 'is-speaking' : ''}`}
            onClick={handleToggleSpeak}
          >
            {speaking ? "⏹ Dừng đọc" : "🔊 Nghe đọc giọng nói"}
          </button>
          <button type="button" className="notice-tool-btn" onClick={handlePrint}>
            🖨️ In thông báo
          </button>
        </div>

        <div className="notice-modal-body">
          <div className="notice-full-text">
            {notice.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {notice.attachments && notice.attachments.length > 0 && (
            <div className="notice-modal-attachments">
              <h4>📎 Văn bản & File đính kèm ({notice.attachments.length}):</h4>
              <div className="attachments-list">
                {notice.attachments.map((file, i) => (
                  <div key={i} className="attachment-file-card">
                    <span className="file-icon">{file.type === 'pdf' ? '📄' : file.type === 'xlsx' ? '📊' : '📝'}</span>
                    <div className="file-info">
                      <strong className="file-name">{file.name}</strong>
                      <span className="file-size">{file.size}</span>
                    </div>
                    <button type="button" className="btn-file-download" onClick={() => alert(`Đang tải file: ${file.name}`)}>
                      📥 Tải về
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="notice-modal-footer">
          <button type="button" className="notice-btn-close-foot" onClick={onClose}>
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ThongBaoPage ──
export function ThongBaoPage() {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState(null);
  const [subscribePhone, setSubscribePhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Lọc thông báo theo danh mục & từ khóa tìm kiếm
  const filteredNotices = NOTICES_DATA.filter((item) => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.docNumber.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.unit.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const urgentNotice = NOTICES_DATA.find((n) => n.isUrgent);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribePhone.trim()) return;
    setSubscribed(true);
  };

  return (
    <div className="info-page thongbao-page-root">
      {/* ── BANNER HERO CHUẨN CỔNG THÔNG TIN ── */}
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-badge">📢 CỔNG THÔNG TIN ĐIỆN TỬ UBND XÃ ĐĂK PXI</div>
          <h1>Thông báo từ <span>UBND Xã Đăk Pxi</span></h1>
          <p>Cập nhật văn bản chỉ đạo, thông báo khẩn cấp, lịch tiếp công dân và chính sách BHYT mới nhất dành cho người dân.</p>

          {/* Ô TÌM KIẾM THÔNG BÁO NGAY TRÊN HERO */}
          <div className="hero-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Nhập từ khóa, số hiệu văn bản (Ví dụ: 88/TB-UBND, BHYT, PCTT...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ── THANH THỐNG KÊ NHANH ── */}
      <div className="info-stats">
        <div className="info-stat">
          <strong>{NOTICES_DATA.length}</strong>
          <span>Thông báo hoạt động</span>
        </div>
        <div className="info-stat">
          <strong style={{ color: '#ef4444' }}>{NOTICES_DATA.filter(n => n.category === 'KHAN_CAP').length}</strong>
          <span>Cảnh báo khẩn cấp</span>
        </div>
        <div className="info-stat">
          <strong>Hôm nay</strong>
          <span>Cập nhật mới nhất</span>
        </div>
        <div className="info-stat">
          <strong>24/7</strong><span>Cổng thông tin trực tuyến</span>
        </div>
      </div>

      <div className="info-content main-tb-container">
        {/* ── BANNER CẢNH BÁO KHẨN CẤP NỔI BẬT NẾU CÓ ── */}
        {urgentNotice && categoryFilter === 'ALL' && !searchQuery && (
          <div className="urgent-banner-card">
            <div className="urgent-banner-header">
              <span className="urgent-icon-pulse">🚨</span>
              <span className="urgent-tag">THÔNG BÁO KHẨN CẤP NỔI BẬT</span>
              <span className="urgent-date">{urgentNotice.date}</span>
            </div>
            <h3 className="urgent-title">{urgentNotice.title}</h3>
            <p className="urgent-desc">{urgentNotice.summary}</p>
            <div className="urgent-actions">
              <button type="button" className="btn-urgent-view" onClick={() => setActiveNotice(urgentNotice)}>
                📄 Xem nội dung khẩn cấp →
              </button>
            </div>
          </div>
        )}

        {/* ── BỘ LỌC DANH MỤC TABS ── */}
        <div className="tb-filter-tabs-row">
          <button
            type="button"
            className={`tb-tab-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('ALL')}
          >
            📋 Tất cả ({NOTICES_DATA.length})
          </button>
          <button
            type="button"
            className={`tb-tab-btn red ${categoryFilter === 'KHAN_CAP' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('KHAN_CAP')}
          >
            🔴 Khẩn cấp ({NOTICES_DATA.filter(n => n.category === 'KHAN_CAP').length})
          </button>
          <button
            type="button"
            className={`tb-tab-btn blue ${categoryFilter === 'HANH_CHINH' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('HANH_CHINH')}
          >
            🔵 Hành chính ({NOTICES_DATA.filter(n => n.category === 'HANH_CHINH').length})
          </button>
          <button
            type="button"
            className={`tb-tab-btn green ${categoryFilter === 'Y_TE' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('Y_TE')}
          >
            🟢 BHYT - Y tế ({NOTICES_DATA.filter(n => n.category === 'Y_TE').length})
          </button>
          <button
            type="button"
            className={`tb-tab-btn orange ${categoryFilter === 'NONG_NGHIEP' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('NONG_NGHIEP')}
          >
            🟠 Nông nghiệp ({NOTICES_DATA.filter(n => n.category === 'NONG_NGHIEP').length})
          </button>
        </div>

        {/* ── HEADING DANH SÁCH ── */}
        <div className="section-bar">
          <div className="section-bar-dot"></div>
          <h2>Danh sách thông báo chính thức</h2>
          <span className="section-bar-count">{filteredNotices.length} kết quả tìm thấy</span>
        </div>

        {/* ── DANH SÁCH THÔNG BÁO CARD ── */}
        {filteredNotices.length > 0 ? (
          <div className="notices-list-grid">
            {filteredNotices.map((n) => (
              <div className={`notice-card-item ${n.typeCls}`} key={n.id}>
                <div className="notice-card-header">
                  <div className="notice-badge-group">
                    <span className="type-badge">{n.categoryLabel}</span>
                    <span className="doc-number-tag">{n.docNumber}</span>
                  </div>
                  <span className="notice-pub-date">📅 {n.date}</span>
                </div>

                <h3 className="notice-card-title">{n.title}</h3>
                <p className="notice-card-summary">{n.summary}</p>

                <div className="notice-card-footer">
                  <div className="unit-tag">🏛️ {n.unit}</div>

                  <div className="notice-card-buttons">
                    {n.attachments && n.attachments.length > 0 && (
                      <span className="file-attach-count" title="Có văn bản đính kèm">
                        📎 {n.attachments.length} file
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn-read-detail"
                      onClick={() => setActiveNotice(n)}
                    >
                      <span>Xem chi tiết</span>
                      <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="notice-empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Không tìm thấy thông báo phù hợp</h3>
            <p>Vui lòng thử lại với từ khóa khác hoặc chọn xem lại tất cả danh mục thông báo.</p>
            <button
              type="button"
              className="btn-reset-filter"
              onClick={() => { setCategoryFilter('ALL'); setSearchQuery(''); }}
            >
              🔄 Xem tất cả thông báo
            </button>
          </div>
        )}

        {/* ── KHỐI ĐĂNG KÝ NHẬN THÔNG BÁO ZALO / SMS ── */}
        <div className="subscribe-zalo-card">
          <div className="sub-left">
            <span className="zalo-bell-icon">🔔</span>
            <div>
              <h4>Đăng ký nhận thông báo khẩn cấp qua Zalo / SMS</h4>
              <p>Bà con nhập số điện thoại để nhận thông báo bão lũ, lịch tiêm chủng và BHYT tự động hoàn toàn miễn phí.</p>
            </div>
          </div>

          {!subscribed ? (
            <form className="sub-form" onSubmit={handleSubscribe}>
              <input
                type="tel"
                placeholder="Nhập số điện thoại Zalo của bà con..."
                value={subscribePhone}
                onChange={(e) => setSubscribePhone(e.target.value)}
                required
              />
              <button type="submit" className="btn-sub-now">Đăng ký ngay</button>
            </form>
          ) : (
            <div className="sub-success-msg">
              ✅ Đã đăng ký thành công cho SĐT: <strong>{subscribePhone}</strong>! UBND Xã sẽ tự động gửi tin nhắn khi có thông báo mới.
            </div>
          )}
        </div>
      </div>

      {/* ── POPUP MODAL XEM CHI TIẾT THÔNG BÁO ── */}
      {activeNotice && (
        <NoticeDetailModal
          notice={activeNotice}
          onClose={() => setActiveNotice(null)}
        />
      )}
    </div>
  );
}

// ── ThongTinPage (TỔNG QUAN XÃ ĐĂK PXI) ──
export function ThongTinPage() {
  const [activeTab, setActiveTab] = useState('TONG_QUAN');
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = "Tổng quan Xã Đăk Pxi. Đơn vị hành chính cấp xã gồm 10 thôn bản. Bí thư Đảng ủy xã là đồng chí Phạm Thị Thương. Chủ tịch Ủy ban Nhân dân xã là đồng chí Phan Văn Cường. Xã Đăk Pxi là địa phương đậm đà bản sắc văn hóa Tây Nguyên với Nhà rông truyền thống, không gian Văn hóa Cồng chiêng và truyền thống đoàn kết buôn làng. Tỷ lệ bao phủ Bảo hiểm Y tế toàn dân đạt 98.2 phần trăm.";
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "vi-VN";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="info-page tongquan-page-root">
      {/* ── HERO BANNER CHUẨN CỔNG THÔNG TIN ── */}
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-badge">🏛️ CỔNG THÔNG TIN ĐIỆN TỬ CHÍNH THỨC</div>
          <h1>TỔNG QUAN <span>XÃ ĐĂK PXI</span></h1>
          <p>
            Trang giới thiệu tổng quan về Bộ máy Lãnh đạo, Điều kiện Tự nhiên, Văn hóa Truyền thống, 
            Kinh tế Nông nghiệp & Công tác An sinh Xã hội - Bảo hiểm Y tế năm 2026.
          </p>

          <div className="tongquan-hero-actions">
            <button
              type="button"
              className={`tthc-hero-btn btn-submit ${speaking ? 'is-speaking' : ''}`}
              onClick={handleToggleSpeak}
            >
              {speaking ? "⏹ Dừng đọc" : "🔊 Nghe đọc giới thiệu"}
            </button>

            <button type="button" className="tthc-hero-btn btn-print" onClick={handlePrint}>
              🖨️ In trang tổng quan
            </button>

            <Link to="/lien-he" className="tthc-hero-btn btn-track" style={{ textDecoration: 'none' }}>
              📞 Liên hệ UBND Xã
            </Link>
          </div>
        </div>
      </div>

      {/* ── THỐNG KÊ CHỈ SỐ NỔI BẬT CỦA XÃ ĐĂK PXI ── */}
      <div className="info-stats">
        <div className="info-stat">
          <strong>10 Thôn</strong>
          <span>Đơn vị hành chính trực thuộc</span>
        </div>
        <div className="info-stat">
          <strong style={{ color: '#16a34a' }}>98.2%</strong>
          <span>Tỷ lệ bao phủ BHYT toàn dân</span>
        </div>
        <div className="info-stat">
          <strong style={{ color: '#0284c7' }}>98.0%</strong>
          <span>Đồng bộ Định danh VNeID Mức 2</span>
        </div>
        <div className="info-stat">
          <strong style={{ color: '#d97706' }}>100%</strong>
          <span>Dịch vụ công niêm yết công khai</span>
        </div>
      </div>

      <div className="info-content main-tq-container">
        {/* ── BỘ TABS NỘI DUNG TỔNG QUAN ── */}
        <div className="tq-tabs-bar">
          <button
            type="button"
            className={`tq-tab-item ${activeTab === 'TONG_QUAN' ? 'active' : ''}`}
            onClick={() => setActiveTab('TONG_QUAN')}
          >
            🗺️ Vị trí & Tự nhiên
          </button>
          <button
            type="button"
            className={`tq-tab-item ${activeTab === 'BO_MAY' ? 'active' : ''}`}
            onClick={() => setActiveTab('BO_MAY')}
          >
            🏛️ Bộ máy Lãnh đạo
          </button>
          <button
            type="button"
            className={`tq-tab-item ${activeTab === 'VAN_HOA' ? 'active' : ''}`}
            onClick={() => setActiveTab('VAN_HOA')}
          >
            🥁 Văn hóa Buôn làng
          </button>
          <button
            type="button"
            className={`tq-tab-item ${activeTab === 'NONG_NGHIEP' ? 'active' : ''}`}
            onClick={() => setActiveTab('NONG_NGHIEP')}
          >
            🌱 Kinh tế & Nông sản
          </button>
          <button
            type="button"
            className={`tq-tab-item ${activeTab === 'BHYT' ? 'active' : ''}`}
            onClick={() => setActiveTab('BHYT')}
          >
            🏥 An sinh & BHYT
          </button>
        </div>

        {/* ── MỤC 1: TỔNG QUAN VỊ TRÍ ĐỊA LÝ ── */}
        {(activeTab === 'TONG_QUAN' || activeTab === 'ALL') && (
          <section className="tq-section-card">
            <div className="tq-card-head">
              <span className="tq-icon-box blue">🏔️</span>
              <div>
                <h2>1. Vị trí Địa lý & Điều kiện Tự nhiên Xã Đăk Pxi</h2>
                <p className="tq-sub">Nguồn lực tự nhiên và hệ thống sinh thái sông núi kỳ vĩ</p>
              </div>
            </div>

            <div className="tq-grid-2col">
              <div className="tq-text-block">
                <p>
                  <strong>Xã Đăk Pxi</strong> là xã địa bàn đặc thù vùng cao với cảnh quan thiên nhiên trù phú, núi rừng Tây Nguyên hùng vĩ và hệ thống dòng sông Đăk Pxi chảy qua. 
                  Xã bao gồm <strong>10 thôn, làng</strong> trực thuộc (như Thôn 1, Thôn 2, Thôn 3, Thôn 4, Làng Đăk Xế Kơ Ne...).
                </p>
                <ul className="tq-check-list">
                  <li><strong>Địa hình:</strong> Vùng đồi núi cao, khí hậu mát mẻ, tài nguyên rừng và sông suối phong phú.</li>
                  <li><strong>Thổ nhưỡng:</strong> Đất đỏ bazán màu mỡ cực kỳ thích hợp phát triển cây cà phê vối, cao su và cây ăn quả.</li>
                  <li><strong>Giao thông:</strong> Các tuyến đường liên thôn, đường trung tâm xã đã được bê tông hóa 100%, kết nối thuận lợi với các địa phương lân cận.</li>
                </ul>
              </div>

              <div className="tq-highlight-box">
                <h4>📌 Thông tin hành chính cơ bản</h4>
                <div className="tq-info-row"><span>Tên đơn vị:</span> <strong>Ủy ban nhân dân Xã Đăk Pxi</strong></div>
                <div className="tq-info-row"><span>Cấp quản lý:</span> <strong>Đơn vị hành chính cấp Xã</strong></div>
                <div className="tq-info-row"><span>Số lượng đơn vị trực thuộc:</span> <strong>10 Thôn / Buôn làng</strong></div>
                <div className="tq-info-row"><span>Trụ sở chính:</span> <strong>Bộ phận Một cửa - UBND Xã Đăk Pxi</strong></div>
                <div className="tq-info-row"><span>Đường dây nóng hỗ trợ:</span> <strong>0255.389.114 / 0255.389.115</strong></div>
              </div>
            </div>
          </section>
        )}

        {/* ── MỤC 2: BỘ MÁY LÃNH ĐẠO & TỔ CHỨC ── */}
        {(activeTab === 'BO_MAY' || activeTab === 'ALL') && (
          <section className="tq-section-card">
            <div className="tq-card-head">
              <span className="tq-icon-box green">🏛️</span>
              <div>
                <h2>2. Bộ máy Lãnh đạo & Tổ chức Chính quyền Xã</h2>
                <p className="tq-sub">Đội ngũ cán bộ công chức trách nhiệm - tận tụy - vì Nhân dân phục vụ</p>
              </div>
            </div>

            <div className="tq-leader-grid">
              <div className="leader-card prominent">
                <div className="leader-avatar-badge party">ĐẢNG ĐOÀN</div>
                <h3>Đồng chí PHẠM THỊ THƯƠNG</h3>
                <span className="leader-role">Bí thư Đảng ủy Xã Đăk Pxi</span>
                <p className="leader-desc">Chịu trách nhiệm toàn diện công tác lãnh đạo, chỉ đạo Đảng bộ và nhiệm vụ chính trị của địa phương.</p>
              </div>

              <div className="leader-card prominent">
                <div className="leader-avatar-badge gov">CHÍNH QUYỀN</div>
                <h3>Đồng chí PHAN VĂN CƯỜNG</h3>
                <span className="leader-role">Chủ tịch UBND Xã Đăk Pxi</span>
                <p className="leader-desc">Chỉ đạo, điều hành toàn bộ hoạt động phát triển Kinh tế - Xã hội, Quốc phòng - An ninh và Cải cách hành chính.</p>
              </div>
            </div>

            <div className="tq-depts-list">
              <h4>🏛️ Các Cơ quan & Phòng ban Chuyên môn Trực thuộc:</h4>
              <div className="depts-grid">
                <div className="dept-item">
                  <strong>Bộ phận Một cửa (Tiếp nhận & Trả kết quả)</strong>
                  <span>Giải quyết 100% thủ tục hành chính về Đất đai, Hộ tịch, BHYT.</span>
                </div>
                <div className="dept-item">
                  <strong>Phòng Văn hóa - Xã hội</strong>
                  <span>Phụ trách công tác VH-TT, Bảo hiểm y tế, An sinh xã hội & Chuyển đổi số.</span>
                </div>
                <div className="dept-item">
                  <strong>Trạm Y tế Xã Đăk Pxi</strong>
                  <span>Chăm sóc sức khỏe ban đầu, tiêm chủng mở rộng và khám chữa bệnh BHYT.</span>
                </div>
                <div className="dept-item">
                  <strong>Công an Xã Đăk Pxi</strong>
                  <span>Đảm bảo an ninh trật tự và thu nhận hồ sơ VNeID Mức 2 cho bà con.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── MỤC 3: VĂN HÓA TRUYỀN THỐNG & ĐỜI SỐNG BUÔN LÀNG ── */}
        {(activeTab === 'VAN_HOA' || activeTab === 'ALL') && (
          <section className="tq-section-card">
            <div className="tq-card-head">
              <span className="tq-icon-box orange">🥁</span>
              <div>
                <h2>3. Bản sắc Văn hóa Truyền thống & Đời sống Buôn làng</h2>
                <p className="tq-sub">Gìn giữ nét đẹp văn hóa dân tộc thiểu số và tình đoàn kết cộng đồng</p>
              </div>
            </div>

            <div className="tq-grid-2col">
              <div className="tq-text-block">
                <p>
                  Bà con các dân tộc thiểu số sinh sống tại xã Đăk Pxi luôn hân hoan, tự hào gìn giữ những giá trị văn hóa truyền thống vô cùng đặc sắc:
                </p>
                <ul className="tq-check-list">
                  <li><strong>Nhà rông truyền thống:</strong> Trụ sở sinh hoạt cộng đồng, nơi diễn ra các cuộc họp thôn và lễ hội buôn làng.</li>
                  <li><strong>Không gian Văn hóa Cồng chiêng:</strong> Tiếng cồng chiêng ngân vang trong các dịp lễ hội truyền thống, ngày hội đại đoàn kết.</li>
                  <li><strong>Lễ hội Dân gian:</strong> Lễ hội bánh chưng xanh, trò chơi dân gian bịt mắt bắt vịt, hội thao TDTT thu hút đông đảo bà con và các cháu thiếu nhi.</li>
                </ul>
              </div>

              <div className="tq-gallery-preview-box">
                <h4>📸 Hình ảnh hoạt động văn hóa tiêu biểu</h4>
                <div className="tq-mini-gallery">
                  <div className="gal-item">
                    <img src="/huong-dan/hinh-nen05.jpg" alt="Nhà rông Đăk Pxi" />
                    <span>Nhà rông truyền thống</span>
                  </div>
                  <div className="gal-item">
                    <img src="/huong-dan/baucu-2.png" alt="Lễ hội buôn làng" />
                    <span>Ngày hội cộng đồng</span>
                  </div>
                </div>
                <Link to="/thu-vien-anh" className="btn-link-gallery">Xem trọn bộ Thư viện ảnh Đăk Pxi →</Link>
              </div>
            </div>
          </section>
        )}

        {/* ── MỤC 4: KINH TẾ NÔNG NGHIỆP & NÔNG SẢN ── */}
        {(activeTab === 'NONG_NGHIEP' || activeTab === 'ALL') && (
          <section className="tq-section-card">
            <div className="tq-card-head">
              <span className="tq-icon-box green">🌱</span>
              <div>
                <h2>4. Phát triển Kinh tế Nông nghiệp & Giá Nông sản</h2>
                <p className="tq-sub">Chủ lực cây công nghiệp Cà phê, Cao su và Nông sản chất lượng cao</p>
              </div>
            </div>

            <div className="tq-grid-2col">
              <div className="tq-text-block">
                <p>
                  Nông nghiệp là trụ cột kinh tế chính của nhân dân xã Đăk Pxi. Địa phương tập trung phát triển mô hình nông nghiệp bền vững, ứng dụng tiến bộ khoa học kỹ thuật:
                </p>
                <ul className="tq-check-list">
                  <li><strong>Cà phê vối ghép:</strong> Sản phẩm nông sản chủ lực với năng suất và giá trị kinh tế cao.</li>
                  <li><strong>Cao su & Cây ăn quả:</strong> Mở rộng diện tích trồng cây cao su lấy mủ và cây ăn quả nhiệt đới.</li>
                  <li><strong>Chăn nuôi vùng cao:</strong> Đàn gia súc trâu, bò, lợn buôn làng mang lại nguồn thu nhập ổn định cho bà con.</li>
                </ul>
              </div>

              <div className="tq-highlight-box green-tint">
                <h4>📊 Cổng niêm yết Giá Nông sản Đăk Pxi</h4>
                <p>UBND xã niêm yết công khai bảng giá Cà phê nhân, Cà phê tươi, Mủ cao su trực tuyến hằng ngày để bà con yên tâm sản xuất và tiêu thụ.</p>
                <Link to="/gia-nong-san" className="tthc-btn-submit-main" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
                  📈 Tra cứu Cổng giá nông sản ngay →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── MỤC 5: AN SINH XÃ HỘI & BẢO HIỂM Y TẾ 2026 ── */}
        {(activeTab === 'BHYT' || activeTab === 'ALL') && (
          <section className="tq-section-card">
            <div className="tq-card-head">
              <span className="tq-icon-box purple">🏥</span>
              <div>
                <h2>5. Công tác An sinh Xã hội & Bảo hiểm Y tế (BHYT) 2026</h2>
                <p className="tq-sub">Tấm lá chắn bảo vệ sức khỏe toàn diện cho Nhân dân xã Đăk Pxi</p>
              </div>
            </div>

            <div className="tq-grid-2col">
              <div className="tq-text-block">
                <p>
                  Công tác chăm sóc sức khỏe và BHYT luôn được Đảng ủy - UBND xã Đăk Pxi đặt lên hàng đầu:
                </p>
                <ul className="tq-check-list">
                  <li><strong>BHYT Miễn phí 100%:</strong> Rà soát và cấp thẻ BHYT miễn phí cho 100% người dân thuộc diện hộ nghèo, hộ cận nghèo, gia đình chính sách và trẻ em dưới 6 tuổi.</li>
                  <li><strong>Tích hợp VNeID Mức 2:</strong> 98% công dân xã đã đồng bộ thẻ BHYT lên ứng dụng VNeID, chỉ cần mang điện thoại khi đi khám chữa bệnh.</li>
                  <li><strong>An toàn Nguồn nước & Đuối nước:</strong> Thường xuyên tổ chức các khóa học tương tác, thi trắc nghiệm cấp Giấy chứng nhận Hiệp sĩ An toàn Nguồn nước cho các cháu thiếu nhi.</li>
                </ul>
              </div>

              <div className="tq-highlight-box blue-tint">
                <h4>📱 Tra cứu Thẻ BHYT & Thi Trắc Nghiệm</h4>
                <p>Bà con có thể kiểm tra giá trị thẻ BHYT trực tuyến hoặc cho các bé tham gia cuộc thi trắc nghiệm an toàn nguồn nước ngay trên hệ thống.</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <Link to="/tra-cuu" className="tthc-hero-btn btn-track" style={{ textDecoration: 'none' }}>
                    🔍 Tra cứu BHYT trực tuyến
                  </Link>
                  <Link to="/duoi-nuoc" className="tthc-hero-btn btn-submit" style={{ textDecoration: 'none' }}>
                    🏊 Thi trắc nghiệm đuối nước
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ── LienHePage ──
export function LienHePage() {
  const contacts = [ /* giữ nguyên data */ ];
  const staff = [ /* giữ nguyên data */ ];
  const avatarColors = ['#1d4ed8', '#7c3aed', '#0f766e'];
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-badge">📞 Liên hệ</div>
          <h1>Liên hệ & <span>Hỗ trợ</span></h1>
          <p>Thông tin liên hệ UBND Xã Đăk Pxi và đội ngũ cán bộ hỗ trợ người dân.</p>
        </div>
      </div>
      <div className="info-content">
        <div className="contact-grid">
          <div className="contact-card">
            <h2>📍 Thông tin liên hệ</h2>
            <div className="contact-list">
              {contacts.map(c => (
                <div className="contact-row" key={c.label}>
                  <div className="contact-icon-box">{c.icon}</div>
                  <div>
                    <div className="contact-label">{c.label}</div>
                    <div className="contact-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="contact-card">
            <h2>👤 Cán bộ hỗ trợ BHYT</h2>
            <div className="staff-list">
              {staff.map((s, i) => (
                <div className="staff-row" key={s.name}>
                  <div className="staff-avatar" style={{background: avatarColors[i]}}>
                    {s.name.charAt(0)}
                  </div>
                  <div className="staff-info">
                    <strong>{s.name}</strong>
                    <span>{s.role}</span>
                    <a href={`tel:${s.phone.replace(/\s/g,'')}`} className="staff-phone">
                      📞 {s.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="emergency-banner">
          <span className="emergency-icon">🚨</span>
          <div>
            <strong>Đường dây hỗ trợ BHXH toàn quốc</strong>
            <p>Gọi miễn phí: <a href="tel:1900936936">1900 936 936</a> (24/7)</p>
          </div>
        </div>
      </div>
    </div>
  );
}