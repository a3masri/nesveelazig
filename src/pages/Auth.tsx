import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Mail, Lock as LockIcon, User, Eye, EyeOff, ArrowRight, Crown, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { BattleSmoke } from '../components/Particles';
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); setLoading(true); try { if (isLogin) { await signIn(email, password); } else { if (!displayName.trim()) { setError('Display name is required'); setLoading(false); return; } await signUp(email, password, displayName); } navigate('/dashboard'); } catch (err: any) { setError(err.message || 'Something went wrong'); } finally { setLoading(false); } };
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-bounce-in"><div className="relative inline-block"><div className="w-16 h-16 rounded-2xl bg-cr-gold flex items-center justify-center mx-auto mb-4" style={{ boxShadow: '0 0 20px rgba(255,215,0,0.4)' }}><Crown className="w-8 h-8 text-cr-sky" /></div><BattleSmoke /></div><h1 className="font-display text-3xl font-bold text-stroke" style={{ color: 'var(--text-primary)' }}>{isLogin ? 'Return To Battle' : 'Join The Arena'}</h1><p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{isLogin ? 'Your quest continues' : 'Start your conquest today'}</p></div>
        <div className="flex rounded-2xl p-1 mb-6 animate-slide-up" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 ${isLogin ? 'bg-[var(--btn-secondary)] text-white shadow-md' : ''}`} style={!isLogin ? { color: 'var(--text-secondary)' } : {}}>Sign In</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 ${!isLogin ? 'bg-[var(--btn-secondary)] text-white shadow-md' : ''}`} style={isLogin ? { color: 'var(--text-secondary)' } : {}}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {!isLogin && <div><label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Warrior Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" /><input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="CoffeeLover42" className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-cr-gold/50" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} /></div></div>}
          <div><label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="warrior@nesve.com" required className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-cr-gold/50" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} /></div></div>
          <div><label className="text-xs font-bold mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Password</label><div className="relative"><LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" /><input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" required minLength={6} className="w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-cr-gold/50" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)' }} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
          {error && <div className="px-4 py-3 rounded-xl text-sm font-bold bg-cr-red/15 border border-cr-red/30 animate-slide-up" style={{ color: '#FF8A80' }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn-duo btn-duo-green w-full py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">{loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? 'Enter Arena' : 'Create Account'}<ArrowRight className="w-4 h-4" /></>}</button>
        </form>
        {!isLogin && <div className="mt-6 flex items-center gap-2 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}><Shield className="w-4 h-4 text-cr-gold" /><span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Earn 50 bonus trophies on signup!</span></div>}
        <p className="text-center text-xs mt-8 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{isLogin ? "New warrior? " : 'Already fighting? '}<button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-bold text-cr-gold hover:text-cr-orange transition-colors">{isLogin ? 'Register' : 'Sign In'}</button></p>
      </div>
    </div>
  );
}
