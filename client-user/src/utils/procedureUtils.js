import axios from "axios";
import { DAK_PXI_PROCEDURES_2026, FIELD_GROUPS as DAK_PXI_FIELD_GROUPS } from "./dakpxi_procedures_2026";
import { getApiUrl } from "./apiConfig";

export const API_BASE_URL = getApiUrl();
export const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

export const USE_MOCK_FALLBACK = true;
export const FIELD_GROUPS = DAK_PXI_FIELD_GROUPS;
export const PAGE_SIZE = 9;
export const MOCK_PROCEDURES = DAK_PXI_PROCEDURES_2026;

let inMemoryCatalogCache = null;

// Tải danh mục vĩnh viễn từ MongoDB Backend Server
export async function fetchCatalogFromBackend() {
  try {
    const res = await axios.get(`${getApiUrl()}/tthc-catalog`);
    if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length >= 417) {
      inMemoryCatalogCache = res.data.data;
      try {
        localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(res.data.data));
      } catch {}
      return res.data.data;
    }
  } catch (err) {
    console.warn("Chưa thể kết nối API TTHC MongoDB backend, sử dụng cache local:", err.message);
  }
  return null;
}

// Nạp tự động dữ liệu khi ứng dụng khởi chạy
fetchCatalogFromBackend();

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
  if (Array.isArray(inMemoryCatalogCache) && inMemoryCatalogCache.length >= 417) {
    const p271 = inMemoryCatalogCache.find((p) => p.stt === 271);
    if (p271 && p271.code === "1.014259.01") {
      return inMemoryCatalogCache;
    }
  }
  try {
    const saved = localStorage.getItem("DAK_PXI_TTHC_CATALOG");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 417) {
        const p271 = parsed.find((p) => p.stt === 271);
        if (p271 && p271.code === "1.014259.01") {
          return parsed;
        }
      }
    }
  } catch (e) {}
  localStorage.removeItem("DAK_PXI_TTHC_CATALOG");
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