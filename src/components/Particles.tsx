import { useState, useEffect, useCallback, type ReactNode } from 'react';
interface Particle { id: number; x: number; y: number; size: number; duration: number; delay: number; emoji: string; }
export function FloatingParticles({ emojis = ['☕', '🥐', '🍵', '✨'], count = 12 }: { emojis?: string[]; count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => { setParticles(Array.from({ length: count }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: 14 + Math.random() * 20, duration: 8 + Math.random() * 12, delay: Math.random() * 5, emoji: emojis[Math.floor(Math.random() * emojis.length)] }))); }, [emojis, count]);
  return <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">{particles.map(p => <div key={p.id} className="absolute animate-float opacity-20 select-none" style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: `${p.size}px`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}>{p.emoji}</div>)}</div>;
}
export function BattleSmoke() {
  return <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 flex gap-2">{[0, 1, 2].map(i => <div key={i} className="w-2 h-8 rounded-full bg-cr-gold/25 animate-steam" style={{ animationDelay: `${i * 0.6}s` }} />)}</div>;
}
interface ConfettiPiece { id: number; x: number; color: string; delay: number; rotation: number; }
export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const colors = ['#FFD700', '#E53935', '#4CAF50', '#2C5F8A', '#7B1FA2', '#FF6B35'];
  const trigger = useCallback(() => { setPieces(Array.from({ length: 50 }, (_, i) => ({ id: i, x: Math.random() * 100, color: colors[Math.floor(Math.random() * colors.length)], delay: Math.random() * 0.5, rotation: Math.random() * 360 }))); setTimeout(() => setPieces([]), 2000); }, []);
  useEffect(() => { if (active) trigger(); }, [active, trigger]);
  if (pieces.length === 0) return null;
  return <div className="pointer-events-none fixed inset-0 z-50">{pieces.map(p => <div key={p.id} className="absolute top-0 w-3 h-3" style={{ left: `${p.x}%`, backgroundColor: p.color, animation: `confetti-fall 1.5s ease-out ${p.delay}s forwards`, transform: `rotate(${p.rotation}deg)` }} />)}</div>;
}
export function XPGainPopup({ points, onDone }: { points: number; onDone: () => void }) { useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t); }, [onDone]); return <div className="animate-xp-gain fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"><span className="text-cr-gold font-display text-4xl font-bold text-stroke">+{points} XP</span></div>; }
export function RewardReveal({ children, active }: { children: ReactNode; active: boolean }) { return <div className={active ? 'animate-rank-explosion' : ''}>{children}</div>; }
export function ShineEffect({ children }: { children: ReactNode }) { return <div className="relative overflow-hidden">{children}<div className="animate-shimmer absolute inset-0 pointer-events-none" /></div>; }
