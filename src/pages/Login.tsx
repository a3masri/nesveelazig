import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock as LockIcon, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Logo } from '../components/Logo';
import { BattleSmoke } from '../components/Particles';
import { DEMO_ADMIN_EMAIL } from '../lib/localDb';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInDemo, user, isLocal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const isAdmin = user.email === DEMO_ADMIN_EMAIL || user.id === 'demo-admin-id';
      navigate(isAdmin ? '/admin-panel' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const goAdmin = (isAdmin: boolean) => navigate(isAdmin ? '/admin-panel' : '/dashboard');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      goAdmin(email.toLowerCase() === DEMO_ADMIN_EMAIL || email.toLowerCase() === 'admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google girişi başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-bounce-in">
          <div className="relative inline-block">
            <Logo size="hero" className="mx-auto mb-2" />
            <BattleSmoke />
          </div>
          <h1 className="font-display text-2xl font-bold text-stroke mt-4" style={{ color: 'var(--text-primary)' }}>
            Tekrar Hoş Geldin
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Macerana kaldığın yerden devam et
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full mb-4 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <GoogleIcon />
          Google ile Giriş Yap
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>veya</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block uppercase" style={{ color: 'var(--text-secondary)' }}>E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@nesve.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold mb-1.5 block uppercase" style={{ color: 'var(--text-secondary)' }}>Şifre</label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cr-gold/50"
                style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPw ? <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
              </button>
            </div>
          </div>
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-bold bg-cr-red/15 border border-cr-red/30" style={{ color: '#FF8A80' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-duo btn-duo-green w-full py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Giriş Yap <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {isLocal && (
          <div className="mt-6 space-y-2 p-4 rounded-2xl" style={{ background: 'rgba(255,215,0,0.06)', border: '1px dashed rgba(255,215,0,0.35)' }}>
            <div className="flex items-center gap-2 justify-center mb-2">
              <Shield className="w-4 h-4 text-cr-gold" />
              <span className="text-xs font-bold uppercase text-cr-gold">Demo Giriş</span>
            </div>
            <button
              type="button"
              onClick={() => { signInDemo('user'); navigate('/dashboard'); }}
              className="btn-duo btn-duo-blue w-full py-2.5 rounded-xl text-xs"
            >
              Demo Kullanıcı (Oyunlar + Dükkan)
            </button>
            <button
              type="button"
              onClick={() => { signInDemo('admin'); navigate('/admin-panel'); }}
              className="btn-duo btn-duo-gold w-full py-2.5 rounded-xl text-xs"
            >
              Demo Admin (Sadece Kod Paneli)
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
          Hesabın yok mu? <Link to="/kayit" className="font-bold text-cr-gold">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}
