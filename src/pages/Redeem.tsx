import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { redeemCode } from '../lib/db';
import { updateProfilePoints } from '../lib/profileUtils';
import { getRankForPoints } from '../lib/constants';
import { playCelebrate, playLose, playTap } from '../lib/sounds';

export default function Redeem() {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleRedeem = async () => {
    if (!code.trim() || !user || !profile) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await redeemCode(code, user.id);
      if (!res.ok) {
        playLose();
        setResult({ success: false, message: res.error || 'Geçersiz veya süresi dolmuş kod' });
        setLoading(false);
        return;
      }

      const newPoints = profile.total_points + (res.points || 0);
      const { error: pointsError } = await updateProfilePoints(user.id, newPoints);
      if (pointsError) {
        setResult({ success: false, message: 'Kupalar eklenemedi' });
        setLoading(false);
        return;
      }

      const rank = getRankForPoints(newPoints);
      await setProfile({ ...profile, total_points: newPoints, current_rank: rank.name });
      setCode('');
      playCelebrate();
      setResult({
        success: true,
        message: `Tebrikler! ${res.points} kupa hesabına eklendi.`,
      });
    } catch {
      setResult({ success: false, message: 'Bir hata oluştu' });
    }
    setLoading(false);
  };

  return (
    <div className="page-stack animate-fade-in overflow-x-hidden">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-stroke" style={{ color: 'var(--text-primary)' }}>
          Kod Kullan
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Kasadan aldığın kodu buraya girerek kupalarını topla
        </p>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
        <label className="text-xs font-bold mb-2 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Kupon Kodu
        </label>
        <div className="flex gap-2 mb-4">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="XXXXXXXX"
            className="flex-1 px-4 py-3 rounded-xl font-mono text-sm font-bold outline-none focus:ring-2 focus:ring-cr-gold/50 uppercase"
            style={{ background: 'var(--bg-secondary)', border: '2px solid var(--border)', color: 'var(--text-primary)', letterSpacing: '0.1em' }}
          />
          <button
            onClick={() => {
              playTap();
              handleRedeem();
            }}
            disabled={loading || !code.trim()}
            className="btn-duo btn-duo-green px-6 py-3 rounded-2xl text-sm flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                Kullan
              </>
            )}
          </button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-xl text-sm font-bold animate-slide-up ${
              result.success ? 'bg-cr-green/10 text-cr-green border border-cr-green/30' : 'bg-cr-red/10 border border-cr-red/30'
            }`}
            style={{ color: result.success ? undefined : '#FF8A80' }}
          >
            {result.message}
          </div>
        )}
      </div>

      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)' }}>
        <Star className="w-5 h-5 text-cr-gold flex-shrink-0" />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Mevcut kupaların: <strong className="text-cr-gold">{profile?.total_points || 0}</strong>
        </p>
      </div>
    </div>
  );
}
