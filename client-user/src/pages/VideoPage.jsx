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

  // Trạng thái phiên đăng nhập của công dân
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('citizen_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Tương tác của video (Likes, Shares, Comments) lưu vào localStorage để bền vững
  const [likesMap, setLikesMap] = useState(() => {
    const saved = localStorage.getItem('reels_likes_map');
    return saved ? JSON.parse(saved) : {};
  });

  const [likedMap, setLikedMap] = useState(() => {
    const saved = localStorage.getItem('reels_liked_map');
    return saved ? JSON.parse(saved) : {};
  });

  const [sharesMap, setSharesMap] = useState(() => {
    const saved = localStorage.getItem('reels_shares_map');
    return saved ? JSON.parse(saved) : {};
  });

  const [commentsMap, setCommentsMap] = useState(() => {
    const saved = localStorage.getItem('reels_comments_map');
    return saved ? JSON.parse(saved) : {};
  });

  // Form đăng nhập nhanh & Viết bình luận
  const [loginName, setLoginName] = useState('');
  const [loginCccd, setLoginCccd] = useState('');
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [shareFeedback, setShareFeedback] = useState(false);

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
      .catch(err => console.error("Lỗi tải video reels:", err))
      .finally(() => setLoading(false));
  }, [location.state?.activeVideoId]);

  // Đồng bộ các tương tác vào localStorage
  useEffect(() => {
    localStorage.setItem('reels_likes_map', JSON.stringify(likesMap));
  }, [likesMap]);

  useEffect(() => {
    localStorage.setItem('reels_liked_map', JSON.stringify(likedMap));
  }, [likedMap]);

  useEffect(() => {
    localStorage.setItem('reels_shares_map', JSON.stringify(sharesMap));
  }, [sharesMap]);

  useEffect(() => {
    localStorage.setItem('reels_comments_map', JSON.stringify(commentsMap));
  }, [commentsMap]);

  // Xử lý Thích (Like)
  const handleLike = (videoId) => {
    const isLiked = likedMap[videoId] || false;
    const currentLikes = likesMap[videoId] || Math.floor(Math.random() * 20) + 5; // random số ban đầu để sinh động

    setLikedMap(prev => ({ ...prev, [videoId]: !isLiked }));
    setLikesMap(prev => ({
      ...prev,
      [videoId]: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
    }));
  };

  // Xử lý Chia sẻ (Share)
  const handleShare = (video) => {
    const currentShares = sharesMap[video._id] || Math.floor(Math.random() * 8) + 2;
    setSharesMap(prev => ({ ...prev, [video._id]: currentShares + 1 }));

    // Sao chép link bài viết vào clipboard
    const shareLink = `${window.location.origin}/tin-tuc/${video._id}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    });
  };

  // Đăng ký/Đăng nhập công dân nhanh bằng CCCD
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginName.trim() || !loginCccd.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên và số CCCD.');
      return;
    }
    if (loginCccd.trim().length !== 12) {
      setErrorMsg('Mã định danh (CCCD) phải đủ 12 chữ số.');
      return;
    }

    const session = {
      fullName: loginName.trim(),
      cccd: loginCccd.trim()
    };
    setCurrentUser(session);
    localStorage.setItem('citizen_session', JSON.stringify(session));
    setLoginName('');
    setLoginCccd('');
    setErrorMsg('');
    setSuccessMsg('Đăng nhập thành công! Bây giờ bạn đã có thể gửi bình luận.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Đăng xuất công dân
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('citizen_session');
  };

  // Gửi bình luận
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentUser) return;

    const videoId = activeVideo._id;
    const existingComments = commentsMap[videoId] || getMockComments(videoId);

    const newComment = {
      id: Date.now(),
      name: currentUser.fullName,
      text: commentText.trim(),
      time: 'Vừa xong'
    };

    setCommentsMap(prev => ({
      ...prev,
      [videoId]: [newComment, ...existingComments]
    }));
    setCommentText('');
  };

  // Hàm tạo bình luận ngẫu nhiên ban đầu để giao diện sinh động
  const getMockComments = (videoId) => {
    if (commentsMap[videoId]) return commentsMap[videoId];
    return [
      { id: 1, name: 'Trưởng thôn A', text: 'Bản tin rất ý nghĩa, mong bà con trong thôn xem hết để nắm thông tin.', time: '1 giờ trước' },
      { id: 2, name: 'Y Byen', text: 'Video dễ hiểu, dễ làm theo lắm cảm ơn ủy ban xã.', time: '3 giờ trước' },
      { id: 3, name: 'A Krol', text: 'Bà con Đăk Pxi đã nhận được thông tin tuyên truyền.', time: '5 giờ trước' }
    ];
  };

  if (loading) {
    return <div className="reels-loading">Đang tải Kênh Reels Video...</div>;
  }

  if (videoList.length === 0) {
    return <div className="reels-empty">Không tìm thấy video nào trên hệ thống.</div>;
  }

  const activeVideoId = activeVideo._id;
  const isLiked = likedMap[activeVideoId] || false;
  const likesCount = likesMap[activeVideoId] || Math.floor(activeVideoId.charCodeAt(0) % 20) + 12;
  const sharesCount = sharesMap[activeVideoId] || Math.floor(activeVideoId.charCodeAt(1) % 8) + 3;
  const currentComments = commentsMap[activeVideoId] || getMockComments(activeVideoId);

  return (
    <div className="reels-page-wrapper">
      <div className="reels-layout-container">
        
        {/* ================= CỘT TRÁI: DANH SÁCH CHỌN VIDEO ================= */}
        <div className="reels-sidebar-list">
          <div className="reels-list-header">
            <h4>🎞️ Kênh Video Đăk Pxi</h4>
            <span className="reels-list-sub">Chọn video ngắn dưới 10 phút</span>
          </div>
          <div className="reels-items-scroll">
            {videoList.map((bv, idx) => (
              <div 
                key={bv._id} 
                className={`reels-list-item ${bv._id === activeVideoId ? 'active' : ''}`}
                onClick={() => {
                  setActiveVideo(bv);
                  setErrorMsg('');
                }}
              >
                <div className="reels-item-thumb">
                  {bv.anh_dai_dien ? <img src={bv.anh_dai_dien} alt="" /> : <div className="empty-thumb">🎥</div>}
                  <span className="reels-item-badge">Bản tin {idx + 1}</span>
                </div>
                <div className="reels-item-details">
                  <h5>{bv.tieu_de}</h5>
                  <span>👁️ {bv.luot_xem} lượt xem</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CỘT GIỮA: KHUNG REELS FACEBOOK ================= */}
        <div className="reels-player-column">
          <div className="reels-video-container">
            <video
              key={activeVideoId}
              ref={videoRef}
              src={activeVideo.video}
              poster={activeVideo.anh_dai_dien || ''}
              controls
              loop
              className="reels-video-element"
            />

            {/* Các lớp phủ thông tin phía dưới video */}
            <div className="reels-video-overlay-info">
              <span className="reels-tag">📢 Phát thanh Đăk Pxi</span>
              <h3 className="reels-title">{activeVideo.tieu_de}</h3>
              {activeVideo.mo_ta && <p className="reels-description">{activeVideo.mo_ta}</p>}
            </div>

            {/* Nút tác vụ nổi bên lề phải (Reels Action Sidebar) */}
            <div className="reels-action-bar">
              {/* Avatar tổ chức */}
              <div className="reels-action-avatar">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZ1BrruhiReTVU_7ul40Ev2emExnG9Moo4A&s" alt="UBND" />
                <span className="plus-badge">+</span>
              </div>

              {/* Nút Like */}
              <button 
                type="button" 
                className={`reels-action-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(activeVideoId)}
              >
                <div className="icon-circle">
                  <span className="icon-emoji">{isLiked ? '❤️' : '🤍'}</span>
                </div>
                <span className="action-count">{likesCount}</span>
              </button>

              {/* Nút Comment */}
              <button 
                type="button" 
                className="reels-action-btn"
                onClick={() => {
                  const target = document.getElementById('comments-input-focus');
                  if (target) target.focus();
                }}
              >
                <div className="icon-circle">
                  <span className="icon-emoji">💬</span>
                </div>
                <span className="action-count">{currentComments.length}</span>
              </button>

              {/* Nút Share */}
              <button 
                type="button" 
                className="reels-action-btn"
                onClick={() => handleShare(activeVideo)}
              >
                <div className="icon-circle">
                  <span className="icon-emoji">📤</span>
                </div>
                <span className="action-count">{sharesCount}</span>
              </button>
            </div>

            {/* Toast thông báo chia sẻ thành công */}
            {shareFeedback && (
              <div className="reels-share-toast">
                🔗 Đã sao chép liên kết Reels gửi bà con!
              </div>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI: BÌNH LUẬN & ĐĂNG NHẬP CÔNG DÂN ================= */}
        <div className="reels-comments-column">
          <div className="comments-header">
            <h4>Bình luận bài viết</h4>
            <span className="comments-sub">Tương tác và đóng góp ý kiến</span>
          </div>

          {/* Vùng hiển thị danh sách bình luận */}
          <div className="comments-list-area">
            {currentComments.length === 0 ? (
              <p className="no-comments">Hãy là người đầu tiên bình luận về video này.</p>
            ) : (
              currentComments.map(comment => (
                <div key={comment.id} className="comment-bubble-item">
                  <div className="comment-avatar-circle">
                    {comment.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="comment-bubble-content">
                    <div className="comment-author-meta">
                      <span className="comment-author-name">{comment.name}</span>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                    <p className="comment-text-body">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Hộp viết bình luận hoặc Đăng nhập */}
          <div className="comments-footer-input">
            {currentUser ? (
              // ĐÃ ĐĂNG NHẬP: Hiện form bình luận
              <div className="logged-in-comment-wrapper">
                <div className="user-session-info">
                  <span>Chào bà con: <strong>{currentUser.fullName}</strong></span>
                  <button type="button" className="btn-logout-link" onClick={handleLogout}>Đăng xuất</button>
                </div>
                <form className="comment-form-box" onSubmit={handleCommentSubmit}>
                  <input
                    id="comments-input-focus"
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Viết bình luận công khai..."
                    maxLength={200}
                  />
                  <button type="submit" className="comment-send-btn" disabled={!commentText.trim()}>
                    Gửi
                  </button>
                </form>
              </div>
            ) : (
              // CHƯA ĐĂNG NHẬP: Hiện form đăng nhập nhanh bằng CCCD
              <div className="quick-login-wrapper">
                <p className="login-prompt">🔒 Vui lòng nhập thông tin để tham gia bình luận:</p>
                
                {errorMsg && <div className="login-err-alert">{errorMsg}</div>}
                {successMsg && <div className="login-success-alert">{successMsg}</div>}

                <form className="quick-login-form" onSubmit={handleLoginSubmit}>
                  <div className="form-group-item">
                    <input
                      type="text"
                      value={loginName}
                      onChange={e => setLoginName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                    />
                  </div>
                  <div className="form-group-item">
                    <input
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={12}
                      value={loginCccd}
                      onChange={e => setLoginCccd(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Mã định danh (12 số CCCD)..."
                    />
                  </div>
                  <button type="submit" className="login-submit-btn">
                    Đăng nhập nhanh
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
