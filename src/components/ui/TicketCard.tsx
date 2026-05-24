import { Star, Lock, ShoppingBag } from 'lucide-react';
import { getRarityStyle, getFrameClass } from '../../lib/gameUi';
import { getCategoryEmoji } from '../../lib/brandAssets';
import { RARITY_LABELS, CATEGORY_LABELS } from '../../lib/constants';

export type TicketCardProps = {
  name: string;
  description?: string;
  emoji?: string;
  imageUrl?: string | null;
  category?: string;
  rarity: string;
  pointCost?: number;
  code?: string;
  status?: string;
  statusLabel?: string;
  footer?: string;
  stockLabel?: string;
  stockLow?: boolean;
  locked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'shop' | 'inventory';
  className?: string;
  ticketNumber?: string;
};

export function TicketCard({
  name,
  description,
  emoji,
  imageUrl,
  category = 'coffee',
  rarity,
  pointCost,
  code,
  status,
  statusLabel,
  footer,
  stockLabel,
  stockLow = false,
  locked = false,
  disabled = false,
  onClick,
  variant = 'shop',
  className = '',
  ticketNumber,
}: TicketCardProps) {
  const rc = getRarityStyle(rarity);
  const frame = getFrameClass(rarity);
  const isLegendary = rarity === 'legendary' || rarity === 'champion';
  const displayEmoji = getCategoryEmoji(category, emoji || imageUrl);
  const statusColors =
    status === 'active'
      ? { bg: 'rgba(76,175,80,0.2)', color: '#4CAF50', border: 'rgba(76,175,80,0.4)' }
      : status === 'expired'
        ? { bg: 'rgba(255,107,53,0.2)', color: '#FF6B35', border: 'rgba(255,107,53,0.4)' }
        : status === 'redeemed'
          ? { bg: 'rgba(96,125,139,0.2)', color: '#607D8B', border: 'rgba(96,125,139,0.4)' }
          : null;

  const showCta = variant === 'shop' && onClick && !locked && !disabled;

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={e => e.key === 'Enter' && onClick && !disabled && onClick()}
      className={`ticket-card group ${frame} ${isLegendary ? 'ticket-shine' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        borderColor: rc.border,
        boxShadow: locked ? 'var(--shadow)' : rc.glow || 'var(--shadow)',
      }}
    >
      <div className="ticket-notch ticket-notch-left" aria-hidden />
      <div className="ticket-notch ticket-notch-right" aria-hidden />

      {category && variant === 'shop' && (
        <span className="ticket-ribbon ticket-ribbon-category">
          {CATEGORY_LABELS[category] || category}
        </span>
      )}

      <div className={`ticket-body ${variant === 'inventory' ? 'min-h-[210px]' : 'min-h-[200px]'}`}>
        <div className="flex items-start justify-between gap-2 mb-2 pr-16">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
            style={{ background: `${rc.border}30`, color: rc.text, border: `1px solid ${rc.border}55` }}
          >
            {RARITY_LABELS[rarity] || rarity}
          </span>
          {status && statusColors && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
              style={{
                background: statusColors.bg,
                color: statusColors.color,
                border: `1px solid ${statusColors.border}`,
              }}
            >
              {statusLabel || status}
            </span>
          )}
        </div>

        <div className={`ticket-art ${frame} flex items-center justify-center mb-3 relative overflow-hidden`}>
          {locked ? (
            <Lock className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
          ) : (
            <span className="text-5xl drop-shadow-md group-hover:scale-110 transition-transform duration-300 select-none">
              {displayEmoji}
            </span>
          )}
          <div className="absolute inset-0 ticket-art-shine pointer-events-none" />
        </div>

        <hr className="ticket-tear-line" aria-hidden />

        <h3
          className="font-display font-bold text-sm uppercase leading-tight line-clamp-2 mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {name}
        </h3>
        {description && (
          <p className="text-[11px] line-clamp-2 mb-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}

        {ticketNumber && (
          <p className="text-[9px] font-mono mb-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            #{ticketNumber.slice(0, 8)}
          </p>
        )}

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {pointCost !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-cr-gold fill-cr-gold/30" />
                <span className="text-lg font-bold font-display text-cr-gold">
                  {pointCost.toLocaleString('tr-TR')}
                </span>
              </div>
            )}
            {code && (
              <span className="font-mono text-xs font-bold text-cr-gold tracking-wider truncate max-w-[55%]">
                {code}
              </span>
            )}
            {stockLabel && (
              <span className={`ticket-stock-badge ${stockLow ? 'ticket-stock-badge--low' : ''}`}>
                {stockLabel}
              </span>
            )}
          </div>
          {footer && (
            <p className="text-[10px] uppercase tracking-wider truncate" style={{ color: 'var(--text-muted)' }}>
              {footer}
            </p>
          )}
          {showCta && (
            <span className="btn-duo btn-duo-gold w-full py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1.5 mt-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              Bileti Al
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
