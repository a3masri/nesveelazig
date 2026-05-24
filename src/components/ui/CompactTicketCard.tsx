import { Star, Lock, ShoppingBag } from 'lucide-react';
import { getCategoryEmoji } from '../../lib/brandAssets';
import { getRarityStyle } from '../../lib/gameUi';
import { RARITY_LABELS } from '../../lib/constants';
import { playTap, playHover } from '../../lib/sounds';

export type CompactTicketProps = {
  name: string;
  emoji?: string | null;
  category?: string;
  rarity: string;
  pointCost?: number;
  status?: string;
  statusLabel?: string;
  locked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onBuy?: (e: React.MouseEvent) => void;
  showBuy?: boolean;
  className?: string;
};

export function CompactTicketCard({
  name,
  emoji,
  category = 'coffee',
  rarity,
  pointCost,
  status,
  statusLabel,
  locked = false,
  disabled = false,
  onClick,
  onBuy,
  showBuy = false,
  className = '',
}: CompactTicketProps) {
  const rc = getRarityStyle(rarity);
  const displayEmoji = getCategoryEmoji(category, emoji);

  const handleClick = () => {
    if (disabled) return;
    playTap();
    onClick?.();
  };

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={e => e.key === 'Enter' && onClick && !disabled && handleClick()}
      onMouseEnter={() => !disabled && onClick && playHover()}
      className={`compact-ticket ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ borderColor: rc.border }}
    >
      <span
        className="compact-ticket-badge"
        style={{ background: `${rc.border}25`, color: rc.text, borderColor: `${rc.border}50` }}
      >
        {statusLabel || RARITY_LABELS[rarity] || rarity}
      </span>

      <div className="compact-ticket-art">
        {locked ? (
          <Lock className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <span className="text-3xl leading-none select-none">{displayEmoji}</span>
        )}
      </div>

      <h3 className="compact-ticket-name" style={{ color: 'var(--text-primary)' }}>
        {name}
      </h3>

      {pointCost !== undefined && (
        <div className="compact-ticket-points">
          <Star className="w-3.5 h-3.5 text-cr-gold" />
          <span>{pointCost.toLocaleString('tr-TR')}</span>
        </div>
      )}

      {showBuy && onBuy && !locked && !disabled && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            playTap();
            onBuy(e);
          }}
          className="compact-ticket-buy btn-duo btn-duo-gold"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Al
        </button>
      )}
    </article>
  );
}
