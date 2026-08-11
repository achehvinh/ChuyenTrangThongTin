import axios from "axios";
import { DAK_PXI_PROCEDURES_2026, FIELD_GROUPS as DAK_PXI_FIELD_GROUPS } from "./dakpxi_procedures_2026";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/bai-viet";

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

export const USE_MOCK_FALLBACK = true;

export const FIELD_GROUPS = DAK_PXI_FIELD_GROUPS;

export const PAGE_SIZE = 9;

export const MOCK_PROCEDURES = DAK_PXI_PROCEDURES_2026;


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

export function getCatalogProcedures() {
  try {
    const saved = localStorage.getItem("DAK_PXI_TTHC_CATALOG");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const savedMap = new Map();
        parsed.forEach(p => {
          const key = p.code || p.id;
          if (key) savedMap.set(String(key).toLowerCase(), p);
        });

        const merged = DAK_PXI_PROCEDURES_2026.map(m => {
          const key = (m.code || m.id).toLowerCase();
          const custom = savedMap.get(key);
          if (!custom) return m;
          return {
            ...m,
            title: custom.title || custom.name || m.title,
            guideLink: custom.guideLink || custom.link_dich_vu_cong || m.guideLink,
            link_dich_vu_cong: custom.link_dich_vu_cong || custom.guideLink || m.guideLink,
            agency: custom.agency || m.agency,
            processing_time: custom.duration || custom.processing_time || m.processing_time,
            fee: custom.fee || m.fee,
            summary: custom.detailText || custom.summary || m.summary,
            online_type: custom.online_type || custom.type || m.online_type
          };
        });

        const existingKeys = new Set(DAK_PXI_PROCEDURES_2026.map(m => (m.code || m.id).toLowerCase()));
        parsed.forEach(p => {
          const key = (p.code || p.id || '').toLowerCase();
          if (key && !existingKeys.has(key)) {
            merged.push({
              id: p.id || `custom-${p.code}`,
              stt: p.stt || merged.length + 1,
              code: p.code,
              slug: (p.code || `tthc-${p.id}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              group_id: p.group_id || p.fieldGroup || "linh-vuc-khac",
              group_name: p.group_name || p.fieldGroup || "Bộ phận Một cửa",
              title: p.name || p.title,
              online_type: p.online_type || p.type || "toan-trinh",
              summary: p.detailText || p.summary || `Thủ tục ${p.name || p.title}.`,
              processing_time: p.duration || p.processing_time || "Theo quy định",
              fee: p.fee || "Theo quy định",
              agency: p.agency || "Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)",
              guideLink: p.guideLink || p.link_dich_vu_cong || `https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-nganh.html?ma_thu_tuc=${encodeURIComponent(p.code || '')}`,
              view_count: p.view_count || 1500
            });
          }
        });

        return merged;
      }
    }
  } catch (e) {}
  return DAK_PXI_PROCEDURES_2026;
}

export function filterMockProcedures({ keyword, groupId, page, pageSize }) {
  let rows = getCatalogProcedures();
  if (groupId) {
    rows = rows.filter((p) => p.group_id === groupId || p.fieldGroup === groupId || p.group === groupId);
  }
  if (keyword) {
    const q = keyword.toLowerCase();
    rows = rows.filter(
      (p) => (p.title && p.title.toLowerCase().includes(q)) ||
             (p.name && p.name.toLowerCase().includes(q)) ||
             (p.code && p.code.toLowerCase().includes(q)) ||
             (p.summary && p.summary.toLowerCase().includes(q))
    );
  }
  const total = rows.length;
  return { rows: rows.slice((page - 1) * pageSize, page * pageSize), total };
}

export function findMockProcedureBySlug(slugOrId) {
  const catalog = getCatalogProcedures();
  const q = String(slugOrId).toLowerCase();
  return (
    catalog.find((p) => p.slug === q || String(p.id).toLowerCase() === q || String(p.code).toLowerCase() === q) ||
    MOCK_PROCEDURES.find((p) => p.slug === q || String(p.id).toLowerCase() === q || String(p.code).toLowerCase() === q) || null
  );
}