import { useState, useRef, useEffect } from 'react';
import './TeNanXaHoiPage.css';

const DS_TINH_HUONG = [
  {
    id: 1,
    question: 'Tình huống 1: Có người rủ rê dùng thử một "viên kẹo" lạ, nói rằng sẽ giúp tỉnh táo học tập và làm việc cực kỳ hiệu quả mà không gây hại gì. Bạn nên làm thế nào?',
    options: [
      { text: 'A. Thử một chút cho biết, chắc không sao đâu.', isCorrect: false },
      { text: 'B. Từ chối quyết liệt, rời khỏi đó ngay và báo cho người thân hoặc công an xã.', isCorrect: true }
    ],
    explain: 'Chính xác! Ma túy đá hoặc các loại chất hướng thần mới thường được ngụy trang dưới dạng kẹo, nước vui. Tuyệt đối không thử dù chỉ một lần!'
  },
  {
    id: 2,
    question: 'Tình huống 2: Gia đình bạn đang cần vốn sản xuất gấp, thấy tờ rơi hoặc tin nhắn quảng cáo: "Cho vay tiền nóng, nhận tiền sau 5 phút, không thế chấp, chỉ cần CCCD". Bạn nên làm thế nào?',
    options: [
      { text: 'A. Đăng ký vay ngay qua số điện thoại trên tờ rơi để giải quyết công việc.', isCorrect: false },
      { text: 'B. Cảnh giác với "tín dụng đen", liên hệ Ngân hàng Chính sách Xã hội tại xã để được hướng dẫn vay vốn an toàn.', isCorrect: true }
    ],
    explain: 'Chính xác! Tờ rơi vay nóng là cái bẫy tín dụng đen với lãi suất cắt cổ, đe dọa, đòi nợ khủng bố tinh thần. Bà con nên vay qua ngân hàng chính thống hoặc các tổ chức đoàn thể xã.'
  },
  {
    id: 3,
    question: 'Tình huống 3: Bạn thấy một trang web quảng cáo "Kiếm tiền dễ dàng tại nhà bằng cách đặt cược chẵn lẻ, game bài trực tuyến cam kết rút tiền nhanh chóng". Bạn nên làm thế nào?',
    options: [
      { text: 'A. Nạp thử một số tiền nhỏ để chơi xem có may mắn kiếm được tiền không.', isCorrect: false },
      { text: 'B. Nhận diện đây là cờ bạc mạng lừa đảo, tuyệt đối không tham gia và cảnh báo người thân tránh xa.', isCorrect: true }
    ],
    explain: 'Chính xác! Đa số các ứng dụng game bài, cá độ trực tuyến đều do các đối tượng lừa đảo thiết lập để chiếm đoạt tài sản của người chơi. Hãy nói không với cờ bạc dưới mọi hình thức!'
  }
];

export default function TeNanXaHoiPage() {
  const [speaking, setSpeaking] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const audioRef = useRef(null);

  const readText = `
    Tuyên truyền phòng chống tệ nạn xã hội tại xã Đăk Pxi.
    Bà con hãy luôn nâng cao cảnh giác, bảo vệ gia đình và người thân khỏi các mối nguy hiểm.
    Thứ nhất: Nói không với ma túy. Không thử dù chỉ một lần.
    Thứ hai: Tránh xa cờ bạc, cá độ mạng và các game bài lừa đảo.
    Thứ ba: Cảnh giác tín dụng đen, cho vay nóng lãi suất cắt cổ.
    Nếu phát hiện dấu hiệu vi phạm, xin gọi ngay công an xã Đăk Pxi qua số điện thoại: 0 3 3 9 3 1 0 9 1 5.
  `;

  useEffect(() => {
    // Tự động đọc bằng FPT TTS khi vào trang
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

  const toggleSpeak = async () => {
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

  const handleSelectOption = (qId, optionIdx, isCorrect) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: { optionIdx, isCorrect }
    }));
  };

  return (
    <div className="te-nan-page">
      <div className="te-nan-inner">

        {/* ─── 1. Header ─── */}
        <header className="te-nan-header">
          <div className="header-badge">📢 TUYÊN TRUYỀN PHÁP LUẬT XÃ ĐĂK PXI</div>
          <h1>Phòng Chống Tệ Nạn Xã Hội<br /><span>Bảo vệ bình yên cho buôn làng</span></h1>
          <p className="header-subtitle">Hãy nâng cao cảnh giác, nói không với ma túy, cờ bạc và tín dụng đen để xây dựng nông thôn mới yên ấm.</p>
          
          <div className="header-actions">
            <button className={`speak-btn ${speaking ? 'speaking' : ''}`} onClick={toggleSpeak}>
              {speaking ? '⏸️ Dừng đọc hướng dẫn' : '🔊 Nghe tuyên truyền bằng giọng nói'}
            </button>
          </div>
        </header>

        {/* ─── 2. Đường dây nóng Công an xã ─── */}
        <div className="hotline-bar">
          <div className="hotline-left">
            <span className="hotline-icon">📞</span>
            <div>
              <strong>ĐƯỜNG DÂY NÓNG CÔNG AN XÃ ĐĂK PXI</strong>
              <p>Trực chiến 24/7 — Bảo mật thông tin người báo tin tố giác tội phạm</p>
            </div>
          </div>
          <a href="tel:0339310915" className="hotline-btn">Gọi ngay: 0339 310 915</a>
        </div>

        {/* ─── 3. 4 Chuyên mục tuyên truyền bằng hình ảnh trực quan ─── */}
        <section className="te-nan-categories">
          <h2 className="section-title">🛡️ 4 Trọng Điểm Cần Đề Phòng</h2>
          
          <div className="categories-grid">
            {/* Card 1: Ma túy */}
            <div className="category-card card-drug">
              <div className="card-media">
                <div className="card-illustration">💉</div>
                <span className="danger-tag">NGUY HIỂM CẤT CẤP</span>
              </div>
              <div className="card-content">
                <h3>1. Phòng Chống Ma Túy</h3>
                <p className="card-desc">Ma túy tàn phá sức khỏe, hủy hoại hạnh phúc gia đình và dẫn đến các hành vi phạm pháp như trộm cắp, cướp giật.</p>
                <div className="warning-list">
                  <div className="warning-item">🔴 <strong>Không thử dù chỉ 1 lần:</strong> Không sử dụng bất kỳ dạng chất kích thích nào.</div>
                  <div className="warning-item">🔴 <strong>Quản lý con em:</strong> Nhắc nhở con trẻ không nhận kẹo hay nước từ người lạ.</div>
                </div>
              </div>
            </div>

            {/* Card 2: Cờ bạc */}
            <div className="category-card card-gambling">
              <div className="card-media">
                <div className="card-illustration">🎲</div>
                <span className="danger-tag">TRÁNH XA LỪA ĐẢO</span>
              </div>
              <div className="card-content">
                <h3>2. Nói Không Với Cờ Bạc</h3>
                <p className="card-desc">Cờ bạc truyền thống hay cá độ bóng đá trực tuyến đều làm tiêu tan tài sản, gây nợ nần chồng chất cho người dân.</p>
                <div className="warning-list">
                  <div className="warning-item">🔴 <strong>Tránh xa đỏ đen:</strong> Không tụ tập đánh bài ăn tiền dưới mọi hình thức.</div>
                  <div className="warning-item">🔴 <strong>Không cá độ mạng:</strong> Không tin vào các chiêu trò game bài, nạp rút lừa đảo trực tuyến.</div>
                </div>
              </div>
            </div>

            {/* Card 3: Tín dụng đen */}
            <div className="category-card card-loan">
              <div className="card-media">
                <div className="card-illustration">💸</div>
                <span className="danger-tag">CẢNH GIÁC BẪY NỢ</span>
              </div>
              <div className="card-content">
                <h3>3. Cảnh Giác Tín Dụng Đen</h3>
                <p className="card-desc">Vay tiền nhanh qua app không rõ nguồn gốc với lãi suất cắt cổ khiến bà con rơi vào cảnh đòi nợ đe dọa, khủng bố tinh thần.</p>
                <div className="warning-list">
                  <div className="warning-item">🔴 <strong>Nói không với vay nóng:</strong> Tuyệt đối không bấm vào các link quảng cáo vay online siêu tốc.</div>
                  <div className="warning-item">🔴 <strong>Tìm kênh chính thống:</strong> Liên hệ ngân hàng xã hoặc hội phụ nữ/nông dân để được hỗ trợ.</div>
                </div>
              </div>
            </div>

            {/* Card 4: Bạo lực & Tố giác */}
            <div className="category-card card-violence">
              <div className="card-media">
                <div className="card-illustration">🛡️</div>
                <span className="danger-tag">BÁO TIN KHẨN CẤP</span>
              </div>
              <div className="card-content">
                <h3>4. Xây Dựng Đời Sống Lành Mạnh</h3>
                <p className="card-desc">Ngăn chặn các tệ nạn xã hội xâm nhập vào buôn làng, phòng chống bạo lực gia đình và giữ gìn an ninh trật tự nông thôn.</p>
                <div className="warning-list">
                  <div className="warning-item">🔴 <strong>Tố giác tội phạm:</strong> Phát hiện các điểm nghi vấn tàng trữ ma túy, cờ bạc phải báo công an.</div>
                  <div className="warning-item">🔴 <strong>Sống văn minh:</strong> Tham gia tích cực vào các hoạt động thể thao, văn nghệ quần chúng lành mạnh.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. Đấu Trí Tình Huống (Educational Game) ─── */}
        <section className="quiz-scenario-section">
          <div className="quiz-header">
            <h2>🧠 Trò Chơi Tình Huống: Ứng Phó Tệ Nạn</h2>
            <p>Bà con hãy cùng trả lời các câu hỏi tình huống dưới đây để biết cách tự bảo vệ bản thân và gia đình mình nhé!</p>
          </div>

          <div className="scenarios-list">
            {DS_TINH_HUONG.map((q) => {
              const userAns = selectedAnswers[q.id];
              return (
                <div className="scenario-item-box" key={q.id}>
                  <div className="scenario-question">{q.question}</div>
                  <div className="scenario-options">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = userAns?.optionIdx === oIdx;
                      let btnClass = 'opt-btn';
                      if (isSelected) {
                        btnClass += opt.isCorrect ? ' opt-correct' : ' opt-wrong';
                      }
                      return (
                        <button 
                          key={oIdx}
                          className={btnClass}
                          disabled={userAns !== undefined}
                          onClick={() => handleSelectOption(q.id, oIdx, opt.isCorrect)}
                        >
                          {opt.text} {isSelected && (opt.isCorrect ? '✅' : '❌')}
                        </button>
                      );
                    })}
                  </div>
                  {userAns && (
                    <div className={`scenario-feedback ${userAns.isCorrect ? 'fb-correct' : 'fb-wrong'}`}>
                      <strong>{userAns.isCorrect ? '🎉 Bạn trả lời đúng!' : '⚠️ Hãy lưu ý:'}</strong> {q.explain}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 5. Nút thoát quay về Trang chủ ─── */}
        <div className="back-footer">
          <a href="/" className="btn-exit-to-home">
            🚪 THOÁT VỀ TRANG CHỦ
          </a>
        </div>

      </div>
    </div>
  );
}
