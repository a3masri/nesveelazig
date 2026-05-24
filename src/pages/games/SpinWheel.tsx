import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { awardPoints, canPlayDaily, getDailyPlayCount, incrementDailyPlay } from '../../lib/gameRewards';
import { playTap, playWin } from '../../lib/sounds';

const SEGMENTS = [
  { label: '10', value: 10, color: '#4CAF50' },
  { label: '25', value: 25, color: '#2C5F8A' },
  { label: '5', value: 5, color: '#8D6E63' },
  { label: '50', value: 50, color: '#FFD700' },
  { label: '15', value: 15, color: '#7B1FA2' },
  { label: '↺', value: 0, color: '#607D8B' },
  { label: '30', value: 30, color: '#FF6B35' },
  { label: '100', value: 100, color: '#E53935' },
];

const GAME_ID = 'spin-wheel';
const MAX_DAILY = 5;

export default function SpinWheel() {
  const { profile, setProfile } = useProfile();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose' | 'info'; message: string } | null>(null);

  const playsLeft = MAX_DAILY - getDailyPlayCount(GAME_ID);

  const spin = () => {
    if (spinning || !canPlayDaily(GAME_ID, MAX_DAILY)) return;
    playTap();
    incrementDailyPlay(GAME_ID, MAX_DAILY);
    setSpinning(true);
    setResult(null);
    const idx = Math.floor(Math.random() * SEGMENTS.length);
    const seg = SEGMENTS[idx];
    const segAngle = 360 / SEGMENTS.length;
    const target = 360 * 5 + (360 - idx * segAngle - segAngle / 2);
    setRotation(r => r + target);

    setTimeout(() => {
      setSpinning(false);
      if (seg.value > 0 && profile) {
        awardPoints(profile, setProfile, seg.value);
        playWin();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
        setResult({ type: 'win', message: `+${seg.value} kupa kazandın!` });
      } else {
        setResult({ type: 'info', message: 'Bir tur daha — şansını tekrar dene!' });
      }
    }, 4200);
  };

  return (
    <GameLayout
      title="🎡 Çarkıfelek"
      subtitle={`Günde ${MAX_DAILY} çevirme · ${playsLeft} kaldı`}
      confetti={confetti}
      result={result}
    >
      <div className="relative w-[min(100%,288px)] aspect-square mx-auto mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-cr-gold" />
        <div
          className="w-full h-full rounded-full border-4 border-cr-gold overflow-hidden transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)`, boxShadow: 'var(--shadow-hover)' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {SEGMENTS.map((s, i) => {
              const a0 = (i * 360) / SEGMENTS.length;
              const a1 = ((i + 1) * 360) / SEGMENTS.length;
              const rad = (deg: number) => (deg * Math.PI) / 180;
              const x1 = 100 + 100 * Math.cos(rad(a0 - 90));
              const y1 = 100 + 100 * Math.sin(rad(a0 - 90));
              const x2 = 100 + 100 * Math.cos(rad(a1 - 90));
              const y2 = 100 + 100 * Math.sin(rad(a1 - 90));
              return (
                <path
                  key={s.label}
                  d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                  fill={s.color}
                />
              );
            })}
            {SEGMENTS.map((s, i) => {
              const mid = ((i + 0.5) * 360) / SEGMENTS.length - 90;
              const rad = (mid * Math.PI) / 180;
              const tx = 100 + 58 * Math.cos(rad);
              const ty = 100 + 58 * Math.sin(rad);
              return (
                <text
                  key={`t-${i}`}
                  x={tx}
                  y={ty}
                  fill="#fff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid + 90}, ${tx}, ${ty})`}
                >
                  {s.label}
                </text>
              );
            })}
            <circle cx="100" cy="100" r="18" fill="#FFD700" stroke="#fff" strokeWidth="3" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        onClick={spin}
        disabled={spinning || playsLeft <= 0}
        className="btn-duo btn-duo-green w-full max-w-xs mx-auto py-3.5 rounded-2xl text-sm min-h-[48px] block"
      >
        {spinning ? 'Dönüyor...' : playsLeft <= 0 ? 'Yarın tekrar gel' : 'Çevir!'}
      </button>
    </GameLayout>
  );
}
