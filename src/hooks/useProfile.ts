import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getProfile, saveProfile } from '../lib/db';
import { createLocalProfile, saveLocalProfile, getLocalProfile } from '../lib/localDb';
import { useLocalStorage } from '../lib/firebase';
import type { Profile } from '../lib/types';

export type { Profile };

export function useProfile() {
  const { user, roleVersion } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isLocal = useLocalStorage();

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    let p = isLocal ? getLocalProfile(user.id) : await getProfile(user.id);

    if (!p) {
      const role =
        user.email?.includes('admin') || user.id === 'demo-admin-id' ? 'admin' : 'user';
      p = createLocalProfile(role as 'user' | 'admin', user.displayName || user.email?.split('@')[0] || 'Kahraman', user.id);
      if (isLocal) saveLocalProfile(p);
      else await saveProfile(p);
    }

    setProfile(p);
    setLoading(false);
  }, [user, isLocal]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile, roleVersion]);

  const updateProfile = async (next: Profile) => {
    setProfile(next);
    if (isLocal) saveLocalProfile(next);
    else await saveProfile(next);
  };

  return { profile, setProfile: updateProfile, loading, refreshProfile: loadProfile };
}
