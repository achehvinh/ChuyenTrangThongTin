import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import TruongPhongDashboard from "./TruongPhongDashboard";
import './Dashboard.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function Dashboard() {
  const role = localStorage.getItem("admin_role");
  if (role === "truongphong") {
    return <TruongPhongDashboard />;
  }

  const navigate = useNavigate();
  const [now, setNow] = useState(new Date().toLocaleString('vi-VN'));

  // State counts
  const [citizensCount, setCitizensCount] = useState(150);
  const [insurancesCount, setInsurancesCount] = useState(128);
  const [staffCount, setStaffCount] = useState(5);
  const [noticesCount, setNoticesCount] = useState(12);
  const [postsCount, setPostsCount] = useState(28);
  const [meetingsCount, setMeetingsCount] = useState(8);

  useEffect(() => {
    // Clock
    const timer = setInterval(() => {
      setNow(new Date().toLocaleString('vi-VN'));
    }, 1000);

    // Fetch stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const headers = { Authorization: `Bearer ${token}` };

        // Citizens
        const resCitizens = await axios.get(`${API_URL}/citizens`, { headers }).catch(() => null);
        if (resCitizens && Array.isArray(resCitizens.data)) {
          setCitizensCount(resCitizens.data.length);
        }

        // Insurances
        const resInsurances = await axios.get(`${API_URL}/insurances`, { headers }).catch(() => null);
        if (resInsurances && Array.isArray(resInsurances.data)) {
          setInsurancesCount(resInsurances.data.length);
        }

        // Staff
        const resUsers = await axios.get(`${API_URL}/auth/users`, { headers }).catch(() => null);
        if (resUsers && Array.isArray(resUsers.data)) {
          setStaffCount(resUsers.data.length);
        }

        // Thong bao
        const resNotices = await api.get('/thong-bao').catch(() => null);
        if (resNotices && Array.isArray(resNotices.data)) {
          setNoticesCount(resNotices.data.length);
        }

        // Bai viet
        const resPosts = await api.get('/').catch(() => null);
        if (resPosts && Array.isArray(resPosts.data)) {
          setPostsCount(resPosts.data.length);
        }

        // Lich hop
        const resMeetings = await axios.get(`${API_URL}/lich-hop`, { headers }).catch(() => null);
        if (resMeetings && Array.isArray(resMeetings.data)) {
          setMeetingsCount(resMeetings.data.length);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu thống kê:", err);
      }
    };

    fetchStats();
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Tổng Công dân', count: citizensCount, route: '/quan-ly-nguoi-dung', color: '#1a3a5c' },
    { label: 'Thẻ BHYT đã cấp', count: insurancesCount, route: '/quan-ly-nguoi-dung', color: '#1a3a5c' },
    { label: 'Cán bộ hệ thống', count: staffCount, route: '/quan-ly-can-bo', color: '#1a3a5c' },
    { label: 'Thông báo đã đăng', count: noticesCount, route: '/thong-bao', color: '#1a3a5c' },
    { label: 'Bài viết tuyên truyền', count: postsCount, route: '/bai-viet', color: '#1a3a5c' },
    { label: 'Lịch họp thôn', count: meetingsCount, route: '/lich-hop', color: '#1a3a5c' },
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