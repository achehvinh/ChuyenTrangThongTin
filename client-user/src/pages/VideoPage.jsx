import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './VideoPage.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const SvgIcons = {
  Building: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
      <line x1="8" y1="6" x2="8.01" y2="6" />
      <line x1="16" y1="6" x2="16.01" y2="6" />
      <line x1="12" y1="6" x2="12.01" y2="6" />
      <line x1="8" y1="10" x2="8.01" y2="10" />
      <line x1="16" y1="16" x2="16.01" y2="16" />
      <line x1="12" y1="10" x2="12.01" y2="10" />
    </svg>
  ),
  Like: ({ liked }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "#059669" : "none"} stroke={liked ? "#059669" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  ),
  Share: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Bookmark: ({ saved }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "#2563eb" : "none"} stroke={saved ? "#2563eb" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
};

export default function VideoPage() {
  const location = useLocation();
  const [videoList, setVideoList] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);

  // Fetch danh sách video từ API backend
  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 50, page: 1 } })
      .then(r => {
        const items = r.data.data || [];
        const filtered = items.filter(bv => bv.video && bv.video.trim() !== '');
        setVideoList(filtered);
        
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="video-loading-container">
        <div className="video-loader"></div>
        <p>Đang tải Kênh Video Tuyên truyền Đăk Pxi...</p>
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
    <main className="yt-video-page">
      <div className="yt-video-layout">
        
        {/* ================= CỘT CHÍNH: PLAYER YOUTUBE + METADATA ================= */}
        <section className="yt-main-player-col">
          
          {/* Khung phát Video Cinema 16:9 */}
          <div className="yt-player-wrapper">
            <video
              key={activeVideoId}
              ref={videoRef}
              src={activeVideo?.video}
              poster={activeVideo?.anh_dai_dien || ''}
              controls
              autoPlay
              className="yt-player-element"
            />
          </div>

          {/* Tiêu đề Video */}
          <h1 className="yt-video-title">{activeVideo?.tieu_de}</h1>

          {/* Thanh Thông tin Kênh & Nút Thao tác (YouTube Channel & Action Bar) */}
          <div className="yt-channel-action-row">
            <div className="yt-channel-info-group">
              <div className="yt-channel-avatar">
                <SvgIcons.Building />
              </div>
              <div className="yt-channel-meta">
                <h3 className="channel-name">
                  Chuyên trang Văn hóa - Xã hội Xã Đăk Pxi
                  <span className="verified-badge" title="Trang thông tin chính thức đã xác minh">
                    <SvgIcons.Check />
                  </span>
                </h3>
                <span className="channel-subscribers">Ủy ban Nhân dân xã Đăk Pxi</span>
              </div>
              <button 
                type="button"
                className={`yt-subscribe-btn ${subscribed ? 'subscribed' : ''}`}
                onClick={() => setSubscribed(!subscribed)}
              >
                {subscribed ? '✓ Đã theo dõi' : 'Theo dõi kênh'}
              </button>
            </div>

            <div className="yt-action-buttons-group">
              <button 
                type="button"
                className={`yt-action-btn ${liked ? 'active' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                <SvgIcons.Like liked={liked} />
                <span>{liked ? (activeVideo?.luot_xem || 1) + 1 : (activeVideo?.luot_xem || 1)}</span>
              </button>

              <button 
                type="button"
                className="yt-action-btn"
                onClick={handleShare}
              >
                <SvgIcons.Share />
                <span>{copied ? 'Đã chép link!' : 'Chia sẻ'}</span>
              </button>

              <button 
                type="button"
                className={`yt-action-btn ${saved ? 'active' : ''}`}
                onClick={() => setSaved(!saved)}
              >
                <SvgIcons.Bookmark saved={saved} />
                <span>{saved ? 'Đã lưu' : 'Lưu'}</span>
              </button>
            </div>
          </div>

          {/* Khung Mô tả Chi tiết (YouTube Expandable Description Box) */}
          <article className="yt-description-box">
            <div className="yt-desc-header">
              <strong>👁️ {activeVideo?.luot_xem || 0} lượt xem</strong>
              <time dateTime={activeVideo?.createdAt}>
                • {activeVideo?.createdAt ? new Date(activeVideo.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
              </time>
              <span className="yt-hashtag">#DichVuCong #BHXH #DakPxi</span>
            </div>
            <p className="yt-desc-content">
              {activeVideo?.mo_ta || "Nội dung video tuyên truyền hướng dẫn thực hiện thủ tục hành chính, bảo hiểm y tế và an sinh xã hội tại địa bàn xã Đăk Pxi."}
            </p>
          </article>

        </section>

        {/* ================= CỘT PHẢI: PLAYLIST VIDEO PHÁT TIẾP (YOUTUBE SIDEBAR PLAYLIST) ================= */}
        <aside className="yt-sidebar-playlist-col">
          <header className="playlist-header">
            <h3>Danh sách video tuyên truyền</h3>
            <span className="video-count-tag">{videoList.length} bản tin</span>
          </header>

          <div className="yt-playlist-scroll">
            {videoList.map((bv, idx) => (
              <article
                key={bv._id}
                className={`yt-playlist-item ${bv._id === activeVideoId ? 'active' : ''}`}
                onClick={() => setActiveVideo(bv)}
              >
                <div className="yt-item-thumbnail">
                  {bv.anh_dai_dien ? (
                    <img src={bv.anh_dai_dien} alt={bv.tieu_de} />
                  ) : (
                    <div className="yt-empty-thumb">🎥</div>
                  )}
                  {bv._id === activeVideoId ? (
                    <span className="yt-playing-badge">
                      <SvgIcons.Play /> Đang phát
                    </span>
                  ) : (
                    <span className="yt-duration-badge">HD</span>
                  )}
                </div>

                <div className="yt-item-meta">
                  <h4 className="yt-item-title">{bv.tieu_de}</h4>
                  <span className="yt-item-channel">Chuyên trang VH-XH Đăk Pxi</span>
                  <div className="yt-item-stats">
                    <span>👁️ {bv.luot_xem || 0} lượt xem</span>
                    <span>• Bản tin {idx + 1}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>

      </div>
    </main>
  );
}
