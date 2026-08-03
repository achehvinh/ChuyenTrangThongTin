import { useEffect, useState } from "react";
import "./QuanLyQuiz.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function QuanLyQuiz() {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    passedCount: 0,
    failedCount: 0,
    passRate: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchResults = async (searchQuery = "") => {
    setLoading(true);
    setErrorMsg("");
    try {
      const url = searchQuery
        ? `${API}/quiz/results?search=${encodeURIComponent(searchQuery)}`
        : `${API}/quiz/results`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setResults(data.data || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setErrorMsg(data.message || "Không thể tải danh sách kết quả");
      }
    } catch (err) {
      console.error("Lỗi tải danh sách cuộc thi:", err);
      setErrorMsg("Không thể kết nối đến máy chủ API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults(searchTerm);
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa lượt chơi của "${name}" không?`)) {
      return;
    }
    try {
      const res = await fetch(`${API}/quiz/results/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa lượt thi thành công!");
        fetchResults(searchTerm);
      } else {
        alert(data.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Lỗi xóa lượt thi:", err);
      alert("Đã xảy ra lỗi khi xóa lượt thi");
    }
  };

  const handleClearAll = async () => {
    if (results.length === 0) return;
    if (
      !window.confirm(
        "⚠️ CẢNH BÁO: Hành động này sẽ XÓA TOÀN BỘ danh sách kết quả cuộc thi trong cơ sở dữ liệu.\n\nBạn có thực sự muốn xóa tất cả không?"
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`${API}/quiz/results`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Đã xóa toàn bộ kết quả cuộc thi!");
        fetchResults("");
      } else {
        alert(data.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Lỗi xóa toàn bộ:", err);
      alert("Đã xảy ra lỗi khi xóa toàn bộ kết quả");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const mins = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${mins} - ${day}/${month}/${year}`;
  };

  return (
    <div className="quanly-quiz-container">
      {/* Tiêu đề & Giới thiệu */}
      <div className="quiz-page-header">
        <div className="header-title-box">
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <span>Quản Lý Thành Tích Cuộc Thi Hiệp Sĩ An Toàn Nguồn Nước</span>
          </h2>
          <p>
            Danh sách chi tiết trẻ em & người dân tham gia thi trắc nghiệm kiến thức phòng chống đuối nước (UBND Xã Đăk Pxi)
          </p>
        </div>
        <div className="header-actions-box">
          <button className="btn-refresh" onClick={() => fetchResults(searchTerm)} title="Tải lại danh sách" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            <span>Làm mới</span>
          </button>
          {results.length > 0 && (
            <button className="btn-clear-all" onClick={handleClearAll} title="Xóa toàn bộ dữ liệu" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>
      </div>

      {/* Thẻ Thống Kê Tổng Quan Với SVG Modern Icons */}
      <div className="quiz-stats-grid">
        <div className="quiz-stat-card card-total">
          <div className="stat-icon" style={{ background: "#eff6ff" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Tổng lượt tham gia</span>
            <span className="stat-value">{stats.totalParticipants}</span>
          </div>
        </div>

        <div className="quiz-stat-card card-passed">
          <div className="stat-icon" style={{ background: "#f0fdf4" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Lượt Đạt bằng khen (≥8/10)</span>
            <span className="stat-value text-success">{stats.passedCount}</span>
          </div>
        </div>

        <div className="quiz-stat-card card-rate">
          <div className="stat-icon" style={{ background: "#fffbeb" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Tỷ lệ hoàn thành Đạt</span>
            <span className="stat-value text-primary">{stats.passRate}%</span>
          </div>
        </div>

        <div className="quiz-stat-card card-score">
          <div className="stat-icon" style={{ background: "#f3e8ff" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Điểm số trung bình</span>
            <span className="stat-value text-warning">{stats.averageScore} / 10</span>
          </div>
        </div>
      </div>

      {/* Thanh Tìm Kiếm */}
      <div className="quiz-toolbar">
        <form onSubmit={handleSearchSubmit} className="quiz-search-form">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Nhập tên bé hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-search">
            Tìm kiếm
          </button>
          {searchTerm && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => {
                setSearchTerm("");
                fetchResults("");
              }}
            >
              ✕ Xóa tìm
            </button>
          )}
        </form>
      </div>

      {/* Bảng Danh Sách Người Tham Gia */}
      <div className="quiz-table-wrapper">
        {loading ? (
          <div className="quiz-loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách thành tích từ máy chủ...</p>
          </div>
        ) : errorMsg ? (
          <div className="quiz-error-state">
            <p>⚠️ {errorMsg}</p>
            <button onClick={() => fetchResults(searchTerm)}>Thử lại</button>
          </div>
        ) : results.length === 0 ? (
          <div className="quiz-empty-state">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "10px" }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <h3>Chưa có dữ liệu thi trắc nghiệm nào</h3>
            <p>
              {searchTerm
                ? `Không tìm thấy người tham gia nào phù hợp với từ khóa "${searchTerm}"`
                : "Khi trẻ em hoặc người dân hoàn thành cuộc thi ở trang người dùng, thành tích sẽ tự động lưu và hiển thị tại đây."}
            </p>
          </div>
        ) : (
          <table className="quiz-table">
            <thead>
              <tr>
                <th style={{ width: "60px", textAlign: "center" }}>STT</th>
                <th>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Họ và tên người chơi</span>
                  </div>
                </th>
                <th style={{ width: "180px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Thời gian tham gia</span>
                  </div>
                </th>
                <th style={{ width: "140px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Số câu đúng</span>
                  </div>
                </th>
                <th style={{ width: "120px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    <span>Tỷ lệ đúng</span>
                  </div>
                </th>
                <th style={{ width: "150px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#005baa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    <span>Trạng thái</span>
                  </div>
                </th>
                <th style={{ width: "90px", textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => {
                const percent = Math.round((item.score / (item.totalQuestions || 10)) * 100);
                return (
                  <tr key={item._id || index}>
                    <td style={{ textAlign: "center", fontWeight: "600", color: "#64748b" }}>
                      {index + 1}
                    </td>
                    <td>
                      <div className="player-name-cell">
                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <span className="player-name">{item.playerName}</span>
                      </div>
                    </td>
                    <td className="time-cell">{formatDate(item.createdAt)}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="score-badge">
                        {item.score} / {item.totalQuestions || 10}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="percent-text">{percent}%</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.passed ? (
                        <span className="status-badge status-passed" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="7"/>
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                          </svg>
                          <span>ĐẠT BẰNG KHEN</span>
                        </span>
                      ) : (
                        <span className="status-badge status-failed" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="9" y1="18" x2="15" y2="18"/>
                            <line x1="10" y1="22" x2="14" y2="22"/>
                            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                          </svg>
                          <span>CHƯA ĐẠT</span>
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn-delete-row"
                        onClick={() => handleDeleteItem(item._id, item.playerName)}
                        title="Xóa lượt chơi này"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
