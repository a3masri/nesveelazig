import { Shield, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const hiddenOn = ['/', '/giris', '/kayit', '/hakkimizda', '/iletisim', '/gizlilik', '/kullanim-kosullari'];

export function DemoRoleToggle() {
  const { user, promoteToAdmin, promoteToUser } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || hiddenOn.includes(location.pathname)) return null;

  const isAdmin = profile?.role === 'admin';

  const switchToUser = async () => {
    await promoteToUser();
    navigate('/dashboard');
  };

  const switchToAdmin = async () => {
    await promoteToAdmin();
    navigate('/admin-panel');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2">
      {isAdmin ? (
        <button
          type="button"
          onClick={switchToUser}
          className="btn-duo btn-duo-blue px-4 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2"
          title="Normal kullanıcı moduna dön"
        >
          <User className="w-4 h-4" />
          Kullanıcı Modu
        </button>
      ) : (
        <button
          type="button"
          onClick={switchToAdmin}
          className="btn-duo btn-duo-gold px-4 py-3 rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse-glow"
          title="Admin paneline geç"
        >
          <Shield className="w-4 h-4" />
          Admin Ol (Demo)
        </button>
      )}
    </div>
  );
}
