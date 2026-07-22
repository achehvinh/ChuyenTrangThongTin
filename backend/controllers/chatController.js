const Knowledge = require("../models/Knowledge");

// ── CƠ SỞ TRI THỨC CHUẨN NGHIỆP VỤ (EXPERT AUTHORITATIVE KNOWLEDGE BASE) ──
// Đảm bảo tất cả câu hỏi gợi ý và thắc mắc phổ biến trả lời CHÍNH XÁC 100%, KHÔNG SUY DIỄN
const EXPERT_KNOWLEDGE = [
  {
    keywords: ['giả danh công an', 'công an lừa đảo', 'nhận biết giả danh', 'cuộc gọi công an'],
    reply: `🛡️ **HƯỚNG DẪN NHẬN BIẾT CUỘC GỌI GIẢ DANH CÔNG AN, VIỆN KIỂM SÁT, TÒA ÁN:**\n\n` +
           `1. **Quy định pháp luật:** Cơ quan Công an, Viện kiểm sát, Tòa án TUYỆT ĐỐI KHÔNG làm việc qua điện thoại hay gửi lệnh bắt qua Zalo, Facebook.\n` +
           `2. **Không làm theo:** Không bao giờ yêu cầu chuyển tiền vào "tài khoản an toàn" hay "tài khoản tạm giữ" để điều tra.\n` +
           `3. **Cách xử lý:** Khi nhận cuộc gọi đe dọa, bà con hãy tắt máy ngay lập tức, không cung cấp thông tin cá nhân và báo cho Công an xã qua **Hotline 0339310915**.`
  },
  {
    keywords: ['lỡ chuyển tiền', 'chuyển tiền lừa đảo', 'lấy lại tiền lừa đảo', 'chuyển nhầm tiền'],
    reply: `💸 **HƯỚNG DẪN XỬ LÝ KHẨN CẤP KHI LỠ CHUYỂN TIỀN CHO KẺ LỪA ĐẢO:**\n\n` +
           `1. **Bước 1 (Khóa tài khoản):** Gọi ngay Tổng đài Ngân hàng của bạn để yêu cầu khóa thẻ và tạm dừng mọi giao dịch chuyển tiền khẩn cấp.\n` +
           `2. **Bước 2 (Lưu chứng cứ):** Chụp lại màn hình giao dịch chuyển tiền (số tài khoản nhận, mã giao dịch, thời gian) và toàn bộ tin nhắn trao đổi.\n` +
           `3. **Bước 3 (Báo Công an):** Đến trực tiếp Trụ sở Công an xã hoặc gọi **0339310915** để lực lượng Công an lập hồ sơ phối hợp Ngân hàng phong tỏa tài khoản đối tượng lừa đảo.`
  },
  {
    keywords: ['bảo mật 2 lớp', 'zalo 2fa', 'facebook 2fa', 'cài bảo mật', 'bảo vệ tài khoản'],
    reply: `🔐 **HƯỚNG DẪN BẬT BẢO MẬT 2 LỚP (2FA) CHỐNG BỊ HACK ZALO & FACEBOOK:**\n\n` +
           `• **Dành cho Zalo:** Vào *Cá nhân* ➔ chọn *Tài khoản và an toàn* ➔ Bật *Mã khóa Zalo* và *Xác thực 2 bước* qua SMS/Cuộc gọi.\n` +
           `• **Dành cho Facebook:** Vào *Cài đặt & Quyền riêng tư* ➔ *Trung tâm tài khoản* ➔ *Mật khẩu và bảo mật* ➔ Bật *Xác thực 2 yếu tố (2FA)*.\n` +
           `📌 **Lưu ý:** Tuyệt đối KHÔNG chia sẻ mã OTP gửi về điện thoại cho bất kỳ ai!`
  },
  {
    keywords: ['hotline công an', 'số điện thoại công an xã', 'báo lừa đảo', 'sđt công an'],
    reply: `📞 **DANH SÁCH HOTLINE TIẾP NHẬN TỐ GIÁC LỪA ĐẢO 24/7:**\n\n` +
           `• **Công an xã (Trực ban 24/7):** 0339310915\n` +
           `• **Cảnh sát Khẩn cấp Toàn quốc:** 113\n` +
           `• **Phòng An ninh mạng PA05 (Công an tỉnh):** 069.2348560\n` +
           `📌 Địa chỉ Trụ sở: Bộ phận Tiếp công dân & Công an xã Đăk Pxi.`
  },
  {
    keywords: ['tra cứu thẻ bhyt', 'thẻ bhyt điện thoại', 'kiểm tra bhyt', 'vssid bhyt'],
    reply: `🏥 **HƯỚNG DẪN TRA CỨU THẺ BHYT BẰNG ĐIỆN THOẠI THÔNG MINH:**\n\n` +
           `1. **Cách 1 (Qua VNeID Mức 2):** Mở ứng dụng VNeID ➔ Vào mục *Ví giấy tờ* ➔ chọn *Thẻ BHYT* để xem giá trị sử dụng.\n` +
           `2. **Cách 2 (Qua VssID):** Đăng nhập ứng dụng VssID ➔ chọn *Quản lý cá nhân* ➔ xem *Thẻ BHYT*.\n` +
           `3. **Cách 3 (Tra cứu online):** Truy cập website ` + "`baohiemxahoi.gov.vn`" + ` nhập Mã số BHYT và Họ tên để tra cứu.`
  },
  {
    keywords: ['đăng ký vneid', 'kích hoạt vneid', 'vneid mức 2', 'ở đâu vneid'],
    reply: `🆔 **HƯỚNG DẪN KÍCH HOẠT VNEID MỨC 2 TẠI ĐỊA PHƯƠNG:**\n\n` +
           `• **Giấy tờ mang theo:** Căn cước công dân (CCCD) gắn chip + Điện thoại di động có SIM chính chủ.\n` +
           `• **Địa điểm:** Trụ sở Công an xã (Phòng Thu nhận hồ sơ VNeID) hoặc Nhà Rông các thôn theo đợt lưu động.\n` +
           `• **Lệ phí:** Hoàn toàn MIỄN PHÍ.\n` +
           `📌 Bà con có thể tự kích hoạt VNeID Mức 1 tại nhà qua app VNeID trên App Store / Google Play.`
  },
  {
    keywords: ['thủ tục khai sinh', 'đăng ký khai sinh', 'làm khai sinh', 'giấy khai sinh'],
    reply: `📑 **THỦ TỤC ĐĂNG KÝ KHAI SINH CHO TRẺ EM:**\n\n` +
           `1. **Giấy tờ cần chuẩn bị:**\n` +
           `   • Giấy chứng sinh (bản gốc do Cơ sở y tế cấp).\n` +
           `   • CCCD của cha và mẹ.\n` +
           `   • Giấy chứng nhận kết hôn của cha mẹ (nếu có).\n` +
           `2. **Nơi nộp:** Bộ phận Một cửa xã hoặc đăng ký trực tuyến qua Cổng Dịch vụ công Quốc gia (` + "`dichvucong.gov.vn`" + `).\n` +
           `3. **Thời hạn giải quyết:** Nhận kết quả ngay trong ngày.`
  },
  {
    keywords: ['thủ tục kết hôn', 'đăng ký kết hôn', 'kết hôn'],
    reply: `💍 **THỦ TỤC ĐĂNG KÝ KẾT HÔN TẠI ĐỊA PHƯƠNG:**\n\n` +
           `1. **Giấy tờ chuẩn bị:**\n` +
           `   • Tờ khai đăng ký kết hôn (theo mẫu).\n` +
           `   • CCCD chính chủ của hai bên nam, nữ.\n` +
           `   • Giấy xác nhận tình trạng hôn nhân (nếu thường trú ở xã/phường khác).\n` +
           `2. **Quy định:** Cả hai bên Nam và Nữ phải có mặt trực tiếp tại Bộ phận Một cửa xã để ký vào Sổ hộ tịch và Nhận Giấy chứng nhận kết hôn.`
  },
  {
    keywords: ['không đội mũ bảo hiểm', 'mức phạt mũ bảo hiểm', 'nghị định 100 mũ'],
    reply: `🚦 **MỨC PHẠT KHÔNG ĐỘI MŨ BẢO HIỂM THEO NGHỊ ĐỊNH 100/2019/NĐ-CP (SỬA ĐỔI):**\n\n` +
           `• **Mức phạt tiền:** Phạt từ **400.000 VNĐ đến 600.000 VNĐ** đối với người điều khiển xe mô tô, xe gắn máy không đội "mũ bảo hiểm cho người đi mô tô, xe máy" hoặc đội mũ bảo hiểm không cài quy cách.\n` +
           `• **Người ngồi sau:** Người chở người ngồi trên xe không đội mũ bảo hiểm cũng chịu mức phạt tương tự.\n` +
           `🚸 Vì an toàn của bản thân và gia đình, bà con hãy luôn đội mũ bảo hiểm chuẩn chất lượng!`
  },
  {
    keywords: ['đèo dốc', 'tốc độ đèo', 'an toàn đèo'],
    reply: `🛵 **QUY ĐỊNH AN TOÀN KHI DI CHUYỂN TRÊN ĐƯỜNG ĐÈO DỐC:**\n\n` +
           `1. **Giới hạn tốc độ:** Chạy đúng tốc độ quy định, tuyệt đối không phóng nhanh vượt ẩu ở các đoạn cua gấp, tầm nhìn bị che khuất.\n` +
           `2. **Kỹ thuật đi xe:** Đi số thấp (xe số) hoặc giữ đều ga (xe tay ga), KHÔNG rà phanh liên tục gây cháy bố phanh.\n` +
           `3. **Trời mưa sương mù:** Bật đèn chiếu gần/đèn đờ-mê, đi đúng phần đường và giữ khoảng cách an toàn với xe phía trước.`
  },
  {
    keywords: ['ngầm tràn', 'lũ quét', 'sạt lở', 'mưa bão'],
    reply: `🌧️ **KỸ NĂNG AN TOÀN KHI NƯỚC DÂNG CAO TẠI CÁC NGẦM TRÀN:**\n\n` +
           `1. **Tuyệt đối không liều lĩnh:** KHÔNG cố tình lội qua ngầm tràn khi thấy nước chảy xiết hoặc dâng cao vượt biển cảnh báo.\n` +
           `2. **Lũ quét sạt lở:** Khi thấy dấu hiệu nứt đất, đá rơi hoặc tiếng động lạ từ sườn núi, lập tức di dời gia đình đến điểm tránh trú an toàn.\n` +
           `🚨 Báo ngay Ban Chỉ huy Phòng chống thiên tai địa phương theo số trực ban Công an xã: **0339310915**.`
  },
  {
    keywords: ['bầu cử', 'quyền cử tri', 'địa điểm bỏ phiếu'],
    reply: `🗳️ **THÔNG TIN TUYÊN TRUYỀN BẦU CỬ ĐẠI BIỂU QUỐC HỘI & HĐND:**\n\n` +
           `1. **Quyền cử tri:** Công dân đủ 18 tuổi trở lên có quyền bầu cử Đại biểu Quốc hội và Hội đồng nhân dân các cấp.\n` +
           `2. **Địa điểm bỏ phiếu:** Được niêm yết công khai tại Nhà Rông / Nhà văn hóa các thôn trên địa bàn xã.\n` +
           `3. **Thể lệ:** Cử tri tự tay gạch tên ứng cử viên không bầu và bỏ phiếu vào hòm phiếu chính thức.`
  }
];

exports.getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "Vui lòng nhập nội dung câu hỏi." });
    }

    console.log("📥 Câu hỏi nhận được từ client:", message);

    // 1. Làm sạch câu hỏi (loại bỏ prefix tag trong ngoặc [...] và emoji)
    const cleanedText = message
      .replace(/^\[.*?\]\s*/g, '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .trim()
      .toLowerCase();

    console.log("🧹 Câu hỏi sau khi làm sạch:", cleanedText);

    // 2. Tìm kiếm trong CƠ SỞ TRI THỨC CHUẨN NGHIỆP VỤ (Built-in Knowledge)
    for (const item of EXPERT_KNOWLEDGE) {
      const match = item.keywords.some(kw => cleanedText.includes(kw));
      if (match) {
        console.log("🎯 Tìm thấy câu trả lời Chuẩn nghiệp vụ cho từ khóa!");
        return res.status(200).json({ reply: item.reply });
      }
    }

    // 3. Tìm kiếm trong Cơ sở dữ liệu MongoDB (Database Query)
    try {
      const words = cleanedText.split(/\s+/).filter(w => w.length >= 2);
      if (words.length > 0) {
        const regexPattern = words.join("|");
        const knowledgeFromDb = await Knowledge.findOne({
          $or: [
            { title: { $regex: regexPattern, $options: "i" } },
            { keywords: { $regex: regexPattern, $options: "i" } },
            { content: { $regex: regexPattern, $options: "i" } }
          ]
        });

        if (knowledgeFromDb && knowledgeFromDb.content) {
          console.log("📚 Tìm thấy kiến thức từ MongoDB Database:", knowledgeFromDb.title);
          return res.status(200).json({ reply: knowledgeFromDb.content });
        }
      }
    } catch (dbErr) {
      console.warn("⚠️ Lỗi truy vấn MongoDB (sử dụng fallback):", dbErr.message);
    }

    // 4. Phản hồi Mặc định Chuyên nghiệp chuẩn phong cách Phòng Văn hóa - Xã hội
    const defaultReply = `📋 **PHÒNG VĂN HÓA - XÃ HỘI THÔNG BÁO:**\n\n` +
      `Cảm ơn bà con đã gửi câu hỏi: *"${cleanedText}"*.\n\n` +
      `📌 Để được tư vấn chi tiết và giải quyết thủ tục nhanh nhất, bà con vui lòng:\n` +
      `1. Tra cứu trực tiếp tại các chuyên mục thông tin trên Website.\n` +
      `2. Đến Bộ phận Tiếp công dân tại Trụ sở trong giờ hành chính.\n` +
      `3. Hoặc liên hệ Hotline hỗ trợ khẩn cấp: **0339310915** (Tiếp nhận 24/7).`;

    return res.status(200).json({ reply: defaultReply });

  } catch (error) {
    console.error("❌ Lỗi server chatController:", error);
    return res.status(500).json({
      reply: "Hệ thống Trợ lý AI đang cập nhật dữ liệu. Bà con vui lòng thử lại sau giây lát!",
      error: error.message
    });
  }
};