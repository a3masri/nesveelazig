import { useEffect, useState } from 'react';
import { Ticket, Check, Search, Plus, Copy, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { createRedemptionCode, getRecentCodes, redeemCodeForUser, findProfileByDisplayName } from '../lib/db';
import type { RedemptionCode } from '../lib/types';

export default function Cashier() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const adminOnly = profile?.role === 'admin';
  const [tab, setTab] = useState<'generate' | 'redeem' | 'verify'>('generate');
  const [codePoints, setCodePoints] = useState(50);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{ success: boolean; message: string } | null>(null);
  const [verifyName, setVerifyName] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    display_name: string;
    current_rank: string;
    total_points: number;
    streak_count: number;
    role: string;
  } | null>(null);
  const [verifySearched, setVerifySearched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [recentCodes, setRecentCodes] = useState<RedemptionCode[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    getRecentCodes(user.id).then(setRecentCodes);
  }, [user, generatedCode]);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const code = await createRedemptionCode(codePoints, user.id);
      setGeneratedCode(code);
    } finally {
      setGenerating(false);
    }
  };

  const handleRedeem = async () => {
    if (!redeemCode.trim() || !customerName.trim()) return;
    setRedeeming(true);
    setRedeemResult(null);
    try {
      const result = await redeemCodeForUser(redeemCode, customerName);
      setRedeemResult({ success: result.ok, message: result.message });
      if (result.ok) {
        setRedeemCode('');
        setCustomerName('');
      }
    } catch {
      setRedeemResult({ success: false, message: 'Bir hata oluştu' });
    }
    setRedeeming(false);
  };

  const handleVerify = async () => {
    if (!verifyName.trim()) return;
    setVerifying(true);
    setVerifySearched(true);
    const data = await findProfileByDisplayName(verifyName);
    setVerifyResult(
      data
        ? {
            display_name: data.display_name,
            current_rank: data.current_rank,
            total_points: data.total_points,
            streak_count: data.streak_count,
            role: data.role,
          }
        : null
    );
    setVerifying(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-20 lg:pb-0 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
          Kasa Paneli
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Kod oluştur, müşteriye kupa yükle ve doğrula
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'generate' as const, label: 'Oluştur', icon: Plus },
          ...(!adminOnly
            ? [
                { key: 'redeem' as const, label: 'Yükle', icon: Ticket },
                { key: 'verify' as const, label: 'Doğrula', icon: Search },
              ]
            : []),
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`btn-duo flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs ${tab === t.key ? 'btn-duo-gold' : 'btn-duo-ghost'}`}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'generate' && (
        <div className="space-y-4 animate-slide-up">
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
            <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Kupa Değeri
            </label>
            <div className="flex gap-2 mb-4 flex-wrap">
              {[25, 50, 100, 200, 500].map(v => (
                <button key={v} onClick={() => setCodePoints(v)} className={`btn-duo px-4 py-2 rounded-2xl text-sm ${codePoints === v ? 'btn-duo-gold' : 'btn-duo-ghost'}`}>
                  {v}
                </button>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={generating} className="btn-duo btn-duo-green w-full py-3 rounded-2xl text-sm flex items-center justify-center gap-2">
              {generating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /> Kod Oluştur</>}
            </button>
            {generatedCode && (
              <div className="mt-4 p-4 rounded-xl text-center animate-bounce-in" style={{ background: 'rgba(255,215,0,0.05)', border: '2px solid rgba(255,215,0,0.3)' }}>
                <p className="text-xs mb-2 uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>
                  Oluşturulan Kod
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl font-bold text-cr-gold">{generatedCode}</span>
                  <button onClick={() => copyCode(generatedCode)} className="p-2 rounded-lg hover:bg-cr-gold/10">
                    {copied ? <Check className="w-4 h-4 text-cr-green" /> : <Copy className="w-4 h-4 text-cr-gold" />}
                  </button>
                </div>
                <p className="text-xs mt-2 font-bold" style={{ color: 'var(--text-muted)' }}>
                  {codePoints} kupa değerinde
                </p>
              </div>
            )}
          </div>
          {recentCodes.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-display font-bold text-sm uppercase" style={{ color: 'var(--text-primary)' }}>
                  Son Kodlar
                </h3>
              </div>
              {recentCodes.map(code => (
                <div key={code.id} className="flex items-center gap-3 p-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-mono text-sm font-bold text-cr-gold">{code.code}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {code.points_value} kupa
                  </span>
                  <span className={`ml-auto text-[10px] px-2 py-0.5 rounded font-bold uppercase ${code.status === 'active' ? 'bg-cr-green/15 text-cr-green' : 'bg-cr-gold/15 text-cr-gold'}`}>
                    {code.status === 'active' ? 'Aktif' : 'Kullanıldı'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!adminOnly && tab === 'redeem' && (
        <div className="rounded-2xl p-6 animate-slide-up space-y-4" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          <div>
            <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Müşteri Adı
            </label>
            <input
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Görünen ad"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
              style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Kod
            </label>
            <div className="flex gap-2">
              <input
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
                className="flex-1 px-4 py-3 rounded-xl font-mono text-sm font-bold outline-none uppercase"
                style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <button onClick={handleRedeem} disabled={redeeming || !redeemCode.trim() || !customerName.trim()} className="btn-duo btn-duo-green px-6 py-3 rounded-2xl text-sm flex items-center gap-2">
                {redeeming ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Yükle</>}
              </button>
            </div>
          </div>
          {redeemResult && (
            <div className={`p-4 rounded-xl text-sm font-bold ${redeemResult.success ? 'bg-cr-green/10 text-cr-green border border-cr-green/30' : 'bg-cr-red/10 border border-cr-red/30'}`} style={{ color: redeemResult.success ? undefined : '#FF8A80' }}>
              {redeemResult.message}
            </div>
          )}
        </div>
      )}

      {!adminOnly && tab === 'verify' && (
        <div className="rounded-2xl p-6 animate-slide-up" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Müşteri Adı
          </label>
          <div className="flex gap-2 mb-4">
            <input
              value={verifyName}
              onChange={e => {
                setVerifyName(e.target.value);
                setVerifySearched(false);
              }}
              placeholder="Görünen ad gir"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
              style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
            />
            <button onClick={handleVerify} disabled={verifying || !verifyName.trim()} className="btn-duo btn-duo-blue px-6 py-3 rounded-2xl text-sm flex items-center gap-2">
              {verifying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Search className="w-4 h-4" /> Ara</>}
            </button>
          </div>
          {verifyResult && (
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,215,0,0.12)' }}>
                  <User className="w-5 h-5 text-cr-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase" style={{ color: 'var(--text-primary)' }}>
                    {verifyResult.display_name}
                  </h4>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {verifyResult.current_rank}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { v: verifyResult.total_points, l: 'Kupa', c: 'text-cr-gold' },
                  { v: verifyResult.streak_count, l: 'Seri', c: 'text-cr-orange' },
                  { v: verifyResult.role, l: 'Rol', c: 'text-cr-green' },
                ].map(s => (
                  <div key={s.l} className="p-2 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                    <div className={`text-lg font-bold font-display ${s.c}`}>{s.v}</div>
                    <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {verifySearched && !verifyResult && !verifying && (
            <div className="p-4 rounded-xl text-center text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
              Bu isimde müşteri bulunamadı
            </div>
          )}
        </div>
      )}
    </div>
  );
}
