import { Copy, Check, Clock, Hash, Store, QrCode } from 'lucide-react';
import { TicketCard } from './TicketCard';
import type { Ticket } from '../../lib/types';

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktif',
  redeemed: 'Kullanıldı',
  expired: 'Süresi Doldu',
};

type TicketDetailProps = {
  ticket: Ticket;
  copied: boolean;
  onCopy: () => void;
  formatDate: (d: string) => string;
};

export function TicketDetail({ ticket, copied, onCopy, formatDate }: TicketDetailProps) {
  const reward = ticket.rewards;
  const isActive = ticket.status === 'active';

  return (
    <div className="space-y-5 animate-ticket-reveal">
      <TicketCard
        name={reward?.name || 'Ödül'}
        description={reward?.description}
        emoji={reward?.emoji}
        category={reward?.category}
        rarity={ticket.rarity}
        code={ticket.code}
        status={ticket.status}
        statusLabel={STATUS_LABELS[ticket.status] || ticket.status}
        variant="inventory"
        ticketNumber={ticket.id}
        className="pointer-events-none shadow-none hover:transform-none"
      />

      <div className="text-center space-y-2">
        <p className="section-title flex items-center justify-center gap-1.5">
          <QrCode className="w-3.5 h-3.5" />
          Kasada göster
        </p>
        <div className="ticket-detail-code">{ticket.code}</div>
        <button
          type="button"
          onClick={onCopy}
          disabled={!isActive}
          className="btn-duo btn-duo-gold px-6 py-3 rounded-2xl text-sm inline-flex items-center gap-2 mx-auto min-h-[44px]"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Kopyalandı' : 'Kodu Kopyala'}
        </button>
      </div>

      <div className="ticket-detail-meta">
        <div className="ticket-detail-meta-item col-span-2 sm:col-span-1">
          <p className="ticket-detail-meta-label flex items-center gap-1">
            <Hash className="w-3 h-3" />
            Bilet no
          </p>
          <p className="ticket-detail-meta-value font-mono text-xs truncate">{ticket.id}</p>
        </div>
        <div className="ticket-detail-meta-item">
          <p className="ticket-detail-meta-label flex items-center gap-1">
            <Store className="w-3 h-3" />
            Kaynak
          </p>
          <p className="ticket-detail-meta-value">Kart Dükkanı</p>
        </div>
        <div className="ticket-detail-meta-item">
          <p className="ticket-detail-meta-label flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Son kullanım
          </p>
          <p className="ticket-detail-meta-value">{formatDate(ticket.expires_at)}</p>
        </div>
        <div className="ticket-detail-meta-item">
          <p className="ticket-detail-meta-label">Alınma</p>
          <p className="ticket-detail-meta-value">{formatDate(ticket.created_at)}</p>
        </div>
      </div>

      {!isActive && (
        <p className="text-xs text-center font-semibold px-4 py-3 rounded-xl bg-cr-red/10 border border-cr-red/25" style={{ color: '#FF8A80' }}>
          Bu bilet artık kullanılamaz.
        </p>
      )}
    </div>
  );
}
