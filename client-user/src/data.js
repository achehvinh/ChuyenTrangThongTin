export const FEATURES = [
  {
    title: 'Tuyên truyền Bầu cử',
    image: '/huong-dan/anh-bau-cu-2.png',
    desc: 'Thông tin, hướng dẫn cử tri thực hiện quyền và nghĩa vụ bầu cử Đại biểu Quốc hội & HĐND các cấp.',
    path: '/bau-cu',
  },
  {
    title: 'Phòng chống Thiên tai',
    image: '/huong-dan/phongchongthien-tai.png',
    desc: 'Hướng dẫn phòng tránh và ứng phó với các loại thiên tai thường gặp.',
    path: '/thien-tai',
  },
  {
    title: 'Phòng chống đuối nước',
    image: '/huong-dan/phongchongduoinuoc.png',
    desc: 'Tuyên truyền kỹ năng phòng tránh đuối nước cho trẻ em.',
    path: '/duoi-nuoc',
  },
  {
    title: 'Phòng chống cháy rừng',
    image: '/huong-dan/phongchongchayrung.png',
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
    title: 'Hướng dẫn VNeID',
    image: 'https://image3.luatvietnam.vn/uploaded/images/original/2025/04/16/yeu-cau-100-ho-kinh-doanh-dang-ky-thanh-lap-tren-vneid_1604095754.png',
    desc: 'Cách đăng ký, kích hoạt và sử dụng tài khoản VNeID.',
    path: '/huong-dan-vneid',
  },
  {
    title: 'Tuyên truyền An toàn Giao thông',
    image: '/huong-dan/atgt-1.png',
    desc: 'Hướng dẫn và tuyên truyền pháp luật giao thông đường bộ. Vì một cộng đồng giao thông văn minh, an toàn.',
    path: '/an-toan-giao-thong',
  },
  {
    title: 'Tuyên truyền Phòng, chống Lừa đảo Không gian mạng',
    image: '/huong-dan/phong-chong-lua-dao-1.png',
    desc: 'Nâng cao nhận thức, chủ động phòng ngừa các hành vi lừa đảo qua điện thoại, mạng xã hội, ngân hàng.',
    path: '/phong-chong-lua-dao',
  },

];

export const DETAILS = {
  '/bau-cu': {
    title: '🗳️ Tuyên truyền Bầu cử',
    images: [
      'https://kinhtexaydung.petrotimes.vn/stores/news_dataimages/2021/052021/20/10/in_article/1057_bau-cu-2.jpg',
    ],
    content:
      'Bầu cử Đại biểu Quốc hội và Đại biểu Hội đồng Nhân dân các cấp là quyền và nghĩa vụ thiêng liêng của mỗi công dân. Đây là ngày hội của toàn dân nhằm lựa chọn những đại biểu có đủ đức, đủ tài đại diện cho ý chí, nguyện vọng của nhân dân xã Đăk Pxi tham gia vào cơ quan quyền lực nhà nước.',
    warning: [
      'Mỗi cử tri có quyền và nghĩa vụ tự đi bỏ phiếu, tuyệt đối không bỏ phiếu hộ, bỏ phiếu thay người khác.',
      'Bảo mật quá trình bầu cử: Cử tri vào buồng gạch phiếu độc lập, không mang thiết bị ghi hình vào buồng gạch phiếu.',
      'Kiểm tra kỹ thông tin trên Thẻ cử tri của mình trước ngày bầu cử, nếu có sai sót báo ngay cho Tổ bầu cử tại thôn để sửa đổi kịp thời.'
    ],
    steps: [
      { stt: '01', title: 'Kiểm tra thẻ & danh sách cử tri', desc: 'Xem danh sách cử tri niêm yết tại Nhà rông thôn hoặc UBND xã, nhận Thẻ cử tri từ Tổ bầu cử.' },
      { stt: '02', title: 'Nghiên cứu ứng cử viên', desc: 'Đọc kỹ tiểu sử tóm tắt và chương trình hành động của các ứng cử viên niêm yết tại khu vực bỏ phiếu.' },
      { id: 'bc-3', stt: '03', title: 'Xuất trình thẻ & Nhận phiếu bầu', desc: 'Đến đúng phòng bỏ phiếu của thôn vào ngày chủ nhật bầu cử, xuất trình thẻ cử tri để nhận phiếu bầu.' },
      { id: 'bc-4', stt: '04', title: 'Gạch phiếu & Bỏ phiếu', desc: 'Vào buồng kín gạch tên ứng cử viên không tín nhiệm, để lại ứng cử viên tín nhiệm và tự tay bỏ phiếu vào hòm phiếu.' }
    ]
  },
  '/thien-tai': {
    title: '🌪️ Phòng chống Thiên tai',

    images: [
      '/huong-dan/thien-tai-1.png',
      '/huong-dan/thien-tai-2.png',
      '/huong-dan/thien-tai-3.png',
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
    active: false,
    level: 'danger', // danger = đỏ, warning = vàng
    title: '🔥 CẢNH BÁO CHÁY RỪNG',
    content: 'Nguy cơ cháy rừng rất cao tại thôn Đăk Wâk và Kon Hơng. Bà con không đốt nương rẫy, không vào rừng.',
    thon: 'Đăk Wâk, Kon Hơng',
    time: '06/06/2026 08:00',
    autoRead: false,
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
        title: "Đăng ký khai sinh lần đầu (Trực tuyến/Trực tiếp)",
        tag: "Miễn phí",
        tagType: "free",
        steps: [
          { title: "Nộp hồ sơ trực tuyến", desc: "Truy cập dichvucong.gov.vn bằng VNeID, điền tờ khai và đính kèm bản chụp các giấy tờ (Giấy chứng sinh, Giấy kết hôn, CCCD).", tts: "Truy cập cổng dịch vụ công quốc gia bằng tài khoản định danh điện tử, điền tờ khai và tải lên bản chụp các giấy tờ cần thiết." },
          { title: "Tiếp nhận và thụ lý", desc: "Bộ phận Một cửa tiếp nhận hồ sơ trực tuyến, chuyển Công chức Tư pháp - Hộ tịch kiểm tra tính hợp lệ.", tts: "Cán bộ tiếp nhận và kiểm tra hồ sơ, nếu thiếu sẽ gửi tin nhắn yêu cầu bổ sung." },
          { title: "Xác minh và duyệt", desc: "Công chức Tư pháp đối chiếu dữ liệu quốc gia, xin cấp số định danh cá nhân cho trẻ và trình Lãnh đạo ký duyệt.", tts: "Cán bộ đối chiếu dữ liệu dân cư và trình lãnh đạo xã ký phê duyệt cấp số định danh cá nhân." },
          { title: "Ký sổ & Nhận kết quả", desc: "Mang bản chính giấy tờ (Giấy chứng sinh, Giấy kết hôn) đến UBND xã đối chiếu bản gốc, ký Sổ hộ tịch và nhận Giấy khai sinh bản chính.", tts: "Mang theo bản chính các giấy tờ đối chiếu để ký nhận giấy khai sinh tại ủy ban nhân dân xã." }
        ],
        forms: [
          {
            id: 'khai-sinh-01',
            title: 'Tờ khai đăng ký khai sinh điện tử',
            file_type: 'docx',
            file_size: 25600,
            description: 'Mẫu số 01 - Ban hành kèm Thông tư 04/2020/TT-BTP',
            src: '/forms/to-khai-dang-ky-khai-sinh.docx',
            filename: 'to-khai-dang-ky-khai-sinh.docx',
          },
        ],
        faqs: [
          { q: "Lệ phí làm khai sinh là bao nhiêu?", a: "Đăng ký khai sinh đúng hạn (trong vòng 60 ngày kể từ ngày sinh) được miễn hoàn toàn lệ phí." },
          { q: "Khi đi nhận kết quả trực tiếp cần mang theo những gì?", a: "Bạn bắt buộc phải mang theo bản chính Giấy chứng sinh của cơ sở y tế cấp và Giấy chứng nhận kết hôn của bố mẹ để đối chiếu trước khi ký Sổ đăng ký hộ tịch." }
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
