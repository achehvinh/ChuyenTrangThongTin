import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./Thutuchanhchinh.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

const PAGE_SIZE = 9;

function getCitizenSessionId() {
  const key = "dakpxi_tthc_session_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeDetail(payload) {
  return payload?.data || payload || null;
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildSpeakText(procedure) {
  const steps = procedure.steps || [];
  const forms = procedure.forms || [];
  const text = [
    `Thủ tục: ${procedure.title}.`,
    procedure.summary ? `Mô tả: ${procedure.summary}.` : "",
    procedure.processing_time ? `Thời gian giải quyết: ${procedure.processing_time}.` : "",
    procedure.fee ? `Lệ phí: ${procedure.fee}.` : "",
    procedure.agency ? `Cơ quan giải quyết: ${procedure.agency}.` : "",
    procedure.required_documents
      ? `Giấy tờ cần chuẩn bị: ${procedure.required_documents}.`
      : "",
    procedure.conditions_text ? `Điều kiện thực hiện: ${procedure.conditions_text}.` : "",
    steps.length
      ? `Quy trình thực hiện: ${steps
          .map((step, index) => `Bước ${index + 1}: ${step.title}. ${step.content}`)
          .join(". ")}`
      : "",
    forms.length ? `Có ${forms.length} biểu mẫu có thể tải về.` : "",
  ];
  return text.filter(Boolean).join(" ");
}

function EmptyState({ title, description }) {
  return (
    <div className="tthc-empty">
      <div className="tthc-empty-icon">i</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function ProcedureCard({ item, onOpen }) {
  return (
    <button className="tthc-procedure-card" type="button" onClick={() => onOpen(item)}>
      <div className="tthc-card-top">
        <span className="tthc-group-pill">{item.group_name || item.groupName || "Thủ tục"}</span>
        <span className="tthc-view-count">{Number(item.view_count || 0).toLocaleString("vi-VN")} lượt xem</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary || "Xem hướng dẫn, giấy tờ cần chuẩn bị và biểu mẫu liên quan."}</p>
      <div className="tthc-card-meta">
        <span>Thời gian: {item.processing_time || "Theo quy định"}</span>
        <span>Lệ phí: {item.fee || "Liên hệ cán bộ"}</span>
      </div>
      <span className="tthc-card-action">Xem hướng dẫn</span>
    </button>
  );
}

function StepGuide({ procedure, sessionId }) {
  const [progress, setProgress] = useState({});
  const steps = procedure.steps || [];

  useEffect(() => {
    if (!procedure.id || !sessionId) return;
    api
      .get(`/progress/${sessionId}/${procedure.id}`)
      .then((res) => {
        const rows = normalizeList(res.data);
        const next = {};
        rows.forEach((row) => {
          next[row.step_id || row.stepId] = Boolean(row.is_completed || row.isCompleted);
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
      setProgress((prev) => ({ ...prev, [step.id]: !nextValue }));
    }
  }

  const completed = steps.filter((step) => progress[step.id]).length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <section className="tthc-detail-section">
      <div className="tthc-section-heading">
        <h3>Hướng dẫn từng bước</h3>
        <span>{percent}% hoàn thành</span>
      </div>
      <div className="tthc-progress-track">
        <div className="tthc-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="tthc-steps">
        {steps.map((step, index) => {
          const checked = Boolean(progress[step.id]);
          return (
            <div className={`tthc-step ${checked ? "is-done" : ""}`} key={step.id || index}>
              <button
                className="tthc-step-check"
                type="button"
                onClick={() => toggleStep(step)}
                aria-label={checked ? "Bỏ đánh dấu hoàn thành" : "Đánh dấu hoàn thành"}
              >
                {checked ? "✓" : index + 1}
              </button>
              <div>
                <h4>{step.title || `Bước ${index + 1}`}</h4>
                <p>{step.content || step.detail}</p>
                {step.note && <small>{step.note}</small>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FormDownloadList({ forms = [] }) {
  if (!forms.length) {
    return (
      <section className="tthc-detail-section">
        <h3>Biểu mẫu</h3>
        <p className="tthc-muted">Thủ tục này chưa có biểu mẫu tải về.</p>
      </section>
    );
  }

  return (
    <section className="tthc-detail-section">
      <h3>Biểu mẫu tải về</h3>
      <div className="tthc-forms">
        {forms.map((form) => (
          <a
            className="tthc-form-item"
            href={`${API_BASE_URL}/forms/${form.id}/download`}
            key={form.id}
            rel="noreferrer"
          >
            <span className="tthc-file-type">{form.file_type || form.fileType}</span>
            <span>
              <strong>{form.title}</strong>
              <small>{formatFileSize(form.file_size || form.fileSize)}</small>
            </span>
            <b>Tải về</b>
          </a>
        ))}
      </div>
    </section>
  );
}

function QuestionBox({ procedureId }) {
  const [form, setForm] = useState({ fullName: "", phone: "", question: "" });
  const [status, setStatus] = useState("");

  async function submitQuestion(event) {
    event.preventDefault();
    setStatus("Đang gửi câu hỏi...");
    try {
      await api.post("/questions", {
        procedureId,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        question: form.question.trim(),
      });
      setForm({ fullName: "", phone: "", question: "" });
      setStatus("Đã gửi câu hỏi. Cán bộ sẽ phản hồi sớm.");
    } catch {
      setStatus("Chưa gửi được câu hỏi. Vui lòng thử lại hoặc liên hệ Bộ phận Một cửa.");
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Hỏi đáp thủ tục</h3>
      <form className="tthc-question-form" onSubmit={submitQuestion}>
        <div className="tthc-form-grid">
          <label>
            Họ tên
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </label>
        </div>
        <label>
          Nội dung câu hỏi
          <textarea
            required
            rows={4}
            value={form.question}
            onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
          />
        </label>
        <button className="tthc-primary-btn" type="submit">Gửi câu hỏi</button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

function RatingBox({ procedureId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  async function submitRating(event) {
    event.preventDefault();
    setStatus("Đang gửi đánh giá...");
    try {
      await api.post("/reviews", { procedureId, rating, comment: comment.trim() });
      setComment("");
      setStatus("Cảm ơn bà con đã góp ý.");
    } catch {
      setStatus("Chưa gửi được đánh giá. Vui lòng thử lại sau.");
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Đánh giá hướng dẫn</h3>
      <form className="tthc-rating-box" onSubmit={submitRating}>
        <div className="tthc-stars" aria-label="Chọn số sao">
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
        <textarea
          rows={3}
          placeholder="Góp ý để UBND xã hướng dẫn rõ hơn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="tthc-secondary-btn" type="submit">Gửi đánh giá</button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

function ProcedureDetailModal({ procedure, onClose, sessionId }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  function toggleSpeak() {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(buildSpeakText(procedure));
    utterance.lang = "vi-VN";
    utterance.rate = 0.88;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function close() {
    window.speechSynthesis?.cancel();
    onClose();
  }

  return (
    <div className="tthc-modal-overlay" onClick={close}>
      <article className="tthc-modal" onClick={(event) => event.stopPropagation()}>
        <header className="tthc-modal-header">
          <div>
            <span className="tthc-group-pill">{procedure.group_name || "Thủ tục hành chính"}</span>
            <h2>{procedure.title}</h2>
            <p>{procedure.summary || procedure.description}</p>
          </div>
          <div className="tthc-modal-actions">
            <button className="tthc-speak-btn" type="button" onClick={toggleSpeak}>
              {isSpeaking ? "Dừng đọc" : "Đọc bằng giọng nói"}
            </button>
            <button className="tthc-close-btn" type="button" onClick={close} aria-label="Đóng">×</button>
          </div>
        </header>

        <div className="tthc-modal-body">
          <div className="tthc-info-grid">
            <div><span>Thời gian</span><strong>{procedure.processing_time || "Theo quy định"}</strong></div>
            <div><span>Lệ phí</span><strong>{procedure.fee || "Liên hệ cán bộ"}</strong></div>
            <div><span>Cơ quan giải quyết</span><strong>{procedure.agency || "UBND xã Đăk Pxi"}</strong></div>
          </div>

          {procedure.required_documents && (
            <section className="tthc-detail-section">
              <h3>Giấy tờ cần chuẩn bị</h3>
              <div className="tthc-rich-text">{procedure.required_documents}</div>
            </section>
          )}

          {procedure.conditions_text && (
            <section className="tthc-detail-section">
              <h3>Điều kiện thực hiện</h3>
              <div className="tthc-rich-text">{procedure.conditions_text}</div>
            </section>
          )}

          {(procedure.steps || []).length > 0 && (
            <StepGuide procedure={procedure} sessionId={sessionId} />
          )}

          {procedure.video_url && (
            <section className="tthc-detail-section">
              <h3>Video hướng dẫn</h3>
              <a className="tthc-video-link" href={procedure.video_url} target="_blank" rel="noreferrer">
                Mở video hướng dẫn
              </a>
            </section>
          )}

          <FormDownloadList forms={procedure.forms || []} />
          <QuestionBox procedureId={procedure.id} />
          <RatingBox procedureId={procedure.id} />
        </div>
      </article>
    </div>
  );
}

export default function Thutuchanhchinh() {
  const [groups, setGroups] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const searchTimer = useRef(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const sessionId = useMemo(getCitizenSessionId, []);

  useEffect(() => {
    api
      .get("/procedure-groups")
      .then((res) => setGroups(normalizeList(res.data)))
      .catch(() => setGroups([]));
  }, []);

  useEffect(() => {
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(searchTimer.current);
  }, [keyword]);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/procedures", {
        params: {
          keyword: debouncedKeyword || undefined,
          groupId: groupId || undefined,
          page,
          limit: PAGE_SIZE,
        },
      })
      .then((res) => setProcedures(normalizeList(res.data)))
      .catch(() => {
        setProcedures([]);
        setError("Không tải được dữ liệu thủ tục. Vui lòng kiểm tra kết nối máy chủ.");
      })
      .finally(() => setLoading(false));
  }, [debouncedKeyword, groupId, page]);

  async function openProcedure(item) {
    const slugOrId = item.slug || item.id;
    setDetailLoading(true);
    try {
      const res = await api.get(`/procedures/${slugOrId}`);
      setSelectedProcedure(normalizeDetail(res.data));
    } catch {
      setError("Không mở được chi tiết thủ tục. Vui lòng thử lại.");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="tthc-root">
      <header className="tthc-hero">
        <div className="tthc-hero-inner">
          <div>
            <span className="tthc-kicker">UBND xã Đăk Pxi</span>
            <h1>Tra cứu thủ tục hành chính</h1>
            <p>
              Hỗ trợ người dân tìm thủ tục, chuẩn bị giấy tờ, làm theo từng bước
              và tải biểu mẫu trực tuyến.
            </p>
          </div>
          <div className="tthc-help-card">
            <strong>Bộ phận Một cửa</strong>
            <span>Thứ 2 - Thứ 6</span>
            <b>7:30 - 11:30 và 13:30 - 17:00</b>
          </div>
        </div>
      </header>

      <main className="tthc-main">
        <section className="tthc-search-panel">
          <label className="tthc-search-label" htmlFor="procedure-search">
            Tìm kiếm theo tên thủ tục hoặc từ khóa
          </label>
          <div className="tthc-search-row">
            <input
              id="procedure-search"
              value={keyword}
              placeholder="Ví dụ: khai sinh, cư trú, CCCD, đất đai, VNeID..."
              onChange={(event) => setKeyword(event.target.value)}
            />
            {keyword && (
              <button type="button" onClick={() => setKeyword("")}>
                Xóa
              </button>
            )}
          </div>

          <div className="tthc-group-filter" aria-label="Lọc theo nhóm thủ tục">
            <button
              className={!groupId ? "is-active" : ""}
              type="button"
              onClick={() => {
                setGroupId("");
                setPage(1);
              }}
            >
              Tất cả
            </button>
            {groups.map((group) => (
              <button
                className={String(groupId) === String(group.id) ? "is-active" : ""}
                key={group.id}
                type="button"
                onClick={() => {
                  setGroupId(group.id);
                  setPage(1);
                }}
              >
                {group.name}
              </button>
            ))}
          </div>
        </section>

        {error && <div className="tthc-alert">{error}</div>}
        {detailLoading && <div className="tthc-alert">Đang mở chi tiết thủ tục...</div>}

        <section className="tthc-results">
          <div className="tthc-results-heading">
            <h2>Danh sách thủ tục</h2>
            <span>{procedures.length} kết quả</span>
          </div>

          {loading ? (
            <div className="tthc-loading-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="tthc-skeleton" key={index} />
              ))}
            </div>
          ) : procedures.length ? (
            <div className="tthc-grid">
              {procedures.map((item) => (
                <ProcedureCard item={item} key={item.id} onOpen={openProcedure} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa tìm thấy thủ tục phù hợp"
              description="Bạn thử nhập từ khóa ngắn hơn hoặc chọn nhóm thủ tục khác."
            />
          )}

          <div className="tthc-pagination">
            <button disabled={page <= 1} type="button" onClick={() => setPage((prev) => prev - 1)}>
              Trang trước
            </button>
            <span>Trang {page}</span>
            <button
              disabled={procedures.length < PAGE_SIZE}
              type="button"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Trang sau
            </button>
          </div>
        </section>
      </main>

      {selectedProcedure && (
        <ProcedureDetailModal
          procedure={selectedProcedure}
          sessionId={sessionId}
          onClose={() => setSelectedProcedure(null)}
        />
      )}
    </div>
  );
}
