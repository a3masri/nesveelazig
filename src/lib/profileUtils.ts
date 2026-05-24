import { updateProfilePoints as dbUpdateProfilePoints } from './db';

export async function updateProfilePoints(
  userId: string,
  newTotalPoints: number
): Promise<{ error: Error | null }> {
  try {
    await dbUpdateProfilePoints(userId, newTotalPoints);
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e : new Error('Profil güncellenemedi') };
  }
}

export async function addProfilePoints(userId: string, currentPoints: number, delta: number) {
  return updateProfilePoints(userId, currentPoints + delta);
}
