// Utility for dynamic API URL configuration based on current host environment.
// This allows local network (mobile/LAN testing), localhost, and production deployments to work seamlessly.

export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== "undefined" && window.location) {
    const { hostname, protocol } = window.location;
    if (protocol === "https:" || hostname.endsWith("vercel.app")) {
      return "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";
    }
    return `http://${hostname}:5000/api/v1`;
  }

  return "http://localhost:5000/api/v1";
};

export const getBackendServerUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, "");
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, "");
  }

  if (typeof window !== "undefined" && window.location) {
    const { hostname, protocol } = window.location;
    if (protocol === "https:" || hostname.endsWith("vercel.app")) {
      return "https://chuyen-trang-thong-tin-6os5.vercel.app";
    }
    return `http://${hostname}:5000`;
  }

  return "http://localhost:5000";
};

export const API_URL = getApiUrl();
