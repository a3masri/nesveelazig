import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { firestore } from './firebase';
import type { Profile, RedemptionCode, Reward, Ticket } from './types';

function db() {
  if (!firestore) throw new Error('Firestore yapılandırılmamış');
  return firestore;
}

export async function getProfileFirestore(userId: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db(), 'profiles', userId));
  return snap.exists() ? (snap.data() as Profile) : null;
}

export async function saveProfileFirestore(profile: Profile): Promise<void> {
  await setDoc(doc(db(), 'profiles', profile.id), profile, { merge: true });
}

export async function getRewardsFirestore(): Promise<Reward[]> {
  const snap = await getDocs(query(collection(db(), 'rewards'), where('is_active', '==', true)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Reward));
}

export async function createRedemptionCodeFirestore(entry: RedemptionCode): Promise<void> {
  await setDoc(doc(db(), 'redemption_codes', entry.id), entry);
}

export async function getRecentCodesFirestore(createdBy: string): Promise<RedemptionCode[]> {
  const snap = await getDocs(
    query(collection(db(), 'redemption_codes'), where('created_by', '==', createdBy), orderBy('created_at', 'desc'), limit(10))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as RedemptionCode));
}

export async function redeemCodeFirestore(
  codeStr: string,
  userId: string
): Promise<{ ok: boolean; points?: number; error?: string }> {
  const snap = await getDocs(
    query(collection(db(), 'redemption_codes'), where('code', '==', codeStr.toUpperCase()), where('status', '==', 'active'), limit(1))
  );
  if (snap.empty) return { ok: false, error: 'Geçersiz veya kullanılmış kod' };
  const codeDoc = snap.docs[0];
  const data = codeDoc.data() as RedemptionCode;
  await updateDoc(codeDoc.ref, { status: 'used', used_by: userId, used_at: new Date().toISOString() });
  return { ok: true, points: data.points_value };
}

export async function createTicketFirestore(ticket: Ticket): Promise<void> {
  await setDoc(doc(db(), 'tickets', ticket.id), ticket);
}

export async function getUserTicketsFirestore(userId: string): Promise<Ticket[]> {
  const snap = await getDocs(
    query(collection(db(), 'tickets'), where('user_id', '==', userId), orderBy('created_at', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket));
}

export async function getLeaderboardFirestore(): Promise<Profile[]> {
  const snap = await getDocs(query(collection(db(), 'profiles'), orderBy('total_points', 'desc'), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Profile));
}

export async function findProfileByDisplayNameFirestore(name: string): Promise<Profile | null> {
  const snap = await getDocs(
    query(collection(db(), 'profiles'), where('display_name', '==', name.trim()), limit(1))
  );
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Profile;
}
