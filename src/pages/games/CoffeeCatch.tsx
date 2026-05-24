import { useEffect, useRef, useState, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { awardPoints } from '../../lib/gameRewards';
import { playCatch, playLose, playWin, playTap } from '../../lib/sounds';

type Item = { id: number; x: number; y: number; emoji: string; good: boolean };

const GOOD = ['☕', '🥐', '🍪'];
const BAD = ['💣', '🧊'];

export default function CoffeeCatch() {
  const { profile, setProfile } = useProfile();
  const areaRef = useRef<HTMLDivElement>(null);
  const [basket, setBasket] = useState(50);
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose' | 'info'; message: string } | null>(null);
  const idRef = useRef(0);

  const endGame = useCallback(
    (won: boolean, finalScore: number) => {
      setPlaying(false);
      if (won && profile && finalScore > 0) {
        awardPoints(profile, setProfile, finalScore);
        playWin();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
        setResult({ type: 'win', message: `+${finalScore} kupa kazandın!` });
      } else {
        playLose();
        setResult({ type: 'lose', message: 'Oyun bitti — tekrar dene!' });
      }
    },
    [profile, setProfile]
  );

  useEffect(() => {
    if (!playing) return;
    const spawn = setInterval(() => {
      const good = Math.random() > 0.25;
      const pool = good ? GOOD : BAD;
      setItems(prev => [
        ...prev,
        {
          id: idRef.current++,
          x: 10 + Math.random() * 80,
          y: 0,
          emoji: pool[Math.floor(Math.random() * pool.length)],
          good,
        },
      ]);
    }, 700);

    const tick = setInterval(() => {
      setItems(prev => {
        const next: Item[] = [];
        let missed = 0;
        prev.forEach(it => {
          const ny = it.y + 4;
          if (ny > 92 && ny < 100) {
            const caught = Math.abs(it.x - basket) < 14;
            if (caught) {
              if (it.good) {
                setScore(s => s + 5);
                playCatch();
              } else {
                setLives(l => {
                  const n = l - 1;
                  if (n <= 0) endGame(false, score);
                  return n;
                });
                playLose();
              }
            } else if (it.good) missed++;
          }
          if (ny < 100) next.push({ ...it, y: ny });
          else if (it.good && !it.good) missed++;
          else if (it.good) {
            setLives(l => {
              const n = l - 1;
              if (n <= 0) endGame(false, score);
              return n;
            });
          }
        });
        return next;
      });
    }, 50);

    const timer = setTimeout(() => endGame(true, score), 30000);

    return () => {
      clearInterval(spawn);
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [playing, basket, score, endGame]);

  const start = () => {
    playTap();
    setItems([]);
    setScore(0);
    setLives(3);
    setResult(null);
    setPlaying(true);
  };

  const moveBasket = (clientX: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setBasket(Math.max(8, Math.min(92, pct)));
  };

  return (
    <GameLayout
      title="☕ Fincan Yakala"
      subtitle="İyi ürünleri yakala, bombadan kaç — 30 sn"
      confetti={confetti}
      result={result}
    >
      <div className="flex justify-center gap-6 text-sm font-bold mb-4">
        <span className="text-cr-gold">Skor: {score}</span>
        <span style={{ color: 'var(--text-secondary)' }}>Can: {'❤️'.repeat(lives)}</span>
      </div>

      <div
        ref={areaRef}
        className="game-panel relative mx-auto w-full max-w-sm h-72 overflow-hidden touch-none select-none"
        onPointerMove={e => playing && moveBasket(e.clientX)}
        onPointerDown={e => playing && moveBasket(e.clientX)}
      >
        {items.map(it => (
          <span
            key={it.id}
            className="absolute text-2xl transition-none pointer-events-none"
            style={{ left: `${it.x}%`, top: `${it.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {it.emoji}
          </span>
        ))}
        <div
          className="absolute bottom-2 h-10 w-16 rounded-xl border-2 border-cr-gold flex items-center justify-center text-xl bg-cr-gold/20"
          style={{ left: `${basket}%`, transform: 'translateX(-50%)' }}
        >
          ☕
        </div>
      </div>

      <button
        type="button"
        onClick={start}
        disabled={playing}
        className="btn-duo btn-duo-green w-full max-w-sm mx-auto mt-6 py-3.5 rounded-2xl text-sm min-h-[48px] block"
      >
        {playing ? 'Oynanıyor...' : 'Başla'}
      </button>
    </GameLayout>
  );
}
