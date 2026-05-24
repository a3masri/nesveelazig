import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { awardPoints } from '../../lib/gameRewards';
import { playTap, playWin, playLose } from '../../lib/sounds';

type Cell = 'coffee' | 'croissant' | null;
type Player = 'coffee' | 'croissant';

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: Cell[]): Player | 'draw' | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(Boolean)) return 'draw';
  return null;
}

function aiMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c ? -1 : i)).filter(i => i >= 0) as number[];
  const tryWin = (p: Player) => {
    for (const i of empty) {
      const t = [...board];
      t[i] = p;
      if (checkWinner(t) === p) return i;
    }
    return -1;
  };
  let m = tryWin('croissant');
  if (m >= 0) return m;
  m = tryWin('coffee');
  if (m >= 0) return m;
  if (empty.includes(4)) return 4;
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function TicTacToe() {
  const { profile, setProfile } = useProfile();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>('coffee');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose' | 'info'; message: string } | null>(null);

  useEffect(() => {
    if (winner || turn !== 'croissant') return;
    const t = setTimeout(() => {
      const move = aiMove(board);
      if (move < 0) return;
      const next = [...board];
      next[move] = 'croissant';
      setBoard(next);
      const w = checkWinner(next);
      if (w) {
        setWinner(w);
        if (w === 'croissant') {
          playLose();
          setResult({ type: 'lose', message: 'Kruvasan kazandı — tekrar dene!' });
        }
      } else setTurn('coffee');
    }, 400);
    return () => clearTimeout(t);
  }, [turn, board, winner]);

  const play = (i: number) => {
    if (board[i] || winner || turn !== 'coffee') return;
    playTap();
    const next = [...board];
    next[i] = 'coffee';
    setBoard(next);
    const w = checkWinner(next);
    if (w) {
      setWinner(w);
      if (w === 'coffee' && profile) {
        awardPoints(profile, setProfile, 20);
        playWin();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
        setResult({ type: 'win', message: 'Kahve kazandı! +20 kupa' });
      } else if (w === 'draw') {
        setResult({ type: 'info', message: 'Berabere!' });
      }
    } else {
      setTurn('croissant');
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn('coffee');
    setWinner(null);
    setResult(null);
  };

  const status =
    winner === 'coffee'
      ? 'Kazandın!'
      : winner === 'croissant'
        ? 'Kaybettin'
        : winner === 'draw'
          ? 'Berabere'
          : `Sen: ☕ · Sıra: ${turn === 'coffee' ? 'Sen' : 'Rakip'}`;

  return (
    <GameLayout title="☕ vs 🥐" subtitle={status} confetti={confetti} result={result}>
      <div className="game-panel grid grid-cols-3 gap-2 max-w-xs mx-auto p-3">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            onClick={() => play(i)}
            className="game-cell aspect-square rounded-xl text-4xl flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}
          >
            {cell === 'coffee' ? '☕' : cell === 'croissant' ? '🥐' : ''}
          </button>
        ))}
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
