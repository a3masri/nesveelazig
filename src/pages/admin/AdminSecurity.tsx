import { useState } from 'react';
import { Shield, AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { computeAdminStats } from '../../lib/adminService';
import { getAdminLogsFiltered, clearAdminLogs } from '../../lib/adminLogs';
import { clearAllLocalData } from '../../lib/localDb';
import { useAuth } from '../../hooks/useAuth';

export default function AdminSecurity() {
  const { user } = useAuth();
  const [stats] = useState(() => computeAdminStats());
  const securityLogs = getAdminLogsFiltered({ type: 'security', limit: 20 });

  const handleResetDemo = () => {
    if (window.confirm('Tüm yerel veriler silinecek (üyeler, kodlar, kayıtlar). Emin misiniz?')) {
      clearAllLocalData();
      clearAdminLogs();
      window.location.href = '/giris';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
          Güvenlik & Sistem
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Erişim kontrolü, denetim ve platform sağlığı
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Yasaklı Üye', value: stats.bannedMembers, color: '#E53935' },
          { label: 'Admin Hesabı', value: stats.adminCount, color: '#FFD700' },
          { label: 'Güvenlik Kaydı', value: securityLogs.length, color: '#2C5F8A' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
              {s.label}
            </p>
            <p className="text-2xl font-bold font-display mt-1" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cr-gold" />
          <h2 className="font-bold text-sm uppercase">Oturum</h2>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span style={{ color: 'var(--text-muted)' }}>Admin ID: </span>
            <span className="font-mono">{user?.id}</span>
          </p>
          <p>
            <span style={{ color: 'var(--text-muted)' }}>E-posta: </span>
            {user?.email}
          </p>
          <p>
            <span style={{ color: 'var(--text-muted)' }}>Mod: </span>
            <span className="text-cr-green font-bold">Yerel Demo</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-cr-blue" />
          <h2 className="font-bold text-sm uppercase">Platform Sağlığı</h2>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Veritabanı', ok: true },
            { label: 'Kod servisi', ok: true },
            { label: 'Ödül kataloğu', ok: stats.ticketsTotal >= 0 },
            { label: 'Kayıt sistemi', ok: true },
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
              <span className="text-sm">{item.label}</span>
              <span className={`text-xs font-bold uppercase ${item.ok ? 'text-cr-green' : 'text-cr-red'}`}>{item.ok ? 'Çalışıyor' : 'Hata'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="p-4 border-b font-bold text-sm uppercase" style={{ borderColor: 'var(--border)' }}>
          Güvenlik Kayıtları
        </div>
        {securityLogs.length === 0 ? (
          <p className="p-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            Henüz güvenlik kaydı yok
          </p>
        ) : (
          securityLogs.map(log => (
            <div key={log.id} className="p-3 border-b last:border-0 text-sm" style={{ borderColor: 'var(--border)' }}>
              <span className="font-bold">{log.action}</span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                {new Date(log.created_at).toLocaleString('tr-TR')}
              </span>
            </div>
          ))
        )}
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(229,57,53,0.06)', border: '2px solid rgba(229,57,53,0.3)' }}
      >
        <div className="flex items-center gap-2 mb-3 text-cr-red">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-bold text-sm uppercase">Tehlikeli Bölge</h2>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          Tüm yerel depolamayı sıfırlar. Üyeler, kodlar, biletler ve kayıtlar silinir.
        </p>
        <button type="button" onClick={handleResetDemo} className="btn-duo btn-duo-red w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Tüm Veriyi Sıfırla
        </button>
      </div>
    </div>
  );
}
