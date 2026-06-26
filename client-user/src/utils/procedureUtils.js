import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

export const USE_MOCK_FALLBACK = true;

export const FIELD_GROUPS = [
  { id: "nong-nghiep", name: "Nông nghiệp - Môi trường" },
  { id: "tu-phap", name: "Tư pháp - Hộ tịch" },
  { id: "dat-dai", name: "Đất đai - Xây dựng" },
  { id: "xa-hoi", name: "Lao động - Xã hội" },
  { id: "kinh-te", name: "Kinh tế - Tài chính" },
  { id: "giao-duc", name: "Giáo dục - Y tế" },
];

export const PAGE_SIZE = 9;

export const MOCK_PROCEDURES = [
  { id:"ks-1", slug:"dang-ky-khai-sinh", group_id:"tu-phap", group_name:"Tư pháp - Hộ tịch", title:"Đăng ký khai sinh", summary:"Đăng ký khai sinh cho trẻ sơ sinh, cấp Giấy khai sinh trong ngày.", processing_time:"Trong ngày (tối đa 3 ngày làm việc)", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Tư pháp, Hộ tịch", view_count:1820, required_documents:"Giấy chứng sinh do bệnh viện cấp; CCCD của bố và mẹ; Sổ hộ khẩu.", conditions_text:"Trẻ sinh ra phải được đăng ký khai sinh trong vòng 60 ngày kể từ ngày sinh.", steps:[{id:"ks-1-1",title:"Chuẩn bị giấy tờ",content:"Mang theo Giấy chứng sinh, CCCD của bố và mẹ, Sổ hộ khẩu."},{id:"ks-1-2",title:"Đến UBND xã",content:"Mang giấy tờ đến bộ phận Tư pháp – Hộ tịch tại UBND xã Đăk Pxi."},{id:"ks-1-3",title:"Điền tờ khai",content:"Nhận và điền Tờ khai đăng ký khai sinh theo hướng dẫn của cán bộ."},{id:"ks-1-4",title:"Nhận kết quả",content:"Giấy khai sinh được cấp ngay trong ngày."}], forms:[{id:"f1",title:"Tờ khai đăng ký khai sinh",file_type:"DOC",file_size:45000}] },
  { id:"ks-2", slug:"dang-ky-khai-tu", group_id:"tu-phap", group_name:"Tư pháp - Hộ tịch", title:"Đăng ký khai tử", summary:"Đăng ký khai tử và cấp Giấy chứng tử cho người đã mất.", processing_time:"Trong ngày làm việc", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Tư pháp, Hộ tịch", view_count:940, required_documents:"Giấy báo tử (y tế cấp); CCCD người chết; CCCD người đến khai báo.", conditions_text:"Phải khai báo trong vòng 15 ngày kể từ ngày người thân mất.", steps:[{id:"ks-2-1",title:"Chuẩn bị giấy tờ",content:"Giấy báo tử, CCCD người chết và người đến khai báo."},{id:"ks-2-2",title:"Nộp hồ sơ tại UBND xã",content:"Đến bộ phận Tư pháp – Hộ tịch, nộp đầy đủ giấy tờ."},{id:"ks-2-3",title:"Nhận Giấy chứng tử",content:"Giấy chứng tử được cấp ngay trong ngày làm việc."}], forms:[] },
  { id:"hn-1", slug:"dang-ky-ket-hon", group_id:"tu-phap", group_name:"Tư pháp - Hộ tịch", title:"Đăng ký kết hôn", summary:"Đăng ký kết hôn cho công dân Việt Nam thường trú tại xã.", processing_time:"Trong ngày làm việc", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Tư pháp, Hộ tịch", view_count:1230, required_documents:"Tờ khai đăng ký kết hôn (2 người cùng ký); CCCD của cả hai; Giấy xác nhận tình trạng hôn nhân.", conditions_text:"Cả hai bên phải đến trực tiếp UBND xã để ký và xác nhận.", steps:[{id:"hn-1-1",title:"Hồ sơ cần có",content:"Tờ khai, CCCD của cả hai, Giấy xác nhận tình trạng hôn nhân."},{id:"hn-1-2",title:"Cả hai phải có mặt",content:"Cả hai vợ chồng phải đến trực tiếp UBND xã để ký và xác nhận."},{id:"hn-1-3",title:"Nhận Giấy đăng ký kết hôn",content:"Được trao Giấy đăng ký kết hôn ngay trong ngày làm việc."}], forms:[{id:"f2",title:"Tờ khai đăng ký kết hôn",file_type:"DOC",file_size:38000}] },
  { id:"dd-1", slug:"cap-giay-chung-nhan-qsdd", group_id:"dat-dai", group_name:"Đất đai - Xây dựng", title:"Cấp Giấy chứng nhận QSDĐ (Sổ đỏ)", summary:"Cấp Giấy chứng nhận quyền sử dụng đất lần đầu cho hộ gia đình, cá nhân.", processing_time:"15 - 30 ngày làm việc", fee:"Có lệ phí theo quy định của tỉnh", agency:"UBND xã Đăk Pxi / Văn phòng Đăng ký đất đai", view_count:2750, required_documents:"Đơn xin cấp sổ đỏ; Bản đồ địa chính; CCCD; Sổ hộ khẩu; giấy tờ nguồn gốc đất.", conditions_text:"Đất không có tranh chấp, phù hợp quy hoạch sử dụng đất tại địa phương.", steps:[{id:"dd-1-1",title:"Hồ sơ cần có",content:"Đơn xin cấp sổ đỏ, bản đồ địa chính, CCCD, sổ hộ khẩu, giấy tờ nguồn gốc đất."},{id:"dd-1-2",title:"Nộp hồ sơ",content:"Nộp tại UBND xã hoặc Văn phòng Đăng ký đất đai."},{id:"dd-1-3",title:"Thẩm định & đo đạc",content:"Cán bộ địa chính xác minh thực địa, đo đạc diện tích."},{id:"dd-1-4",title:"Nhận Sổ đỏ",content:"Thời gian xử lý 15–30 ngày làm việc, có thu phí theo quy định."}], forms:[{id:"f3",title:"Đơn xin cấp Giấy chứng nhận QSDĐ",file_type:"PDF",file_size:120000}] },
  { id:"dd-2", slug:"cap-phep-xay-dung-nha-o", group_id:"dat-dai", group_name:"Đất đai - Xây dựng", title:"Cấp phép xây dựng nhà ở riêng lẻ", summary:"Xin cấp phép xây dựng nhà ở riêng lẻ tại khu vực nông thôn.", processing_time:"10 - 15 ngày làm việc", fee:"Có lệ phí", agency:"UBND xã Đăk Pxi", view_count:860, required_documents:"Đơn xin cấp phép; Bản vẽ thiết kế; Giấy chứng nhận QSDĐ; CCCD.", conditions_text:"Diện tích xây dựng phù hợp quy hoạch, không lấn chiếm đất công.", steps:[{id:"dd-2-1",title:"Chuẩn bị hồ sơ",content:"Đơn xin cấp phép, bản vẽ thiết kế, giấy chứng nhận QSDĐ."},{id:"dd-2-2",title:"Nộp hồ sơ",content:"Nộp tại bộ phận Một cửa UBND xã."},{id:"dd-2-3",title:"Nhận giấy phép",content:"Nhận kết quả sau 10-15 ngày làm việc."}], forms:[] },
  { id:"ht-1", slug:"xet-ho-ngheo", group_id:"xa-hoi", group_name:"Lao động - Xã hội", title:"Xét hộ nghèo / cận nghèo", summary:"Xét duyệt và cấp Sổ hộ nghèo, cận nghèo cho hộ gia đình khó khăn.", processing_time:"Theo kỳ rà soát hàng năm", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Văn hóa, Xã hội", view_count:670, required_documents:"Đơn đề nghị xét duyệt hộ nghèo.", conditions_text:"Thu nhập bình quân đầu người dưới chuẩn nghèo theo quy định hiện hành.", steps:[{id:"ht-1-1",title:"Đề nghị xét duyệt",content:"Viết đơn hoặc gặp trực tiếp cán bộ văn hóa - xã hội."},{id:"ht-1-2",title:"Rà soát tại địa bàn",content:"Cán bộ đến nhà khảo sát điều kiện sống, thu nhập."},{id:"ht-1-3",title:"Họp xét duyệt",content:"Hội đồng xã họp xét duyệt, niêm yết công khai 5 ngày."},{id:"ht-1-4",title:"Nhận Sổ hộ nghèo",content:"Được cấp Sổ hộ nghèo và hưởng chính sách hỗ trợ."}], forms:[] },
  { id:"ht-2", slug:"tro-cap-nguoi-khuyet-tat", group_id:"xa-hoi", group_name:"Lao động - Xã hội", title:"Trợ cấp người khuyết tật", summary:"Đăng ký hưởng trợ cấp xã hội hàng tháng cho người khuyết tật.", processing_time:"15 ngày làm việc", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Văn hóa, Xã hội", view_count:540, required_documents:"Đơn đề nghị; Giấy xác nhận khuyết tật; CCCD; Sổ hộ khẩu.", conditions_text:"Có Giấy xác nhận mức độ khuyết tật do Hội đồng xét duyệt cấp.", steps:[{id:"ht-2-1",title:"Hồ sơ cần có",content:"Đơn đề nghị, giấy xác nhận khuyết tật, CCCD, sổ hộ khẩu."},{id:"ht-2-2",title:"Nộp hồ sơ",content:"Nộp tại bộ phận Văn hóa - Xã hội của UBND xã."},{id:"ht-2-3",title:"Nhận trợ cấp hàng tháng",content:"Sau khi được duyệt, nhận trợ cấp theo quy định."}], forms:[] },
  { id:"nn-1", slug:"ho-tro-chuyen-doi-cay-trong", group_id:"nong-nghiep", group_name:"Nông nghiệp - Môi trường", title:"Hỗ trợ chuyển đổi cây trồng", summary:"Đăng ký nhận hỗ trợ giống, kỹ thuật khi chuyển đổi cây trồng kém hiệu quả.", processing_time:"20 ngày làm việc", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Nông nghiệp", view_count:410, required_documents:"Đơn đăng ký; Giấy chứng nhận QSDĐ hoặc xác nhận đất canh tác.", conditions_text:"Diện tích đất nằm trong vùng quy hoạch chuyển đổi của xã.", steps:[{id:"nn-1-1",title:"Đăng ký nhu cầu",content:"Nộp đơn đăng ký tại bộ phận Nông nghiệp xã."},{id:"nn-1-2",title:"Khảo sát thực địa",content:"Cán bộ nông nghiệp khảo sát diện tích, loại đất."},{id:"nn-1-3",title:"Nhận hỗ trợ",content:"Nhận giống, vật tư và hướng dẫn kỹ thuật theo chương trình."}], forms:[] },
  { id:"kt-1", slug:"vay-von-uu-dai-ho-ngheo", group_id:"kinh-te", group_name:"Kinh tế - Tài chính", title:"Vay vốn ưu đãi hộ nghèo", summary:"Hướng dẫn thủ tục vay vốn ưu đãi từ Ngân hàng Chính sách Xã hội.", processing_time:"10 - 20 ngày làm việc", fee:"Miễn phí thủ tục, lãi suất ưu đãi", agency:"UBND xã Đăk Pxi phối hợp Ngân hàng CSXH", view_count:980, required_documents:"Đơn xin vay vốn; Sổ hộ nghèo/cận nghèo; CCCD.", conditions_text:"Thuộc danh sách hộ nghèo, cận nghèo hoặc đối tượng chính sách.", steps:[{id:"kt-1-1",title:"Lập hồ sơ vay vốn",content:"Viết đơn xin vay vốn kèm sổ hộ nghèo, CCCD."},{id:"kt-1-2",title:"Xác nhận của xã",content:"UBND xã xác nhận đối tượng được vay vốn ưu đãi."},{id:"kt-1-3",title:"Giải ngân",content:"Ngân hàng Chính sách Xã hội giải ngân theo lịch hẹn."}], forms:[] },
  { id:"gd-1", slug:"cap-the-bhyt-ho-ngheo", group_id:"giao-duc", group_name:"Giáo dục - Y tế", title:"Cấp thẻ BHYT cho hộ nghèo", summary:"Cấp thẻ Bảo hiểm y tế miễn phí cho hộ nghèo, cận nghèo, trẻ em dưới 6 tuổi.", processing_time:"10 ngày làm việc", fee:"Miễn phí", agency:"UBND xã Đăk Pxi - Bộ phận Văn hóa, Xã hội", view_count:1340, required_documents:"Danh sách hộ nghèo; CCCD; Giấy khai sinh (nếu là trẻ em).", conditions_text:"Thuộc danh sách hộ nghèo, cận nghèo hoặc trẻ em dưới 6 tuổi theo quy định.", steps:[{id:"gd-1-1",title:"Lập danh sách",content:"Cán bộ xã lập danh sách đối tượng được cấp thẻ."},{id:"gd-1-2",title:"Gửi cơ quan BHXH",content:"UBND xã gửi danh sách lên cơ quan Bảo hiểm xã hội huyện."},{id:"gd-1-3",title:"Nhận thẻ BHYT",content:"Thẻ BHYT được cấp và phát tại UBND xã."}], forms:[] },
  { id:"gd-2", slug:"mien-giam-hoc-phi", group_id:"giao-duc", group_name:"Giáo dục - Y tế", title:"Miễn, giảm học phí", summary:"Xét miễn, giảm học phí cho học sinh thuộc hộ nghèo, cận nghèo, gia đình chính sách.", processing_time:"Theo năm học", fee:"Miễn phí", agency:"UBND xã Đăk Pxi phối hợp nhà trường", view_count:590, required_documents:"Đơn xin miễn giảm học phí; Giấy xác nhận hộ nghèo/cận nghèo.", conditions_text:"Học sinh thuộc hộ nghèo, cận nghèo hoặc gia đình có công với cách mạng.", steps:[{id:"gd-2-1",title:"Nộp đơn tại trường",content:"Phụ huynh nộp đơn xin miễn giảm học phí tại trường."},{id:"gd-2-2",title:"Xác nhận của xã",content:"UBND xã xác nhận hộ nghèo, cận nghèo."},{id:"gd-2-3",title:"Quyết định miễn giảm",content:"Nhà trường ra quyết định miễn, giảm học phí."}], forms:[] },
];

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
    p.summary ? `Mô tả: ${p.summary}.` : "",
    p.processing_time ? `Thời gian giải quyết: ${p.processing_time}.` : "",
    p.fee ? `Lệ phí: ${p.fee}.` : "",
    p.agency ? `Cơ quan giải quyết: ${p.agency}.` : "",
    p.required_documents ? `Giấy tờ cần chuẩn bị: ${p.required_documents}.` : "",
    steps.length
      ? `Quy trình: ${steps.map((s, i) => `Bước ${i + 1}: ${s.title}. ${s.content}`).join(". ")}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function filterMockProcedures({ keyword, groupId, page, pageSize }) {
  let rows = MOCK_PROCEDURES;
  if (groupId) rows = rows.filter((p) => p.group_id === groupId);
  if (keyword) {
    const q = keyword.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    );
  }
  const total = rows.length;
  return { rows: rows.slice((page - 1) * pageSize, page * pageSize), total };
}

// Tìm 1 thủ tục theo slug hoặc id trong dữ liệu mẫu (dùng khi API lỗi/chưa có)
export function findMockProcedureBySlug(slugOrId) {
  return (
    MOCK_PROCEDURES.find((p) => p.slug === slugOrId || p.id === slugOrId) ||
    null
  );
}