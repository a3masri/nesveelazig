import { useState } from 'react';
import { Shield, User, Ticket, Briefcase } from 'lucide-react';
import { getAllMembers, updateMember } from '../../lib/adminService';
import { ROLE_LABELS, type UserRole } from '../../lib/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { addAdminLog } from '../../lib/adminLogs';

const ROLES: UserRole[] = ['user', 'cashier', 'manager', 'admin'];

const ROLE_ICONS = { user: User, cashier: Ticket, manager: Briefcase, admin: Shield };

export default function AdminRoles() {
  const [members, setMembers] = useState(() => getAllMembers());

  const refresh = () => setMembers(getAllMembers());

  const setRole = async (id: string, role: UserRole) => {
    await updateMember(id, { role });
    addAdminLog({ type: 'security', action: 'Rol atandı', actor_name: 'Admin', target_id: id, details: ROLE_LABELS[role] });
    refresh();
  };

  const roleCounts = ROLES.reduce(
    (acc, r) => {
      acc[r] = members.filter(m => m.role === r).length;
      return acc;
    },
    {} as Record<UserRole, number>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Roller & İzinler" subtitle="Erişim seviyelerini yönet" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {ROLES.map(role => {
          const Icon = ROLE_ICONS[role];
          return (
            <div key={role} className="surface-panel p-4">
              <Icon className="w-6 h-6 text-cr-gold mb-2" />
              <p className="font-bold text-sm uppercase">{ROLE_LABELS[role]}</p>
              <p className="text-2xl font-display font-bold mt-1">{roleCounts[role]}</p>
            </div>
          );
        })}
      </div>

      <div className="surface-panel p-4 text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
        <p>
          <strong className="text-cr-gold">Admin:</strong> Tam panel erişimi
        </p>
        <p>
          <strong>Yönetici:</strong> Üye ve ödül yönetimi (yakında)
        </p>
        <p>
          <strong>Kasiyer:</strong> Kasa paneli — kod oluşturma
        </p>
        <p>
          <strong>Kullanıcı:</strong> Uygulama özellikleri
        </p>
      </div>

      <div className="surface-panel overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Üye</th>
              <th>Mevcut Rol</th>
              <th>Yeni Rol</th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id}>
                <td className="font-bold">{m.display_name}</td>
                <td>{ROLE_LABELS[m.role as UserRole] || m.role}</td>
                <td>
                  <select
                    value={m.role}
                    onChange={e => setRole(m.id, e.target.value as UserRole)}
                    className="ui-select text-xs"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
