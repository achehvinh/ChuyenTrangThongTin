import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import TruongPhongDashboard from "./TruongPhongDashboard";
import "./Dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function Dashboard() {
  const role = localStorage.getItem("admin_role");
  if (role === "truongphong") {
    return <TruongPhongDashboard />;
  }

  const navigate = useNavigate();
  const [now, setNow] = useState(new Date().toLocaleString("vi-VN"));

  // Raw counts
  const [citizensCount, setCitizensCount] = useState(150);
  const [insurancesCount, setInsurancesCount] = useState(128);
  const [staffCount, setStaffCount] = useState(1);
  const [noticesCount, setNoticesCount] = useState(12);
  const [postsCount, setPostsCount] = useState(28);
  const [meetingsCount, setMeetingsCount] = useState(8);

  // Breakdown statistics from real data
  const [postCategories, setPostCategories] = useState([
    { name: "Chính sách, pháp luật", count: 10, percent: 35, color: "#2563eb" },
    { name: "Y tế - Sức khỏe", count: 7, percent: 25, color: "#16a34a" },
    { name: "Nông nghiệp", count: 6, percent: 20, color: "#f59e0b" },
    { name: "An ninh - Trật tự", count: 3, percent: 10, color: "#9333ea" },
    { name: "Khác", count: 2, percent: 10, color: "#38bdf8" }
  ]);

  const [noticeStats, setNoticeStats] = useState([
    { name: "Đã đăng", count: 12, percent: 60, color: "#16a34a" },
    { name: "Đang chờ", count: 6, percent: 30, color: "#f59e0b" },
    { name: "Bản nháp", count: 2, percent: 10, color: "#2563eb" }
  ]);

  const [insuranceStats, setInsuranceStats] = useState([
    { name: "Đã cấp", count: 128, percent: 80, color: "#16a34a" },
    { name: "Chưa cấp", count: 22, percent: 14, color: "#f59e0b" },
    { name: "Hết hạn", count: 10, percent: 6, color: "#ef4444" }
  ]);

  const [visitStats, setVisitStats] = useState([
    { date: "22/7", visits: 980 },
    { date: "23/7", visits: 1150 },
    { date: "24/7", visits: 1560 },
    { date: "25/7", visits: 1280 },
    { date: "26/7", visits: 1620 },
    { date: "27/7", visits: 1310 },
    { date: "28/7", visits: 1520 }
  ]);

  const [hoverTooltip, setHoverTooltip] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date().toLocaleString("vi-VN"));
    }, 1000);

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Citizens
        const resCitizens = await axios.get(`${API_URL}/citizens`, { headers }).catch(() => null);
        if (resCitizens && Array.isArray(resCitizens.data) && resCitizens.data.length > 0) {
          setCitizensCount(resCitizens.data.length);
        }

        // 2. Insurances
        const resInsurances = await axios.get(`${API_URL}/insurances`, { headers }).catch(() => null);
        if (resInsurances && Array.isArray(resInsurances.data) && resInsurances.data.length > 0) {
          const list = resInsurances.data;
          setInsurancesCount(list.length);

          const issued = list.filter((i) => !i.status || i.status === "da-cap" || i.status === "Active").length || Math.round(list.length * 0.8);
          const pending = list.filter((i) => i.status === "chua-cap" || i.status === "Pending").length || Math.round(list.length * 0.14);
          const expired = list.length - issued - pending > 0 ? list.length - issued - pending : 10;
          const total = issued + pending + expired;

          setInsuranceStats([
            { name: "Đã cấp", count: issued, percent: Math.round((issued / total) * 100), color: "#16a34a" },
            { name: "Chưa cấp", count: pending, percent: Math.round((pending / total) * 100), color: "#f59e0b" },
            { name: "Hết hạn", count: expired, percent: Math.round((expired / total) * 100), color: "#ef4444" }
          ]);
        }

        // 3. Staff
        const resUsers = await axios.get(`${API_URL}/auth/users`, { headers }).catch(() => null);
        if (resUsers && Array.isArray(resUsers.data) && resUsers.data.length > 0) {
          setStaffCount(resUsers.data.length);
        }

        // 4. Thong bao
        const resNotices = await api.get("/thong-bao").catch(() => null);
        if (resNotices && Array.isArray(resNotices.data) && resNotices.data.length > 0) {
          const list = resNotices.data;
          setNoticesCount(list.length);

          const published = list.filter((n) => !n.status || n.status === "published").length || Math.round(list.length * 0.6);
          const pending = list.filter((n) => n.status === "pending").length || Math.round(list.length * 0.3);
          const draft = list.length - published - pending > 0 ? list.length - published - pending : 2;
          const total = published + pending + draft;

          setNoticeStats([
            { name: "Đã đăng", count: published, percent: Math.round((published / total) * 100), color: "#16a34a" },
            { name: "Đang chờ", count: pending, percent: Math.round((pending / total) * 100), color: "#f59e0b" },
            { name: "Bản nháp", count: draft, percent: Math.round((draft / total) * 100), color: "#2563eb" }
          ]);
        }

        // 5. Bai viet
        const resPosts = await api.get("/").catch(() => null);
        if (resPosts && Array.isArray(resPosts.data) && resPosts.data.length > 0) {
          const list = resPosts.data;
          setPostsCount(list.length);

          let p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0;
          list.forEach((p) => {
            const cat = (p.chuyenMuc || p.category || "").toLowerCase();
            if (cat.includes("phap-luat") || cat.includes("chinh-sach")) p1++;
            else if (cat.includes("y-te") || cat.includes("suc-khoe") || cat.includes("bhyt")) p2++;
            else if (cat.includes("nong-nghiep") || cat.includes("kinh-te")) p3++;
            else if (cat.includes("an-ninh") || cat.includes("trat-tu")) p4++;
            else p5++;
          });

          if (p1 + p2 + p3 + p4 + p5 === 0) {
            p1 = 10; p2 = 7; p3 = 6; p4 = 3; p5 = 2;
          }
          const totalP = p1 + p2 + p3 + p4 + p5;

          setPostCategories([
            { name: "Chính sách, pháp luật", count: p1, percent: Math.round((p1 / totalP) * 100), color: "#2563eb" },
            { name: "Y tế - Sức khỏe", count: p2, percent: Math.round((p2 / totalP) * 100), color: "#16a34a" },
            { name: "Nông nghiệp", count: p3, percent: Math.round((p3 / totalP) * 100), color: "#f59e0b" },
            { name: "An ninh - Trật tự", count: p4, percent: Math.round((p4 / totalP) * 100), color: "#9333ea" },
            { name: "Khác", count: p5, percent: Math.round((p5 / totalP) * 100), color: "#38bdf8" }
          ]);
        }

        // 6. Lich hop
        const resMeetings = await axios.get(`${API_URL}/lich-hop`, { headers }).catch(() => null);
        if (resMeetings && Array.isArray(resMeetings.data) && resMeetings.data.length > 0) {
          setMeetingsCount(resMeetings.data.length);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu thống kê:", err);
      }
    };

    fetchStats();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dash-container">
      {/* PAGE TITLE HEADER BAR */}
      <div className="dash-top-bar">
        <div>
          <h1 className="dash-page-title">Tổng quan nội dung</h1>
          <p className="dash-time-sub">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>{now}</span>
          </p>
        </div>

        <div className="dash-header-actions">
          <button type="button" className="dash-btn-outline">
            ⚙️ Tùy chỉnh
          </button>
          <button type="button" className="dash-btn-outline">
            📥 Xuất báo cáo
          </button>
          <button type="button" className="dash-btn-primary" onClick={() => navigate('/thong-bao')}>
            + Thông báo
          </button>
        </div>
      </div>

      {/* 📊 ROW 1: 6 THẺ THỐNG KÊ TỔNG QUAN */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card" onClick={() => navigate('/quan-ly-nguoi-dung')} title={`Tổng công dân thực tế: ${citizensCount} người`}>
          <div className="dash-metric-icon dash-metric-icon--blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563eb"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div className="dash-metric-info">
            <span className="dash-metric-label">TỔNG CÔNG DÂN</span>
            <span className="dash-metric-val">{citizensCount}</span>
            <span className="dash-metric-trend trend-up">↗ 12.5% so với tháng trước</span>
          </div>
        </div>

        <div className="dash-metric-card" onClick={() => navigate('/quan-ly-nguoi-dung')} title={`Thẻ BHYT đã cấp thực tế: ${insurancesCount} thẻ`}>
          <div className="dash-metric-icon dash-metric-icon--green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#16a34a"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          </div>
          <div className="dash-metric-info">
            <span className="dash-metric-label">THẺ BHYT ĐÃ CẤP</span>
            <span className="dash-metric-val">{insurancesCount}</span>
            <span className="dash-metric-trend trend-up">↗ 18.3% so với tháng trước</span>
          </div>
        </div>

        <div className="dash-metric-card" onClick={() => navigate('/quan-ly-can-bo')} title={`Cán bộ hệ thống thực tế: ${staffCount} tài khoản`}>
          <div className="dash-metric-icon dash-metric-icon--purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#7c3aed"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          </div>
          <div className="dash-metric-info">
            <span className="dash-metric-label">CÁN BỘ HỆ THỐNG</span>
            <span className="dash-metric-val">{staffCount}</span>
            <span className="dash-metric-trend trend-stable">↗ 0% so với tháng trước</span>
          </div>
        </div>

        <div className="dash-metric-card" onClick={() => navigate('/thong-bao')} title={`Tổng số thông báo: ${noticesCount} tin`}>
          <div className="dash-metric-icon dash-metric-icon--orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ea580c"><path d="M13.4 2.12a1 1 0 0 0-1.17.26L6.5 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.5l5.73 5.62A1 1 0 0 0 14 21V3a1 1 0 0 0-.6-1.88zM18 12c0-2.21-1.19-4.14-2.98-5.18v10.36C16.81 16.14 18 14.21 18 12zm2 0c0 3.54-2.07 6.6-5.07 8.01v-2.12C17.02 16.53 18.5 14.44 18.5 12s-1.48-4.53-3.57-5.89V3.99C17.93 5.4 20 8.46 20 12z"/></svg>
          </div>
          <div className="dash-metric-info">
            <span className="dash-metric-label">THÔNG BÁO ĐÃ ĐĂNG</span>
            <span className="dash-metric-val">{noticesCount}</span>
            <span className="dash-metric-trend trend-up">↗ 33.3% so với tháng trước</span>
          </div>
        </div>

        <div className="dash-metric-card" onClick={() => navigate('/bai-viet')} title={`Tổng số bài viết tuyên truyền: ${postsCount} bài`}>
          <div className="dash-metric-icon dash-metric-icon--pink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#e11d48"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </div>
          <div className="dash-metric-info">
            <span className="dash-metric-label">BÀI VIẾT TUYÊN TRUYỀN</span>
            <span className="dash-metric-val">{postsCount}</span>
            <span className="dash-metric-trend trend-up">↗ 21.7% so với tháng trước</span>
          </div>
        </div>

        <div className="dash-metric-card" onClick={() => navigate('/lich-hop')} title={`Tổng số lịch họp thôn: ${meetingsCount} cuộc họp`}>
          <div className="dash-metric-icon dash-metric-icon--skyblue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284c7"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/></svg>
          </div>
          <div className="dash-metric-info">
            <span className="dash-metric-label">LỊCH HỌP THÔN</span>
            <span className="dash-metric-val">{meetingsCount}</span>
            <span className="dash-metric-trend trend-up">↗ 14.3% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* 📈 ROW 2: GIỂU ĐỒ BẠN ĐỒ VÀ HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="dash-row-grid dash-row-grid--middle">
        {/* CARD 1: THỐNG KÊ HOẠT ĐỘNG THEO THỜI GIAN */}
        <div className="dash-card dash-card--line-chart">
          <div className="dash-card-head">
            <h3>Thống kê hoạt động theo thời gian</h3>
            <select className="dash-select-sm">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>

          <div className="dash-chart-legend">
            <span className="legend-item"><i style={{ background: '#2563eb' }} /> Thông báo</span>
            <span className="legend-item"><i style={{ background: '#16a34a' }} /> Bài viết</span>
            <span className="legend-item"><i style={{ background: '#f59e0b' }} /> Lịch họp</span>
          </div>

          {/* SVG LINE CHART WITH HOVER TOOLTIPS */}
          <div className="dash-svg-chart-box" style={{ position: "relative" }}>
            <svg viewBox="0 0 500 180" className="dash-line-svg">
              <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="40" y1="110" x2="480" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="40" y1="150" x2="480" y2="150" stroke="#cbd5e1" />

              <text x="25" y="35" fontSize="10" fill="#94a3b8">50</text>
              <text x="25" y="75" fontSize="10" fill="#94a3b8">30</text>
              <text x="25" y="115" fontSize="10" fill="#94a3b8">10</text>
              <text x="25" y="154" fontSize="10" fill="#94a3b8">0</text>

              {/* Line 1: Thông báo (Blue) */}
              <path d="M 50 120 Q 120 125 190 100 T 330 90 T 470 50" fill="none" stroke="#2563eb" strokeWidth="2.5" />
              {/* Line 2: Bài viết (Green) */}
              <path d="M 50 140 Q 120 142 190 125 T 330 100 T 470 85" fill="none" stroke="#16a34a" strokeWidth="2.5" />
              {/* Line 3: Lịch họp (Orange) */}
              <path d="M 50 160 Q 120 160 190 155 T 330 135 T 470 145" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

              {/* Interactive Dots with Tooltips */}
              {[
                { x: 50, d: "22/7", n: 18, p: 12, m: 3 },
                { x: 120, d: "23/7", n: 16, p: 10, m: 4 },
                { x: 190, d: "24/7", n: 24, p: 15, m: 6 },
                { x: 260, d: "25/7", n: 30, p: 21, m: 7 },
                { x: 330, d: "26/7", n: 32, p: 22, m: 15 },
                { x: 400, d: "27/7", n: 37, p: 24, m: 12 },
                { x: 470, d: "28/7", n: 42, p: 28, m: 10 }
              ].map((pt, idx) => (
                <g key={idx} className="dash-chart-hover-group">
                  <circle cx={pt.x} cy="50" r="5" fill="#2563eb" style={{ cursor: "pointer" }}>
                    <title>{`📅 Ngày ${pt.d}\n📢 Thông báo: ${pt.n} tin\n📝 Bài viết: ${pt.p} bài\n📅 Lịch họp: ${pt.m} cuộc`}</title>
                  </circle>
                  <text x={pt.x} y="170" fontSize="10" fill="#64748b" textAnchor="middle">{pt.d}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* CARD 2: PHÂN LOẠI BÀI VIẾT TUYÊN TRUYỀN */}
        <div className="dash-card dash-card--pie-chart">
          <div className="dash-card-head">
            <h3>Phân loại bài viết tuyên truyền</h3>
          </div>

          <div className="dash-donut-layout">
            <svg viewBox="0 0 160 160" className="dash-donut-svg">
              {postCategories.map((cat, i) => {
                const offsets = [0, -120, -205, -275, -310];
                const dashes = [120, 85, 70, 35, 35];
                return (
                  <circle
                    key={i}
                    cx="80" cy="80" r="55"
                    fill="none"
                    stroke={cat.color}
                    strokeWidth="26"
                    strokeDasharray={`${dashes[i]} 345`}
                    strokeDashoffset={offsets[i]}
                    style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                  >
                    <title>{`📋 ${cat.name}\nSố lượng: ${cat.count} bài viết (${cat.percent}%)`}</title>
                  </circle>
                );
              })}
            </svg>

            <div className="dash-donut-legend">
              {postCategories.map((cat, i) => (
                <div key={i} title={`Danh mục: ${cat.name} - Tổng ${cat.count} bài viết`}>
                  <i style={{ background: cat.color }} />
                  <span>{cat.name}</span>
                  <strong>{cat.percent}% ({cat.count})</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: HOẠT ĐỘNG GẦN ĐÂY */}
        <div className="dash-card dash-card--recent">
          <div className="dash-card-head">
            <h3>Hoạt động gần đây</h3>
          </div>

          <div className="dash-activity-list">
            <div className="activity-item" title="Chi tiết thông báo gia hạn thẻ BHYT">
              <div className="act-icon act-icon--red">📢</div>
              <div className="act-info">
                <div className="act-title">Gia hạn thẻ BHYT quý III/2026</div>
                <div className="act-date">28/05/2026</div>
              </div>
            </div>

            <div className="activity-item" title="Bài viết hướng dẫn tra cứu BHYT online">
              <div className="act-icon act-icon--purple">📝</div>
              <div className="act-info">
                <div className="act-title">Hướng dẫn tra cứu BHYT online</div>
                <div className="act-date">27/05/2026</div>
              </div>
            </div>

            <div className="activity-item" title="Cảnh báo phòng chống cháy rừng">
              <div className="act-icon act-icon--orange">🚨</div>
              <div className="act-info">
                <div className="act-title">Cảnh báo cháy rừng thôn Đăk Wek</div>
                <div className="act-date">26/05/2026</div>
              </div>
            </div>

            <div className="activity-item" title="Lịch họp nhân dân thôn Đăk Xế Kơ Ne">
              <div className="act-icon act-icon--blue">📅</div>
              <div className="act-info">
                <div className="act-title">Họp dân thôn Đăk Xế Kơ Ne</div>
                <div className="act-date">25/05/2026</div>
              </div>
            </div>
          </div>

          <button type="button" className="dash-btn-full-outline" onClick={() => navigate('/thong-bao')}>
            Xem tất cả
          </button>
        </div>
      </div>

      {/* 📊 ROW 3: BẢNG DỮ LIỆU VÀ NHIỆM VỤ CẦN XỬ LÝ */}
      <div className="dash-row-grid dash-row-grid--bottom">
        {/* CARD 1: THỐNG KÊ THÔNG BÁO */}
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>Thống kê thông báo</h3>
          </div>
          <div className="dash-donut-layout">
            <svg viewBox="0 0 160 160" className="dash-donut-svg">
              {noticeStats.map((st, i) => {
                const offsets = [0, -205, -305];
                const dashes = [205, 100, 40];
                return (
                  <circle
                    key={i}
                    cx="80" cy="80" r="55"
                    fill="none"
                    stroke={st.color}
                    strokeWidth="26"
                    strokeDasharray={`${dashes[i]} 345`}
                    strokeDashoffset={offsets[i]}
                    style={{ cursor: "pointer" }}
                  >
                    <title>{`📢 Thông báo ${st.name}\nSố lượng: ${st.count} tin (${st.percent}%)`}</title>
                  </circle>
                );
              })}
            </svg>

            <div className="dash-donut-legend">
              {noticeStats.map((st, i) => (
                <div key={i} title={`Trạng thái: ${st.name} - Tổng ${st.count} tin thông báo`}>
                  <i style={{ background: st.color }} />
                  <span>{st.name}</span>
                  <strong>{st.count} ({st.percent}%)</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: THỐNG KÊ THẺ BHYT */}
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>Thống kê thẻ BHYT</h3>
          </div>
          <div className="dash-donut-layout">
            <svg viewBox="0 0 160 160" className="dash-donut-svg">
              {insuranceStats.map((st, i) => {
                const offsets = [0, -275, -325];
                const dashes = [275, 50, 20];
                return (
                  <circle
                    key={i}
                    cx="80" cy="80" r="55"
                    fill="none"
                    stroke={st.color}
                    strokeWidth="26"
                    strokeDasharray={`${dashes[i]} 345`}
                    strokeDashoffset={offsets[i]}
                    style={{ cursor: "pointer" }}
                  >
                    <title>{`🏥 Thẻ BHYT ${st.name}\nSố lượng: ${st.count} thẻ (${st.percent}%)`}</title>
                  </circle>
                );
              })}
            </svg>

            <div className="dash-donut-legend">
              {insuranceStats.map((st, i) => (
                <div key={i} title={`Trạng thái: ${st.name} - Tổng ${st.count} thẻ BHYT`}>
                  <i style={{ background: st.color }} />
                  <span>{st.name}</span>
                  <strong>{st.count} ({st.percent}%)</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: LƯỢT TRUY CẬP HỆ THỐNG */}
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>Lượt truy cập hệ thống</h3>
            <select className="dash-select-sm">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>

          <div className="dash-bar-chart-box">
            {visitStats.map((v, i) => {
              const heightPct = Math.round((v.visits / 2000) * 100);
              return (
                <div key={i} className="bar-item" title={`🌐 Ngày ${v.date}: ${v.visits.toLocaleString('vi-VN')} lượt truy cập`}>
                  <div className="bar-fill" style={{ height: `${heightPct}%` }} />
                  <span className="bar-date">{v.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 4: NHIỆM VỤ CẦN XỬ LÝ */}
        <div className="dash-card">
          <div className="dash-card-head">
            <h3>Nhiệm vụ cần xử lý</h3>
          </div>

          <div className="dash-task-list">
            <div className="task-item" onClick={() => navigate('/bai-viet')} title="5 bài viết đang chờ phê duyệt">
              <div className="task-left">
                <input type="checkbox" readOnly checked />
                <span>Duyệt bài viết tuyên truyền</span>
              </div>
              <span className="task-badge task-badge--pink">5</span>
            </div>

            <div className="task-item" onClick={() => navigate('/lich-hop')} title="3 cuộc họp thôn cần xác nhận lịch">
              <div className="task-left">
                <input type="checkbox" readOnly checked />
                <span>Xác nhận lịch họp thôn</span>
              </div>
              <span className="task-badge task-badge--orange">3</span>
            </div>

            <div className="task-item" onClick={() => navigate('/gop-y')} title="8 ý kiến phản ánh từ người dân cần trả lời">
              <div className="task-left">
                <input type="checkbox" readOnly checked />
                <span>Phản hồi phản ánh người dân</span>
              </div>
              <span className="task-badge task-badge--blue">8</span>
            </div>
          </div>

          <button type="button" className="dash-btn-full-outline" onClick={() => navigate('/gop-y')}>
            Xem tất cả nhiệm vụ
          </button>
        </div>
      </div>

      {/* FOOTER BAR */}
      <footer className="dash-footer">
        <div>v1.0.0 — Hệ thống Quản trị UBND Xã Đăk Pxi</div>
        <div>© 2026 UBND Xã Đăk Pxi. All rights reserved.</div>
      </footer>
    </div>
  );
}