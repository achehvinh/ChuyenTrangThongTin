import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Thuvienanh.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const DANH_MUC = [
  'Tất cả',
  '📢 Tin tức & Chỉ đạo',
  '🟢 BHYT & Y tế',
  '🛡️ An toàn & Cảnh báo',
  '🌾 Nông nghiệp & Đời sống',
  '🥁 Văn hóa & Thể thao'
];

/* ─────────────────────────────────────────────────────────────
   DANH SÁCH BÀI VIẾT QUAN TRỌNG VÀ HÌNH ẢNH MINH HỌA XÃ ĐĂK PXI
   ───────────────────────────────────────────────────────────── */
const HARDCODED_ARTICLE_PHOTOS = [
  {
    id: 'post-1',
    articleId: '1',
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/626028889_1291745662999036_5336633434013149137_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHXP3_h7Rv30kJL4aSfyI31bc_DF67V17xtz8MXrtXXvPjzH5h9_N_muLf-Zz0iahdY0jHoARdoRuEll__E6ME6&_nc_ohc=piPb-8otdDgQ7kNvwHUtohl&_nc_oc=Adq2xonkvj7AjAHyVnx4CMRCX_Q_Ppl1kofWduVo1akNF1us6o_GxHb6A8Sk_6-GMOFBgIK_mDdsGOTkCBWuORjR&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=61_Jpe5aB3jmTWL5x2quWQ&_nc_ss=7b2a8&oh=00_Af-QdEbcHgNkL-CFCD9Vqc_ysKOnN4KmvxGe1gCC9aVJrw&oe=6A392562',
    title: 'Bà con và các cháu nhỏ xã Đăk Pxi hân hoan hội tụ dự lễ trong không khí nghĩa tình',
    danh_muc: '🥁 Văn hóa & Thể thao',
    unit: 'Phòng Văn hóa - Xã hội UBND Xã Đăk Pxi',
    date: '20/07/2026',
    summary: 'Lễ hội buôn làng xã Đăk Pxi diễn ra rộn ràng với sự tham gia của đông đảo bà con và thiếu nhi. Đây là dịp thắt chặt tình đoàn kết và gìn giữ nét đẹp văn hóa truyền thống.',
    content: `Ngày 20/07/2026, tại Nhà rông trung tâm xã Đăk Pxi, UBND xã phối hợp cùng Ban Quản lý các Thôn tổ chức Ngày hội Văn hóa Cộng đồng năm 2026. 

Đến dự ngày hội có đại diện Bí thư Đảng ủy, Chủ tịch UBND xã cùng đông đảo bà con nhân dân 10 thôn bản. Nhiều hoạt động ý nghĩa đã được tổ chức như biểu diễn cồng chiêng, thi gói bánh chưng xanh, trao quà hỗ trợ cho các hộ gia đình chính sách và trao học bổng cho các cháu học sinh vượt khó học giỏi.`,
    size: 'tall',
  },
  {
    id: 'post-2',
    articleId: '2',
    url: 'https://scontent.fdad1-2.fna.fbcdn.net/v/t39.30808-6/630024646_1291745699665699_2932985401898157879_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1424&ctp=s2048x1424&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeETOoC7EbEYbWqrHBhCSj7RQYIX9O7rI2lBghf07usjafVNf08kafeoReZau7chDDRvdnuLckWFfH7EQurZ7-iD&_nc_ohc=IXeR13eLCmcQ7kNvwGCrf_p&_nc_oc=Adpn3zl0qJILLjjrWR234WSGHUroiJkgwdNuFUD1LiyCgUM8kkTF4zdaGBnQtraDKFDwCXO0SfnF6pXCzgJPVMu8&_nc_zt=23&_nc_ht=scontent.fdad1-2.fna&_nc_gid=_b_H17UHb15Abk9XA1tzcg&_nc_ss=7b2a8&oh=00_Af-Y1gOd199qPX84ZNHCTF3rqV9RDVbIKPCWp7GfrElirw&oe=6A3942C8',
    title: 'Điệu múa cồng chiêng truyền thống mừng ngày hội đại đoàn kết toàn dân xã Đăk Pxi',
    danh_muc: '🥁 Văn hóa & Thể thao',
    unit: 'Ủy ban MTTQ Việt Nam Xã Đăk Pxi',
    date: '18/07/2026',
    summary: 'Các đội văn nghệ buôn làng giao lưu điệu múa xoang và tiếng cồng chiêng vang vọng núi rừng, tạo không khí hân hoan phấn khởi.',
    content: `Trong không khí tưng bừng của đợt thi đua lập thành tích chào mừng các ngày lễ lớn năm 2026, các nghệ nhân làng Đăk Xế Kơ Ne và thanh thiếu niên xã Đăk Pxi đã trình diễn nhiều tiết mục cồng chiêng độc đáo. 

Đảng ủy - UBND xã ghi nhận và biểu dương tinh thần giữ gìn bản sắc dân tộc của các thế hệ nghệ nhân địa phương.`,
    size: 'wide',
  },
  {
    id: 'post-3',
    articleId: '3',
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/635086870_1297161349124134_213153866043317087_n.jpg?stp=dst-jpg_tt6&cstp=mx2500x1155&ctp=s2500x1155&_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH1bOI2PSaiC5Yh6_Ad8EagYGGIj7CRkURgYYiPsJGRRNXQG5LS1XJtJU1mkoZlEws9ZozL0LZEia6rUKO7UeB3&_nc_ohc=3SCb3yMkncgQ7kNvwFAlucL&_nc_oc=AdqVg5BL2YVjbwflFnYtEO7HKywBmA-_FY6dNtnxBwZRMdO129WtlJQ3dmd_g8L0pGVmNsUQZLcCbzOLAHoFie5g&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=ZVOHhEO2NVwEc-RgAVkVrA&_nc_ss=7b2a8&oh=00_Af_jh2XcrU1qNOAc_o4PsIUUe5i521r_mJAxGBFZ-EtLpw&oe=6A395C93',
    title: 'Trạm Y tế xã Đăk Pxi triển khai đợt tiêm chủng mở rộng và rà soát cấp mới thẻ BHYT đợt 2',
    danh_muc: '🟢 BHYT & Y tế',
    unit: 'Trạm Y tế Xã Đăk Pxi',
    date: '22/07/2026',
    summary: '100% trẻ em dưới 5 tuổi được chăm sóc y tế và hỗ trợ cấp đổi thẻ BHYT có mã miễn phí chi phí khám chữa bệnh.',
    content: `Trạm Y tế xã Đăk Pxi vừa hoàn thành chương trình khám sức khỏe định kỳ và tiêm chủng mở rộng cho hơn 350 trẻ em trên địa bàn 10 thôn. 

Đồng thời, trạm phối hợp cùng Phòng Văn hóa - Xã hội rà soát, cấp đổi thẻ BHYT có mã quyền lợi 100% cho người dân thuộc hộ nghèo, cận nghèo và gia đình chính sách năm 2026.`,
    size: 'normal',
  },
  {
    id: 'post-4',
    articleId: '4',
    url: 'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/476131064_1002559525250986_8554132027760135855_n.jpg?stp=dst-jpg_tt6&cstp=mx3049x1374&ctp=s3049x1374&_nc_cat=103&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeEHwPerYe1jKx18KWc-txT4oJaNL6pX3saglo0vqlfexiI6o2y_XWnGSAwxT8ONPxbBcGEmZN56cEOuiC0hn13D&_nc_ohc=L1TW0SJpPrwQ7kNvwHZ1ofP&_nc_oc=Ado8EH95Hxc9wMK8RS602aw6pAS-tVzES7iBABrJI6LzLjwD3YGmEzggo_Anvwd7N58LDQ8QIBxmDipmipd9aJAF&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=1bQGF95hD_p9J7DdJ_jeRQ&_nc_ss=7b2a8&oh=00_Af_TM1xDJ70XqkPRe0xapPoDdB-FgofLgLWac52yiZ7VVw&oe=6A398766',
    title: 'Cảnh báo khẩn cấp: Tăng cường bảo vệ an toàn sông nước & phòng chống tai nạn đuối nước trẻ em',
    danh_muc: '🛡️ An toàn & Cảnh báo',
    unit: 'Ban Chỉ huy PCTT & TKCN Xã Đăk Pxi',
    date: '21/07/2026',
    summary: 'UBND xã khuyên khuyến bà con và gia đình không cho trẻ nhỏ tự ý ra tắm sông suối trong mùa mưa lũ.',
    content: `Trước diễn biến mưa bão phức tạp, Ban Chỉ huy Phòng chống Thiên tai & Tìm kiếm Cứu nạn xã Đăk Pxi đã cắm biển cảnh báo nguy hiểm tại dòng sông Đăk Pxi và các khu vực ngầm tràn.

UBND xã khuyến cáo bà con thường xuyên giám sát con em, nhắc nhở trẻ em nâng cao ý thức phòng chống đuối nước và tích cực tham gia lớp tập huấn trắc nghiệm kỹ năng an toàn nguồn nước.`,
    size: 'wide',
  },
  {
    id: 'post-5',
    articleId: '5',
    url: 'https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/472649407_1942409232914054_6110705543997189469_n.jpg?stp=dst-jpg_tt6&cstp=mx1939x1076&ctp=s1939x1076&_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeGqP4nAENAYJAvEr5aJgTmgWRxs6dojyAFZHGzp2iPIAUU0fidca25xRKP9NYVlBgsnFoi53K9FX2qx2RRr1AaK&_nc_ohc=hInQP9rm_n4Q7kNvwHWQKGD&_nc_oc=Adr92q4_31hR9vyPOdjCFbfVOtJosho57J1pN2S3xAaNiWFbYVr_1K5R98_WNFSFkvL2K5lZ4LP677F8SYG4SqGT&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=mcX8Z83XTdmDsXyuvxWeIA&_nc_ss=7b2a8&oh=00_Af-8aN2n9pQcXa1ETmFJuS_9mAUCy8pCHW8o2McvOzFsdw&oe=6A395AA9',
    title: 'Hỗ trợ nông dân Đăk Pxi phát triển cà phê vối ghép và nhân rộng mô hình chăn nuôi gia súc',
    danh_muc: '🌾 Nông nghiệp & Đời sống',
    unit: 'Bộ phận Nông nghiệp & Phát triển Nông thôn',
    date: '19/07/2026',
    summary: 'UBND xã niêm yết Cổng thông tin giá nông sản và cấp phát cây giống cà phê chất lượng cao cho bà con vụ Hè Thu.',
    content: `Phòng Nông nghiệp phối hợp cùng Trưởng các thôn tổ chức giao nhận cây giống cà phê ghép năng suất cao và tổ chức lớp tập huấn phòng trừ sâu bệnh.

Bảng giá nông sản Đăk Pxi (Cà phê nhân, mủ cao su) được niêm yết tự động hằng ngày trên hệ thống điện tử của xã để bà con theo dõi sát thị trường.`,
    size: 'tall',
  },
  {
    id: 'post-6',
    articleId: '6',
    url: 'https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/480437144_1011936034313335_1093750479205593707_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1171&ctp=s2048x1171&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEAJvfBDSjfctvCF2crhZJ6xArYgRX7smrECtiBFfuyah_3iCn_stvpw-Ln57EDdgBv-X_ajZ6SDOJzLy76O9fG&_nc_ohc=VODnud4lC0wQ7kNvwElOHyk&_nc_oc=Adpc26_GeEISt556x3nmm7h1JJrObJQfw2wd1UHWMzwIwErGBUllfpnIGMi-43WzELRPkkqxtFz5muprvQWy7A2a&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=HK_d7Ws5pIUBl-ldmZjRNw&_nc_ss=7b2a8&oh=00_Af8vayHf2XndRRgjHnnxjWGE-jocGyq8kFTKXLagtAD6_g&oe=6A397F10',
    title: 'Hội nghị giao ban thôn bản: Lắng nghe ý kiến Nhân dân và đẩy mạnh cải cách dịch vụ công',
    danh_muc: '📢 Tin tức & Chỉ đạo',
    unit: 'Văn phòng UBND Xã Đăk Pxi',
    date: '15/07/2026',
    summary: 'Chủ tịch UBND xã Phan Văn Cường chủ trì cuộc họp giao ban với 10 Trưởng thôn về tiến độ nộp hồ sơ dịch vụ công trực tuyến.',
    content: `Tại Hội nghị giao ban tháng 07/2026, Lãnh đạo UBND xã Đăk Pxi đã trực tiếp đối thoại với các Trưởng thôn và Tổ trưởng công nghệ số cộng đồng.

Xã quyết tâm nâng cao tỷ lệ giải quyết thủ tục hành chính trực tuyến tại Bộ phận Một cửa, đảm bảo 100% phản ánh của công dân được tiếp nhận và xử lý nhanh chóng.`,
    size: 'normal',
  }
];

export default function ThuVienAnh() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [anhPhongTo, setAnhPhongTo] = useState(null);
  const [articlesList, setArticlesList] = useState(HARDCODED_ARTICLE_PHOTOS);
  const [speaking, setSpeaking] = useState(false);

  // Tải danh sách bài viết từ backend API nếu có
  useEffect(() => {
    async function fetchApiArticles() {
      try {
        const res = await axios.get(`${API}/bai-viet`);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const apiPhotos = res.data
            .filter(item => item.anh_dai_dien)
            .map((item, idx) => ({
              id: `api-post-${item._id || idx}`,
              articleId: item._id,
              url: item.anh_dai_dien.startsWith('http') ? item.anh_dai_dien : `${API.replace('/api/v1', '')}${item.anh_dai_dien}`,
              title: item.tieu_de || 'Bài viết quan trọng UBND Xã Đăk Pxi',
              danh_muc: item.danh_muc === 'bhyt' ? '🟢 BHYT & Y tế' : item.danh_muc === 'an-toan' ? '🛡️ An toàn & Cảnh báo' : '📢 Tin tức & Chỉ đạo',
              unit: item.tac_gia || 'UBND Xã Đăk Pxi',
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '2026',
              summary: item.mo_ta || item.tieu_de,
              content: item.noi_dung || item.mo_ta || item.tieu_de,
              size: idx % 3 === 0 ? 'tall' : idx % 3 === 1 ? 'wide' : 'normal'
            }));
          setArticlesList([...apiPhotos, ...HARDCODED_ARTICLE_PHOTOS]);
        }
      } catch (err) {
        console.log('Using static article photo library', err);
      }
    }
    fetchApiArticles();
  }, []);

  // Tắt TTS khi đóng popup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [anhPhongTo]);

  // Lọc bài viết theo danh mục & từ khóa
  const filtered = articlesList
    .filter(a => filter === 'Tất cả' || a.danh_muc === filter)
    .filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
    );

  const handleToggleSpeak = (item) => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `Bài viết: ${item.title}. Đơn vị ban hành: ${item.unit}. Tóm tắt nội dung quan trọng: ${item.summary}. Chi tiết: ${item.content}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'vi-VN';
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  const handleDownload = async (url, title) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = title.slice(0, 30) + '.jpg';
      a.click();
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="thuvien-page">
      {/* ── BANNER HERO ── */}
      <div className="thuvien-header">
        <div className="thuvien-header-inner">
          <div className="thuvien-badge">🖼️ CỔNG HÌNH ẢNH & BÀI VIẾT QUAN TRỌNG</div>
          <h1>Thư Viện Ảnh & <span>Bài Viết Xã Đăk Pxi</span></h1>
          <p>Bà con nhấn vào từng hình ảnh để đọc thông tin chỉ đạo, bài viết tin tức và xem ảnh hoạt động chính thức.</p>
        </div>
      </div>

      <div className="thuvien-inner">
        {/* ── BỘ LỌC TÌM KIẾM VÀ TABS ── */}
        <div className="thuvien-filter">
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input
              className="thuvien-search"
              type="text"
              placeholder="Nhập tên bài viết, hoạt động quan trọng cần xem ảnh..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button type="button" className="clear-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="thuvien-tags">
            {DANH_MUC.map(dm => (
              <button
                key={dm}
                className={`thuvien-tag ${filter === dm ? 'active' : ''}`}
                onClick={() => setFilter(dm)}
              >
                {dm}
              </button>
            ))}
          </div>
        </div>

        {/* ── ĐẾM SỐ LƯỢNG HÌNH ẢNH BÀI VIẾT ── */}
        <div className="thuvien-count-bar">
          <span>📸 Hiển thị <strong>{filtered.length}</strong> bài viết & hình ảnh quan trọng</span>
          <span className="sub-hint">💡 Bà con nhấp vào ảnh bất kỳ để mở đọc nội dung bài viết</span>
        </div>

        {/* ── MASONRY GRID HÌNH ẢNH BÀI VIẾT ── */}
        <div className="thuvien-grid">
          {filtered.map(anh => (
            <div
              key={anh.id}
              className={`thuvien-item thuvien-item--${anh.size}`}
              onClick={() => setAnhPhongTo(anh)}
            >
              <img
                src={anh.url}
                alt={anh.title}
                className="thuvien-img"
                loading="lazy"
                onError={e => { e.target.parentElement.style.display = 'none'; }}
              />
              <div className="thuvien-overlay">
                <div className="thuvien-overlay-tag">{anh.danh_muc}</div>
                <div className="thuvien-overlay-title">{anh.title}</div>
                <div className="thuvien-overlay-meta">
                  <span>🏛️ {anh.unit}</span>
                  <span>📅 {anh.date}</span>
                </div>
                <button type="button" className="thuvien-overlay-btn">
                  📖 Xem ảnh & Đọc bài viết →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="thuvien-empty">
            <div className="empty-ico">🔍</div>
            <h3>Không tìm thấy hình ảnh hoặc bài viết nào</h3>
            <p>Vui lòng chọn từ khóa khác hoặc nhấn nút dưới để xem lại tất cả hình ảnh.</p>
            <button type="button" className="btn-reset" onClick={() => { setFilter('Tất cả'); setSearch(''); }}>
              🔄 Xem tất cả thư viện ảnh
            </button>
          </div>
        )}
      </div>

      {/* ── LIGHTBOX POPUP: XEM ẢNH & ĐỌC BÀI VIẾT QUAN TRỌNG ── */}
      {anhPhongTo && (
        <div className="lightbox-overlay" onClick={() => setAnhPhongTo(null)}>
          <div className="lightbox-modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="lightbox-close-top" onClick={() => setAnhPhongTo(null)}>✕</button>

            <div className="lightbox-body-grid">
              {/* Cột trái: Hình ảnh bài viết */}
              <div className="lightbox-img-col">
                <img src={anhPhongTo.url} alt={anhPhongTo.title} className="lightbox-main-img" />
                <div className="img-caption">🖼️ Hình ảnh chụp thực tế hoạt động tại Xã Đăk Pxi</div>
              </div>

              {/* Cột phải: Nội dung bài viết quan trọng để bà con đọc */}
              <div className="lightbox-article-col">
                <div className="article-meta-tags">
                  <span className="cat-badge">{anhPhongTo.danh_muc}</span>
                  <span className="date-badge">📅 {anhPhongTo.date}</span>
                </div>

                <h2 className="article-modal-title">{anhPhongTo.title}</h2>
                <div className="article-agency-tag">🏛️ <strong>Cơ quan ban hành:</strong> {anhPhongTo.unit}</div>

                <div className="article-content-box">
                  <h4>📌 Nội dung bài viết & Chỉ đạo quan trọng:</h4>
                  <p className="summary-p"><strong>Tóm tắt:</strong> {anhPhongTo.summary}</p>
                  
                  <div className="full-text-paragraphs">
                    {anhPhongTo.content.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="article-modal-actions">
                  <button
                    type="button"
                    className={`btn-action speak ${speaking ? 'is-speaking' : ''}`}
                    onClick={() => handleToggleSpeak(anhPhongTo)}
                  >
                    {speaking ? '⏹ Dừng đọc' : '🔊 Nghe đọc nội dung'}
                  </button>

                  <button
                    type="button"
                    className="btn-action save"
                    onClick={() => handleDownload(anhPhongTo.url, anhPhongTo.title)}
                  >
                    💾 Lưu ảnh về máy
                  </button>

                  <button
                    type="button"
                    className="btn-action close"
                    onClick={() => setAnhPhongTo(null)}
                  >
                    ← Trở lại thư viện
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
