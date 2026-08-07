import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

// Sample High-Quality Audio Sample (Clear Voice / Gentle Tone)
const SAMPLE_AUDIO_URL = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg'; // Reliable fallback audio URL

export const INITIAL_LESSONS = [
  {
    id: "one-minute-2026-08-07",
    title: "Uống đủ nước - Cơ thể khỏe mạnh mỗi ngày",
    category: "health",
    categoryLabel: "SỨC KHỎE",
    categoryColor: "#ef4444",
    duration: 60,
    date: "07/08/2026",
    isToday: true,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80",
    audio: SAMPLE_AUDIO_URL,
    points: [
      "Tăng cường trao đổi chất & đào thải độc tố",
      "Giúp cơ thể tỉnh táo, giảm mệt mỏi khi làm rẫy",
      "Hỗ trợ tim mạch & cải thiện làn da khỏe mạnh",
      "Hình thành thói quen uống 1.5 - 2 lít nước sạch mỗi ngày"
    ],
    tip: "Bà con hãy luôn mang theo bình nước sạch bên mình khi đi làm nông hoặc đi xa.",
    contentDetails: "Nước chiếm hơn 60% trọng lượng cơ thể người. Khi làm việc ngoài trời nắng nóng hoặc lao động nặng, cơ thể mất nhiều mỡ mồ hôi. Việc bổ sung nước thường xuyên giúp giữ thân nhiệt ổn định, tránh kiệt sức và bàng quang luôn khỏe mạnh."
  },
  {
    id: "one-minute-2026-08-06",
    title: "Kỹ thuật bón phân đúng cách cho cây cà phê mùa mưa",
    category: "agriculture",
    categoryLabel: "NÔNG NGHIỆP",
    categoryColor: "#15803d",
    duration: 60,
    date: "06/08/2026",
    isToday: false,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    audio: SAMPLE_AUDIO_URL,
    points: [
      "Chia nhỏ lượng phân bón làm 3-4 lần trong mùa mưa",
      "Bón quanh mép tán lá, tránh bón sát gốc cà phê",
      "Phối hợp phân hữu cơ vi sinh để cải tạo đất nghèo dinh dưỡng",
      "Không bón phân ngay trước khi có mưa lớn diện rộng"
    ],
    tip: "Bón phân đúng thời điểm giúp rễ cây cà phê hấp thụ tối đa và tiết kiệm chi phí cho bà con.",
    contentDetails: "Trong mùa mưa ở Đăk Pxi, mưa lớn dễ làm trôi phân bón. Bà con nên dọn sạch cỏ quanh tán, bón theo mép tán lá rồi lấp nhẹ một lớp đất mỏng để giữ dinh dưỡng cho cây."
  },
  {
    id: "one-minute-2026-08-05",
    title: "Tuyệt đối không tắm ở sông, suối khi có dấu hiệu mưa lớn",
    category: "safety",
    categoryLabel: "AN TOÀN",
    categoryColor: "#f59e0b",
    duration: 60,
    date: "05/08/2026",
    isToday: false,
    image: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=80",
    audio: SAMPLE_AUDIO_URL,
    points: [
      "Nước sông suối đổi màu đục đỏ là dấu hiệu lũ quét sắp tràn về",
      "Nhắc nhở trẻ em không chơi đùa gần bờ sông suối mùa mưa lũ",
      "Mặc áo phao hoặc dùng vật phao sinh mạng khi qua sông bằng thuyền",
      "Báo ngay cho Công an xã hoặc Trạm Y tế khi phát hiện sự cố"
    ],
    tip: "An toàn tính mạng là trên hết, tuyệt đối không lội qua ngầm tràn khi nước dâng cao.",
    contentDetails: "Mùa mưa lũ tại xã Đăk Pxi có đặc điểm nước dâng rất nhanh trên dòng sông Pxi. Người dân và con em cần nâng cao cảnh giác, không được chủ quan khi thấy mưa phía đầu nguồn."
  },
  {
    id: "one-minute-2026-08-04",
    title: "Nhận biết thủ đoạn lừa đảo giả danh Cán bộ Công an, VNeID",
    category: "safety",
    categoryLabel: "AN TOÀN",
    categoryColor: "#ea580c",
    duration: 60,
    date: "04/08/2026",
    isToday: false,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    audio: SAMPLE_AUDIO_URL,
    points: [
      "Công an KHÔNG làm việc qua điện thoại hay yêu cầu chuyển tiền",
      "Không nhấp vào đường link lạ được gửi qua Zalo, SMS",
      "Không cài đặt phần mềm lạ từ các trang web ngoài CH Play/App Store",
      "Đến trực tiếp Công an xã Đăk Pxi để hỗ trợ kích hoạt VNeID"
    ],
    tip: "Cảnh giác cao độ: Cán bộ xã và Công an luôn hỗ trợ trực tiếp tại Nhà Rông hoặc Trụ sở.",
    contentDetails: "Đối tượng lừa đảo thường gọi điện xưng danh Công an yêu cầu nâng cấp VNeID mức 2 hoặc cập nhật CCCD. Bà con hãy dứt khoát tắt máy và báo ngay cho công an địa phương."
  },
  {
    id: "one-minute-2026-08-03",
    title: "Ăn nhiều rau xanh và thực phẩm giàu chất xơ cho gia đình",
    category: "health",
    categoryLabel: "SỨC KHỎE",
    categoryColor: "#ef4444",
    duration: 60,
    date: "03/08/2026",
    isToday: false,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    audio: SAMPLE_AUDIO_URL,
    points: [
      "Bổ sung rau rừng, rau vườn trồng tự nhiên trong bữa ăn",
      "Giúp hệ tiêu hóa khỏe mạnh & ngăn ngừa bệnh mãn tính",
      "Rửa sạch rau với nước muối loãng trước khi chế biến",
      "Khuyên con trẻ tập thói quen ăn rau mỗi ngày"
    ],
    tip: "Nguồn rau tươi trồng tại vườn nhà là thực phẩm an toàn tuyệt vời cho gia đình.",
    contentDetails: "Rau xanh cung cấp nhiều vitamin A, C, chất xơ và vi chất thiết yếu giúp tăng cường hệ miễn dịch cho cả trẻ nhỏ và người cao tuổi."
  },
  {
    id: "one-minute-2026-08-02",
    title: "Tạo thói quen cùng con đọc sách 15 phút mỗi buổi tối",
    category: "education",
    categoryLabel: "GIÁO DỤC",
    categoryColor: "#8b5cf6",
    duration: 60,
    date: "02/08/2026",
    isToday: false,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    audio: SAMPLE_AUDIO_URL,
    points: [
      "Mở rộng vốn từ vựng & khả năng tư duy cho con em",
      "Gắn kết tình cảm gia đình sau ngày làm việc vất vả",
      "Giảm bớt thời gian trẻ em xem điện thoại, tivi",
      "Mượn sách miễn phí tại Tủ sách Cộng đồng xã Đăk Pxi"
    ],
    tip: "Mỗi cuốn sách mở ra một cửa sổ tri thức mới cho tương lai con em chúng ta.",
    contentDetails: "Đọc sách cùng con giúp trẻ phát triển trí não vượt trội, rèn luyện sự tập trung và tiếp thu kiến thức tốt hơn khi đi học trên lớp."
  }
];

export const TOPICS = [
  { id: 'all', name: 'TẤT CẢ CHỦ ĐỀ', icon: 'Sparkle', color: '#1b4332', bg: '#e8f5e9' },
  { id: 'health', name: 'SỨC KHỎE', icon: 'Heart', color: '#dc2626', bg: '#fef2f2', desc: 'Chăm sóc sức khỏe gia đình & dinh dưỡng' },
  { id: 'safety', name: 'AN TOÀN', icon: 'ShieldCheck', color: '#d97706', bg: '#fffbeb', desc: 'Phòng tránh đuối nước, thiên tai & lừa đảo' },
  { id: 'agriculture', name: 'NÔNG NGHIỆP', icon: 'Plant', color: '#15803d', bg: '#f0fdf4', desc: 'Kỹ thuật trồng cà phê, mì, cao su & chăn nuôi' },
  { id: 'life', name: 'ĐỜI SỐNG', icon: 'UsersThree', color: '#0284c7', bg: '#f0f9ff', desc: 'Mẹo gia đình, VNeID & Chuyển đổi số' },
  { id: 'education', name: 'GIÁO DỤC', icon: 'BookOpen', color: '#7c3aed', bg: '#f5f3ff', desc: 'Học tập, kỹ năng & tương lai con trẻ' }
];

export const getOneMinuteToday = async () => {
  try {
    const res = await axios.get(`${API_BASE}/one-minute/today`);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
  } catch {
    // API Fallback
  }

  try {
    const stored = localStorage.getItem('dakpxi_one_minute_lessons');
    if (stored) {
      const parsed = JSON.parse(stored);
      const today = parsed.find(item => item.isToday) || parsed[0];
      if (today) return today;
    }
  } catch (e) {
    console.error("Lỗi đọc dữ liệu 1 phút từ storage:", e);
  }

  return INITIAL_LESSONS[0];
};

export const getAllOneMinuteLessons = async () => {
  try {
    const res = await axios.get(`${API_BASE}/one-minute`);
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch {
    // API Fallback
  }

  try {
    const stored = localStorage.getItem('dakpxi_one_minute_lessons');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Lỗi đọc danh sách 1 phút từ storage:", e);
  }

  return INITIAL_LESSONS;
};

export const saveOneMinuteLessons = (lessons) => {
  try {
    localStorage.setItem('dakpxi_one_minute_lessons', JSON.stringify(lessons));
    window.dispatchEvent(new Event('one_minute_updated'));
    return true;
  } catch (e) {
    console.error("Lỗi lưu bài học 1 phút:", e);
    return false;
  }
};

export const submitSuggestion = async (suggestionText, authorName, authorPhone) => {
  try {
    await axios.post(`${API_BASE}/one-minute/suggestion`, {
      content: suggestionText,
      author: authorName,
      phone: authorPhone,
      createdAt: new Date().toISOString()
    });
  } catch {
    // Local storage fallback
  }

  try {
    const existing = JSON.parse(localStorage.getItem('dakpxi_one_minute_suggestions') || '[]');
    existing.unshift({
      id: 'sugg-' + Date.now(),
      content: suggestionText,
      author: authorName || 'Người dân xã Đăk Pxi',
      phone: authorPhone || '',
      date: new Date().toLocaleDateString('vi-VN')
    });
    localStorage.setItem('dakpxi_one_minute_suggestions', JSON.stringify(existing));
    return true;
  } catch (e) {
    console.error("Lỗi gửi gợi ý:", e);
    return false;
  }
};
