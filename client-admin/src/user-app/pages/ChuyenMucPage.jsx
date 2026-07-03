import { useNavigate } from 'react-router-dom';
import { FEATURES } from '../data';
import './ChuyenMucPage.css';

export default function ChuyenMucPage() {
  const navigate = useNavigate();

  return (
    <div className="chuyenmuc-page">
      <h1>📚 Chuyên Mục Dành Cho Bà Con</h1>

      <div className="features-list">
        {FEATURES.map((f) => (
          <div
            key={f.path}
            className="flist-card"
            onClick={() => navigate(f.path)}
          >
            <div className="flist-img-wrap">
              <img src={f.image} alt={f.title} className="flist-img" />
            </div>

            <div className="flist-body">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="flist-link">Xem chi tiết →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}