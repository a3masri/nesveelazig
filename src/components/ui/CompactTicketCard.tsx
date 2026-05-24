import { Star, ShoppingBag } from 'lucide-react';
import { getCategoryEmoji } from '../../lib/brandAssets';
import { getRarityStyle } from '../../lib/gameUi';
import { RARITY_LABELS } from '../../lib/constants';
import { playTap, playHover } from '../../lib/sounds';

export type CompactTicketProps = {
  name: string;
  description?: string;
  emoji?: string | null;
  category?: string;
  rarity: string;
  pointCost?: number;
  status?: string;
  statusLabel?: string;
  canAfford?: boolean;
  outOfStock?: boolean;
  onClick?: () => void;
  onBuy?: (e: React.MouseEvent) => void;
  showBuy?: boolean;
  className?: string;
};

export function CompactTicketCard({
  name,
  description,
  emoji,
  category = 'coffee',
  rarity,
  pointCost,
  statusLabel,
  canAfford = true,
  outOfStock = false,
  onClick,
  onBuy,
  showBuy = false,
  className = '',
}: CompactTicketProps) {
  const rc = getRarityStyle(rarity);
  const displayEmoji = getCategoryEmoji(category, emoji);

  const handleClick = () => {
    if (outOfStock) return;
    playTap();
    onClick?.();
  };

  return (
    <article
      role={onClick && !outOfStock ? 'button' : undefined}
      tabIndex={onClick && !outOfStock ? 0 : undefined}
      onClick={onClick && !outOfStock ? handleClick : undefined}
      onKeyDown={e => e.key === 'Enter' && onClick && !outOfStock && handleClick()}
      onMouseEnter={() => !outOfStock && onClick && playHover()}
      className={`compact-ticket compact-ticket--shop ${outOfStock ? 'opacity-50' : onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ borderColor: rc.border }}
    >
      <span className="ticket-notch ticket-notch-left" aria-hidden />
      <span className="ticket-notch ticket-notch-right" aria-hidden />

      <span
        className="compact-ticket-badge"
        style={{ background: `${rc.border}25`, color: rc.text, borderColor: `${rc.border}50` }}
      >
        {statusLabel || RARITY_LABELS[rarity] || rarity}
      </span>

      <div className="compact-ticket-art">
        <span className="text-3xl leading-none select-none">{displayEmoji}</span>
      </div>

      <hr className="compact-ticket-tear" aria-hidden />

      <h3 className="compact-ticket-name" style={{ color: 'var(--text-primary)' }}>
        {name}
      </h3>

      {description && (
        <p className="compact-ticket-desc" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      )}

      {pointCost !== undefined && (
        <div className={`compact-ticket-points ${!canAfford ? 'compact-ticket-points--low' : ''}`}>
          <Star className="w-3.5 h-3.5 text-cr-gold" />
          <span>{pointCost.toLocaleString('tr-TR')}</span>
          {!canAfford && !outOfStock && (
            <span className="compact-ticket-hint">Yetersiz</span>
          )}
        </div>
      )}

      {outOfStock && <span className="compact-ticket-stock">Tükendi</span>}

      {showBuy && onBuy && !outOfStock && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            playTap();
            onBuy(e);
          }}
          className={`compact-ticket-buy btn-duo ${canAfford ? 'btn-duo-gold' : 'btn-duo-ghost'}`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {canAfford ? 'Al' : 'Detay'}
        </button>
      )}
    </article>
  );
}
