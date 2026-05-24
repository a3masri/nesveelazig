import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { GAME_PAIR_EMOJIS } from '../../lib/brandAssets';
import { awardPoints, canPlayDaily, incrementDailyPlay } from '../../lib/gameRewards';
import { playTap, playWin, playLose, playPoints } from '../../lib/sounds';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = { uid: string; pairId: string; emoji: string };

function buildDeck(): Card[] {
  const deck: Card[] = [];
  GAME_PAIR_EMOJIS.forEach((p, i) => {
    deck.push({ uid: `${i}-a`, pairId: p.id, emoji: p.emoji });
    deck.push({ uid: `${i}-b`, pairId: p.id, emoji: p.emoji });
  });
  return shuffle(deck);
}

export default function MemoryGame() {
  const { profile, setProfile } = useProfile();
  const [cards, setCards] = useState(buildDeck);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose' | 'info'; message: string } | null>(null);
  const [lock, setLock] = useState(false);

  const pairCount = GAME_PAIR_EMOJIS.length;
  const won = matched.size === pairCount;

  const flip = (uid: string) => {
    if (lock || flipped.includes(uid) || matched.has(cards.find(c => c.uid === uid)!.pairId)) return;
    playTap();
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      setLock(true);
      const [a, b] = next.map(id => cards.find(c => c.uid === id)!);
      if (a.pairId === b.pairId) {
        const nextMatched = new Set(matched);
        nextMatched.add(a.pairId);
        setMatched(nextMatched);
        setFlipped([]);
        setLock(false);
        playPoints();
        if (nextMatched.size === pairCount) {
          const pts = Math.max(15, 40 - moves * 2);
          if (profile && canPlayDaily('memory', 5)) {
            incrementDailyPlay('memory', 5);
            awardPoints(profile, setProfile, pts);
          }
          playWin();
          setConfetti(true);
          setTimeout(() => setConfetti(false), 2000);
          setResult({ type: 'win', message: `Tebrikler! +${pts} kupa` });
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
          playLose();
        }, 600);
      }
    }
  };

  const reset = () => {
    setCards(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setResult(null);
  };

  return (
    <GameLayout title="🧠 Kafe Hafıza" subtitle="Eşleştir ve kupa kazan" confetti={confetti} result={result}>
      <p className="text-center text-xs mb-4 font-bold" style={{ color: 'var(--text-muted)' }}>
        Hamle: {moves} · Eşleşen: {matched.size}/{pairCount}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-sm mx-auto">
        {cards.map(card => {
          const isMatched = matched.has(card.pairId);
          const isFlipped = flipped.includes(card.uid) || isMatched;
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => flip(card.uid)}
              disabled={isMatched || lock}
              className={`game-cell aspect-square rounded-xl border-2 flex items-center justify-center transition-transform active:scale-95 ${isFlipped ? 'border-cr-gold' : ''}`}
              style={{
                background: isFlipped ? 'var(--bg-card)' : 'var(--bg-secondary)',
                borderColor: isFlipped ? undefined : 'var(--border)',
              }}
            >
              {isFlipped ? (
                <span className="text-3xl select-none">{card.emoji}</span>
              ) : (
                <span className="text-2xl opacity-40">?</span>
              )}
            </button>
          );
        })}
      </div>
      {won && (
        <button
          type="button"
          onClick={reset}
          className="btn-duo btn-duo-blue w-full max-w-sm mx-auto mt-6 py-3 rounded-2xl flex items-center justify-center gap-2 min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4" /> Tekrar Oyna
        </button>
      )}
    </GameLayout>
  );
}
