/** Subtle Web Audio SFX — disabled when nesve-sound=off */

const STORAGE_KEY = 'nesve-sound';
const VOLUME_KEY = 'nesve-sound-volume';

let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== 'off';
}

export function setSoundEnabled(on: boolean) {
  localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
}

export function getSoundVolume(): number {
  const v = localStorage.getItem(VOLUME_KEY);
  if (v == null) return 0.7;
  const n = parseFloat(v);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.7;
}

export function setSoundVolume(vol: number) {
  localStorage.setItem(VOLUME_KEY, String(Math.min(1, Math.max(0, vol))));
}

export async function resumeAudio(): Promise<void> {
  const ac = getCtx(true);
  if (ac?.state === 'suspended') await ac.resume();
}

function getCtx(force = false): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!force && !isSoundEnabled()) return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function vol(mult = 1): number {
  return 0.06 * getSoundVolume() * mult;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', mult = 1) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol(mult);
  osc.connect(gain);
  gain.connect(ac.destination);
  const t = ac.currentTime;
  osc.start(t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.stop(t + duration);
}

function chord(freqs: number[], duration: number, mult = 1) {
  freqs.forEach((f, i) => setTimeout(() => tone(f, duration, 'sine', mult * 0.85), i * 50));
}

/** UI */
export function playTap() {
  tone(640, 0.04, 'sine', 0.7);
}
export function playHover() {
  tone(880, 0.03, 'sine', 0.35);
}
export function playNav() {
  tone(480, 0.05, 'triangle', 0.5);
  setTimeout(() => tone(600, 0.04, 'sine', 0.4), 40);
}
export function playTab() {
  tone(520, 0.04, 'sine', 0.55);
}

/** Rewards */
export function playSuccess() {
  chord([523, 659, 784], 0.12, 1);
}
export function playPurchase() {
  tone(392, 0.08, 'sine', 0.8);
  setTimeout(() => tone(523, 0.1, 'sine', 0.9), 70);
  setTimeout(() => tone(659, 0.14, 'sine', 1), 140);
}
export function playUnlock() {
  tone(440, 0.06, 'sine', 0.7);
  setTimeout(() => tone(554, 0.08, 'sine', 0.85), 60);
  setTimeout(() => tone(659, 0.1, 'sine', 1), 120);
}
export function playCelebrate() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.1, 'sine', 0.9), i * 90));
}

/** Games */
export function playWin() {
  playSuccess();
}
export function playLose() {
  tone(196, 0.15, 'triangle', 0.8);
  setTimeout(() => tone(165, 0.2, 'triangle', 0.6), 120);
}
export function playCatch() {
  tone(520, 0.05, 'sine', 0.75);
}
export function playPoints() {
  tone(740, 0.06, 'sine', 0.65);
  setTimeout(() => tone(880, 0.05, 'sine', 0.5), 50);
}

/** Profile */
export function playLevelUp() {
  chord([392, 494, 587, 784], 0.14, 1.1);
}

export function playCopy() {
  tone(700, 0.04, 'sine', 0.5);
}
