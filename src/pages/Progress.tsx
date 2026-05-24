import { useEffect, useRef, useState } from 'react';
import { Crown, MapPin } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { AppHeader } from '../components/AppHeader';
import { Confetti } from '../components/Particles';
import { PathNodeCard } from '../components/path/PathNode';
import { getRankForPoints, getNextRank, SEASON_PATH } from '../lib/constants';
import { JOURNEY_NODES, PATH_VIBES } from '../lib/pathJourney';
import {
  getCurrentNodeIndex,
  getJourneyProgressPercent,
  getNodeState,
} from '../lib/pathUtils';

export default function Progress() {
  const { profile, loading } = useProfile();
  const points = profile?.total_points || 0;
  const currentRank = getRankForPoints(points);
  const nextRank = getNextRank(points);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVibe, setActiveVibe] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const currentNodeIndex = getCurrentNodeIndex(points);
  const journeyPercent = getJourneyProgressPercent(points);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-vibe-section]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-vibe-section'));
            setActiveVibe(idx);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-12% 0px -12% 0px' }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loading) return;
    const el = document.querySelector(`[data-path-node="${currentNodeIndex}"]`);
    if (el) {
      const t = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
      return () => clearTimeout(t);
    }
  }, [loading, currentNodeIndex]);

  useEffect(() => {
    const key = `nesve-path-celebrate-${currentNodeIndex}`;
    const seen = sessionStorage.getItem(key);
    if (!seen && currentNodeIndex > 0 && points >= JOURNEY_NODES[currentNodeIndex].minPoints) {
      setCelebrate(true);
      sessionStorage.setItem(key, '1');
      const t = setTimeout(() => setCelebrate(false), 2200);
      return () => clearTimeout(t);
    }
  }, [currentNodeIndex, points]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-cr-gold/30 border-t-cr-gold rounded-full animate-spin" />
      </div>
    );
  }

  const vibeGroups = PATH_VIBES.map((vibe, vibeIdx) => ({
    vibe,
    vibeIdx,
    season: SEASON_PATH[vibeIdx],
    nodes: JOURNEY_NODES.filter(n => n.vibeIndex === vibeIdx),
  }));

  const accent = PATH_VIBES[activeVibe]?.accent ?? '#FFD700';

  return (
    <div className="pb-24 lg:pb-8 page-stack animate-fade-in">
      <Confetti active={celebrate} />
      <AppHeader title="Mevsim Yolu" subtitle={`${currentRank.name} · ${points.toLocaleString('tr-TR')} kupa`} />

      <div className="path-sticky-bar">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
            <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              Yol ilerlemesi · %{journeyPercent}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
            {nextRank ? `Sonraki: ${nextRank.name}` : 'Zirve'}
          </span>
        </div>
        <div className="progress-track h-2.5">
          <div
            className="progress-fill h-full rounded-r-lg"
            style={{ width: `${journeyPercent}%`, background: accent }}
          />
        </div>
        <p className="text-[10px] mt-2 font-semibold" style={{ color: 'var(--text-muted)' }}>
          Düğüm {currentNodeIndex + 1} / {JOURNEY_NODES.length}
        </p>
      </div>

      <div ref={scrollRef} className="relative space-y-4">
        {vibeGroups.map(({ vibe, vibeIdx, season, nodes }) => (
          <section
            key={vibe.id}
            data-vibe-section={vibeIdx}
            className={`path-vibe-section ${vibe.cssClass}`}
          >
            <div className="path-vibe-inner">
              <div className="path-spine" style={{ '--path-accent': vibe.accent } as React.CSSProperties} />

              {vibe.particles.map((p, i) => (
                <span
                  key={i}
                  className="absolute text-xl sm:text-2xl opacity-25 animate-float pointer-events-none select-none"
                  style={{
                    left: `${(i * 28 + vibeIdx * 9) % 85}%`,
                    top: `${(i * 31 + vibeIdx * 13) % 75}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${5 + i}s`,
                  }}
                  aria-hidden
                >
                  {p}
                </span>
              ))}

              <header className="relative text-center mb-10 px-2">
                <span className="text-3xl mb-2 block" aria-hidden>
                  {vibe.seasonEmoji}
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Mevsim {vibeIdx + 1}
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white text-stroke mt-1">
                  {vibe.seasonName}
                </h2>
                {season && (
                  <p className="text-xs mt-2 max-w-sm mx-auto text-white/80 leading-relaxed">
                    {season.description}
                  </p>
                )}
              </header>

              <div className="relative max-w-md mx-auto">
                {nodes.map((node, nodeIdx) => {
                  const globalIdx = JOURNEY_NODES.findIndex(n => n.id === node.id);
                  const state = getNodeState(points, node, globalIdx, currentNodeIndex);
                  const nextInSection = nodes[nodeIdx + 1];
                  return (
                    <PathNodeCard
                      key={node.id}
                      node={node}
                      nextNode={nextInSection}
                      points={points}
                      state={state}
                      accent={vibe.accent}
                      side={node.side}
                      index={nodeIdx}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        <div
          className="text-center py-16 px-6 rounded-3xl surface-panel border-2"
          style={{ borderColor: 'rgba(255,215,0,0.35)' }}
        >
          <span className="text-5xl mb-4 block animate-trophy-bounce" aria-hidden>
            👑
          </span>
          <Crown className="w-10 h-10 text-cr-gold mx-auto mb-3" />
          <h2 className="font-display text-2xl font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
            Efsane Zirve
          </h2>
          <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
            10.000 kupada Neşve tacına ulaş — yolun sonu burada
          </p>
        </div>
      </div>
    </div>
  );
}
