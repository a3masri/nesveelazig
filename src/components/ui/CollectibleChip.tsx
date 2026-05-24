import { Star } from 'lucide-react';
import { getCategoryEmoji } from '../../lib/brandAssets';
import { getRarityStyle, getFrameClass } from '../../lib/gameUi';
import { playTap, playHover } from '../../lib/sounds';

const STATUS_LABELS: Record<string, string> = {
  active: 'Aktif',
  redeemed: 'Kullanıldı',
  expired: 'Süresi doldu',
};

type CollectionTicketProps = {
  name: string;
  description?: string;
  emoji?: string | null;
  category?: string;
  rarity: string;
  pointValue?: number;
  status: 'active' | 'redeemed' | 'expired' | string;
  onClick?: () => void;
};

export function CollectibleChip({
  name,
  description,
  emoji,
  category,
  rarity,
  pointValue,
  status,
  onClick,
}: CollectionTicketProps) {
  const rc = getRarityStyle(rarity);
  const frame = getFrameClass(rarity);
  const displayEmoji = getCategoryEmoji(category, emoji);
  const statusLabel = STATUS_LABELS[status] || status;

  const handleClick = () => {
    playTap();
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={playHover}
      className={`collection-ticket ${frame} collection-ticket--${status}`}
      style={{ borderColor: rc.border, boxShadow: rc.glow || 'var(--shadow)' }}
    >
      <span className="ticket-notch ticket-notch-left" aria-hidden />
      <span className="ticket-notch ticket-notch-right" aria-hidden />

      <span
        className="collection-ticket-status"
        style={{
          background:
            status === 'active'
              ? 'rgba(76,175,80,0.2)'
              : status === 'expired'
                ? 'rgba(255,107,53,0.2)'
                : 'rgba(96,125,139,0.2)',
          color: status === 'active' ? '#4CAF50' : status === 'expired' ? '#FF6B35' : '#607D8B',
          borderColor:
            status === 'active'
              ? 'rgba(76,175,80,0.45)'
              : status === 'expired'
                ? 'rgba(255,107,53,0.45)'
                : 'rgba(96,125,139,0.45)',
        }}
      >
        {statusLabel}
      </span>

      <div className={`collection-ticket-art ${frame}`}>
        <span className="collection-ticket-emoji">{displayEmoji}</span>
      </div>

      <hr className="collection-ticket-tear" aria-hidden />

      <span className="collection-ticket-name">{name}</span>

      {description && (
        <p className="collection-ticket-desc">{description}</p>
      )}

      {pointValue !== undefined && pointValue > 0 && (
        <div className="collection-ticket-value">
          <Star className="w-3 h-3 text-cr-gold" />
          <span>{pointValue.toLocaleString('tr-TR')}</span>
        </div>
      )}
    </button>
  );
}
