import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

type StaffRouteProps = {
  children: React.ReactNode;
  roles?: string[];
};

export function StaffRoute({ children, roles = ['cashier', 'admin', 'manager'] }: StaffRouteProps) {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile?.role || !roles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
