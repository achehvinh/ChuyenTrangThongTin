import { useNavigate } from 'react-router-dom';
import { FEATURES } from '../data';
import './ChuyenMucPage.css';

export default function ChuyenMucPage() {
  const navigate = useNavigate();

  return (
    <div className="cm-page">

      {/* Header */}
      <div className="cm-header">
        <h1>Chuyên mục dành cho bà con</h1>
        <p>Thông tin tuyên truyền, hướng dẫn từ UBND xã Đăk Pxi</p>
      </div>

      {/* Danh sách */}
      <div className="cm-grid">
        {FEATURES.map((f) => (
          <div
            key={f.path}
            className="cm-card"
            onClick={() => navigate(f.path)}
          >
            <div className="cm-img-wrap">
              <img src={f.image} alt={f.title} className="cm-img" />
            </div>
            <div className="cm-body">
              <h3 className="cm-title">{f.title}</h3>
              <p className="cm-desc">{f.desc}</p>
              <span className="cm-link">
                Xem chi tiết <span className="arrow">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}