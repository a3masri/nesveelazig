import { useEffect, useState } from 'react';
import { Trophy, Crown, Star, Coffee, Flame, Award, Zap, Medal } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { AppHeader } from '../components/AppHeader';
import { getLeaderboard } from '../lib/db';
import { RANKS } from '../lib/constants';

type Leader = { id: string; display_name: string; total_points: number; current_rank: string; streak_count: number };

const RANK_ICONS: Record<string, typeof Coffee> = {
  'Antrenman Kampı': Coffee,
  'Goblin Stadyumu': Award,
  'Kemik Çukuru': Flame,
  'Barbar Çayı': Trophy,
  'Büyü Vadisi': Zap,
  'Efsane Arena': Crown,
};

function getRankData(rankName: string) {
  const r = RANKS.find(x => x.name === rankName) || RANKS[0];
  return { ...r, icon: RANK_ICONS[r.name] || Coffee };
}

const AVATARS = ['☕', '🥐', '🍵', '🧁', '👑', '🔥', '⭐', '🍪', '🫖', '🎖️', '💎', '🏆'];

export default function Leaderboard() {
  const { profile } = useProfile();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');

  useEffect(() => {
    const fetchLeaders = async () => {
      let list: Leader[] = (await getLeaderboard()).map(p => ({
        id: p.id,
        display_name: p.display_name,
        total_points: p.total_points,
        current_rank: p.current_rank,
        streak_count: p.streak_count,
      }));

      if (profile) {
        const me: Leader = {
          id: profile.id,
          display_name: profile.display_name + ' (Sen)',
          total_points: profile.total_points,
          current_rank: profile.current_rank,
          streak_count: profile.streak_count,
        };
        list = [me, ...list.filter(l => l.id !== profile.id)];
      }

      list.sort((a, b) => b.total_points - a.total_points);
      if (timeframe === 'weekly') list = list.map(l => ({ ...l, total_points: Math.floor(l.total_points * 0.15) }));
      if (timeframe === 'monthly') list = list.map(l => ({ ...l, total_points: Math.floor(l.total_points * 0.4) }));
      list.sort((a, b) => b.total_points - a.total_points);
      setLeaders(list.slice(0, 50));
      setLoading(false);
    };
    fetchLeaders();
  }, [timeframe, profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" />
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumStyles = [
    { height: 'h-32 sm:h-36', label: '2.', color: '#C0C0C0' },
    { height: 'h-44 sm:h-52', label: '1.', color: '#FFD700' },
    { height: 'h-24 sm:h-28', label: '3.', color: '#CD7F32' },
  ];

  return (
    <div className="pb-24 lg:pb-8 space-y-6 animate-fade-in">
      <AppHeader title="Sıralama" subtitle={`${leaders.length} kahraman yarışıyor`} />

      <div className="flex gap-2 flex-wrap">
        {([['all', 'Tüm Zamanlar'], ['monthly', 'Bu Ay'], ['weekly', 'Bu Hafta']] as const).map(([tf, l]) => (
          <button key={tf} type="button" onClick={() => setTimeframe(tf)} className={`btn-duo px-4 py-2 rounded-2xl text-xs ${timeframe === tf ? 'btn-duo-blue' : 'btn-duo-ghost'}`}>
            {l}
          </button>
        ))}
      </div>

      {top3.length > 0 && (
        <div className="rounded-2xl p-6 pt-10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-end justify-center gap-2 sm:gap-4">
            {podiumOrder.map((leader, i) => {
              if (!leader) return null;
              const style = podiumStyles[i === 0 ? 0 : i === 1 ? 1 : 2];
              const rankData = getRankData(leader.current_rank);
              const RankIcon = rankData.icon;
              const avatar = AVATARS[leader.display_name.length % AVATARS.length];
              return (
                <div key={leader.id} className="flex flex-col items-center flex-1 max-w-[120px] animate-slide-up">
                  {style.label === '1.' && <Crown className="w-8 h-8 mb-1 text-cr-gold animate-trophy-bounce" />}
                  <div className="text-3xl mb-1">{avatar}</div>
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-2 ${style.label === '1.' ? 'animate-pulse-glow' : ''}`}
                    style={{ background: `${style.color}25`, border: `2px solid ${style.color}` }}
                  >
                    <RankIcon className="w-6 h-6" style={{ color: rankData.color }} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-center truncate w-full uppercase" style={{ color: 'var(--text-primary)' }}>
                    {leader.display_name}
                  </span>
                  <span className="text-xs font-bold text-cr-gold my-1">{leader.total_points.toLocaleString('tr-TR')}</span>
                  <div
                    className={`${style.height} w-full rounded-t-xl flex items-end justify-center pb-2`}
                    style={{ background: `${style.color}22`, border: `1px solid ${style.color}50` }}
                  >
                    <Medal className="w-6 h-6 mb-1" style={{ color: style.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {rest.map((leader, i) => {
          const rankData = getRankData(leader.current_rank);
          const RankIcon = rankData.icon;
          const isMe = leader.display_name.includes('(Sen)');
          return (
            <div
              key={leader.id}
              className={`flex items-center gap-3 p-4 border-b last:border-0 ${isMe ? 'bg-cr-gold/10' : 'card-hover'}`}
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="w-8 text-center text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                {i + 4}
              </span>
              <span className="text-xl">{AVATARS[i % AVATARS.length]}</span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${rankData.color}15`, border: `1px solid ${rankData.color}40` }}>
                <RankIcon className="w-4 h-4" style={{ color: rankData.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold block truncate uppercase" style={{ color: 'var(--text-primary)' }}>
                  {leader.display_name}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {leader.current_rank}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {leader.streak_count > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-cr-orange font-bold">
                    <Flame className="w-3 h-3" />
                    {leader.streak_count}
                  </span>
                )}
                <span className="text-sm font-bold text-cr-gold">{leader.total_points.toLocaleString('tr-TR')}</span>
                <Star className="w-3.5 h-3.5 text-cr-gold" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
