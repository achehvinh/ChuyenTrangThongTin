import { useState, useRef, useEffect } from 'react';
import './PhapLuatPage.css';

const DS_LUAT_MOI = [
  {
    id: 'luat-dat-dai',
    icon: '🌾',
    badge: 'MỚI 2026',
    title: 'Luật Đất Đai 2024 (Áp dụng sâu rộng 2026)',
    desc: 'Bỏ hoàn toàn khung giá đất, xác định giá theo thị trường. Hỗ trợ bồi thường tái định cư thỏa đáng hơn và tạo điều kiện làm sổ đỏ online tại cấp xã Đăk Pxi.',
    keyPoints: [
      'Bỏ khung giá đất, ban hành bảng giá đất hàng năm.',
      'Cá nhân không trực tiếp sản xuất nông nghiệp vẫn được nhận chuyển nhượng đất trồng lúa.',
      'Mở rộng dịch vụ đăng ký đất đai, cấp Sổ đỏ trực tuyến.'
    ],
    link: 'https://vanban.chinhphu.vn'
  },
  {
    id: 'luat-bhxh',
    icon: '🏥',
    badge: 'HIỆU LỰC 2026',
    title: 'Luật Bảo Hiểm Xã Hội 2024 (Áp dụng 2026)',
    desc: 'Giảm số năm đóng BHXH tối thiểu từ 20 năm xuống 15 năm để hưởng lương hưu. Bổ sung chế độ thai sản tự nguyện và trợ cấp hưu trí xã hội cho người cao tuổi.',
    keyPoints: [
      'Chỉ cần đóng BHXH từ 15 năm trở lên là đủ điều kiện nhận lương hưu.',
      'Người cao tuổi từ 75 tuổi trở lên không có lương hưu được nhận trợ cấp hưu trí xã hội.',
      'Bổ sung trợ cấp thai sản 2 triệu đồng/con từ nguồn ngân sách nhà nước.'
    ],
    link: 'https://baohiemxahoi.gov.vn'
  },
  {
    id: 'luat-can-cuoc',
    icon: '🪪',
    badge: 'ĐỒNG BỘ 2026',
    title: 'Luật Căn Cước 2023 (Đồng bộ thẻ 2026)',
    desc: 'Chính thức đổi tên từ Thẻ Căn cước công dân thành Thẻ Căn cước. Tích hợp ADN, mống mắt, nhóm máu vào cơ sở dữ liệu và khai tử sổ hộ khẩu giấy hoàn toàn.',
    keyPoints: [
      'Thu nhận thông tin mống mắt và ADN (tự nguyện) khi làm thẻ.',
      'Giá trị pháp lý tương đương của Căn cước điện tử tích hợp trên app VNeID Mức 2.',
      'Cấp thẻ Căn cước cho người dưới 14 tuổi theo nhu cầu.'
    ],
    link: 'https://dichvucong.gov.vn'
  },
  {
    id: 'chuyen-doi-so-xa',
    icon: '💻',
    badge: 'NỔI BẬT 2026',
    title: 'Đề án Chuyển đổi số cấp xã 2026',
    desc: 'Đẩy mạnh giải quyết thủ tục hành chính trực tuyến toàn trình tại xã Đăk Pxi. Miễn lệ phí trực tuyến và hỗ trợ người dân thao tác qua thiết bị công cộng tại UBND.',
    keyPoints: [
      'Miễn 100% lệ phí khi thực hiện dịch vụ công trực tuyến cấp xã.',
      'Thành lập Tổ công nghệ số cộng đồng tại từng thôn để hướng dẫn bà con.',
      'Số hóa 100% kết quả giải quyết thủ tục hành chính để tra cứu nhanh.'
    ],
    link: 'https://chinhphu.vn'
  }
];

const LIÊN_KẾT_CHÍNH_PHỦ = [
  {
    title: 'Cổng Thông tin Điện tử Chính phủ',
    url: 'https://chinhphu.vn',
    icon: '🏛️',
    desc: 'Kênh phát ngôn, cung cấp thông tin chính thức của Chính phủ trên Internet.'
  },
  {
    title: 'Cơ sở dữ liệu Quốc gia về Văn bản Pháp luật',
    url: 'https://vbpl.vn',
    icon: '📚',
    desc: 'Trang tra cứu văn bản quy phạm pháp luật chính thức của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.'
  },
  {
    title: 'Cổng Dịch vụ công Quốc gia',
    url: 'https://dichvucong.gov.vn',
    icon: '💻',
    desc: 'Hệ thống tích hợp thông tin về dịch vụ công trực tuyến của các Bộ, ngành, địa phương.'
  },
  {
    title: 'Cổng thông tin Bảo hiểm xã hội Việt Nam',
    url: 'https://baohiemxahoi.gov.vn',
    icon: '🏥',
    desc: 'Cổng thông tin chính thức tra cứu đóng BHXH, BHYT và các quyền lợi liên quan.'
  }
];

export default function PhapLuatPage() {
  const [speaking, setSpeaking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const audioRef = useRef(null);

  const readText = `
    Góc pháp luật xã Đăk Pxi. Cập nhật những quy định pháp luật mới nhất năm 2026.
    Thứ nhất: Luật Đất đai mới, bồi thường đất thỏa đáng hơn và hỗ trợ cấp sổ đỏ trực tuyến.
    Thứ hai: Luật Bảo hiểm xã hội mới, giảm số năm đóng tối thiểu xuống 15 năm để nhận lương hưu và hỗ trợ hưu trí xã hội từ 75 tuổi.
    Thứ ba: Luật Căn cước mới, cấp Căn cước điện tử trên ứng dụng VNeID.
    Thứ tư: Chuyển đổi số cấp xã, hỗ trợ miễn phí dịch vụ công trực tuyến cho bà con.
    Để tra cứu thêm các văn bản chính thức của Chính phủ, bà con có thể nhấp vào các liên kết cổng thông tin chính thống được cung cấp ở bên dưới.
  `;

  useEffect(() => {
    // Tự động phát giọng đọc khi mở trang
    const timer = setTimeout(async () => {
      setSpeaking(true);
      try {
        const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
          method: 'POST',
          headers: {
            'api-key': 't0GDbvE0lBxIjW3SKxcGeoaKMxrACwOH',
            'speed': '',
            'voice': 'linhsan',
          },
          body: readText,
        });
        const result = await response.json();
        if (result.async) {
          const audio = new Audio(result.async);
          audioRef.current = audio;
          audio.play();
          audio.onended = () => setSpeaking(false);
        } else {
          setSpeaking(false);
        }
      } catch {
        setSpeaking(false);
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
    };
  }, []);

  const toggleSpeech = async () => {
    if (speaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    try {
      const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
        method: 'POST',
        headers: {
          'api-key': 't0GDbvE0lBxIjW3SKxcGeoaKMxrACwOH',
          'speed': '',
          'voice': 'linhsan',
        },
        body: readText,
      });
      const result = await response.json();
      if (result.async) {
        const audio = new Audio(result.async);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setSpeaking(false);
      } else {
        setSpeaking(false);
      }
    } catch {
      setSpeaking(false);
    }
  };

  const filteredLuat = DS_LUAT_MOI.filter(luat => 
    luat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    luat.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="law-page">
      <div className="law-inner">

        {/* ─── 1. Header ─── */}
        <header className="law-header">
          <div className="law-header-badge">🏛️ PHỔ BIẾN KIẾN THỨC PHÁP LUẬT XÃ ĐĂK PXI</div>
          <h1>Góc Pháp Luật Việt Nam<br /><span>Cập nhật chính sách mới nhất 2026</span></h1>
          <p className="law-subtitle">Giúp bà con tìm hiểu nhanh các bộ luật sửa đổi mới có ảnh hưởng trực tiếp đến đời sống, lao động và chuyển đổi số tại nông thôn.</p>

          <div className="law-actions">
            <button className={`law-speech-btn ${speaking ? 'active' : ''}`} onClick={toggleSpeech}>
              {speaking ? '⏸️ Dừng đọc chính sách' : '🔊 Nghe phát thanh phổ biến pháp luật'}
            </button>
          </div>
        </header>

        {/* ─── 2. Search Thanh tìm kiếm văn bản pháp luật nhanh ─── */}
        <div className="law-search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Nhập tên bộ luật hoặc từ khóa cần tìm kiếm nhanh (Ví dụ: Đất đai, Bảo hiểm, Căn cước...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>}
        </div>

        {/* ─── 3. Grid 4 thẻ văn bản pháp luật chính xác trực quan ─── */}
        <section className="law-grid-section">
          <h2 className="law-section-title">⚖️ Các Điểm Mới Trong Luật Pháp Từ 2026</h2>
          
          <div className="law-grid">
            {filteredLuat.length > 0 ? (
              filteredLuat.map((luat) => (
                <div className="law-card" key={luat.id}>
                  <div className="law-card-head">
                    <span className="law-card-icon-wrap">{luat.icon}</span>
                    <div>
                      <span className="law-card-badge">{luat.badge}</span>
                      <h3>{luat.title}</h3>
                    </div>
                  </div>
                  <div className="law-card-body">
                    <p className="law-card-desc">{luat.desc}</p>
                    
                    <div className="law-card-keypoints">
                      <strong>📌 Điểm mấu chốt bà con cần nhớ:</strong>
                      <ul>
                        {luat.keyPoints.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="law-card-foot">
                    <a href={luat.link} target="_blank" rel="noreferrer" className="law-card-btn">
                      Xem văn bản gốc →
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="law-empty-state">
                <span>🔍</span>
                <p>Không tìm thấy văn bản pháp luật nào khớp với từ khóa tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── 4. Cổng liên kết pháp luật Chính phủ (Có link chính thức) ─── */}
        <section className="law-gov-links">
          <h2 className="law-section-title">🏛️ Cổng Văn Bản Pháp Luật Chính Phủ Chính Thống</h2>
          <p className="gov-links-intro">Nhấp vào các biểu tượng dưới đây để truy cập trực tiếp các cổng thông tin pháp luật, cơ sở dữ liệu quốc gia của Chính phủ Việt Nam:</p>
          
          <div className="gov-links-grid">
            {LIÊN_KẾT_CHÍNH_PHỦ.map((lnk, idx) => (
              <a href={lnk.url} target="_blank" rel="noreferrer" className="gov-link-card" key={idx}>
                <div className="gov-link-icon">{lnk.icon}</div>
                <div className="gov-link-content">
                  <h4>{lnk.title}</h4>
                  <p>{lnk.desc}</p>
                  <span className="gov-link-url">{lnk.url.replace('https://', '')} ↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ─── 5. Nút thoát quay về Trang chủ ─── */}
        <div className="law-exit-row">
          <a href="/" className="law-exit-btn">
            🚪 THOÁT VÀ QUAY LẠI TRANG CHỦ
          </a>
        </div>

      </div>
    </div>
  );
}
