// File: src/services/insuranceService.js
import axios from 'axios';

// Định nghĩa base URL của backend
const API_URL = 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/bai-viet';

export const getInsuranceByCode = async (code) => {
  // Hàm này gọi API tra cứu của backend
  const response = await axios.get(`${API_URL}/search?code=${code}`);
  return response.data;
};