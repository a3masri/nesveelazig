import { useState, useEffect } from 'react';
import { Plus, Copy, Check, Zap, Ban } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createRedemptionCode } from '../../lib/db';
import { getAllCodes, revokeCode } from '../../lib/adminService';
import type { RedemptionCode } from '../../lib/types';

export default function AdminCodes() {
  const { user } = useAuth();
  const [codePoints, setCodePoints] = useState(100);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [codes, setCodes] = useState<RedemptionCode[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');

  const load = () => setCodes(getAllCodes());

  useEffect(() => {
    load();
  }, [generatedCode]);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const code = await createRedemptionCode(codePoints, user.id);
      setGeneratedCode(code);
      load();
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = filter === 'all' ? codes : codes.filter(c => c.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
          Kod Yönetimi
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Kupa kodları oluştur, izle ve iptal et
        </p>
      </div>

      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
        <div className="flex items-center gap-2 text-cr-gold">
          <Zap className="w-5 h-5" />
          <span className="text-sm font-bold uppercase">Yeni Kod</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[25, 50, 100, 200, 500, 1000].map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setCodePoints(v)}
              className={`btn-duo px-4 py-2 rounded-2xl text-sm ${codePoints === v ? 'btn-duo-gold' : 'btn-duo-ghost'}`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="btn-duo btn-duo-green w-full sm:w-auto px-8 py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
        >
          {generating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" /> Kod Üret
            </>
          )}
        </button>
        {generatedCode && (
          <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.3)' }}>
            <span className="font-mono text-xl font-bold text-cr-gold">{generatedCode}</span>
            <button type="button" onClick={() => copyCode(generatedCode)} className="p-2 rounded-lg">
              {copied ? <Check className="w-5 h-5 text-cr-green" /> : <Copy className="w-5 h-5 text-cr-gold" />}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {([['all', 'Tümü'], ['active', 'Aktif'], ['used', 'Kullanıldı'], ['expired', 'İptal']] as const).map(([f, l]) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`btn-duo px-4 py-2 rounded-2xl text-xs ${filter === f ? 'btn-duo-blue' : 'btn-duo-ghost'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="hidden sm:grid grid-cols-12 gap-2 p-3 text-[10px] font-bold uppercase border-b" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <span className="col-span-3">Kod</span>
          <span className="col-span-2">Kupa</span>
          <span className="col-span-2">Durum</span>
          <span className="col-span-3">Tarih</span>
          <span className="col-span-2 text-right">İşlem</span>
        </div>
        {filtered.map(c => (
          <div key={c.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 border-b last:border-0 items-center" style={{ borderColor: 'var(--border)' }}>
            <span className="sm:col-span-3 font-mono font-bold text-cr-gold">{c.code}</span>
            <span className="sm:col-span-2 text-sm">{c.points_value}</span>
            <span className="sm:col-span-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  c.status === 'active' ? 'bg-cr-green/15 text-cr-green' : c.status === 'used' ? 'bg-cr-gold/15 text-cr-gold' : 'bg-cr-red/15 text-cr-red'
                }`}
              >
                {c.status === 'active' ? 'Aktif' : c.status === 'used' ? 'Kullanıldı' : 'İptal'}
              </span>
            </span>
            <span className="sm:col-span-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              {new Date(c.created_at).toLocaleString('tr-TR')}
            </span>
            <div className="sm:col-span-2 flex justify-end gap-1">
              <button type="button" onClick={() => copyCode(c.code)} className="btn-duo btn-duo-ghost p-2 rounded-lg">
                <Copy className="w-3.5 h-3.5" />
              </button>
              {c.status === 'active' && (
                <button
                  type="button"
                  onClick={() => {
                    revokeCode(c.id);
                    load();
                  }}
                  className="btn-duo btn-duo-red p-2 rounded-lg"
                  title="İptal et"
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Kod bulunamadı
          </p>
        )}
      </div>
    </div>
  );
}
