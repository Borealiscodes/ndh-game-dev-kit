/**
 * math-toys/02-cellular-sheaf-holonomy/sheaf-holonomy.js
 * Toy 02: Cellular Sheaf Stalks, Edge Consistency & Path Holonomy (Fallout 3 RPG / Zork)
 * Models multi-faction reputation/quest stalks over a graph with coboundary
 * inconsistency energy and closed-loop holonomy memory.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { qAdd, qSub, qMul, toQ16 } from "../00-core-q16/core.js";

export function createSheafGraph(nodeIds, channels = 4) {
  const stalks = {};
  for (const id of nodeIds) {
    stalks[id] = new Int32Array(channels);
  }
  return {
    channels,
    stalks,
    edges: [],
    pathHistory: [],
    holonomyAccumQ16: new Int32Array(channels),
  };
}

export function addRestrictionEdge(graph, fromId, toId, weight = 1.0) {
  return {
    ...graph,
    edges: [...graph.edges, { fromId, toId, weightQ16: toQ16(weight) }],
  };
}

/**
 * Apply an action vector deltaQ16 to a faction/location stalk and record path holonomy.
 */
export function traverseNodeAction(graph, nodeId, deltaVectorQ16) {
  const nextStalks = {};
  for (const [k, v] of Object.entries(graph.stalks)) {
    nextStalks[k] = new Int32Array(v);
  }
  const target = nextStalks[nodeId];
  if (!target) throw new Error(`Unknown sheaf node: ${nodeId}`);

  const nextHolonomy = new Int32Array(graph.holonomyAccumQ16);
  for (let i = 0; i < graph.channels; i++) {
    const d = deltaVectorQ16[i] | 0;
    target[i] = qAdd(target[i], d);
    // Path-ordered holonomy: signed by parity of path length so non-commuting loops leave a topological trace
    const sign = (graph.pathHistory.length & 1) === 0 ? 1 : -1;
    nextHolonomy[i] = qAdd(nextHolonomy[i], sign * d);
  }

  return {
    ...graph,
    stalks: nextStalks,
    pathHistory: [...graph.pathHistory, nodeId],
    holonomyAccumQ16: nextHolonomy,
  };
}

/**
 * Compute coboundary inconsistency energy across all restriction edges.
 * Zero energy means global consensus across factions/rooms.
 */
export function computeCoboundaryEnergyQ16(graph) {
  let totalSq = 0n;
  for (const edge of graph.edges) {
    const u = graph.stalks[edge.fromId];
    const v = graph.stalks[edge.toId];
    for (let i = 0; i < graph.channels; i++) {
      const projected = qMul(edge.weightQ16, u[i]);
      const diff = BigInt(qSub(projected, v[i]));
      totalSq += (diff * diff) >> 16n;
    }
  }
  return Number(totalSq) | 0;
}

/**
 * Sheafification projection: relaxes connected stalks toward global consensus.
 */
export function sheafifyStep(graph, stepRate = 0.25) {
  const rateQ16 = toQ16(stepRate);
  const nextStalks = {};
  for (const [k, v] of Object.entries(graph.stalks)) {
    nextStalks[k] = new Int32Array(v);
  }

  for (const edge of graph.edges) {
    const u = graph.stalks[edge.fromId];
    const v = graph.stalks[edge.toId];
    for (let i = 0; i < graph.channels; i++) {
      const diff = qSub(qMul(edge.weightQ16, u[i]), v[i]);
      const delta = qMul(rateQ16, diff);
      nextStalks[edge.fromId][i] = qSub(nextStalks[edge.fromId][i], delta);
      nextStalks[edge.toId][i] = qAdd(nextStalks[edge.toId][i], delta);
    }
  }

  return { ...graph, stalks: nextStalks };
}
