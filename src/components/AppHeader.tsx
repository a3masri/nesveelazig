import { Link, useNavigate } from 'react-router-dom';
import { Star, Gamepad2, Bell, Search, User } from 'lucide-react';
import { Logo } from './Logo';
import { useProfile } from '../hooks/useProfile';
import { useTheme } from '../hooks/useTheme';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
};

/** Page title on mobile (Layout already shows logo bar). Full bar on desktop only. */
export function AppHeader({ title, subtitle, showSearch = false }: AppHeaderProps) {
  const { profile } = useProfile();
  const { toggle } = useTheme();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin';
  const points = profile?.total_points ?? 0;

  return (
    <>
      {/* Mobile: slim page title — no second logo header */}
      {(title || subtitle) && (
        <div className="lg:hidden mb-3 flex items-end justify-between gap-3 min-h-[44px]">
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="font-display text-lg font-bold uppercase leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {!isAdmin && (
            <div
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl flex-shrink-0 min-h-[44px]"
              style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)' }}
            >
              <Star className="w-3.5 h-3.5 text-cr-gold" />
              <span className="font-bold text-xs text-cr-gold">{points.toLocaleString('tr-TR')}</span>
            </div>
          )}
        </div>
      )}

      {/* Desktop: full header with logo */}
      <header className="hidden lg:block mb-4 space-y-3">
        <div
          className="flex items-center justify-between gap-2 p-3 rounded-2xl border backdrop-blur-md"
          style={{
            background: 'rgba(var(--bg-card-rgb), 0.92)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Logo size="md" linkTo={isAdmin ? '/admin-panel' : '/dashboard'} className="flex-shrink-0" />
            {(title || subtitle) && (
              <div className="min-w-0 border-l pl-2" style={{ borderColor: 'var(--border)' }}>
                {title && (
                  <h1 className="font-display text-base font-bold truncate uppercase" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {!isAdmin && (
              <>
                <button
                  type="button"
                  onClick={toggle}
                  className="btn-duo btn-duo-ghost p-2.5 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center"
                  aria-label="Tema değiştir"
                />
                <Link
                  to="/oyunlar"
                  className="btn-duo btn-duo-ghost p-2.5 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center"
                  aria-label="Oyunlar"
                >
                  <Gamepad2 className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  className="btn-duo btn-duo-ghost p-2.5 min-w-[40px] min-h-[40px] rounded-xl relative flex items-center justify-center"
                  aria-label="Bildirimler"
                >
                  <Bell className="w-4 h-4" />
                  <span className="notif-dot" />
                </button>
                <div
                  className="px-2.5 py-2 rounded-xl flex items-center gap-1 min-h-[40px]"
                  style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)' }}
                >
                  <Star className="w-3.5 h-3.5 text-cr-gold" />
                  <span className="font-bold text-xs text-cr-gold">{points.toLocaleString('tr-TR')}</span>
                </div>
                <Link
                  to="/profile"
                  className="btn-duo btn-duo-ghost p-2.5 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center"
                  aria-label="Profil"
                >
                  <User className="w-4 h-4" />
                </Link>
              </>
            )}
            {isAdmin && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-cr-gold/20 text-cr-gold border border-cr-gold/40">
                Admin
              </span>
            )}
          </div>
        </div>

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="search"
              placeholder="Ara..."
              className="ui-input w-full pl-10 min-h-[44px]"
              onKeyDown={e => {
                if (e.key === 'Enter') navigate('/store');
              }}
            />
          </div>
        )}
      </header>
    </>
  );
}
