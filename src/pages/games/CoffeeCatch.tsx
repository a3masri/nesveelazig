import { useEffect, useRef, useState, useCallback } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { awardPoints } from '../../lib/gameRewards';
import { playCatch, playLose, playWin, playTap } from '../../lib/sounds';

type Item = { id: number; x: number; y: number; emoji: string; good: boolean; caught?: boolean };

const GOOD = ['☕', '🥐', '🍪'];
const BAD = ['💣', '🧊'];
const GAME_MS = 30000;
const BASKET_Y = 86;
const CATCH_RANGE = 20;
const FALL_SPEED = 2.8;

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

  const basketRef = useRef(50);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const playingRef = useRef(false);
  const idRef = useRef(0);

  const syncBasket = (pct: number) => {
    const v = Math.max(10, Math.min(90, pct));
    basketRef.current = v;
    setBasket(v);
  };

  const endGame = useCallback(
    (won: boolean) => {
      if (!playingRef.current) return;
      playingRef.current = false;
      setPlaying(false);
      const finalScore = scoreRef.current;
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

  const loseLife = useCallback(() => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    playLose();
    if (livesRef.current <= 0) endGame(false);
  }, [endGame]);

  useEffect(() => {
    if (!playing) return;

    const spawn = setInterval(() => {
      if (!playingRef.current) return;
      const good = Math.random() > 0.28;
      const pool = good ? GOOD : BAD;
      setItems(prev => [
        ...prev,
        {
          id: idRef.current++,
          x: 12 + Math.random() * 76,
          y: 0,
          emoji: pool[Math.floor(Math.random() * pool.length)]!,
          good,
        },
      ]);
    }, 650);

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      if (!playingRef.current) return;
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;

      setItems(prev => {
        const next: Item[] = [];
        const b = basketRef.current;

        for (const it of prev) {
          if (it.caught) continue;
          const ny = it.y + FALL_SPEED * dt;

          if (ny >= BASKET_Y - 4 && ny <= BASKET_Y + 10) {
            const caught = Math.abs(it.x - b) < CATCH_RANGE;
            if (caught) {
              if (it.good) {
                scoreRef.current += 5;
                setScore(scoreRef.current);
                playCatch();
              } else {
                loseLife();
              }
              continue;
            }
          }

          if (ny > 100) {
            if (it.good) loseLife();
            continue;
          }

          next.push({ ...it, y: ny });
        }
        return next;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const timer = window.setTimeout(() => endGame(true), GAME_MS);

    return () => {
      clearInterval(spawn);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [playing, endGame, loseLife]);

  const start = () => {
    playTap();
    idRef.current = 0;
    scoreRef.current = 0;
    livesRef.current = 3;
    playingRef.current = true;
    setItems([]);
    setScore(0);
    setLives(3);
    setResult(null);
    setPlaying(true);
    syncBasket(50);
  };

  const moveBasket = (clientX: number) => {
    const el = areaRef.current;
    if (!el || !playingRef.current) return;
    const rect = el.getBoundingClientRect();
    syncBasket(((clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!playingRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    moveBasket(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!playingRef.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    moveBasket(e.clientX);
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
        <span style={{ color: 'var(--text-secondary)' }}>Can: {'❤️'.repeat(Math.max(0, lives))}</span>
      </div>

      <div
        ref={areaRef}
        className="catch-arena game-panel relative mx-auto w-full max-w-sm overflow-hidden touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={e => {
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        }}
        onPointerCancel={e => {
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        }}
      >
        <div className="catch-zone-line" aria-hidden />
        {items.map(it => (
          <span
            key={it.id}
            className="catch-item absolute text-3xl pointer-events-none will-change-transform"
            style={{ left: `${it.x}%`, top: `${it.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {it.emoji}
          </span>
        ))}
        <div className="catch-basket" style={{ left: `${basket}%` }}>
          <span className="text-2xl">☕</span>
        </div>
      </div>

      <p className="text-center text-[10px] mt-3 font-semibold" style={{ color: 'var(--text-muted)' }}>
        Sepeti sürüklemek için parmağını ekranda kaydır
      </p>

      <button
        type="button"
        onClick={start}
        disabled={playing}
        className="btn-duo btn-duo-green w-full max-w-sm mx-auto mt-4 py-3.5 rounded-2xl text-sm min-h-[48px] block"
      >
        {playing ? 'Oynanıyor...' : 'Başla'}
      </button>
    </GameLayout>
  );
}
