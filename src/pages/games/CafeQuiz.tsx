import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { GameLayout } from '../../components/games/GameLayout';
import { awardPoints, canPlayDaily, getDailyPlayCount, incrementDailyPlay } from '../../lib/gameRewards';
import { playTap, playWin, playLose } from '../../lib/sounds';

const QUESTIONS = [
  {
    q: 'Espresso tek shot için yaklaşık kaç ml kullanılır?',
    options: ['30 ml', '120 ml', '250 ml'],
    correct: 0,
  },
  {
    q: 'Türk kahvesi hangi öğütme ile hazırlanır?',
    options: ['İnce', 'Orta', 'Kalın'],
    correct: 0,
  },
  {
    q: 'Latte\'nin üstünde genelde ne bulunur?',
    options: ['Süt köpüğü', 'Karamel sos', 'Limon'],
    correct: 0,
  },
];

const QUIZ_ID = 'cafe-quiz';
const MAX_DAILY = 3;
const REWARD = 25;

export default function CafeQuiz() {
  const { profile, setProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose' | 'info'; message: string } | null>(null);

  const playsLeft = MAX_DAILY - getDailyPlayCount(QUIZ_ID);
  const q = QUESTIONS[step];

  const answer = (idx: number) => {
    if (picked !== null || done) return;
    playTap();
    setPicked(idx);
    const ok = idx === q.correct;
    if (ok) setCorrect(c => c + 1);
    setTimeout(() => {
      const total = ok ? correct + 1 : correct;
      if (step + 1 >= QUESTIONS.length) finish(total);
      else {
        setStep(s => s + 1);
        setPicked(null);
      }
    }, 600);
  };

  const finish = (totalCorrect: number) => {
    setDone(true);
    const allRight = totalCorrect === QUESTIONS.length;
    if (allRight && profile && canPlayDaily(QUIZ_ID, MAX_DAILY)) {
      incrementDailyPlay(QUIZ_ID, MAX_DAILY);
      awardPoints(profile, setProfile, REWARD);
      playWin();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
      setResult({ type: 'win', message: `Mükemmel! +${REWARD} kupa` });
    } else if (allRight) {
      setResult({ type: 'info', message: 'Günlük quiz hakkın doldu — yarın gel!' });
    } else {
      playLose();
      setResult({ type: 'lose', message: `${totalCorrect}/${QUESTIONS.length} doğru — tekrar dene` });
    }
  };

  const reset = () => {
    setStep(0);
    setCorrect(0);
    setPicked(null);
    setDone(false);
    setResult(null);
  };

  return (
    <GameLayout
      title="☕ Kahve Quiz"
      subtitle={`Günde ${MAX_DAILY} deneme · ${playsLeft} kaldı`}
      confetti={confetti}
      result={result}
    >
      {!done && q && (
        <div className="game-panel max-w-md mx-auto">
          <p className="text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            Soru {step + 1}/{QUESTIONS.length}
          </p>
          <h2 className="font-display text-sm uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
            {q.q}
          </h2>
          <div className="space-y-2">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => answer(i)}
                disabled={picked !== null}
                className={`btn-duo w-full py-3.5 rounded-xl text-sm text-left px-4 min-h-[48px] ${
                  picked === null
                    ? 'btn-duo-ghost'
                    : i === q.correct
                      ? 'btn-duo-green'
                      : picked === i
                        ? 'btn-duo-red'
                        : 'btn-duo-ghost opacity-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {done && (
        <button type="button" onClick={reset} className="btn-duo btn-duo-blue w-full max-w-sm mx-auto py-3 rounded-2xl min-h-[48px]">
          Yeniden Başla
        </button>
      )}
    </GameLayout>
  );
}
