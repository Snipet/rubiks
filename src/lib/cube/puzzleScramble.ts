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

/** Reverse an algorithm and invert every turn in it. */
export function invertNames(names: readonly string[]): string[] {
	return [...names]
		.reverse()
		.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
}

/**
 * A setup that leaves everything before the last layer intact, for drilling.
 *
 * The inverse of the case algorithm, wrapped in random U turns so the case turns
 * up at a different angle each time and recognition gets properly exercised.
 *
 * This is the size-generic version, and the 4×4 is why it exists: the 3×3 one
 * runs the algorithm through a parser that canonicalises `2R` to `Rw`, which is
 * the substitution that turns a parity algorithm into a scramble. Here the tokens
 * are inverted as written and never rewritten.
 */
export function caseSetupFor(p: Puzzle, alg: string, options: { seed?: number } = {}): string {
	const rand = options.seed === undefined ? Math.random : makeRng(options.seed);
	const names = alg
		.replace(/[()[\],]/g, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean);
	if (names.some((name) => p.parse(name) === null)) return '';

	const auf = () => {
		const n = Math.floor(rand() * 4);
		return n === 0 ? [] : [`U${['', '2', "'"][n - 1]}`];
	};
	return mergeAdjacent(p, [...auf(), ...invertNames(names), ...auf()]).join(' ');
}

/**
 * Collapse neighbouring turns of the same layers into one.
 *
 * Only needed at the seams: an adjusting turn landing next to the algorithm's
 * own first or last move leaves something like `U2 U2` on the page, which is
 * correct but reads as a mistake. Deliberately not a general simplifier — it
 * merges same-layer neighbours and stops there.
 */
function mergeAdjacent(p: Puzzle, names: readonly string[]): string[] {
	const out: string[] = [];
	const layersOf = (name: string) => {
		const t = p.parse(name);
		return t ? `${t.face}:${t.from}:${t.to}` : name;
	};
	for (const name of names) {
		const last = out[out.length - 1];
		if (last && layersOf(last) === layersOf(name)) {
			const total = (p.parse(last)!.amount + p.parse(name)!.amount) % 4;
			out.pop();
			if (total === 0) continue;
			const base = name.replace(/[2']$/, '');
			out.push(base + (total === 1 ? '' : total === 2 ? '2' : "'"));
			continue;
		}
		out.push(name);
	}
	return out;
}
