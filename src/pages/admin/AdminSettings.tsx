import { useState, useEffect } from 'react';
import { Save, Coffee } from 'lucide-react';
import { getAdminSettings, saveAdminSettings } from '../../lib/adminService';
import { addAdminLog } from '../../lib/adminLogs';
import type { AdminSettings } from '../../lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getAdminSettings());
  }, []);

  if (!settings) return null;

  const handleSave = () => {
    saveAdminSettings(settings);
    addAdminLog({ type: 'system', action: 'Ayarlar güncellendi', actor_name: 'Admin', details: settings.programName });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
          Program Ayarları
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Platform geneli yapılandırma
        </p>
      </div>

      <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 text-cr-gold mb-2">
          <Coffee className="w-5 h-5" />
          <span className="font-bold text-sm uppercase">Genel</span>
        </div>

        <div>
          <label className="text-xs font-bold uppercase mb-1 block">Program Adı</label>
          <input
            value={settings.programName}
            onChange={e => setSettings({ ...settings, programName: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl text-sm"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase mb-1 block">Kayıt Bonusu (kupa)</label>
          <input
            type="number"
            value={settings.signupBonus}
            onChange={e => setSettings({ ...settings, signupBonus: parseInt(e.target.value, 10) || 0 })}
            className="w-full px-3 py-2.5 rounded-xl text-sm"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase mb-1 block">Kod Geçerlilik (gün)</label>
          <input
            type="number"
            value={settings.codeExpiryDays}
            onChange={e => setSettings({ ...settings, codeExpiryDays: parseInt(e.target.value, 10) || 30 })}
            className="w-full px-3 py-2.5 rounded-xl text-sm"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase mb-1 block">Günlük Max Kod</label>
          <input
            type="number"
            value={settings.maxDailyCodes}
            onChange={e => setSettings({ ...settings, maxDailyCodes: parseInt(e.target.value, 10) || 100 })}
            className="w-full px-3 py-2.5 rounded-xl text-sm"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer" style={{ background: 'var(--bg-secondary)' }}>
          <span className="text-sm font-bold">Yeni kayıtlara izin ver</span>
          <input
            type="checkbox"
            checked={settings.allowRegistration}
            onChange={e => setSettings({ ...settings, allowRegistration: e.target.checked })}
            className="w-5 h-5 accent-cr-gold"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer" style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)' }}>
          <div>
            <span className="text-sm font-bold text-cr-red block">Bakım modu</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Kullanıcılar giriş yapamaz (yakında)
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="w-5 h-5 accent-cr-red"
          />
        </label>

        <button type="button" onClick={handleSave} className="btn-duo btn-duo-green w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? 'Kaydedildi!' : 'Ayarları Kaydet'}
        </button>
      </div>
    </div>
  );
}
