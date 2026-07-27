/**
 * Cross solver.
 *
 * The four bottom edges are only 190,080 arrangements, so an optimal solution is
 * always within reach: an iterative-deepening search with a per-edge distance
 * heuristic finds the shortest cross — never more than eight turns — in a few
 * milliseconds.
 *
 * Two solutions are produced. The **efficient** one is the outright shortest,
 * which is what an intermediate solver wants to plan during inspection. The
 * **stepwise** one places the edges one at a time, which is longer but is
 * something a beginner can actually follow and check.
 */

import { faceletsToCubie } from '../cubie';
import { DB, DF, DL, DR, type Facelets } from '../types';
import { edgeDistanceTable, EDGE_MOVE, ida, movesToString, MOVES } from './search';

/** The four cross edges, in a stable order. */
const CROSS_EDGES = [DR, DF, DL, DB] as const;

/** Distance-to-home tables, one per cross edge. Built once, on first use. */
let DISTANCES: Uint8Array[] | null = null;
function distances(): Uint8Array[] {
	if (!DISTANCES) DISTANCES = CROSS_EDGES.map((home) => edgeDistanceTable(home));
	return DISTANCES;
}

/** Compact cross state: four `slot * 2 + flip` values, one per cross edge. */
type CrossState = readonly number[];

function crossStateOf(state: Facelets): CrossState {
	const { ep, eo } = faceletsToCubie(state);
	return CROSS_EDGES.map((piece) => {
		const slot = ep.indexOf(piece);
		return slot * 2 + eo[slot];
	});
}

const SOLVED: CrossState = CROSS_EDGES.map((home) => home * 2);

function isSolved(s: CrossState): boolean {
	for (let i = 0; i < 4; i++) if (s[i] !== SOLVED[i]) return false;
	return true;
}

export interface CrossSolution {
	/** The shortest solution found. */
	moves: string;
	/** Move count, half-turn metric. */
	length: number;
	/** How the same cross can be built one edge at a time. */
	steps: CrossStep[];
}

export interface CrossStep {
	/** Which edge this step places, named by its two colours. */
	edge: string;
	moves: string;
	/** Running move count after this step. */
	total: number;
}

const EDGE_LABELS: Record<number, string> = {
	[DR]: 'yellow-red',
	[DF]: 'yellow-green',
	[DL]: 'yellow-orange',
	[DB]: 'yellow-blue'
};

/**
 * Find the shortest cross for a state.
 *
 * Returns `null` only if the cross is somehow unreachable within the depth
 * limit, which cannot happen for a legal cube — every cross is solvable in at
 * most eight turns.
 */
export function solveCross(state: Facelets, maxDepth = 9): CrossSolution | null {
	const dist = distances();
	const start = crossStateOf(state);

	const solution = ida<CrossState>({
		start,
		isGoal: isSolved,
		apply: (s, m) => {
			const table = EDGE_MOVE[m];
			return [table[s[0]], table[s[1]], table[s[2]], table[s[3]]];
		},
		heuristic: (s) => {
			let worst = 0;
			for (let i = 0; i < 4; i++) {
				const d = dist[i][s[i]];
				if (d > worst) worst = d;
			}
			return worst;
		},
		maxDepth
	});

	if (!solution) return null;
	return {
		moves: movesToString(solution),
		length: solution.length,
		steps: stepwiseCross(start, dist)
	};
}

/**
 * Build the cross one edge at a time, always taking the cheapest edge next.
 *
 * This is longer than the optimal cross but each step is short enough to hold in
 * your head, and you can check the result before moving on — which is exactly
 * what someone learning needs.
 */
function stepwiseCross(start: CrossState, dist: Uint8Array[]): CrossStep[] {
	const steps: CrossStep[] = [];
	let current = [...start];
	const remaining = new Set([0, 1, 2, 3]);
	let total = 0;

	while (remaining.size > 0) {
		let best: { index: number; moves: number[] } | null = null;

		for (const index of remaining) {
			const solution = ida<number[]>({
				start: current,
				// Place this edge without disturbing any already-placed one. Edges
				// still in `remaining` are fair game to shuffle around.
				isGoal: (s) =>
					s[index] === SOLVED[index] &&
					[0, 1, 2, 3].every((i) => i === index || remaining.has(i) || s[i] === SOLVED[i]),
				apply: (s, m) => {
					const table = EDGE_MOVE[m];
					return [table[s[0]], table[s[1]], table[s[2]], table[s[3]]];
				},
				heuristic: (s) => dist[index][s[index]],
				maxDepth: 9
			});
			if (solution && (!best || solution.length < best.moves.length)) {
				best = { index, moves: solution };
			}
		}

		if (!best) break;
		const table = best.moves.map((m) => EDGE_MOVE[m]);
		for (const t of table) current = [t[current[0]], t[current[1]], t[current[2]], t[current[3]]];
		total += best.moves.length;
		steps.push({
			edge: EDGE_LABELS[CROSS_EDGES[best.index]],
			moves: movesToString(best.moves),
			total
		});
		remaining.delete(best.index);
	}

	return steps;
}

/** How many cross edges are already home and the right way up. */
export function crossProgress(state: Facelets): number {
	const s = crossStateOf(state);
	return s.filter((v, i) => v === SOLVED[i]).length;
}

export { MOVES };
