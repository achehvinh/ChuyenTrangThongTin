import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ThongBao from "./pages/ThongBao";
import DangNhap from "./pages/DangNhap";
import CanhBao from "./pages/CanhBao";
import LichHop from "./pages/LichHop";
import ChuyenMuc from "./pages/ChuyenMuc";
import ThuVien from "./pages/ThuVien";
import GopY from "./pages/GopY";
import UserApp from "./user-app/App.jsx";

function Layout() {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/dang-nhap";

  return (
    <div className="app-shell">
      {!isLoginPage && <Sidebar />}
      <main className={`app-main ${isLoginPage ? 'app-main--full' : ''}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<DangNhap />} />
          <Route path="/dang-nhap" element={<DangNhap />} />

          {/* Protected */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/thong-bao" element={
            <ProtectedRoute><ThongBao /></ProtectedRoute>
          } />
          <Route path="/canh-bao" element={
            <ProtectedRoute><CanhBao /></ProtectedRoute>
          } />
          <Route path="/lich-hop" element={
            <ProtectedRoute><LichHop /></ProtectedRoute>
          } />
          <Route path="/chuyen-muc" element={
            <ProtectedRoute><ChuyenMuc /></ProtectedRoute>
          } />
          <Route path="/thu-vien" element={
            <ProtectedRoute><ThuVien /></ProtectedRoute>
          } />
          <Route path="/gop-y" element={
            <ProtectedRoute><GopY /></ProtectedRoute>
          } />
          <Route path="/user/*" element={
            <ProtectedRoute><UserApp basename="/user" /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;