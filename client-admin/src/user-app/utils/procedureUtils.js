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

export function filterMockProcedures({ keyword, groupId, page, pageSize }) {
  let rows = MOCK_PROCEDURES;
  if (groupId) rows = rows.filter((p) => p.group_id === groupId || p.fieldGroup === groupId);
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
    MOCK_PROCEDURES.find((p) => p.slug === slugOrId || p.id === slugOrId || p.code === slugOrId) || null
  );
}