import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './Gianongsan.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// ── SVG ICONS CHUẨN HTML5 ──
const SvgIcons = {
  Sprout: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12a5 5 0 0 1 5-5c0 5-5 5-5 5Z" />
      <path d="M12 12a5 5 0 0 0-5-5c0 5 5 5 5 5Z" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Refresh: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  TrendingDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  Scale: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  ChartBar: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Phone: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Building: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  ),
  Clock: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  // Icon Nông sản vector
  CropCoffee: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  ),
  CropRubber: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  CropRice: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 12 2l10 20H2z" />
      <path d="M12 6v10" />
    </svg>
  ),
  CropFruit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 5V2" />
      <path d="M12 2c2 0 4 1 4 3" />
    </svg>
  )
};

// Dữ liệu mẫu nông sản xã Đắk Pxi
const INITIAL_PRODUCTS = [
  {
    _id: '1',
    tenCayTrong: 'Cà phê Vối (Nhân xô)',
    loai: 'Cây công nghiệp',
    donVi: 'Kg',
    typeIcon: 'coffee',
    giahientai: 125000,
    giaTuanTruoc: 120000,
    noiThuMua: 'HTX Nông nghiệp Đắk Pxi / Đại lý Thu mua',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Giá đạt đỉnh mùa thu hoạch',
    history: [115000, 117000, 118000, 120000, 122000, 124000, 125000]
  },
  {
    _id: '2',
    tenCayTrong: 'Mủ cao su (Nước)',
    loai: 'Cây công nghiệp',
    donVi: 'Độ TSC/Kg',
    typeIcon: 'rubber',
    giahientai: 380,
    giaTuanTruoc: 375,
    noiThuMua: 'Nông trường Cao su Đắk Pxi',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Độ mủ trung bình 32-35%',
    history: [360, 365, 370, 372, 375, 378, 380]
  },
  {
    _id: '3',
    tenCayTrong: 'Củ Mì tươi (Sắn)',
    loai: 'Lương thực',
    donVi: 'Tấn',
    typeIcon: 'rice',
    giahientai: 2450000,
    giaTuanTruoc: 2500000,
    noiThuMua: 'Nhà máy Tinh bột sắn Kon Tum',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Hàm lượng bột 28%',
    history: [2550000, 2530000, 2520000, 2500000, 2480000, 2460000, 2450000]
  },
  {
    _id: '4',
    tenCayTrong: 'Hạt Mắc ca tươi',
    loai: 'Cây công nghiệp',
    donVi: 'Kg',
    typeIcon: 'coffee',
    giahientai: 85000,
    giaTuanTruoc: 85000,
    noiThuMua: 'Đại lý Thu mua Nông sản Xã',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Loại 1, hạt tươi vỏ xanh',
    history: [85000, 85000, 85000, 85000, 85000, 85000, 85000]
  },
  {
    _id: '5',
    tenCayTrong: 'Lúa Tẻ tươi (IR504)',
    loai: 'Lương thực',
    donVi: 'Kg',
    typeIcon: 'rice',
    giahientai: 8200,
    giaTuanTruoc: 8000,
    noiThuMua: 'Thương lái Thu mua ruộng',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Lúa gặt máy tại đồng',
    history: [7800, 7900, 7950, 8000, 8100, 8150, 8200]
  },
  {
    _id: '6',
    tenCayTrong: 'Bắp hạt khô (Ngô)',
    loai: 'Lương thực',
    donVi: 'Kg',
    typeIcon: 'rice',
    giahientai: 7500,
    giaTuanTruoc: 7600,
    noiThuMua: 'Đại lý Thức ăn gia súc',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Độ ẩm dưới 14%',
    history: [7800, 7750, 7700, 7600, 7550, 7500, 7500]
  },
  {
    _id: '7',
    tenCayTrong: 'Sầu riêng Ri6 tươi',
    loai: 'Cây ăn trái',
    donVi: 'Kg',
    typeIcon: 'fruit',
    giahientai: 78000,
    giaTuanTruoc: 72000,
    noiThuMua: 'Vựa Trái cây xuất khẩu',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Hàng cắt vườn loại A',
    history: [68000, 70000, 71000, 72000, 75000, 76000, 78000]
  },
  {
    _id: '8',
    tenCayTrong: 'Chuối Laba Đắk Pxi',
    loai: 'Cây ăn trái',
    donVi: 'Kg',
    typeIcon: 'fruit',
    giahientai: 11000,
    giaTuanTruoc: 11000,
    noiThuMua: 'HTX Nông nghiệp Đắk Pxi',
    ngayCapNhat: '24/07/2026',
    ghiChu: 'Nải đều đẹp',
    history: [11000, 11000, 11000, 11000, 11000, 11000, 11000]
  }
];

export default function Gianongsan() {
  const [data, setData] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('24/07/2026 - 14:30');
  
  // Bộ lọc thanh công cụ
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoai, setSelectedLoai] = useState('ALL');
  const [selectedDonVi, setSelectedDonVi] = useState('ALL');
  const [selectedKhoangGia, setSelectedKhoangGia] = useState('ALL');
  
  // Mặt hàng chọn xem biểu đồ
  const [chartProduct, setChartProduct] = useState(INITIAL_PRODUCTS[0]);

  // Load API backend
  const fetchData = () => {
    setLoading(true);
    axios.get(`${API}/gia-nong-san`)
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data.map((item, idx) => ({
            _id: item._id || String(idx + 1),
            tenCayTrong: item.tenCayTrong || 'Nông sản',
            loai: item.loai || 'Cây công nghiệp',
            donVi: item.donVi || 'Kg',
            typeIcon: getIconType(item.tenCayTrong),
            giahientai: item.giahientai || 0,
            giaTuanTruoc: item.giaTuanTruoc || item.giahientai || 0,
            noiThuMua: item.noiThuMua || 'Đại lý địa phương',
            ngayCapNhat: item.ngayCapNhat ? new Date(item.ngayCapNhat).toLocaleDateString('vi-VN') : '24/07/2026',
            ghiChu: item.ghiChu || '',
            history: item.history || generateMockHistory(item.giahientai || 50000)
          }));
          setData(formatted);
          setChartProduct(formatted[0]);
        }
      })
      .catch(() => {
        // Fallback retained
      })
      .finally(() => {
        setLoading(false);
        const now = new Date();
        setLastUpdated(`${now.toLocaleDateString('vi-VN')} - ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  function getIconType(name = '') {
    const n = name.toLowerCase();
    if (n.includes('cà phê') || n.includes('mắc ca')) return 'coffee';
    if (n.includes('cao su')) return 'rubber';
    if (n.includes('lúa') || n.includes('bắp') || n.includes('mì') || n.includes('sắn')) return 'rice';
    return 'fruit';
  }

  function generateMockHistory(basePrice) {
    const res = [];
    for (let i = 6; i >= 0; i--) {
      const variation = (Math.sin(i) * 0.05 + 1);
      res.push(Math.round(basePrice * variation));
    }
    return res;
  }

  // Thống kê nhanh
  const stats = useMemo(() => {
    let tang = 0;
    let giam = 0;
    let onDinh = 0;

    data.forEach(item => {
      const diff = item.giahientai - item.giaTuanTruoc;
      if (diff > 0) tang++;
      else if (diff < 0) giam++;
      else onDinh++;
    });

    return { total: data.length, tang, giam, onDinh };
  }, [data]);

  // Lọc dữ liệu theo Search & Select
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchName = item.tenCayTrong.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.noiThuMua.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchLoai = selectedLoai === 'ALL' || item.loai === selectedLoai;
      const matchDonVi = selectedDonVi === 'ALL' || item.donVi === selectedDonVi;

      let matchGia = true;
      if (selectedKhoangGia === 'UNDER_50K') matchGia = item.giahientai < 50000;
      else if (selectedKhoangGia === '50K_100K') matchGia = item.giahientai >= 50000 && item.giahientai <= 100000;
      else if (selectedKhoangGia === 'OVER_100K') matchGia = item.giahientai > 100000;

      return matchName && matchLoai && matchDonVi && matchGia;
    });
  }, [data, searchTerm, selectedLoai, selectedDonVi, selectedKhoangGia]);

  function formatGia(val) {
    if (val === undefined || val === null) return '0 đ';
    return val.toLocaleString('vi-VN') + ' đ';
  }

  function getBienDong(hienTai, truoc) {
    if (!truoc || truoc === 0 || hienTai === truoc) {
      return { label: '▬ Ổn định', type: 'stable' };
    }
    const diff = hienTai - truoc;
    const pct = ((diff / truoc) * 100).toFixed(1);
    if (diff > 0) {
      return { label: `▲ Tăng ${pct}%`, type: 'up' };
    } else {
      return { label: `▼ Giảm ${Math.abs(pct)}%`, type: 'down' };
    }
  }

  function renderCropSvgIcon(type) {
    switch(type) {
      case 'coffee': return <SvgIcons.CropCoffee />;
      case 'rubber': return <SvgIcons.CropRubber />;
      case 'rice': return <SvgIcons.CropRice />;
      default: return <SvgIcons.CropFruit />;
    }
  }

  const chartDays = ['T7', 'CN', 'T2', 'T3', 'T4', 'T5', 'Hôm nay'];

  return (
    <div className="gov-gns-page">
      <div className="gov-gns-container">

        {/* ════════════════════════════════════════════════
           1. HEADER CHUẨN CỔNG THÔNG TIN HÀNH CHÍNH
           ════════════════════════════════════════════════ */}
        <header className="gov-gns-header">
          <div className="gov-header-left">
            <div className="gov-header-title-row">
              <span className="gov-header-icon"><SvgIcons.Sprout /></span>
              <h1 className="gov-header-title">BẢNG GIÁ NÔNG SẢN</h1>
            </div>
            <p className="gov-header-sub">
              Cập nhật giá tham khảo các mặt hàng nông sản trên địa bàn xã và khu vực lân cận.
            </p>
          </div>

          <div className="gov-header-right">
            <div className="gov-meta-box">
              <div className="gov-meta-row">
                <span className="gov-meta-label"><SvgIcons.Calendar /> Ngày cập nhật:</span>
                <span className="gov-meta-val">24/07/2026</span>
              </div>
              <div className="gov-meta-row">
                <span className="gov-meta-label"><SvgIcons.Clock /> Lần cập nhật cuối:</span>
                <span className="gov-meta-val">{lastUpdated}</span>
              </div>
              <div className="gov-meta-row">
                <span className="gov-meta-label">Trạng thái:</span>
                <span className="gov-status-online">
                  <span className="gov-status-dot"></span> Đã cập nhật
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════
           2. THANH CÔNG CỤ TÌM KIẾM VÀ BỘ LỌC DỮ LIỆU
           ════════════════════════════════════════════════ */}
        <section className="gov-toolbar-section">
          <div className="gov-search-group">
            <label htmlFor="search-input" className="gov-label-icon">
              <SvgIcons.Search />
            </label>
            <input
              id="search-input"
              type="text"
              className="gov-input"
              placeholder="Nhập tên nông sản hoặc nơi thu mua..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="gov-filter-group">
            <div className="gov-filter-item">
              <label className="gov-label">Loại nông sản:</label>
              <select
                className="gov-select"
                value={selectedLoai}
                onChange={(e) => setSelectedLoai(e.target.value)}
              >
                <option value="ALL">-- Tất cả loại --</option>
                <option value="Cây công nghiệp">Cây công nghiệp</option>
                <option value="Lương thực">Lương thực</option>
                <option value="Cây ăn trái">Cây ăn trái</option>
                <option value="Rau củ quả">Rau củ quả</option>
              </select>
            </div>

            <div className="gov-filter-item">
              <label className="gov-label">Đơn vị tính:</label>
              <select
                className="gov-select"
                value={selectedDonVi}
                onChange={(e) => setSelectedDonVi(e.target.value)}
              >
                <option value="ALL">-- Tất cả đơn vị --</option>
                <option value="Kg">Kg</option>
                <option value="Tấn">Tấn</option>
                <option value="Độ TSC/Kg">Độ TSC/Kg</option>
              </select>
            </div>

            <div className="gov-filter-item">
              <label className="gov-label">Khoảng giá:</label>
              <select
                className="gov-select"
                value={selectedKhoangGia}
                onChange={(e) => setSelectedKhoangGia(e.target.value)}
              >
                <option value="ALL">-- Tất cả khoảng giá --</option>
                <option value="UNDER_50K">Dưới 50.000đ</option>
                <option value="50K_100K">50.000đ - 100.000đ</option>
                <option value="OVER_100K">Trên 100.000đ</option>
              </select>
            </div>

            <button
              className="gov-refresh-btn"
              onClick={fetchData}
              title="Làm mới dữ liệu"
            >
              <SvgIcons.Refresh />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
           3. THỐNG KÊ NHANH 4 THẺ NHỎ CHUẨN HÀNH CHÍNH
           ════════════════════════════════════════════════ */}
        <section className="gov-stats-grid">
          <div className="gov-stat-card card-total">
            <div className="stat-info">
              <span className="stat-label">TỔNG MẶT HÀNG</span>
              <strong className="stat-value">{stats.total}</strong>
            </div>
            <div className="stat-icon icon-blue"><SvgIcons.Package /></div>
          </div>

          <div className="gov-stat-card card-up">
            <div className="stat-info">
              <span className="stat-label">GIÁ TĂNG</span>
              <strong className="stat-value text-up">▲ {stats.tang}</strong>
            </div>
            <div className="stat-icon icon-green"><SvgIcons.TrendingUp /></div>
          </div>

          <div className="gov-stat-card card-down">
            <div className="stat-info">
              <span className="stat-label">GIÁ GIẢM</span>
              <strong className="stat-value text-down">▼ {stats.giam}</strong>
            </div>
            <div className="stat-icon icon-red"><SvgIcons.TrendingDown /></div>
          </div>

          <div className="gov-stat-card card-stable">
            <div className="stat-info">
              <span className="stat-label">GIÁ ỔN ĐỊNH</span>
              <strong className="stat-value text-stable">▬ {stats.onDinh}</strong>
            </div>
            <div className="stat-icon icon-slate"><SvgIcons.Scale /></div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
           4. BẢNG GIÁ DẠNG DATA TABLE RÕ RÀNG
           ════════════════════════════════════════════════ */}
        <section className="gov-table-wrapper">
          <div className="table-caption">
            <div className="caption-title-group">
              <SvgIcons.FileText />
              <span>BẢNG NÔNG SẢN THAM KHẢO GIÁ THU MUA HÔM NAY</span>
            </div>
            <span className="table-count">Hiển thị {filteredData.length} / {data.length} mặt hàng</span>
          </div>

          <div className="table-responsive">
            <table className="gov-data-table">
              <thead>
                <tr>
                  <th className="col-stt">STT</th>
                  <th>Tên nông sản</th>
                  <th className="text-center">Biểu tượng</th>
                  <th className="text-center">Đơn vị</th>
                  <th className="text-right">Giá hôm nay</th>
                  <th className="text-right">Giá tuần trước</th>
                  <th className="text-center">Biến động</th>
                  <th>Ngày cập nhật</th>
                  <th>Nguồn thu mua</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-slate-500">
                      Đang tải dữ liệu từ Cổng thông tin...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-slate-500">
                      Không tìm thấy nông sản phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => {
                    const bd = getBienDong(item.giahientai, item.giaTuanTruoc);
                    const isSelectedChart = chartProduct && chartProduct._id === item._id;

                    return (
                      <tr
                        key={item._id}
                        className={isSelectedChart ? 'row-active' : ''}
                        onClick={() => setChartProduct(item)}
                      >
                        <td className="col-stt">{index + 1}</td>
                        <td className="font-semibold text-slate-900">
                          <div className="item-name-box">
                            <span>{item.tenCayTrong}</span>
                            <span className="item-tag">{item.loai}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="item-svg-avatar">
                            {renderCropSvgIcon(item.typeIcon)}
                          </span>
                        </td>
                        <td className="text-center font-medium">{item.donVi}</td>
                        <td className="text-right font-bold text-blue-900 price-highlight">
                          {formatGia(item.giahientai)}
                        </td>
                        <td className="text-right text-slate-600">
                          {formatGia(item.giaTuanTruoc)}
                        </td>
                        <td className="text-center">
                          <span className={`bd-badge bd-${bd.type}`}>
                            {bd.label}
                          </span>
                        </td>
                        <td className="text-slate-600 text-sm">
                          {item.ngayCapNhat}
                        </td>
                        <td className="text-slate-700 text-sm">
                          {item.noiThuMua}
                        </td>
                        <td className="text-center">
                          <button
                            className={`btn-action-chart ${isSelectedChart ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setChartProduct(item);
                            }}
                          >
                            <SvgIcons.ChartBar />
                            <span>{isSelectedChart ? 'Đang xem' : 'Xem biểu đồ'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
           5. BIỂU ĐỒ BIẾN ĐỘNG GIÁ NÔNG SẢN 7 NGÀY GẦN NHẤT
           ════════════════════════════════════════════════ */}
        {chartProduct && (
          <section className="gov-chart-section">
            <div className="chart-header">
              <div className="chart-title">
                <SvgIcons.ChartBar />
                <span>BIỂU ĐỒ LỊCH SỬ GIÁ 7 NGÀY GẦN NHẤT — <strong>{chartProduct.tenCayTrong}</strong> ({chartProduct.donVi})</span>
              </div>

              {/* Dropdown chọn mặt hàng */}
              <div className="chart-select-group">
                <label className="gov-label">Chọn mặt hàng:</label>
                <select
                  className="gov-select-sm"
                  value={chartProduct._id}
                  onChange={(e) => {
                    const p = data.find(x => x._id === e.target.value);
                    if (p) setChartProduct(p);
                  }}
                >
                  {data.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.tenCayTrong} ({p.donVi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="chart-body">
              <div className="chart-summary-strip">
                <div>
                  <span className="summary-label">Giá hiện tại:</span>
                  <strong className="summary-val text-blue">{formatGia(chartProduct.giahientai)}</strong>
                </div>
                <div>
                  <span className="summary-label">Giá tuần trước:</span>
                  <strong className="summary-val">{formatGia(chartProduct.giaTuanTruoc)}</strong>
                </div>
                <div>
                  <span className="summary-label">Nơi thu mua:</span>
                  <strong className="summary-val">{chartProduct.noiThuMua}</strong>
                </div>
              </div>

              <div className="svg-chart-container">
                <SvgLineChart history={chartProduct.history || [100, 102, 104, 105, 107, 108, 110]} days={chartDays} />
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════════
           6. KHUNG THÔNG BÁO CẢNH BÁO MÀU VÀNG
           ════════════════════════════════════════════════ */}
        <section className="gov-warning-box">
          <span className="warning-icon"><SvgIcons.AlertTriangle /></span>
          <div className="warning-content">
            <strong>LƯU Ý DÀNH CHO BÀ CON NÔNG DÂN:</strong>
            <p>
              Giá mang tính chất tham khảo, bà con vui lòng liên hệ thương lái hoặc hợp tác xã để xác nhận giá chính xác trước khi giao dịch bán nông sản.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
           7 & 8. THÔNG TIN HỖ TRỢ & NGUỒN DỮ LIỆU
           ════════════════════════════════════════════════ */}
        <div className="gov-bottom-grid">
          
          {/* SECTION 7: THÔNG TIN HỖ TRỢ CÁN BỘ NÔNG NGHIỆP */}
          <section className="gov-card-info">
            <div className="card-info-header">
              <SvgIcons.Phone />
              <span>THÔNG TIN HỖ TRỢ & TƯ VẤN GIÁ NÔNG SẢN</span>
            </div>
            <div className="card-info-body">
              <div className="info-row">
                <span className="info-label"><SvgIcons.User /> Cán bộ phụ trách:</span>
                <span className="info-val font-semibold">Nguyễn Văn A (Cán bộ Nông nghiệp Xã)</span>
              </div>
              <div className="info-row">
                <span className="info-label"><SvgIcons.Phone /> Số điện thoại:</span>
                <span className="info-val highlight-phone">0339 310 915</span>
              </div>
              <div className="info-row">
                <span className="info-label"><SvgIcons.Mail /> Email:</span>
                <span className="info-val">nongnghiep.dakpxi@konfum.gov.vn</span>
              </div>
              <div className="info-row">
                <span className="info-label"><SvgIcons.Building /> Địa chỉ:</span>
                <span className="info-val">Bộ phận Một cửa — UBND xã Đắk Pxi</span>
              </div>
              <div className="info-row">
                <span className="info-label"><SvgIcons.Clock /> Giờ làm việc:</span>
                <span className="info-val">07:30 - 17:00 (Thứ 2 - Thứ 6)</span>
              </div>

              <a href="tel:0339310915" className="gov-call-now-btn">
                <SvgIcons.Phone />
                <span>GỌI NGAY CHO CÁN BỘ NÔNG NGHIỆP</span>
              </a>
            </div>
          </section>

          {/* SECTION 8: NGUỒN DỮ LIỆU THU THẬP */}
          <section className="gov-card-info">
            <div className="card-info-header">
              <SvgIcons.FileText />
              <span>NGUỒN CẬP NHẬT DỮ LIỆU GIÁ</span>
            </div>
            <div className="card-info-body">
              <p className="source-intro">
                Dữ liệu bảng giá nông sản được Phòng Nông nghiệp & Phát triển Nông thôn tổng hợp chính thức từ:
              </p>
              <ul className="source-list">
                <li>• <strong>Hợp tác xã Nông nghiệp xã Đắk Pxi</strong></li>
                <li>• <strong>Thương lái & Đại lý thu mua chính tại địa phương</strong></li>
                <li>• <strong>Phòng Nông nghiệp & Phát triển Nông thôn huyện</strong></li>
                <li>• <strong>Cán bộ nông nghiệp xã khảo sát thực tế trực tiếp</strong></li>
              </ul>
              <div className="source-badge">
                <SvgIcons.CheckCircle />
                <span>Dữ liệu được xác thực trước khi công bố lên Cổng thông tin</span>
              </div>
            </div>
          </section>

        </div>

        {/* ════════════════════════════════════════════════
           9. FOOTER DỮ LIỆU CHUẨN CƠ QUAN NHÀ NƯỚC
           ════════════════════════════════════════════════ */}
        <footer className="gov-gns-footer">
          <div className="footer-col">
            <span>Ngày cập nhật cuối: <strong>24/07/2026 - 14:30</strong></span>
          </div>
          <div className="footer-col">
            <span>Tổng số mặt hàng: <strong>{data.length} mặt hàng</strong></span>
          </div>
          <div className="footer-col">
            <span>Người cập nhật: <strong>Cán bộ Nông nghiệp xã Đắk Pxi</strong></span>
          </div>
          <div className="footer-col">
            <span>Phiên bản dữ liệu: <strong>v2.4 (Hệ thống Quản lý Hành chính)</strong></span>
          </div>
        </footer>

      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// COMPONENT SVG LINE CHART PURE REACTJS
// ════════════════════════════════════════════════════════
function SvgLineChart({ history, days }) {
  if (!history || history.length === 0) return null;

  const width = 760;
  const height = 180;
  const padding = 40;

  const minVal = Math.min(...history) * 0.95;
  const maxVal = Math.max(...history) * 1.05;
  const range = maxVal - minVal || 1;

  const points = history.map((val, idx) => {
    const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minVal) / range) * (height - 2 * padding);
    return { x, y, val, day: days[idx] || `Ngày ${idx + 1}` };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart-element">
      {[0.2, 0.5, 0.8].map((ratio, i) => {
        const yLine = padding + ratio * (height - 2 * padding);
        return (
          <line
            key={i}
            x1={padding}
            y1={yLine}
            x2={width - padding}
            y2={yLine}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
        );
      })}

      <polyline
        fill="none"
        stroke="#005bac"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylinePoints}
      />

      {points.map((p, idx) => (
        <g key={idx}>
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="#ffffff"
            stroke="#005bac"
            strokeWidth="2.5"
          />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            fill="#1e3a8a"
          >
            {p.val >= 1000 ? p.val.toLocaleString('vi-VN') : p.val}
          </text>
          <text
            x={p.x}
            y={height - 12}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="#64748b"
          >
            {p.day}
          </text>
        </g>
      ))}
    </svg>
  );
}