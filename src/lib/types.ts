export type AuthUser = {
  id: string;
  email: string | null;
  displayName?: string | null;
};

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string;
  total_points: number;
  current_rank: string;
  streak_count: number;
  longest_streak: number;
  last_visit_date: string | null;
  role: string;
  status?: 'active' | 'banned';
  email?: string;
  created_at: string;
  updated_at: string;
};

export type AdminLogType =
  | 'auth'
  | 'code'
  | 'redeem'
  | 'purchase'
  | 'user'
  | 'reward'
  | 'security'
  | 'system';

export type AdminLog = {
  id: string;
  type: AdminLogType;
  action: string;
  actor_id?: string;
  actor_name?: string;
  target_id?: string;
  target_name?: string;
  details?: string;
  created_at: string;
};

export type AdminSettings = {
  signupBonus: number;
  codeExpiryDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxDailyCodes: number;
  programName: string;
};

export type AdminStats = {
  totalMembers: number;
  activeMembers: number;
  bannedMembers: number;
  adminCount: number;
  totalPoints: number;
  avgPoints: number;
  codesGenerated: number;
  codesUsed: number;
  codesActive: number;
  ticketsTotal: number;
  ticketsActive: number;
  pointsRedeemedToday: number;
  newMembersWeek: number;
};

export type RedemptionCode = {
  id: string;
  code: string;
  points_value: number;
  created_by: string;
  status: 'active' | 'used' | 'expired';
  used_by?: string | null;
  used_at?: string | null;
  created_at: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  point_cost: number;
  category: string;
  rarity: string;
  is_active: boolean;
  stock: number | null;
  emoji?: string;
};

export type Ticket = {
  id: string;
  user_id: string;
  reward_id: string;
  code: string;
  status: string;
  rarity: string;
  redeemed_at: string | null;
  expires_at: string;
  created_at: string;
  rewards?: { name: string; description: string; category: string; image_url: string };
};

/** Order = ticket purchase transaction for admin */
export type Order = Ticket & {
  user_name?: string;
  point_cost?: number;
};

export type AppNotification = {
  id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'promo';
  read: boolean;
  created_at: string;
};

export type ContentBlock = {
  id: string;
  slug: string;
  title: string;
  body: string;
  updated_at: string;
};

export type UserRole = 'user' | 'admin' | 'cashier' | 'manager';

export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Kullanıcı',
  admin: 'Admin',
  cashier: 'Kasiyer',
  manager: 'Yönetici',
};
