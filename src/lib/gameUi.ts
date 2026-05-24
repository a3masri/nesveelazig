import { Coffee, Leaf, ShoppingBag, Gift, Crown } from 'lucide-react';
import { RARITY_COLORS } from './constants';

export const CAT_ICONS: Record<string, typeof Coffee> = {
  coffee: Coffee,
  tea: Leaf,
  pastry: ShoppingBag,
  mystery: Gift,
  exclusive: Crown,
};

export function getRarityStyle(rarity: string) {
  return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common;
}

export function getFrameClass(rarity: string): string {
  if (rarity === 'legendary') return 'ticket-frame-legendary';
  if (rarity === 'epic') return 'ticket-frame-epic';
  if (rarity === 'champion') return 'ticket-frame-champion';
  if (rarity === 'rare') return 'ticket-frame-rare';
  return '';
}
