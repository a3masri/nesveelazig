/** Emoji placeholders — no external images until final assets */

export const CATEGORY_EMOJI: Record<string, string> = {
  coffee: '☕',
  tea: '🍵',
  pastry: '🥐',
  mystery: '🎁',
  exclusive: '👑',
  dessert: '🍰',
  drink: '🧋',
  all: '✨',
};

const FALLBACK = ['☕', '🥐', '🍰', '🍪', '🧁', '🍩', '🫖', '✨'];

export function getCategoryEmoji(category?: string, emoji?: string | null): string {
  if (emoji?.trim()) return emoji.trim();
  if (category && CATEGORY_EMOJI[category]) return CATEGORY_EMOJI[category];
  return '☕';
}

/** @deprecated Use getCategoryEmoji — images disabled */
export function getProductImage(_category?: string, _imageUrl?: string | null): undefined {
  return undefined;
}

export const GAME_PAIR_EMOJIS = [
  { id: 'coffee', emoji: '☕' },
  { id: 'croissant', emoji: '🥐' },
  { id: 'donut', emoji: '🍩' },
  { id: 'cookie', emoji: '🍪' },
  { id: 'tea', emoji: '🍵' },
  { id: 'cake', emoji: '🍰' },
];
