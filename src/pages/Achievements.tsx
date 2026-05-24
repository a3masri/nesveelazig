import { useEffect, useState } from 'react';
import { Trophy, Coffee, Flame, Calendar, Users, Star, Lock, Check, Zap, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { RARITY_COLORS } from '../lib/constants';
import { Confetti } from '../components/Particles';
type Achievement = { id: string; name: string; description: string; icon: string; category: string; requirement_type: string; requirement_value: number; rarity: string; };

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'İlk Fincan', description: 'İlk ziyaretini tamamla', icon: 'Coffee', category: 'visits', requirement_type: 'visits', requirement_value: 1, rarity: 'common' },
  { id: '2', name: 'Seri Avcısı', description: '7 gün üst üste gel', icon: 'Flame', category: 'streaks', requirement_type: 'streak', requirement_value: 7, rarity: 'rare' },
  { id: '3', name: 'Kruvasan Ustası', description: '5 tatlı al', icon: 'Croissant', category: 'purchases', requirement_type: 'purchases', requirement_value: 5, rarity: 'epic' },
  { id: '4', name: 'Efsane Barista', description: '10000 kupa topla', icon: 'Crown', category: 'legend', requirement_type: 'points', requirement_value: 10000, rarity: 'legendary' },
];
const ICON_MAP: Record<string, any> = { Coffee, Flame, Calendar, Users, Star, Trophy, Zap, Crown, Swords: Coffee, Shield: Trophy, Skull: Flame, Footprints: Coffee, CalendarCheck: Calendar, Croissant: Coffee, Leaf: Star, Sunrise: Star, Wallet: Trophy, Sparkles: Zap };
const CATEGORIES = ['all', 'visits', 'purchases', 'streaks', 'social', 'legend'] as const;
const CAT_LABELS: Record<string, string> = { all: 'Tümü', visits: 'Ziyaret', purchases: 'Alışveriş', streaks: 'Seri', social: 'Sosyal', legend: 'Efsane' };
export default function Achievements() {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlocked, setUnlocked] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [showConfetti] = useState(false);
  useEffect(() => {
    setAllAchievements(MOCK_ACHIEVEMENTS);
    if (user?.id === 'demo-user-id') {
      const map = new Map<string, string>();
      map.set('1', new Date().toISOString());
      setUnlocked(map);
    }
    setLoading(false);
  }, [user]);
  const filtered = category === 'all' ? allAchievements : allAchievements.filter(a => a.category === category);
  const unlockedCount = unlocked.size;
  const totalCount = allAchievements.length || 1;
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-3 border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" /></div>;
  return (
    <div className="page-stack animate-fade-in overflow-x-hidden">
      <Confetti active={showConfetti} />
      <div><h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>Başarılar</h1><p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{unlockedCount}/{totalCount} rozet açıldı</p></div>
      <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Koleksiyon İlerlemesi</span><span className="text-xs font-bold text-cr-gold">{Math.round((unlockedCount / totalCount) * 100)}%</span></div><div className="progress-track h-3"><div className="progress-fill h-full bg-cr-gold" style={{ width: `${(unlockedCount / totalCount) * 100}%` }} /></div></div>
      <div className="flex gap-2 overflow-x-auto pb-1">{CATEGORIES.map(cat => <button key={cat} onClick={() => setCategory(cat)} className={`btn-duo px-4 py-2 rounded-2xl text-xs whitespace-nowrap ${category === cat ? 'btn-duo-blue' : 'btn-duo-ghost'}`}>{CAT_LABELS[cat]}</button>)}</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">{filtered.map(ach => { const isUnlocked = unlocked.has(ach.id); const rc = RARITY_COLORS[ach.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common; const AchIcon = ICON_MAP[ach.icon] || Trophy; const frameClass = isUnlocked && ach.rarity === 'legendary' ? 'card-legendary-frame' : isUnlocked && ach.rarity === 'champion' ? 'card-champion-frame' : isUnlocked && ach.rarity === 'epic' ? 'card-epic-frame' : ''; return <div key={ach.id} className={`card-hover rounded-2xl p-4 text-center transition-all duration-500 animate-slide-up ${isUnlocked && (ach.rarity === 'legendary' || ach.rarity === 'champion') ? 'animate-pulse-glow' : ''}`} style={{ background: isUnlocked ? rc.bg : 'var(--bg-card)', border: `2px solid ${isUnlocked ? rc.border : 'var(--border)'}`, boxShadow: isUnlocked ? rc.glow : 'var(--shadow)', opacity: isUnlocked ? 1 : 0.4 }}><div className={`w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center ${frameClass}`} style={frameClass ? {} : { background: isUnlocked ? `${rc.border}25` : 'var(--bg-secondary)' }}>{isUnlocked ? <AchIcon className="w-7 h-7" style={{ color: rc.text }} /> : <Lock className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />}</div><h3 className="font-display font-bold text-xs mb-0.5 uppercase" style={{ color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{ach.name}</h3><p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{ach.description}</p>{isUnlocked ? <div className="flex items-center justify-center gap-1"><Check className="w-3 h-3 text-cr-green" /><span className="text-[10px] text-cr-green font-bold uppercase">Açıldı</span></div> : <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase" style={{ background: `${rc.border}15`, color: rc.text }}>{ach.rarity}</span>}</div>; })}</div>
      {filtered.length === 0 && <div className="text-center py-16"><Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} /><p className="uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Bu kategoride başarı yok</p></div>}
    </div>
  );
}
