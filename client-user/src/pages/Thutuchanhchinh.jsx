import { useEffect, useMemo, useRef, useState } from "react";
import "./Thutuchanhchinh.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

function EmptyState({ title, description }) {
  return <div className="tthc-empty"><div className="tthc-empty-icon">i</div><h3>{title}</h3><p>{description}</p></div>;
}

function FieldSidebar({ groups, activeId, counts, onSelect }) {
  return (
    <aside className="tthc-sidebar">
      <div className="tthc-sidebar-head">Danh mục lĩnh vực</div>
      <div className="tthc-sidebar-list">
        <button
          type="button"
          className={`tthc-sidebar-item ${!activeId ? "is-active" : ""}`}
          onClick={() => onSelect("")}
          onMouseEnter={() => onSelect("")}
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
            onMouseEnter={() => onSelect(f.id)}
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
          <span>Cơ quan: {item.agency}</span>
          <span>Đối tượng: Công dân xã Đăk Pxi</span>
        </div>
      </div>

      <Link
        className="tthc-row-btn"
        to={`/thu-tuc-hanh-chinh/${item.slug}`}
      >
        Xem hướng dẫn
      </Link>
    </div>
  );
}

function StepGuide({ procedure, sessionId }) {
  const [progress, setProgress] = useState({});
  const steps = procedure.steps || [];
  useEffect(() => {
    if (!procedure.id || !sessionId) return;
    api.get(`/progress/${sessionId}/${procedure.id}`).then(res => {
      const next = {};
      normalizeList(res.data).forEach(row => { next[row.step_id || row.stepId] = Boolean(row.is_completed || row.isCompleted); });
      setProgress(next);
    }).catch(() => setProgress({}));
  }, [procedure.id, sessionId]);
  async function toggleStep(step) {
    const nextValue = !progress[step.id];
    setProgress(prev => ({ ...prev, [step.id]: nextValue }));
    try { await api.put(`/progress/${sessionId}/steps/${step.id}`, { procedureId: procedure.id, isCompleted: nextValue }); } catch {}
  }
  const completed = steps.filter(s => progress[s.id]).length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;
  return (
    <section className="tthc-detail-section">
      <div className="tthc-section-heading"><h3>Hướng dẫn từng bước</h3><span>{percent}% hoàn thành</span></div>
      <div className="tthc-progress-track"><div className="tthc-progress-fill" style={{ width: `${percent}%` }} /></div>
      <div className="tthc-steps">
        {steps.map((step, index) => {
          const checked = Boolean(progress[step.id]);
          return (
            <div className={`tthc-step ${checked ? "is-done" : ""}`} key={step.id || index}>
              <button className="tthc-step-check" type="button" onClick={() => toggleStep(step)}>{checked ? "✓" : index + 1}</button>
              <div><h4>{step.title || `Bước ${index + 1}`}</h4><p>{step.content || step.detail}</p>{step.note && <small>{step.note}</small>}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FormDownloadList({ forms = [] }) {
  if (!forms.length) return <section className="tthc-detail-section"><h3>Biểu mẫu</h3><p className="tthc-muted">Thủ tục này chưa có biểu mẫu tải về.</p></section>;
  return (
    <section className="tthc-detail-section">
      <h3>Biểu mẫu tải về</h3>
      <div className="tthc-forms">
        {forms.map(form => (
          <a className="tthc-form-item" href={`${API_BASE_URL}/forms/${form.id}/download`} key={form.id} rel="noreferrer">
            <span className="tthc-file-type">{form.file_type || form.fileType}</span>
            <span><strong>{form.title}</strong><small>{formatFileSize(form.file_size || form.fileSize)}</small></span>
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
    e.preventDefault(); setStatus("Đang gửi...");
    try { await api.post("/questions", { procedureId, ...form }); setForm({ fullName: "", phone: "", question: "" }); setStatus("Đã gửi. Cán bộ sẽ phản hồi sớm."); }
    catch { setStatus("Chưa gửi được. Vui lòng liên hệ Bộ phận Một cửa."); }
  }
  return (
    <section className="tthc-detail-section">
      <h3>Hỏi đáp thủ tục</h3>
      <form className="tthc-question-form" onSubmit={submitQuestion}>
        <div className="tthc-form-grid">
          <label>Họ tên<input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} /></label>
          <label>Số điện thoại<input required inputMode="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></label>
        </div>
        <label>Nội dung câu hỏi<textarea required rows={4} value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} /></label>
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
  async function submitRating(e) {
    e.preventDefault(); setStatus("Đang gửi đánh giá...");
    try { await api.post("/reviews", { procedureId, rating, comment: comment.trim() }); setComment(""); setStatus("Cảm ơn bà con đã góp ý."); }
    catch { setStatus("Chưa gửi được đánh giá. Vui lòng thử lại."); }
  }
  return (
    <section className="tthc-detail-section">
      <h3>Đánh giá hướng dẫn</h3>
      <form className="tthc-rating-box" onSubmit={submitRating}>
        <div className="tthc-stars">{[1,2,3,4,5].map(star => <button className={star<=rating?"is-active":""} key={star} type="button" onClick={() => setRating(star)}>★</button>)}</div>
        <textarea rows={3} placeholder="Góp ý để UBND xã hướng dẫn rõ hơn..." value={comment} onChange={e => setComment(e.target.value)} />
        <button className="tthc-secondary-btn" type="submit">Gửi đánh giá</button>
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
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const searchTimer = useRef(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const sessionId = useMemo(getCitizenSessionId, []);

  useEffect(() => {
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => { setDebouncedKeyword(keyword.trim()); setPage(1); }, 350);
    return () => window.clearTimeout(searchTimer.current);
  }, [keyword]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError("");
    api.get("/procedures", { params: { keyword: debouncedKeyword || undefined, groupId: groupId || undefined, page, limit: PAGE_SIZE } })
      .then(res => { if (cancelled) return; const rows = normalizeList(res.data); setProcedures(rows); setTotalCount(res.data?.total ?? rows.length); setUsingMock(false); })
      .catch(() => {
        if (cancelled) return;
        if (!USE_MOCK_FALLBACK) { setProcedures([]); setError("Không tải được dữ liệu."); return; }
        const { rows, total } = filterMockProcedures({ keyword: debouncedKeyword, groupId, page, pageSize: PAGE_SIZE });
        setProcedures(rows); setTotalCount(total); setUsingMock(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedKeyword, groupId, page]);

  useEffect(() => {
    api.get("/procedure-groups").then(res => {
      const counts = { all: 0 };
      normalizeList(res.data).forEach(g => { counts[g.id] = g.procedure_count ?? 0; counts.all += counts[g.id]; });
      setGroupCounts(counts);
    }).catch(() => {
      const counts = { all: MOCK_PROCEDURES.length };
      FIELD_GROUPS.forEach(f => { counts[f.id] = MOCK_PROCEDURES.filter(p => p.group_id === f.id).length; });
      setGroupCounts(counts);
    });
  }, []);

  async function openProcedure(item) {
    setDetailLoading(true);
    try { const res = await api.get(`/procedures/${item.slug || item.id}`); setSelectedProcedure(normalizeDetail(res.data)); }
    catch { if (USE_MOCK_FALLBACK) setSelectedProcedure(item); else setError("Không mở được chi tiết."); }
    finally { setDetailLoading(false); }
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activeFieldMeta = FIELD_GROUPS.find(f => f.id === groupId);

  return (
    <div className="tthc-root">

      {/* ── HEADER kiểu cơ quan nhà nước ── */}
{/* ── HEADER kiểu cơ quan nhà nước ── */}
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

          <Link to="/" className="tthc-home-btn">
            <span className="tthc-home-btn-arrow">←</span> Trang chủ
          </Link>
        </div>
      </div>

      {/* ── BREADCRUMB ── */}
     <div className="tthc-breadcrumb">
  <div className="tthc-breadcrumb-inner">
    <Link to="/" className="tthc-breadcrumb-home">
      Trang chủ
    </Link>

    <span className="tthc-breadcrumb-sep">›</span>

    <span className="tthc-breadcrumb-current">
      Danh sách thủ tục hành chính
    </span>
  </div>
</div>

      {/* ── NỘI DUNG CHÍNH ── */}
      {/* ── NỘI DUNG CHÍNH: SIDEBAR 25% + DANH SÁCH 75% ── */}
      <main className="tthc-main">
        <div className="tthc-layout">

          {/* Sidebar lĩnh vực — 25% */}
          <FieldSidebar
            groups={FIELD_GROUPS}
            activeId={groupId}
            counts={groupCounts}
            onSelect={(id) => { setGroupId(id); setPage(1); }}
          />

          {/* Nội dung danh sách — 75% */}
          <div className="tthc-content">

            {/* CHỖ TRỐNG: ảnh banner minh hoạ, gắn link ảnh sau */}
            {/* <div className="tthc-content-banner">
              <img src="LINK_ANH_BANNER" alt="Dịch vụ công xã Đăk Pxi" />
            </div> */}

            {/* Tìm kiếm */}
            <section className="tthc-search-panel">
              <h2 className="tthc-page-title">Danh sách dịch vụ công</h2>
              <div className="tthc-search-row">
                <input
                  id="procedure-search"
                  value={keyword}
                  placeholder="Nhập từ khóa, ví dụ: khai sinh, sổ đỏ, hộ nghèo..."
                  onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && <button type="button" onClick={() => setKeyword("")}>Xóa</button>}
              </div>
            </section>

            {usingMock && <div className="tthc-mock-banner">Đang hiển thị dữ liệu mẫu — chưa kết nối được máy chủ thật.</div>}
            {error && <div className="tthc-alert">{error}</div>}
            {detailLoading && <div className="tthc-alert">Đang mở chi tiết...</div>}

            {/* Danh sách — kiểu list nhà nước */}
            <section className="tthc-results">
              <div className="tthc-results-heading">
                <span>{activeFieldMeta ? activeFieldMeta.name : "Tất cả thủ tục"}</span>
                <span>{totalCount} kết quả</span>
              </div>

              {loading ? (
                <div className="tthc-loading-list">
                  {Array.from({ length: 6 }).map((_, i) => <div className="tthc-skeleton-row" key={i} />)}
                </div>
              ) : procedures.length ? (
                <div className="tthc-list">
                  {procedures.map((item) => (
                    <ProcedureRow item={item} key={item.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Chưa tìm thấy thủ tục"
                  description="Thử từ khóa khác hoặc chọn lại lĩnh vực ở danh mục bên trái."
                />
              )}

              {totalPages > 1 && (
                <div className="tthc-pagination">
                  <button disabled={page <= 1} type="button" onClick={() => setPage((p) => p - 1)}>
                    Trang trước
                  </button>
                  <span>Trang {page} / {totalPages}</span>
                  <button disabled={page >= totalPages} type="button" onClick={() => setPage((p) => p + 1)}>
                    Trang sau
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