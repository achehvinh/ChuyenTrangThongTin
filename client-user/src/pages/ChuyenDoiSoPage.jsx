import "./ChuyenDoiSoPage.css";

const topics = [
  {
    icon: "📱",
    title: "VNeID cho người dân",
    desc: "Hướng dẫn đăng ký và sử dụng tài khoản định danh điện tử."
  },
  {
    icon: "💳",
    title: "Thanh toán không tiền mặt",
    desc: "Khuyến khích sử dụng QR Code, Mobile Banking và ví điện tử."
  },
  {
    icon: "🌐",
    title: "Dịch vụ công trực tuyến",
    desc: "Nộp hồ sơ trực tuyến, giảm thời gian đi lại cho bà con."
  },
  {
    icon: "🏥",
    title: "Khám chữa bệnh BHYT",
    desc: "Sử dụng CCCD gắn chip và VNeID khi khám chữa bệnh."
  },
  {
    icon: "🎓",
    title: "Kỹ năng số",
    desc: "Hướng dẫn sử dụng điện thoại thông minh và Internet an toàn."
  },
  {
    icon: "🏘️",
    title: "Tổ công nghệ số cộng đồng",
    desc: "Hỗ trợ người dân tiếp cận các nền tảng số."
  }
];

export default function ChuyenDoiSoPage() {
  return (
    <div className="cds-page">

      <section className="cds-hero">
        <div className="cds-overlay">
          <h1>CHUYỂN ĐỔI SỐ XÃ ĐĂK PXI</h1>
          <p>
            Đồng hành cùng đồng bào dân tộc thiểu số
            trong hành trình tiếp cận công nghệ số.
          </p>
        </div>
      </section>

      <section className="cds-intro">
        <h2>Chuyển đổi số vì người dân</h2>

        <p>
          Chuyển đổi số giúp người dân xã Đăk Pxi tiếp cận
          nhanh hơn với các dịch vụ công, thông tin chính thống,
          giáo dục, y tế và các tiện ích số phục vụ đời sống.
        </p>

        <p>
          Đặc biệt chú trọng hỗ trợ đồng bào dân tộc thiểu số
          nâng cao kỹ năng sử dụng điện thoại thông minh,
          Internet và các nền tảng số.
        </p>
      </section>

      <section className="cds-grid">
        {topics.map((item, index) => (
          <div className="cds-card" key={index}>
            <div className="cds-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="cds-target">
        <h2>Mục tiêu đến năm 2030</h2>

        <div className="target-grid">
          <div className="target-box">
            <strong>100%</strong>
            <span>Người dân đủ điều kiện có VNeID</span>
          </div>

          <div className="target-box">
            <strong>90%</strong>
            <span>Hồ sơ được xử lý trực tuyến</span>
          </div>

          <div className="target-box">
            <strong>80%</strong>
            <span>Thanh toán không dùng tiền mặt</span>
          </div>

          <div className="target-box">
            <strong>100%</strong>
            <span>Tổ công nghệ số hoạt động hiệu quả</span>
          </div>
        </div>
      </section>

    </div>
  );
}