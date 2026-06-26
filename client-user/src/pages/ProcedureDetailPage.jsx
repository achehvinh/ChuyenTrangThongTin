import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Thutuchanhchinh.css";
import "./ProcedureDetailPage.css";
import {
  api,
  API_BASE_URL,
  getCitizenSessionId,
  normalizeList,
  normalizeDetail,
  formatFileSize,
  buildSpeakText,
  findMockProcedureBySlug,
  USE_MOCK_FALLBACK,
} from "../utils/procedureUtils";

/* ───────────────────────────────────────────────
   Bộ icon minh hoạ (đường nét, không dùng ảnh/emoji)
   Dùng chung cho: thông tin nhanh, đầu mục, từng bước...
   ─────────────────────────────────────────────── */
function PdpIcon({ type }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "documents":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="11" height="15" rx="1.5" />
          <rect x="8" y="6" width="11" height="15" rx="1.5" />
          <line x1="11" y1="11" x2="15" y2="11" />
          <line x1="11" y1="14" x2="15" y2="14" />
        </svg>
      );
    case "office":
      return (
        <svg {...common}>
          <rect x="4" y="9" width="16" height="12" rx="1" />
          <line x1="4" y1="21" x2="20" y2="21" />
          <path d="M8 9V5a4 4 0 0 1 8 0v4" />
          <line x1="9" y1="13" x2="9" y2="17" />
          <line x1="15" y1="13" x2="15" y2="17" />
        </svg>
      );
    case "form":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1.5" />
          <polyline points="8.5 12 10 13.5 14.5 9" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "certificate":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="6" />
          <polyline points="9.5 9 11 10.5 14.5 7" />
          <path d="M8.5 14.5 7 21l5-2.5 5 2.5-1.5-6.5" />
        </svg>
      );
    case "survey":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <line x1="15.5" y1="15.5" x2="20" y2="20" />
        </svg>
      );
    case "meeting":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="8" r="3" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M3 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
          <path d="M14.5 15.5c2.2.3 4 1.9 4 4.5" />
        </svg>
      );
    case "money":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="7" rx="7" ry="3" />
          <path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
          <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 16 14" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "condition":
      return (
        <svg {...common}>
          <path d="M9 11l2.5 2.5L17 8" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "speaker":
      return (
        <svg {...common}>
          <polygon points="3 9 7 9 11 5 11 19 7 15 3 15 3 9" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18 6a8 8 0 0 1 0 12" />
        </svg>
      );
    case "stop":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* Nhận diện loại icon phù hợp cho từng bước, dựa trên nội dung */
function resolveStepIcon(step) {
  const text = `${step.title || ""} ${step.content || ""}`.toLowerCase();
  if (/(giấy tờ|hồ sơ cần|chuẩn bị)/.test(text)) return "documents";
  if (/(ubnd|nộp hồ sơ|đến |cơ quan|bộ phận một cửa)/.test(text)) return "office";
  if (/(điền|tờ khai|ký)/.test(text)) return "form";
  if (/(nhận|kết quả|cấp |trao |thẻ)/.test(text)) return "certificate";
  if (/(khảo sát|thẩm định|đo đạc|xác minh|xác nhận)/.test(text)) return "survey";
  if (/(họp|xét duyệt|hội đồng)/.test(text)) return "meeting";
  if (/(giải ngân|vay|trợ cấp|hỗ trợ)/.test(text)) return "money";
  return null;
}

/* ───────────────────────────────────────────────
   Hướng dẫn từng bước — dạng timeline có icon + lưu tiến độ
   ─────────────────────────────────────────────── */
function StepGuideDetail({ procedure, sessionId }) {
  const [progress, setProgress] = useState({});
  const steps = procedure.steps || [];

  useEffect(() => {
    if (!procedure.id || !sessionId) return;
    api
      .get(`/progress/${sessionId}/${procedure.id}`)
      .then((res) => {
        const next = {};
        normalizeList(res.data).forEach((row) => {
          next[row.step_id || row.stepId] = Boolean(
            row.is_completed || row.isCompleted
          );
        });
        setProgress(next);
      })
      .catch(() => setProgress({}));
  }, [procedure.id, sessionId]);

  async function toggleStep(step) {
    const nextValue = !progress[step.id];
    setProgress((prev) => ({ ...prev, [step.id]: nextValue }));
    try {
      await api.put(`/progress/${sessionId}/steps/${step.id}`, {
        procedureId: procedure.id,
        isCompleted: nextValue,
      });
    } catch {
      /* không chặn UI nếu lưu tiến độ thất bại */
    }
  }

  const completed = steps.filter((s) => progress[s.id]).length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  if (!steps.length) {
    return (
      <section className="pdp-steps-section">
        <h3>Hướng dẫn từng bước</h3>
        <p className="pdp-empty-note">Thủ tục này chưa có quy trình chi tiết.</p>
      </section>
    );
  }

  return (
    <section className="pdp-steps-section">
      <div className="pdp-section-heading">
        <h3>Hướng dẫn từng bước</h3>
        <span className="pdp-progress-text">{percent}% hoàn thành</span>
      </div>
      <div className="pdp-progress-track">
        <div className="pdp-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <ol className="pdp-timeline">
        {steps.map((step, index) => {
          const checked = Boolean(progress[step.id]);
          const iconType = resolveStepIcon(step);
          return (
            <li className={`pdp-timeline-item ${checked ? "is-done" : ""}`} key={step.id || index}>
              <button
                className="pdp-step-marker"
                type="button"
                onClick={() => toggleStep(step)}
                aria-label={checked ? "Đã hoàn thành" : `Bước ${index + 1}`}
              >
                {checked ? "✓" : index + 1}
              </button>
              <div className="pdp-step-body">
                <div className="pdp-step-head">
                  {iconType && (
                    <span className="pdp-step-icon">
                      <PdpIcon type={iconType} />
                    </span>
                  )}
                  <h4>{step.title || `Bước ${index + 1}`}</h4>
                </div>
                <p>{step.content || step.detail}</p>
                {step.note && <small className="pdp-step-note">{step.note}</small>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ───────────────────────────────────────────────
   Biểu mẫu / file mẫu — khung sẵn, chờ bổ sung dữ liệu
   ─────────────────────────────────────────────── */
function FormDownloadSection({ forms = [] }) {
  return (
    <section className="pdp-panel">
      <div className="pdp-panel-head">
        <PdpIcon type="documents" />
        <h3>Biểu mẫu / File mẫu</h3>
      </div>
      {forms.length ? (
        <div className="pdp-forms-list">
          {forms.map((form) => (
            <a
              className="pdp-form-item"
              href={`${API_BASE_URL}/forms/${form.id}/download`}
              key={form.id}
              rel="noreferrer"
            >
              <span className="pdp-file-type">{form.file_type || form.fileType}</span>
              <span>
                <strong>{form.title}</strong>
                <small>{formatFileSize(form.file_size || form.fileSize)}</small>
              </span>
              <b className="pdp-form-download">Tải về</b>
            </a>
          ))}
        </div>
      ) : (
        // CHỖ TRỐNG: sẽ bổ sung file mẫu cho từng thủ tục sau
        <p className="pdp-empty-note">
          Thủ tục này chưa có biểu mẫu tải về. (Sẽ bổ sung sau)
        </p>
      )}
    </section>
  );
}

/* ───────────────────────────────────────────────
   Hỏi đáp thủ tục
   ─────────────────────────────────────────────── */
function QuestionSection({ procedureId }) {
  const [form, setForm] = useState({ fullName: "", phone: "", question: "" });
  const [status, setStatus] = useState("");

  async function submitQuestion(e) {
    e.preventDefault();
    setStatus("Đang gửi...");
    try {
      await api.post("/questions", { procedureId, ...form });
      setForm({ fullName: "", phone: "", question: "" });
      setStatus("Đã gửi. Cán bộ sẽ phản hồi sớm.");
    } catch {
      setStatus("Chưa gửi được. Vui lòng liên hệ Bộ phận Một cửa.");
    }
  }

  return (
    <section className="pdp-panel">
      <div className="pdp-panel-head">
        <PdpIcon type="form" />
        <h3>Hỏi đáp thủ tục</h3>
      </div>
      <form onSubmit={submitQuestion}>
        <div className="pdp-form-grid">
          <label>
            Họ tên
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </label>
        </div>
        <label>
          Nội dung câu hỏi
          <textarea
            required
            rows={4}
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
          />
        </label>
        <button className="pdp-btn-primary" type="submit">
          Gửi câu hỏi
        </button>
        {status && <p className="pdp-form-status">{status}</p>}
      </form>
    </section>
  );
}

/* ───────────────────────────────────────────────
   Đánh giá hướng dẫn
   ─────────────────────────────────────────────── */
function RatingSection({ procedureId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  async function submitRating(e) {
    e.preventDefault();
    setStatus("Đang gửi đánh giá...");
    try {
      await api.post("/reviews", { procedureId, rating, comment: comment.trim() });
      setComment("");
      setStatus("Cảm ơn bà con đã góp ý.");
    } catch {
      setStatus("Chưa gửi được đánh giá. Vui lòng thử lại.");
    }
  }

  return (
    <section className="pdp-panel">
      <div className="pdp-panel-head">
        <PdpIcon type="certificate" />
        <h3>Đánh giá hướng dẫn</h3>
      </div>
      <form onSubmit={submitRating}>
        <div className="pdp-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              className={star <= rating ? "is-active" : ""}
              key={star}
              type="button"
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <label>
          Góp ý (không bắt buộc)
          <textarea
            rows={3}
            placeholder="Góp ý để UBND xã hướng dẫn rõ hơn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button className="pdp-btn-secondary" type="submit">
          Gửi đánh giá
        </button>
        {status && <p className="pdp-form-status">{status}</p>}
      </form>
    </section>
  );
}

/* ───────────────────────────────────────────────
   Trang chi tiết thủ tục
   ─────────────────────────────────────────────── */
export default function ProcedureDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const sessionId = useMemo(getCitizenSessionId, []);

  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setProcedure(null);

    api
      .get(`/procedures/${slug}`)
      .then((res) => {
        if (cancelled) return;
        setProcedure(normalizeDetail(res.data));
        setUsingMock(false);
      })
      .catch(() => {
        if (cancelled) return;
        if (!USE_MOCK_FALLBACK) {
          setError("Không tải được dữ liệu thủ tục.");
          return;
        }
        const fallback = findMockProcedureBySlug(slug);
        if (fallback) {
          setProcedure(fallback);
          setUsingMock(true);
        } else {
          setError("Không tìm thấy thủ tục này.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleSpeak() {
    if (!procedure) return;
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    const text = buildSpeakText(procedure);
    if (!text || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "vi-VN";
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <div className="tthc-root">
      {/* Header + breadcrumb dùng chung style với trang danh sách */}
      <div className="tthc-gov-header">
        <div className="tthc-gov-header-inner">
          <div className="tthc-gov-brand">
            <img
              src="https://inviva.vn/wp-content/uploads/2026/05/logo-chung-tay-cai-cach-thu-tuc-hanh-chinh-vector-03.png"
              alt="Logo UBND xã Đăk Pxi"
              className="tthc-gov-logo"
            />
            <div className="tthc-gov-title">
              <span className="tthc-gov-title-sub">ỦY BAN NHÂN DÂN XÃ ĐĂK PXI</span>
              <span className="tthc-gov-title-main">HỆ THỐNG GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tthc-breadcrumb">
        <div className="tthc-breadcrumb-inner">
          <Link to="/" className="tthc-breadcrumb-home">Trang chủ</Link>
          <span className="tthc-breadcrumb-sep">›</span>
          <Link to="/thu-tuc-hanh-chinh" className="tthc-breadcrumb-home">Danh sách thủ tục hành chính</Link>
          <span className="tthc-breadcrumb-sep">›</span>
          <span className="tthc-breadcrumb-current">{procedure ? procedure.title : slug}</span>
        </div>
      </div>

      <main className="tthc-main">
        <div className="pdp-content">
          {loading && (
            <>
              <div className="pdp-skeleton-row" />
              <div className="pdp-skeleton-row" />
              <div className="pdp-skeleton-row" />
            </>
          )}

          {!loading && error && (
            <div className="pdp-empty">
              <div className="pdp-empty-icon">!</div>
              <h3>Không tìm thấy thủ tục</h3>
              <p>{error}</p>
              <button
                className="pdp-btn-secondary"
                type="button"
                onClick={() => navigate("/thu-tuc-hanh-chinh")}
                style={{ marginTop: 14 }}
              >
                Quay lại danh sách
              </button>
            </div>
          )}

          {!loading && !error && procedure && (
            <>
              {usingMock && (
                <div className="pdp-mock-banner">
                  Đang hiển thị dữ liệu mẫu — chưa kết nối được máy chủ thật.
                </div>
              )}

              {/* Tiêu đề + đọc hướng dẫn */}
              <section className="pdp-hero">
                <div className="pdp-hero-top">
                  <h1 className="pdp-hero-title">{procedure.title}</h1>
                  <button
                    className={`pdp-speak-btn ${speaking ? "is-speaking" : ""}`}
                    type="button"
                    onClick={handleSpeak}
                  >
                    <PdpIcon type={speaking ? "stop" : "speaker"} />
                    {speaking ? "Dừng đọc" : "Đọc hướng dẫn"}
                  </button>
                </div>
                {procedure.summary && <p className="pdp-hero-summary">{procedure.summary}</p>}
              </section>

              {/* Thông tin nhanh */}
              <section className="pdp-quickinfo">
                {procedure.agency && (
                  <div className="pdp-info-card">
                    <span className="pdp-info-icon"><PdpIcon type="office" /></span>
                    <div>
                      <span className="pdp-info-label">Cơ quan giải quyết</span>
                      <span className="pdp-info-value">{procedure.agency}</span>
                    </div>
                  </div>
                )}
                {procedure.processing_time && (
                  <div className="pdp-info-card">
                    <span className="pdp-info-icon"><PdpIcon type="clock" /></span>
                    <div>
                      <span className="pdp-info-label">Thời gian giải quyết</span>
                      <span className="pdp-info-value">{procedure.processing_time}</span>
                    </div>
                  </div>
                )}
                {procedure.fee && (
                  <div className="pdp-info-card">
                    <span className="pdp-info-icon"><PdpIcon type="money" /></span>
                    <div>
                      <span className="pdp-info-label">Lệ phí</span>
                      <span className="pdp-info-value">{procedure.fee}</span>
                    </div>
                  </div>
                )}
                {typeof procedure.view_count === "number" && (
                  <div className="pdp-info-card">
                    <span className="pdp-info-icon"><PdpIcon type="eye" /></span>
                    <div>
                      <span className="pdp-info-label">Lượt xem</span>
                      <span className="pdp-info-value">{procedure.view_count.toLocaleString("vi-VN")}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Điều kiện + giấy tờ cần chuẩn bị */}
              {(procedure.conditions_text || procedure.required_documents) && (
                <section className="pdp-twocol">
                  {procedure.conditions_text && (
                    <div className="pdp-panel">
                      <div className="pdp-panel-head">
                        <PdpIcon type="condition" />
                        <h3>Điều kiện thực hiện</h3>
                      </div>
                      <p>{procedure.conditions_text}</p>
                    </div>
                  )}
                  {procedure.required_documents && (
                    <div className="pdp-panel">
                      <div className="pdp-panel-head">
                        <PdpIcon type="documents" />
                        <h3>Giấy tờ cần chuẩn bị</h3>
                      </div>
                      <p>{procedure.required_documents}</p>
                    </div>
                  )}
                </section>
              )}

              {/* Hướng dẫn từng bước */}
              <StepGuideDetail procedure={procedure} sessionId={sessionId} />

              {/* Biểu mẫu */}
              <FormDownloadSection forms={procedure.forms} />

              {/* Hỏi đáp + Đánh giá */}
              <section className="pdp-twocol">
                <QuestionSection procedureId={procedure.id} />
                <RatingSection procedureId={procedure.id} />
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}