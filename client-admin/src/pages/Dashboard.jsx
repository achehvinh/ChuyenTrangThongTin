import { useNavigate } from "react-router-dom";
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const now = new Date().toLocaleString('vi-VN');

  // Giả lập dữ liệu — sau này thay bằng API thật
  const stats = [
    { label: 'Thông báo', count: 12, route: '/thong-bao', color: '#005bac' },
    { label: 'Bài viết', count: 28, route: '/bai-viet', color: '#16a34a' },
    { label: 'Cảnh báo khẩn', count: 2, route: '/canh-bao', color: '#ea580c' },
    { label: 'Lịch họp', count: 8, route: '/lich-hop', color: '#7c3aed' },
    { label: 'Chuyên mục', count: 11, route: '/chuyen-muc', color: '#0891b2' },
    { label: 'Thư viện ảnh', count: 45, route: '/thu-vien', color: '#d97706' },
  ];

  const recentItems = [
    { type: 'thong-bao', title: 'Gia hạn thẻ BHYT quý III/2026', time: '28/05/2026' },
    { type: 'bai-viet', title: 'Hướng dẫn tra cứu BHYT online', time: '27/05/2026' },
    { type: 'canh-bao', title: 'Cảnh báo cháy rừng thôn Đăk Wek', time: '26/05/2026' },
    { type: 'lich-hop', title: 'Họp dân thôn Đăk Xế Kơ Ne', time: '25/05/2026' },
  ];

  const typeLabels = {
    'thong-bao': '📢',
    'bai-viet': '📝',
    'canh-bao': '🚨',
    'lich-hop': '📅',
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tổng quan nội dung</h1>
          <p className="dashboard-time">🕐 {now}</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => navigate('/thong-bao')}>
            + Thông báo
          </button>
          <button className="btn-primary" onClick={() => navigate('/bai-viet')}>
            + Bài viết
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            onClick={() => navigate(s.route)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-card-inner">
              <p className="stat-label">{s.label}</p>
              <h3 className="stat-count" style={{ color: s.color }}>{s.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="dashboard-recent">
        <h3>Hoạt động gần đây</h3>
        <div className="recent-list">
          {recentItems.map((item, i) => (
            <div key={i} className="recent-item">
              <span className="recent-icon">{typeLabels[item.type]}</span>
              <div className="recent-info">
                <span className="recent-title">{item.title}</span>
                <span className="recent-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}