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

function Layout() {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/dang-nhap";

  return (
    <div style={{ display: "flex" }}>
      {!isLoginPage && <Sidebar />}
      <div style={{
        marginLeft: isLoginPage ? "0" : "250px",
        width: "100%",
        minHeight: "100vh",
        background: "#f5f7fb",
      }}>
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
        </Routes>
      </div>
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