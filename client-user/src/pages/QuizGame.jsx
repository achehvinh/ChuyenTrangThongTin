import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import "./QuizGame.css";

const QUESTIONS = [
  {
    question: "Khi thấy bạn bị rơi xuống ao, hồ và đang đuối nước, điều đầu tiên em nên làm là gì?",
    options: [
      "Nhảy ngay xuống nước để kéo bạn lên",
      "Hét thật to gọi người lớn đến cứu giúp",
      "Bỏ chạy đi chỗ khác vì sợ hãi",
      "Đứng xem và quay video điện thoại",
    ],
    correct: 1,
    explain:
      "Tuyệt đối KHÔNG tự ý nhảy xuống nước cứu bạn khi em chưa có kỹ năng cứu hộ chuyên nghiệp. Hãy hét thật to để gọi người lớn xung quanh đến giúp ngay lập tức nhé!",
  },
  {
    question: "Số điện thoại khẩn cấp nào dùng để gọi Cấp cứu Y tế tại Việt Nam?",
    options: ["113", "114", "115", "116"],
    correct: 2,
    explain: "115 là số điện thoại khẩn cấp gọi Cấp cứu Y tế để giúp cấp cứu nạn nhân đuối nước kịp thời.",
  },
  {
    question: "Trước khi bước xuống tàu, thuyền, bè hoặc chơi đùa gần sông nước, em cần làm gì?",
    options: [
      "Mặc áo phao bảo hộ đúng quy cách",
      "Mang theo điện thoại thông minh",
      "Đội mũ bảo hiểm bảo vệ đầu",
      "Không cần chuẩn bị gì cả",
    ],
    correct: 0,
    explain: "Mặc áo phao giúp cơ thể bé luôn nổi trên mặt nước và bảo vệ an toàn nếu chẳng may trượt chân ngã xuống nước.",
  },
  {
    question: "Dấu hiệu nào sau đây cho thấy một người đang bị đuối nước thực tế?",
    options: [
      "Vẫy tay chào lớn và cười nói vui vẻ",
      "Bơi rất nhanh về phía bờ cát",
      "Đầu chìm dập dềnh sát mặt nước, mắt đờ đẫn, miệng ngậm nước không kêu cứu được",
      "Hát to dưới nước để thu hút sự chú ý",
    ],
    correct: 2,
    explain:
      "Người đuối nước thực tế thường miệng chìm dập dềnh sát mặt nước, mắt lờ đờ, không thể hét lên kêu cứu và hai tay quạt yếu ớt trên mặt nước.",
  },
  {
    question: "Khi muốn cứu bạn đuối nước từ trên bờ, em nên chọn dùng vật dụng trung gian nào?",
    options: [
      "Nhảy xuống nắm tay bạn kéo lên",
      "Ném phao, đưa sào tre, cành cây hoặc ném dây thừng để bạn bám vào",
      "Chờ bạn chìm hẳn rồi mới cứu",
      "Không làm gì cả",
    ],
    correct: 1,
    explain:
      "Hãy đứng trên bờ thật vững chãi, đưa sào tre, cành cây dài hoặc ném phao, dây thừng cho bạn bám vào rồi kéo bạn vào bờ an toàn.",
  },
  {
    question: "Em có nên tự ý đi tắm sông, suối, ao, hồ một mình vào buổi trưa hoặc ngày nắng nóng không?",
    options: [
      "Có, nếu em tự tin mình bơi rất giỏi",
      "Có, đi tắm một mình cho tự do thoải mái",
      "Không, luôn phải có người lớn biết bơi đi cùng giám sát",
      "Có, nếu rủ thêm bạn nhỏ đi cùng",
    ],
    correct: 2,
    explain:
      "Tuyệt đối không được tự ý tắm sông, suối, ao, hồ một mình hoặc chỉ rủ bạn nhỏ đi cùng. Luôn luôn phải có người lớn biết bơi đi kèm trông coi nhé.",
  },
  {
    question: "Nếu chẳng may em bị rơi xuống nước và không biết bơi, em nên làm gì để tự cứu mình?",
    options: [
      "Hoảng loạn, vẫy vùng thật mạnh và khóc lóc",
      "Bình tĩnh nín thở, ngửa đầu ra sau, dang rộng hai tay hai chân để cơ thể tự nổi (thả nổi ngửa)",
      "Cố gắng bơi thật nhanh dù không biết bơi",
      "Buông xuôi không hành động gì cả",
    ],
    correct: 1,
    explain: "Hãy cố gắng giữ bình tĩnh, ngửa cổ ra sau, nín thở và hít thở nhẹ nhàng khi miệng nổi trên mặt nước (gọi là thả nổi ngửa) để chờ người đến cứu.",
  },
  {
    question: "Khi đi chơi ở bể bơi công cộng, bé nên bơi ở khu vực nào để được an toàn nhất?",
    options: [
      "Khu vực dành riêng cho trẻ em có độ sâu phù hợp và có nhân viên cứu hộ giám sát",
      "Khu vực nước sâu dành cho người lớn để thể hiện bản thân",
      "Bơi ở bất kỳ khu vực nào bé thích",
      "Khu vực máng trượt nước cảm giác mạnh mà không có người lớn đi cùng",
    ],
    correct: 0,
    explain: "Bé luôn nhớ chỉ bơi ở bể bơi dành cho trẻ em có mực nước thấp và có ba mẹ hoặc nhân viên cứu hộ túc trực gần bên.",
  },
  {
    question: "Sau khi vừa ăn cơm no xong, bé có nên nhảy ngay xuống nước để bơi lội không?",
    options: [
      "Có, nhảy xuống bơi ngay cho mát và dễ tiêu hóa",
      "Không, nên nghỉ ngơi ít nhất 30-45 phút để tránh bị chuột rút (vọp bẻ) và đau bụng",
      "Vừa bơi vừa ăn tiếp cho vui",
      "Chỉ xuống nước nghịch một lúc rồi lên ăn tiếp",
    ],
    correct: 1,
    explain: "Khi ăn no bơi ngay dễ gây đau bụng, co thắt dạ dày và chuột rút (vọp bẻ) rất nguy hiểm. Bé cần nghỉ ngơi 30-45 phút trước khi xuống bơi nhé.",
  },
  {
    question: "Khi đi dạo bờ sông, hồ mà thấy biển báo 'CẢNH BÁO: NƯỚC SÂU NGUY HIỂM', bé nên làm gì?",
    options: [
      "Lờ biển báo đi và xuống sát mép nước chơi",
      "Rủ bạn bè lại gần xem nước sâu thế nào",
      "Tuyệt đối tránh xa khu vực đó và tìm chỗ an toàn khác để chơi",
      "Ném đất đá xuống sông để nghịch nước",
    ],
    correct: 2,
    explain: "Biển báo nguy hiểm giúp chúng ta phòng tránh tai nạn. Bé tuyệt đối không được chơi đùa gần những nơi có đặt biển cảnh báo nước sâu này nhé!",
  },
];

export default function QuizGame() {
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Nhạc nền của game
  const [bgMusic] = useState(() => {
    const audio = new Audio('/audio/quiz-bgm.mp3');
    audio.loop = true;
    audio.volume = 0.25; // Nhẹ nhàng vừa đủ
    return audio;
  });
  const [musicPlaying, setMusicPlaying] = useState(true); // Mặc định bật để thu hút trẻ em

  // Quản lý thời gian đếm ngược
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef(null);

  const current = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;

  // Điều khiển nhạc nền BGM
  useEffect(() => {
    if (started && !finished && musicPlaying) {
      bgMusic.play().catch((err) => {
        console.log("BGM play blocked or audio file not present yet:", err);
      });
    } else {
      bgMusic.pause();
    }
  }, [started, finished, musicPlaying, bgMusic]);

  // Dừng nhạc khi rời trang
  useEffect(() => {
    return () => {
      bgMusic.pause();
    };
  }, [bgMusic]);

  // Xử lý tự động chạy thời gian đếm ngược
  useEffect(() => {
    if (started && !finished && selected === null) {
      setTimeLeft(15);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Hết giờ tự động chọn đáp án sai
            setSelected(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, currentIndex, finished, selected]);

  // Tự động chuyển câu tiếp theo sau 4 giây khi đã chọn đáp án hoặc hết giờ
  useEffect(() => {
    if (selected !== null) {
      const autoNextTimer = setTimeout(() => {
        handleNext();
      }, 4000);
      return () => clearTimeout(autoNextTimer);
    }
  }, [selected, currentIndex]);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelected(idx);

    if (idx === current.correct) {
      setScore((s) => s + 1);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 1800);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    if (playerName.trim() === "") {
      alert("Vui lòng nhập tên của em để bắt đầu cuộc thi nhé!");
      return;
    }
    setStarted(true);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setTimeLeft(15);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleMusic = () => {
    setMusicPlaying((prev) => !prev);
  };

  // MÀN HÌNH CHÀO MỪNG NHẬP TÊN
  if (!started) {
    return (
      <div className="quiz-start-container children-theme">
        {/* Bong bóng và họa tiết trang trí vui nhộn */}
        <div className="decor-bubble bubble-1">🎈</div>
        <div className="decor-bubble bubble-2">🐬</div>
        <div className="decor-bubble bubble-3">🐠</div>
        <div className="decor-bubble bubble-4">🌟</div>
        <div className="decor-bubble bubble-5">🧸</div>

        <div className="quiz-start-header">
          <span className="quiz-badge-icon-bouncy">🎖️</span>
          <h2>Thử Thách Hiệp Sĩ An Toàn Nguồn Nước</h2>
          <p>Bé hãy trả lời các câu hỏi để chứng minh kiến thức phòng chống đuối nước và nhận Bằng khen vinh danh từ UBND Xã Đăk Pxi nhé!</p>
        </div>

        <form onSubmit={handleStartGame} className="quiz-start-form">
          <label htmlFor="student-name">Nhập họ và tên của bé:</label>
          <input
            id="student-name"
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={30}
            required
            autoComplete="off"
          />
          <button type="submit" className="quiz-start-btn bouncy-btn">
            Bắt đầu Thử thách 🚀
          </button>
        </form>
      </div>
    );
  }

  // MÀN HÌNH KẾT QUẢ & BẰNG KHEN
  if (finished) {
    const passed = score >= 8; // Cần đúng 8/10 câu để đạt bằng khen

    return (
      <div className="quiz-result-wrapper">
        {passed && <Confetti numberOfPieces={150} recycle={false} />}

        {passed ? (
          <div className="quiz-certificate-section">
            {/* Nút In bằng khen nằm ngoài khung in */}
            <div className="print-controls">
              <p className="passed-title">🎉 Chúc mừng em đã xuất sắc vượt qua cuộc thi!</p>
              <div className="print-buttons">
                <button className="quiz-print-btn" onClick={handlePrint}>
                  🖨️ In / Tải Bằng Khen của em
                </button>
                <button className="quiz-restart-btn text" onClick={handleRestart}>
                  🔄 Chơi lại
                </button>
              </div>
            </div>

            {/* BẢN BẰNG KHEN IN ĐƯỢC CHUẨN ĐẸP */}
            <div className="dn-certificate" id="print-area">
              <div className="certificate-border">
                <div className="certificate-inner">
                  {/* Quốc hiệu */}
                  <div className="cert-header">
                    <p className="cert-nation">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="cert-motto">Độc lập - Tự do - Hạnh phúc</p>
                    <div className="cert-divider">🌟</div>
                  </div>

                  {/* Cơ quan cấp */}
                  <div className="cert-issuer">
                    <p>ỦY BAN NHÂN DÂN XÃ ĐĂK PXI</p>
                    <p>TỈNH QUẢNG NGÃI</p>
                  </div>

                  {/* Tiêu đề Giấy Chứng Nhận */}
                  <div className="cert-title-container">
                    <h1 className="cert-title">GIẤY CHỨNG NHẬN</h1>
                    <p className="cert-subtitle">DANH HIỆU HIỆP SĨ AN TOÀN NGUỒN NƯỚC</p>
                  </div>

                  {/* Nội dung khen tặng */}
                  <div className="cert-content">
                    <p className="cert-intro">Ủy ban nhân dân xã Đăk Pxi chứng nhận em:</p>
                    <h2 className="cert-name">{playerName.toUpperCase()}</h2>
                    <p className="cert-reason">
                      Đã hoàn thành xuất sắc khóa học tương tác trực tuyến về Kỹ năng Phòng chống đuối nước và ứng phó tai nạn sông nước năm 2026.
                    </p>
                  </div>

                  {/* Con dấu và Chữ ký */}
                  <div className="cert-footer">
                    <div className="cert-date">
                      <p>Đăk Pxi, ngày 14 tháng 07 năm 2026</p>
                      <p className="cert-sign-title">TM. ỦY BAN NHÂN DÂN XÃ</p>
                      <p className="cert-signer-role">CHỦ TỊCH</p>
                      <div className="cert-signature-space">
                        {/* Con dấu đỏ giả lập bằng CSS */}
                        <div className="cert-stamp">
                          <span className="stamp-inner">UBND XÃ ĐĂK PXI</span>
                        </div>
                        <p className="cert-signer-name">Phan Văn Cường</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="quiz-card quiz-failed">
            <div className="quiz-result-emoji">😢</div>
            <div className="quiz-result-title">Cố lên em ơi!</div>
            <div className="quiz-result-score">
              Em đạt {score} / {QUESTIONS.length} câu đúng
            </div>
            <p className="quiz-failed-msg">
              Em cần trả lời đúng tối thiểu <strong>8/10 câu</strong> để được nhận Giấy chứng nhận danh giá từ UBND xã. Hãy đọc kỹ lại cẩm nang học tập ở trên và thử lại nhé!
            </p>
            <button className="quiz-start-btn" onClick={handleRestart}>
              🔄 Thử sức lại ngay
            </button>
          </div>
        )}
      </div>
    );
  }

  // MÀN HÌNH CHƠI GAME CÂU HỎI
  return (
    <div className="quiz-card children-theme">
      {/* Họa tiết trang trí góc vui tươi */}
      <div className="decor-badge corner-1">🐬</div>
      <div className="decor-badge corner-2">🌟</div>

      {/* Pháo hoa nhẹ khi trả lời đúng */}
      {showConfetti && <Confetti numberOfPieces={40} recycle={false} />}

      {/* Thanh tiến trình & Đồng hồ đếm ngược */}
      <div className="quiz-header-status">
        <div className="quiz-progress-info">
          <span>Câu {currentIndex + 1} / {QUESTIONS.length}</span>
          <div className="quiz-bar-bg">
            <div
              className="quiz-bar-fill"
              style={{
                width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`,
              }}
            >
              <span className="progress-swimmer-emoji">🏊</span>
            </div>
          </div>
        </div>

        <div className="quiz-header-actions">
          <button 
            type="button" 
            className={`music-toggle-btn ${musicPlaying ? 'active' : ''}`}
            onClick={toggleMusic}
            title={musicPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
          >
            {musicPlaying ? "🎵 Nhạc: Bật" : "🔇 Nhạc: Tắt"}
          </button>
          
          <div className={`quiz-timer ${timeLeft <= 5 ? "danger" : ""}`}>
            ⏰ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Câu hỏi */}
      <div className="quiz-question">{current.question}</div>

      {/* Đáp án */}
      <div className="quiz-options">
        {current.options.map((opt, idx) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (idx === current.correct) cls += " correct";
            else if (idx === selected) cls += " incorrect";
            else cls += " disabled";
          }
          // Thêm class màu phấn nhẹ tương ứng cho từng đáp án
          cls += ` opt-${String.fromCharCode(97 + idx)}`;
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="option-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Hiển thị giải thích sau khi trả lời hoặc hết giờ */}
      {selected !== null && (
        <div className="quiz-explain-box animate-fadeIn">
          <div className="explain-header">
            {selected === current.correct ? (
              <span className="correct-label">🎉 Giỏi quá! Bé trả lời đúng rồi!</span>
            ) : selected === -1 ? (
              <span className="timeout-label">⏰ Hết giờ mất rồi bé ơi!</span>
            ) : (
              <span className="incorrect-label">💡 Chưa chính xác, thử lại ở câu sau nhé!</span>
            )}
          </div>
          <p className="explain-body">
            <strong>🐢 Chú rùa Kiki khuyên bé: </strong>
            {current.explain}
          </p>
        </div>
      )}

      {/* Nút đi tiếp */}
      {selected !== null && (
        <button className="quiz-next-btn bouncy-btn" onClick={handleNext}>
          {isLast ? "Xem Kết Quả Cuộc Thi 🏆" : "Câu tiếp theo →"}
        </button>
      )}
    </div>
  );
}