import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";

const STATS = [
  { label: 'Chuyên mục', value: '11', icon: '📋', color: '#005bac', bg: '#e8f0fe', change: 'Đang hoạt động' },
  { label: 'Video hướng dẫn', value: '8', icon: '🎬', color: '#16a34a', bg: '#dcfce7', change: 'Trong chuyên mục' },
  { label: 'Lượt xem trang', value: '1.2K', icon: '👁️', color: '#d97706', bg: '#fef3c7', change: 'Tháng này' },
  { label: 'Bà con nghe TTS', value: '340', icon: '🔊', color: '#7c3aed', bg: '#ede9fe', change: 'Nghe nội dung' },
  { label: 'Thông báo', value: '12', icon: '📢', color: '#0891b2', bg: '#e0f2fe', change: '3 đang hiển thị' },
  { label: 'Lịch họp', value: '8', icon: '📅', color: '#16a34a', bg: '#dcfce7', change: 'Tháng này' },
  { label: 'Góp ý chưa đọc', value: '24', icon: '💬', color: '#db2777', bg: '#fce7f3', change: 'Cần xử lý' },
  { label: 'Cảnh báo khẩn', value: '2', icon: '🚨', color: '#ea580c', bg: '#fff7ed', change: 'Đang kích hoạt' },
];

const DATA_LUOT_XEM = [
  { thang: 'T1', trangChu: 320, huongDan: 180, thongBao: 90 },
  { thang: 'T2', trangChu: 380, huongDan: 210, thongBao: 110 },
  { thang: 'T3', trangChu: 420, huongDan: 260, thongBao: 140 },
  { thang: 'T4', trangChu: 390, huongDan: 290, thongBao: 160 },
  { thang: 'T5', trangChu: 500, huongDan: 340, thongBao: 200 },
  { thang: 'T6', trangChu: 560, huongDan: 410, thongBao: 220 },
];

const DATA_CHUYEN_MUC = [
  { name: 'Tra cứu BHYT', luot: 410 },
  { name: 'Tra cứu BHXH', luot: 320 },
  { name: 'VNeID', luot: 280 },
  { name: 'Đuối nước', luot: 250 },
  { name: 'Thiên tai', luot: 190 },
  { name: 'Cháy rừng', luot: 160 },
];

const RECENT_ALERTS = [
  { type: 'danger', title: 'Cảnh báo cháy rừng thôn Đăk Wek', time: '08:00 - 06/06/2026' },
  { type: 'warning', title: 'Họp dân khẩn thôn Đăk Xế Kơ Ne', time: '10:00 - 06/06/2026' },
];

const RECENT_NOTICES = [
  { type: 'urgent', title: 'Gia hạn thẻ BHYT quý III/2026', time: '28/05/2026' },
  { type: 'normal', title: 'Lịch khám sức khỏe hộ nghèo', time: '20/05/2026' },
  { type: 'guide', title: 'Hướng dẫn tra cứu BHYT online', time: '15/05/2026' },
];

const RECENT_GOPY = [
  { name: 'Nguyễn Văn A', noi_dung: 'Trang hướng dẫn VNeID rất dễ hiểu, bà con dùng được', time: '06/06/2026', status: 'chua-doc' },
  { name: 'Trần Thị B', noi_dung: 'Mong thêm video hướng dẫn bằng tiếng Xơ Đăng', time: '05/06/2026', status: 'da-doc' },
  { name: 'Lê Văn C', noi_dung: 'Chữ trên trang hơi nhỏ, bà con lớn tuổi khó đọc', time: '04/06/2026', status: 'chua-doc' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const now = new Date().toLocaleString('vi-VN');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-page">

      {/* Topbar */}
      <div className="dashboard-topbar">
        <div>
          <h1>📊 Dashboard Tuyên truyền</h1>
          <p>🕐 Cập nhật lúc: {now} — UBND xã Đăk Pxi</p>
        </div>
        <div className="dashboard-btn-group">
          <button className="btn-primary" onClick={() => navigate('/bai-viet')}>
            📝 Quản lý bài viết
          </button>
          <button className="btn-primary" onClick={() => navigate('/thong-bao')}>
            📢 Đăng thông báo
          </button>
          <button className="btn-danger" onClick={() => navigate('/canh-bao')}>
            🚨 Cảnh báo khẩn
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {[
          { id: 'overview', label: '📊 Tổng quan' },
          { id: 'luot-xem', label: '👁️ Lượt xem' },
          { id: 'chuyen-muc', label: '📋 Chuyên mục' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >{tab.label}</button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stats">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="stat-card"
            style={{ borderTopColor: s.color }}
          >
            <div>
              <p className="stat-label">{s.label}</p>
              <h3 className="stat-value" style={{ color: s.color }}>{s.value}</h3>
              <p className="stat-change">{s.change}</p>
            </div>
            <div className="stat-icon-box" style={{ background: s.bg }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Tab: Tổng quan */}
      {activeTab === 'overview' && (
        <div className="dashboard-grid-2">

          {/* Cảnh báo khẩn */}
          <div className="dashboard-panel">
            <h3>🚨 Cảnh báo đang kích hoạt</h3>
            {RECENT_ALERTS.map((a, i) => (
              <div key={i} className={`alert-item ${a.type}`}>
                <span style={{ fontSize: '20px' }}>{a.type === 'danger' ? '🔴' : '🟡'}</span>
                <div>
                  <p className="alert-item-title">{a.title}</p>
                  <p className="alert-item-time">{a.time}</p>
                </div>
              </div>
            ))}
            <button className="btn-sm-danger" onClick={() => navigate('/canh-bao')}>
              Quản lý cảnh báo →
            </button>
          </div>

          {/* Thông báo gần đây */}
          <div className="dashboard-panel">
            <h3>📢 Thông báo gần đây</h3>
            {RECENT_NOTICES.map((n, i) => (
              <div key={i} className="notice-item">
                <span>{n.type === 'urgent' ? '🔴' : n.type === 'guide' ? '🟢' : '🔵'}</span>
                <div style={{ flex: 1 }}>
                  <p className="notice-item-title">{n.title}</p>
                  <p className="notice-item-time">{n.time}</p>
                </div>
              </div>
            ))}
            <button className="btn-sm-primary" onClick={() => navigate('/thong-bao')}>
              Xem tất cả →
            </button>
          </div>

        </div>
      )}

      {/* Tab: Lượt xem */}
      {activeTab === 'luot-xem' && (
        <div className="chart-panel">
          <h3>📈 Lượt xem theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={DATA_LUOT_XEM}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="thang" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="trangChu" name="Trang chủ" stroke="#005bac" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="huongDan" name="Hướng dẫn" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="thongBao" name="Thông báo" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tab: Chuyên mục */}
      {activeTab === 'chuyen-muc' && (
        <div className="chart-panel">
          <h3>📋 Chuyên mục được xem nhiều nhất</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DATA_CHUYEN_MUC} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={110} fontSize={13} />
              <Tooltip formatter={(val) => `${val} lượt xem`} />
              <Bar dataKey="luot" name="Lượt xem" fill="#005bac" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Góp ý gần đây */}
      <div className="gopy-panel">
        <div className="gopy-panel-header">
          <h3>💬 Góp ý bà con gần đây</h3>
          <button className="btn-sm-ghost" onClick={() => navigate('/gop-y')}>
            Xem tất cả →
          </button>
        </div>
        <div className="gopy-list">
          {RECENT_GOPY.map((g, i) => (
            <div key={i} className={`gopy-item ${g.status}`}>
              <div className={`gopy-avatar ${g.status}`}>👤</div>
              <div style={{ flex: 1 }}>
                <div className="gopy-meta">
                  <span className="gopy-name">{g.name}</span>
                  <div className="gopy-right">
                    <span className="gopy-time">{g.time}</span>
                    {g.status === 'chua-doc' && (
                      <span className="gopy-badge">Chưa đọc</span>
                    )}
                  </div>
                </div>
                <p className="gopy-text">{g.noi_dung}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}