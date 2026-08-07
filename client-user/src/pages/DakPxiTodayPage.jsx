import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  ShieldAlert,
  ArrowLeft,
  Clock
} from 'lucide-react';
import Footer from './Footer';
import TodayInfoCard from '../components/DakPxiToday/TodayInfoCard';
import { getDakPxiToday } from '../services/dakPxiTodayService';
import '../components/DakPxiToday/DakPxiToday.css';

export default function DakPxiTodayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    getDakPxiToday().then(res => setData(res));
    const cat = searchParams.get('category') || location.state?.category;
    if (cat) {
      setFilterCategory(cat);
    }
  }, [searchParams, location]);

  if (!data) return null;

  const { weather, alert, infoCards, timelineItems, lastUpdated, dateString } = data;

  const categories = [
    { id: 'all', name: 'Tất cả thông tin' },
    { id: 'weather', name: 'Thời tiết' },
    { id: 'alert', name: 'Cảnh báo' },
    { id: 'event', name: 'Lịch hoạt động' },
    { id: 'notification', name: 'Thông báo' },
    { id: 'health', name: 'Sức khỏe' },
    { id: 'agriculture', name: 'Nông sản' },
    { id: 'transit', name: 'Lịch xe' },
  ];

  const filteredTimeline = filterCategory === 'all' 
    ? timelineItems 
    : timelineItems.filter(item => item.category === filterCategory);

  return (
    <div className="dakpxi-today-page-wrapper" style={{ background: '#fcf8f2', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #0f281e 100%)',
        color: '#ffffff',
        padding: '36px 20px',
        marginBottom: '28px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(212,159,83,0.5)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={16} /> Trang chủ
          </button>
          
          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '0 0 6px 0', color: '#ffffff' }}>
            🌄 ĐĂK PXI HÔM NAY — BẢNG THÔNG TIN TỔNG HỢP NÔNG THÔN SỐ
          </h1>
          <p style={{ fontSize: '14.5px', color: '#e2e8f0', margin: 0 }}>
            {dateString} • Cập nhật lúc {lastUpdated} • Trích xuất chính thức từ UBND xã Đăk Pxi
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>

        {/* URGENT BANNER */}
        {alert && alert.hasAlert && alert.level === 'urgent' && (
          <div className="dakpxi-urgent-alert-banner">
            <ShieldAlert size={28} />
            <div>
              <div className="urgent-banner-title">🔴 CẢNH BÁO QUAN TRỌNG TẠI ĐẠI BÀN</div>
              <div className="urgent-banner-desc">{alert.urgentNotice || alert.description}</div>
            </div>
          </div>
        )}

        {/* INFOCARDS GRID */}
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1b4332', marginBottom: '14px' }}>
          📊 TỔNG QUAN THÔNG TIN TRONG NGÀY
        </h2>

        <div className="dkt-cards-grid" style={{ marginBottom: '32px' }}>
          {infoCards.map(card => (
            <TodayInfoCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              value={card.value}
              description={card.description}
              status={card.status}
              color={card.color}
            />
          ))}
        </div>

        {/* TIMELINE SECTION WITH FILTERS */}
        <div className="today-timeline-container" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1b4332', margin: 0 }}>
                📅 DIỄN BIẾN & LỊCH TRÌNH HÔM NAY
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                Thông tin chi tiết được sắp xếp theo khung thời gian
              </p>
            </div>

            {/* FILTER CHIPS */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  style={{
                    background: filterCategory === cat.id ? '#1b4332' : '#ffffff',
                    color: filterCategory === cat.id ? '#ffffff' : '#334155',
                    border: '1.5px solid ' + (filterCategory === cat.id ? '#1b4332' : '#e2d3be'),
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="ttl-list">
            {filteredTimeline.length > 0 ? (
              filteredTimeline.map((item, idx) => (
                <div key={item.id || idx} className="ttl-item" style={{ padding: '14px 16px' }}>
                  <div className="ttl-time-col" style={{ fontSize: '14px' }}>
                    <Clock size={15} />
                    <span>{item.time}</span>
                  </div>

                  <div className="ttl-content-col">
                    <div className="ttl-item-top">
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1b4332', margin: 0 }}>
                        {item.title}
                      </h3>
                      {item.status && (
                        <span className={`ttl-status-tag tag-${item.category || 'info'}`}>
                          {item.status}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '13.5px', color: '#475569', margin: '6px 0 0 0', lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                Không có thông tin thuộc chuyên mục này trong ngày hôm nay.
              </div>
            )}
          </div>
        </div>

        {/* EMERGENCY CONTACTS FOOTER BLOCK */}
        <div style={{
          marginTop: '32px',
          background: '#ffffff',
          border: '1.5px solid #e2d3be',
          borderRadius: '18px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#8b1515', margin: 0 }}>
              📞 ĐỔI SỐ HOTLINE KHẨN CẤP XÃ ĐĂK PXI 24/7
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              UBND xã: 0260.385.1234 | Trạm Y tế xã: 0260.385.5678 | Công an xã: 0260.385.9999
            </p>
          </div>
          <button
            onClick={() => navigate('/lien-he')}
            style={{
              background: '#8b1515',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '24px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Danh bạ cán bộ xã →
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}
