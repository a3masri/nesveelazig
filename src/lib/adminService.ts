import type { AdminLog, AdminSettings, AdminStats, Order, Profile, RedemptionCode, Reward, Ticket, UserRole } from './types';
import { createLocalProfile } from './localDb';
import { SIGNUP_BONUS_POINTS } from './constants';
import {
  getAllLocalProfiles,
  getAllLocalTickets,
  getLocalCodes,
  getLocalRewards,
  saveLocalRewards,
  getLocalProfile,
  saveLocalProfile,
  deleteLocalProfile,
  FAKE_LEADERS,
} from './localDb';
import { getAdminLogs, getAdminLogsFiltered, seedAdminLogsIfEmpty } from './adminLogs';
import { getRankForPoints } from './constants';
import { updateProfilePoints } from './db';

const SETTINGS_KEY = 'nesve-admin-settings';

const DEFAULT_SETTINGS: AdminSettings = {
  signupBonus: 350,
  codeExpiryDays: 30,
  maintenanceMode: false,
  allowRegistration: true,
  maxDailyCodes: 100,
  programName: 'Neşve',
};

export function initAdminData(): void {
  seedAdminLogsIfEmpty();
  getLocalRewards();
  ensureDemoMembers();
  import('./notifications').then(m => m.seedNotificationsIfEmpty());
  import('./contentStore').then(m => m.getContentBlocks());
}

function ensureDemoMembers(): void {
  const profiles = getAllLocalProfiles();
  if (profiles.filter(p => p.role !== 'admin').length >= 3) return;
  FAKE_LEADERS.forEach((f, i) => {
    if (!getLocalProfile(f.id)) {
      saveLocalProfile({
        ...f,
        id: f.id,
        status: 'active',
        created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  });
}

export function getAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function computeAdminStats(): AdminStats {
  const profiles = getAllLocalProfiles().filter(p => p.role !== 'admin');
  const codes = getLocalCodes();
  const tickets = getAllLocalTickets();
  const weekAgo = Date.now() - 7 * 86400000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const activeMembers = profiles.filter(
    p => p.status !== 'banned' && p.last_visit_date && new Date(p.last_visit_date).getTime() > weekAgo
  ).length;

  const newMembersWeek = profiles.filter(p => new Date(p.created_at).getTime() > weekAgo).length;

  const pointsRedeemedToday = getAdminLogsFiltered({ type: 'redeem', limit: 100 })
    .filter(l => new Date(l.created_at) >= todayStart)
    .reduce((sum, l) => {
      const m = l.details?.match(/\+(\d+)/);
      return sum + (m ? parseInt(m[1], 10) : 0);
    }, 0);

  const totalPoints = profiles.reduce((s, p) => s + p.total_points, 0);

  return {
    totalMembers: profiles.length,
    activeMembers,
    bannedMembers: profiles.filter(p => p.status === 'banned').length,
    adminCount: getAllLocalProfiles().filter(p => p.role === 'admin').length,
    totalPoints,
    avgPoints: profiles.length ? Math.round(totalPoints / profiles.length) : 0,
    codesGenerated: codes.length,
    codesUsed: codes.filter(c => c.status === 'used').length,
    codesActive: codes.filter(c => c.status === 'active').length,
    ticketsTotal: tickets.length,
    ticketsActive: tickets.filter(t => t.status === 'active').length,
    pointsRedeemedToday,
    newMembersWeek,
  };
}

export function getActivityByDay(days = 7): { label: string; count: number }[] {
  const logs = getAdminLogs();
  const result: { label: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = logs.filter(l => {
      const t = new Date(l.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    result.push({
      label: d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' }),
      count,
    });
  }
  return result;
}

export function getRankDistribution(): { rank: string; count: number }[] {
  const profiles = getAllLocalProfiles().filter(p => p.role !== 'admin');
  const map = new Map<string, number>();
  profiles.forEach(p => {
    const rank = p.current_rank || getRankForPoints(p.total_points).name;
    map.set(rank, (map.get(rank) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([rank, count]) => ({ rank, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTopMembers(limit = 10): Profile[] {
  return getAllLocalProfiles()
    .filter(p => p.role !== 'admin')
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, limit);
}

export function getAllMembers(search?: string): Profile[] {
  let list = getAllLocalProfiles().filter(p => p.role !== 'admin');
  if (search?.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      p => p.display_name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
    );
  }
  return list.sort((a, b) => b.total_points - a.total_points);
}

export async function updateMember(
  id: string,
  updates: Partial<Pick<Profile, 'display_name' | 'role' | 'status' | 'total_points' | 'streak_count'>>
): Promise<Profile | null> {
  const existing = getLocalProfile(id);
  if (!existing) return null;
  const points = updates.total_points ?? existing.total_points;
  const updated: Profile = {
    ...existing,
    ...updates,
    current_rank: getRankForPoints(points).name,
    updated_at: new Date().toISOString(),
  };
  saveLocalProfile(updated);
  return updated;
}

export async function adjustMemberPoints(id: string, delta: number): Promise<Profile | null> {
  const p = getLocalProfile(id);
  if (!p) return null;
  const newTotal = Math.max(0, p.total_points + delta);
  await updateProfilePoints(id, newTotal);
  return getLocalProfile(id);
}

export function getAllCodes(): RedemptionCode[] {
  return getLocalCodes();
}

export function revokeCode(codeId: string): void {
  const codes = getLocalCodes().map(c =>
    c.id === codeId ? { ...c, status: 'expired' as const } : c
  );
  localStorage.setItem('nesve-codes', JSON.stringify(codes));
}

export function getRewardsAdmin(): Reward[] {
  return getLocalRewards();
}

export function updateRewardAdmin(rewardId: string, updates: Partial<Reward>): void {
  const rewards = getLocalRewards().map(r => (r.id === rewardId ? { ...r, ...updates } : r));
  saveLocalRewards(rewards);
}

export function createMember(displayName: string, email?: string, role: UserRole = 'user'): Profile {
  const id = `user-${Date.now()}`;
  const profile = createLocalProfile(role === 'admin' ? 'admin' : 'user', displayName, id);
  profile.email = email;
  profile.role = role;
  profile.total_points = role === 'admin' ? 0 : SIGNUP_BONUS_POINTS;
  profile.status = 'active';
  saveLocalProfile(profile);
  return profile;
}

export function deleteMember(id: string): boolean {
  const target = getLocalProfile(id);
  if (!target || target.role === 'admin') return false;
  return deleteLocalProfile(id);
}

export function createReward(data: Omit<Reward, 'id'>): Reward {
  const reward: Reward = { ...data, id: `reward-${Date.now()}` };
  const rewards = [...getLocalRewards(), reward];
  saveLocalRewards(rewards);
  return reward;
}

export function deleteReward(rewardId: string): void {
  saveLocalRewards(getLocalRewards().filter(r => r.id !== rewardId));
}

export function getOrders(search?: string): Order[] {
  const profiles = Object.fromEntries(getAllLocalProfiles().map(p => [p.id, p]));
  const rewards = Object.fromEntries(getLocalRewards().map(r => [r.id, r]));
  let orders: Order[] = getAllLocalTickets().map(t => ({
    ...t,
    user_name: profiles[t.user_id]?.display_name || t.user_id,
    point_cost: rewards[t.reward_id]?.point_cost,
  }));
  orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  if (search?.trim()) {
    const q = search.toLowerCase();
    orders = orders.filter(
      o =>
        o.code.toLowerCase().includes(q) ||
        o.user_name?.toLowerCase().includes(q) ||
        o.rewards?.name.toLowerCase().includes(q)
    );
  }
  return orders;
}

export function updateOrderStatus(orderId: string, status: string): void {
  const tickets = getAllLocalTickets().map(t =>
    t.id === orderId ? { ...t, status, redeemed_at: status === 'redeemed' ? new Date().toISOString() : t.redeemed_at } : t
  );
  localStorage.setItem('nesve-tickets', JSON.stringify(tickets));
}

export function exportAdminData(): string {
  const data = {
    exported_at: new Date().toISOString(),
    stats: computeAdminStats(),
    members: getAllLocalProfiles(),
    codes: getLocalCodes(),
    tickets: getAllLocalTickets(),
    rewards: getLocalRewards(),
    logs: getAdminLogs(),
    settings: getAdminSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function exportLogsCsv(): string {
  const logs = getAdminLogs();
  const header = 'Tarih,Tür,İşlem,Yapan,Hedef,Detay\n';
  const rows = logs
    .map(l =>
      [
        new Date(l.created_at).toLocaleString('tr-TR'),
        l.type,
        l.action,
        l.actor_name || '',
        l.target_name || '',
        (l.details || '').replace(/,/g, ';'),
      ].join(',')
    )
    .join('\n');
  return header + rows;
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type { AdminLog, AdminSettings, AdminStats };
