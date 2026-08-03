import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { getApiUrl } from './utils/apiConfig';

import AlertBanner from './components/AlertBanner';
import DragDrop from './components/DragDrop';
import Navbar from './components/Navbar';
import TTSButton from './components/TTSButton';
import { FontSizeProvider } from './FontSizeContext';

import FloatingChatBot from './components/FloatingChatBot';
import AllFeaturesPage from './pages/AllFeaturesPage';
import ChuyenDoiSoPage from './pages/ChuyenDoiSoPage';
import ChuyenMucPage from './pages/ChuyenMucPage';
import ChuyenTrangThongTin from './pages/ChuyenTrangThongTin';
import CoCauToChucPage from './pages/CoCauToChucPage';
import DangNhap from './pages/DangNhap';
import HomePage from './pages/HomePage';
import HuongDanBHXHPage from './pages/HuongDanBHXHPage';
import HuongDanVNeIDPage from './pages/HuongDanVNeIDPage';
import { LienHePage, ThongBaoPage, ThongTinPage } from './pages/InfoPages';
import LichHopPage from './pages/LichHopPage';
import Thutuchanhchinh from './pages/Thutuchanhchinh';
import ThuVienAnh from './pages/Thuvienanh.jsx';
import TraCuuPage from './pages/TraCuuPage';
// Dòng 20 — đổi thành
import ChatWindow from './components/ai/ChatWindow';
import { LanguageProvider } from './LanguageContext';
import AnToanGiaoThongPage from './pages/AnToanGiaoThongPage';
import BaiVietDetailPage from './pages/BaiVietDetailPage';
import Bando from './pages/Bando';
import Baucu from './pages/Baucu';
import ChayRungPage from './pages/ChayRungPage';
import ContactPage from './pages/ContactPage';
import CuocHopTrucTuyen from './pages/CuocHopTrucTuyen';
import DuoiNuocPage from './pages/DuoiNuocPage';
import Gianongsan from './pages/Gianongsan';
import HelpPage from './pages/HelpPage';
import PhapLuatPage from './pages/PhapLuatPage';
import PhongChongLuaDaoPage from './pages/PhongChongLuaDaoPage';
import QuizGame from './pages/QuizGame';
import TeNanXaHoiPage from './pages/TeNanXaHoiPage';
import ThienTaiPage from './pages/ThienTaiPage';
import ThuTucChiTiet from "./pages/ThuTucChiTiet";
import TruongPhongDashboard from './pages/TruongPhongDashboard';
import VideoPage from './pages/VideoPage';

function Breadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  // Ẩn breadcrumbs trên trang chủ
  if (path === "/" || path === "") return null;

  // Xác định các cấp bậc dựa vào path
  const segments = path.split("/").filter(Boolean);

  // Ẩn breadcrumbs trên trang chi tiết bài viết (vì trang chi tiết có breadcrumb riêng)
  if (segments[0] === "tin-tuc" && segments[1]) return null;
  const breadcrumbsList = [];

  // Mặc định luôn có Trang chủ ở đầu
  breadcrumbsList.push({ label: "Trang chủ", isHome: true, path: "/" });

  if (segments[0] === "chuyen-muc") {
    breadcrumbsList.push({ label: "Chuyên mục", path: "/chuyen-muc" });
  } else if (segments[0] === "thu-tuc-hanh-chinh") {
    breadcrumbsList.push({ label: "Dịch vụ công trực tuyến", path: "/thu-tuc-hanh-chinh" });
    if (segments[1]) {
      breadcrumbsList.push({ label: "Chi tiết thủ tục", path: `/thu-tuc-hanh-chinh/${segments[1]}` });
    }
  } else if (["bau-cu", "duoi-nuoc", "chay-rung", "thien-tai", "te-nan", "an-toan-giao-thong", "phong-chong-lua-dao"].includes(segments[0])) {
    breadcrumbsList.push({ label: "Chuyên mục", path: "/chuyen-muc" });

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
    breadcrumbsList.push({ label: "Tất cả bài viết", path: "/tin-tuc" });
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
          const content = (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {item.isHome && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" style={{ marginRight: '5px' }} aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              )}
              <span>{item.label}</span>
            </span>
          );
          return (
            <span key={index} className="breadcrumb-item-wrapper">
              {index > 0 && <span className="breadcrumb-separator">›</span>}
              {isLast ? (
                <span className="breadcrumb-current">{content}</span>
              ) : (
                <Link to={item.path} className="breadcrumb-link">
                  {content}
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
  const isDashboardPage =
    location.pathname === "/truong-phong" ||
    location.pathname === "/truong-phong-dashboard" ||
    location.pathname === "/quan-ly" ||
    location.pathname === "/quan-tri";
  const hideLayout =
    location.pathname.startsWith("/thu-tuc-hanh-chinh") ||
    location.pathname.startsWith("/huong-dan") ||
    location.pathname.startsWith("/tro-giup") ||
    location.pathname.startsWith("/lien-he") ||
    isLoginPage ||
    isMeetingRoom ||
    isDashboardPage;

  useEffect(() => {
    const sendVisitorHit = async () => {
      try {
        const username = localStorage.getItem("admin_username") || "citizen";
        const role = localStorage.getItem("admin_role") || "citizen";
        const apiBase = getApiUrl();
        const visitorUrl = apiBase.replace("/api/v1", "/api/visitor/hit");
        await axios.post(visitorUrl, { username, role, pathname: location.pathname });
      } catch (err) {
        // Ignored or minimal log to prevent devtools error cluttering
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
          <Route path="/tong-quan" element={<ThongTinPage />} />
          <Route path="/tong-quan-xa-dak-pxi" element={<ThongTinPage />} />
          <Route path="/tra-cuu" element={<TraCuuPage />} />
          <Route path="/co-cau-to-chuc" element={<CoCauToChucPage />} />
          <Route path="/huong-dan-bhxh" element={<HuongDanBHXHPage />} />
          <Route path="/huong-dan-vneid" element={<HuongDanVNeIDPage />} />
          <Route path="/huong-dan" element={<HelpPage />} />
          <Route path="/tro-giup" element={<HelpPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
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
          <Route path="/bai-viet/:id" element={<BaiVietDetailPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/truong-phong" element={<TruongPhongDashboard />} />
          <Route path="/truong-phong-dashboard" element={<TruongPhongDashboard />} />
          <Route path="/quan-ly" element={<TruongPhongDashboard />} />
          <Route path="/quan-tri" element={<TruongPhongDashboard />} />
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
