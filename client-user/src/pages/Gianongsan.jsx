import { useEffect, useState } from 'react';
import axios from 'axios';
import './Gianongsan.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export default function Gianongsan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ngayCapNhat, setNgayCapNhat] = useState('');

  useEffect(() => {
    axios.get(`${API}/gia-nong-san`)
      .then(res => {
        setData(res.data);
        if (res.data.length > 0) {
          const d = new Date(res.data[0].ngayCapNhat);
          setNgayCapNhat(d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        }
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  function tinhChenhLech(hienTai, truoc) {
    if (!truoc || truoc === 0) return null;
    const diff = hienTai - truoc;
    const pct = ((diff / truoc) * 100).toFixed(1);
    return { diff, pct, tang: diff >= 0 };
  }

  function formatGia(gia) {
    return gia?.toLocaleString('vi-VN') + ' đ';
  }

  return (
    <div className="gns-page">

      {/* Hero */}
      <div className="gns-hero">
        <div className="gns-hero-inner">
          <div className="gns-hero-badge">🌾 Nông sản</div>
          <h1>Bảng giá <span>Nông sản</span></h1>
          <p>Giá thu mua nông sản tại khu vực xã Đắk Pxi và vùng lân cận · Cập nhật hàng tuần</p>
          {ngayCapNhat && (
            <div className="gns-update-time">🕐 Cập nhật: {ngayCapNhat}</div>
          )}
        </div>
      </div>

      <div className="gns-content">

        {/* Lưu ý */}
        <div className="gns-notice">
          <span>⚠️</span>
          <p>Giá mang tính chất tham khảo. Bà con liên hệ trực tiếp đại lý để xác nhận giá chính xác trước khi bán.</p>
        </div>

        {/* Cards giá */}
        {loading ? (
          <div className="gns-grid">
            {[1,2,3,4].map(i => <div key={i} className="gns-skeleton" />)}
          </div>
        ) : (
          <div className="gns-grid">
            {data.map(item => {
              const cl = tinhChenhLech(item.giahientai, item.giaTuanTruoc);
              return (
                <div className="gns-card" key={item._id}>
                  <div className="gns-card-top">
                    <div className="gns-icon">{item.icon}</div>
                    <div className="gns-name">
                      <h3>{item.tenCayTrong}</h3>
                      <span>/{item.donVi}</span>
                    </div>
                    {cl && (
                      <div className={`gns-badge ${cl.tang ? 'tang' : 'giam'}`}>
                        {cl.tang ? '▲' : '▼'} {Math.abs(cl.pct)}%
                      </div>
                    )}
                  </div>

                  <div className="gns-price">{formatGia(item.giahientai)}</div>

                  {cl && (
                    <div className={`gns-diff ${cl.tang ? 'tang' : 'giam'}`}>
                      {cl.tang ? '+' : ''}{cl.diff.toLocaleString('vi-VN')} đ so với tuần trước
                    </div>
                  )}

                  <div className="gns-meta">
                    <div className="gns-meta-row">
                      <span>📍 Nơi thu mua</span>
                      <strong>{item.noiThuMua}</strong>
                    </div>
                    {item.ghiChu && (
                      <div className="gns-meta-row">
                        <span>📝 Ghi chú</span>
                        <strong>{item.ghiChu}</strong>
                      </div>
                    )}
                    {item.giaTuanTruoc > 0 && (
                      <div className="gns-meta-row">
                        <span>📊 Tuần trước</span>
                        <strong>{formatGia(item.giaTuanTruoc)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Liên hệ */}
        <div className="gns-contact">
          <div className="gns-contact-icon">📞</div>
          <div>
            <strong>Cần hỗ trợ thông tin giá?</strong>
            <p>Liên hệ cán bộ nông nghiệp xã: <a href="tel:0339310915">0339 310 915</a></p>
          </div>
        </div>

      </div>
    </div>
  );
}