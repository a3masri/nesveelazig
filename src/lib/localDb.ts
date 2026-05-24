import type { Profile, RedemptionCode, Reward, Ticket } from './types';
import { SIGNUP_BONUS_POINTS } from './constants';

export const DEMO_ADMIN_EMAIL = 'admin@nesve.com';
export const DEMO_USER_EMAIL = 'demo@nesve.com';

const SESSION_KEY = 'nesve-session';
const PROFILES_KEY = 'nesve-profiles';
const CODES_KEY = 'nesve-codes';
const TICKETS_KEY = 'nesve-tickets';
const REWARDS_KEY = 'nesve-rewards';

export const LOCAL_REWARDS: Reward[] = [
  { id: '1', name: 'Espresso', description: 'Yoğun tek shot', emoji: '☕', point_cost: 40, category: 'coffee', rarity: 'common', is_active: true, stock: 99, image_url: '' },
  { id: '2', name: 'Latte', description: 'Sütlü yumuşak latte', emoji: '🥛', point_cost: 55, category: 'coffee', rarity: 'common', is_active: true, stock: 99, image_url: '' },
  { id: '3', name: 'Cappuccino', description: 'Köpüklü cappuccino', emoji: '☕', point_cost: 60, category: 'coffee', rarity: 'rare', is_active: true, stock: 80, image_url: '' },
  { id: '4', name: 'Americano', description: 'Uzun americano', emoji: '🫖', point_cost: 45, category: 'coffee', rarity: 'common', is_active: true, stock: 99, image_url: '' },
  { id: '5', name: 'Türk Çayı', description: 'Demli ince belli çay', emoji: '🍵', point_cost: 35, category: 'tea', rarity: 'common', is_active: true, stock: 99, image_url: '' },
  { id: '6', name: 'Yeşil Çay', description: 'Antioksidan yeşil çay', emoji: '🍃', point_cost: 40, category: 'tea', rarity: 'rare', is_active: true, stock: 70, image_url: '' },
  { id: '7', name: 'Kruvasan', description: 'Tereyağlı kruvasan', emoji: '🥐', point_cost: 50, category: 'pastry', rarity: 'common', is_active: true, stock: 60, image_url: '' },
  { id: '8', name: 'Simit', description: 'Susamlı sıcak simit', emoji: '🥯', point_cost: 30, category: 'pastry', rarity: 'common', is_active: true, stock: 80, image_url: '' },
  { id: '9', name: 'Cheesecake', description: 'New York cheesecake', emoji: '🍰', point_cost: 90, category: 'pastry', rarity: 'epic', is_active: true, stock: 25, image_url: '' },
  { id: '10', name: 'Kurabiye', description: 'Çikolatalı kurabiye', emoji: '🍪', point_cost: 35, category: 'pastry', rarity: 'common', is_active: true, stock: 99, image_url: '' },
  { id: '11', name: 'Gizem Sandığı', description: 'Sürpriz içecek veya tatlı', emoji: '🎁', point_cost: 150, category: 'mystery', rarity: 'epic', is_active: true, stock: 20, image_url: '' },
  { id: '12', name: 'VIP Fincan', description: 'İsme özel latte sanatı', emoji: '👑', point_cost: 400, category: 'exclusive', rarity: 'legendary', is_active: true, stock: 5, image_url: '' },
  { id: '13', name: 'Buzlu Mocha', description: 'Yazlık buzlu mocha', emoji: '🧊', point_cost: 70, category: 'coffee', rarity: 'rare', is_active: true, stock: 50, image_url: '' },
  { id: '14', name: 'Matcha Latte', description: 'Japon matcha latte', emoji: '🍵', point_cost: 75, category: 'tea', rarity: 'rare', is_active: true, stock: 40, image_url: '' },
];

export const FAKE_LEADERS: Profile[] = [
  { id: 'f1', display_name: 'KahveKrali', avatar_url: '', total_points: 12450, current_rank: 'Efsane Arena', streak_count: 42, longest_streak: 50, last_visit_date: null, role: 'user', created_at: '', updated_at: '' },
  { id: 'f2', display_name: 'LatteQueen', avatar_url: '', total_points: 11200, current_rank: 'Efsane Arena', streak_count: 38, longest_streak: 45, last_visit_date: null, role: 'user', created_at: '', updated_at: '' },
  { id: 'f3', display_name: 'BaristaAli', avatar_url: '', total_points: 9800, current_rank: 'Büyü Vadisi', streak_count: 31, longest_streak: 40, last_visit_date: null, role: 'user', created_at: '', updated_at: '' },
  { id: 'f4', display_name: 'CroissantFan', avatar_url: '', total_points: 8750, current_rank: 'Büyü Vadisi', streak_count: 28, longest_streak: 35, last_visit_date: null, role: 'user', created_at: '', updated_at: '' },
  { id: 'f5', display_name: 'MochaMaster', avatar_url: '', total_points: 7200, current_rank: 'Barbar Çayı', streak_count: 22, longest_streak: 30, last_visit_date: null, role: 'user', created_at: '', updated_at: '' },
];

export type LocalSession = { userId: string; email: string; role: string; displayName: string };

export function getLocalSession(): LocalSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLocalSession(session: LocalSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearLocalSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function clearAllLocalData() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PROFILES_KEY);
  localStorage.removeItem(CODES_KEY);
  localStorage.removeItem(TICKETS_KEY);
  localStorage.removeItem(REWARDS_KEY);
  localStorage.removeItem('nesve-admin-logs');
  localStorage.removeItem('nesve-admin-settings');
  localStorage.removeItem('nesve-notifications');
  localStorage.removeItem('nesve-content');
}

function readProfiles(): Record<string, Profile> {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeProfiles(profiles: Record<string, Profile>) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getLocalProfile(userId: string): Profile | null {
  return readProfiles()[userId] || null;
}

export function saveLocalProfile(profile: Profile) {
  const profiles = readProfiles();
  profiles[profile.id] = { ...profile, updated_at: new Date().toISOString() };
  writeProfiles(profiles);
}

export function deleteLocalProfile(userId: string): boolean {
  const profiles = readProfiles();
  if (!profiles[userId]) return false;
  delete profiles[userId];
  writeProfiles(profiles);
  return true;
}

export function createLocalProfile(role: 'user' | 'admin', displayName: string, id?: string): Profile {
  const now = new Date().toISOString();
  return {
    id: id || (role === 'admin' ? 'demo-admin-id' : 'demo-user-id'),
    display_name: displayName,
    avatar_url: '',
    total_points: role === 'admin' ? 0 : SIGNUP_BONUS_POINTS,
    current_rank: role === 'admin' ? 'Antrenman Kampı' : 'Goblin Stadyumu',
    streak_count: role === 'admin' ? 0 : 5,
    longest_streak: role === 'admin' ? 0 : 12,
    last_visit_date: now.split('T')[0],
    role,
    created_at: now,
    updated_at: now,
  };
}

export function getLocalCodes(): RedemptionCode[] {
  try {
    return JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveLocalCode(code: RedemptionCode) {
  const codes = getLocalCodes();
  codes.unshift(code);
  localStorage.setItem(CODES_KEY, JSON.stringify(codes.slice(0, 50)));
}

export function findLocalCode(codeStr: string): RedemptionCode | null {
  return getLocalCodes().find(c => c.code === codeStr.toUpperCase() && c.status === 'active') || null;
}

export function markLocalCodeUsed(codeId: string, userId: string) {
  const codes = getLocalCodes().map(c =>
    c.id === codeId ? { ...c, status: 'used' as const, used_by: userId, used_at: new Date().toISOString() } : c
  );
  localStorage.setItem(CODES_KEY, JSON.stringify(codes));
}

export function getLocalTickets(userId: string): Ticket[] {
  try {
    const all: Ticket[] = JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
    return all.filter(t => t.user_id === userId);
  } catch {
    return [];
  }
}

export function addLocalTicket(ticket: Ticket) {
  try {
    const all: Ticket[] = JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
    all.unshift(ticket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(all));
  } catch {
    localStorage.setItem(TICKETS_KEY, JSON.stringify([ticket]));
  }
}

export function getLocalLeaders(): Profile[] {
  return Object.values(readProfiles()).sort((a, b) => b.total_points - a.total_points);
}

export function getAllLocalProfiles(): Profile[] {
  return Object.values(readProfiles());
}

export function getAllLocalTickets(): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getLocalRewards(activeOnly = false): Reward[] {
  try {
    const raw = localStorage.getItem(REWARDS_KEY);
    let list: Reward[];
    if (raw) list = JSON.parse(raw);
    else {
      localStorage.setItem(REWARDS_KEY, JSON.stringify(LOCAL_REWARDS));
      list = [...LOCAL_REWARDS];
    }
    return activeOnly ? list.filter(r => r.is_active) : list;
  } catch {
    return activeOnly ? LOCAL_REWARDS.filter(r => r.is_active) : [...LOCAL_REWARDS];
  }
}

export function decrementLocalRewardStock(rewardId: string): void {
  const rewards = getLocalRewards().map(r =>
    r.id === rewardId && r.stock !== null ? { ...r, stock: Math.max(0, r.stock - 1) } : r
  );
  saveLocalRewards(rewards);
}

export function saveLocalRewards(rewards: Reward[]): void {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}
