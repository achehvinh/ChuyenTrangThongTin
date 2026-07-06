import { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

// Cỡ chữ gốc tính bằng px — chỉ chữ to ra, layout giữ nguyên
const SIZES = [14, 16, 18, 20, 22];
const SIZE_LABELS = ['Nhỏ', 'Vừa', 'Lớn', 'Rất lớn', 'To nhất'];
const DEFAULT_INDEX = 1; // mặc định 16px

export function FontSizeProvider({ children }) {
  const [sizeIndex, setSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex');
    return saved !== null ? Number(saved) : DEFAULT_INDEX;
  });

  useEffect(() => {
    // Chỉ thay đổi font-size gốc — KHÔNG zoom layout
    document.documentElement.style.fontSize = SIZES[sizeIndex] + 'px';
    localStorage.setItem('fontSizeIndex', sizeIndex);
  }, [sizeIndex]);

  const increase = () => setSizeIndex(i => Math.min(i + 1, SIZES.length - 1));
  const decrease = () => setSizeIndex(i => Math.max(i - 1, 0));

  return (
    <FontSizeContext.Provider value={{
      sizeIndex,
      increase,
      decrease,
      max: SIZES.length - 1,
      currentSize: SIZES[sizeIndex],
      currentLabel: SIZE_LABELS[sizeIndex],
    }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);