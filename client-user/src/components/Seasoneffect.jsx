import { useEffect, useRef, useState } from 'react';
import './Seasoneffect.css';

// Tự động chọn hiệu ứng theo tháng
function getSeason() {
  const month = new Date().getMonth() + 1;
  if (month === 1 || month === 2) return 'tet';        // Tháng 1-2: Tết - pháo hoa + đào
  if (month === 3 || month === 4) return 'spring';     // Tháng 3-4: Xuân - lá hoa rơi
  if (month === 5 || month === 6) return 'summer';     // Tháng 5-6: Hè - bướm bay
  if (month === 7 || month === 8) return 'rain';       // Tháng 7-8: Mưa - giọt mưa
  if (month === 9 || month === 10) return 'mooncake';  // Tháng 9-10: Trung thu - lân + sao
  if (month === 11 || month === 12) return 'snow';     // Tháng 11-12: Đông - tuyết
  return 'spring';
}

const SEASON_CONFIG = {
  tet: {
    label: '🎆 Chúc mừng năm mới!',
    color: '#dc2626',
    particles: ['🌸', '🧧', '🎆', '✨', '🌺', '🎇', '💫'],
    count: 25,
    speed: 3,
  },
  spring: {
    label: '🌸 Mùa xuân tươi đẹp!',
    color: '#db2777',
    particles: ['🌸', '🌺', '🍀', '🦋', '🌼', '🌷', '💐'],
    count: 30,
    speed: 2.5,
  },
  summer: {
    label: '☀️ Mùa hè rực rỡ!',
    color: '#f59e0b',
    particles: ['🦋', '🌻', '⭐', '✨', '🌈', '🌟', '💛'],
    count: 20,
    speed: 2,
  },
  rain: {
    label: '🌧️ Mùa mưa Tây Nguyên',
    color: '#0891b2',
    particles: ['💧', '🌿', '🍃', '💦', '🌱', '🌧️', '🍀'],
    count: 35,
    speed: 4,
  },
  mooncake: {
    label: '🏮 Chúc mừng Tết Trung thu!',
    color: '#d97706',
    particles: ['🏮', '⭐', '🌟', '✨', '🌙', '💫', '🌠'],
    count: 25,
    speed: 2,
  },
  snow: {
    label: '❄️ Mùa đông an lành!',
    color: '#0891b2',
    particles: ['❄️', '⛄', '✨', '💫', '🌨️', '⭐', '🌟'],
    count: 30,
    speed: 2,
  },
};

function Particle({ emoji, style }) {
  return (
    <div className="season-particle" style={style}>
      {emoji}
    </div>
  );
}

export default function Seasoneffect() {
  const season = getSeason();
  const config = SEASON_CONFIG[season];
  const [particles, setParticles] = useState([]);
  const [showBanner, setShowBanner] = useState(true);
  const [showLan, setShowLan] = useState(season === 'mooncake');
  const idRef = useRef(0);

  useEffect(() => {
    const initial = Array.from({ length: config.count }, (_, i) => ({
      id: i,
      emoji: config.particles[Math.floor(Math.random() * config.particles.length)],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 16 + Math.random() * 20,
      swing: Math.random() * 60 - 30,
    }));
    setParticles(initial);

    const interval = setInterval(() => {
      idRef.current += 1;
      setParticles(prev => [
        ...prev.slice(-config.count),
        {
          id: Date.now(),
          emoji: config.particles[Math.floor(Math.random() * config.particles.length)],
          left: Math.random() * 100,
          delay: 0,
          duration: 6 + Math.random() * 6,
          size: 16 + Math.random() * 20,
          swing: Math.random() * 60 - 30,
        }
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [season]);

  // Ẩn banner sau 5 giây
  useEffect(() => {
    if (!showBanner) return;
    const t = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Particles rơi */}
      <div className="season-canvas">
        {particles.map(p => (
          <Particle
            key={p.id}
            emoji={p.emoji}
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--swing': `${p.swing}px`,
            }}
          />
        ))}
      </div>

      {/* Banner chào mùa */}
      {showBanner && (
        <div className="season-banner" style={{ background: config.color }}>
          <span className="season-banner-text">{config.label}</span>
          <button className="season-banner-close" onClick={() => setShowBanner(false)}>✕</button>
        </div>
      )}

      {/* Lân múa (chỉ Trung thu) */}
      {showLan && (
        <div className="lan-wrapper" onClick={() => setShowLan(false)} title="Bấm để ẩn lân">
          <div className="lan-body">
            <div className="lan-head">🦁</div>
            <div className="lan-tail">🎊</div>
            <div className="lan-label">Chúc Trung thu vui vẻ!</div>
          </div>
        </div>
      )}
    </>
  );
}