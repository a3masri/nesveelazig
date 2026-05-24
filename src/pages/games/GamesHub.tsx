import { Link } from 'react-router-dom';
import { Gamepad2, Calendar } from 'lucide-react';
import { AppHeader } from '../../components/AppHeader';
import { getDailyPlayCount } from '../../lib/gameRewards';

const games = [
  { path: '/oyunlar/cark', title: 'Çarkıfelek', desc: 'Günde 5 çevirme', emoji: '🎡', pts: '5–100' },
  { path: '/oyunlar/yakala', title: 'Fincan Yakala', desc: '30 sn arcade', emoji: '☕', pts: 'Skor' },
  { path: '/oyunlar/hafiza', title: 'Kafe Hafıza', desc: 'Kart eşleştir', emoji: '🧠', pts: '15–40' },
  { path: '/oyunlar/quiz', title: 'Kahve Quiz', desc: '3 soru', emoji: '📚', pts: '+25' },
  { path: '/oyunlar/esles', title: 'Kafe Eşleştir', desc: 'Match-3', emoji: '🍩', pts: '2×eşleşme' },
  { path: '/oyunlar/xo', title: 'Kahve vs Kruvasan', desc: 'XOX', emoji: '⚔️', pts: '+20' },
];

export default function GamesHub() {
  const spinLeft = 5 - getDailyPlayCount('spin-wheel');
  const quizLeft = 3 - getDailyPlayCount('cafe-quiz');

  return (
    <div className="page-stack animate-fade-in overflow-x-hidden">
      <AppHeader title="Oyunlar" subtitle="Eğlen, kupa kazan" />

      <div className="surface-panel p-4 flex items-start gap-3">
        <Calendar className="w-5 h-5 text-cr-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Günlük görevler
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Çark: {spinLeft} hak · Quiz: {quizLeft} hak
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {games.map(g => (
          <Link
            key={g.path}
            to={g.path}
            className="surface-panel p-4 block card-hover min-h-[120px] flex flex-col"
          >
            <span className="text-3xl mb-2">{g.emoji}</span>
            <h3 className="font-display text-xs font-bold uppercase leading-tight" style={{ color: 'var(--text-primary)' }}>
              {g.title}
            </h3>
            <p className="text-[10px] mt-1 flex-1" style={{ color: 'var(--text-muted)' }}>
              {g.desc}
            </p>
            <span className="text-[10px] font-bold text-cr-gold mt-2">{g.pts} kupa</span>
          </Link>
        ))}
      </div>

      <p className="text-center text-[10px] flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
        <Gamepad2 className="w-3 h-3" />
        Tüm oyunlar mobil için optimize edildi
      </p>
    </div>
  );
}
