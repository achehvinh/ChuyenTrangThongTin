import './App.css';
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
function AppLayout() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/thu-tuc-hanh-chinh");

  return (
    <>
      {!hideLayout && (
        <>
          <Navbar />

          <div className="gov-notice-wrapper">
  <div className="gov-notice">
    
    <span className="gov-notice-label">
      Tin mới:
    </span>

    <div className="gov-notice-track">
      <span className="gov-notice-text">
        THÔNG BÁO: Người dân thực hiện thủ tục hành chính trực tuyến trên Cổng Dịch vụ công Quốc gia.
        &nbsp;&nbsp;&nbsp;&nbsp;
        CẢNH BÁO CHÁY RỪNG: Nguy cơ cháy rừng cao trong mùa khô, người dân cần đề cao cảnh giác.
      </span>
    </div>

    <Link to="/thong-bao" className="gov-notice-more">
      Xem thêm →
    </Link>

  </div>
</div>

          <AlertBanner />
        </>
      )}

      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/thong-bao" element={<ThongBaoPage />} />
          <Route path="/thong-tin" element={<ThongTinPage />} />
          <Route path="/tra-cuu" element={<TraCuuPage />} />
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
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
function App() {
  return (
    <LanguageProvider>
      <FontSizeProvider>
        <div className="app-shell">
          <Router>
            <AppLayout />
            <FloatingChatBot />
          </Router>
        </div>
      </FontSizeProvider>
    </LanguageProvider>
  );
}

export default App;