import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ShieldAlert,
  Eye,
  Megaphone,
  Shield,
  Users,
  Bell,
  Bus,
  AlertTriangle,
  Calendar,
  Thermometer,
  CloudRain,
  Phone,
  MapPin,
  TrendingUp,
  Coffee,
  Clock,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Globe,
  BarChart3,
  Sprout,
  Trees,
  Wheat,
  Building2
} from 'lucide-react';
import TodayInfoCard from './TodayInfoCard';
import { getDakPxiToday } from '../../services/dakPxiTodayService';
import './DakPxiToday.css';

// SVG Weather Sun & Rain Cloud Graphic matching exact picture 2 aesthetic
function WeatherGraphic3D() {
  return (
    <svg width="105" height="105" viewBox="0 0 120 120" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Sun */}
      <circle cx="52" cy="48" r="28" fill="url(#sunGlow)" />
      {/* Sun rays */}
      <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
        <line x1="52" y1="8" x2="52" y2="16" />
        <line x1="52" y1="80" x2="52" y2="88" />
        <line x1="12" y1="48" x2="20" y2="48" />
        <line x1="84" y1="48" x2="92" y2="48" />
        <line x1="24" y1="20" x2="30" y2="26" />
        <line x1="74" y1="70" x2="80" y2="76" />
        <line x1="24" y1="76" x2="30" y2="70" />
        <line x1="74" y1="26" x2="80" y2="20" />
      </g>

      {/* Cloud */}
      <path d="M88 74C94.63 74 100 68.63 100 62C100 55.93 96.3 50.73 90.9 48.56C89.76 39.14 81.72 32 72 32C64.84 32 58.66 35.88 55.48 41.64C53.68 40.58 51.58 40 49.34 40C43.08 40 38 45.08 38 51.34C38 52.34 38.14 53.32 38.4 54.26C34.68 56.18 32 60.08 32 64.66C32 70.92 37.08 76 43.34 76H88Z" fill="url(#cloudGrad)" />
      
      {/* Rain drops */}
      <path d="M48 84L44 96" stroke="url(#rainGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M64 86L60 98" stroke="url(#rainGrad)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M80 84L76 96" stroke="url(#rainGrad)" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

export default function DakPxiToday() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState(null);
  
  // Scroll tracking states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollContainerRef = useRef(null);

  const checkScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const todayData = await getDakPxiToday();
      setData(todayData);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu Đăk Pxi Hôm nay:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('dak_pxi_today_updated', handleUpdate);
    return () => window.removeEventListener('dak_pxi_today_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollState();
      el.addEventListener('scroll', checkScrollState);
      window.addEventListener('resize', checkScrollState);
      return () => {
        el.removeEventListener('scroll', checkScrollState);
        window.removeEventListener('resize', checkScrollState);
      };
    }
  }, [data]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const handleNavigateCategory = (catId) => {
    setActiveModalItem(null);
    navigate(`/dak-pxi-hom-nay?category=${catId}`, { state: { category: catId } });
  };

  const handleOpenAll = () => {
    navigate('/dak-pxi-hom-nay');
  };

  if (loading || !data) {
    return (
      <div className="dkt-bar-container skeleton-dkt">
        <div className="skeleton-box" style={{ height: '90px' }} />
      </div>
    );
  }

  const { weather, alert, infoCards, dateString, lastUpdated, agriculture, transit, vaccine } = data;

  return (
    <section className="dkt-bar-section">
      
      {/* CẢNH BÁO QUAN TRỌNG NẾU CÓ LEVEL URGENT */}
      {alert && alert.hasAlert && alert.level === 'urgent' && (
        <div className="dakpxi-urgent-alert-banner">
          <div className="urgent-banner-icon">
            <ShieldAlert size={26} color="#ffffff" />
          </div>
          <div className="urgent-banner-content">
            <div className="urgent-banner-title">🔴 CẢNH BÁO KHẨN CẤP TẠI XÃ ĐĂK PXI</div>
            <div className="urgent-banner-desc">{alert.urgentNotice || alert.description}</div>
          </div>
          <button 
            className="urgent-banner-btn"
            onClick={() => setActiveModalItem({
              category: "alert",
              title: "CẢNH BÁO KHẨN CẤP",
              value: alert.title,
              description: alert.description
            })}
          >
            Xem hướng dẫn an toàn →
          </button>
        </div>
      )}

      {/* HORIZONTAL BAR AS IN THE EXACT SCREENSHOT */}
      <div className="dkt-main-horizontal-bar">
        
        {/* KHỐI BÊN TRÁI: CARD ĐĂK PXI HÔM NAY (VIỀN ĐỎ ĐÔ / TERRACOTTA) */}
        <div className="dkt-left-feature-card" onClick={() => setActiveModalItem({ isDashboardModal: true })} title="Bấm để mở Bảng Dashboard Đăk Pxi Hôm Nay">
          <WeatherGraphic3D />
          <div className="dkt-left-card-text">
            <h2 className="dkt-left-card-title">ĐĂK PXI HÔM NAY</h2>
            <p className="dkt-left-card-sub">Những thông tin quan trọng bà con cần biết trong ngày</p>
          </div>
        </div>

        {/* CONTAINER CHỨA DẢI CÁC THẺ & NÚT ĐIỀU HƯỚNG TRƯỢT MƯỢT MA */}
        <div className="dkt-strip-wrapper">

          {canScrollLeft && (
            <button 
              className="dkt-nav-arrow dkt-nav-arrow-left" 
              onClick={handleScrollLeft} 
              title="Bấm để trượt về trước"
              type="button"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* KHỐI GIỮA: DẢI CÁC THẺ THÔNG TIN NẰM NGANG VỚI VẠCH NĂNG CÁCH */}
          <div className="dkt-middle-cards-strip" ref={scrollContainerRef}>
            {infoCards.map((card, idx) => (
              <TodayInfoCard
                key={card.id || idx}
                icon={card.icon}
                category={card.category}
                title={card.title}
                value={card.value}
                description={card.description}
                status={card.status}
                onClick={() => setActiveModalItem(card)}
              />
            ))}
          </div>

          {canScrollRight && (
            <button 
              className="dkt-nav-arrow dkt-nav-arrow-right" 
              onClick={handleScrollRight} 
              title="Bấm để trượt xem thẻ bên phải"
              type="button"
            >
              <ChevronRight size={18} />
            </button>
          )}

        </div>

      </div>

      {/* DYNAMIC POPUP MODALS FOR SUB-FEATURES */}
      {activeModalItem && (
        <div className="dkt-modal-overlay" onClick={() => setActiveModalItem(null)}>
          
          {/* SUB-MODAL 1: GIÁ NÔNG SẢN */}
          {(activeModalItem.category === 'agriculture' || activeModalItem.id === 'agriculture') ? (
            <div className="dkt-sub-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sub-modal-header header-amber">
                <div className="sub-modal-header-title">
                  <Coffee size={22} />
                  <span>BẢNG GIÁ NÔNG SẢN XÃ ĐĂK PXI</span>
                </div>
                <button className="sub-modal-close-btn" onClick={() => setActiveModalItem(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="sub-modal-body">
                <div className="agri-price-grid">
                  <div className="agri-price-card highlight-price">
                    <div className="agri-item-name">
                      <Coffee size={15} color="#b45309" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      <span>Cà phê nhân xô</span>
                    </div>
                    <div className="agri-item-val">{agriculture?.coffeePrice || '118.500 đ/kg'}</div>
                    <div className="agri-item-status" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={13} color="#16a34a" />
                      <span>Giá ổn định, thu mua cao</span>
                    </div>
                  </div>

                  <div className="agri-price-card">
                    <div className="agri-item-name">
                      <Sprout size={15} color="#d97706" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      <span>Mì / Sắn lát khô</span>
                    </div>
                    <div className="agri-item-val">{agriculture?.cassavaPrice || '3.800 đ/kg'}</div>
                    <div className="agri-item-status">ổn định tại đại lý</div>
                  </div>

                  <div className="agri-price-card">
                    <div className="agri-item-name">
                      <Trees size={15} color="#15803d" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      <span>Mủ Cao su tươi</span>
                    </div>
                    <div className="agri-item-val">{agriculture?.rubberPrice || '340 đ/TSC'}</div>
                    <div className="agri-item-status">Thu mua tại điểm tập kết</div>
                  </div>

                  <div className="agri-price-card">
                    <div className="agri-item-name">
                      <Wheat size={15} color="#ca8a04" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                      <span>Bắp / Ngô hạt khô</span>
                    </div>
                    <div className="agri-item-val">{agriculture?.cornPrice || '6.200 đ/kg'}</div>
                    <div className="agri-item-status">Giá thu mua tại kho</div>
                  </div>
                </div>

                {/* GHI CHÚ */}
                <div className="sub-modal-note-box" style={{ marginBottom: '14px' }}>
                  <TrendingUp size={16} color="#854d0e" />
                  <span>{agriculture?.note || "Giá thu mua nông sản tham khảo chính thức tại đại lý xã Đăk Pxi & huyện Đăk Hà."}</span>
                </div>

                {/* KHỐI MÃ QR & LINK THEO DÕI GIÁ CHÍNH XÁC NHẤT */}
                <div className="agri-qr-box">
                  <div className="agri-qr-image-wrapper">
                    <img 
                      src={agriculture?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(agriculture?.link || 'https://nhabeagri.com/gia-nong-san/')}`} 
                      alt="Mã QR xem giá nông sản chính xác" 
                      className="agri-qr-img" 
                    />
                    <div className="agri-qr-label">Quét mã QR tra cứu 24/7</div>
                  </div>

                  <div className="agri-qr-info">
                    <div className="agri-qr-info-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={17} color="#78350f" />
                      <span>HỆ THỐNG THEO DÕI GIÁ NÔNG SẢN CHÍNH XÁC NHẤT</span>
                    </div>
                    <div className="agri-qr-info-desc">Bà con nhấp vào nút bên dưới hoặc quét mã QR để mở trang tra cứu giá thị trường cập nhật liên tục trên Nhà Bè Agri:</div>
                    
                    <a 
                      href={agriculture?.link || 'https://nhabeagri.com/gia-nong-san/'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="agri-direct-link-btn"
                      title="Mở trang nhabeagri.com/gia-nong-san/"
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Globe size={15} />
                        MỞ TRANG XEM GIÁ TRỰC TIẾP
                      </span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

              </div>

              <div className="sub-modal-footer">
                <a 
                  href={agriculture?.link || 'https://nhabeagri.com/gia-nong-san/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sub-modal-btn btn-amber" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ExternalLink size={15} /> Truy cập nhabeagri.com/gia-nong-san/ →
                </a>
              </div>
            </div>


          ) : (activeModalItem.category === 'health' || activeModalItem.id === 'vaccine') ? (
            /* SUB-MODAL 3: LỊCH TIÊM CHỦNG & Y TẾ */
            <div className="dkt-sub-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="sub-modal-header header-green">
                <div className="sub-modal-header-title">
                  <ShieldCheck size={22} />
                  <span>LỊCH TIÊM CHỦNG & CHĂM SÓC Y TẾ XÃ</span>
                </div>
                <button className="sub-modal-close-btn" onClick={() => setActiveModalItem(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="sub-modal-body">
                <div className="health-detail-card">
                  <div className="hdetail-row">
                    <Calendar size={18} className="hdetail-icon" />
                    <span><strong>Thời gian tiêm:</strong> {vaccine?.date || 'Ngày mai (08/08)'} ({vaccine?.time || 'Sáng: 07:30 - 11:00'})</span>
                  </div>
                  <div className="hdetail-row">
                    <MapPin size={18} className="hdetail-icon" />
                    <span><strong>Địa điểm:</strong> {vaccine?.location || 'Trạm Y tế xã Đăk Pxi'}</span>
                  </div>
                  <div className="hdetail-row">
                    <Users size={18} className="hdetail-icon" />
                    <span><strong>Đối tượng:</strong> {vaccine?.target || 'Trẻ em dưới 5 tuổi & Phụ nữ mang thai'}</span>
                  </div>
                  <div className="hdetail-row">
                    <ShieldCheck size={18} className="hdetail-icon" />
                    <span><strong>Danh mục vắc-xin:</strong> {vaccine?.note || 'Tiêm vắc-xin 5 trong 1, Sởi, Bại liệt cho trẻ em & Uốn ván cho phụ nữ mang thai'}</span>
                  </div>
                  <div className="hdetail-row">
                    <Phone size={18} className="hdetail-icon" />
                    <span><strong>Hotline Trạm Y tế xã:</strong> <strong style={{ color: '#15803d', fontSize: '15px' }}>{vaccine?.phone || '0260.385.5678'}</strong></span>
                  </div>
                </div>

                <div className="health-guide-box" style={{ marginBottom: '14px' }}>
                  <ShieldCheck size={16} color="#15803d" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  <span><strong>Lưu ý cho bà con:</strong> Khi đưa trẻ đi tiêm, vui lòng mang theo <strong>Sổ tiêm chủng của trẻ, Thẻ BHYT và CCCD</strong> của phụ huynh.</span>
                </div>

                {/* KHỐI MÃ QR & LINK TRUY CẬP CỔNG TIÊM CHỦNG QUỐC GIA */}
                <div className="health-qr-box">
                  <div className="health-qr-image-wrapper">
                    <img 
                      src={vaccine?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(vaccine?.link || 'https://tiemchungcovid19.gov.vn')}`} 
                      alt="Mã QR tra cứu lịch tiêm chủng" 
                      className="health-qr-img" 
                    />
                    <div className="health-qr-label">Quét mã QR tra cứu 24/7</div>
                  </div>

                  <div className="health-qr-info">
                    <div className="health-qr-info-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={17} color="#14532d" />
                      <span>CỔNG THÔNG TIN TIÊM CHỦNG & SỔ SỨC KHỎE</span>
                    </div>
                    <div className="health-qr-info-desc">Quét mã QR hoặc nhấp vào nút bên dưới để tra cứu lịch sử tiêm chủng và thông tin sức khỏe điện tử:</div>
                    
                    <a 
                      href={vaccine?.link || 'https://tiemchungcovid19.gov.vn'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="health-direct-link-btn"
                      title="Mở Cổng thông tin tiêm chủng"
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Globe size={15} />
                        MỞ TRANG TIÊM CHỦNG QUỐC GIA
                      </span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

              </div>

              <div className="sub-modal-footer">
                <a 
                  href={vaccine?.link || 'https://tiemchungcovid19.gov.vn'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sub-modal-btn btn-green" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                >
                  <ExternalLink size={15} /> Mở Cổng tiêm chủng quốc gia →
                </a>
              </div>
            </div>

          ) : (
            /* DEFAULT / MAIN DASHBOARD MODAL POPUP (IMAGE 2 DESIGN) */
            <div className="dkt-img2-modal-card" onClick={(e) => e.stopPropagation()}>
              
              {/* 1. HEADER BANNER XANH LÁ ĐẬM */}
              <div className="dkt-img2-header">
                <div className="dkt-img2-header-left">
                  <WeatherGraphic3D />
                  <div>
                    <h2 className="dkt-img2-header-title">ĐĂK PXI HÔM NAY</h2>
                    <p className="dkt-img2-header-sub">Thông tin quan trọng cho bà con</p>
                  </div>
                </div>

                <button className="dkt-img2-close-btn" onClick={() => setActiveModalItem(null)} title="Đóng cửa sổ">
                  <X size={20} />
                </button>
              </div>

              {/* 2. BODY CHÍNH KHỐI KÉP (THỜI TIẾT BÊN TRÁI & KHỐI MÃ QR BÊN PHẢI) */}
              <div className="dkt-img2-body">
                
                {/* KHỐI THỜI TIẾT HÔM NAY (BÊN TRÁI) */}
                <div className="dkt-img2-weather-col">
                  <h3 className="dkt-img2-section-title">THỜI TIẾT HÔM NAY</h3>
                  
                  <div className="dkt-img2-weather-top-row">
                    <WeatherGraphic3D />

                    <div className="dkt-img2-temp-col">
                      <div className="dkt-img2-temp-num">{weather?.temperature || '24°C'}</div>
                      <div className="dkt-img2-highlight-badge">
                        📌 Nội dung nổi bật: <strong>{weather?.temperature || '24°C'}</strong>
                      </div>
                      <div className="dkt-img2-weather-subtext">
                        {weather?.condition || 'Nhiều mây, khả năng mưa 60%'}
                      </div>
                    </div>
                  </div>

                  {/* THẺ THÔNG TIN CHI TIẾT */}
                  <div className="dkt-img2-weather-card">
                    <div className="weather-info-line">
                      <Thermometer size={17} className="info-line-icon text-red" />
                      <span><strong>Nhiệt độ:</strong> {weather?.temperature || '24°C'}</span>
                    </div>
                    <div className="weather-info-line">
                      <CloudRain size={17} className="info-line-icon text-blue" />
                      <span><strong>Thời tiết:</strong> {weather?.condition || 'Nhiều mây, khả năng mưa 60%'}</span>
                    </div>
                    <div className="weather-info-line align-top">
                      <AlertTriangle size={17} className="info-line-icon text-amber" />
                      <span><strong>Khuyên dùng:</strong> {weather?.recommendation || 'Bà con đi rẫy nên mang theo áo mưa và chú ý đường trơn trượt trên ngầm tràn.'}</span>
                    </div>
                  </div>
                </div>

                {/* KHỐI NỔI NỀN XANH LÁ ĐẬM MÃ QR (BÊN PHẢI) */}
                <div className="dkt-img2-qr-col">
                  
                  {/* RIBBON ĐỎ "QUÉT MÃ NGAY!" */}
                  <div className="dkt-ribbon-tag">
                    <span>QUÉT MÃ NGAY!</span>
                  </div>

                  {/* MÃ QR VỚI VIỀN VÀNG PHÁT SÁNG TO RÕ */}
                  <div className="dkt-qr-glow-box">
                    <img 
                      src={weather?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(weather?.link || 'https://thoitiet.online/quang-ngai/xa-dak-pxi/')}`} 
                      alt="Mã QR dự báo thời tiết trực tiếp" 
                      className="dkt-qr-code-img"
                    />
                  </div>

                  {/* NÚT THẺ ĐỎ MÃ QR XEM THỜI TIẾT TRỰC TIẾP */}
                  <a 
                    href={weather?.link || 'https://thoitiet.online/quang-ngai/xa-dak-pxi/'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="dkt-red-pill-button"
                    title="Nhấp để truy cập trang web thời tiết"
                  >
                    <div className="pill-small">MÃ QR XEM THỜI TIẾT</div>
                    <div className="pill-large">TRỰC TIẾP</div>
                  </a>

                  {/* CHÚ THÍCH DƯỚI NÚT */}
                  <p className="dkt-qr-foot-desc">
                    Quét mã QR để xem bản đồ radar mưa, dự báo thời tiết chi tiết 24/7 và cập nhật nhanh nhất mọi lúc, mọi nơi!
                  </p>

                </div>

              </div>

              {/* 3. DẢI 4 THẺ THÔNG TIN NHANH PHÍA DƯỚI */}
              <div className="dkt-img2-bottom-grid">
                
                {/* CARD 1: CẢNH BÁO */}
                <div className="dkt-img2-bottom-card card-alert" onClick={() => handleNavigateCategory('alert')} title="Nhấp để xem tất cả Cảnh báo">
                  <div className="bcard-header">
                    <AlertTriangle size={18} className="bcard-icon alert-icon" />
                    <span className="bcard-title alert-title">CẢNH BÁO</span>
                  </div>
                  <div className="bcard-main">{alert?.hasAlert ? (alert.urgentNotice || alert.title) : 'Không có cảnh báo'}</div>
                  <div className="bcard-sub">
                    <span>Tình hình địa bàn ổn định</span>
                    <Shield size={24} className="bcard-watermark" />
                  </div>
                </div>

                {/* CARD 2: LỊCH HÔM NAY */}
                <div className="dkt-img2-bottom-card card-event" onClick={() => handleNavigateCategory('event')} title="Nhấp để xem tất cả Lịch hoạt động hôm nay">
                  <div className="bcard-header">
                    <Calendar size={18} className="bcard-icon event-icon" />
                    <span className="bcard-title event-title">LỊCH HÔM NAY</span>
                  </div>
                  <div className="bcard-main event-main">03 <span className="bcard-unit">hoạt động</span></div>
                  <div className="bcard-sub">
                    <span>Xem lịch chi tiết trong ngày</span>
                    <Users size={24} className="bcard-watermark" />
                  </div>
                </div>

                {/* CARD 3: THÔNG BÁO */}
                <div className="dkt-img2-bottom-card card-notice" onClick={() => handleNavigateCategory('notification')} title="Nhấp để xem tất cả Thông báo mới">
                  <div className="bcard-header">
                    <Megaphone size={18} className="bcard-icon notice-icon" />
                    <span className="bcard-title notice-title">THÔNG BÁO</span>
                  </div>
                  <div className="bcard-main notice-main">05 <span className="bcard-unit">thông báo mới</span></div>
                  <div className="bcard-sub">
                    <span>Có thông tin mới từ xã</span>
                    <Bell size={24} className="bcard-watermark" />
                  </div>
                </div>


              </div>

              {/* 4. FOOTER POPUP BANNER */}
              <div className="dkt-img2-footer">
                <div className="dkt-footer-time-pill">
                  <Bell size={15} color="#92400e" />
                  <span>Cập nhật lần cuối: <strong>{lastUpdated || '08:30'} - {dateString || '07/08/2026'}</strong></span>
                </div>

                <button className="dkt-footer-action-btn" onClick={handleOpenAll}>
                  <Eye size={16} /> Xem chi tiết tất cả →
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </section>
  );
}
