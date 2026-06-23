import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "./Thutuchanhchinh.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

/* ============================================================
   LĨNH VỰC — dùng làm bộ lọc tag phía trên danh sách, không
   còn là một bước chọn trung gian bắt buộc.
   ============================================================ */
const FIELD_GROUPS = [
  { id: "nong-nghiep", name: "Nông nghiệp - Môi trường", icon: "🌿", color: "#e8f5e9" },
  { id: "tu-phap", name: "Tư pháp - Hộ tịch", icon: "⚖️", color: "#e8eaf6" },
  { id: "dat-dai", name: "Đất đai - Xây dựng", icon: "🏗️", color: "#fff3e0" },
  { id: "xa-hoi", name: "Lao động - Xã hội", icon: "👥", color: "#e3f2fd" },
  { id: "kinh-te", name: "Kinh tế - Tài chính", icon: "💰", color: "#fce4ec" },
  { id: "giao-duc", name: "Giáo dục - Y tế", icon: "🏥", color: "#f3e5f5" },
];

const PAGE_SIZE = 9;

/* ============================================================
   MOCK DATA — dùng làm dữ liệu xem trước khi chưa có/không gọi
   được API thật. Đủ phong phú để thấy rõ mọi chức năng: tìm
   kiếm, lọc theo lĩnh vực, phân trang, chi tiết, các bước,
   biểu mẫu, hỏi đáp, đánh giá.
   ============================================================ */
const MOCK_PROCEDURES = [
  {
    id: "ks-1",
    slug: "dang-ky-khai-sinh",
    group_id: "tu-phap",
    group_name: "Tư pháp - Hộ tịch",
    title: "Đăng ký khai sinh",
    summary: "Đăng ký khai sinh cho trẻ sơ sinh, cấp Giấy khai sinh trong ngày.",
    processing_time: "Trong ngày (tối đa 3 ngày làm việc)",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Tư pháp, Hộ tịch",
    view_count: 1820,
    required_documents: "Giấy chứng sinh do bệnh viện cấp; CCCD của bố và mẹ; Sổ hộ khẩu.",
    conditions_text: "Trẻ sinh ra phải được đăng ký khai sinh trong vòng 60 ngày kể từ ngày sinh.",
    steps: [
      { id: "ks-1-1", title: "Chuẩn bị giấy tờ", content: "Mang theo Giấy chứng sinh, CCCD của bố và mẹ, Sổ hộ khẩu." },
      { id: "ks-1-2", title: "Đến UBND xã", content: "Mang giấy tờ đến bộ phận Tư pháp – Hộ tịch tại UBND xã Đăk Pxi." },
      { id: "ks-1-3", title: "Điền tờ khai", content: "Nhận và điền Tờ khai đăng ký khai sinh theo hướng dẫn của cán bộ." },
      { id: "ks-1-4", title: "Nhận kết quả", content: "Giấy khai sinh được cấp ngay trong ngày." },
    ],
    forms: [{ id: "f1", title: "Tờ khai đăng ký khai sinh", file_type: "DOC", file_size: 45000 }],
  },
  {
    id: "ks-2",
    slug: "dang-ky-khai-tu",
    group_id: "tu-phap",
    group_name: "Tư pháp - Hộ tịch",
    title: "Đăng ký khai tử",
    summary: "Đăng ký khai tử và cấp Giấy chứng tử cho người đã mất.",
    processing_time: "Trong ngày làm việc",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Tư pháp, Hộ tịch",
    view_count: 940,
    required_documents: "Giấy báo tử (y tế cấp); CCCD người chết; CCCD người đến khai báo.",
    conditions_text: "Phải khai báo trong vòng 15 ngày kể từ ngày người thân mất.",
    steps: [
      { id: "ks-2-1", title: "Chuẩn bị giấy tờ", content: "Giấy báo tử, CCCD người chết và người đến khai báo." },
      { id: "ks-2-2", title: "Nộp hồ sơ tại UBND xã", content: "Đến bộ phận Tư pháp – Hộ tịch, nộp đầy đủ giấy tờ." },
      { id: "ks-2-3", title: "Nhận Giấy chứng tử", content: "Giấy chứng tử được cấp ngay trong ngày làm việc." },
    ],
    forms: [],
  },
  {
    id: "hn-1",
    slug: "dang-ky-ket-hon",
    group_id: "tu-phap",
    group_name: "Tư pháp - Hộ tịch",
    title: "Đăng ký kết hôn",
    summary: "Đăng ký kết hôn cho công dân Việt Nam thường trú tại xã.",
    processing_time: "Trong ngày làm việc",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Tư pháp, Hộ tịch",
    view_count: 1230,
    required_documents: "Tờ khai đăng ký kết hôn (2 người cùng ký); CCCD của cả hai; Giấy xác nhận tình trạng hôn nhân.",
    conditions_text: "Cả hai bên phải đến trực tiếp UBND xã để ký và xác nhận.",
    steps: [
      { id: "hn-1-1", title: "Hồ sơ cần có", content: "Tờ khai, CCCD của cả hai, Giấy xác nhận tình trạng hôn nhân." },
      { id: "hn-1-2", title: "Cả hai phải có mặt", content: "Cả hai vợ chồng phải đến trực tiếp UBND xã để ký và xác nhận." },
      { id: "hn-1-3", title: "Nhận Giấy đăng ký kết hôn", content: "Được trao Giấy đăng ký kết hôn ngay trong ngày làm việc." },
    ],
    forms: [{ id: "f2", title: "Tờ khai đăng ký kết hôn", file_type: "DOC", file_size: 38000 }],
  },
  {
    id: "dd-1",
    slug: "cap-giay-chung-nhan-qsdd",
    group_id: "dat-dai",
    group_name: "Đất đai - Xây dựng",
    title: "Cấp Giấy chứng nhận QSDĐ (Sổ đỏ)",
    summary: "Cấp Giấy chứng nhận quyền sử dụng đất lần đầu cho hộ gia đình, cá nhân.",
    processing_time: "15 - 30 ngày làm việc",
    fee: "Có lệ phí theo quy định của tỉnh",
    agency: "UBND xã Đăk Pxi / Văn phòng Đăng ký đất đai",
    view_count: 2750,
    required_documents: "Đơn xin cấp sổ đỏ; Bản đồ địa chính; CCCD; Sổ hộ khẩu; giấy tờ nguồn gốc đất.",
    conditions_text: "Đất không có tranh chấp, phù hợp quy hoạch sử dụng đất tại địa phương.",
    steps: [
      { id: "dd-1-1", title: "Hồ sơ cần có", content: "Đơn xin cấp sổ đỏ, bản đồ địa chính, CCCD, sổ hộ khẩu, giấy tờ nguồn gốc đất." },
      { id: "dd-1-2", title: "Nộp hồ sơ", content: "Nộp tại UBND xã hoặc Văn phòng Đăng ký đất đai." },
      { id: "dd-1-3", title: "Thẩm định & đo đạc", content: "Cán bộ địa chính xác minh thực địa, đo đạc diện tích." },
      { id: "dd-1-4", title: "Nhận Sổ đỏ", content: "Thời gian xử lý 15–30 ngày làm việc, có thu phí theo quy định." },
    ],
    forms: [{ id: "f3", title: "Đơn xin cấp Giấy chứng nhận QSDĐ", file_type: "PDF", file_size: 120000 }],
  },
  {
    id: "dd-2",
    slug: "cap-phep-xay-dung-nha-o",
    group_id: "dat-dai",
    group_name: "Đất đai - Xây dựng",
    title: "Cấp phép xây dựng nhà ở riêng lẻ",
    summary: "Xin cấp phép xây dựng nhà ở riêng lẻ tại khu vực nông thôn.",
    processing_time: "10 - 15 ngày làm việc",
    fee: "Có lệ phí",
    agency: "UBND xã Đăk Pxi",
    view_count: 860,
    required_documents: "Đơn xin cấp phép; Bản vẽ thiết kế; Giấy chứng nhận QSDĐ; CCCD.",
    conditions_text: "Diện tích xây dựng phù hợp quy hoạch, không lấn chiếm đất công.",
    steps: [
      { id: "dd-2-1", title: "Chuẩn bị hồ sơ", content: "Đơn xin cấp phép, bản vẽ thiết kế, giấy chứng nhận QSDĐ." },
      { id: "dd-2-2", title: "Nộp hồ sơ", content: "Nộp tại bộ phận Một cửa UBND xã." },
      { id: "dd-2-3", title: "Nhận giấy phép", content: "Nhận kết quả sau 10-15 ngày làm việc." },
    ],
    forms: [],
  },
  {
    id: "ht-1",
    slug: "xet-ho-ngheo",
    group_id: "xa-hoi",
    group_name: "Lao động - Xã hội",
    title: "Xét hộ nghèo / cận nghèo",
    summary: "Xét duyệt và cấp Sổ hộ nghèo, cận nghèo cho hộ gia đình khó khăn.",
    processing_time: "Theo kỳ rà soát hàng năm",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Văn hóa, Xã hội",
    view_count: 670,
    required_documents: "Đơn đề nghị xét duyệt hộ nghèo.",
    conditions_text: "Thu nhập bình quân đầu người dưới chuẩn nghèo theo quy định hiện hành.",
    steps: [
      { id: "ht-1-1", title: "Đề nghị xét duyệt", content: "Viết đơn hoặc gặp trực tiếp cán bộ văn hóa - xã hội." },
      { id: "ht-1-2", title: "Rà soát tại địa bàn", content: "Cán bộ đến nhà khảo sát điều kiện sống, thu nhập." },
      { id: "ht-1-3", title: "Họp xét duyệt", content: "Hội đồng xã họp xét duyệt, niêm yết công khai 5 ngày." },
      { id: "ht-1-4", title: "Nhận Sổ hộ nghèo", content: "Được cấp Sổ hộ nghèo và hưởng chính sách hỗ trợ." },
    ],
    forms: [],
  },
  {
    id: "ht-2",
    slug: "tro-cap-nguoi-khuyet-tat",
    group_id: "xa-hoi",
    group_name: "Lao động - Xã hội",
    title: "Trợ cấp người khuyết tật",
    summary: "Đăng ký hưởng trợ cấp xã hội hàng tháng cho người khuyết tật.",
    processing_time: "15 ngày làm việc",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Văn hóa, Xã hội",
    view_count: 540,
    required_documents: "Đơn đề nghị; Giấy xác nhận khuyết tật; CCCD; Sổ hộ khẩu.",
    conditions_text: "Có Giấy xác nhận mức độ khuyết tật do Hội đồng xét duyệt cấp.",
    steps: [
      { id: "ht-2-1", title: "Hồ sơ cần có", content: "Đơn đề nghị, giấy xác nhận khuyết tật, CCCD, sổ hộ khẩu." },
      { id: "ht-2-2", title: "Nộp hồ sơ", content: "Nộp tại bộ phận Văn hóa - Xã hội của UBND xã." },
      { id: "ht-2-3", title: "Nhận trợ cấp hàng tháng", content: "Sau khi được duyệt, nhận trợ cấp theo quy định." },
    ],
    forms: [],
  },
  {
    id: "nn-1",
    slug: "ho-tro-chuyen-doi-cay-trong",
    group_id: "nong-nghiep",
    group_name: "Nông nghiệp - Môi trường",
    title: "Hỗ trợ chuyển đổi cây trồng",
    summary: "Đăng ký nhận hỗ trợ giống, kỹ thuật khi chuyển đổi cây trồng kém hiệu quả.",
    processing_time: "20 ngày làm việc",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Nông nghiệp",
    view_count: 410,
    required_documents: "Đơn đăng ký; Giấy chứng nhận QSDĐ hoặc xác nhận đất canh tác.",
    conditions_text: "Diện tích đất nằm trong vùng quy hoạch chuyển đổi của xã.",
    steps: [
      { id: "nn-1-1", title: "Đăng ký nhu cầu", content: "Nộp đơn đăng ký tại bộ phận Nông nghiệp xã." },
      { id: "nn-1-2", title: "Khảo sát thực địa", content: "Cán bộ nông nghiệp khảo sát diện tích, loại đất." },
      { id: "nn-1-3", title: "Nhận hỗ trợ", content: "Nhận giống, vật tư và hướng dẫn kỹ thuật theo chương trình." },
    ],
    forms: [],
  },
  {
    id: "kt-1",
    slug: "vay-von-uu-dai-ho-ngheo",
    group_id: "kinh-te",
    group_name: "Kinh tế - Tài chính",
    title: "Vay vốn ưu đãi hộ nghèo",
    summary: "Hướng dẫn thủ tục vay vốn ưu đãi từ Ngân hàng Chính sách Xã hội.",
    processing_time: "10 - 20 ngày làm việc",
    fee: "Miễn phí thủ tục, lãi suất ưu đãi",
    agency: "UBND xã Đăk Pxi phối hợp Ngân hàng CSXH",
    view_count: 980,
    required_documents: "Đơn xin vay vốn; Sổ hộ nghèo/cận nghèo; CCCD.",
    conditions_text: "Thuộc danh sách hộ nghèo, cận nghèo hoặc đối tượng chính sách.",
    steps: [
      { id: "kt-1-1", title: "Lập hồ sơ vay vốn", content: "Viết đơn xin vay vốn kèm sổ hộ nghèo, CCCD." },
      { id: "kt-1-2", title: "Xác nhận của xã", content: "UBND xã xác nhận đối tượng được vay vốn ưu đãi." },
      { id: "kt-1-3", title: "Giải ngân", content: "Ngân hàng Chính sách Xã hội giải ngân theo lịch hẹn." },
    ],
    forms: [],
  },
  {
    id: "gd-1",
    slug: "cap-the-bhyt-ho-ngheo",
    group_id: "giao-duc",
    group_name: "Giáo dục - Y tế",
    title: "Cấp thẻ BHYT cho hộ nghèo",
    summary: "Cấp thẻ Bảo hiểm y tế miễn phí cho hộ nghèo, cận nghèo, trẻ em dưới 6 tuổi.",
    processing_time: "10 ngày làm việc",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi - Bộ phận Văn hóa, Xã hội",
    view_count: 1340,
    required_documents: "Danh sách hộ nghèo; CCCD; Giấy khai sinh (nếu là trẻ em).",
    conditions_text: "Thuộc danh sách hộ nghèo, cận nghèo hoặc trẻ em dưới 6 tuổi theo quy định.",
    steps: [
      { id: "gd-1-1", title: "Lập danh sách", content: "Cán bộ xã lập danh sách đối tượng được cấp thẻ." },
      { id: "gd-1-2", title: "Gửi cơ quan BHXH", content: "UBND xã gửi danh sách lên cơ quan Bảo hiểm xã hội huyện." },
      { id: "gd-1-3", title: "Nhận thẻ BHYT", content: "Thẻ BHYT được cấp và phát tại UBND xã." },
    ],
    forms: [],
  },
  {
    id: "gd-2",
    slug: "mien-giam-hoc-phi",
    group_id: "giao-duc",
    group_name: "Giáo dục - Y tế",
    title: "Miễn, giảm học phí",
    summary: "Xét miễn, giảm học phí cho học sinh thuộc hộ nghèo, cận nghèo, gia đình chính sách.",
    processing_time: "Theo năm học",
    fee: "Miễn phí",
    agency: "UBND xã Đăk Pxi phối hợp nhà trường",
    view_count: 590,
    required_documents: "Đơn xin miễn giảm học phí; Giấy xác nhận hộ nghèo/cận nghèo.",
    conditions_text: "Học sinh thuộc hộ nghèo, cận nghèo hoặc gia đình có công với cách mạng.",
    steps: [
      { id: "gd-2-1", title: "Nộp đơn tại trường", content: "Phụ huynh nộp đơn xin miễn giảm học phí tại trường." },
      { id: "gd-2-2", title: "Xác nhận của xã", content: "UBND xã xác nhận hộ nghèo, cận nghèo." },
      { id: "gd-2-3", title: "Quyết định miễn giảm", content: "Nhà trường ra quyết định miễn, giảm học phí." },
    ],
    forms: [],
  },
];

const USE_MOCK_FALLBACK = true;

/* ============================================================
   HELPERS
   ============================================================ */
function getCitizenSessionId() {
  const key = "dakpxi_tthc_session_id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, value);
  }
  return value;
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeDetail(payload) {
  return payload?.data || payload || null;
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildSpeakText(procedure) {
  const steps = procedure.steps || [];
  const forms = procedure.forms || [];
  const text = [
    `Thủ tục: ${procedure.title}.`,
    procedure.summary ? `Mô tả: ${procedure.summary}.` : "",
    procedure.processing_time ? `Thời gian giải quyết: ${procedure.processing_time}.` : "",
    procedure.fee ? `Lệ phí: ${procedure.fee}.` : "",
    procedure.agency ? `Cơ quan giải quyết: ${procedure.agency}.` : "",
    procedure.required_documents ? `Giấy tờ cần chuẩn bị: ${procedure.required_documents}.` : "",
    procedure.conditions_text ? `Điều kiện thực hiện: ${procedure.conditions_text}.` : "",
    steps.length
      ? `Quy trình thực hiện: ${steps.map((s, i) => `Bước ${i + 1}: ${s.title}. ${s.content}`).join(". ")}`
      : "",
    forms.length ? `Có ${forms.length} biểu mẫu có thể tải về.` : "",
  ];
  return text.filter(Boolean).join(" ");
}

/* Áp filter (lĩnh vực + từ khóa) + phân trang lên dữ liệu mock,
   để trải nghiệm giống hệt khi có API thật. */
function filterMockProcedures({ keyword, groupId, page, pageSize }) {
  let rows = MOCK_PROCEDURES;
  if (groupId) rows = rows.filter((p) => p.group_id === groupId);
  if (keyword) {
    const q = keyword.toLowerCase();
    rows = rows.filter(
      (p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    );
  }
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);
  return { rows: pageRows, total };
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */
function EmptyState({ title, description }) {
  return (
    <div className="tthc-empty">
      <div className="tthc-empty-icon">i</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function FieldFilterBar({ groups, activeId, counts, onSelect }) {
  return (
    <div className="tthc-filter-bar" role="tablist" aria-label="Lọc theo lĩnh vực">
      <button
        type="button"
        role="tab"
        aria-selected={!activeId}
        className={`tthc-filter-chip ${!activeId ? "is-active" : ""}`}
        onClick={() => onSelect("")}
      >
        Tất cả lĩnh vực
        <span className="tthc-filter-count">{counts.all}</span>
      </button>
      {groups.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={activeId === f.id}
          className={`tthc-filter-chip ${activeId === f.id ? "is-active" : ""}`}
          onClick={() => onSelect(f.id)}
        >
          <span className="tthc-filter-chip-icon">{f.icon}</span>
          {f.name}
          <span className="tthc-filter-count">{counts[f.id] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

function ProcedureCard({ item, onOpen }) {
  return (
    <button className="tthc-procedure-card" type="button" onClick={() => onOpen(item)}>
      <div className="tthc-card-top">
        <span className="tthc-group-pill">{item.group_name || item.groupName || "Thủ tục"}</span>
        <span className="tthc-view-count">{Number(item.view_count || 0).toLocaleString("vi-VN")} lượt xem</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary || "Xem hướng dẫn, giấy tờ cần chuẩn bị và biểu mẫu liên quan."}</p>
      <div className="tthc-card-meta">
        <span>Thời gian: {item.processing_time || "Theo quy định"}</span>
        <span>Lệ phí: {item.fee || "Liên hệ cán bộ"}</span>
      </div>
      <span className="tthc-card-action">Xem hướng dẫn</span>
    </button>
  );
}

function StepGuide({ procedure, sessionId }) {
  const [progress, setProgress] = useState({});
  const steps = procedure.steps || [];

  useEffect(() => {
    if (!procedure.id || !sessionId) return;
    api
      .get(`/progress/${sessionId}/${procedure.id}`)
      .then((res) => {
        const rows = normalizeList(res.data);
        const next = {};
        rows.forEach((row) => {
          next[row.step_id || row.stepId] = Boolean(row.is_completed || row.isCompleted);
        });
        setProgress(next);
      })
      .catch(() => setProgress({}));
  }, [procedure.id, sessionId]);

  async function toggleStep(step) {
    const nextValue = !progress[step.id];
    setProgress((prev) => ({ ...prev, [step.id]: nextValue }));
    try {
      await api.put(`/progress/${sessionId}/steps/${step.id}`, {
        procedureId: procedure.id,
        isCompleted: nextValue,
      });
    } catch {
      // Không có backend (hoặc lỗi mạng) — vẫn giữ trạng thái đã đánh dấu
      // ở phía client để người dùng không bị mất tiến trình đang xem.
    }
  }

  const completed = steps.filter((s) => progress[s.id]).length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <section className="tthc-detail-section">
      <div className="tthc-section-heading">
        <h3>Hướng dẫn từng bước</h3>
        <span>{percent}% hoàn thành</span>
      </div>
      <div className="tthc-progress-track">
        <div className="tthc-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="tthc-steps">
        {steps.map((step, index) => {
          const checked = Boolean(progress[step.id]);
          return (
            <div className={`tthc-step ${checked ? "is-done" : ""}`} key={step.id || index}>
              <button
                className="tthc-step-check"
                type="button"
                onClick={() => toggleStep(step)}
                aria-label={checked ? "Bỏ đánh dấu hoàn thành" : "Đánh dấu hoàn thành"}
              >
                {checked ? "✓" : index + 1}
              </button>
              <div>
                <h4>{step.title || `Bước ${index + 1}`}</h4>
                <p>{step.content || step.detail}</p>
                {step.note && <small>{step.note}</small>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FormDownloadList({ forms = [] }) {
  if (!forms.length) {
    return (
      <section className="tthc-detail-section">
        <h3>Biểu mẫu</h3>
        <p className="tthc-muted">Thủ tục này chưa có biểu mẫu tải về.</p>
      </section>
    );
  }
  return (
    <section className="tthc-detail-section">
      <h3>Biểu mẫu tải về</h3>
      <div className="tthc-forms">
        {forms.map((form) => (
          <a
            className="tthc-form-item"
            href={`${API_BASE_URL}/forms/${form.id}/download`}
            key={form.id}
            rel="noreferrer"
          >
            <span className="tthc-file-type">{form.file_type || form.fileType}</span>
            <span>
              <strong>{form.title}</strong>
              <small>{formatFileSize(form.file_size || form.fileSize)}</small>
            </span>
            <b>Tải về</b>
          </a>
        ))}
      </div>
    </section>
  );
}

function QuestionBox({ procedureId }) {
  const [form, setForm] = useState({ fullName: "", phone: "", question: "" });
  const [status, setStatus] = useState("");

  async function submitQuestion(event) {
    event.preventDefault();
    setStatus("Đang gửi câu hỏi...");
    try {
      await api.post("/questions", {
        procedureId,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        question: form.question.trim(),
      });
      setForm({ fullName: "", phone: "", question: "" });
      setStatus("Đã gửi câu hỏi. Cán bộ sẽ phản hồi sớm.");
    } catch {
      setStatus(
        USE_MOCK_FALLBACK
          ? "Chưa kết nối máy chủ — câu hỏi mẫu này sẽ không được lưu thật."
          : "Chưa gửi được câu hỏi. Vui lòng thử lại hoặc liên hệ Bộ phận Một cửa."
      );
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Hỏi đáp thủ tục</h3>
      <form className="tthc-question-form" onSubmit={submitQuestion}>
        <div className="tthc-form-grid">
          <label>
            Họ tên
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </label>
        </div>
        <label>
          Nội dung câu hỏi
          <textarea
            required
            rows={4}
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
          />
        </label>
        <button className="tthc-primary-btn" type="submit">
          Gửi câu hỏi
        </button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

function RatingBox({ procedureId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  async function submitRating(event) {
    event.preventDefault();
    setStatus("Đang gửi đánh giá...");
    try {
      await api.post("/reviews", { procedureId, rating, comment: comment.trim() });
      setComment("");
      setStatus("Cảm ơn bà con đã góp ý.");
    } catch {
      setStatus(
        USE_MOCK_FALLBACK
          ? "Chưa kết nối máy chủ — đánh giá mẫu này sẽ không được lưu thật."
          : "Chưa gửi được đánh giá. Vui lòng thử lại sau."
      );
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Đánh giá hướng dẫn</h3>
      <form className="tthc-rating-box" onSubmit={submitRating}>
        <div className="tthc-stars" aria-label="Chọn số sao">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              className={star <= rating ? "is-active" : ""}
              key={star}
              type="button"
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          placeholder="Góp ý để UBND xã hướng dẫn rõ hơn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="tthc-secondary-btn" type="submit">
          Gửi đánh giá
        </button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

function ProcedureDetailModal({ procedure, onClose, sessionId }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSpeak() {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(buildSpeakText(procedure));
    utterance.lang = "vi-VN";
    utterance.rate = 0.88;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function close() {
    window.speechSynthesis?.cancel();
    onClose();
  }

  return (
    <div className="tthc-modal-overlay" onClick={close}>
      <article className="tthc-modal" onClick={(e) => e.stopPropagation()}>
        <header className="tthc-modal-header">
          <div>
            <span className="tthc-group-pill">{procedure.group_name || "Thủ tục hành chính"}</span>
            <h2>{procedure.title}</h2>
            <p>{procedure.summary || procedure.description}</p>
          </div>
          <div className="tthc-modal-actions">
            <button className="tthc-speak-btn" type="button" onClick={toggleSpeak}>
              {isSpeaking ? "Dừng đọc" : "Đọc bằng giọng nói"}
            </button>
            <button className="tthc-close-btn" type="button" onClick={close} aria-label="Đóng">
              ×
            </button>
          </div>
        </header>
        <div className="tthc-modal-body">
          <div className="tthc-info-grid">
            <div>
              <span>Thời gian</span>
              <strong>{procedure.processing_time || "Theo quy định"}</strong>
            </div>
            <div>
              <span>Lệ phí</span>
              <strong>{procedure.fee || "Liên hệ cán bộ"}</strong>
            </div>
            <div>
              <span>Cơ quan giải quyết</span>
              <strong>{procedure.agency || "UBND xã Đăk Pxi"}</strong>
            </div>
          </div>
          {procedure.required_documents && (
            <section className="tthc-detail-section">
              <h3>Giấy tờ cần chuẩn bị</h3>
              <div className="tthc-rich-text">{procedure.required_documents}</div>
            </section>
          )}
          {procedure.conditions_text && (
            <section className="tthc-detail-section">
              <h3>Điều kiện thực hiện</h3>
              <div className="tthc-rich-text">{procedure.conditions_text}</div>
            </section>
          )}
          {(procedure.steps || []).length > 0 && (
            <StepGuide procedure={procedure} sessionId={sessionId} />
          )}
          {procedure.video_url && (
            <section className="tthc-detail-section">
              <h3>Video hướng dẫn</h3>
              <a className="tthc-video-link" href={procedure.video_url} target="_blank" rel="noreferrer">
                Mở video hướng dẫn
              </a>
            </section>
          )}
          <FormDownloadList forms={procedure.forms || []} />
          <QuestionBox procedureId={procedure.id} />
          <RatingBox procedureId={procedure.id} />
        </div>
      </article>
    </div>
  );
}

/* ============================================================
   ROOT COMPONENT
   ============================================================ */
export default function Thutuchanhchinh() {
  const [procedures, setProcedures] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [groupCounts, setGroupCounts] = useState({});
  const [keyword, setKeyword] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [error, setError] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const searchTimer = useRef(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const sessionId = useMemo(getCitizenSessionId, []);

  // Debounce ô tìm kiếm
  useEffect(() => {
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(searchTimer.current);
  }, [keyword]);

  // Tải danh sách: thử API thật trước, lỗi thì rơi về mock data
  // (chỉ khi USE_MOCK_FALLBACK = true) để luôn có giao diện xem trước.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get("/procedures", {
        params: {
          keyword: debouncedKeyword || undefined,
          groupId: groupId || undefined,
          page,
          limit: PAGE_SIZE,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const rows = normalizeList(res.data);
        setProcedures(rows);
        setTotalCount(res.data?.total ?? rows.length);
        setUsingMock(false);
      })
      .catch(() => {
        if (cancelled) return;
        if (!USE_MOCK_FALLBACK) {
          setProcedures([]);
          setError("Không tải được dữ liệu thủ tục. Vui lòng kiểm tra kết nối máy chủ.");
          return;
        }
        const { rows, total } = filterMockProcedures({
          keyword: debouncedKeyword,
          groupId,
          page,
          pageSize: PAGE_SIZE,
        });
        setProcedures(rows);
        setTotalCount(total);
        setUsingMock(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedKeyword, groupId, page]);

  // Đếm số thủ tục theo từng lĩnh vực cho thanh filter (dựa trên
  // mock khi đang ở chế độ mock; khi có API thật nên trả sẵn count
  // từ /procedure-groups — phần này vẫn hoạt động tốt với mock).
  useEffect(() => {
    api
      .get("/procedure-groups")
      .then((res) => {
        const serverGroups = normalizeList(res.data);
        const counts = { all: 0 };
        serverGroups.forEach((g) => {
          counts[g.id] = g.procedure_count ?? 0;
          counts.all += counts[g.id];
        });
        setGroupCounts(counts);
      })
      .catch(() => {
        const counts = { all: MOCK_PROCEDURES.length };
        FIELD_GROUPS.forEach((f) => {
          counts[f.id] = MOCK_PROCEDURES.filter((p) => p.group_id === f.id).length;
        });
        setGroupCounts(counts);
      });
  }, []);

  async function openProcedure(item) {
    const slugOrId = item.slug || item.id;
    setDetailLoading(true);
    try {
      const res = await api.get(`/procedures/${slugOrId}`);
      setSelectedProcedure(normalizeDetail(res.data));
    } catch {
      if (USE_MOCK_FALLBACK) {
        // Item đến từ mock data đã có đầy đủ chi tiết, dùng trực tiếp.
        setSelectedProcedure(item);
      } else {
        setError("Không mở được chi tiết thủ tục. Vui lòng thử lại.");
      }
    } finally {
      setDetailLoading(false);
    }
  }

  function handleSelectGroup(id) {
    setGroupId(id);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const activeFieldMeta = FIELD_GROUPS.find((f) => f.id === groupId);

  return (
    <div className="tthc-root">
      <header className="tthc-hero">
        <div className="tthc-hero-inner">
          <div>
            <span className="tthc-kicker">UBND xã Đăk Pxi</span>
            <h1>Thủ tục hành chính</h1>
            <p>
              Toàn bộ thủ tục hành chính của xã trong một danh sách — tìm kiếm, lọc theo lĩnh vực,
              xem hướng dẫn từng bước rõ ràng.
            </p>
          </div>
          <div className="tthc-help-card">
            <strong>Bộ phận Một cửa</strong>
            <span>Thứ 2 - Thứ 6</span>
            <b>7:30 - 11:30 và 13:30 - 17:00</b>
          </div>
        </div>
      </header>

      <main className="tthc-main">
        <section className="tthc-search-panel">
          <label className="tthc-search-label" htmlFor="procedure-search">
            Tìm kiếm thủ tục
          </label>
          <div className="tthc-search-row">
            <input
              id="procedure-search"
              value={keyword}
              placeholder="Nhập từ khóa, ví dụ: khai sinh, sổ đỏ, hộ nghèo..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button type="button" onClick={() => setKeyword("")}>
                Xóa
              </button>
            )}
          </div>
        </section>

        <FieldFilterBar
          groups={FIELD_GROUPS}
          activeId={groupId}
          counts={groupCounts}
          onSelect={handleSelectGroup}
        />

        {usingMock && (
          <div className="tthc-mock-banner">
            Đang hiển thị dữ liệu mẫu để xem trước giao diện — chưa kết nối được máy chủ thật.
          </div>
        )}
        {error && <div className="tthc-alert">{error}</div>}
        {detailLoading && <div className="tthc-alert">Đang mở chi tiết...</div>}

        <section className="tthc-results">
          <div className="tthc-results-heading">
            <h2>{activeFieldMeta ? activeFieldMeta.name : "Tất cả thủ tục"}</h2>
            <span>{totalCount} kết quả</span>
          </div>
          {loading ? (
            <div className="tthc-loading-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="tthc-skeleton" key={i} />
              ))}
            </div>
          ) : procedures.length ? (
            <div className="tthc-grid">
              {procedures.map((item) => (
                <ProcedureCard item={item} key={item.id} onOpen={openProcedure} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa tìm thấy thủ tục"
              description="Thử từ khóa khác hoặc chọn lại lĩnh vực ở thanh lọc phía trên."
            />
          )}

          {totalPages > 1 && (
            <div className="tthc-pagination">
              <button disabled={page <= 1} type="button" onClick={() => setPage((p) => p - 1)}>
                Trang trước
              </button>
              <span>
                Trang {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                type="button"
                onClick={() => setPage((p) => p + 1)}
              >
                Trang sau
              </button>
            </div>
          )}
        </section>
      </main>

      {selectedProcedure && (
        <ProcedureDetailModal
          procedure={selectedProcedure}
          sessionId={sessionId}
          onClose={() => setSelectedProcedure(null)}
        />
      )}
    </div>
  );
}