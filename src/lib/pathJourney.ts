/** Long scroll path — 4 visual zones aligned with SEASON_PATH */

export type PathVibe = {
  id: string;
  seasonName: string;
  seasonEmoji: string;
  accent: string;
  particles: string[];
  cssClass: string;
};

export const PATH_VIBES: PathVibe[] = [
  {
    id: 'winter',
    seasonName: 'Kış',
    seasonEmoji: '❄️',
    accent: '#64B5F6',
    particles: ['❄️', '☕', '🧣'],
    cssClass: 'path-vibe-winter',
  },
  {
    id: 'spring',
    seasonName: 'İlkbahar',
    seasonEmoji: '🌸',
    accent: '#81C784',
    particles: ['🌸', '🍃', '🦋'],
    cssClass: 'path-vibe-spring',
  },
  {
    id: 'summer',
    seasonName: 'Yaz',
    seasonEmoji: '☀️',
    accent: '#FFB74D',
    particles: ['☀️', '🧊', '🍹'],
    cssClass: 'path-vibe-summer',
  },
  {
    id: 'autumn',
    seasonName: 'Sonbahar',
    seasonEmoji: '🍂',
    accent: '#FF8A65',
    particles: ['🍂', '🍁', '☕'],
    cssClass: 'path-vibe-autumn',
  },
];

export type PathNode = {
  id: number;
  minPoints: number;
  emoji: string;
  title: string;
  vibeIndex: number;
  side: 'left' | 'right' | 'center';
};

const NODE_TITLES = [
  'İlk Yudum', 'Sıcak Başlangıç', 'Fincan Isındı', 'Köpük Zamanı', 'Aroma Yolu',
  'Çekirdek Yolu', 'Demleme Noktası', 'Barista Kapısı', 'Kupa Taşıyıcı', 'Kahve Nehri',
  'Çay Bahçesi', 'Kruvasan Tepesi', 'Tatlı Vadi', 'Gizem Sandığı', 'Altın Fincan',
  'Efsane Yolu', 'Taç Yolu', 'Neşve Zirvesi',
];

const NODE_EMOJIS = ['☕', '🫖', '🥐', '🍵', '🍪', '🧁', '🎁', '⭐', '👑', '🔥', '✨', '💎', '🏆', '🌟'];

function buildNodes(): PathNode[] {
  const nodes: PathNode[] = [];
  const total = 52;
  const pointsStep = Math.floor(10000 / (total - 1));
  const sides: Array<'left' | 'right' | 'center'> = ['center', 'left', 'right', 'left', 'right'];

  for (let i = 0; i < total; i++) {
    const vibeIndex = Math.min(3, Math.floor((i / total) * 4));
    nodes.push({
      id: i,
      minPoints: i === 0 ? 0 : i * pointsStep,
      emoji: NODE_EMOJIS[i % NODE_EMOJIS.length],
      title: NODE_TITLES[i % NODE_TITLES.length] + (i >= NODE_TITLES.length ? ` ${Math.floor(i / NODE_TITLES.length) + 1}` : ''),
      vibeIndex,
      side: sides[i % sides.length],
    });
  }
  return nodes;
}

export const JOURNEY_NODES = buildNodes();

export function getVibeForScrollProgress(progress: number): PathVibe {
  const idx = Math.min(3, Math.floor(progress * 4));
  return PATH_VIBES[idx];
}

export function getNodeProgress(points: number, node: PathNode, next?: PathNode): number {
  if (!next) return points >= node.minPoints ? 100 : 0;
  if (points < node.minPoints) return 0;
  if (points >= next.minPoints) return 100;
  const range = next.minPoints - node.minPoints;
  return Math.round(((points - node.minPoints) / range) * 100);
}
