import axios from "axios";

const api = axios.create({
  baseURL: "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/bai-viet",
});

export default api;