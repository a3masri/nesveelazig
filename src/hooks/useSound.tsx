import { createContext, useContext, useEffect, useCallback, useState, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
  isSoundEnabled,
  setSoundEnabled,
  getSoundVolume,
  setSoundVolume,
  resumeAudio,
  playNav,
} from '../lib/sounds';

type SoundContextValue = {
  enabled: boolean;
  volume: number;
  setEnabled: (on: boolean) => void;
  setVolume: (v: number) => void;
  prime: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(isSoundEnabled);
  const [volume, setVolumeState] = useState(getSoundVolume);

  const prime = useCallback(() => {
    void resumeAudio();
  }, []);

  useEffect(() => {
    const onFirst = () => prime();
    document.addEventListener('pointerdown', onFirst, { once: true });
    return () => document.removeEventListener('pointerdown', onFirst);
  }, [prime]);

  const setEnabled = useCallback(
    (on: boolean) => {
      setSoundEnabled(on);
      setEnabledState(on);
      if (on) prime();
    },
    [prime]
  );

  const setVolume = useCallback((v: number) => {
    setSoundVolume(v);
    setVolumeState(v);
  }, []);

  return (
    <SoundContext.Provider value={{ enabled, volume, setEnabled, setVolume, prime }}>
      {children}
    </SoundContext.Provider>
  );
}

/** Play soft sound on route change — mount inside Router */
export function NavSoundListener() {
  const location = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    playNav();
  }, [location.pathname]);

  return null;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
}
