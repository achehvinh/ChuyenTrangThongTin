import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Thutuchanhchinh.css";
import {
  api,
  USE_MOCK_FALLBACK,
  normalizeDetail,
  findMockProcedureBySlug,
  buildSpeakText,
  getCitizenSessionId,
} from "../utils/procedureUtils";
import { StepGuide, FormDownloadList, QuestionBox, RatingBox } from "./Thutuchanhchinh";

// ── BỘ ICON VECTOR SVG CHUẨN HTML5 ──
const SvgIcons = {
  Back: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Volume: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  Stop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Dollar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
    </svg>
  ),
  FileCheck: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  ),
  ShieldAlert: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
};

// ── NÚT PHÁT GIỌNG NÓI HƯỚNG DẪN ──
function SpeakButton({ procedure }) {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  function toggleSpeak() {
    if (!supported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(buildSpeakText(procedure));
    utter.lang = "vi-VN";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }

  if (!supported) return null;

  return (
    <button type="button" className="tthc-speak-btn" onClick={toggleSpeak}>
      {speaking ? <SvgIcons.Stop /> : <SvgIcons.Volume />}
      <span>{speaking ? "Dừng đọc" : "Nghe hướng dẫn phát âm"}</span>
    </button>
  );
}

// ── BỘ BỘ BỘ SƯU TẬP ẢNH / VIDEO ──
function MediaGallery({ media }) {
  const images = media?.images || [];
  const videos = media?.videos || [];
  if (!images.length && !videos.length) return null;

  return (
    <section className="tthc-detail-section">
      <h3>Hình ảnh & Video minh họa quy trình</h3>

      {videos.length > 0 && (
        <div className="tthc-video-list">
          {videos.map((v, i) => (
            <div className="tthc-video-wrap" key={v.src || i}>
              <video controls preload="none">
                <source src={v.src} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>
              {v.title && <p className="tthc-video-caption">{v.title}</p>}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="tthc-gallery">
          {images.map((src, i) => (
            <img src={src} alt={`Hình minh họa ${i + 1}`} key={src + i} loading="lazy" />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ThuTucChiTiet() {
  const { slug } = useParams();
  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingMock, setUsingMock] = useState(false);
  const sessionId = useMemo(getCitizenSessionId, []);

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
          setError("Không tải được thông tin thủ tục. Vui lòng thử lại.");
          return;
        }
        const mock = findMockProcedureBySlug(slug);
        if (mock) {
          setProcedure(mock);
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

  return (
    <div className="tthc-app-root">
      {/* ── HEADER CHUẨN CỔNG ĐIỆN TỬ CƠ QUAN NHÀ NƯỚC ── */}
      <header className="tthc-header">
        <div className="tthc-header-inner">
          <div className="tthc-brand">
            <img
              src="https://inviva.vn/wp-content/uploads/2026/05/logo-chung-tay-cai-cach-thu-tuc-hanh-chinh-vector-03.png"
              alt="Logo UBND xã Đăk Pxi"
              className="tthc-logo"
            />
            <div className="tthc-brand-titles">
              <span className="tthc-sub-gov">UBND xã Đăk Pxi • PHÒNG VH-XH</span>
              <span className="tthc-main-gov">Chi tiết thủ tục hành chính</span>
            </div>
          </div>

          <nav className="tthc-nav">
            <Link to="/thu-tuc-hanh-chinh" className="tthc-nav-link">
              ← Danh sách thủ tục
            </Link>
            <Link to="/" className="tthc-nav-link">
              Trang chủ
            </Link>
          </nav>
        </div>
      </header>

      {/* ── BREADCRUMB CHUẨN HTML5 ── */}
      <nav className="tthc-breadcrumb-bar">
        <div className="tthc-breadcrumb-inner">
          <Link to="/">Trang chủ</Link>
          <span className="sep">›</span>
          <Link to="/thu-tuc-hanh-chinh">Tra cứu thủ tục</Link>
          <span className="sep">›</span>
          <span className="current">{procedure ? procedure.title : "Chi tiết"}</span>
        </div>
      </nav>

      {/* ── NỘI DUNG CHÍNH ── */}
      <main className="tthc-main-container">
        <div className="tthc-back-row">
          <Link to="/thu-tuc-hanh-chinh" className="tthc-back-btn">
            <SvgIcons.Back />
            <span>Quay lại danh sách thủ tục</span>
          </Link>
        </div>

        {loading && (
          <div className="tthc-skeleton-wrap">
            <div className="tthc-skeleton-card" style={{ height: '140px' }} />
            <div className="tthc-skeleton-card" style={{ height: '200px' }} />
          </div>
        )}

        {!loading && error && (
          <div className="tthc-empty-box">
            <h3 className="tthc-empty-msg">{error}</h3>
            <p>
              Bà con vui lòng quay lại danh sách để chọn thủ tục khác, hoặc đến trực tiếp
              Bộ phận Một cửa UBND xã Đăk Pxi để được cán bộ hướng dẫn.
            </p>
            <Link to="/thu-tuc-hanh-chinh" className="tthc-btn-reset" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '12px' }}>
              Quay lại danh sách
            </Link>
          </div>
        )}

        {!loading && !error && procedure && (
          <article className="tthc-detail-article">
            {/* TIÊU ĐỀ THỦ TỤC & MÔ TẢ */}
            <header className="tthc-detail-hero">
              <div className="tthc-detail-badges">
                <span className="tthc-badge toan-trinh">
                  {procedure.group_name || 'Tư pháp - Hộ tịch'}
                </span>
                {procedure.online_type === 'toan-trinh' && (
                  <span className="tthc-badge toan-trinh">Dịch vụ công Toàn trình</span>
                )}
                {procedure.online_type === 'mot-phan' && (
                  <span className="tthc-badge mot-phan">Dịch vụ công Một phần</span>
                )}
              </div>

              <h1 className="tthc-detail-title">{procedure.title}</h1>
              {procedure.summary && <p className="tthc-detail-summary">{procedure.summary}</p>}

              <div className="tthc-detail-speak-row">
                <SpeakButton procedure={procedure} />
              </div>
            </header>

            {/* 3 THÔNG TIN TRỌNG TÂM: THỜI GIAN, LỆ PHÍ, CƠ QUAN */}
            <div className="tthc-info-cards-grid">
              <div className="tthc-info-card">
                <div className="info-icon-box blue">
                  <SvgIcons.Clock />
                </div>
                <div className="info-content">
                  <span className="info-label">Thời gian giải quyết</span>
                  <strong className="info-val">{procedure.processing_time || "Đang cập nhật"}</strong>
                </div>
              </div>

              <div className="tthc-info-card">
                <div className="info-icon-box green">
                  <SvgIcons.Dollar />
                </div>
                <div className="info-content">
                  <span className="info-label">Lệ phí dịch vụ</span>
                  <strong className="info-val">{procedure.fee || "Miễn phí"}</strong>
                </div>
              </div>

              <div className="tthc-info-card">
                <div className="info-icon-box purple">
                  <SvgIcons.Building />
                </div>
                <div className="info-content">
                  <span className="info-label">Nơi tiếp nhận & xử lý</span>
                  <strong className="info-val">{procedure.agency || "UBND xã Đăk Pxi"}</strong>
                </div>
              </div>
            </div>

            {/* GIẤY TỜ CẦN CHUẨN BỊ */}
            {procedure.required_documents && (
              <section className="tthc-detail-section">
                <h3>
                  <SvgIcons.FileCheck />
                  <span>Giấy tờ cần chuẩn bị</span>
                </h3>
                <p className="tthc-rich-text">{procedure.required_documents}</p>
              </section>
            )}

            {/* ĐIỀU KIỆN THỰC HIỆN */}
            {procedure.conditions_text && (
              <section className="tthc-detail-section">
                <h3>
                  <SvgIcons.ShieldAlert />
                  <span>Điều kiện thực hiện thủ tục</span>
                </h3>
                <p className="tthc-rich-text">{procedure.conditions_text}</p>
              </section>
            )}

            {/* CÁC BƯỚC CẦN LÀM (TIẾN ĐỘ THỰC HIỆN) */}
            <StepGuide procedure={procedure} sessionId={sessionId} />

            {/* BIỂU MẪU CẦN TẢI */}
            <FormDownloadList forms={procedure.forms} />

            {/* HÌNH ẢNH & VIDEO HƯỚNG DẪN */}
            <MediaGallery media={procedure.media} />

            {/* CÂU HỎI VÀ ĐÁNH GIÁ */}
            <QuestionBox procedureId={procedure.id} />
            <RatingBox procedureId={procedure.id} />
          </article>
        )}
      </main>

      {/* FOOTER ĐỒNG BỘ */}
      <footer className="tthc-footer">
        <div className="tthc-footer-inner">
          <div className="tthc-footer-info">
            <p><strong>Cổng Thông tin Thủ tục Hành chính UBND Xã Đăk Pxi</strong></p>
            <p>Đơn vị quản lý: Phòng Văn hóa - Xã hội UBND xã Đăk Pxi, tỉnh Quảng Ngãi</p>
          </div>
          <div className="tthc-footer-meta">
            <span>Ngày cập nhật: <strong>24/07/2026</strong></span>
            <span className="sep">•</span>
            <span>Phiên bản dữ liệu: <strong>v2.4.0 (HTML5 Standard)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}