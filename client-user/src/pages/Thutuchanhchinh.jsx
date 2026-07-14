import { useEffect, useMemo, useRef, useState } from "react";
import "./Thutuchanhchinh.css";
import { Link } from "react-router-dom";
import {
  api,
  API_BASE_URL,
  FIELD_GROUPS,
  PAGE_SIZE,
  MOCK_PROCEDURES,
  USE_MOCK_FALLBACK,
  getCitizenSessionId,
  normalizeList,
  normalizeDetail,
  formatFileSize,
  filterMockProcedures,
} from "../utils/procedureUtils";

/* ============================================================
   Ghi chú thiết kế:
   - Bỏ hiệu ứng "chọn lĩnh vực khi rê chuột" (onMouseEnter) vì
     bà con dùng điện thoại chạm màn hình, rê chuột không có
     tác dụng và dễ gây nhầm lẫn. Chỉ chọn khi BẤM (onClick).
   - Cỡ chữ, khoảng cách, nút bấm đều tăng lên để dễ đọc, dễ bấm.
   - Thêm câu hướng dẫn ngắn ngay đầu trang: phải làm gì trước,
     làm gì sau.
   ============================================================ */

function EmptyState({ title, description }) {
  return (
    <div className="tthc-empty">
      <div className="tthc-empty-icon">i</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function FieldSidebar({ groups, activeId, counts, onSelect }) {
  return (
    <aside className="tthc-sidebar">
      <div className="tthc-sidebar-head">Chọn lĩnh vực</div>
      <div className="tthc-sidebar-list">
        <button
          type="button"
          className={`tthc-sidebar-item ${!activeId ? "is-active" : ""}`}
          onClick={() => onSelect("")}
        >
          <span className="tthc-sidebar-arrow">›</span>
          <span className="tthc-sidebar-label">Tất cả lĩnh vực</span>
          <span className="tthc-sidebar-count">{counts.all ?? 0}</span>
        </button>
        {groups.map((f) => (
          <button
            type="button"
            key={f.id}
            className={`tthc-sidebar-item ${activeId === f.id ? "is-active" : ""}`}
            onClick={() => onSelect(f.id)}
          >
            <span className="tthc-sidebar-arrow">›</span>
            <span className="tthc-sidebar-label">{f.name}</span>
            <span className="tthc-sidebar-count">{counts[f.id] ?? 0}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ProcedureRow({ item }) {
  return (
    <div className="tthc-row">
      <div className="tthc-row-left">
        <div className="tthc-row-title">{item.title}</div>
        <div className="tthc-row-meta">
          <span>Nơi nộp hồ sơ: {item.agency}</span>
          <span>Áp dụng cho: Công dân xã Đăk Pxi</span>
        </div>
      </div>

      <Link className="tthc-row-btn" to={`/thu-tuc-hanh-chinh/${item.slug}`}>
        Xem cần làm gì →
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------
   Các phần dưới đây dùng cho trang/khung chi tiết một thủ tục
   (các bước thực hiện, biểu mẫu, hỏi đáp, đánh giá).
   ------------------------------------------------------------ */

function StepGuide({ procedure, sessionId }) {
  const [progress, setProgress] = useState({});
  const steps = procedure.steps || [];

  useEffect(() => {
    if (!procedure.id || !sessionId) return;
    api
      .get(`/progress/${sessionId}/${procedure.id}`)
      .then((res) => {
        const next = {};
        normalizeList(res.data).forEach((row) => {
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
      /* giữ trạng thái đã bấm trên màn hình dù lưu chưa thành công */
    }
  }

  const completed = steps.filter((s) => progress[s.id]).length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <section className="tthc-detail-section">
      <h3>Các bước cần làm ({completed}/{steps.length} đã xong)</h3>
      <div className="tthc-progress-track">
        <div className="tthc-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="tthc-steps">
        {steps.map((step, index) => {
          const checked = Boolean(progress[step.id]);
          return (
            <div className={`tthc-step ${checked ? "is-done" : ""}`} key={step.id || index}>
              <button className="tthc-step-check" type="button" onClick={() => toggleStep(step)}>
                {checked ? "✓" : index + 1}
              </button>
              <div>
                <h4>{step.title || `Bước ${index + 1}`}</h4>
                <p>{step.content || step.detail}</p>
                {step.note && <small>Lưu ý: {step.note}</small>}
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
        <h3>Biểu mẫu cần tải</h3>
        <p className="tthc-muted">Thủ tục này không cần tải biểu mẫu nào.</p>
      </section>
    );
  }
  return (
    <section className="tthc-detail-section">
      <h3>Biểu mẫu cần tải</h3>
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

  async function submitQuestion(e) {
    e.preventDefault();
    setStatus("Đang gửi...");
    try {
      await api.post("/questions", { procedureId, ...form });
      setForm({ fullName: "", phone: "", question: "" });
      setStatus("Đã gửi. Cán bộ xã sẽ gọi lại để trả lời.");
    } catch {
      setStatus("Chưa gửi được. Bà con vui lòng đến trực tiếp Bộ phận Một cửa.");
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Chưa rõ chỗ nào? Gửi câu hỏi</h3>
      <form className="tthc-question-form" onSubmit={submitQuestion}>
        <div className="tthc-form-grid">
          <label>
            Họ và tên
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
          Câu hỏi của bà con
          <textarea
            required
            rows={4}
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
          />
        </label>
        <button className="tthc-primary-btn" type="submit">
          Gửi câu hỏi
        </button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

function RatingBox({ procedureId }) {
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
      setStatus("Chưa gửi được đánh giá. Bà con thử lại sau.");
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Hướng dẫn này có dễ hiểu không?</h3>
      <form className="tthc-rating-box" onSubmit={submitRating}>
        <div className="tthc-stars">
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
          placeholder="Góp ý để xã hướng dẫn rõ hơn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="tthc-secondary-btn" type="submit">
          Gửi đánh giá
        </button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

export default function Thutuchanhchinh() {
  const [procedures, setProcedures] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [groupCounts, setGroupCounts] = useState({});
  const [keyword, setKeyword] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const searchTimer = useRef(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const sessionId = useMemo(getCitizenSessionId, []);

  useEffect(() => {
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(searchTimer.current);
  }, [keyword]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get("/procedures", {
        params: { keyword: debouncedKeyword || undefined, groupId: groupId || undefined, page, limit: PAGE_SIZE },
      })
      .then((res) => {
        if (cancelled) return;
        const rows = normalizeList(res.data);
        setProcedures(rows);
        setTotalCount(res.data?.total ?? rows.length);
        setUsingMock(false);
      })
      .catch(() => {
        if (cancelled) return;
        if (!USE_MOCK_FALLBACK) {
          setProcedures([]);
          setError("Không tải được danh sách thủ tục. Vui lòng thử lại.");
          return;
        }
        const { rows, total } = filterMockProcedures({
          keyword: debouncedKeyword,
          groupId,
          page,
          pageSize: PAGE_SIZE,
        });
        setProcedures(rows);
        setTotalCount(total);
        setUsingMock(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedKeyword, groupId, page]);

  useEffect(() => {
    api
      .get("/procedure-groups")
      .then((res) => {
        const counts = { all: 0 };
        normalizeList(res.data).forEach((g) => {
          counts[g.id] = g.procedure_count ?? 0;
          counts.all += counts[g.id];
        });
        setGroupCounts(counts);
      })
      .catch(() => {
        const counts = { all: MOCK_PROCEDURES.length };
        FIELD_GROUPS.forEach((f) => {
          counts[f.id] = MOCK_PROCEDURES.filter((p) => p.group_id === f.id).length;
        });
        setGroupCounts(counts);
      });
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activeFieldMeta = FIELD_GROUPS.find((f) => f.id === groupId);

  return (
    <div className="tthc-root">
      {/* ── 1. ĐẦU TRANG ── */}
      <div className="tthc-gov-header">
        <div className="tthc-gov-header-inner">
          <div className="tthc-gov-brand">
            <img
              src="https://inviva.vn/wp-content/uploads/2026/05/logo-chung-tay-cai-cach-thu-tuc-hanh-chinh-vector-03.png"
              alt="Logo UBND xã Đăk Pxi"
              className="tthc-gov-logo"
            />
            <div className="tthc-gov-title">
              <span className="tthc-gov-title-sub">UBND xã Đăk Pxi</span>
              <span className="tthc-gov-title-main">Tra cứu thủ tục hành chính</span>
            </div>
          </div>

          <Link to="/" className="tthc-home-btn">
            <span className="tthc-home-btn-arrow">←</span>
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>

      {/* ── 2. ĐƯỜNG DẪN ── */}
      <div className="tthc-breadcrumb">
        <div className="tthc-breadcrumb-inner">
          <Link to="/" className="tthc-breadcrumb-home">
            Trang chủ
          </Link>
          <span className="tthc-breadcrumb-sep">›</span>
          <span className="tthc-breadcrumb-current">Danh sách thủ tục hành chính</span>
        </div>
      </div>

      {/* ── 3. NỘI DUNG CHÍNH ── */}
      <main className="tthc-main">
        <h1 className="tthc-page-title">Bà con cần làm thủ tục gì?</h1>
        <p className="tthc-page-help">
          Bước 1: Bấm chọn một lĩnh vực ở khung bên trái (hoặc gõ từ khóa vào ô tìm kiếm).
          Bước 2: Bấm nút <strong>"Xem cần làm gì"</strong> ở thủ tục phù hợp để xem hồ sơ cần
          chuẩn bị và các bước thực hiện.
        </p>

        <div className="tthc-layout">
          {/* Danh mục lĩnh vực */}
          <FieldSidebar
            groups={FIELD_GROUPS}
            activeId={groupId}
            counts={groupCounts}
            onSelect={(id) => {
              setGroupId(id);
              setPage(1);
            }}
          />

          {/* Danh sách thủ tục */}
          <div className="tthc-content">
            <section className="tthc-search-panel">
              <div className="tthc-search-row">
                <input
                  id="procedure-search"
                  value={keyword}
                  placeholder="Gõ từ khóa, ví dụ: khai sinh, sổ đỏ, hộ nghèo..."
                  onChange={(e) => setKeyword(e.target.value)}
                  aria-label="Tìm kiếm thủ tục hành chính"
                />
                {keyword && (
                  <button type="button" onClick={() => setKeyword("")}>
                    Xóa
                  </button>
                )}
              </div>
            </section>

            {usingMock && (
              <div className="tthc-mock-banner">
                Đang hiển thị dữ liệu mẫu — chưa kết nối được máy chủ thật.
              </div>
            )}
            {error && <div className="tthc-alert">{error}</div>}
            {detailLoading && <div className="tthc-alert">Đang mở chi tiết...</div>}

            <section className="tthc-results">
              <div className="tthc-results-heading">
                <span>{activeFieldMeta ? activeFieldMeta.name : "Tất cả thủ tục"}</span>
                <span>{totalCount} thủ tục</span>
              </div>

              {loading ? (
                <div className="tthc-loading-list">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div className="tthc-skeleton-row" key={i} />
                  ))}
                </div>
              ) : procedures.length ? (
                <div className="tthc-list">
                  {procedures.map((item) => (
                    <ProcedureRow item={item} key={item.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Chưa tìm thấy thủ tục phù hợp"
                  description="Bà con thử gõ từ khóa khác, hoặc bấm chọn lại lĩnh vực ở khung bên trái."
                />
              )}

              {totalPages > 1 && (
                <div className="tthc-pagination">
                  <button disabled={page <= 1} type="button" onClick={() => setPage((p) => p - 1)}>
                    ‹ Trang trước
                  </button>
                  <span>
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Trang sau ›
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export { StepGuide, FormDownloadList, QuestionBox, RatingBox };