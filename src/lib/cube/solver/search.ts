/**
 * Search primitives for the sub-step solvers.
 *
 * Everything here works on compact integer encodings with precomputed move
 * tables rather than on 54-byte sticker arrays, because the search inner loop
 * runs tens of thousands of times and needs to stay cheap enough to feel
 * instant in a browser.
 */

import { faceletsToCubie } from '../cubie';
import { stateFromAlg } from '../facelets';
import { HTM_MOVES } from '../moves';

/** The 18 outer-layer turns, in a fixed order the tables are indexed by. */
export const MOVES: readonly string[] = HTM_MOVES;

/** Which axis each move turns about, for pruning same-axis repeats. */
export const MOVE_AXIS: readonly number[] = MOVES.map((m) => {
	const face = m[0];
	return face === 'U' || face === 'D' ? 0 : face === 'R' || face === 'L' ? 1 : 2;
});

/** Which face each move turns, so the search never turns the same face twice. */
export const MOVE_FACE: readonly number[] = MOVES.map((m) => 'URFDLB'.indexOf(m[0]));

/**
 * Per-move edge tables.
 *
 * `EDGE_MOVE[m][s * 2 + f]` gives the new `slot * 2 + flip` of an edge that was
 * sitting in slot `s` with flip `f`. Derived by running each move on a solved
 * cube and reading off the cubie permutation, so it inherits the engine's
 * correctness rather than restating it.
 */
export const EDGE_MOVE: readonly Int8Array[] = MOVES.map((move) => {
	const { ep, eo } = faceletsToCubie(stateFromAlg(move));
	const table = new Int8Array(24);
	for (let dst = 0; dst < 12; dst++) {
		const src = ep[dst];
		const twist = eo[dst];
		for (let f = 0; f < 2; f++) table[src * 2 + f] = dst * 2 + (f ^ twist);
	}
	return table;
});

/**
 * Per-move corner tables.
 *
 * `CORNER_MOVE[m][s * 3 + o]` gives the new `slot * 3 + twist`.
 */
export const CORNER_MOVE: readonly Int8Array[] = MOVES.map((move) => {
	const { cp, co } = faceletsToCubie(stateFromAlg(move));
	const table = new Int8Array(24);
	for (let dst = 0; dst < 8; dst++) {
		const src = cp[dst];
		const twist = co[dst];
		for (let o = 0; o < 3; o++) table[src * 3 + o] = dst * 3 + ((o + twist) % 3);
	}
	return table;
});

/**
 * Distance from every `slot * 2 + flip` state of a single edge to its home,
 * measured in outer-layer turns. Used as an admissible heuristic: one turn can
 * advance any single edge by at most one step, so the largest individual
 * distance never over-estimates the true cost of solving several at once.
 */
export function edgeDistanceTable(home: number): Uint8Array {
	const dist = new Uint8Array(24).fill(255);
	const start = home * 2;
	dist[start] = 0;
	let frontier = [start];
	let depth = 0;
	while (frontier.length) {
		const next: number[] = [];
		for (const state of frontier) {
			for (let m = 0; m < MOVES.length; m++) {
				const to = EDGE_MOVE[m][state];
				if (dist[to] === 255) {
					dist[to] = depth + 1;
					next.push(to);
				}
			}
		}
		frontier = next;
		depth++;
	}
	return dist;
}

/** The same, for a single corner's `slot * 3 + twist` states. */
export function cornerDistanceTable(home: number): Uint8Array {
	const dist = new Uint8Array(24).fill(255);
	const start = home * 3;
	dist[start] = 0;
	let frontier = [start];
	let depth = 0;
	while (frontier.length) {
		const next: number[] = [];
		for (const state of frontier) {
			for (let m = 0; m < MOVES.length; m++) {
				const to = CORNER_MOVE[m][state];
				if (dist[to] === 255) {
					dist[to] = depth + 1;
					next.push(to);
				}
			}
		}
		frontier = next;
		depth++;
	}
	return dist;
}

export interface IdaProblem<S> {
	start: S;
	/** True when the state needs no more moves. */
	isGoal: (state: S) => boolean;
	/** Apply move index `m`. Must return a fresh value, not mutate. */
	apply: (state: S, move: number) => S;
	/** Admissible lower bound on the remaining move count. */
	heuristic: (state: S) => number;
	/** Give up beyond this depth. */
	maxDepth?: number;
}

/**
 * Iterative-deepening A*, returning the shortest move sequence to a goal.
 *
 * Two standard prunings keep the branching factor down: never turn the same face
 * twice in a row, and when two consecutive moves are on the same axis, only allow
 * them in a fixed face order so `R L` and `L R` are not both explored.
 */
export function ida<S>(problem: IdaProblem<S>): number[] | null {
	const { start, isGoal, apply, heuristic, maxDepth = 12 } = problem;
	if (isGoal(start)) return [];

	const path: number[] = [];

	const search = (
		state: S,
		depth: number,
		bound: number,
		lastFace: number,
		lastAxis: number
	): boolean => {
		const h = heuristic(state);
		if (depth + h > bound) return false;
		if (isGoal(state)) return true;

		for (let m = 0; m < MOVES.length; m++) {
			const face = MOVE_FACE[m];
			if (face === lastFace) continue;
			// On a shared axis, fix an order so each commuting pair is tried once.
			if (MOVE_AXIS[m] === lastAxis && face > lastFace) continue;
			path.push(m);
			if (search(apply(state, m), depth + 1, bound, face, MOVE_AXIS[m])) return true;
			path.pop();
		}
		return false;
	};

	for (let bound = heuristic(start); bound <= maxDepth; bound++) {
		if (search(start, 0, bound, -1, -1)) return [...path];
	}
	return null;
}

/** Turn a list of move indices into a readable algorithm string. */
export function movesToString(indices: readonly number[]): string {
	return indices.map((i) => MOVES[i]).join(' ');
}
