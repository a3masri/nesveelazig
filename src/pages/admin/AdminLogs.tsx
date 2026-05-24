import { useState, useEffect } from 'react';
import { Search, Download, Trash2 } from 'lucide-react';
import { getAdminLogsFiltered, clearAdminLogs, LOG_TYPE_LABELS, LOG_TYPE_COLORS } from '../../lib/adminLogs';
import { exportLogsCsv, downloadFile } from '../../lib/adminService';
import type { AdminLog, AdminLogType } from '../../lib/types';

const TYPES: (AdminLogType | 'all')[] = ['all', 'auth', 'code', 'redeem', 'purchase', 'user', 'reward', 'security', 'system'];

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<AdminLogType | 'all'>('all');

  const load = () => setLogs(getAdminLogsFiltered({ type, search, limit: 150 }));

  useEffect(() => {
    load();
  }, [search, type]);

  const handleExport = () => {
    downloadFile(exportLogsCsv(), `nesve-logs-${Date.now()}.csv`, 'text/csv');
  };

  const handleClear = () => {
    if (window.confirm('Tüm kayıtlar silinsin mi? Bu işlem geri alınamaz.')) {
      clearAdminLogs();
      load();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
            Aktivite Kayıtları
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Denetim izi — kim, ne, ne zaman
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} className="btn-duo btn-duo-blue px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button type="button" onClick={handleClear} className="btn-duo btn-duo-red px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Temizle
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kayıt ara..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`btn-duo px-3 py-2 rounded-xl text-[10px] font-bold uppercase ${type === t ? 'btn-duo-gold' : 'btn-duo-ghost'}`}
            >
              {t === 'all' ? 'Tümü' : LOG_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {logs.map(log => (
          <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase w-fit"
              style={{ background: `${LOG_TYPE_COLORS[log.type]}25`, color: LOG_TYPE_COLORS[log.type] }}
            >
              {LOG_TYPE_LABELS[log.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{log.action}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                {[log.actor_name, log.target_name, log.details].filter(Boolean).join(' · ')}
              </p>
            </div>
            <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
              {new Date(log.created_at).toLocaleString('tr-TR')}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Kayıt yok
          </p>
        )}
      </div>
    </div>
  );
}
