import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

import Navbar from './components/Navbar';
import FeedbackPopup from './components/FeedbackPopup';
import AlertBanner from './components/AlertBanner';
import TTSButton from './components/TTSButton';
import DragDrop from './components/DragDrop';
import { FontSizeProvider } from './FontSizeContext';

import HomePage from './pages/HomePage';
import TraCuuPage from './pages/TraCuuPage';
import HuongDanBHXHPage from './pages/HuongDanBHXHPage';
import HuongDanVNeIDPage from './pages/HuongDanVNeIDPage';
import ThuVienAnh from './pages/Thuvienanh.jsx';
import { ThongTinPage, ThongBaoPage, LienHePage } from './pages/InfoPages';
import CoCauToChucPage from './pages/CoCauToChucPage';
import DangNhap from './pages/DangNhap';
import AllFeaturesPage from './pages/AllFeaturesPage';
import LichHopPage from './pages/LichHopPage';
import ChuyenDoiSoPage from './pages/ChuyenDoiSoPage';
import Thutuchanhchinh from './pages/Thutuchanhchinh';
import ChuyenTrangThongTin from './pages/ChuyenTrangThongTin';
import ChuyenMucPage from './pages/ChuyenMucPage';
import FloatingChatBot from './components/FloatingChatBot';
// Dòng 20 — đổi thành
import { LanguageProvider } from './LanguageContext';
import DuoiNuocPage from './pages/DuoiNuocPage';
import QuizGame from './pages/QuizGame';
import Bando from './pages/Bando';
import Gianongsan from './pages/Gianongsan';
import ThuTucChiTiet from "./pages/ThuTucChiTiet";
import BaiVietDetailPage from './pages/BaiVietDetailPage';
import ChatWindow from './components/ai/ChatWindow';
import ThienTaiPage from './pages/ThienTaiPage';
import ChayRungPage from './pages/ChayRungPage';
import Baucu from './pages/Baucu';
import TeNanXaHoiPage from './pages/TeNanXaHoiPage';
import PhapLuatPage from './pages/PhapLuatPage';
import VideoPage from './pages/VideoPage';
import TruongPhongDashboard from './pages/TruongPhongDashboard';
import CuocHopTrucTuyen from './pages/CuocHopTrucTuyen';
import AnToanGiaoThongPage from './pages/AnToanGiaoThongPage';
import PhongChongLuaDaoPage from './pages/PhongChongLuaDaoPage';

function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  // Ẩn breadcrumbs trên trang chủ
  if (path === "/" || path === "") return null;

  // Xác định các cấp bậc dựa vào path
  const segments = path.split("/").filter(Boolean);
  const breadcrumbsList = [];

  // Mặc định luôn có Trang chủ ở đầu
  breadcrumbsList.push({ label: "🏠 Trang chủ", path: "/" });

  if (segments[0] === "chuyen-muc") {
    breadcrumbsList.push({ label: "Chuyên mục cho bà con", path: "/chuyen-muc" });
  } else if (segments[0] === "thu-tuc-hanh-chinh") {
    breadcrumbsList.push({ label: "Dịch vụ công trực tuyến", path: "/thu-tuc-hanh-chinh" });
    if (segments[1]) {
      breadcrumbsList.push({ label: "Chi tiết thủ tục", path: `/thu-tuc-hanh-chinh/${segments[1]}` });
    }
  } else if (["bau-cu", "duoi-nuoc", "chay-rung", "thien-tai", "te-nan", "an-toan-giao-thong", "phong-chong-lua-dao"].includes(segments[0])) {
    breadcrumbsList.push({ label: "Chuyên mục cho bà con", path: "/chuyen-muc" });
    
    // Label cho từng chuyên mục
    const labels = {
      "bau-cu": "Tuyên truyền Bầu cử",
      "duoi-nuoc": "Phòng chống đuối nước",
      "chay-rung": "Phòng chống cháy rừng",
      "thien-tai": "Phòng chống thiên tai",
      "te-nan": "Phòng chống tệ nạn",
      "an-toan-giao-thong": "Tuyên truyền An toàn Giao thông",
      "phong-chong-lua-dao": "Phòng chống Lừa đảo Mạng"
    };
    breadcrumbsList.push({ label: labels[segments[0]] || segments[0], path: path });
  } else if (segments[0] === "tin-tuc") {
    breadcrumbsList.push({ label: "Chuyên trang tin tức", path: "/tin-tuc" });
    if (segments[1]) {
      breadcrumbsList.push({ label: "Chi tiết bài viết", path: `/tin-tuc/${segments[1]}` });
    }
  } else {
    // Các trang thông thường khác
    const labels = {
      "co-cau-to-chuc": "Cơ cấu tổ chức",
      "dang-nhap": "Đăng nhập Cán bộ",
      "thong-bao": "Thông báo từ UBND",
      "thong-tin": "Chuyên trang thông tin",
      "tra-cuu": "Tra cứu thông tin",
      "huong-dan-bhxh": "Hướng dẫn BHXH",
      "huong-dan-vneid": "Hướng dẫn VNeID",
      "lich-hop": "Lịch họp Ủy ban",
      "chuyen-doi-so": "Chuyển đổi số",
      "thu-vien-anh": "Thư viện ảnh",
      "lien-he": "Liên hệ UBND xã",
      "Ban-do": "Bản đồ xã Đăk Pxi",
      "gia-nong-san": "Giá nông sản hôm nay",
      "video": "Kênh Video Tuyên Truyền"
    };
    breadcrumbsList.push({ label: labels[segments[0]] || segments[0], path: path });
  }

  return (
    <nav className="global-breadcrumbs" aria-label="Breadcrumb">
      <div className="global-breadcrumbs-inner">
        {breadcrumbsList.map((item, index) => {
          const isLast = index === breadcrumbsList.length - 1;
          return (
            <span key={index} className="breadcrumb-item-wrapper">
              {index > 0 && <span className="breadcrumb-separator">›</span>}
              {isLast ? (
                <span className="breadcrumb-current">{item.label}</span>
              ) : (
                <Link to={item.path} className="breadcrumb-link">
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}

function AppLayout() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/dang-nhap";
  const isMeetingRoom = location.pathname.startsWith("/cuoc-hop-truc-tuyen");
  const isDashboardPage = location.pathname === "/truong-phong";
  const hideLayout =
    location.pathname.startsWith("/thu-tuc-hanh-chinh") || isLoginPage || isMeetingRoom;

  useEffect(() => {
    const sendVisitorHit = async () => {
      try {
        const username = localStorage.getItem("admin_username") || "citizen";
        const role = localStorage.getItem("admin_role") || "citizen";
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        const visitorUrl = apiBase.replace("/api/v1", "/api/visitor/hit");
        await axios.post(visitorUrl, { username, role, pathname: location.pathname });
      } catch (err) {
        console.error("Heartbeat visitor error:", err);
      }
    };

    sendVisitorHit();

    const interval = setInterval(sendVisitorHit, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <>
      {!hideLayout && (
        <>
          <Navbar />

          <AlertBanner />
          <Breadcrumbs />
        </>
      )}

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dang-nhap" element={<DangNhap />} />
          <Route path="/thong-bao" element={<ThongBaoPage />} />
          <Route path="/thong-tin" element={<ThongTinPage />} />
          <Route path="/tra-cuu" element={<TraCuuPage />} />
          <Route path="/co-cau-to-chuc" element={<CoCauToChucPage />} />
          <Route path="/huong-dan-bhxh" element={<HuongDanBHXHPage />} />
          <Route path="/huong-dan-vneid" element={<HuongDanVNeIDPage />} />
          <Route path="/lich-hop" element={<LichHopPage />} />
          <Route path="/chuyen-doi-so" element={<ChuyenDoiSoPage />} />
          <Route path="/thu-vien-anh" element={<ThuVienAnh />} />
          <Route path="/lien-he" element={<LienHePage />} />
          <Route path="/duoi-nuoc" element={<DuoiNuocPage />} />
          <Route path="/thien-tai" element={<ThienTaiPage />} />
          <Route path="/chay-rung" element={<ChayRungPage />} />
          <Route path="/quiz/:topic" element={<QuizGame />} />
          <Route path="/bau-cu" element={<Baucu />} />
          <Route path="/te-nan" element={<TeNanXaHoiPage />} />
          <Route path="/phap-luat" element={<PhapLuatPage />} />
          <Route path="/:category" element={<AllFeaturesPage />} />
          <Route path="/alert" element={<TTSButton />} />
          <Route path="/drag-drop" element={<DragDrop />} />
          <Route path="/thu-tuc-hanh-chinh" element={<Thutuchanhchinh />} />
          <Route path="/thu-tuc-hanh-chinh/:slug" element={<ThuTucChiTiet />} />
          <Route path="/Ban-do" element={<Bando />} />
          <Route path="/gia-nong-san" element={<Gianongsan />} />
          <Route path="/chuyen-muc" element={<ChuyenMucPage />} />
          <Route path="/tin-tuc" element={<ChuyenTrangThongTin />} />
          <Route path="/tin-tuc/:id" element={<BaiVietDetailPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/truong-phong" element={<TruongPhongDashboard />} />
          <Route path="/an-toan-giao-thong" element={<AnToanGiaoThongPage />} />
          <Route path="/phong-chong-lua-dao" element={<PhongChongLuaDaoPage />} />
          <Route path="/cuoc-hop-truc-tuyen/:id" element={<CuocHopTrucTuyen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isLoginPage && !isMeetingRoom && !isDashboardPage && (
        <>
          <FloatingChatBot />
          <ScrollToTop />
        </>
      )}
    </>
  );
}
function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      className={`scroll-to-top-btn ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
      type="button"
    >
      ▲
    </button>
  );
}

function App() {
  return (
    <LanguageProvider>
      <FontSizeProvider>
        <div className="app-shell">
          <Router>
            <AppLayout />
          </Router>
        </div>
      </FontSizeProvider>
    </LanguageProvider>
  );
}

export default App;