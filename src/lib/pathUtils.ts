import type { PathNode } from './pathJourney';
import { JOURNEY_NODES } from './pathJourney';

/** Index of the highest node the user has reached */
export function getCurrentNodeIndex(points: number, nodes: PathNode[] = JOURNEY_NODES): number {
  let idx = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (points >= nodes[i].minPoints) idx = i;
    else break;
  }
  return idx;
}

export function getJourneyProgressPercent(points: number, nodes: PathNode[] = JOURNEY_NODES): number {
  const max = nodes[nodes.length - 1]?.minPoints ?? 10000;
  if (max <= 0) return 0;
  return Math.min(100, Math.round((points / max) * 100));
}

export function getPointsToNode(points: number, node: PathNode): number {
  return Math.max(0, node.minPoints - points);
}

export type NodeState = 'locked' | 'current' | 'completed';

export function getNodeState(
  points: number,
  node: PathNode,
  nodeIndex: number,
  currentIndex: number
): NodeState {
  if (points < node.minPoints) return 'locked';
  if (nodeIndex === currentIndex) return 'current';
  if (nodeIndex < currentIndex) return 'completed';
  return 'completed';
}
