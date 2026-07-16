import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VideoPage.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

export default function VideoPage() {
  const location = useLocation();
  const [videoList, setVideoList] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // Fetch danh sách video từ API backend
  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 50, page: 1 } })
      .then(r => {
        const items = r.data.data || [];
        const filtered = items.filter(bv => bv.video && bv.video.trim() !== '');
        setVideoList(filtered);
        
        // Kiểm tra xem có videoId nào được truyền từ trang chủ không
        const stateVideoId = location.state?.activeVideoId;
        const matched = filtered.find(v => v._id === stateVideoId);
        if (matched) {
          setActiveVideo(matched);
        } else if (filtered.length > 0) {
          setActiveVideo(filtered[0]);
        }
      })
      .catch(err => console.error("Lỗi tải video tuyên truyền:", err))
      .finally(() => setLoading(false));
  }, [location.state?.activeVideoId]);

  if (loading) {
    return (
      <div className="video-loading-container">
        <div className="video-loader"></div>
        <p>Đang tải danh sách video tuyên truyền...</p>
      </div>
    );
  }

  if (videoList.length === 0) {
    return (
      <div className="video-empty-container">
        <div className="video-empty-icon">🎥</div>
        <h3>Không tìm thấy video nào</h3>
        <p>Hệ thống hiện chưa cập nhật video tuyên truyền nào cho xã Đăk Pxi. Vui lòng quay lại sau.</p>
      </div>
    );
  }

  const activeVideoId = activeVideo?._id;

  return (
    <div className="video-page-wrapper">
      <div className="video-layout-container">
        
        {/* ================= CỘT TRÁI: DANH SÁCH CHỌN VIDEO ================= */}
        <div className="video-sidebar-list">
          <div className="video-list-header">
            <h4>🎞️ Kênh Video Đăk Pxi</h4>
            <span className="video-list-sub">Chọn video tuyên truyền & hướng dẫn</span>
          </div>
          <div className="video-items-scroll">
            {videoList.map((bv, idx) => (
              <div 
                key={bv._id} 
                className={`video-list-item ${bv._id === activeVideoId ? 'active' : ''}`}
                onClick={() => {
                  setActiveVideo(bv);
                }}
              >
                <div className="video-item-thumb">
                  {bv.anh_dai_dien ? (
                    <img src={bv.anh_dai_dien} alt={bv.tieu_de} />
                  ) : (
                    <div className="empty-thumb">🎥</div>
                  )}
                  <span className="video-item-badge">Bản tin {idx + 1}</span>
                </div>
                <div className="video-item-details">
                  <h5>{bv.tieu_de}</h5>
                  <span>👁️ {bv.luot_xem || 0} lượt xem</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CỘT PHẢI: KHUNG XEM VIDEO CHUYÊN NGHIỆP ================= */}
        <div className="video-main-column">
          <div className="video-player-viewport">
            <video
              key={activeVideoId}
              ref={videoRef}
              src={activeVideo?.video}
              poster={activeVideo?.anh_dai_dien || ''}
              controls
              autoPlay
              className="video-player-element"
            />
          </div>

          {/* Chi tiết thông tin video nằm phía dưới */}
          <div className="video-details-card">
            <div className="video-meta-top">
              <span className="video-category-tag">📢 Tuyên truyền xã Đăk Pxi</span>
              <span className="video-views-badge">👁️ {activeVideo?.luot_xem || 0} lượt xem</span>
            </div>
            
            <h1 className="video-main-title">{activeVideo?.tieu_de}</h1>
            
            <div className="video-divider"></div>
            
            <div className="video-description-box">
              <h4 className="description-title">Chi tiết nội dung tuyên truyền</h4>
              <p className="description-text">
                {activeVideo?.mo_ta || "Không có mô tả chi tiết cho bản tin này. Kính mời bà con chú ý theo dõi nội dung video phát thanh phía trên."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
