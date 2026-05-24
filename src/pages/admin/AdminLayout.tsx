import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Ticket,
  Gift,
  ScrollText,
  Settings,
  Shield,
  User,
  LogOut,
  Download,
  Package,
  Bell,
  FileText,
  KeyRound,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Logo } from '../../components/Logo';
import { initAdminData, downloadFile, exportAdminData } from '../../lib/adminService';

const nav = [
  { to: '/admin-panel', label: 'Genel Bakış', icon: LayoutDashboard, end: true },
  { to: '/admin-panel/uyeler', label: 'Üyeler', icon: Users },
  { to: '/admin-panel/siparisler', label: 'Siparişler', icon: Package },
  { to: '/admin-panel/kodlar', label: 'Kodlar', icon: Ticket },
  { to: '/admin-panel/oduller', label: 'Ödüller', icon: Gift },
  { to: '/admin-panel/roller', label: 'Roller', icon: KeyRound },
  { to: '/admin-panel/bildirimler', label: 'Bildirimler', icon: Bell },
  { to: '/admin-panel/icerik', label: 'İçerik', icon: FileText },
  { to: '/admin-panel/kayitlar', label: 'Kayıtlar', icon: ScrollText },
  { to: '/admin-panel/ayarlar', label: 'Ayarlar', icon: Settings },
  { to: '/admin-panel/guvenlik', label: 'Güvenlik', icon: Shield },
];

export default function AdminLayout() {
  const { user, promoteToUser, signOut } = useAuth();
  const { toggle, theme } = useTheme();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    initAdminData();
  }, []);

  const handleExport = () => {
    downloadFile(exportAdminData(), `nesve-export-${Date.now()}.json`, 'application/json');
  };

  const navLinks = (
    <>
      <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 text-cr-gold hidden lg:block">Yönetim Merkezi</p>
      {nav.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setMobileNav(false)}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all min-h-[44px] ${
              isActive ? 'bg-cr-gold/20 text-cr-gold' : 'hover:bg-cr-gold/5'
            }`
          }
          style={({ isActive }) => ({ color: isActive ? '#FFD700' : 'var(--text-secondary)' })}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {item.label}
        </NavLink>
      ))}
      <div className="pt-3 mt-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
        <button
          type="button"
          onClick={handleExport}
          className="btn-duo btn-duo-ghost w-full flex items-center gap-2 px-3 py-3 text-xs font-bold min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          Veri Dışa Aktar
        </button>
        <NavLink
          to="/profile"
          onClick={() => setMobileNav(false)}
          className="btn-duo btn-duo-ghost w-full flex items-center gap-2 px-3 py-3 text-xs font-bold min-h-[44px]"
        >
          <User className="w-4 h-4" />
          Profil
        </NavLink>
        <button
          type="button"
          onClick={async () => {
            await promoteToUser();
            navigate('/dashboard');
          }}
          className="btn-duo btn-duo-blue w-full flex items-center gap-2 px-3 py-3 text-xs font-bold min-h-[44px]"
        >
          <User className="w-4 h-4" />
          Kullanıcı Modu
        </button>
        <button
          type="button"
          onClick={signOut}
          className="btn-duo btn-duo-red w-full flex items-center gap-2 px-3 py-3 text-xs font-bold min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          Çıkış
        </button>
      </div>
      {user?.email && (
        <p className="text-[10px] text-center pt-2 truncate" style={{ color: 'var(--text-muted)' }}>
          {user.email}
        </p>
      )}
    </>
  );

  return (
    <div className="admin-shell pb-8">
      {/* Mobile admin header — single sticky bar */}
      <header className="lg:hidden sticky top-0 z-40 -mx-4 px-4 pt-2 pb-2 mb-4 admin-mobile-header safe-area-top">
        <div
          className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl border backdrop-blur-md"
          style={{
            background: 'rgba(var(--bg-card-rgb), 0.95)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <Logo size="md" linkTo="/admin-panel" />
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-cr-gold/15 text-cr-gold border border-cr-gold/30">
            Admin
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggle}
              className="btn-duo btn-duo-ghost p-2.5 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
              aria-label={theme === 'light' ? 'Koyu mod' : 'Açık mod'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="btn-duo btn-duo-ghost p-2.5 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center"
              aria-label="Admin menü"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileNav && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setMobileNav(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <nav
            className="absolute right-0 top-0 h-full w-[min(18rem,88vw)] p-5 overflow-y-auto rounded-l-2xl border-l admin-mobile-drawer"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-sm font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                Menü
              </span>
              <button type="button" onClick={() => setMobileNav(false)} className="btn-duo btn-duo-ghost p-2 rounded-xl min-w-[44px] min-h-[44px]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">{navLinks}</div>
          </nav>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 min-h-0">
        <aside
          className="hidden lg:block lg:w-56 flex-shrink-0 rounded-2xl p-4 space-y-1 lg:sticky lg:top-8 h-fit"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="pb-4 mb-2 border-b flex justify-center" style={{ borderColor: 'var(--border)' }}>
            <Logo size="md" linkTo="/admin-panel" />
          </div>
          {navLinks}
        </aside>

        <div className="flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
