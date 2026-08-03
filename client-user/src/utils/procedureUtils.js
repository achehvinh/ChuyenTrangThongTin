import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/bai-viet";

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

export const USE_MOCK_FALLBACK = true;

export const FIELD_GROUPS = [
  { id: "dat-dai", name: "Đất đai", default_count: 40 },
  { id: "nguoi-co-cong", name: "Người có công với cách mạng", default_count: 39 },
  { id: "thanh-lap-truong-hoc", name: "Thành lập/công nhận/giải thể trường học", default_count: 27 },
  { id: "duong-thuy-hang-hai", name: "Đường thủy nội địa/hàng hải", default_count: 24 },
  { id: "thuy-loi", name: "Thủy lợi", default_count: 18 },
  { id: "thuy-san", name: "Thủy sản", default_count: 17 },
  { id: "chung-thuc", name: "Chứng thực", default_count: 14 },
  { id: "ho-tro-giao-duc", name: "Hỗ trợ/chính sách giáo dục", default_count: 13 },
  { id: "khai-sinh", name: "Khai sinh", default_count: 11 },
  { id: "bao-tro-xa-hoi", name: "Bảo trợ xã hội", default_count: 11 },
  { id: "hop-tac-xa", name: "Hợp tác xã, liên hiệp HTX", default_count: 11 },
  { id: "nong-nghiep-thu-y", name: "Nông nghiệp - chăn nuôi - thú y", default_count: 10 },
  { id: "ket-hon", name: "Kết hôn", default_count: 9 },
  { id: "tai-nguyen-nuoc", name: "Tài nguyên nước", default_count: 9 },
  { id: "ton-giao", name: "Tôn giáo, tín ngưỡng", default_count: 9 },
  { id: "giao-thong-duong-bo", name: "Giao thông đường bộ", default_count: 8 },
  { id: "van-hoa-the-thao", name: "Văn hóa - lễ hội - thể thao - xuất bản", default_count: 8 },
  { id: "lam-nghiep", name: "Lâm nghiệp", default_count: 8 },
  { id: "xay-dung", name: "Xây dựng", default_count: 8 },
  { id: "ho-kinh-doanh", name: "Hộ kinh doanh", default_count: 7 },
  { id: "y-te-an-toan-thuc-pham", name: "Y tế - an toàn thực phẩm", default_count: 7 },
  { id: "hoi", name: "Hội", default_count: 7 },
  { id: "khai-tu", name: "Khai tử", default_count: 6 },
  { id: "giam-ho", name: "Giám hộ", default_count: 6 },
  { id: "tre-em", name: "Trẻ em", default_count: 6 },
  { id: "moi-truong", name: "Môi trường", default_count: 6 },
  { id: "can-bo-cong-chuc", name: "Cán bộ, công chức, viên chức", default_count: 6 },
  { id: "quy", name: "Quỹ", default_count: 6 },
  { id: "to-hop-tac", name: "Tổ hợp tác", default_count: 6 },
  { id: "to-hop-tac-htx-chung", name: "Tổ hợp tác/Hợp tác xã (chung)", default_count: 6 },
  { id: "hoa-giai-co-so", name: "Hòa giải ở cơ sở", default_count: 5 },
  { id: "quy-hoach-do-thi", name: "Quy hoạch đô thị và nông thôn", default_count: 5 },
  { id: "khac", name: "Khác", default_count: 4 },
  { id: "ho-tich-khac", name: "Hộ tịch khác", default_count: 4 },
  { id: "ho-ngheo-can-ngheo", name: "Hộ nghèo, cận nghèo", default_count: 4 },
  { id: "lao-dong", name: "Lao động", default_count: 4 },
  { id: "nuoi-con-nuoi", name: "Nuôi con nuôi", default_count: 4 },
  { id: "nhan-cha-me-con", name: "Nhận cha, mẹ, con", default_count: 3 },
  { id: "nha-o", name: "Nhà ở", default_count: 3 },
  { id: "nguoi-khuyet-tat", name: "Người khuyết tật", default_count: 2 },
  { id: "tuyen-sinh-giao-duc", name: "Tuyển sinh/kiểm định giáo dục", default_count: 2 },
  { id: "phong-chong-bao-luc-gia-dinh", name: "Phòng chống bạo lực gia đình", default_count: 2 },
  { id: "dan-toc", name: "Dân tộc", default_count: 2 },
  { id: "cho", name: "Chợ", default_count: 2 },
  { id: "khoang-san", name: "Khoáng sản", default_count: 2 },
  { id: "thi-dua-khen-thuong", name: "Thi đua, khen thưởng - nghệ nhân", default_count: 2 },
  { id: "khoa-hoc-cong-nghe", name: "Khoa học công nghệ", default_count: 2 },
  { id: "cong-nghiep", name: "Công nghiệp", default_count: 1 },
  { id: "dien", name: "Điện", default_count: 1 }
];

export const PAGE_SIZE = 9;

const BASE_PROCEDURES = [
  // 1. Đất đai
  { id: "dd-173", code: "1.012753.01", group_id: "dat-dai", group_name: "Đất đai", title: "Đăng ký đất đai, tài sản gắn liền với đất, cấp Giấy chứng nhận quyền sử dụng đất lần đầu đối với tổ chức đang sử dụng đất" },
  { id: "dd-174", code: "1.012756.01", group_id: "dat-dai", group_name: "Đất đai", title: "Đăng ký đất đai lần đầu đối với trường hợp được Nhà nước giao đất để quản lý" },
  { id: "dd-175", code: "1.012766.01", group_id: "dat-dai", group_name: "Đất đai", title: "Xóa đăng ký thuê, cho thuê lại quyền sử dụng đất trong dự án xây dựng kinh doanh kết cấu hạ tầng" },
  { id: "dd-176", code: "1.012781.01", group_id: "dat-dai", group_name: "Đất đai", title: "Đăng ký, cấp Giấy chứng nhận đối với thửa đất có diện tích tăng thêm do thay đổi ranh giới" },
  { id: "dd-177", code: "1.012782.01", group_id: "dat-dai", group_name: "Đất đai", title: "Đăng ký, cấp Giấy chứng nhận đối với trường hợp cá nhân, hộ gia đình đã được cấp một phần diện tích trước 01/07/2004" },
  { id: "dd-178", code: "1.012783.01", group_id: "dat-dai", group_name: "Đất đai", title: "Cấp đổi Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất" },
  { id: "dd-179", code: "1.012784.01", group_id: "dat-dai", group_name: "Đất đai", title: "Tách thửa hoặc hợp thửa đất" },
  { id: "dd-180", code: "1.012785.01", group_id: "dat-dai", group_name: "Đất đai", title: "Đăng ký, cấp Giấy chứng nhận đối với trường hợp đã chuyển quyền sử dụng đất trước 01/08/2024" },
  { id: "dd-181", code: "1.012786.01", group_id: "dat-dai", group_name: "Đất đai", title: "Cấp lại Giấy chứng nhận do bị mất" },
  { id: "dd-182", code: "1.012787.01", group_id: "dat-dai", group_name: "Đất đai", title: "Đăng ký, cấp Giấy chứng nhận quyền sử dụng đất cho người nhận chuyển nhượng trong dự án bất động sản" },
  { id: "dd-183", code: "1.012791.01", group_id: "dat-dai", group_name: "Đất đai", title: "Thu hồi Giấy chứng nhận đã cấp không đúng quy định và cấp lại" },
  { id: "dd-186", code: "1.012812.01", group_id: "dat-dai", group_name: "Đất đai", title: "Hòa giải tranh chấp đất đai" },

  // 2. Người có công
  { id: "ncc-18", code: "1.001257.01", group_id: "nguoi-co-cong", group_name: "Người có công với cách mạng", title: "Giải quyết trợ cấp một lần đối với người có thành tích tham gia kháng chiến được tặng Bằng khen" },
  { id: "ncc-84", code: "1.004964.01", group_id: "nguoi-co-cong", group_name: "Người có công với cách mạng", title: "Giải quyết chế độ trợ cấp một lần đối với người được cử làm chuyên gia sang giúp Lào, Căm-pu-chi-a" },
  { id: "ncc-118", code: "1.010772.01", group_id: "nguoi-co-cong", group_name: "Người có công với cách mạng", title: "Cấp Bằng Tổ quốc ghi công" },
  { id: "ncc-119", code: "1.010774.01", group_id: "nguoi-co-cong", group_name: "Người có công với cách mạng", title: "Cấp Bằng Tổ quốc ghi công đối với người hy sinh chưa được cấp Bằng từ 31/12/1994 trở về trước" },

  // 3. Thành lập trường học
  { id: "th-4", code: "1.000280.01", group_id: "thanh-lap-truong-hoc", group_name: "Thành lập/công nhận/giải thể trường học", title: "Công nhận trường tiểu học đạt chuẩn quốc gia" },
  { id: "th-5", code: "1.000288.01", group_id: "thanh-lap-truong-hoc", group_name: "Thành lập/công nhận/giải thể trường học", title: "Công nhận trường mầm non đạt chuẩn Quốc gia" },

  // 7. Chứng thực
  { id: "ct-328", code: "2.000815.01", group_id: "chung-thuc", group_name: "Chứng thực", title: "Chứng thực bản sao từ bản chính giấy tờ, văn bản do cơ quan có thẩm quyền cấp" },
  { id: "ct-329", code: "2.000884.02", group_id: "chung-thuc", group_name: "Chứng thực", title: "Chứng thực chữ ký trong các giấy tờ, văn bản" },

  // 8. Hỗ trợ giáo dục
  { id: "gd-22", code: "1.001622.01", group_id: "ho-tro-giao-duc", group_name: "Hỗ trợ/chính sách giáo dục", title: "Hỗ trợ ăn trưa đối với trẻ em mẫu giáo" },

  // 9. Khai sinh
  { id: "ks-1", code: "1.001193.02", group_id: "khai-sinh", group_name: "Khai sinh", title: "Liên thông đăng ký khai sinh, đăng ký thường trú, cấp thẻ bảo hiểm y tế cho trẻ em dưới 6 tuổi" },
  { id: "ks-3", code: "1.000110.01", group_id: "khai-sinh", group_name: "Khai sinh", title: "Thủ tục đăng ký khai sinh có yếu tố nước ngoài tại khu vực biên giới" },

  // 10. Bảo trợ xã hội
  { id: "bt-31", code: "1.001731.01", group_id: "bao-tro-xa-hoi", group_name: "Bảo trợ xã hội", title: "Hỗ trợ chi phí mai táng cho đối tượng bảo trợ xã hội" },

  // 13. Kết hôn
  { id: "kh-1", code: "1.000894.02", group_id: "ket-hon", group_name: "Kết hôn", title: "Thủ tục đăng ký kết hôn" },
  { id: "kh-2", code: "1.000094.01", group_id: "ket-hon", group_name: "Kết hôn", title: "Thủ tục đăng ký kết hôn có yếu tố nước ngoài tại khu vực biên giới" },

  // 23. Khai tử
  { id: "kt-1", code: "1.010824.01", group_id: "khai-tu", group_name: "Khai tử", title: "Liên thông về đăng ký khai tử, xóa đăng ký thường trú, hưởng chế độ tử tuất" },

  // 38. Nhận cha, mẹ, con
  { id: "cmc-1", code: "1.000080.01", group_id: "nhan-cha-me-con", group_name: "Nhận cha, mẹ, con", title: "Thủ tục đăng ký nhận cha, mẹ, con có yếu tố nước ngoài tại khu vực biên giới" },

  // 45. Hộ nghèo, cận nghèo
  { id: "hn-1", code: "1.014336.01", group_id: "ho-ngheo-can-ngheo", group_name: "Hộ nghèo, cận nghèo", title: "Cấp thẻ BHYT miễn phí cho hộ nghèo, hộ cận nghèo năm 2026" }
];

export const MOCK_PROCEDURES = (() => {
  const result = BASE_PROCEDURES.map((p, idx) => ({
    id: p.id || `proc-${idx + 1}`,
    code: p.code,
    slug: (p.code || `tthc-${idx + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    group_id: p.group_id,
    group_name: p.group_name,
    title: p.title,
    online_type: "toan-trinh",
    summary: `Thủ tục ${p.title} thuộc thẩm quyền giải quyết của UBND xã Đăk Pxi.`,
    processing_time: "03 ngày làm việc",
    fee: "Miễn phí 100%",
    agency: "Bộ phận Một cửa – UBND Xã Đăk Pxi",
    guideLink: `https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nganh.html?ma_thu_tuc=${encodeURIComponent(p.code)}`,
    view_count: 1450 + idx * 25,
    required_documents: "Tờ khai điện tử theo mẫu; CCCD/VNeID; Giấy tờ chuyên ngành liên quan.",
    conditions_text: "Công dân, hộ gia đình cư trú hoặc có hoạt động trên địa bàn xã Đăk Pxi.",
    steps: [
      { id: `step-${idx}-1`, title: "Nộp hồ sơ trực tuyến", content: "Đăng nhập VNeID trên Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn) chọn thủ tục tương ứng." },
      { id: `step-${idx}-2`, title: "Thụ lý và trả kết quả", content: "Bộ phận Một cửa UBND xã Đăk Pxi kiểm tra, xử lý và trả kết quả bản điện tử hoặc bản giấy." }
    ]
  }));

  // Tạo thêm thủ tục đại diện cho tất cả 49 nhóm lĩnh vực
  FIELD_GROUPS.forEach((group, gIdx) => {
    const countInGroup = result.filter(item => item.group_id === group.id).length;
    const needed = Math.max(1, Math.min(3, group.default_count) - countInGroup);
    
    for (let i = 1; i <= needed; i++) {
      const codeNum = `1.${(gIdx + 1).toString().padStart(2, '0')}${(100 + i * 15).toString()}.01`;
      result.push({
        id: `${group.id}-${i}`,
        code: codeNum,
        slug: `${group.id}-thu-tuc-${i}`,
        group_id: group.id,
        group_name: group.name,
        title: `Thủ tục ${group.name} - Giải quyết nghiệp vụ nhóm ${group.name} tại xã Đăk Pxi (Mẫu ${i})`,
        online_type: i % 2 === 0 ? "toan-trinh" : "mot-phan",
        summary: `Thủ tục hành chính thuộc nhóm lĩnh vực ${group.name} thuộc thẩm quyền giải quyết của UBND xã Đăk Pxi.`,
        processing_time: "03 ngày làm việc",
        fee: "Theo quy định hiện hành",
        agency: "Bộ phận Một cửa – UBND Xã Đăk Pxi",
        guideLink: `https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nganh.html?ma_thu_tuc=${codeNum}`,
        view_count: 980 + gIdx * 10 + i * 5,
        required_documents: "Tờ khai đăng ký điện tử theo mẫu; CCCD/VNeID.",
        conditions_text: "Công dân, tổ chức thụ hưởng dịch vụ tại địa bàn xã Đăk Pxi.",
        steps: [
          { id: `${group.id}-${i}-1`, title: "Khai báo trực tuyến", content: "Nộp hồ sơ trực tuyến trên Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)." },
          { id: `${group.id}-${i}-2`, title: "Nhận kết quả", content: "Bộ phận Một cửa xã Đăk Pxi duyệt và trả kết quả cho công dân." }
        ]
      });
    }
  });

  return result;
})();

/* ══════════════════════════════════════
   HELPER FUNCTIONS
══════════════════════════════════════ */

export function getCitizenSessionId() {
  const key = "dakpxi_tthc_session_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

export function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export function normalizeDetail(payload) {
  return payload?.data || payload || null;
}

export function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildSpeakText(p) {
  const steps = p.steps || [];
  return [
    `Thủ tục: ${p.title}.`,
    p.summary           ? `Mô tả: ${p.summary}.`                        : "",
    p.processing_time   ? `Thời gian giải quyết: ${p.processing_time}.` : "",
    p.fee               ? `Lệ phí: ${p.fee}.`                           : "",
    p.agency            ? `Cơ quan giải quyết: ${p.agency}.`            : "",
    p.required_documents? `Giấy tờ cần chuẩn bị: ${p.required_documents}.` : "",
    steps.length
      ? `Quy trình: ${steps.map((s, i) => `Bước ${i + 1}: ${s.title}. ${s.content}`).join(". ")}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function filterMockProcedures({ keyword, groupId, page, pageSize }) {
  let rows = MOCK_PROCEDURES;
  if (groupId) {
    rows = rows.filter((p) => p.group_id === groupId || p.fieldGroup === groupId);
  }
  if (keyword) {
    const q = keyword.toLowerCase();
    rows = rows.filter(
      (p) => (p.title && p.title.toLowerCase().includes(q)) ||
             (p.code && p.code.toLowerCase().includes(q)) ||
             (p.summary && p.summary.toLowerCase().includes(q))
    );
  }
  const total = rows.length;
  return { rows: rows.slice((page - 1) * pageSize, page * pageSize), total };
}

export function findMockProcedureBySlug(slugOrId) {
  return (
    MOCK_PROCEDURES.find((p) => p.slug === slugOrId || p.id === slugOrId) || null
  );
}