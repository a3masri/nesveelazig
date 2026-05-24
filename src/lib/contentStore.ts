import type { ContentBlock } from './types';

const KEY = 'nesve-content';

const DEFAULT_CONTENT: ContentBlock[] = [
  { id: 'about', slug: 'hakkimizda', title: 'Hakkımızda', body: 'Neşve — kahve sadakat programı. Her fincan bir kupa.', updated_at: new Date().toISOString() },
  { id: 'contact', slug: 'iletisim', title: 'İletişim', body: 'Bize ulaşın: info@nesve.com', updated_at: new Date().toISOString() },
  { id: 'privacy', slug: 'gizlilik', title: 'Gizlilik', body: 'Gizlilik politikası metni burada düzenlenebilir.', updated_at: new Date().toISOString() },
  { id: 'terms', slug: 'kullanim-kosullari', title: 'Kullanım Koşulları', body: 'Kullanım koşulları metni burada düzenlenebilir.', updated_at: new Date().toISOString() },
];

export function getContentBlocks(): ContentBlock[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* defaults */
  }
  localStorage.setItem(KEY, JSON.stringify(DEFAULT_CONTENT));
  return DEFAULT_CONTENT;
}

export function getContentBySlug(slug: string): ContentBlock | null {
  return getContentBlocks().find(c => c.slug === slug) || null;
}

export function saveContentBlock(block: ContentBlock): void {
  const all = getContentBlocks().map(c => (c.id === block.id ? { ...block, updated_at: new Date().toISOString() } : c));
  localStorage.setItem(KEY, JSON.stringify(all));
}
