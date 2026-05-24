import type { AppNotification } from './types';

const KEY = 'nesve-notifications';

export function getNotifications(userId?: string | null): AppNotification[] {
  try {
    const all: AppNotification[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (userId) return all.filter(n => n.user_id === userId || n.user_id === null);
    return all;
  } catch {
    return [];
  }
}

export function addNotification(n: Omit<AppNotification, 'id' | 'created_at' | 'read'>): AppNotification {
  const entry: AppNotification = {
    ...n,
    id: `notif-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
  };
  const all = [entry, ...getNotifications()];
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 100)));
  return entry;
}

export function markNotificationRead(id: string): void {
  const all = getNotifications().map(n => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function markAllRead(userId: string): void {
  const all = getNotifications().map(n =>
    n.user_id === userId || n.user_id === null ? { ...n, read: true } : n
  );
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter(n => !n.read).length;
}

export function deleteNotification(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(getNotifications().filter(n => n.id !== id)));
}

export function seedNotificationsIfEmpty(): void {
  if (getNotifications().length > 0) return;
  const seeds = [
    { user_id: null, title: 'Hoş geldin!', message: 'Neşve macerana başla — ilk kupalarını kazan.', type: 'info' as const },
    { user_id: null, title: 'Yeni ödüller', message: 'Dükkan\'da yeni kruvasan ve matcha latte var.', type: 'promo' as const },
  ];
  seeds.forEach(s => addNotification(s));
}
