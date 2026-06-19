import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import FeedbackPopup from './components/FeedbackPopup';
import AlertBanner from './components/AlertBanner';
import TTSButton from './components/TTSButton';
import DragDrop from './components/DragDrop';
import FloatingChatBot from './components/FloatingChatBot';

import HomePage from './pages/HomePage';
import TraCuuPage from './pages/TraCuuPage';
import HuongDanBHXHPage from './pages/HuongDanBHXHPage';
import HuongDanVNeIDPage from './pages/HuongDanVNeIDPage';
import ThuVienAnh from './pages/Thuvienanh.jsx';
import { ThongTinPage, ThongBaoPage, LienHePage } from './pages/InfoPages';
import AllFeaturesPage from './pages/AllFeaturesPage';
import LichHopPage from './pages/LichHopPage';
import ChuyenDoiSoPage from './pages/ChuyenDoiSoPage';
import DuoiNuocPage from './pages/DuoiNuocPage';
import QuizGame from './pages/QuizGame';

import { LanguageProvider } from './languageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="app-shell">
        <Router>
          <Navbar />
          <AlertBanner />
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
              <Route path="/quiz/:topic" element={<QuizGame />} />
              <Route path="/:category" element={<AllFeaturesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/alert" element={<TTSButton />} />
              <Route path="/drag-drop" element={<DragDrop />} />

            </Routes>
          </main>
        </Router>

        <div className="quick-contacts">
          <FeedbackPopup />
          <a href="tel:0339310915" className="quick-btn call" title="Goi dien">📞</a>
          <a href="https://m.me/ten.fanpage" target="_blank" className="quick-btn messenger" title="Messenger">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" alt="Messenger" />
          </a>
          <a href="https://zalo.me/0339310915" target="_blank" className="quick-btn zalo" title="Zalo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" />
          </a>
        </div>
        <FloatingChatBot type="general" />
      </div>
    </LanguageProvider>
  );
}

export default App;