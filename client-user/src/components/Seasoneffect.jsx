import { useEffect, useRef } from 'react';
import './Seasoneffect.css';

const LEAF_SVGS = [
  `<svg width="28" height="14" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 7 Q7 1 14 2 Q21 1 27 7 Q21 13 14 12 Q7 13 1 7Z" fill="#5a9e30" opacity="0.85"/><line x1="14" y1="2" x2="14" y2="12" stroke="#3d7a1e" stroke-width="0.8"/></svg>`,
  `<svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5 Q5.5 1 11 1.5 Q16.5 1 21 5 Q16.5 9 11 8.5 Q5.5 9 1 5Z" fill="#7bc44a" opacity="0.8"/><line x1="11" y1="1.5" x2="11" y2="8.5" stroke="#4e8a28" stroke-width="0.7"/></svg>`,
  `<svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6 Q8 1 16 2 Q24 1 31 6 Q24 11 16 10 Q8 11 1 6Z" fill="#4a8e25" opacity="0.75"/><line x1="16" y1="2" x2="16" y2="10" stroke="#2f6015" stroke-width="0.9"/></svg>`,
  `<svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4 Q5 1 10 1.5 Q15 1 19 4 Q15 7 10 6.5 Q5 7 1 4Z" fill="#6db840" opacity="0.9"/><line x1="10" y1="1.5" x2="10" y2="6.5" stroke="#3e7522" stroke-width="0.6"/></svg>`,
  `<svg width="26" height="11" viewBox="0 0 26 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5.5 Q6.5 1 13 1.5 Q19.5 1 25 5.5 Q19.5 10 13 9.5 Q6.5 10 1 5.5Z" fill="#88cc55" opacity="0.7"/><line x1="13" y1="1.5" x2="13" y2="9.5" stroke="#558833" stroke-width="0.7"/></svg>`,
];

const LEAF_COUNT = 30;

function createLeafEl() {
  const el = document.createElement('div');
  el.className = 'bamboo-leaf';
  el.innerHTML = LEAF_SVGS[Math.floor(Math.random() * LEAF_SVGS.length)];

  const left     = Math.random() * 96;
  const duration = 7 + Math.random() * 6;
  const delay    = Math.random() * -duration;
  const drift    = Math.random() * 120 - 60;
  const rot      = Math.random() * 540 - 270;
  const scale    = 0.7 + Math.random() * 0.8;

  el.style.cssText = `
    left: ${left}%;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    --drift: ${drift}px;
    --rot: ${rot}deg;
    transform: scale(${scale});
    filter: drop-shadow(1px 2px 2px rgba(0,0,0,0.12));
  `;
  return el;
}

export default function Seasoneffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < LEAF_COUNT; i++) {
      canvas.appendChild(createLeafEl());
    }

    return () => {
      canvas.innerHTML = '';
    };
  }, []);

  return (
    <div ref={canvasRef} className="bamboo-canvas" aria-hidden="true" />
  );
}