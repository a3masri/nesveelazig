import { Copy, Check, Clock, Calendar } from 'lucide-react';
import { getCategoryEmoji } from '../../lib/brandAssets';
import { RARITY_LABELS } from '../../lib/constants';
import { getRarityStyle } from '../../lib/gameUi';
import type { Reward, Ticket } from '../../lib/types';
import { Star } from 'lucide-react';
import { playCopy, playTap } from '../../lib/sounds';

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktif',
  redeemed: 'Kullanıldı',
  expired: 'Süresi doldu',
};

type ShopDetailProps = {
  mode: 'shop';
  reward: Reward;
  points: number;
  purchasing?: boolean;
  onBuy: () => void;
  onClose: () => void;
};

type TicketDetailProps = {
  mode: 'ticket';
  ticket: Ticket;
  copied: boolean;
  onCopy: () => void;
  formatDate: (d: string) => string;
};

type Props = ShopDetailProps | TicketDetailProps;

export function TicketDetailSheet(props: Props) {
  if (props.mode === 'shop') {
    const { reward, points, purchasing, onBuy, onClose } = props;
    const rc = getRarityStyle(reward.rarity);
    const displayEmoji = getCategoryEmoji(reward.category, reward.emoji);
    const canAfford = points >= reward.point_cost;
    const outOfStock = reward.stock !== null && reward.stock <= 0;

    return (
      <div className="ticket-sheet animate-ticket-reveal">
        <div className="ticket-sheet-hero-center">
          <div className="ticket-sheet-emoji-hero" style={{ borderColor: rc.border }}>
            {displayEmoji}
          </div>
          <span className="ticket-sheet-badge" style={{ color: rc.text, borderColor: rc.border }}>
            {RARITY_LABELS[reward.rarity]}
          </span>
          <h2 className="font-display text-lg font-bold uppercase mt-2" style={{ color: 'var(--text-primary)' }}>
            {reward.name}
          </h2>
          {reward.description && (
            <p className="text-sm mt-2 px-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {reward.description}
            </p>
          )}
        </div>

        <div className="ticket-sheet-info-block">
          <span className="label">Başlık</span>
          <span className="value">{reward.name}</span>
        </div>
        {reward.description && (
          <div className="ticket-sheet-info-block">
            <span className="label">Açıklama</span>
            <span className="value text-left">{reward.description}</span>
          </div>
        )}

        <div className="ticket-sheet-row">
          <span style={{ color: 'var(--text-muted)' }}>Fiyat</span>
          <span className="flex items-center gap-1 font-bold text-cr-gold">
            <Star className="w-4 h-4" />
            {reward.point_cost.toLocaleString('tr-TR')}
          </span>
        </div>
        <div className="ticket-sheet-row">
          <span style={{ color: 'var(--text-muted)' }}>Bakiye sonrası</span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {Math.max(0, points - reward.point_cost).toLocaleString('tr-TR')}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              playTap();
              onClose();
            }}
            className="btn-duo btn-duo-ghost flex-1 py-3.5 rounded-xl min-h-[48px] text-sm"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={() => {
              playTap();
              onBuy();
            }}
            disabled={!canAfford || outOfStock || purchasing}
            className="btn-duo btn-duo-green flex-1 py-3.5 rounded-xl min-h-[48px] text-sm"
          >
            {purchasing ? '...' : outOfStock ? 'Tükendi' : !canAfford ? 'Yetersiz' : 'Satın al'}
          </button>
        </div>
      </div>
    );
  }

  const { ticket, copied, onCopy, formatDate } = props;
  const reward = ticket.rewards;
  const rc = getRarityStyle(ticket.rarity);
  const displayEmoji = getCategoryEmoji(reward?.category, reward?.emoji);
  const isActive = ticket.status === 'active';

  return (
    <div className="ticket-sheet animate-ticket-reveal">
      <div className="flex items-center gap-3 mb-4">
        <div className="ticket-sheet-emoji-sm" style={{ borderColor: rc.border }}>
          {displayEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-bold uppercase truncate" style={{ color: 'var(--text-primary)' }}>
            {reward?.name || 'Ödül'}
          </h2>
          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase ticket-status-${ticket.status}`}>
            {STATUS_LABELS[ticket.status]}
          </span>
          {reward?.description && (
            <p className="text-xs mt-2 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
              {reward.description}
            </p>
          )}
        </div>
      </div>

      <div className="ticket-sheet-info-block mb-3">
        <span className="label">Durum</span>
        <span className={`value ticket-status-${ticket.status}`}>{STATUS_LABELS[ticket.status]}</span>
      </div>

      <div className="ticket-sheet-code-block">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          Onay kodu
        </p>
        <p className="ticket-sheet-code">{ticket.code}</p>
        <button
          type="button"
          onClick={() => {
            playCopy();
            onCopy();
          }}
          disabled={!isActive}
          className="btn-duo btn-duo-gold w-full mt-3 py-3 rounded-xl text-sm min-h-[48px] flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Kopyalandı' : 'Kodu kopyala'}
        </button>
      </div>

      <div className="ticket-sheet-info-grid">
        <div className="ticket-sheet-info">
          <Calendar className="w-3.5 h-3.5 mb-1" style={{ color: 'var(--text-muted)' }} />
          <span className="label">Alınma</span>
          <span className="value">{formatDate(ticket.created_at)}</span>
        </div>
        <div className="ticket-sheet-info">
          <Clock className="w-3.5 h-3.5 mb-1" style={{ color: 'var(--text-muted)' }} />
          <span className="label">Son kullanım</span>
          <span className="value">{formatDate(ticket.expires_at)}</span>
        </div>
      </div>
    </div>
  );
}
