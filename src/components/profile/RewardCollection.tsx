import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getUserTickets } from '../../lib/db';
import type { Ticket } from '../../lib/types';
import { CollectibleChip } from '../ui/CollectibleChip';
import { Modal } from '../ui/Modal';
import { TicketDetailSheet } from '../ui/TicketDetailSheet';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { playTab, playUnlock } from '../../lib/sounds';

type Filter = 'all' | 'active' | 'redeemed' | 'expired';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif' },
  { id: 'redeemed', label: 'Kullanıldı' },
  { id: 'expired', label: 'Süresi doldu' },
];

type RewardCollectionProps = {
  previewLimit?: number;
  showHeader?: boolean;
  id?: string;
};

export function RewardCollection({ previewLimit, showHeader = true, id = 'rewards' }: RewardCollectionProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getUserTickets(user.id).then(data => {
      setTickets(data);
      setLoading(false);
    });
  }, [user]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

  const counts = useMemo(
    () => ({
      all: tickets.length,
      active: tickets.filter(t => t.status === 'active').length,
      redeemed: tickets.filter(t => t.status === 'redeemed').length,
      expired: tickets.filter(t => t.status === 'expired').length,
    }),
    [tickets]
  );

  const filtered = useMemo(() => {
    let list = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
    list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (previewLimit) list = list.slice(0, previewLimit);
    return list;
  }, [tickets, filter, previewLimit]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section id={id} className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold uppercase flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
              <Sparkles className="w-4 h-4 text-cr-gold" />
              Ödül Koleksiyonum
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {counts.active} aktif · {counts.redeemed} kullanıldı · {counts.all} toplam
            </p>
          </div>
        </div>
      )}

      {!previewLimit && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                playTab();
                setFilter(f.id);
              }}
              className={`shrink-0 px-3 py-2 rounded-lg text-[11px] font-bold uppercase min-h-[40px] ${
                filter === f.id ? 'btn-duo btn-duo-blue' : 'btn-duo btn-duo-ghost'
              }`}
            >
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="collectible-grid collection-ticket-grid">
          {filtered.map(ticket => (
            <CollectibleChip
              key={ticket.id}
              name={ticket.rewards?.name || 'Ödül'}
              emoji={ticket.rewards?.emoji}
              category={ticket.rewards?.category}
              rarity={ticket.rarity}
              status={ticket.status}
              onClick={() => {
                playUnlock();
                setSelected(ticket);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="surface-panel p-8 text-center rounded-xl">
          <p className="text-3xl mb-2">🎁</p>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {filter === 'all' ? 'Koleksiyonun boş' : 'Bu filtrede ödül yok'}
          </p>
          <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>
            Dükkandan ödül al ve burada topla
          </p>
          <Link to="/store" className="btn-duo btn-duo-gold inline-block px-6 py-2.5 rounded-xl text-xs">
            Dükkan'a git
          </Link>
        </div>
      )}

      {previewLimit && tickets.length > previewLimit && (
        <Link
          to="/profile#rewards"
          className="block text-center text-xs font-bold py-3 rounded-xl surface-panel"
          style={{ color: 'var(--text-secondary)' }}
        >
          +{tickets.length - previewLimit} ödül daha — koleksiyonu gör
        </Link>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} variant="sheet" maxWidth="max-w-md">
        {selected && (
          <TicketDetailSheet
            mode="ticket"
            ticket={selected}
            copied={copiedCode === selected.code}
            onCopy={() => copyCode(selected.code)}
            formatDate={formatDate}
          />
        )}
      </Modal>
    </section>
  );
}
