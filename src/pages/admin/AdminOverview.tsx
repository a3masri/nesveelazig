import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, Ticket, Gift, TrendingUp, Activity, ChevronRight, Zap } from 'lucide-react';
import {
  computeAdminStats,
  getActivityByDay,
  getRankDistribution,
  getTopMembers,
  type AdminStats,
} from '../../lib/adminService';
import { getAdminLogsFiltered, LOG_TYPE_COLORS, LOG_TYPE_LABELS } from '../../lib/adminLogs';

function StatCard({ icon: Icon, label, value, sub, color }: { icon: typeof Users; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl p-4 card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
          <p className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
          </p>
          {sub && (
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {sub}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<{ label: string; count: number }[]>([]);
  const [ranks, setRanks] = useState<{ rank: string; count: number }[]>([]);
  const [top, setTop] = useState<ReturnType<typeof getTopMembers>>([]);
  const [recent, setRecent] = useState<ReturnType<typeof getAdminLogsFiltered>>([]);

  const refresh = () => {
    setStats(computeAdminStats());
    setActivity(getActivityByDay(7));
    setRanks(getRankDistribution());
    setTop(getTopMembers(5));
    setRecent(getAdminLogsFiltered({ limit: 8 }));
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, []);

  if (!stats) return null;

  const maxActivity = Math.max(...activity.map(a => a.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
          Genel Bakış
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Program sağlığı, KPI'lar ve canlı aktivite
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Toplam Üye" value={stats.totalMembers} sub={`${stats.newMembersWeek} yeni (7g)`} color="#2C5F8A" />
        <StatCard icon={Activity} label="Aktif Üye" value={stats.activeMembers} sub={`${stats.bannedMembers} yasaklı`} color="#4CAF50" />
        <StatCard icon={Star} label="Toplam Kupa" value={stats.totalPoints} sub={`Ort. ${stats.avgPoints}`} color="#FFD700" />
        <StatCard icon={Ticket} label="Kodlar" value={stats.codesActive} sub={`${stats.codesUsed} kullanıldı`} color="#FF6B35" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cr-gold" />
            <h2 className="font-bold text-sm uppercase">7 Günlük Aktivite</h2>
          </div>
          <div className="flex items-end gap-2 h-32">
            {activity.map(a => (
              <div key={a.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-cr-gold">{a.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max(8, (a.count / maxActivity) * 100)}%`,
                    background: '#FFD700',
                    minHeight: 8,
                  }}
                />
                <span className="text-[9px] uppercase" style={{ color: 'var(--text-muted)' }}>
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cr-gold" />
            <h2 className="font-bold text-sm uppercase">Arena Dağılımı</h2>
          </div>
          <div className="space-y-2">
            {ranks.slice(0, 6).map(r => (
              <div key={r.rank} className="flex items-center gap-2">
                <span className="text-xs w-28 truncate font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {r.rank}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div
                    className="h-full rounded-full bg-cr-gold"
                    style={{ width: `${(r.count / Math.max(stats.totalMembers, 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold w-6 text-right">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm uppercase">En İyi Üyeler</h2>
            <Link to="/admin-panel/uyeler" className="text-xs text-cr-gold flex items-center gap-1 font-bold">
              Tümü <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {top.map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 p-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="w-6 text-center font-bold text-cr-gold">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{m.display_name}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {m.current_rank}
                </p>
              </div>
              <span className="text-sm font-bold text-cr-gold">{m.total_points.toLocaleString('tr-TR')}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm uppercase">Son Kayıtlar</h2>
            <Link to="/admin-panel/kayitlar" className="text-xs text-cr-gold flex items-center gap-1 font-bold">
              Tümü <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {recent.map(log => (
            <div key={log.id} className="flex items-start gap-3 p-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0"
                style={{ background: `${LOG_TYPE_COLORS[log.type]}25`, color: LOG_TYPE_COLORS[log.type] }}
              >
                {LOG_TYPE_LABELS[log.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{log.action}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {log.details || log.actor_name}
                </p>
              </div>
              <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                {new Date(log.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Gift} label="Aktif Kartlar" value={stats.ticketsActive} sub={`${stats.ticketsTotal} toplam`} color="#7B1FA2" />
        <StatCard icon={Ticket} label="Bugün Kullanılan" value={stats.pointsRedeemedToday} sub="kupa (tahmini)" color="#E53935" />
        <StatCard icon={Users} label="Admin" value={stats.adminCount} color="#607D8B" />
        <StatCard icon={Activity} label="Üretilen Kod" value={stats.codesGenerated} color="#FFD700" />
      </div>
    </div>
  );
}
