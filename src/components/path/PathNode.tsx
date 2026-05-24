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
        ? 'justify-start'
        : 'justify-end';

  const cardWidth =
    side === 'center'
      ? 'w-full max-w-[min(100%,320px)] mx-auto'
      : 'w-full max-w-[min(100%,300px)]';

  return (
    <div
      className={`relative flex mb-12 sm:mb-16 last:mb-8 ${alignClass} animate-path-node-in`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms`, opacity: 0 }}
      data-path-node={node.id}
    >
      <div
        className={`relative z-10 ${cardWidth} px-1 sm:px-2`}
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
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`path-node-icon ${isCurrent ? 'path-node-icon--current' : ''}`}
              style={{
                background: unlocked ? `${accent}40` : 'rgba(0,0,0,0.2)',
                border: `2px solid ${unlocked ? accent : 'rgba(255,255,255,0.2)'}`,
              }}
            >
              {unlocked ? (
                <span className="text-2xl sm:text-3xl leading-none">{node.emoji}</span>
              ) : (
                <Lock className="w-6 h-6 text-white/60" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white/75">
                {node.minPoints.toLocaleString('tr-TR')} kupa
              </p>
              <h3 className="font-display font-bold text-sm sm:text-base uppercase text-white leading-snug">
                {node.title}
              </h3>
              {state === 'locked' && remaining > 0 && (
                <p className="text-xs font-semibold mt-1.5 text-white/85">
                  {remaining.toLocaleString('tr-TR')} kupa kaldı
                </p>
              )}
              {unlocked && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {isCurrent ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                      <span className="text-xs font-bold" style={{ color: accent }}>
                        Buradasın
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                      <span className="text-xs font-bold text-white/75">Tamamlandı</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {(isCurrent || (unlocked && progress > 0 && progress < 100)) && nextNode && (
            <div className="mt-4">
              <div className="h-2 rounded-full overflow-hidden bg-black/25">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: accent }}
                />
              </div>
            </div>
          )}
        </article>

        <div
          className="path-node-dot path-node-dot--lg"
          style={{
            left: side === 'center' ? '50%' : side === 'left' ? '0.5rem' : undefined,
            right: side === 'right' ? '0.5rem' : undefined,
            marginLeft: side === 'center' ? '-9px' : undefined,
            background: unlocked ? accent : 'transparent',
            boxShadow: isCurrent ? `0 0 16px ${accent}` : undefined,
          }}
        />
      </div>
    </div>
  );
}
