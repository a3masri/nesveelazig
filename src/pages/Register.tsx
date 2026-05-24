import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock as LockIcon, User, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { BattleSmoke } from '../components/Particles';
import { SIGNUP_BONUS_POINTS } from '../lib/constants';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!displayName.trim()) {
      setError('Görünen ad gerekli');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, displayName.trim());
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-bounce-in">
          <div className="relative inline-block">
            <Logo size="lg" className="mx-auto mb-4" />
            <BattleSmoke />
          </div>
          <h1 className="font-display text-3xl font-bold text-stroke" style={{ color: 'var(--text-primary)' }}>
            Arenaya Katıl
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Neşve yolculuğuna bugün başla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
          <div>
            <label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Kahraman Adı
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="KahveSevdalisi42"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@nesve.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Şifre
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-bold bg-cr-red/15 border border-cr-red/30" style={{ color: '#FF8A80' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-duo btn-duo-green w-full py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Hesap Oluştur
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-2 justify-center">
          <Shield className="w-4 h-4 text-cr-gold" />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Kayıtta {SIGNUP_BONUS_POINTS} bonus kupa kazan!
          </span>
        </div>

        <p className="text-center text-xs mt-8 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Zaten üye misin?{' '}
          <Link to="/giris" className="font-bold text-cr-gold hover:text-cr-orange transition-colors">
            Giriş Yap
          </Link>
        </p>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Kayıt olarak{' '}
          <Link to="/kullanim-kosullari" className="underline hover:text-cr-gold">
            Kullanım Koşulları
          </Link>
          {' '}ve{' '}
          <Link to="/gizlilik" className="underline hover:text-cr-gold">
            Gizlilik Politikası
          </Link>
          &apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
