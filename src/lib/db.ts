import { useLocalStorage } from './firebase';
import type { Profile, RedemptionCode, Reward, Ticket } from './types';
import {
  LOCAL_REWARDS,
  FAKE_LEADERS,
  getLocalProfile,
  saveLocalProfile,
  createLocalProfile,
  getLocalCodes,
  saveLocalCode,
  findLocalCode,
  markLocalCodeUsed,
  getLocalTickets,
  addLocalTicket,
  getLocalLeaders,
  getLocalRewards,
  decrementLocalRewardStock,
} from './localDb';
import { addAdminLog } from './adminLogs';
import { getRankForPoints } from './constants';

export { LOCAL_REWARDS, FAKE_LEADERS } from './localDb';
export { useLocalStorage } from './firebase';
export type { Profile, RedemptionCode, Reward, Ticket } from './types';

async function firestore() {
  return import('./dbFirestore');
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (useLocalStorage()) return getLocalProfile(userId);
  const fs = await firestore();
  return fs.getProfileFirestore(userId);
}

export async function saveProfile(profile: Profile): Promise<void> {
  if (useLocalStorage()) {
    saveLocalProfile(profile);
    return;
  }
  const fs = await firestore();
  await fs.saveProfileFirestore(profile);
}

export async function updateProfileRole(userId: string, role: 'user' | 'admin'): Promise<Profile> {
  const existing = (await getProfile(userId)) || createLocalProfile(role, 'Kullanıcı', userId);
  const updated: Profile = {
    ...existing,
    role,
    total_points: role === 'admin' ? 0 : existing.total_points || 350,
    streak_count: role === 'admin' ? 0 : existing.streak_count || 5,
    current_rank: role === 'admin' ? 'Antrenman Kampı' : existing.current_rank || 'Goblin Stadyumu',
    updated_at: new Date().toISOString(),
  };
  await saveProfile(updated);
  return updated;
}

export async function updateProfilePoints(userId: string, newTotalPoints: number): Promise<Profile> {
  const rank = getRankForPoints(newTotalPoints);
  const existing = (await getProfile(userId)) || createLocalProfile('user', 'Kullanıcı', userId);
  const updated: Profile = {
    ...existing,
    total_points: newTotalPoints,
    current_rank: rank.name,
    updated_at: new Date().toISOString(),
  };
  await saveProfile(updated);
  return updated;
}

export async function getRewards(): Promise<Reward[]> {
  if (useLocalStorage()) return getLocalRewards(true);
  const fs = await firestore();
  return fs.getRewardsFirestore();
}

export async function createRedemptionCode(points: number, createdBy: string): Promise<string> {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const entry: RedemptionCode = {
    id: `code-${Date.now()}`,
    code,
    points_value: points,
    created_by: createdBy,
    status: 'active',
    created_at: new Date().toISOString(),
  };
  if (useLocalStorage()) {
    saveLocalCode(entry);
    addAdminLog({
      type: 'code',
      action: 'Kod oluşturuldu',
      actor_id: createdBy,
      actor_name: getLocalProfile(createdBy)?.display_name || 'Admin',
      details: `${points} kupa — ${code}`,
    });
    return code;
  }
  const fs = await firestore();
  await fs.createRedemptionCodeFirestore(entry);
  return code;
}

export async function getRecentCodes(createdBy: string): Promise<RedemptionCode[]> {
  if (useLocalStorage()) {
    return getLocalCodes().filter(c => c.created_by === createdBy).slice(0, 10);
  }
  const fs = await firestore();
  return fs.getRecentCodesFirestore(createdBy);
}

export async function redeemCode(codeStr: string, userId: string): Promise<{ ok: boolean; points?: number; error?: string }> {
  if (useLocalStorage()) {
    const found = findLocalCode(codeStr);
    if (!found) return { ok: false, error: 'Geçersiz veya kullanılmış kod' };
    markLocalCodeUsed(found.id, userId);
    const user = getLocalProfile(userId);
    addAdminLog({
      type: 'redeem',
      action: 'Kod kullanıldı',
      actor_id: userId,
      actor_name: user?.display_name,
      details: `+${found.points_value} kupa — ${codeStr.toUpperCase()}`,
    });
    return { ok: true, points: found.points_value };
  }
  const fs = await firestore();
  return fs.redeemCodeFirestore(codeStr, userId);
}

export async function createTicket(userId: string, reward: Reward, code: string): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  const ticket: Ticket = {
    id: `ticket-${Date.now()}`,
    user_id: userId,
    reward_id: reward.id,
    code,
    status: 'active',
    rarity: reward.rarity,
    redeemed_at: null,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
    rewards: {
      name: reward.name,
      description: reward.description,
      category: reward.category,
      image_url: reward.image_url,
    },
  };
  if (useLocalStorage()) {
    addLocalTicket(ticket);
    if (reward.stock !== null) decrementLocalRewardStock(reward.id);
    const buyer = getLocalProfile(userId);
    addAdminLog({
      type: 'purchase',
      action: 'Ödül satın alındı',
      actor_id: userId,
      actor_name: buyer?.display_name,
      details: `${reward.name} — ${reward.point_cost} kupa`,
    });
    return;
  }
  const fs = await firestore();
  await fs.createTicketFirestore(ticket);
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  if (useLocalStorage()) return getLocalTickets(userId);
  const fs = await firestore();
  return fs.getUserTicketsFirestore(userId);
}

export async function getLeaderboard(): Promise<Profile[]> {
  if (useLocalStorage()) {
    const real = getLocalLeaders();
    return real.length > 0 ? real : FAKE_LEADERS;
  }
  const fs = await firestore();
  return fs.getLeaderboardFirestore();
}

export async function findProfileByDisplayName(name: string): Promise<Profile | null> {
  if (useLocalStorage()) {
    const all = Object.values(
      JSON.parse(localStorage.getItem('nesve-profiles') || '{}') as Record<string, Profile>
    );
    return all.find(p => p.display_name.toLowerCase() === name.trim().toLowerCase()) || null;
  }
  const fs = await firestore();
  return fs.findProfileByDisplayNameFirestore(name);
}

export async function redeemCodeForUser(codeStr: string, customerName: string): Promise<{ ok: boolean; message: string }> {
  const customer = await findProfileByDisplayName(customerName);
  if (!customer) return { ok: false, message: 'Müşteri bulunamadı' };
  const result = await redeemCode(codeStr, customer.id);
  if (!result.ok) return { ok: false, message: result.error || 'Kod kullanılamadı' };
  await updateProfilePoints(customer.id, customer.total_points + (result.points || 0));
  return { ok: true, message: `${customer.display_name} hesabına ${result.points} kupa eklendi` };
}
