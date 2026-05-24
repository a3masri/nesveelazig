import { useState, useEffect } from 'react';
import { Search, Package } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../../lib/adminService';
import type { Order } from '../../lib/types';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterChips } from '../../components/ui/FilterChips';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'redeemed' | 'expired'>('all');

  const load = () => setOrders(getOrders(search));

  useEffect(() => {
    load();
  }, [search]);

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Siparişler" subtitle="Bilet satın alımları ve işlem geçmişi" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cr-gold" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Kod, üye veya ürün ara..."
          className="ui-input pl-10"
        />
      </div>

      <FilterChips
        options={[
          { value: 'all' as const, label: 'Tümü', count: orders.length },
          { value: 'active' as const, label: 'Aktif', count: orders.filter(o => o.status === 'active').length },
          { value: 'redeemed' as const, label: 'Kullanıldı', count: orders.filter(o => o.status === 'redeemed').length },
          { value: 'expired' as const, label: 'Süresi Doldu', count: orders.filter(o => o.status === 'expired').length },
        ]}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="surface-panel overflow-x-auto">
        <table className="admin-table min-w-[640px]">
          <thead>
            <tr>
              <th>Kod</th>
              <th>Üye</th>
              <th>Ürün</th>
              <th>Kupa</th>
              <th>Durum</th>
              <th>Tarih</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td className="font-mono font-bold text-cr-gold">{o.code}</td>
                <td>{o.user_name}</td>
                <td>{o.rewards?.name || '—'}</td>
                <td>{o.point_cost ?? '—'}</td>
                <td>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cr-gold/15 text-cr-gold">
                    {o.status}
                  </span>
                </td>
                <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(o.created_at).toLocaleString('tr-TR')}
                </td>
                <td>
                  {o.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => {
                        updateOrderStatus(o.id, 'redeemed');
                        load();
                      }}
                      className="btn-duo btn-duo-green px-3 py-1.5 rounded-lg text-[10px]"
                    >
                      Kullanıldı
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 mx-auto mb-2 text-cr-gold" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Sipariş bulunamadı
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
