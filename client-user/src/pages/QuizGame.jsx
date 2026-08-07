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

export default function QuizGame({ onClose }) {
  const [playerName, setPlayerName] = useState("");
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
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
          details: userAnswers,
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
            setUserAnswers((prev) => [
              ...prev,
              {
                questionIndex: currentIndex,
                questionText: current.question,
                options: current.options,
                selectedOption: -1,
                correctOption: current.correct,
                isCorrect: false,
                explain: current.explain,
              },
            ]);
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

    const isCorr = idx === current.correct;
    if (isCorr) {
      setScore((s) => s + 1);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 1800);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentIndex,
        questionText: current.question,
        options: current.options,
        selectedOption: idx,
        correctOption: current.correct,
        isCorrect: isCorr,
        explain: current.explain,
      },
    ]);
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
    setUserAnswers([]);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setTimeLeft(15);
  };

  const handleExit = () => {
    if (onClose) {
      onClose();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleMusic = () => {
    setMusicPlaying((prev) => !prev);
  };

  // MÀN HÌNH CHÀO MỪNG NHẬP TÊN (THIẾT KẾ ĐẸP CHUẨN 100% THEO THIẾT KẾ MỚI)
  if (!started) {
    return (
      <div className="quiz-modal-container">
        {/* Khung Card Trắng Trung Tâm */}
        <div className="quiz-inner-white-card">
          {/* Nút Đóng góc trên bên phải chuẩn đẹp sang trọng */}
          <button
            type="button"
            className="quiz-card-close-btn"
            title="Đóng cửa sổ"
            onClick={() => {
              if (onClose) {
                onClose();
              } else if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Đóng</span>
          </button>

          {/* Bong bóng đỏ góc trên trái */}
          <div className="decor-item balloon-top-left">
            <svg width="44" height="56" viewBox="0 0 50 65" fill="none">
              <defs>
                <linearGradient id="balloonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              <ellipse cx="25" cy="22" rx="18" ry="22" fill="url(#balloonGrad)"/>
              <ellipse cx="20" cy="15" rx="5" ry="8" fill="#ffffff" opacity="0.45"/>
              <polygon points="25,44 21,48 29,48" fill="#b91c1c"/>
              <path d="M25 48 Q 18 56 25 64" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Cá bơi góc trên phải */}
          <div className="decor-item fish-top-right">
            <svg width="46" height="38" viewBox="0 0 60 50" fill="none">
              <defs>
                <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <ellipse cx="34" cy="25" rx="18" ry="14" fill="url(#fishGrad)"/>
              <polygon points="16,25 4,14 4,36" fill="#f59e0b"/>
              <circle cx="43" cy="20" r="4" fill="#ffffff"/>
              <circle cx="44" cy="20" r="2" fill="#0f172a"/>
              <path d="M 29 19 Q 34 25 29 31" stroke="#93c5fd" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Huy hiệu Vàng Trung tâm */}
          <div className="quiz-start-medal-box">
            <div className="medal-sunburst"></div>
            <div className="medal-ribbon-badge">
              <svg width="92" height="102" viewBox="0 0 100 110" fill="none">
                {/* Ribbons */}
                <path d="M 32 0 L 20 48 L 36 42 L 50 48 L 38 0 Z" fill="#2563eb"/>
                <path d="M 68 0 L 80 48 L 64 42 L 50 48 L 62 0 Z" fill="#ef4444"/>
                <path d="M 42 0 L 50 48 L 58 0 Z" fill="#ffffff" opacity="0.8"/>
                {/* Medal Circles */}
                <circle cx="50" cy="66" r="36" fill="#f59e0b"/>
                <circle cx="50" cy="66" r="30" fill="#d97706"/>
                <circle cx="50" cy="66" r="26" fill="#fbbf24"/>
                {/* Star */}
                <polygon points="50,48 54,58 65,58 56,65 59,76 50,69 41,76 44,65 35,58 46,58" fill="#d97706"/>
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
              phòng chống đuối nước và đạt điểm số vinh danh<br />
              từ Hệ thống BHYT nhé! 🧸
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
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Chú cá heo nhảy sóng biển góc dưới trái */}
        <div className="decor-dolphin-container">
          <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
            <path d="M 20 85 Q 35 35 75 40 Q 95 45 100 60 Q 80 55 65 70 Q 45 85 20 85 Z" fill="#38bdf8"/>
            <path d="M 45 70 Q 60 65 70 73 Q 55 80 45 70 Z" fill="#ffffff"/>
            <circle cx="80" cy="50" r="3" fill="#0f172a"/>
            <circle cx="95" cy="35" r="3" fill="#bae6fd"/>
            <circle cx="105" cy="45" r="2" fill="#bae6fd"/>
            <circle cx="85" cy="30" r="2.5" fill="#bae6fd"/>
          </svg>
        </div>

        {/* Dải sóng biển đáy Modal */}
        <div className="quiz-modal-bottom-waves">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,21.3C1200,21,1320,43,1380,53.3L1440,64L1440,120L0,120Z" fill="#38bdf8" opacity="0.6"></path>
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L0,120Z" fill="#0284c7"></path>
          </svg>
        </div>
      </div>
    );
  }

  // MÀN HÌNH KẾT QUẢ & HIỆN ĐIỂM CHÚC MƯỜNG (HTML5 CHUẨN)
  if (finished) {
    const passed = score >= 8;
    const percentage = Math.round((score / QUESTIONS.length) * 100);

    return (
      <main className="quiz-result-wrapper" id="print-area">
        {passed && <Confetti numberOfPieces={150} recycle={false} />}

        <article className="quiz-result-container animate-fadeIn">
          {/* Header Nút Đóng & Tiêu Đề Chúc Mừng */}
          <header className="quiz-result-header">
            <button
              type="button"
              className="quiz-card-close-btn"
              title="Thoát trò chơi"
              onClick={handleExit}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Thoát</span>
            </button>

            <figure className="result-hero-icon-box">
              {passed ? (
                /* Icon Cúp Vinh Danh SVG */
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" fill="#fef08a" />
                </svg>
              ) : (
                /* Icon Khiên Quyết Tâm SVG */
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#e0f2fe" />
                  <path d="m9 12 2 2 4-4" stroke="#0284c7" strokeWidth="2.5" />
                </svg>
              )}
            </figure>

            <h1 className="result-congrats-title">
              {passed ? `🎉 Chúc mừng ${playerName}!` : `Cố lên ${playerName} ơi!`}
            </h1>
            
            <p className="result-subtitle">
              {passed
                ? "Em đã xuất sắc hoàn thành Thử thách Kỹ năng Phòng chống đuối nước 2026!"
                : "Em đã hoàn thành cuộc thi! Hãy xem lại đáp án và thử lại để đạt kết quả cao hơn nhé!"}
            </p>
          </header>

          {/* Section Điểm số & Thống kê */}
          <section className="quiz-score-overview">
            <div className="score-ring-card">
              <div className="score-circle">
                <svg className="score-svg" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" className="score-bg-ring" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="score-fill-ring"
                    style={{
                      strokeDasharray: 326.7,
                      strokeDashoffset: 326.7 - (326.7 * score) / QUESTIONS.length,
                    }}
                  />
                </svg>
                <div className="score-number-box">
                  <span className="score-big">{score}</span>
                  <span className="score-total">/{QUESTIONS.length}</span>
                </div>
              </div>
              <p className="score-percentage-text">Tỷ lệ chính xác: <strong>{percentage}%</strong></p>
            </div>

            <div className="result-stats-grid">
              <article className="stat-box stat-rank">
                <span className="stat-label">Danh hiệu đạt được</span>
                <strong className={`stat-val ${passed ? "passed" : "pending"}`}>
                  {score === 10
                    ? "Hiệp sĩ An toàn Xuất sắc"
                    : score >= 8
                    ? "Hiệp sĩ An toàn Nguồn nước"
                    : score >= 5
                    ? "Tuyên truyền viên Nhí"
                    : "Học viên Tích cực"}
                </strong>
              </article>

              <article className="stat-box">
                <span className="stat-label">Số câu trả lời đúng</span>
                <strong className="stat-val text-success">{score} / {QUESTIONS.length} câu</strong>
              </article>

              <article className="stat-box">
                <span className="stat-label">Kết quả đánh giá</span>
                <strong className={`stat-val ${passed ? "text-passed" : "text-retry"}`}>
                  {passed ? (
                    <span className="stat-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      ĐẠT THỬ THÁCH
                    </span>
                  ) : (
                    <span className="stat-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      CHƯA ĐẠT (Cần ≥ 8/10)
                    </span>
                  )}
                </strong>
              </article>
            </div>
          </section>

          {/* Chi tiết đáp án từng câu hỏi */}
          {userAnswers && userAnswers.length > 0 && (
            <section className="quiz-answers-review">
              <h2 className="review-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
                <span>Chi tiết kết quả & Lời khuyên an toàn</span>
              </h2>

              <div className="review-list">
                {userAnswers.map((ans, idx) => (
                  <article
                    key={idx}
                    className={`review-card ${ans.isCorrect ? "review-correct" : "review-incorrect"}`}
                  >
                    <header className="review-card-header">
                      <span className="review-q-num">Câu {idx + 1}</span>
                      <span className={`review-status-pill ${ans.isCorrect ? "correct" : "incorrect"}`}>
                        {ans.isCorrect ? (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Đúng</span>
                          </>
                        ) : (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span>Chưa đúng</span>
                          </>
                        )}
                      </span>
                    </header>

                    <h3 className="review-q-text">{ans.questionText}</h3>

                    <div className="review-options-summary">
                      {ans.options.map((opt, oIdx) => {
                        let optCls = "review-opt-item";
                        if (oIdx === ans.correctOption) optCls += " is-correct-answer";
                        if (oIdx === ans.selectedOption && !ans.isCorrect) optCls += " is-user-wrong";
                        return (
                          <div key={oIdx} className={optCls}>
                            <span className="opt-marker">
                              {oIdx === ans.correctOption ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : oIdx === ans.selectedOption ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              ) : (
                                String.fromCharCode(65 + oIdx)
                              )}
                            </span>
                            <span className="opt-txt">{opt}</span>
                            {oIdx === ans.selectedOption && (
                              <span className="user-choice-badge">Lựa chọn của bé</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <footer className="review-explain-footer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.64 2.8 1.5 3.5.76.76 1.23 1.52 1.41 2.5" fill="#fef3c7" />
                      </svg>
                      <span><strong>Lời khuyên từ Kiki:</strong> {ans.explain}</span>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Thanh Nút Bấm Hành Động */}
          <nav className="quiz-result-action-bar">
            <button type="button" className="quiz-result-btn btn-restart bouncy-btn" onClick={handleRestart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
              </svg>
              <span>Chơi lại từ đầu</span>
            </button>

            <button type="button" className="quiz-result-btn btn-print bouncy-btn" onClick={handlePrint}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>In kết quả thi</span>
            </button>

            <button type="button" className="quiz-result-btn btn-exit bouncy-btn" onClick={handleExit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Thoát trò chơi</span>
            </button>
          </nav>
        </article>
      </main>
    );
  }

  // MÀN HÌNH CHƠI GAME CÂU HỎI
  return (
    <div className="quiz-card children-theme">
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
              <span className="progress-swimmer-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="3" />
                  <path d="M4 14l5-2 3 3 5-2 3 3" />
                  <path d="M2 20c3 0 4-1 6-1s3 1 6 1 4-1 6-1" stroke="#38bdf8" />
                </svg>
              </span>
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
            {musicPlaying ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span>Nhạc: Bật</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span>Nhạc: Tắt</span>
              </>
            )}
          </button>

          <div className={`quiz-timer ${timeLeft <= 5 ? "danger" : ""}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{timeLeft}s</span>
          </div>

          <button
            type="button"
            className="quiz-header-exit-btn"
            onClick={handleExit}
            title="Thoát trò chơi"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Thoát</span>
          </button>
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
              <span className="correct-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Giỏi quá! Bé trả lời đúng rồi!
              </span>
            ) : selected === -1 ? (
              <span className="timeout-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Hết giờ mất rồi bé ơi!
              </span>
            ) : (
              <span className="incorrect-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Chưa chính xác, thử lại ở câu sau nhé!
              </span>
            )}
          </div>
          <p className="explain-body">
            <strong>Chú rùa Kiki khuyên bé: </strong>
            {current.explain}
          </p>
        </div>
      )}

      {/* Nút đi tiếp */}
      {selected !== null && (
        <button className="quiz-next-btn bouncy-btn" onClick={handleNext}>
          <span>{isLast ? "Xem Kết Quả Cuộc Thi" : "Câu tiếp theo"}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      )}
    </div>
  );
}
