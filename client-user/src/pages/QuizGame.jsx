import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { API_URL } from "../utils/apiConfig";
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
  const hasSubmittedRef = useRef(false);

  const current = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;

  // Tự động lưu kết quả cuộc thi vào cơ sở dữ liệu thật khi hoàn thành
  useEffect(() => {
    if (finished && !hasSubmittedRef.current && playerName.trim()) {
      hasSubmittedRef.current = true;
      const isPassed = score >= 8;
      fetch(`${API_URL}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score,
          totalQuestions: QUESTIONS.length,
          passed: isPassed,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("✅ Đã lưu kết quả thi thành công:", data.data);
          }
        })
        .catch((err) => {
          console.error("❌ Lỗi khi lưu kết quả thi:", err);
        });
    }
  }, [finished, playerName, score]);

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
    hasSubmittedRef.current = false;
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

  // MÀN HÌNH CHÀO MỪNG NHẬP TÊN (THIẾT KẾ ĐẸP CHUẨN 100% THEO ẢNH 2)
  if (!started) {
    return (
      <div className="quiz-modal-container">
        {/* Nút Đóng duy nhất ở góc trên bên phải của Modal */}
        <button
          type="button"
          className="quiz-modal-close-btn"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = "/";
            }
          }}
        >
          ✕ Đóng
        </button>

        {/* Khung Card Trắng Trung Tâm */}
        <div className="quiz-inner-white-card">
          {/* Bong bóng đỏ góc trên trái */}
          <div className="decor-item balloon-top-left">
            <svg width="42" height="52" viewBox="0 0 50 65" fill="none">
              <ellipse cx="25" cy="22" rx="18" ry="22" fill="#ef4444"/>
              <polygon points="25,44 21,48 29,48" fill="#dc2626"/>
              <path d="M25 48 Q 20 56 25 64" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Cá bơi góc trên phải */}
          <div className="decor-item fish-top-right">
            <svg width="45" height="38" viewBox="0 0 60 50" fill="none">
              <ellipse cx="32" cy="25" rx="20" ry="16" fill="#3b82f6"/>
              <polygon points="12,25 0,12 0,38" fill="#f59e0b"/>
              <circle cx="42" cy="20" r="3.5" fill="#ffffff"/>
              <circle cx="43" cy="20" r="1.8" fill="#0f172a"/>
              <path d="M 28 20 Q 34 26 28 32" stroke="#60a5fa" strokeWidth="2" fill="none"/>
            </svg>
          </div>

          {/* Huy hiệu Vàng Trung tâm */}
          <div className="quiz-start-medal-box">
            <div className="medal-sunburst"></div>
            <div className="medal-ribbon-badge">
              <svg width="84" height="94" viewBox="0 0 100 110" fill="none">
                <path d="M 32 0 L 22 45 L 36 40 L 50 45 L 38 0 Z" fill="#2563eb"/>
                <path d="M 68 0 L 78 45 L 64 40 L 50 45 L 62 0 Z" fill="#ef4444"/>
                <path d="M 42 0 L 50 45 L 58 0 Z" fill="#ffffff"/>
                <circle cx="50" cy="65" r="36" fill="#f59e0b"/>
                <circle cx="50" cy="65" r="30" fill="#d97706"/>
                <circle cx="50" cy="65" r="26" fill="#fbbf24"/>
                <polygon points="50,47 55,58 67,58 57,66 61,78 50,70 39,78 43,66 33,58 45,58" fill="#d97706"/>
              </svg>
            </div>
          </div>

          {/* Tiêu đề & Mô tả */}
          <div className="quiz-start-title-section">
            <h1 className="quiz-start-main-title">
              Thử Thách Hiệp Sĩ<br />
              An Toàn Nguồn Nước
            </h1>
            <p className="quiz-start-desc">
              Bé hãy trả lời các câu hỏi để chứng minh kiến thức<br />
              phòng chống đuối nước và nhận Bằng khen vinh danh<br />
              từ UBND Xã Đăk Pxi nhé! 🧸
            </p>
          </div>

          {/* Form nhập tên & Nút Thử thách */}
          <form onSubmit={handleStartGame} className="quiz-start-new-form">
            <div className="quiz-label-pill-badge">
              <span className="star-sparkle left">✨</span>
              <span>Nhập họ và tên của bé:</span>
              <span className="star-sparkle right">✨</span>
            </div>

            <div className="quiz-input-field-box">
              <span className="input-user-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="student-name"
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={35}
                required
                autoComplete="off"
              />
              <span className="input-star-decor">⭐</span>
            </div>

            <button type="submit" className="quiz-start-submit-btn bouncy-btn">
              <span>Bắt đầu Thử thách</span>
              <span className="rocket-emoji">🚀</span>
            </button>
          </form>
        </div>

        {/* Chú cá heo nhảy sóng biển góc dưới trái của Modal */}
        <div className="decor-dolphin-container">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            {/* Sóng bọt biển */}
            <path d="M 0 100 Q 30 85 60 100 T 120 100 L 120 120 L 0 120 Z" fill="#60a5fa" opacity="0.5"/>
            <path d="M 0 105 Q 40 90 80 105 T 120 105 L 120 120 L 0 120 Z" fill="#0284c7"/>
            {/* Cá heo */}
            <path d="M 20 90 Q 35 40 75 45 Q 95 50 100 65 Q 80 60 65 75 Q 45 90 20 90 Z" fill="#38bdf8"/>
            <path d="M 45 75 Q 60 70 70 78 Q 55 85 45 75 Z" fill="#ffffff"/>
            <circle cx="80" cy="55" r="3" fill="#0f172a"/>
            <path d="M 90 60 Q 95 62 90 65" stroke="#0f172a" strokeWidth="1.5"/>
            <circle cx="95" cy="40" r="3" fill="#bae6fd"/>
            <circle cx="105" cy="50" r="2" fill="#bae6fd"/>
            <circle cx="85" cy="35" r="2.5" fill="#bae6fd"/>
          </svg>
        </div>

        {/* Dải sóng biển đáy Modal */}
        <div className="quiz-modal-bottom-waves">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="#38bdf8" opacity="0.6"></path>
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="#0284c7"></path>
          </svg>
        </div>
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

            {/* BẢN BẰNG KHEN IN ĐƯỢC CHUẨN ĐẸP THEO MẪU MỚI */}
            <div className="dn-certificate" id="print-area">
              <div className="certificate-border">
                <div className="certificate-inner">
                  {/* QUỐC HUY VIỆT NAM TRÊN CÙNG */}
                  <div className="cert-national-emblem">
                    <svg width="52" height="52" viewBox="0 0 100 100" fill="none">
                      <circle cx="50" cy="50" r="46" fill="#da251d" stroke="#fef08a" strokeWidth="3"/>
                      <circle cx="50" cy="50" r="41" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="3 2"/>
                      <polygon points="50,18 59,38 80,38 63,51 69,72 50,59 31,72 37,51 20,38 41,38" fill="#fef08a"/>
                    </svg>
                  </div>

                  {/* Quốc hiệu */}
                  <div className="cert-header">
                    <p className="cert-nation">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="cert-motto">Độc lập - Tự do - Hạnh phúc</p>
                    <div className="cert-stars-line">✦ ★ ✦</div>
                  </div>

                  {/* Cơ quan cấp */}
                  <div className="cert-issuer">
                    <p className="issuer-line1">ỦY BAN NHÂN DÂN XÃ ĐẮK PXI</p>
                    <p className="issuer-line2">TỈNH QUẢNG NGÃI</p>
                    <div className="cert-flourish">────── ❖ ──────</div>
                  </div>

                  {/* Tiêu đề Giấy Chứng Nhận */}
                  <div className="cert-title-container">
                    <h1 className="cert-title">GIẤY CHỨNG NHẬN</h1>
                    <p className="cert-subtitle">DANH HIỆU HIỆP SĨ AN TOÀN NGUỒN NƯỚC</p>
                    <div className="cert-stars-line small">✦ ★ ✦</div>
                  </div>

                  {/* Nội dung khen tặng */}
                  <div className="cert-content">
                    <p className="cert-intro">Ủy ban nhân dân xã Đăk Pxi chứng nhận em:</p>
                    <h2 className="cert-name">{playerName.toUpperCase()}</h2>
                    <p className="cert-reason">
                      Đã hoàn thành xuất sắc khóa học tương tác trực tuyến<br />
                      về Kỹ năng Phòng chống đuối nước<br />
                      và ứng phó tai nạn sông nước năm 2026.
                    </p>
                  </div>

                  {/* Chân Bằng khen: Huy hiệu Vàng Trái & Con dấu + Chữ ký Phải */}
                  <div className="cert-footer">
                    {/* TRÁI: Huy hiệu Vàng "VÌ MỘT CỘNG ĐỒNG AN TOÀN" */}
                    <div className="cert-gold-badge">
                      <div className="badge-laurel-wreath">
                        <svg width="68" height="68" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="#fffbeb" stroke="#d97706" strokeWidth="4"/>
                          <circle cx="50" cy="50" r="36" fill="none" stroke="#f59e0b" strokeWidth="1.5"/>
                          <circle cx="50" cy="50" r="28" fill="#0284c7"/>
                          <path d="M 50 32 Q 40 46 50 58 Q 60 46 50 32 Z" fill="#ffffff"/>
                          <circle cx="50" cy="48" r="4" fill="#0284c7"/>
                        </svg>
                      </div>
                      <div className="badge-ribbon">
                        <span>VÌ MỘT CỘNG ĐỒNG AN TOÀN</span>
                      </div>
                    </div>

                    {/* PHẢI: Ngày tháng & Chữ ký */}
                    <div className="cert-date-section">
                      <p className="cert-date-str">Đăk Pxi, ngày 14 tháng 07 năm 2026</p>
                      <p className="cert-sign-title">TM. ỦY BAN NHÂN DÂN XÃ</p>
                      <p className="cert-signer-role">CHỦ TỊCH</p>
                      <div className="cert-signature-space">
                        {/* Con dấu đỏ tròn */}
                        <div className="cert-official-stamp">
                          <div className="stamp-circle-outer">
                            <span className="stamp-txt-top">UBND XÃ ĐK PXI</span>
                            <span className="stamp-txt-star">★</span>
                          </div>
                        </div>

                        {/* Chữ ký viết tay xanh */}
                        <svg className="cert-handwriting-sig" viewBox="0 0 160 60" width="110" height="40">
                          <path d="M 15 38 Q 32 8 48 32 T 78 18 Q 98 42 125 12 L 145 28 M 28 46 L 138 42" fill="none" stroke="#1d4ed8" strokeWidth="2.8" strokeLinecap="round" />
                        </svg>

                        <p className="cert-signer-name">Phan Văn Cường</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dải hoa văn lượn sóng xanh-vàng đáy bằng khen */}
              <div className="cert-bottom-wave-bg">
                <svg viewBox="0 0 800 80" preserveAspectRatio="none">
                  <path d="M 0 40 Q 200 80 400 40 T 800 40 L 800 80 L 0 80 Z" fill="#0369a1" />
                  <path d="M 0 55 Q 200 85 400 50 T 800 65 L 800 80 L 0 80 Z" fill="#0284c7" />
                  <path d="M 0 70 Q 200 75 400 68 T 800 74 L 800 80 L 0 80 Z" fill="#d97706" />
                </svg>
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
