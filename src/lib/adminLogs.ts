import type { AdminLog, AdminLogType } from './types';

const LOGS_KEY = 'nesve-admin-logs';
const MAX_LOGS = 500;

export function getAdminLogs(): AdminLog[] {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addAdminLog(entry: Omit<AdminLog, 'id' | 'created_at'>): AdminLog {
  const log: AdminLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };
  const logs = [log, ...getAdminLogs()].slice(0, MAX_LOGS);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  return log;
}

export function getAdminLogsFiltered(filters?: {
  type?: AdminLogType | 'all';
  search?: string;
  limit?: number;
}): AdminLog[] {
  let logs = getAdminLogs();
  if (filters?.type && filters.type !== 'all') {
    logs = logs.filter(l => l.type === filters.type);
  }
  if (filters?.search?.trim()) {
    const q = filters.search.toLowerCase();
    logs = logs.filter(
      l =>
        l.action.toLowerCase().includes(q) ||
        l.actor_name?.toLowerCase().includes(q) ||
        l.target_name?.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q)
    );
  }
  return logs.slice(0, filters?.limit ?? 200);
}

export function clearAdminLogs(): void {
  localStorage.removeItem(LOGS_KEY);
}

export function seedAdminLogsIfEmpty(): void {
  if (getAdminLogs().length > 0) return;
  const now = Date.now();
  const seeds: Omit<AdminLog, 'id' | 'created_at'>[] = [
    { type: 'system', action: 'Sistem başlatıldı', actor_name: 'Sistem', details: 'Neşve admin paneli hazır' },
    { type: 'auth', action: 'Admin girişi', actor_name: 'Admin', actor_id: 'demo-admin-id' },
    { type: 'code', action: 'Kod oluşturuldu', actor_name: 'Admin', details: '100 kupa — ABC12XYZ' },
    { type: 'redeem', action: 'Kod kullanıldı', actor_name: 'Demo Kahraman', target_name: 'Demo Kahraman', details: '+50 kupa' },
    { type: 'purchase', action: 'Ödül satın alındı', actor_name: 'Demo Kahraman', details: 'Latte — 55 kupa' },
    { type: 'user', action: 'Yeni üye kaydı', target_name: 'Yeni Üye', details: 'Hoş geldin bonusu verildi' },
    { type: 'reward', action: 'Stok güncellendi', actor_name: 'Admin', details: 'Kruvasan stok: 60' },
    { type: 'security', action: 'Rol değiştirildi', actor_name: 'Admin', details: 'Kullanıcı → Admin' },
  ];
  seeds.forEach((s, i) => {
    const log: AdminLog = {
      ...s,
      id: `seed-${i}`,
      created_at: new Date(now - i * 3600000 * 4).toISOString(),
    };
    const logs = getAdminLogs();
    logs.unshift(log);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
  });
}

export const LOG_TYPE_LABELS: Record<AdminLogType, string> = {
  auth: 'Giriş',
  code: 'Kod',
  redeem: 'Kullanım',
  purchase: 'Satın Alma',
  user: 'Üye',
  reward: 'Ödül',
  security: 'Güvenlik',
  system: 'Sistem',
};

export const LOG_TYPE_COLORS: Record<AdminLogType, string> = {
  auth: '#2C5F8A',
  code: '#FFD700',
  redeem: '#4CAF50',
  purchase: '#7B1FA2',
  user: '#FF6B35',
  reward: '#E53935',
  security: '#B71C1C',
  system: '#607D8B',
};
