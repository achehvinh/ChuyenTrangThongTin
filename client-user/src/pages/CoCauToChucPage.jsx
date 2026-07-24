import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoCauToChucPage.css';

// ── BỘ ICON SVG CHUẨN HTML5 ──
const SvgIcons = {
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Printer: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Message: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
};

export default function CoCauToChucPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  };

  return (
    <div className="cocau-container">
      <div className="cocau-header">
        <span className="cocau-badge">
          <SvgIcons.Building />
          <span>Cơ cấu tổ chức</span>
        </span>
        <h1>CƠ CẤU TỔ CHỨC PHÒNG VĂN HÓA - XÃ HỘI</h1>
        <p className="cocau-subtitle">Sơ đồ tổ chức bộ máy và phân công nhiệm vụ</p>
      </div>

      {/* ── Sơ đồ tổ chức ── */}
      <section className="cocau-diagram-section">
        <h2 className="cocau-section-title">Sơ Đồ Tổ Chức Bộ Máy</h2>

        <div className="cocau-diagram-container">
          {/* Cấp UBND */}
          <div className="diagram-node node-ubnd">
            <div className="node-title">Ủy ban nhân dân xã Đăk Pxi</div>
          </div>

          <div className="diagram-connector-vertical"></div>

          {/* Cấp Phòng Văn hóa - Xã hội */}
          <div className="diagram-node node-department">
            <div className="node-title">Phòng Văn hóa - Xã hội</div>
          </div>

          <div className="diagram-connector-vertical"></div>

          {/* Trưởng phòng */}
          <div className="diagram-node node-head">
            <div className="node-title">Trưởng phòng (01)</div>
            <div className="node-desc">Lãnh đạo, quản lý toàn diện</div>
          </div>

          <div className="diagram-connector-vertical"></div>

          {/* Phó trưởng phòng */}
          <div className="diagram-node node-deputy">
            <div className="node-title">Phó trưởng phòng (01)</div>
            <div className="node-desc">Hỗ trợ, thay quyền khi vắng</div>
          </div>

          <div className="diagram-connector-vertical"></div>
          <div className="diagram-branch-line"></div>

          {/* Hàng cuối: Công chức chuyên môn & Người lao động */}
          <div className="diagram-row">
            <div className="diagram-col">
              <div className="diagram-node node-staff">
                <div className="node-title">Công chức chuyên môn</div>
                <div className="node-desc">Theo biên chế được giao</div>
              </div>
            </div>

            <div className="diagram-col">
              <div className="diagram-node node-workers">
                <div className="node-title">Người lao động</div>
                <div className="node-desc">Theo nhu cầu công việc</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bảng phân công nhiệm vụ ── */}
      <section className="cocau-table-section">
        <h2 className="cocau-section-title">Chi Tiết Thành Phần Tổ Chức &amp; Vai Trò Nhiệm Vụ</h2>
        <p className="table-subtitle-desc">Bám sát đúng Điều 3 của Quyết định quy định cơ cấu chức danh:</p>
        <div className="cocau-table-wrapper">
          <table className="cocau-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>STT</th>
                <th style={{ width: '250px' }}>Thành phần tổ chức</th>
                <th style={{ width: '220px', textAlign: 'center' }}>Số lượng</th>
                <th>Vai trò, nhiệm vụ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center font-bold">1</td>
                <td className="font-bold">Trưởng phòng</td>
                <td className="text-center font-bold">01</td>
                <td>Lãnh đạo, quản lý và chịu trách nhiệm toàn bộ hoạt động của Phòng Văn hóa – Xã hội.</td>
              </tr>
              <tr>
                <td className="text-center font-bold">2</td>
                <td className="font-bold">Phó Trưởng phòng</td>
                <td className="text-center font-bold">01</td>
                <td>Giúp Trưởng phòng chỉ đạo một số lĩnh vực công tác; được ủy quyền điều hành khi Trưởng phòng vắng mặt.</td>
              </tr>
              <tr>
                <td className="text-center font-bold">3</td>
                <td className="font-bold">Công chức chuyên môn</td>
                <td className="text-center">Theo biên chế được giao</td>
                <td>Thực hiện các nhiệm vụ chuyên môn thuộc các lĩnh vực được phân công; chịu trách nhiệm trước lãnh đạo phòng và trước pháp luật.</td>
              </tr>
              <tr>
                <td className="text-center font-bold">4</td>
                <td className="font-bold">Người lao động</td>
                <td className="text-center">Theo nhu cầu công việc</td>
                <td>Thực hiện các nhiệm vụ hỗ trợ, phục vụ hoạt động của phòng theo sự phân công của lãnh đạo.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Footer hành động ── */}
      <div className="cocau-actions">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          <SvgIcons.ArrowLeft />
          <span>Về Trang chủ</span>
        </button>
        <button className="print-page-btn" onClick={() => window.print()}>
          <SvgIcons.Printer />
          <span>In trang này</span>
        </button>

        <div className="share-buttons-group">
          <button 
            className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? <SvgIcons.Check /> : <SvgIcons.Link />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
          </button>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-btn facebook-btn"
          >
            <SvgIcons.Facebook />
            <span>Facebook</span>
          </a>
          <a 
            href={`https://sp.zalo.me/share_to_zalo?url=${encodeURIComponent(currentUrl)}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-btn zalo-btn"
          >
            <SvgIcons.Message />
            <span>Zalo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
