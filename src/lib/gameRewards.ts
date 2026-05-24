import { getRankForPoints } from './constants';
import type { Profile } from './types';

export function awardPoints(
  profile: Profile,
  setProfile: (p: Profile) => void | Promise<void>,
  amount: number
): number {
  if (amount <= 0) return profile.total_points;
  const total = profile.total_points + amount;
  const rank = getRankForPoints(total);
  void setProfile({ ...profile, total_points: total, current_rank: rank.name });
  return total;
}

const DAILY_PREFIX = 'nesve-game-daily-';

export function getDailyPlayCount(gameId: string): number {
  const raw = localStorage.getItem(`${DAILY_PREFIX}${gameId}`);
  if (!raw) return 0;
  try {
    const { date, count } = JSON.parse(raw) as { date: string; count: number };
    if (date !== new Date().toISOString().slice(0, 10)) return 0;
    return count;
  } catch {
    return 0;
  }
}

export function incrementDailyPlay(gameId: string, maxPerDay: number): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const count = getDailyPlayCount(gameId);
  if (count >= maxPerDay) return false;
  localStorage.setItem(`${DAILY_PREFIX}${gameId}`, JSON.stringify({ date: today, count: count + 1 }));
  return true;
}

export function canPlayDaily(gameId: string, maxPerDay: number): boolean {
  return getDailyPlayCount(gameId) < maxPerDay;
}
