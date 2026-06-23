import { createContext, useContext, useState, useEffect } from 'react';

const FontSizeContext = createContext();

const SCALES = [1, 1.2, 1.45, 1.7, 2.0];
const DEFAULT_INDEX = 0;

export function FontSizeProvider({ children }) {
  const [sizeIndex, setSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex');
    return saved !== null ? Number(saved) : DEFAULT_INDEX;
  });

  useEffect(() => {
    document.body.style.zoom = SCALES[sizeIndex];
    localStorage.setItem('fontSizeIndex', sizeIndex);
  }, [sizeIndex]);

  const increase = () => setSizeIndex(i => Math.min(i + 1, SCALES.length - 1));
  const decrease = () => setSizeIndex(i => Math.max(i - 1, 0));

  return (
    <FontSizeContext.Provider value={{ sizeIndex, increase, decrease, max: SCALES.length - 1 }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);