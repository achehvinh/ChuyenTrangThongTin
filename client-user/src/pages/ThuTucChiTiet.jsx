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

/* ============================================================
   Trang chi tiết một thủ tục hành chính.
   Route gợi ý: /thu-tuc-hanh-chinh/:slug

   Ghi chú thiết kế:
   - Dùng lại đúng các thành phần (bước làm, biểu mẫu, hỏi đáp,
     đánh giá) đã xây ở trang danh sách để đồng bộ giao diện và
     không lặp code.
   - Thêm nút "Nghe hướng dẫn": đọc to nội dung bằng giọng nói,
     giúp bà con lớn tuổi hoặc không quen đọc chữ vẫn hiểu được
     cần chuẩn bị gì, làm những bước nào.
   ============================================================ */

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
      {speaking ? "⏹ Dừng đọc" : "🔊 Nghe hướng dẫn"}
    </button>
  );
}

function MediaGallery({ media }) {
  const images = media?.images || [];
  const videos = media?.videos || [];
  if (!images.length && !videos.length) return null;

  return (
    <section className="tthc-detail-section">
      <h3>Hình ảnh và video hướng dẫn</h3>

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
    <div className="tthc-root">
      {/* ── ĐẦU TRANG (giống trang danh sách) ── */}
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

      {/* ── ĐƯỜNG DẪN ── */}
      <div className="tthc-breadcrumb">
        <div className="tthc-breadcrumb-inner">
          <Link to="/" className="tthc-breadcrumb-home">
            Trang chủ
          </Link>
          <span className="tthc-breadcrumb-sep">›</span>
          <Link to="/thu-tuc-hanh-chinh" className="tthc-breadcrumb-home">
            Danh sách thủ tục
          </Link>
          <span className="tthc-breadcrumb-sep">›</span>
          <span className="tthc-breadcrumb-current">{procedure ? procedure.title : "Chi tiết thủ tục"}</span>
        </div>
      </div>

      {/* ── NỘI DUNG CHÍNH ── */}
      <main className="tthc-main">
        <Link to="/thu-tuc-hanh-chinh" className="tthc-back-link">
          ‹ Quay lại danh sách thủ tục
        </Link>

        {loading && (
          <div className="tthc-loading-list">
            <div className="tthc-skeleton-row" />
            <div className="tthc-skeleton-row" />
            <div className="tthc-skeleton-row" />
          </div>
        )}

        {!loading && error && (
          <div className="tthc-empty">
            <div className="tthc-empty-icon">!</div>
            <h3>{error}</h3>
            <p>
              Bà con vui lòng quay lại danh sách để chọn thủ tục khác, hoặc đến trực tiếp
              Bộ phận Một cửa UBND xã Đăk Pxi để được cán bộ hướng dẫn.
            </p>
          </div>
        )}

        {!loading && !error && procedure && (
          <>


            {/* Tiêu đề, mô tả ngắn, nút nghe hướng dẫn */}
            <section className="tthc-detail-hero">
              <h1 className="tthc-page-title">{procedure.title}</h1>
              {procedure.summary && <p className="tthc-page-help">{procedure.summary}</p>}
              <SpeakButton procedure={procedure} />
            </section>

            {/* Thông tin nhanh */}
            <div className="tthc-info-grid">
              <div>
                <span>Thời gian giải quyết</span>
                <strong>{procedure.processing_time || "Đang cập nhật"}</strong>
              </div>
              <div>
                <span>Lệ phí</span>
                <strong>{procedure.fee || "Đang cập nhật"}</strong>
              </div>
              <div>
                <span>Nơi thực hiện</span>
                <strong>{procedure.agency || "UBND xã Đăk Pxi"}</strong>
              </div>
            </div>

            {/* Giấy tờ cần chuẩn bị */}
            {procedure.required_documents && (
              <section className="tthc-detail-section">
                <h3>Giấy tờ cần chuẩn bị</h3>
                <p className="tthc-rich-text">{procedure.required_documents}</p>
              </section>
            )}

            {/* Điều kiện thực hiện */}
            {procedure.conditions_text && (
              <section className="tthc-detail-section">
                <h3>Điều kiện thực hiện</h3>
                <p className="tthc-rich-text">{procedure.conditions_text}</p>
              </section>
            )}

            {/* Các bước thực hiện — có thể bấm đánh dấu đã xong */}
            <StepGuide procedure={procedure} sessionId={sessionId} />

            {/* Biểu mẫu tải về */}
            <FormDownloadList forms={procedure.forms} />

            {/* Hình ảnh, video hướng dẫn */}
            <MediaGallery media={procedure.media} />

            {/* Hỏi đáp và đánh giá */}
            <QuestionBox procedureId={procedure.id} />
            <RatingBox procedureId={procedure.id} />
          </>
        )}
      </main>
    </div>
  );
}