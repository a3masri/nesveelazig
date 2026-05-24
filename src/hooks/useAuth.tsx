import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocalStorage } from '../lib/firebase';
import { SIGNUP_BONUS_POINTS } from '../lib/constants';
import {
  DEMO_ADMIN_EMAIL,
  getLocalSession,
  setLocalSession,
  clearLocalSession,
  createLocalProfile,
  saveLocalProfile,
  getLocalProfile,
} from '../lib/localDb';
import { getProfile, saveProfile, updateProfileRole } from '../lib/db';
import { addAdminLog } from '../lib/adminLogs';
import type { AuthUser } from '../lib/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isLocal: boolean;
  roleVersion: number;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInDemo: (role: 'user' | 'admin') => void;
  promoteToAdmin: () => Promise<void>;
  promoteToUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function firebaseUserToAuthUser(fbUser: { uid: string; email: string | null; displayName: string | null }): AuthUser {
  return { id: fbUser.uid, email: fbUser.email, displayName: fbUser.displayName };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleVersion, setRoleVersion] = useState(0);
  const isLocal = useLocalStorage();

  useEffect(() => {
    if (isLocal) {
      const s = getLocalSession();
      if (s) setUser({ id: s.userId, email: s.email, displayName: s.displayName });
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsub: (() => void) | undefined;

    (async () => {
      const { onAuthStateChanged } = await import('firebase/auth');
      const { auth } = await import('../lib/firebase');
      if (cancelled) return;
      if (!auth) {
        setLoading(false);
        return;
      }
      unsub = onAuthStateChanged(auth, fbUser => {
        setUser(fbUser ? firebaseUserToAuthUser(fbUser) : null);
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [isLocal]);

  const signInDemo = (role: 'user' | 'admin') => {
    const displayName = role === 'admin' ? 'Admin' : 'Demo Kahraman';
    const id = role === 'admin' ? 'demo-admin-id' : 'demo-user-id';
    const email = role === 'admin' ? DEMO_ADMIN_EMAIL : 'demo@nesve.com';
    const profile = createLocalProfile(role, displayName, id);
    saveLocalProfile(profile);
    setLocalSession({ userId: id, email, role, displayName });
    setUser({ id, email, displayName });
    setRoleVersion(v => v + 1);
    addAdminLog({
      type: 'auth',
      action: role === 'admin' ? 'Admin demo girişi' : 'Demo girişi',
      actor_id: id,
      actor_name: displayName,
    });
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    if (isLocal) {
      const id = `local-${Date.now()}`;
      const profile = createLocalProfile('user', displayName, id);
      profile.total_points = SIGNUP_BONUS_POINTS;
      saveLocalProfile(profile);
      setLocalSession({ userId: id, email, role: 'user', displayName });
      setUser({ id, email, displayName });
      return;
    }
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    if (!auth) throw new Error('Firebase yapılandırılmamış');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const role = email.toLowerCase() === DEMO_ADMIN_EMAIL ? 'admin' : 'user';
    const profile = createLocalProfile(role, displayName, cred.user.uid);
    profile.total_points = SIGNUP_BONUS_POINTS;
    await saveProfile(profile);
    setUser(firebaseUserToAuthUser(cred.user));
  };

  const signIn = async (email: string, password: string) => {
    if (isLocal) {
      const role =
        email.toLowerCase() === DEMO_ADMIN_EMAIL || email.toLowerCase() === 'admin' ? 'admin' : 'user';
      signInDemo(role);
      return;
    }
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    if (!auth) throw new Error('Firebase yapılandırılmamış');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (email.toLowerCase() === DEMO_ADMIN_EMAIL) {
      await updateProfileRole(cred.user.uid, 'admin');
    }
    setUser(firebaseUserToAuthUser(cred.user));
  };

  const signInWithGoogle = async () => {
    if (isLocal) {
      signInDemo('user');
      return;
    }
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    if (!auth) throw new Error('Firebase yapılandırılmamış');
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    let profile = await getProfile(cred.user.uid);
    if (!profile) {
      profile = createLocalProfile('user', cred.user.displayName || 'Kahraman', cred.user.uid);
      profile.total_points = SIGNUP_BONUS_POINTS;
      await saveProfile(profile);
    }
    setUser(firebaseUserToAuthUser(cred.user));
  };

  const promoteToAdmin = async () => {
    const uid = user?.id;
    if (!uid) return;

    if (isLocal) {
      const session = getLocalSession();
      const existing = getLocalProfile(uid) || createLocalProfile('user', session?.displayName || 'Kahraman', uid);
      saveLocalProfile({
        ...existing,
        id: uid,
        role: 'admin',
        total_points: 0,
        streak_count: 0,
        current_rank: 'Antrenman Kampı',
      });
      setLocalSession({
        userId: uid,
        email: DEMO_ADMIN_EMAIL,
        role: 'admin',
        displayName: existing.display_name,
      });
      setUser({ id: uid, email: DEMO_ADMIN_EMAIL, displayName: existing.display_name });
    } else {
      await updateProfileRole(uid, 'admin');
    }
    setRoleVersion(v => v + 1);
    addAdminLog({
      type: 'security',
      action: 'Admin moduna geçildi',
      actor_id: uid,
      actor_name: user?.displayName || 'Admin',
    });
  };

  const promoteToUser = async () => {
    const uid = user?.id;
    if (!uid) return;

    if (isLocal) {
      const existing = getLocalProfile(uid) || createLocalProfile('user', 'Demo Kahraman', uid);
      saveLocalProfile({
        ...existing,
        id: uid,
        role: 'user',
        total_points: existing.total_points || 350,
        streak_count: 5,
        current_rank: 'Goblin Stadyumu',
      });
      setLocalSession({
        userId: uid,
        email: 'demo@nesve.com',
        role: 'user',
        displayName: existing.display_name,
      });
      setUser({ id: uid, email: 'demo@nesve.com', displayName: existing.display_name });
    } else {
      await updateProfileRole(uid, 'user');
    }
    setRoleVersion(v => v + 1);
    addAdminLog({
      type: 'security',
      action: 'Kullanıcı moduna geçildi',
      actor_id: uid,
      actor_name: user?.displayName || 'Admin',
    });
  };

  const signOut = async () => {
    if (user) {
      addAdminLog({
        type: 'auth',
        action: 'Çıkış yapıldı',
        actor_id: user.id,
        actor_name: user.displayName || user.email || undefined,
      });
    }
    if (isLocal) {
      clearLocalSession();
      setUser(null);
      return;
    }
    const { signOut: firebaseSignOut } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    if (auth) await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLocal,
        roleVersion,
        signUp,
        signIn,
        signInWithGoogle,
        signInDemo,
        promoteToAdmin,
        promoteToUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
