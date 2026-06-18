import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./QuizGame.css";

const QUESTIONS = [
  {
    question: "Khi thấy bạn bị đuối nước, điều đầu tiên em nên làm là gì?",
    image:"/images/quiz1.jpg",
    options: [
      "Nhảy xuống cứu bạn ngay",
      "Hét to gọi người lớn đến giúp",
      "Bỏ đi vì sợ",
      "Đứng quay video lại",
    ],
    correct: 1,
    explain:
      "Tuyệt đối KHÔNG tự ý nhảy xuống nếu em không biết bơi và chưa được học kỹ năng cứu hộ. Hãy hét to gọi người lớn đến ngay!",
  },
  {
    question: "Số điện thoại nào để gọi cấp cứu y tế?",
    options: ["113", "114", "115", "116"],
    correct: 2,
    explain: "115 là số cấp cứu y tế. Hãy gọi ngay khi có người bị đuối nước.",
  },
  {
    question: "Trước khi đi thuyền, bè trên sông, em cần làm gì?",
    options: [
      "Mặc áo phao",
      "Mang theo điện thoại",
      "Đội mũ bảo hiểm",
      "Không cần làm gì",
    ],
    correct: 0,
    explain: "Áo phao giúp em không bị chìm nếu chẳng may rơi xuống nước.",
  },
  {
    question: "Dấu hiệu nào cho thấy một người có thể đang bị đuối nước?",
    options: [
      "Vẫy tay chào to và cười",
      "Đầu chìm dần, mắt lờ đờ, không kêu được",
      "Bơi rất nhanh về bờ",
      "Hát to khi ở dưới nước",
    ],
    correct: 1,
    explain:
      "Người đuối nước thường im lặng, không kêu cứu được, vùng vẫy yếu và đầu chìm dần xuống nước.",
  },
  {
    question:
      "Khi cứu người bị đuối nước mà không biết bơi, em nên dùng vật gì?",
    options: [
      "Nắm tay kéo trực tiếp",
      "Phao, dây thừng, hoặc sào tre",
      "Nhảy xuống cùng để kéo lên",
      "Không làm gì cả",
    ],
    correct: 1,
    explain:
      "Hãy ném phao, dây thừng hoặc đưa sào tre cho nạn nhân bám vào, sau đó kéo họ lên bờ.",
  },
  {
    question: "Em có nên đi tắm sông, suối, ao hồ một mình không?",
    options: [
      "Có, nếu biết bơi",
      "Có, nếu trời nắng",
      "Không, luôn phải có người lớn đi cùng",
      "Có, vào buổi trưa",
    ],
    correct: 2,
    explain:
      "Dù biết bơi hay không, các em nhỏ không nên tự ý ra sông, suối, ao hồ mà không có người lớn giám sát.",
  },
];

export default function QuizGame() {
const [currentIndex, setCurrentIndex] = useState(0);
const [selected, setSelected] = useState(null);
const [score, setScore] = useState(0);
const [finished, setFinished] = useState(false);

const [showConfetti, setShowConfetti] = useState(false);
const [answerEffect, setAnswerEffect] = useState("");

  const current = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;

const handleSelect = (idx) => {
  if (selected !== null) return;

  setSelected(idx);

  if (idx === current.correct) {
    setScore((s) => s + 1);

    setAnswerEffect("correct");

    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
    }, 1500);
  } else {
    setAnswerEffect("wrong");
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

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((score / QUESTIONS.length) * 100);
    let message = "Cần cố gắng hơn nhé!";
    let emoji = "💪";
    if (percent === 100) {
      message = "Xuất sắc! Em đã nắm rất tốt kiến thức an toàn!";
      emoji = "🏆";
    } else if (percent >= 70) {
      message = "Tốt lắm! Hãy ghi nhớ thêm các quy tắc an toàn nhé!";
      emoji = "🌟";
    } else if (percent >= 40) {
      message = "Khá ổn! Hãy xem lại các quy tắc an toàn ở trên nhé!";
      emoji = "👍";
    }

    return (
      <div className="quiz-card quiz-result">
        <div className="quiz-result-emoji">{emoji}</div>
        <div className="quiz-result-title">Hoàn thành!</div>
        <div className="quiz-result-score">
          {score} / {QUESTIONS.length} câu đúng
        </div>
        <div className="quiz-result-message">{message}</div>
        <button className="quiz-restart-btn" onClick={handleRestart}>
          🔄 Làm lại
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-progress">
        <div className="quiz-progress-text">
          Câu {currentIndex + 1} / {QUESTIONS.length}
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="quiz-question">{current.question}</div>

      <div className="quiz-options">
        {current.options.map((opt, idx) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (idx === current.correct) cls += " correct";
            else if (idx === selected) cls += " incorrect";
          }
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="quiz-explain">
          <div className="quiz-explain-icon">
            {selected === current.correct ? "✅" : "❌"}
          </div>
          <div className="quiz-explain-text">{current.explain}</div>
        </div>
      )}

      {selected !== null && (
        <button className="quiz-next-btn" onClick={handleNext}>
          {isLast ? "Xem kết quả" : "Câu tiếp theo →"}
        </button>
      )}
    </div>
  );
}