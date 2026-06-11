  
  export const FEATURES = [
    {
      title: 'Thông báo',
      image: 'https://media.istockphoto.com/id/1401607744/vi/vec-to/loa-loa-di%E1%BB%85n-gi%E1%BA%A3-ph%C6%B0%C6%A1ng-ti%E1%BB%87n-truy%E1%BB%81n-th%C3%B4ng-x%C3%A3-h%E1%BB%99i-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-qu%E1%BA%A3ng-c%C3%A1o-v%C3%A0-qu%E1%BA%A3ng-c%C3%A1o-h%C3%ACnh-minh.jpg?s=612x612&w=0&k=20&c=cBFpTg95wgNVhHyeg9ba-sEuf-S6wVtx5U6DAqsBngo=',
      desc: 'Thông báo mới nhất từ UBND xã Đăk Pxi.',
      path: '/thong-bao',
    },
        {
      title: 'Phòng chống Thiên tai',
      image: 'https://lamdongcdc.vn/upload/1002891/fck/files/2023_07_28_08_53_1016_d0744.jpg',
      desc: 'Hướng dẫn phòng tránh và ứng phó với các loại thiên tai thường gặp.',
      path: '/thien-tai',
    },
    {
      title: 'Phòng chống đuối nước',
      image: 'https://cdc.ninhbinh.gov.vn/upload/100765/20240719/Canh-bao-duoi-nuoc-mua-he-1_c06c0.jpg',
      desc: 'Tuyên truyền kỹ năng phòng tránh đuối nước cho trẻ em.',
      path: '/duoi-nuoc',
    },
    {
      title: 'Phòng chống cháy rừng',
      image: 'https://png.pngtree.com/png-vector/20230808/ourmid/pngtree-wildfire-clipart-doodle-cartoon-image-of-forest-fire-and-trees-vector-png-image_6827485.png',
      desc: 'Hướng dẫn bảo vệ rừng và phòng chống cháy mùa khô.',
      path: '/chay-rung',
    },
    {
      title: 'Phòng chống tệ nạn xã hội',
      image: 'https://tokyo-human.edu.vn/wp-content/uploads/2025/02/noi-khong-voi-te-nan-xa-hoi.webp',
      desc: 'Nâng cao nhận thức về ma túy, cờ bạc và tệ nạn xã hội.',
      path: '/te-nan',
    },
    {
      title: 'Chuyển đổi số',
      image: 'https://cdn.thuvienphapluat.vn//uploads/Hoidapphapluat/2024/DTT/08102024/logo-chuyen-doi-so.jpg',
      desc: 'Hướng dẫn người dân sử dụng dịch vụ công trực tuyến.',
      path: '/chuyen-doi-so',
    },
    {
      title: 'Hướng dẫn VNeID',
      image: 'https://image3.luatvietnam.vn/uploaded/images/original/2025/04/16/yeu-cau-100-ho-kinh-doanh-dang-ky-thanh-lap-tren-vneid_1604095754.png',
      desc: 'Cách đăng ký, kích hoạt và sử dụng tài khoản VNeID.',
      path: '/huong-dan-vneid',
    },
    {
      title: 'Tra cứu BHXH',
      image: 'https://tpm.com.vn/wp-content/uploads/2025/10/bhxh.jpg',
      desc: 'Hướng dẫn tra cứu quá trình tham gia BHXH, BHYT.',
      path: '/huong-dan-bhxh',
    },
    {
      title: 'Tra cứu CCCD',
      image: 'https://vcdn1-sohoa.vnecdn.net/2022/03/10/dscf4772jpg-1646901308-1646901-2295-6368-1646902052.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=jtLZcHEg6N212T6gTFd01Q',
      desc: 'Hướng dẫn sử dụng CCCD gắn chip trong các dịch vụ công.',
      path: '/huong-dan-cccd',
    },
    {
      title: 'Góc pháp luật',
      image: 'https://tinhdoan.caobang.gov.vn/assets/news/2024_10/logo-cuoc-thi-tim-hieu-phap-luat.png',
      desc: 'Phổ biến kiến thức pháp luật cho người dân.',
      path: '/phap-luat',
    },
    {
      title: 'Thư viện ảnh',
      image: 'https://media.istockphoto.com/id/949118068/vi/anh/s%C3%A1ch-v%E1%BB%9F.jpg?s=612x612&w=0&k=20&c=0chhd8BWYUNQidNDqUF-JsxLwj8xKoGnC92_AcuCQkA=',
      desc: 'Hình ảnh hoạt động và sự kiện của địa phương.',
      path: '/thu-vien-anh',
    },
    {
      title: 'Liên hệ UBND xã',
      image: 'https://png.pngtree.com/png-clipart/20230913/original/pngtree-contact-clipart-cartoon-cute-customer-calling-himself-on-old-fashioned-telephone-png-image_11053101.png',
      desc: 'Thông tin liên hệ và hỗ trợ người dân.',
      path: '/lien-he',
    },
  ];
// src/data.js
export const DETAILS = {
  '/thong-bao': {
    title: 'Thông báo',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg'],
    content: 'Cập nhật các thông báo quan trọng, văn bản chỉ đạo mới nhất từ UBND xã Đăk Pxi đến toàn thể bà con nhân dân.'
  },
  '/thien-tai': {
    title: 'Phòng chống Thiên tai',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg'],
    content: 'Hướng dẫn phòng tránh và ứng phó với các loại thiên tai thường gặp.',
  },
'/duoi-nuoc': {
  title: 'Phòng chống đuối nước',
  images: ['link1.jpg', 'link2.jpg', 'link3.jpg', 'link4.jpg'],
  content: 'Hướng dẫn kỹ năng phòng tránh đuối nước, giám sát trẻ nhỏ tại khu vực sông suối, ao hồ.',
  videos: [
    { type: 'local', src: '/video/duoi_nuoc1.mp4', title: 'Video hướng dẫn phòng chống đuối nước' },
  ]
},
  '/chay-rung': {
    title: 'Phòng chống cháy rừng',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg'],
    content: 'Các quy định về bảo vệ rừng, nghiêm cấm đốt nương rẫy trái phép trong mùa khô hanh.'
  },
  '/te-nan': {
    title: 'Phòng chống tệ nạn xã hội',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg', 'link4.jpg', 'link5.jpg'],
    content: 'Tuyên truyền bài trừ ma túy, cờ bạc, và các tệ nạn xã hội để xây dựng đời sống văn hóa lành mạnh.'
  },
  '/chuyen-doi-so': {
    title: 'Chuyển đổi số',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg'],
    content: 'Hướng dẫn bà con cách sử dụng dịch vụ công trực tuyến, giúp tiết kiệm thời gian đi lại.'
  },
  '/huong-dan-vneid': {
    title: 'Hướng dẫn VNeID',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg', 'link4.jpg'],
    content: 'Các bước đăng ký, cài đặt và kích hoạt tài khoản định danh điện tử VNeID mức độ 2.'
  },
  '/huong-dan-bhxh': {
    title: 'Tra cứu BHXH',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg'],
    content: 'Hướng dẫn tra cứu quá trình đóng BHXH, BHYT thông qua ứng dụng VssID trên điện thoại.'
  },
  '/huong-dan-cccd': {
    title: 'Tra cứu CCCD',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg', 'link4.jpg'],
    content: 'Hướng dẫn sử dụng CCCD gắn chip trong các thủ tục hành chính và dịch vụ công trực tuyến.'
  },
  '/phap-luat': {
    title: 'Góc pháp luật',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg', 'link5.jpg'],
    content: 'Phổ biến kiến thức pháp luật, các quy định mới giúp bà con sống và làm việc theo pháp luật.'
  },
  '/thu-vien-anh': {
    title: 'Thư viện ảnh',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg', 'link4.jpg'],
    content: 'Tổng hợp hình ảnh các sự kiện, hoạt động văn hóa, thể thao tiêu biểu của xã Đăk Pxi.'
  },
  '/lien-he': {
    title: 'Liên hệ UBND xã',
    images: ['link1.jpg', 'link2.jpg', 'link3.jpg'],
    content: 'Thông tin đường dây nóng, địa chỉ trụ sở và các kênh tiếp nhận phản ánh của bà con.'
  }
};
export const EVENTS = [
  {
    id: 1,
    title: 'Họp dân thôn Đăk Xế Kơ Ne',
    date: '2026-06-10',
    time: '08:00',
    location: 'Nhà rông thôn Đăk Xế Kơ Ne',
    thon: 'Đăk Xế Kơ Ne',
    type: 'hop-dan', // hop-dan | tiem-chung | phat-ho-tro | tap-huan | khac
    note: 'Bà con nhớ mang theo sổ hộ khẩu',
  },
  {
    id: 2,
    title: 'Tiêm chủng cho trẻ em',
    date: '2026-06-12',
    time: '07:30',
    location: 'Trạm y tế xã',
    thon: 'Tất cả',
    type: 'tiem-chung',
    note: 'Trẻ từ 0-5 tuổi',
  },
];
export const ALERTS = [
  {
    id: 1,
    active: true,
    level: 'danger', // danger = đỏ, warning = vàng
    title: '🔥 CẢNH BÁO CHÁY RỪNG',
    content: 'Nguy cơ cháy rừng rất cao tại thôn Đăk Wâk và Kon Hơng. Bà con không đốt nương rẫy, không vào rừng.',
    thon: 'Đăk Wâk, Kon Hơng',
    time: '06/06/2026 08:00',
    autoRead: true,
  },
  {
    id: 2,
    active: false,
    level: 'warning',
    title: '⚠️ HỌP DÂN KHẨN',
    content: 'UBND xã triệu tập họp dân khẩn tại nhà rông thôn Đăk Pxi lúc 14:00 hôm nay. Toàn bộ hộ dân có mặt.',
    thon: 'Đăk Pxi',
    time: '06/06/2026 10:00',
    autoRead: false,
  },
];