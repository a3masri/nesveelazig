import { useState, useCallback, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { awardPoints } from '../../lib/gameRewards';
import { playTap, playWin, playLose } from '../../lib/sounds';

const EMOJIS = ['☕', '🥐', '🍵', '🍪', '🧁', '🍩'];
const SIZE = 8;

function randomGrid(): string[][] {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)])
  );
}

function findMatches(grid: string[][]): Set<string> {
  const matched = new Set<string>();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 2; c++) {
      if (grid[r][c] === grid[r][c + 1] && grid[r][c] === grid[r][c + 2]) {
        matched.add(`${r},${c}`);
        matched.add(`${r},${c + 1}`);
        matched.add(`${r},${c + 2}`);
      }
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 2; r++) {
      if (grid[r][c] === grid[r + 1][c] && grid[r][c] === grid[r + 2][c]) {
        matched.add(`${r},${c}`);
        matched.add(`${r + 1},${c}`);
        matched.add(`${r + 2},${c}`);
      }
    }
  }
  return matched;
}

function collapse(grid: string[][]): string[][] {
  const g = grid.map(row => [...row]);
  for (let c = 0; c < SIZE; c++) {
    let write = SIZE - 1;
    for (let r = SIZE - 1; r >= 0; r--) {
      if (g[r][c] !== '') {
        g[write][c] = g[r][c];
        if (write !== r) g[r][c] = '';
        write--;
      }
    }
    for (let r = write; r >= 0; r--) g[r][c] = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  }
  return g;
}

export default function CafeMatch() {
  const { profile, setProfile } = useProfile();
  const [grid, setGrid] = useState(randomGrid);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(25);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose' | 'info'; message: string } | null>(null);
  const [shake, setShake] = useState(false);

  const addPoints = useCallback(
    (pts: number) => {
      if (!profile || pts <= 0) return;
      awardPoints(profile, setProfile, pts);
    },
    [profile, setProfile]
  );

  const processMatches = useCallback(
    (g: string[][]) => {
      let current = g.map(r => [...r]);
      let totalMatched = 0;
      let loops = 0;
      while (loops < 10) {
        const m = findMatches(current);
        if (m.size === 0) break;
        totalMatched += m.size;
        m.forEach(key => {
          const [r, c] = key.split(',').map(Number);
          current[r][c] = '';
        });
        current = collapse(current);
        loops++;
      }
      if (totalMatched > 0) {
        const pts = totalMatched * 2;
        setScore(s => s + pts);
        addPoints(pts);
      }
      return current;
    },
    [addPoints]
  );

  useEffect(() => {
    if (moves <= 0 && !result) {
      playWin();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
      setResult({ type: 'win', message: `Oyun bitti! Toplam skor: ${score} kupa` });
    }
  }, [moves, score, result]);

  const swap = (r1: number, c1: number, r2: number, c2: number) => {
    const g = grid.map(row => [...row]);
    [g[r1][c1], g[r2][c2]] = [g[r2][c2], g[r1][c1]];
    const test = findMatches(g);
    if (test.size === 0) {
      playLose();
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return false;
    }
    playTap();
    setMoves(m => m - 1);
    setGrid(processMatches(g));
    return true;
  };

  const onCell = (r: number, c: number) => {
    if (moves <= 0) return;
    if (!selected) {
      setSelected([r, c]);
      playTap();
      return;
    }
    const [sr, sc] = selected;
    const adj = (Math.abs(sr - r) === 1 && sc === c) || (Math.abs(sc - c) === 1 && sr === r);
    if (adj) swap(sr, sc, r, c);
    setSelected(null);
  };

  const reset = () => {
    setGrid(randomGrid());
    setScore(0);
    setMoves(25);
    setSelected(null);
    setResult(null);
  };

  return (
    <GameLayout title="🍩 Kafe Eşleştir" subtitle="3+ eşleştir — kupa kazan" confetti={confetti} result={result}>
      <div className="flex justify-center gap-6 mb-4 text-sm font-bold">
        <span className="text-cr-gold">Skor: {score}</span>
        <span style={{ color: 'var(--text-secondary)' }}>Hamle: {moves}</span>
      </div>

      <div
        className={`game-panel grid gap-0.5 mx-auto max-w-[min(100%,360px)] p-2 ${shake ? 'animate-wiggle' : ''}`}
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => onCell(r, c)}
              className={`game-cell aspect-square text-base sm:text-lg rounded-lg transition-all ${
                selected?.[0] === r && selected?.[1] === c ? 'ring-2 ring-cr-gold scale-105' : ''
              }`}
              style={{ background: 'var(--bg-secondary)' }}
            >
              {cell}
            </button>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className="btn-duo btn-duo-blue w-full max-w-xs mx-auto mt-6 py-3 rounded-2xl flex items-center justify-center gap-2 min-h-[48px]"
      >
        <RotateCcw className="w-4 h-4" /> Yeniden
      </button>
    </GameLayout>
  );
}
