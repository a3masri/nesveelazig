import type { LucideIcon } from 'lucide-react';
import { Coffee, Award, Flame, Trophy, Zap, Crown, Snowflake, Flower2, Sun, Leaf } from 'lucide-react';

export const RANKS = [
  { name: 'Antrenman Kampı', minPoints: 0, icon: 'Coffee', color: '#8D6E63', order: 0 },
  { name: 'Goblin Stadyumu', minPoints: 100, icon: 'Award', color: '#4CAF50', order: 1 },
  { name: 'Kemik Çukuru', minPoints: 500, icon: 'Flame', color: '#FF6B35', order: 2 },
  { name: 'Barbar Çayı', minPoints: 1500, icon: 'Trophy', color: '#2C5F8A', order: 3 },
  { name: 'Büyü Vadisi', minPoints: 4000, icon: 'Zap', color: '#7B1FA2', order: 4 },
  { name: 'Efsane Arena', minPoints: 10000, icon: 'Crown', color: '#FFD700', order: 5 },
] as const;

export type Rank = (typeof RANKS)[number];

export type SeasonId = 'kis' | 'ilkbahar' | 'yaz' | 'sonbahar';

export type SeasonStop = {
  rankName: string;
  minPoints: number;
  icon: LucideIcon;
  color: string;
  perks: string[];
};

export type SeasonPath = {
  id: SeasonId;
  name: string;
  emoji: string;
  icon: LucideIcon;
  color: string;
  solidBg: string;
  description: string;
  stops: SeasonStop[];
};

export const SEASON_PATH: SeasonPath[] = [
  {
    id: 'kis',
    name: 'Kış',
    emoji: '❄️',
    icon: Snowflake,
    color: '#64B5F6',
    solidBg: '#5C6BC0',
    description: 'Soğuk günlerde sıcak bir fincanla yolculuğa başla.',
    stops: [
      {
        rankName: 'Antrenman Kampı',
        minPoints: 0,
        icon: Coffee,
        color: '#8D6E63',
        perks: ['Hoş geldin içeceği', 'Temel kart erişimi'],
      },
      {
        rankName: 'Goblin Stadyumu',
        minPoints: 100,
        icon: Award,
        color: '#4CAF50',
        perks: ['%5 bonus kupa', 'Haftalık özel menü'],
      },
    ],
  },
  {
    id: 'ilkbahar',
    name: 'İlkbahar',
    emoji: '🌸',
    icon: Flower2,
    color: '#81C784',
    solidBg: '#66BB6A',
    description: 'Çiçek açan mevsimde kupalarını katla.',
    stops: [
      {
        rankName: 'Kemik Çukuru',
        minPoints: 500,
        icon: Flame,
        color: '#FF6B35',
        perks: ['%10 bonus kupa', 'Erken erişim', 'Nadir sandık'],
      },
      {
        rankName: 'Barbar Çayı',
        minPoints: 1500,
        icon: Trophy,
        color: '#2C5F8A',
        perks: ['%15 bonus kupa', 'Öncelikli oturma', 'Epik sandıklar', 'Doğum günü bonusu'],
      },
    ],
  },
  {
    id: 'yaz',
    name: 'Yaz',
    emoji: '☀️',
    icon: Sun,
    color: '#FFB74D',
    solidBg: '#FFB74D',
    description: 'Sıcak yaz günlerinde buzlu içeceklerle yüksel.',
    stops: [
      {
        rankName: 'Büyü Vadisi',
        minPoints: 4000,
        icon: Zap,
        color: '#7B1FA2',
        perks: ['%20 bonus kupa', 'Aylık ücretsiz tatlı', 'VIP etkinlikler', 'Özel içecekler'],
      },
    ],
  },
  {
    id: 'sonbahar',
    name: 'Sonbahar',
    emoji: '🍂',
    icon: Leaf,
    color: '#FF8A65',
    solidBg: '#FF8A65',
    description: 'Hasat mevsiminde efsane statüsüne ulaş.',
    stops: [
      {
        rankName: 'Efsane Arena',
        minPoints: 10000,
        icon: Crown,
        color: '#FFD700',
        perks: ['%25 bonus kupa', 'Aylık ücretsiz ürün', 'Efsane salonu', 'İsme özel içecek', 'Altın taç kartı'],
      },
    ],
  },
];

export const RARITY_COLORS = {
  common: { bg: '#1E3A5F', border: '#2C5F8A', text: '#90A4AE', glow: '' },
  rare: { bg: '#0D47A1', border: '#1A3A5C', text: '#82B1FF', glow: '0 0 12px rgba(26,58,92,0.6)' },
  epic: { bg: '#4A148C', border: '#7B1FA2', text: '#CE93D8', glow: '0 0 16px rgba(123,31,162,0.5)' },
  legendary: { bg: '#5D4037', border: '#FFD700', text: '#FFE082', glow: '0 0 20px rgba(255,215,0,0.5)' },
  champion: { bg: '#B71C1C', border: '#E53935', text: '#FF8A80', glow: '0 0 20px rgba(229,57,53,0.5)' },
} as const;

export const RARITY_LABELS: Record<string, string> = {
  common: 'Yaygın',
  rare: 'Nadir',
  epic: 'Epik',
  legendary: 'Efsanevi',
  champion: 'Şampiyon',
};

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tümü',
  coffee: 'Kahve',
  tea: 'Çay',
  pastry: 'Tatlı',
  mystery: 'Gizem',
  exclusive: 'Özel',
};

export const CATEGORY_ICONS: Record<string, string> = {
  coffee: 'Coffee',
  tea: 'Leaf',
  pastry: 'Cake',
  mystery: 'Gift',
  exclusive: 'Crown',
};

export const SIGNUP_BONUS_POINTS = 50;

export function getRankForPoints(points: number): Rank {
  let rank: Rank = RANKS[0];
  for (const r of RANKS) {
    if (points >= r.minPoints) rank = r;
  }
  return rank;
}

export function getNextRank(currentPoints: number) {
  for (const r of RANKS) {
    if (r.minPoints > currentPoints) return r;
  }
  return null;
}

export function getProgressPercent(currentPoints: number) {
  const current = getRankForPoints(currentPoints);
  const next = getNextRank(currentPoints);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const progress = currentPoints - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function getSeasonForPoints(points: number): SeasonPath {
  if (points >= 10000) return SEASON_PATH[3];
  if (points >= 4000) return SEASON_PATH[2];
  if (points >= 500) return SEASON_PATH[1];
  return SEASON_PATH[0];
}

export function getSeasonProgress(points: number, season: SeasonPath) {
  const stops = season.stops;
  const lastStop = stops[stops.length - 1];
  const nextSeasonIdx = SEASON_PATH.findIndex(s => s.id === season.id) + 1;
  const seasonMax =
    nextSeasonIdx < SEASON_PATH.length
      ? SEASON_PATH[nextSeasonIdx].stops[0].minPoints
      : lastStop.minPoints + 5000;
  const seasonMin = stops[0].minPoints;
  if (points >= seasonMax) return 100;
  if (points < seasonMin) return 0;
  return Math.min(100, Math.round(((points - seasonMin) / (seasonMax - seasonMin)) * 100));
}
