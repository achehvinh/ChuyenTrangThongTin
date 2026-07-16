import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Đồng bộ trạng thái ngôn ngữ từ cookie của Google Translate
  const [lang, setLang] = useState(() => {
    try {
      const match = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
      if (match && match[2].includes('/en')) {
        return 'xd'; // 'xd' ở đây được dùng đại diện cho Tiếng Anh ('en') để tương thích với hệ thống dịch cũ
      }
    } catch (e) {
      console.error('Lỗi đọc cookie ngôn ngữ:', e);
    }
    return 'vi';
  });

  const toggleLang = () => {
    const nextLang = lang === 'vi' ? 'xd' : 'vi';
    setLang(nextLang);

    if (nextLang === 'xd') {
      // Thiết lập cookie dịch sang Tiếng Anh
      document.cookie = "googtrans=/vi/en; path=/";
      document.cookie = "googtrans=/vi/en; path=/; domain=" + window.location.hostname;
      document.cookie = "googtrans=/vi/en; path=/; domain=localhost";
    } else {
      // Xóa cookie dịch, đưa về Tiếng Việt mặc định
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost";
    }
    
    // Tải lại trang để kích hoạt thay đổi ngôn ngữ ngay lập tức
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}