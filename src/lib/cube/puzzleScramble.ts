/**
 * Scramble generation for any size.
 *
 * Random-move scrambles, filtered so no turn is wasted: never the same face
 * twice running, and never a same-axis sandwich like `R L R`. That is what a
 * practice scramble wants. It is not the WCA's random-state scramble — those
 * need a full solver per size and a lot of table memory, and the difference is
 * invisible when you are drilling.
 *
 * Lengths follow the WCA's, which are chosen so a scramble is thorough without
 * being tedious to apply: 11 for a 2×2, 20 for a 3×3, 40-ish for the big ones.
 */

import { makeRng } from './scramble';
import { applyPerm } from './puzzle';
import type { Puzzle } from './puzzle';
import type { Facelets } from './types';

/** How many turns each size gets by default. */
export const SCRAMBLE_LENGTH: Record<number, number> = { 2: 11, 3: 20, 4: 44, 5: 60 };

/**
 * What a move turns, reduced to the two things the filter cares about: the axis
 * it spins around, and exactly which layers it carries. `R` and `Rw` share an
 * axis but not a layer set, so `R Rw` is allowed while `R R'` is not.
 */
interface Signature {
	axis: number;
	layers: string;
}

function signature(p: Puzzle, name: string): Signature {
	const turn = p.parse(name);
	if (!turn) return { axis: -1, layers: name };
	// Faces are numbered U R F D L B, so a face and its opposite are three apart.
	return { axis: turn.face % 3, layers: `${turn.face}:${turn.from}:${turn.to}` };
}

const NOTHING: Signature = { axis: -2, layers: '' };

export interface ScrambleOptions {
	length?: number;
	seed?: number;
}

/** Generate a scramble for a puzzle, as a canonical string. */
export function scrambleFor(p: Puzzle, options: ScrambleOptions = {}): string {
	const length = options.length ?? SCRAMBLE_LENGTH[p.size] ?? 20;
	const rand = options.seed === undefined ? Math.random : makeRng(options.seed);
	const pool = p.scrambleMoves;

	const out: string[] = [];
	let last = NOTHING;
	let beforeLast = NOTHING;

	// A cap, so a pathological pool (a 2×2 has only three faces) cannot spin
	// forever if every candidate is rejected.
	let attempts = 0;
	while (out.length < length && attempts < length * 200) {
		attempts++;
		const name = pool[Math.floor(rand() * pool.length)];
		const sig = signature(p, name);
		// The same layers twice running always reduces to one turn.
		if (sig.layers === last.layers) continue;
		// So does a same-axis sandwich: `R L R` is `R2 L` with the L moved.
		if (sig.axis === last.axis && sig.layers === beforeLast.layers) continue;
		out.push(name);
		beforeLast = last;
		last = sig;
	}
	return out.join(' ');
}

/** Generate a scramble and the state it produces. */
export function scrambledStateFor(
	p: Puzzle,
	options: ScrambleOptions = {}
): { scramble: string; moves: string[]; state: Facelets } {
	const scramble = scrambleFor(p, options);
	const moves = scramble ? scramble.split(' ') : [];
	return { scramble, moves, state: applyPerm(p.solved(), p.algPerm(moves)) };
}
