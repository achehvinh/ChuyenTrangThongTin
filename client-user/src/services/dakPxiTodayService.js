import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

// Default mock data matching exact requirements
const DEFAULT_TODAY_DATA = {
  lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  dateString: new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }),

  weather: {
    temperature: "24°C",
    condition: "Nhiều mây, khả năng mưa 60%",
    humidity: "82%",
    wind: "Gió Đông Bắc 12 km/h",
    recommendation: "Bà con đi rẫy nên mang theo áo mưa và chú ý đường trơn trượt trên ngầm tràn.",
    link: "https://thoitiet.online/quang-ngai/xa-dak-pxi/",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fthoitiet.online%2Fquang-ngai%2Fxa-dak-pxi%2F"
  },

  alert: {
    hasAlert: false,
    level: "normal",
    title: "Không có cảnh báo khẩn cấp",
    description: "Nguy cơ sạt lở đất ở khu vực đồi núi",
    urgentNotice: null,
    hotline: "0260.385.9999 (Công an xã Đăk Pxi) | 0260.385.1234 (UBND xã)"
  },

  agriculture: {
    coffeePrice: "118.500 đ/kg",
    cassavaPrice: "3.800 đ/kg",
    rubberPrice: "340 đ/TSC",
    cornPrice: "6.200 đ/kg",
    lastUpdated: "Cập nhật mới nhất",
    note: "Giá nông sản thu mua tham khảo tại các đại lý xã Đăk Pxi & huyện Đăk Hà",
    link: "https://nhabeagri.com/gia-nong-san/",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fnhabeagri.com%2Fgia-nong-san%2F"
  },

  transit: {
    title: "Xe đi huyện & thành phố",
    schedules: "06:30 • 11:30 • 16:00",
    route1: "Tuyến 1: Đăk Pxi ➔ Trung tâm Huyện Đăk Hà (06:30, 11:30, 16:00)",
    route2: "Tuyến 2: Đăk Pxi ➔ TP Kon Tum (07:00, 13:00)",
    phone: "0260.385.1234 (Đội xe dịch vụ xã)",
    status: "Đang hoạt động thông suốt"
  },

  vaccine: {
    date: "Ngày mai (08/08)",
    location: "Trạm Y tế xã Đăk Pxi",
    time: "Sáng: 07:30 - 11:00",
    target: "Trẻ em dưới 5 tuổi & Phụ nữ mang thai",
    phone: "0260.385.5678 (Trạm Y tế xã Đăk Pxi)",
    note: "Tiêm vắc-xin 5 trong 1, Sởi, Bại liệt cho trẻ em & Uốn ván cho phụ nữ mang thai",
    link: "https://tiemchungcovid19.gov.vn",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Ftiemchungcovid19.gov.vn"
  },

  infoCards: [
    {
      id: "weather",
      icon: "CloudRain",
      category: "weather",
      title: "Thời tiết hôm nay",
      value: "24°C",
      description: "Nhiều mây, khả năng mưa 60%",
      status: "normal"
    },
    {
      id: "alert",
      icon: "AlertTriangle",
      category: "alert",
      title: "Cảnh báo",
      value: "Mưa lớn diện rộng",
      description: "Nguy cơ sạt lở đất ở khu vực đồi núi",
      status: "warning"
    },
    {
      id: "vaccine",
      icon: "ShieldCheck",
      category: "health",
      title: "Lịch tiêm chủng",
      value: "Ngày mai (08/08)",
      description: "Trạm Y tế xã Đăk Pxi",
      status: "info"
    },
    {
      id: "agriculture",
      icon: "coffee",
      category: "agriculture",
      title: "Giá nông sản",
      value: "Cà phê: 118.500 đ/kg",
      description: "Mì khô: 3.800 đ/kg",
      status: "normal"
    }
  ],

  timelineItems: [
    {
      id: "item-1",
      time: "07:30",
      icon: "CloudRain",
      title: "Dự báo thời tiết xã Đăk Pxi",
      description: "Trời nhiều mây, chiều có mưa rào 60% ở Thôn 1 & Thôn 3.",
      category: "weather",
      priority: 3,
      status: "Lưu ý"
    },
    {
      id: "item-2",
      time: "08:00",
      icon: "Heart",
      title: "Lịch tiêm chủng mở rộng tại Trạm Y tế xã",
      description: "Đưa trẻ dưới 5 tuổi đến Trạm Y tế xã Đăk Pxi tiêm vắc xin định kỳ.",
      category: "health",
      priority: 2,
      status: "Ngày mai (08/08)"
    },
    {
      id: "item-3",
      time: "09:00",
      icon: "IdCard",
      title: "Kích hoạt tài khoản VNeID Mức 2 lưu động",
      description: "Làm việc tại Nhà Rông Thôn 2 đến 17h00. Bà con mang theo CCCD.",
      category: "notification",
      priority: 2,
      status: "Quan trọng"
    },
    {
      id: "item-4",
      time: "14:00",
      icon: "Users",
      title: "Họp cử tri nhân dân Thôn Đăk Pxi",
      description: "Thường trực HĐND xã mời toàn thể cử tri tham dự đông đủ.",
      category: "event",
      priority: 3,
      status: "Sắp diễn ra"
    },
    {
      id: "item-5",
      time: "16:30",
      icon: "ShieldAlert",
      title: "Lưu ý an toàn ngầm tràn mùa mưa",
      description: "Cảnh báo ngập úng tại cầu tràn Đăk Pxi khi mưa lớn.",
      category: "alert",
      priority: 1,
      status: "Chú ý"
    }
  ]
};

export const getDakPxiToday = async () => {
  try {
    const res = await axios.get(`${API_BASE}/dak-pxi/today`);
    if (res.data && res.data.success) {
      return res.data.data;
    }
  } catch {
    // Fallback to default
  }

  try {
    const customData = localStorage.getItem('dak_pxi_today_custom_data');
    if (customData) {
      return JSON.parse(customData);
    }
  } catch (e) {
    console.error("Lỗi đọc dữ liệu Đăk Pxi Hôm nay từ storage:", e);
  }

  return DEFAULT_TODAY_DATA;
};

export const updateDakPxiTodayData = (newData) => {
  try {
    localStorage.setItem('dak_pxi_today_custom_data', JSON.stringify(newData));
    window.dispatchEvent(new Event('dak_pxi_today_updated'));
    return true;
  } catch (e) {
    console.error("Lỗi lưu dữ liệu Đăk Pxi Hôm nay:", e);
    return false;
  }
};
