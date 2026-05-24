import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Flame,
  ShoppingBag,
  Gamepad2,
  Gift,
  ChevronRight,
  Zap,
  Coffee,
  Crown,
  Trophy,
  Award,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { getUserTickets, getRewards, getLeaderboard } from '../lib/db';
import { getNextRank, getProgressPercent, getRankForPoints } from '../lib/constants';
import { getDailyPlayCount } from '../lib/gameRewards';
import { CompactTicketCard } from '../components/ui/CompactTicketCard';
import { RewardCollection } from '../components/profile/RewardCollection';
import type { Reward } from '../lib/types';

const RANK_ICONS: Record<string, typeof Coffee> = {
  'Antrenman Kampı': Coffee,
  'Goblin Stadyumu': Award,
  'Kemik Çukuru': Flame,
  'Barbar Çayı': Trophy,
  'Büyü Vadisi': Zap,
  'Efsane Arena': Crown,
};

const QUICK = [
  { to: '/oyunlar', label: 'Oyun', icon: Gamepad2, emoji: '🎮' },
  { to: '/store', label: 'Dükkan', icon: ShoppingBag, emoji: '🛍️' },
  { to: '/profile#rewards', label: 'Koleksiyon', icon: Gift, emoji: '🎫' },
  { to: '/oyunlar/cark', label: 'Günlük', icon: Sparkles, emoji: '🎡' },
];

const GAMES = [
  { to: '/oyunlar/cark', emoji: '🎡', title: 'Çark' },
  { to: '/oyunlar/yakala', emoji: '☕', title: 'Yakala' },
  { to: '/oyunlar/hafiza', emoji: '🧠', title: 'Hafıza' },
  { to: '/oyunlar/quiz', emoji: '📚', title: 'Quiz' },
  { to: '/oyunlar/esles', emoji: '🥐', title: 'Eşleş' },
  { to: '/oyunlar/xo', emoji: '⭕', title: 'XO' },
];

const TIPS = [
  'Her gün çarkıfelek çevirerek ekstra kupa kazan.',
  'Quiz ve hafıza oyunları günlük limit içinde en hızlı kupa kaynağı.',
  'Ödüllerini profilindeki koleksiyonda takip et — süresi dolmadan kullan.',
];

const LEADER_EMOJI = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [activeTickets, setActiveTickets] = useState(0);
  const [previewRewards, setPreviewRewards] = useState<Reward[]>([]);
  const [leaders, setLeaders] = useState<{ display_name: string; total_points: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserTickets(user.id).then(t => setActiveTickets(t.filter(x => x.status === 'active').length));
    getRewards().then(r => setPreviewRewards(r.filter(x => x.is_active).slice(0, 8)));
    getLeaderboard().then(list =>
      setLeaders(
        list
          .sort((a, b) => b.total_points - a.total_points)
          .slice(0, 5)
          .map(p => ({ display_name: p.display_name, total_points: p.total_points }))
      )
    );
  }, [user]);

  const missions = useMemo(() => {
    const spinMax = 5;
    const quizMax = 3;
    const spinUsed = getDailyPlayCount('spin-wheel');
    const quizUsed = getDailyPlayCount('cafe-quiz');
    const memoryUsed = getDailyPlayCount('memory');
    return [
      {
        label: 'Çarkıfelek çevir',
        progress: Math.min(100, (spinUsed / spinMax) * 100),
        detail: `${Math.max(0, spinMax - spinUsed)} hak`,
        to: '/oyunlar/cark',
      },
      {
        label: 'Kahve quiz tamamla',
        progress: Math.min(100, (quizUsed / quizMax) * 100),
        detail: `${Math.max(0, quizMax - quizUsed)} hak`,
        to: '/oyunlar/quiz',
      },
      {
        label: 'Hafıza oyunu oyna',
        progress: Math.min(100, (memoryUsed / 5) * 100),
        detail: `${Math.max(0, 5 - memoryUsed)}/5`,
        to: '/oyunlar/hafiza',
      },
      {
        label: 'Dükkandan ödül al',
        progress: activeTickets > 0 ? 100 : 0,
        detail: activeTickets > 0 ? 'Tamamlandı' : 'Mağazaya git',
        to: '/store',
      },
    ];
  }, [activeTickets]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" />
      </div>
    );
  }

  const points = profile?.total_points || 0;
  const currentRank = getRankForPoints(points);
  const nextRank = getNextRank(points);
  const progress = getProgressPercent(points);
  const RankIcon = RANK_ICONS[currentRank.name] || Coffee;
  const tip = TIPS[new Date().getDate() % TIPS.length];

  return (
    <div className="page-stack animate-fade-in overflow-x-hidden">
      {/* Welcome */}
      <section className="dash-hero">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Neşve üyesi
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-bold uppercase leading-tight mt-1" style={{ color: 'var(--text-primary)' }}>
              Merhaba, {profile?.display_name?.split(' ')[0] || 'Misafir'} ☕
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
            style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.35)' }}
          >
            <Star className="w-4 h-4 text-cr-gold" />
            <span className="font-display font-bold text-cr-gold">{points.toLocaleString('tr-TR')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${currentRank.color}20`, border: `2px solid ${currentRank.color}50` }}
          >
            <RankIcon className="w-5 h-5" style={{ color: currentRank.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
              Seviye · {currentRank.name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {nextRank ? `${nextRank.minPoints - points} kupa → ${nextRank.name}` : 'Zirvedesin 👑'}
            </p>
          </div>
          <span className="text-xs font-bold text-cr-gold">{progress}%</span>
        </div>
        <div className="progress-track h-2">
          <div className="progress-fill h-full" style={{ width: `${progress}%`, background: currentRank.color }} />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <div className="dash-section-head">
          <h2 className="section-title">Hızlı erişim</h2>
        </div>
        <div className="dash-quick-grid">
          {QUICK.map(q => (
            <Link key={q.to} to={q.to} className="dash-quick-btn">
              <span className="text-xl leading-none">{q.emoji}</span>
              <span className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>
                {q.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily missions */}
      <section className="surface-panel p-4 rounded-xl">
        <div className="dash-section-head mb-2">
          <h2 className="section-title">Günlük görevler</h2>
          <Link to="/oyunlar" className="text-[10px] font-bold text-cr-gold flex items-center gap-0.5">
            Tümü <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <ul>
          {missions.map(m => (
            <li key={m.label} className="dash-mission">
              <Link to={m.to} className="flex justify-between items-center gap-2">
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {m.label}
                </span>
                <span className="text-[10px] font-bold text-cr-gold shrink-0">{m.detail}</span>
              </Link>
              <div className="dash-mission-bar">
                <div className="dash-mission-fill" style={{ width: `${m.progress}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Seri', value: `${profile?.streak_count || 0}g`, icon: Flame },
          { label: 'Aktif ödül', value: activeTickets, icon: Gift },
          { label: 'Arena', value: currentRank.name.split(' ')[0], icon: Zap },
        ].map(s => (
          <div key={s.label} className="surface-panel p-3 rounded-xl text-center">
            <s.icon className="w-4 h-4 mx-auto mb-1 text-cr-gold" />
            <p className="font-display text-sm font-bold truncate px-1" style={{ color: 'var(--text-primary)' }}>
              {s.value}
            </p>
            <p className="text-[9px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Trending rewards */}
      <section>
        <div className="dash-section-head">
          <h2 className="section-title">Öne çıkan ödüller</h2>
          <Link to="/store" className="text-[10px] font-bold text-cr-gold flex items-center gap-0.5">
            Dükkan <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="dash-scroll">
          {previewRewards.map(r => (
            <Link key={r.id} to="/store" className="block">
              <CompactTicketCard
                name={r.name}
                description={r.description}
                emoji={r.emoji}
                category={r.category}
                rarity={r.rarity}
                pointCost={r.point_cost}
                canAfford={points >= r.point_cost}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Games */}
      <section>
        <div className="dash-section-head">
          <h2 className="section-title">Mini oyunlar</h2>
          <Link to="/oyunlar" className="text-[10px] font-bold text-cr-gold flex items-center gap-0.5">
            Tümü <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {GAMES.map(g => (
            <Link
              key={g.to}
              to={g.to}
              className="surface-panel p-3 rounded-xl text-center card-hover min-h-[76px] flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">{g.emoji}</span>
              <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                {g.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Collection preview */}
      <RewardCollection previewLimit={4} showHeader />

      {/* Leaderboard snippet */}
      <section className="surface-panel p-4 rounded-xl">
        <div className="dash-section-head mb-2">
          <h2 className="section-title flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-cr-gold" />
            Liderlik
          </h2>
          <Link to="/leaderboard" className="text-[10px] font-bold text-cr-gold flex items-center gap-0.5">
            Sıralama <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {leaders.length > 0 ? (
          <ul>
            {leaders.map((l, i) => (
              <li key={i} className="dash-leader-row">
                <span className="text-base w-6 text-center">{LEADER_EMOJI[i] || `${i + 1}.`}</span>
                <span className="text-sm font-bold flex-1 truncate uppercase" style={{ color: 'var(--text-primary)' }}>
                  {l.display_name}
                </span>
                <span className="text-xs font-bold text-cr-gold flex items-center gap-0.5">
                  <Star className="w-3 h-3" />
                  {l.total_points.toLocaleString('tr-TR')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>
            Sıralama yükleniyor…
          </p>
        )}
      </section>

      {/* Achievements + tips */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link to="/achievements" className="surface-panel p-4 rounded-xl card-hover flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
              Başarımlar
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Rozetlerini topla
            </p>
          </div>
          <ChevronRight className="w-5 h-5 ml-auto shrink-0" style={{ color: 'var(--text-muted)' }} />
        </Link>
        <Link to="/kod" className="surface-panel p-4 rounded-xl card-hover flex items-center gap-3">
          <span className="text-2xl">🎟️</span>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
              Kod kullan
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Fiş kodundan kupa
            </p>
          </div>
          <ChevronRight className="w-5 h-5 ml-auto shrink-0" style={{ color: 'var(--text-muted)' }} />
        </Link>
      </div>

      <section className="surface-panel p-4 rounded-xl">
        <h2 className="section-title mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-cr-gold" />
          Günün ipucu
        </h2>
        <p className="dash-tip">{tip}</p>
      </section>
    </div>
  );
}
