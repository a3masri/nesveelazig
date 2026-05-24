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
  Star,
} from 'lucide-react';

const userNav = [
  { path: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { path: '/progress', label: 'Mevsim Yolu', icon: BarChart3 },
  { path: '/store', label: 'Dükkan', icon: ShoppingBag },
  { path: '/oyunlar', label: 'Oyunlar', icon: Gamepad2 },
  { path: '/profile#rewards', label: 'Koleksiyon', icon: Archive },
  { path: '/achievements', label: 'Rozetler', icon: Award },
  { path: '/leaderboard', label: 'Sıralama', icon: Trophy },
  { path: '/kod', label: 'Kod Kullan', icon: Ticket },
  { path: '/profile', label: 'Profil', icon: User },
];

/** Primary mobile tab bar — 5 most-used destinations */
const mobileTabs = [
  { path: '/dashboard', label: 'Ana', icon: Home },
  { path: '/progress', label: 'Yol', icon: BarChart3 },
  { path: '/store', label: 'Dükkan', icon: ShoppingBag },
  { path: '/oyunlar', label: 'Oyun', icon: Gamepad2 },
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

function isTabActive(pathname: string, path: string) {
  const base = path.split('#')[0];
  if (path === '/profile') {
    return pathname === '/profile' || pathname === '/inventory';
  }
  if (path === '/oyunlar') {
    return pathname === '/oyunlar' || pathname.startsWith('/oyunlar/');
  }
  return pathname === base || pathname.startsWith(base + '/');
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const { theme, setTheme, toggle } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isAdminDashboard = isAdmin && location.pathname.startsWith('/admin-panel');
  const navItems = isAdmin ? adminNav : userNav;
  const showMobileChrome = !isAdmin && !isAdminDashboard;
  const points = profile?.total_points ?? 0;

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  if (publicPaths.includes(location.pathname)) return <>{children}</>;

  const adminPaths = ['/admin-panel', '/profile', '/cashier'];
  const isAdminRoute = adminPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'));

  if (!loading && isAdmin && userOnlyPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))) {
    if (location.pathname.startsWith('/oyunlar')) return <Navigate to="/admin-panel" replace />;
    if (!isAdminRoute) return <Navigate to="/admin-panel" replace />;
  }

  return (
    <div className="mobile-app-root flex min-h-[100dvh] relative" style={{ background: 'var(--bg-primary)' }}>
      <BrandBackground />

      {/* Desktop sidebar */}
      {!isAdminDashboard && (
        <aside
          className="hidden lg:flex flex-col w-72 fixed h-full z-30 border-r"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="p-5 flex justify-center border-b" style={{ borderColor: 'var(--border)' }}>
            <Logo size="xl" linkTo={isAdmin ? '/admin-panel' : '/dashboard'} />
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain">
            {navItems.map(item => {
              const basePath = item.path.split('#')[0];
              const active =
                location.pathname === basePath ||
                (item.path.startsWith('/profile#') && location.pathname === '/profile') ||
                (item.path !== '/admin-panel' && !item.path.startsWith('/profile#') && location.pathname.startsWith(item.path.split('#')[0] + '/')) ||
                (item.path === '/admin-panel' && location.pathname === '/admin-panel');
              const to = item.path;
              return (
                <Link
                  key={item.path}
                  to={to}
                  onMouseEnter={playHover}
                  onClick={playTap}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all min-h-[48px] ${active ? 'bg-cr-gold/20 text-cr-gold' : 'hover:bg-cr-gold/5'}`}
                  style={{ color: active ? '#FFD700' : 'var(--text-secondary)' }}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <button type="button" onClick={() => setTheme('light')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase min-h-[40px] ${theme === 'light' ? 'bg-cr-gold/25 text-cr-gold' : ''}`}>
                <Sun className="w-4 h-4" /> Açık
              </button>
              <button type="button" onClick={() => setTheme('dark')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase min-h-[40px] ${theme === 'dark' ? 'bg-cr-gold/25 text-cr-gold' : ''}`}>
                <Moon className="w-4 h-4" /> Koyu
              </button>
            </div>
            {user && (
              <button type="button" onClick={signOut} className="btn-duo btn-duo-red w-full flex items-center gap-3 px-3 py-2.5 text-sm min-h-[48px]">
                <LogOut className="w-5 h-5" />
                Çıkış
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Mobile top bar — single fixed header */}
      {showMobileChrome && (
        <header className="mobile-top-bar lg:hidden">
          <div className="mobile-top-bar-inner">
            <Logo size="md" linkTo="/dashboard" className="flex-shrink-0" />
            <Link
              to="/profile"
              className="mobile-points-chip"
              onClick={playTap}
            >
              <Star className="w-3.5 h-3.5 text-cr-gold flex-shrink-0" />
              <span>{points.toLocaleString('tr-TR')}</span>
            </Link>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  toggle();
                }}
                className="mobile-icon-btn"
                aria-label={theme === 'light' ? 'Koyu mod' : 'Açık mod'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setMobileOpen(true);
                }}
                className="mobile-icon-btn"
                aria-label="Menü"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile drawer menu */}
      {mobileOpen && showMobileChrome && (
        <div className="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menü">
          <button type="button" className="absolute inset-0 bg-black/60 w-full h-full" aria-label="Kapat" onClick={() => setMobileOpen(false)} />
          <nav
            className="mobile-drawer absolute right-0 top-0 h-full w-[min(20rem,92vw)] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-display text-sm font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                Menü
              </span>
              <button type="button" onClick={() => setMobileOpen(false)} className="mobile-icon-btn" aria-label="Kapat">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-1">
              {userNav.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    playTap();
                    setMobileOpen(false);
                  }}
                  className="mobile-drawer-link"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="btn-duo btn-duo-red w-full py-3 rounded-xl text-sm min-h-[48px] flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" /> Çıkış
              </button>
            </div>
          </nav>
        </div>
      )}

      <main
        className={`app-main-layer flex-1 w-full min-w-0 flex flex-col ${
          isAdminDashboard ? '' : 'lg:ml-72'
        } ${showMobileChrome ? 'mobile-main' : isAdminDashboard ? 'admin-main-mobile' : ''}`}
      >
        <div
          className={`flex-1 w-full max-w-6xl mx-auto px-4 sm:px-5 ${
            isAdmin ? 'max-w-7xl lg:p-8 lg:px-8' : 'lg:p-8'
          } ${showMobileChrome ? 'mobile-main-inner' : 'py-4 lg:py-8'}`}
        >
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      {showMobileChrome && (
        <nav className="mobile-tab-bar lg:hidden" aria-label="Ana navigasyon">
          {mobileTabs.map(item => {
            const active = isTabActive(location.pathname, item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={playTap}
                className={`mobile-tab-item ${active ? 'mobile-tab-item--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
