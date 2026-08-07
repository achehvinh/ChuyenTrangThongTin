import {
  CheckCircle2,
  Plus,
  Save,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDakPxiToday, updateDakPxiTodayData } from '../../services/dakPxiTodayService';
import { getAllOneMinuteLessons, saveOneMinuteLessons } from '../../services/oneMinuteService';
import './DakPxiToday.css';

export default function DakPxiTodayAdminManager() {
  const [data, setData] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 1 PHÚT HÔM NAY STATE
  const [oneMinuteList, setOneMinuteList] = useState([]);
  const [omTitle, setOmTitle] = useState('');
  const [omCategory, setOmCategory] = useState('health');
  const [omPoints, setOmPoints] = useState('');
  const [omTip, setOmTip] = useState('');
  const [omImage, setOmImage] = useState('https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80');

  // Form states for new timeline item
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newCategory, setNewCategory] = useState('notification');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState('Quan trọng');
  const [newPriority, setNewPriority] = useState(2);

  useEffect(() => {
    getDakPxiToday().then(res => setData(res));
    getAllOneMinuteLessons().then(list => setOneMinuteList(list));
  }, []);

  if (!data) return <div style={{ padding: '20px' }}>Đang tải bảng quản trị...</div>;

  const handleSaveAll = (updatedData) => {
    const dataToSave = updatedData || data;
    dataToSave.lastUpdated = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const ok = updateDakPxiTodayData(dataToSave);
    if (ok) {
      setData({ ...dataToSave });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleToggleUrgentAlert = () => {
    const updated = {
      ...data,
      alert: {
        ...data.alert,
        hasAlert: !data.alert.hasAlert,
        level: !data.alert.hasAlert ? 'urgent' : 'normal'
      }
    };
    handleSaveAll(updated);
  };

  const handleUpdateUrgentText = (text) => {
    const updated = {
      ...data,
      alert: {
        ...data.alert,
        urgentNotice: text,
        description: text
      }
    };
    setData(updated);
  };

  const handleUpdateWeather = (temp, cond, rec, link) => {
    const weatherLink = link !== undefined ? link : (data.weather?.link || 'https://thoitiet.online/quang-ngai/xa-dak-pxi/#child-item-childrens');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(weatherLink)}`;

    const updated = {
      ...data,
      weather: {
        ...data.weather,
        temperature: temp,
        condition: cond,
        recommendation: rec,
        link: weatherLink,
        qrCodeUrl: qrUrl
      },
      // Keep weather card in sync
      infoCards: (data.infoCards || []).map(card => 
        card.id === 'weather' ? { ...card, value: temp, description: cond } : card
      )
    };
    setData(updated);
  };

  const handleUpdateAgriculture = (coffee, cassava, rubber, corn, link) => {
    const agriLink = link !== undefined ? link : (data.agriculture?.link || 'https://nhabeagri.com/gia-nong-san/');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(agriLink)}`;

    const updated = {
      ...data,
      agriculture: {
        ...data.agriculture,
        coffeePrice: coffee,
        cassavaPrice: cassava,
        rubberPrice: rubber,
        cornPrice: corn,
        link: agriLink,
        qrCodeUrl: qrUrl
      },
      infoCards: (data.infoCards || []).map(card => 
        card.id === 'agriculture' ? { ...card, value: `Cà phê: ${coffee}`, description: `Mì khô: ${cassava}` } : card
      )
    };
    setData(updated);
  };

  const handleUpdateTransit = (schedules, phone) => {
    const updated = {
      ...data,
      transit: {
        ...data.transit,
        schedules: schedules,
        phone: phone
      },
      infoCards: (data.infoCards || []).map(card => 
        card.id === 'bus' ? { ...card, description: schedules } : card
      )
    };
    setData(updated);
  };

  const handleUpdateVaccine = (date, location, phone, link) => {
    const vaxLink = link !== undefined ? link : (data.vaccine?.link || 'https://tiemchungcovid19.gov.vn');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(vaxLink)}`;

    const updated = {
      ...data,
      vaccine: {
        ...data.vaccine,
        date: date,
        location: location,
        phone: phone,
        link: vaxLink,
        qrCodeUrl: qrUrl
      },
      infoCards: (data.infoCards || []).map(card => 
        card.id === 'vaccine' ? { ...card, value: date, description: location } : card
      )
    };
    setData(updated);
  };

  const handleAddTimelineItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: 'item-' + Date.now(),
      time: newTime,
      icon: newCategory === 'weather' ? 'CloudRain' : newCategory === 'health' ? 'Heart' : newCategory === 'alert' ? 'ShieldAlert' : newCategory === 'event' ? 'Users' : 'IdCard',
      title: newTitle,
      description: newDesc || newTitle,
      category: newCategory,
      priority: Number(newPriority),
      status: newStatus
    };

    const updatedTimeline = [newItem, ...(data.timelineItems || [])];
    const updated = {
      ...data,
      timelineItems: updatedTimeline
    };

    setNewTitle('');
    setNewDesc('');
    handleSaveAll(updated);
  };

  const handleAddOneMinute = (e) => {
    e.preventDefault();
    if (!omTitle.trim()) return;

    const pointsArr = omPoints ? omPoints.split('\n').filter(p => p.trim()) : [
      'Tăng cường sức khỏe & trao đổi chất',
      'Giúp cơ thể luôn tỉnh táo khi làm việc',
      'Áp dụng kiến thức hữu ích vào đời sống'
    ];

    const newLesson = {
      id: 'one-minute-' + Date.now(),
      title: omTitle,
      category: omCategory,
      categoryLabel: omCategory === 'health' ? 'SỨC KHỎE' : omCategory === 'agriculture' ? 'NÔNG NGHIỆP' : omCategory === 'safety' ? 'AN TOÀN' : omCategory === 'education' ? 'GIÁO DỤC' : 'ĐỜI SỐNG',
      categoryColor: omCategory === 'health' ? '#ef4444' : omCategory === 'agriculture' ? '#15803d' : omCategory === 'safety' ? '#d97706' : omCategory === 'education' ? '#8b5cf6' : '#0284c7',
      duration: 60,
      date: new Date().toLocaleDateString('vi-VN'),
      isToday: true,
      image: omImage || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80',
      audio: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
      points: pointsArr,
      tip: omTip || 'Bà con hãy ghi nhớ và thực hiện mỗi ngày để nâng cao chất lượng cuộc sống.'
    };

    const updatedList = [newLesson, ...oneMinuteList.map(item => ({ ...item, isToday: false }))];
    saveOneMinuteLessons(updatedList);
    setOneMinuteList(updatedList);
    setOmTitle('');
    setOmPoints('');
    setOmTip('');
    alert('🎉 Đã đăng bài bài "1 PHÚT HÔM NAY" mới thành công!');
  };

  const handleDeleteOneMinute = (id) => {
    if (window.confirm('Bà con có chắc muốn xóa bài 1 phút này?')) {
      const updated = oneMinuteList.filter(item => item.id !== id);
      saveOneMinuteLessons(updated);
      setOneMinuteList(updated);
    }
  };

  const handleDeleteTimelineItem = (id) => {
    const updatedTimeline = data.timelineItems.filter(item => item.id !== id);
    const updated = { ...data, timelineItems: updatedTimeline };
    handleSaveAll(updated);
  };

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1.5px solid #e2d3be' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1b4332', margin: 0 }}>
            🌄 QUẢN TRỊ NỘI DUNG: ĐĂK PXI HÔM NAY
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            Cập nhật trực tiếp thông tin hiển thị trên Trang chủ cho người dân xã Đăk Pxi
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          style={{
            background: '#1b4332',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '24px',
            fontWeight: 800,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Save size={16} /> Lưu & Phát hành
        </button>
      </div>

      {savedSuccess && (
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 16px', borderRadius: '12px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> Đã cập nhật thành công! Thông tin mới đã xuất hiện ngay trên Trang chủ.
        </div>
      )}

      {/* 1. KHU VỰC CÀI ĐẶT CẢNH BÁO KHẨN CẤP */}
      <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', padding: '18px', borderRadius: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#b91c1c' }}>
            <ShieldAlert size={20} />
            <span>KÍCH HOẠT BANNER CẢNH BÁO KHẨN CẤP (NẾU CÓ THIÊN TAI/BÃO LŨ)</span>
          </div>
          <button
            onClick={handleToggleUrgentAlert}
            style={{
              background: data.alert?.hasAlert ? '#dc2626' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '12.5px'
            }}
          >
            {data.alert?.hasAlert ? '🔴 TẮT CẢNH BÁO KHẨN CẤP' : '🟢 BẬT CẢNH BÁO KHẨN CẤP'}
          </button>
        </div>

        {data.alert?.hasAlert && (
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#991b1b', display: 'block', marginBottom: '4px' }}>
              Nội dung thông báo cảnh báo khẩn cấp:
            </label>
            <input
              type="text"
              value={data.alert.urgentNotice || data.alert.description || ''}
              onChange={(e) => handleUpdateUrgentText(e.target.value)}
              placeholder="VD: Cảnh báo mưa lớn kéo dài gây sạt lở ngầm tràn Thôn 3, bà con không qua lại!"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #f87171',
                fontSize: '13.5px',
                outline: 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* 2. CẬP NHẬT CƠ BẢN THỜI TIẾT & LINK WEB / MÃ QR */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '18px', borderRadius: '14px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1b4332', marginTop: 0, marginBottom: '12px' }}>
          🌦️ Cập nhật Thông tin Thời tiết hôm nay & Link truy cập / Mã QR
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Nhiệt độ (°C):</label>
            <input
              type="text"
              value={data.weather?.temperature || '24°C'}
              onChange={(e) => handleUpdateWeather(e.target.value, data.weather?.condition, data.weather?.recommendation, data.weather?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Tình trạng thời tiết:</label>
            <input
              type="text"
              value={data.weather?.condition || 'Có mưa nhẹ, nhiều mây'}
              onChange={(e) => handleUpdateWeather(data.weather?.temperature, e.target.value, data.weather?.recommendation, data.weather?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
            Khuyên dùng / Khuyến cáo cho người dân:
          </label>
          <input
            type="text"
            value={data.weather?.recommendation || ''}
            onChange={(e) => handleUpdateWeather(data.weather?.temperature, data.weather?.condition, e.target.value, data.weather?.link)}
            placeholder="VD: Bà con đi rẫy nên mang theo áo mưa và chú ý đường trơn trượt trên ngầm tràn."
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '14px', alignItems: 'center', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332', display: 'block', marginBottom: '4px' }}>
              🌐 Đường dẫn (Link Web) trang thời tiết chính thức (nchmf.gov.vn...):
            </label>
            <input
              type="text"
              value={data.weather?.link || 'https://thoitiet.online/quang-ngai/xa-dak-pxi/#child-item-childrens'}
              onChange={(e) => handleUpdateWeather(data.weather?.temperature, data.weather?.condition, data.weather?.recommendation, e.target.value)}
              placeholder="VD: https://thoitiet.online/quang-ngai/xa-dak-pxi/#child-item-childrens"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              * Hệ thống sẽ tự động tạo Mã QR to rõ tương ứng cho người dân quét mã bằng điện thoại.
            </span>
          </div>

          <div style={{ textAlign: 'center', background: '#f8fafc', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(data.weather?.link || 'https://thoitiet.online/quang-ngai/xa-dak-pxi/')}`}
              alt="Mã QR thời tiết"
              style={{ width: '80px', height: '80px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1b4332', marginTop: '4px' }}>Mã QR phát hành</div>
          </div>
        </div>

      </div>

      {/* 3. CẬP NHẬT GIÁ NÔNG SẢN NÔNG THÔN SỐ */}
      <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '18px', borderRadius: '14px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#854d0e', marginTop: 0, marginBottom: '12px' }}>
          ☕ Cập nhật Giá Nông sản thu mua trên địa bàn xã Đăk Pxi
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e' }}>Cà phê nhân (đ/kg):</label>
            <input
              type="text"
              value={data.agriculture?.coffeePrice || '118.500 đ/kg'}
              onChange={(e) => handleUpdateAgriculture(e.target.value, data.agriculture?.cassavaPrice, data.agriculture?.rubberPrice, data.agriculture?.cornPrice, data.agriculture?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #fde047' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e' }}>Mì/Sắn khô (đ/kg):</label>
            <input
              type="text"
              value={data.agriculture?.cassavaPrice || '3.800 đ/kg'}
              onChange={(e) => handleUpdateAgriculture(data.agriculture?.coffeePrice, e.target.value, data.agriculture?.rubberPrice, data.agriculture?.cornPrice, data.agriculture?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #fde047' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e' }}>Cao su (đ/TSC):</label>
            <input
              type="text"
              value={data.agriculture?.rubberPrice || '340 đ/TSC'}
              onChange={(e) => handleUpdateAgriculture(data.agriculture?.coffeePrice, data.agriculture?.cassavaPrice, e.target.value, data.agriculture?.cornPrice, data.agriculture?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #fde047' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e' }}>Bắp/Ngô (đ/kg):</label>
            <input
              type="text"
              value={data.agriculture?.cornPrice || '6.200 đ/kg'}
              onChange={(e) => handleUpdateAgriculture(data.agriculture?.coffeePrice, data.agriculture?.cassavaPrice, data.agriculture?.rubberPrice, e.target.value, data.agriculture?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #fde047' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '14px', alignItems: 'center', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #fde047' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#854d0e', display: 'block', marginBottom: '4px' }}>
              🌐 Đường dẫn (Link Web) Hệ thống Theo Dõi Giá Nông Sản (nhabeagri.com/gia-nong-san...):
            </label>
            <input
              type="text"
              value={data.agriculture?.link || 'https://nhabeagri.com/gia-nong-san/'}
              onChange={(e) => handleUpdateAgriculture(data.agriculture?.coffeePrice, data.agriculture?.cassavaPrice, data.agriculture?.rubberPrice, data.agriculture?.cornPrice, e.target.value)}
              placeholder="VD: https://nhabeagri.com/gia-nong-san/"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
            <span style={{ fontSize: '11px', color: '#78350f', marginTop: '4px', display: 'block' }}>
              * Hệ thống sẽ tự động tạo Mã QR & nút mở trang trực tiếp trên giao diện dành cho bà con.
            </span>
          </div>

          <div style={{ textAlign: 'center', background: '#fefce8', padding: '8px', borderRadius: '10px', border: '1px solid #fde047' }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(data.agriculture?.link || 'https://nhabeagri.com/gia-nong-san/')}`}
              alt="Mã QR tra cứu giá nông sản"
              style={{ width: '75px', height: '75px', borderRadius: '6px', border: '1px solid #fde047' }}
            />
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#854d0e', marginTop: '4px' }}>Mã QR Giá Nông Sản</div>
          </div>
        </div>
      </div>

      {/* 4. CẬP NHẬT LỊCH XE & Y TẾ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        
        {/* LỊCH XE */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '14px' }}>
          <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#1e40af', marginTop: 0, marginBottom: '10px' }}>
            🚌 Cập nhật Lịch Xe & Khung giờ chạy
          </h3>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>Các chuyến xe trong ngày:</label>
            <input
              type="text"
              value={data.transit?.schedules || '06:30 • 11:30 • 16:00'}
              onChange={(e) => handleUpdateTransit(e.target.value, data.transit?.phone)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #93c5fd' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>SĐT Hotline Đội xe / Nhà xe:</label>
            <input
              type="text"
              value={data.transit?.phone || '0260.385.1234'}
              onChange={(e) => handleUpdateTransit(data.transit?.schedules, e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #93c5fd' }}
            />
          </div>
        </div>

        {/* LỊCH TIÊM CHỦNG */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '14px' }}>
          <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#166534', marginTop: 0, marginBottom: '10px' }}>
            🛡️ Cập nhật Lịch Tiêm Chủng & Trạm Y Tế
          </h3>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Thời gian tiêm:</label>
            <input
              type="text"
              value={data.vaccine?.date || 'Ngày mai (08/08)'}
              onChange={(e) => handleUpdateVaccine(e.target.value, data.vaccine?.location, data.vaccine?.phone, data.vaccine?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Địa điểm & SĐT Trạm Y tế:</label>
            <input
              type="text"
              value={data.vaccine?.location || 'Trạm Y tế xã Đăk Pxi'}
              onChange={(e) => handleUpdateVaccine(data.vaccine?.date, e.target.value, data.vaccine?.phone, data.vaccine?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Hotline Trạm Y tế xã:</label>
            <input
              type="text"
              value={data.vaccine?.phone || '0260.385.5678'}
              onChange={(e) => handleUpdateVaccine(data.vaccine?.date, data.vaccine?.location, e.target.value, data.vaccine?.link)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Link Web Cổng tiêm chủng:</label>
            <input
              type="text"
              value={data.vaccine?.link || 'https://tiemchungcovid19.gov.vn'}
              onChange={(e) => handleUpdateVaccine(data.vaccine?.date, data.vaccine?.location, data.vaccine?.phone, e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>
        </div>

      </div>

      {/* 3. THÊM MỚI SỰ KIỆN / THÔNG BÁO VÀO "HÔM NAY CÓ GÌ?" */}
      <div style={{ background: '#fcf8f2', border: '1.5px solid #e2d3be', padding: '18px', borderRadius: '14px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1b4332', marginTop: 0, marginBottom: '12px' }}>
          ➕ Thêm thông tin mới vào "HÔM NAY CÓ GÌ?"
        </h3>

        <form onSubmit={handleAddTimelineItem} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332' }}>Tiêu đề ngắn (Dễ hiểu cho bà con):</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="VD: 🏥 Lịch khám chữa bệnh BHYT tại Trạm Y tế xã"
              required
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c5b3' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332' }}>Khung giờ:</label>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c5b3' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332' }}>Chuyên mục:</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c5b3' }}
            >
              <option value="notification">Thông báo</option>
              <option value="health">Sức khỏe y tế</option>
              <option value="event">Lịch hoạt động</option>
              <option value="weather">Thời tiết</option>
              <option value="alert">Cảnh báo</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332' }}>Mức ưu tiên:</label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c5b3' }}
            >
              <option value={1}>🔴 Khẩn cấp (Hiển thị đầu tiên)</option>
              <option value={2}>🟠 Quan trọng</option>
              <option value={3}>🟢 Bình thường</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332' }}>Trạng thái:</label>
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="VD: Đang diễn ra"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c5b3' }}
            />
          </div>

          <div style={{ gridColumn: 'span 3' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#1b4332' }}>Mô tả chi tiết ngắn gọn:</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              placeholder="Nội dung giải thích rõ ràng, thiết thực dành cho người dân..."
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d4c5b3' }}
            />
          </div>

          <div style={{ gridColumn: 'span 3', textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                background: '#8b1515',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Thêm vào "Hôm nay có gì?"
            </button>
          </div>
        </form>
      </div>

      {/* 4. DANH SÁCH THÔNG TIN HIỆN TẠI & NÚT XÓA */}
      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1b4332', marginBottom: '12px' }}>
        📋 Danh sách 5 tin nổi bật đang hiển thị trên Trang chủ:
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.timelineItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px'
            }}
          >
            <div>
              <span style={{ fontWeight: 800, color: '#8b1515', marginRight: '8px' }}>{item.time}</span>
              <strong style={{ color: '#1e293b' }}>{item.title}</strong>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.description}</div>
            </div>

            <button
              onClick={() => handleDeleteTimelineItem(item.id)}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 700
              }}
              title="Xóa tin này"
            >
              <Trash2 size={14} /> Xóa
            </button>
          </div>
        ))}
      </div>

      {/* 5. QUẢN LÝ CHUYÊN MỤC "1 PHÚT HÔM NAY" */}
      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', padding: '20px', borderRadius: '16px', marginTop: '30px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#15803d', marginTop: 0, marginBottom: '12px' }}>
          ⏱️ ĐĂNG BÀI MỚI CHO "1 PHÚT HÔM NAY"
        </h3>
        <p style={{ fontSize: '12.5px', color: '#475569', marginTop: 0, marginBottom: '16px' }}>
          Tạo bài học 60 giây truyền thông cộng đồng về Sức khỏe, An toàn, Nông nghiệp, VNeID & Giáo dục.
        </p>

        <form onSubmit={handleAddOneMinute} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>Tiêu đề bài 1 phút (*):</label>
            <input
              type="text"
              value={omTitle}
              onChange={(e) => setOmTitle(e.target.value)}
              placeholder="VD: Uống đủ 2 lít nước mỗi ngày để giữ cơ thể khỏe mạnh khi làm rẫy..."
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>Chủ đề bài học:</label>
            <select
              value={omCategory}
              onChange={(e) => setOmCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #86efac' }}
            >
              <option value="health">❤️ SỨC KHỎE</option>
              <option value="safety">🛡️ AN TOÀN</option>
              <option value="agriculture">🌱 NÔNG NGHIỆP</option>
              <option value="life">👥 ĐỜI SỐNG & VNeID</option>
              <option value="education">📚 GIÁO DỤC</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>Link ảnh đại diện bài học:</label>
            <input
              type="text"
              value={omImage}
              onChange={(e) => setOmImage(e.target.value)}
              placeholder="URL hình ảnh..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>3-4 Ý chính bài học (Mỗi ý 1 dòng):</label>
            <textarea
              rows={3}
              value={omPoints}
              onChange={(e) => setOmPoints(e.target.value)}
              placeholder="Tăng cường trao đổi chất&#10;Giúp cơ thể tỉnh táo khi lao động&#10;Hình thành thói quen tốt mỗi ngày..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>Lời khuyên / Mẹo ngắn cho bà con:</label>
            <input
              type="text"
              value={omTip}
              onChange={(e) => setOmTip(e.target.value)}
              placeholder="Bà con hãy luôn mang theo bình nước sạch bên mình khi đi làm..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #86efac' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                background: '#15803d',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '20px',
                fontWeight: 900,
                fontSize: '13.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Xuất bản bài "1 Phút Hôm Nay"
            </button>
          </div>
        </form>

        {/* DANH SÁCH BÀI 1 PHÚT ĐÃ ĐĂNG */}
        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#15803d', marginTop: '20px', marginBottom: '10px' }}>
          📚 Các bài 1 phút đã phát hành ({oneMinuteList.length} bài):
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {oneMinuteList.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                borderRadius: '10px'
              }}
            >
              <div>
                <span style={{ background: item.categoryColor || '#15803d', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>
                  {item.categoryLabel || '1 PHÚT'}
                </span>
                <strong style={{ fontSize: '13px', color: '#1e293b' }}>{item.title}</strong>
                <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '8px' }}>({item.date})</span>
              </div>

              <button
                onClick={() => handleDeleteOneMinute(item.id)}
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
