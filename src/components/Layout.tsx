import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '../hooks/useTheme';
import { Logo } from './Logo';
import { BrandBackground } from './BrandBackground';
import { playTap, playHover } from '../lib/sounds';
import {
  Home,
  Trophy,
  ShoppingBag,
  Archive,
  Award,
  BarChart3,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Ticket,
  Gamepad2,
  LayoutDashboard,
  Users,
  Gift,
  ScrollText,
  Settings,
  Shield,
} from 'lucide-react';

const userNav = [
  { path: '/dashboard', label: 'Ana', icon: Home },
  { path: '/progress', label: 'Yol', icon: BarChart3 },
  { path: '/store', label: 'Dükkan', icon: ShoppingBag },
  { path: '/oyunlar', label: 'Oyun', icon: Gamepad2 },
  { path: '/inventory', label: 'Kart', icon: Archive },
  { path: '/achievements', label: 'Rozet', icon: Award },
  { path: '/leaderboard', label: 'Sıra', icon: Trophy },
  { path: '/kod', label: 'Kod', icon: Ticket },
  { path: '/profile', label: 'Profil', icon: User },
];

const adminNav = [
  { path: '/admin-panel', label: 'Özet', icon: LayoutDashboard },
  { path: '/admin-panel/uyeler', label: 'Üyeler', icon: Users },
  { path: '/admin-panel/siparisler', label: 'Sipariş', icon: ShoppingBag },
  { path: '/admin-panel/kodlar', label: 'Kodlar', icon: Ticket },
  { path: '/admin-panel/oduller', label: 'Ödüller', icon: Gift },
  { path: '/admin-panel/kayitlar', label: 'Kayıtlar', icon: ScrollText },
  { path: '/profile', label: 'Profil', icon: User },
];

const publicPaths = ['/', '/hakkimizda', '/iletisim', '/gizlilik', '/kullanim-kosullari', '/giris', '/kayit'];

const userOnlyPaths = ['/dashboard', '/progress', '/store', '/inventory', '/achievements', '/leaderboard', '/profile', '/kod', '/oyunlar'];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const { theme, setTheme, toggle } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isAdminDashboard = isAdmin && location.pathname.startsWith('/admin-panel');
  const navItems = isAdmin ? adminNav : userNav;

  useEffect(() => {
    if (!loading && isAdmin && userOnlyPaths.some(p => location.pathname.startsWith(p))) {
      // redirect handled below
    }
  }, [loading, isAdmin, location.pathname]);

  if (publicPaths.includes(location.pathname)) return <>{children}</>;

  const adminPaths = ['/admin-panel', '/profile', '/cashier'];
  const isAdminRoute = adminPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));

  if (!loading && isAdmin && userOnlyPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))) {
    if (location.pathname.startsWith('/oyunlar')) return <Navigate to="/admin-panel" replace />;
    if (!isAdminRoute) return <Navigate to="/admin-panel" replace />;
  }

  return (
    <div className="flex min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      <BrandBackground />
      {!isAdminDashboard && (
      <aside
        className="hidden lg:flex flex-col w-72 fixed h-full z-30 border-r"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="p-5 flex justify-center border-b" style={{ borderColor: 'var(--border)' }}>
          <Logo size="xl" linkTo={isAdmin ? '/admin-panel' : '/dashboard'} />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const basePath = item.path.split('#')[0];
            const active =
              location.pathname === basePath ||
              (item.path === '/inventory' && location.pathname === '/profile') ||
              (item.path !== '/admin-panel' && item.path !== '/inventory' && location.pathname.startsWith(item.path + '/')) ||
              (item.path === '/admin-panel' && location.pathname === '/admin-panel');
            const to = item.path === '/inventory' ? '/profile#rewards' : item.path;
            return (
              <Link
                key={item.path}
                to={to}
                onMouseEnter={playHover}
                onClick={playTap}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${active ? 'bg-cr-gold/20 text-cr-gold' : 'hover:bg-cr-gold/5'}`}
                style={{ color: active ? '#FFD700' : 'var(--text-secondary)' }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase ${theme === 'light' ? 'bg-cr-gold/25 text-cr-gold' : ''}`}
            >
              <Sun className="w-4 h-4" /> Açık
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase ${theme === 'dark' ? 'bg-cr-gold/25 text-cr-gold' : ''}`}
            >
              <Moon className="w-4 h-4" /> Koyu
            </button>
          </div>
          {user && (
            <button type="button" onClick={signOut} className="btn-duo btn-duo-red w-full flex items-center gap-3 px-3 py-2.5 text-sm">
              <LogOut className="w-5 h-5" />
              Çıkış
            </button>
          )}
        </div>
      </aside>
      )}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 px-3 pt-2 pb-1 pointer-events-none safe-area-top">
        <div
          className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl border backdrop-blur-md pointer-events-auto"
          style={{
            background: 'rgba(var(--bg-card-rgb), 0.92)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <Logo size="lg" linkTo={isAdmin ? '/admin-panel' : '/dashboard'} />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggle}
              className="btn-duo btn-duo-ghost p-2.5 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
              aria-label={theme === 'light' ? 'Koyu mod' : 'Açık mod'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn-duo btn-duo-ghost p-2.5 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
              aria-label="Menü"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <nav
            className="absolute right-0 top-0 h-full w-72 max-w-[min(18rem,88vw)] p-6 space-y-2 overflow-y-auto rounded-l-2xl border-l"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-premium)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            {navItems.map(item => {
              const to = item.path === '/inventory' ? '/profile#rewards' : item.path;
              return (
              <Link
                key={item.path}
                to={to}
                onClick={() => {
                  playTap();
                  setMobileOpen(false);
                }}
                className="btn-duo btn-duo-ghost flex items-center gap-3 px-4 py-3 text-sm w-full"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
            })}
            <button type="button" onClick={() => { signOut(); setMobileOpen(false); }} className="btn-duo btn-duo-red w-full mt-4 py-3 flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" /> Çıkış
            </button>
          </nav>
        </div>
      )}

      <main className={`app-main-layer flex-1 min-h-screen pt-[5.75rem] lg:pt-0 w-full min-w-0 ${isAdminDashboard ? '' : 'lg:ml-72'}`}>
        <div className={isAdmin ? 'max-w-7xl mx-auto p-4 lg:p-8' : 'max-w-6xl mx-auto p-4 lg:p-8'}>{children}</div>
      </main>

      {!isAdmin && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-2 pointer-events-none safe-area-bottom">
          <div
            className="flex justify-around py-1.5 rounded-2xl border backdrop-blur-md pointer-events-auto"
            style={{
              background: 'rgba(var(--bg-card-rgb), 0.92)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            {userNav.slice(0, 5).map(item => {
              const basePath = item.path.split('#')[0];
              const active =
                location.pathname === basePath ||
                (item.path === '/inventory' && location.pathname === '/profile');
              const to = item.path === '/inventory' ? '/profile#rewards' : item.path;
              return (
                <Link
                  key={item.path}
                  to={to}
                  onClick={playTap}
                  className="flex flex-col items-center justify-center py-1.5 px-2 min-h-[52px] min-w-[52px] rounded-xl text-[8px] font-bold uppercase transition-colors"
                  style={{ color: active ? '#FFD700' : 'var(--text-muted)' }}
                >
                  <item.icon className="w-5 h-5 mb-0.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
