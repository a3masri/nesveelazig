import { Check, Lock, Sparkles } from 'lucide-react';
import type { PathNode as PathNodeType } from '../../lib/pathJourney';
import type { NodeState } from '../../lib/pathUtils';
import { getNodeProgress } from '../../lib/pathJourney';
import { getPointsToNode } from '../../lib/pathUtils';

type PathNodeProps = {
  node: PathNodeType;
  nextNode?: PathNodeType;
  points: number;
  state: NodeState;
  accent: string;
  side: 'left' | 'right' | 'center';
  index: number;
};

export function PathNodeCard({ node, nextNode, points, state, accent, side, index }: PathNodeProps) {
  const unlocked = state !== 'locked';
  const isCurrent = state === 'current';
  const progress = getNodeProgress(points, node, nextNode);
  const remaining = getPointsToNode(points, node);

  const alignClass =
    side === 'center'
      ? 'justify-center'
      : side === 'left'
        ? 'justify-start pl-2 sm:pl-6'
        : 'justify-end pr-2 sm:pr-6';

  const offsetClass =
    side === 'center'
      ? 'mx-auto'
      : side === 'left'
        ? 'mr-auto ml-0 sm:ml-4 max-w-[min(100%,280px)]'
        : 'ml-auto mr-0 sm:mr-4 max-w-[min(100%,280px)]';

  return (
    <div
      className={`relative flex mb-10 sm:mb-14 last:mb-6 ${alignClass} animate-path-node-in`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms`, opacity: 0 }}
      data-path-node={node.id}
    >
      <div
        className={`relative z-10 w-full ${offsetClass}`}
        style={
          {
            '--path-accent': accent,
            '--path-accent-glow': `${accent}55`,
          } as React.CSSProperties
        }
      >
        <article
          className={`path-node-card path-node-card--${state} ${isCurrent ? 'animate-path-pulse' : ''}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 transition-transform ${isCurrent ? 'scale-110' : ''}`}
              style={{
                background: unlocked ? `${accent}40` : 'rgba(0,0,0,0.2)',
                border: `2px solid ${unlocked ? accent : 'rgba(255,255,255,0.2)'}`,
              }}
            >
              {unlocked ? (
                node.emoji
              ) : (
                <Lock className="w-5 h-5 text-white/60" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                {node.minPoints.toLocaleString('tr-TR')} kupa
              </p>
              <h3 className="font-display font-bold text-xs sm:text-sm uppercase text-white leading-tight truncate">
                {node.title}
              </h3>
              {state === 'locked' && remaining > 0 && (
                <p className="text-[10px] font-semibold mt-1 text-white/80">
                  {remaining.toLocaleString('tr-TR')} kupa kaldı
                </p>
              )}
              {unlocked && (
                <div className="flex items-center gap-1 mt-1">
                  {isCurrent ? (
                    <>
                      <Sparkles className="w-3 h-3" style={{ color: accent }} />
                      <span className="text-[10px] font-bold" style={{ color: accent }}>
                        Buradasın
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3" style={{ color: accent }} />
                      <span className="text-[10px] font-bold text-white/70">Tamamlandı</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {(isCurrent || (unlocked && progress > 0 && progress < 100)) && nextNode && (
            <div className="mt-3">
              <div className="h-1.5 rounded-full overflow-hidden bg-black/20">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: accent }}
                />
              </div>
            </div>
          )}
        </article>

        <div
          className="path-node-dot"
          style={{
            [side === 'right' ? 'left' : 'right']: side === 'center' ? '50%' : '-1.75rem',
            marginLeft: side === 'center' ? '-7px' : undefined,
            background: unlocked ? accent : 'transparent',
            boxShadow: isCurrent ? `0 0 14px ${accent}` : undefined,
          }}
        />
      </div>
    </div>
  );
}
