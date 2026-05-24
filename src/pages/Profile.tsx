import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Star,
  Flame,
  Coffee,
  Calendar,
  Save,
  X,
  Pencil,
  Shield,
  User,
  Sun,
  Moon,
  Bell,
  Volume2,
  VolumeX,
  Gamepad2,
  Trophy,
  Award,
  Zap,
  Crown,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '../hooks/useTheme';
import { useSound } from '../hooks/useSound';
import { saveProfile } from '../lib/db';
import { getRankForPoints, getNextRank, getProgressPercent, RANKS } from '../lib/constants';
import { getDailyPlayCount } from '../lib/gameRewards';
import { RewardCollection } from '../components/profile/RewardCollection';

const RANK_ICONS: Record<string, typeof Coffee> = {
  'Antrenman Kampı': Coffee,
  'Goblin Stadyumu': Award,
  'Kemik Çukuru': Flame,
  'Barbar Çayı': Trophy,
  'Büyü Vadisi': Zap,
  'Efsane Arena': Crown,
};

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'N';
}

export default function Profile() {
  const { user, promoteToAdmin, promoteToUser } = useAuth();
  const { profile, setProfile, loading } = useProfile();
  const { theme, setTheme } = useTheme();
  const { enabled: soundOn, volume, setEnabled: setSoundOn, setVolume } = useSound();
  const navigate = useNavigate();
  const location = useLocation();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    if (location.hash === '#rewards') {
      setTimeout(() => document.getElementById('rewards')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, [location.hash]);

  const handleSaveName = async () => {
    if (!user || !nameValue.trim() || !profile) return;
    setSaving(true);
    const updated = { ...profile, display_name: nameValue.trim() };
    await setProfile(updated);
    await saveProfile(updated);
    setSaving(false);
    setEditingName(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" />
      </div>
    );
  }

  const rank = profile ? getRankForPoints(profile.total_points) : RANKS[0];
  const nextRank = profile ? getNextRank(profile.total_points) : null;
  const progress = profile ? getProgressPercent(profile.total_points) : 0;
  const rankData = RANKS.find(r => r.name === rank.name) || RANKS[0];
  const RankIcon = RANK_ICONS[rank.name] || Coffee;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : '';
  const isAdmin = profile?.role === 'admin';
  const displayName = profile?.display_name || 'Misafir';
  const gamesPlayed = getDailyPlayCount('spin-wheel') + getDailyPlayCount('cafe-quiz');

  return (
    <div className="page-stack animate-fade-in overflow-x-hidden">
      {/* Member hero */}
      <section className="profile-hero">
        <div className="flex items-start gap-4">
          <div
            className="profile-avatar"
            style={{
              background: `${rankData.color}25`,
              border: `2px solid ${rankData.color}`,
              color: rankData.color,
            }}
          >
            {initials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  className="ui-input flex-1 text-sm font-bold uppercase min-h-[44px]"
                />
                <button type="button" onClick={handleSaveName} disabled={saving} className="btn-duo btn-duo-green p-2.5 rounded-xl min-w-[44px]">
                  <Save className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setEditingName(false)} className="btn-duo btn-duo-ghost p-2.5 rounded-xl min-w-[44px]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold uppercase truncate" style={{ color: 'var(--text-primary)' }}>
                  {displayName}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setEditingName(true);
                    setNameValue(displayName);
                  }}
                  className="p-2 rounded-lg min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="İsim düzenle"
                >
                  <Pencil className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                style={{ background: `${rankData.color}18`, color: rankData.color, border: `1px solid ${rankData.color}40` }}
              >
                {rank.name}
              </span>
              <span className="text-[10px] flex items-center gap-1 uppercase" style={{ color: 'var(--text-muted)' }}>
                <Calendar className="w-3 h-3" />
                {memberSince}
              </span>
              {isAdmin && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-cr-gold/20 text-cr-gold">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-cr-gold" />
            <span className="font-display text-2xl font-bold text-cr-gold">
              {(profile?.total_points || 0).toLocaleString('tr-TR')}
            </span>
            <span className="text-xs font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
              kupa
            </span>
          </div>
          <RankIcon className="w-6 h-6" style={{ color: rankData.color }} />
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
            <span>Üyelik ilerlemesi</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track h-2">
            <div className="progress-fill h-full" style={{ width: `${progress}%`, background: rankData.color }} />
          </div>
          {nextRank && (
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Sonraki: {nextRank.name} ({nextRank.minPoints - (profile?.total_points || 0)} kupa)
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { icon: Flame, label: 'Seri', value: `${profile?.streak_count || 0} gün` },
          { icon: Flame, label: 'En iyi seri', value: `${profile?.longest_streak || 0} gün` },
          { icon: Gamepad2, label: 'Bugün oyun', value: gamesPlayed },
          { icon: Trophy, label: 'Arena', value: rank.name.split(' ')[0] },
        ].map(s => (
          <div key={s.label} className="profile-stat-pill">
            <s.icon className="w-4 h-4 mx-auto mb-1 text-cr-gold" />
            <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {s.value}
            </p>
            <p className="text-[9px] uppercase font-bold mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Inventory / collection */}
      <RewardCollection id="rewards" showHeader />

      {/* Arena ladder - compact */}
      <section className="surface-panel p-4 rounded-xl">
        <h2 className="section-title mb-3">Arena ilerlemesi</h2>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {RANKS.map(r => {
            const unlocked = (profile?.total_points || 0) >= r.minPoints;
            const RIcon = RANK_ICONS[r.name] || Coffee;
            return (
              <div key={r.name} className="flex items-center gap-2 py-2 px-2 rounded-lg" style={{ background: unlocked ? `${r.color}10` : 'transparent' }}>
                <RIcon className="w-4 h-4 flex-shrink-0" style={{ color: unlocked ? r.color : 'var(--text-muted)' }} />
                <span className="text-xs font-bold uppercase flex-1" style={{ color: unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {r.name}
                </span>
                {unlocked && <span className="text-[9px] font-bold text-cr-gold">✓</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-2">
        <h2 className="section-title px-1">Ayarlar</h2>

        <div className="profile-settings-row">
          <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            Tema
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase min-h-[36px] ${theme === 'light' ? 'btn-duo btn-duo-gold' : 'btn-duo btn-duo-ghost'}`}
            >
              Açık
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase min-h-[36px] ${theme === 'dark' ? 'btn-duo btn-duo-gold' : 'btn-duo btn-duo-ghost'}`}
            >
              Koyu
            </button>
          </div>
        </div>

        <div className="profile-settings-row flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-sm font-semibold flex items-center gap-2 w-full sm:w-auto" style={{ color: 'var(--text-primary)' }}>
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Ses efektleri
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={e => setVolume(Number(e.target.value) / 100)}
              disabled={!soundOn}
              className="flex-1 max-w-[120px] h-2 accent-cr-gold"
              aria-label="Ses seviyesi"
            />
            <button
              type="button"
              onClick={() => setSoundOn(!soundOn)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase min-h-[36px] ${soundOn ? 'btn-duo btn-duo-green' : 'btn-duo btn-duo-ghost'}`}
            >
              {soundOn ? 'Açık' : 'Kapalı'}
            </button>
          </div>
        </div>

        <div className="profile-settings-row">
          <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Bell className="w-4 h-4" />
            Bildirimler
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
            Yakında
          </span>
        </div>

        {user && (
          <div className="surface-panel p-4 rounded-xl mt-2" style={{ borderColor: 'rgba(255,215,0,0.35)', borderWidth: 1 }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-cr-gold" />
              <span className="text-sm font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                Hesap
              </span>
            </div>
            {roleError && (
              <p className="text-xs mb-2 py-2 px-3 rounded-lg bg-cr-red/10 border border-cr-red/25" style={{ color: '#FF8A80' }}>
                {roleError}
              </p>
            )}
            {isAdmin ? (
              <button
                type="button"
                onClick={async () => {
                  setRoleLoading(true);
                  try {
                    await promoteToUser();
                    navigate('/dashboard');
                  } catch (e) {
                    setRoleError(e instanceof Error ? e.message : 'Hata');
                    setRoleLoading(false);
                  }
                }}
                disabled={roleLoading}
                className="btn-duo btn-duo-blue w-full py-3 rounded-xl text-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Kullanıcı modu
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setRoleLoading(true);
                  try {
                    await promoteToAdmin();
                    navigate('/admin-panel');
                  } catch (e) {
                    setRoleError(e instanceof Error ? e.message : 'Hata');
                    setRoleLoading(false);
                  }
                }}
                disabled={roleLoading}
                className="btn-duo btn-duo-gold w-full py-3 rounded-xl text-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Admin paneli
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
