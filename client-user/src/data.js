  
  export const FEATURES = [
        {
      title: 'Phòng chống Thiên tai',
      image: 'https://file3.qdnd.vn/data/images/0/2024/08/24/upload_2083/2408202vthuy9.jpg?dpi=150&quality=100&w=870',
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
      image: 'https://vcdn1-sohoa.vnecdn.net/2022/03/10/dscf4772jpg-1646901308-1646901-2295-6368-1646902052.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=jtLZcHEg6N212T6gTFd01Q',
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
'/thien-tai': {
  title: '🌪️ Phòng chống Thiên tai',

  images: [
    'LINK_ANH_THIEN_TAI_1',
    'LINK_ANH_THIEN_TAI_2',
    'LINK_ANH_THIEN_TAI_3'
  ],

  content:
    'Mùa mưa bão thường xuất hiện lũ quét, sạt lở đất và giông lốc. Bà con cần theo dõi thông báo của chính quyền địa phương.',

  warning: [
    'Không đi qua suối khi nước dâng cao.',
    'Không ngủ tại khu vực có nguy cơ sạt lở.',
    'Di chuyển người già và trẻ em đến nơi an toàn.'
  ],

  emergencyPhone: '0339310915',

  videos: [
    {
      type: 'local',
      src: '/video/thien_tai.mp4',
      title: 'Kỹ năng phòng tránh lũ quét'
    }
  ]
},
'/duoi-nuoc': {
  title: '🏊 Phòng chống đuối nước',

  images: [
    'LINK_DUOI_NUOC_1',
    'LINK_DUOI_NUOC_2',
    'LINK_DUOI_NUOC_3'
  ],
  
  content:
    'Trẻ em không được tự ý tắm sông, suối, ao hồ khi không có người lớn đi cùng.',

  warning: [
    'Không tắm sông một mình.',
    'Không cứu người bằng cách nhảy xuống nước khi không biết bơi.',
    'Luôn mặc áo phao khi đi thuyền.'
  ],

  videos: [
    {
      type: 'local',
      src: '/video/duoi_nuoc1.mp4',
      title: 'Video hướng dẫn phòng chống đuối nước'
    }
  ]
  
},
'/chay-rung': {
  title: '🔥 Phòng chống cháy rừng',

  images: [
    'LINK_CHAY_RUNG_1',
    'LINK_CHAY_RUNG_2',
    'LINK_CHAY_RUNG_3'
  ],

  content:
    'Mùa khô nguy cơ cháy rừng rất cao. Bà con không đốt nương rẫy khi chưa được phép.',

  warning: [
    'Không mang lửa vào rừng.',
    'Không đốt ong.',
    'Không đốt thực bì gần khu vực rừng.'
  ],

  emergencyPhone: '0339310915'
},
'/te-nan': {
  title: '🚫 Phòng chống tệ nạn xã hội',

  images: [
    'LINK_TE_NAN_1',
    'LINK_TE_NAN_2',
    'LINK_TE_NAN_3'
  ],

  content:
    'Nói không với ma túy, cờ bạc, tín dụng đen và các hành vi vi phạm pháp luật.',

  warning: [
    'Không nghe lời dụ dỗ sử dụng ma túy.',
    'Không tham gia cờ bạc.',
    'Không vay tín dụng đen.'
  ]
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
export const CATEGORIES = [
  {
    id: "khai-sinh-tu",
    icon: "ks",
    code: "01",
    title: "Khai sinh / Khai tử",
    subtitle: "Đăng ký cho trẻ sơ sinh hoặc người mất",
    items: [
      {
        id: "ks-1",
        title: "Đăng ký khai sinh",
        tag: "Miễn phí",
        tagType: "free",
        steps: [
          { title: "Chuẩn bị giấy tờ", desc: "Giấy chứng sinh (bệnh viện cấp), CCCD của bố mẹ, sổ hộ khẩu.", tts: "Chuẩn bị giấy chứng sinh, căn cước công dân của bố mẹ và sổ hộ khẩu." },
          { title: "Đến UBND xã", desc: "Mang hồ sơ đến bộ phận Tư pháp – Hộ tịch xã Đăk Pxi.", tts: "Mang hồ sơ đến bộ phận Tư pháp hộ tịch xã Đăk Pxi." },
          { title: "Điền tờ khai", desc: "Điền Tờ khai đăng ký khai sinh theo hướng dẫn của cán bộ.", tts: "Điền tờ khai đăng ký khai sinh." },
          { title: "Nhận kết quả", desc: "Nhận giấy khai sinh trong ngày hoặc tối đa 3 ngày làm việc.", tts: "Nhận giấy khai sinh trong ngày hoặc tối đa 3 ngày làm việc." }
        ],
        forms: [{ name: "Tờ khai đăng ký khai sinh (Mẫu 01)", url: "#" }],
        faqs: [
          { q: "Lệ phí làm khai sinh là bao nhiêu?", a: "Đăng ký khai sinh đúng hạn là hoàn toàn miễn phí." },
          { q: "Có cần mang theo trẻ sơ sinh không?", a: "Không, người đi làm thủ tục chỉ cần mang giấy tờ chứng sinh và giấy tờ tùy thân của bố mẹ." }
        ]
      },
      {
        id: "ks-2",
        title: "Đăng ký khai tử",
        tag: "Miễn phí",
        tagType: "free",
        steps: [
          { title: "Chuẩn bị giấy tờ", desc: "Giấy báo tử (y tế cấp), CCCD người chết và người khai báo.", tts: "Chuẩn bị giấy báo tử, căn cước công dân của người mất và người khai báo." },
          { title: "Thời hạn", desc: "Phải khai trong vòng 15 ngày kể từ ngày mất.", tts: "Phải khai báo trong vòng 15 ngày kể từ ngày người thân mất." },
          { title: "Nhận kết quả", desc: "Giấy chứng tử được cấp ngay trong ngày làm việc.", tts: "Giấy chứng tử được cấp ngay trong ngày làm việc." }
        ],
        forms: [{ name: "Tờ khai đăng ký khai tử", url: "#" }],
        faqs: [{ q: "Ai có trách nhiệm khai tử?", a: "Người thân trong gia đình hoặc người có trách nhiệm liên quan." }]
      }
    ]
  },
  {
    id: "ho-khau",
    icon: "hk",
    code: "02",
    title: "Hộ khẩu / Cư trú",
    subtitle: "Đăng ký thường trú, tạm trú",
    items: [
      {
        id: "hk-1",
        title: "Đăng ký thường trú",
        tag: "Miễn phí",
        tagType: "free",
        steps: [
          { title: "Chuẩn bị hồ sơ", desc: "CCCD, giấy tờ chứng minh chỗ ở hợp pháp (sổ đỏ, hợp đồng thuê).", tts: "Chuẩn bị căn cước công dân và giấy tờ chứng minh chỗ ở." },
          { title: "Nộp tại UBND xã", desc: "Điền phiếu đăng ký cư trú (mẫu CT01).", tts: "Điền phiếu đăng ký cư trú mẫu CT01 tại xã." }
        ],
        forms: [{ name: "Phiếu đăng ký cư trú (Mẫu CT01)", url: "#" }],
        faqs: [{ q: "Thời gian xử lý là bao lâu?", a: "Kết quả trong vòng 7 ngày làm việc." }]
      }
    ]
  },
  {
    id: "cccd",
    icon: "cc",
    code: "03",
    title: "CCCD / Giấy tờ tùy thân",
    subtitle: "Làm mới, cấp lại CCCD",
    items: [
      {
        id: "cc-1",
        title: "Làm CCCD lần đầu",
        tag: "50.000đ",
        tagType: "paid",
        steps: [
          { title: "Đến cơ quan Công an", desc: "Mang CCCD cũ hoặc giấy tờ xác nhận cư trú.", tts: "Mang giấy tờ xác nhận cư trú đến công an xã." },
          { title: "Thu thập sinh trắc học", desc: "Chụp ảnh và lấy vân tay tại chỗ.", tts: "Chụp ảnh và lấy vân tay trực tiếp tại chỗ." }
        ],
        forms: [{ name: "Tờ khai cấp CCCD", url: "#" }],
        faqs: [{ q: "Khi nào nhận được thẻ?", a: "Từ 7 đến 15 ngày làm việc." }]
      }
    ]
  }
];