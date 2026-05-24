import { useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
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
  const navigate = useNavigate();

  useEffect(() => {
    initAdminData();
  }, []);

  const handleExport = () => {
    downloadFile(exportAdminData(), `nesve-export-${Date.now()}.json`, 'application/json');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      <aside
        className="lg:w-56 flex-shrink-0 rounded-2xl p-4 space-y-1 h-fit lg:sticky lg:top-8"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="pb-4 mb-2 border-b flex justify-center" style={{ borderColor: 'var(--border)' }}>
          <Logo size="md" linkTo="/admin-panel" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 text-cr-gold">Yönetim Merkezi</p>
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                isActive ? 'bg-cr-gold/20 text-cr-gold' : 'hover:bg-cr-gold/5'
              }`
            }
            style={({ isActive }) => ({ color: isActive ? '#FFD700' : 'var(--text-secondary)' })}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
        <div className="pt-3 mt-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            onClick={handleExport}
            className="btn-duo btn-duo-ghost w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold"
          >
            <Download className="w-4 h-4" />
            Veri Dışa Aktar
          </button>
          <NavLink
            to="/profile"
            className="btn-duo btn-duo-ghost w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold"
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
            className="btn-duo btn-duo-blue w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold"
          >
            <User className="w-4 h-4" />
            Kullanıcı Modu
          </button>
          <button type="button" onClick={signOut} className="btn-duo btn-duo-red w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold">
            <LogOut className="w-4 h-4" />
            Çıkış
          </button>
        </div>
        {user?.email && (
          <p className="text-[10px] text-center pt-2 truncate" style={{ color: 'var(--text-muted)' }}>
            {user.email}
          </p>
        )}
      </aside>

      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
