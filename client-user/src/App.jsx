import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import TraCuuPage from './pages/TraCuuPage.jsx';
import HuongDanBHXHPage from './pages/HuongDanBHXHPage.jsx';
import HuongDanVNeIDPage from './pages/HuongDanVNeIDPage.jsx';
import { ThongTinPage, ThongBaoPage, LienHePage } from './pages/InfoPages.jsx';
import AllFeaturesPage from "./pages/AllFeaturesPage.jsx";
import { LanguageProvider } from './LanguageContext';
import FeedbackPopup from './components/FeedbackPopup';
import LichHopPage from './pages/LichHopPage';
import AlertBanner from './components/AlertBanner';

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
              <Route path="/tra-cuu" element={<TraCuuPage />} />
              <Route path="/huong-dan-bhxh" element={<HuongDanBHXHPage />} />
              <Route path="/huong-dan-vneid" element={<HuongDanVNeIDPage />} />
              <Route path="/lich-hop" element={<LichHopPage />} />
              <Route path="/lien-he" element={<LienHePage />} />
              <Route path="/:category" element={<AllFeaturesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
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

      </div>
    </LanguageProvider>
  );
}

export default App;