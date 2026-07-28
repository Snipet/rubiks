/**
 * The 2×2 as eight corners, and an optimal solver for it.
 *
 * A 2×2 is a 3×3 with the edges and centres taken away, so it reuses the corner
 * conventions in `types.ts` exactly: corners numbered URF, UFL, ULB, UBR, DFR,
 * DLF, DBL, DRB, and orientation counted as how far the piece's own U-or-D
 * sticker has been rotated away from the U-or-D face of its slot.
 *
 * With no centres there is nothing to hold the puzzle still, so the
 * back-bottom-left corner is treated as fixed — the convention every 2×2 method
 * uses. That leaves seven movable corners and three generating faces, U, R and
 * F, which is why a 2×2 scramble never mentions the other three.
 *
 * The state space is 7! × 3⁶ = 3,674,160, small enough that an optimal solution
 * is always reachable. This uses IDA\* with two exact pruning tables — one over
 * corner orientation (729 entries), one over corner permutation (5,040) — rather
 * than a full 3.7 MB distance table, because the tables build in a millisecond
 * and the search finishes well inside a frame.
 */

import { puzzle, type Perm } from './puzzle';
import { D, U, type Face, type Facelets } from './types';

/** Corner slots, in the order `types.ts` numbers them. */
export const POCKET_CORNERS = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'] as const;

/** The colours of each corner, first entry always the U or D sticker. */
const CORNER_COLOURS: readonly (readonly [Face, Face, Face])[] = [
	[U, 1, 2], // URF
	[U, 2, 4], // UFL
	[U, 4, 5], // ULB
	[U, 5, 1], // UBR
	[D, 2, 1], // DFR
	[D, 4, 2], // DLF
	[D, 5, 4], // DBL
	[D, 1, 5] // DRB
];

/** The anchor. Fixed by convention, so every solution is a real hand movement. */
export const DBL = 6;

/** The seven corners a solution can move, in a fixed order. */
const MOVABLE = [0, 1, 2, 3, 4, 5, 7] as const;

/** The nine turns a 2×2 solution is written in. */
export const POCKET_MOVES: readonly string[] = ['U', 'U2', "U'", 'R', 'R2', "R'", 'F', 'F2', "F'"];

export interface PocketState {
	/** Which corner piece sits in each slot. */
	cp: number[];
	/** How far each piece in place is twisted: 0, 1 or 2. */
	co: number[];
}

/** Raised when a sticker state does not describe an assembled 2×2. */
export class PocketDecodeError extends Error {
	constructor(
		message: string,
		readonly slot: number
	) {
		super(message);
		this.name = 'PocketDecodeError';
	}
}

const p2 = puzzle(2);
const HALF = 0.5;

/**
 * The three stickers of each corner slot, in the same rotational order as
 * {@link CORNER_COLOURS}: U-or-D first, then clockwise seen from outside.
 *
 * Derived from the engine's geometry rather than tabulated, so it cannot
 * disagree with the permutations — the cell coordinates below are just the eight
 * corners written out, and the sticker at each face comes from the same lookup
 * a turn uses.
 */
export const POCKET_CORNER_FACELETS: readonly (readonly [number, number, number])[] = (() => {
	const cells = [
		{ x: HALF, y: HALF, z: HALF }, // URF
		{ x: -HALF, y: HALF, z: HALF }, // UFL
		{ x: -HALF, y: HALF, z: -HALF }, // ULB
		{ x: HALF, y: HALF, z: -HALF }, // UBR
		{ x: HALF, y: -HALF, z: HALF }, // DFR
		{ x: -HALF, y: -HALF, z: HALF }, // DLF
		{ x: -HALF, y: -HALF, z: -HALF }, // DBL
		{ x: HALF, y: -HALF, z: -HALF } // DRB
	];
	return cells.map((cell, i) => {
		const triple = CORNER_COLOURS[i].map((face) => {
			const index = p2.stickerFacing(cell, face);
			if (index < 0) throw new Error(`corner ${i} has no sticker on face ${face}`);
			return index;
		});
		return triple as unknown as readonly [number, number, number];
	});
})();

/** Read corner permutation and orientation out of a 2×2 sticker state. */
export function faceletsToPocket(f: Facelets): PocketState {
	const cp = new Array<number>(8).fill(0);
	const co = new Array<number>(8).fill(0);

	for (let slot = 0; slot < 8; slot++) {
		const stickers = POCKET_CORNER_FACELETS[slot];
		// Find which of the three stickers carries a U or D colour: that is the
		// piece's own top-or-bottom sticker, and how far round it sits is the twist.
		let twist = -1;
		for (let t = 0; t < 3; t++) {
			const colour = f[stickers[t]];
			if (colour === U || colour === D) {
				twist = t;
				break;
			}
		}
		if (twist < 0) {
			throw new PocketDecodeError(
				`The ${POCKET_CORNERS[slot]} corner shows no white or yellow sticker.`,
				slot
			);
		}
		const colours: [Face, Face, Face] = [
			f[stickers[twist]] as Face,
			f[stickers[(twist + 1) % 3]] as Face,
			f[stickers[(twist + 2) % 3]] as Face
		];
		const piece = CORNER_COLOURS.findIndex(
			(c) => c[0] === colours[0] && c[1] === colours[1] && c[2] === colours[2]
		);
		if (piece < 0) {
			throw new PocketDecodeError(
				`The ${POCKET_CORNERS[slot]} corner is not a real piece of this puzzle.`,
				slot
			);
		}
		cp[slot] = piece;
		co[slot] = twist;
	}

	const seen = new Set(cp);
	if (seen.size !== 8) {
		const slot = cp.findIndex((piece, i) => cp.indexOf(piece) !== i);
		throw new PocketDecodeError('Two corners of the puzzle are the same piece.', Math.max(slot, 0));
	}
	return { cp, co };
}

/** Turn a corner state back into stickers. */
export function pocketToFacelets(state: PocketState): Facelets {
	const f = new Uint8Array(24);
	for (let slot = 0; slot < 8; slot++) {
		const stickers = POCKET_CORNER_FACELETS[slot];
		const colours = CORNER_COLOURS[state.cp[slot]];
		for (let t = 0; t < 3; t++) {
			f[stickers[(t + state.co[slot]) % 3]] = colours[t];
		}
	}
	return f;
}

export function solvedPocket(): PocketState {
	return { cp: [0, 1, 2, 3, 4, 5, 6, 7], co: [0, 0, 0, 0, 0, 0, 0, 0] };
}

export function isSolvedPocket(s: PocketState): boolean {
	for (let i = 0; i < 8; i++) if (s.cp[i] !== i || s.co[i] !== 0) return false;
	return true;
}

/** Compose: apply `move` to `state`. */
export function applyPocket(state: PocketState, move: PocketState): PocketState {
	const cp = new Array<number>(8);
	const co = new Array<number>(8);
	for (let i = 0; i < 8; i++) {
		cp[i] = state.cp[move.cp[i]];
		co[i] = (state.co[move.cp[i]] + move.co[i]) % 3;
	}
	return { cp, co };
}

/** The corner effect of each named turn, read off the sticker engine. */
const MOVE_EFFECT: Record<string, PocketState> = (() => {
	const out: Record<string, PocketState> = {};
	const solved = p2.solved();
	for (const name of POCKET_MOVES) {
		const perm: Perm = p2.perm(name);
		const after = new Uint8Array(24);
		for (let i = 0; i < 24; i++) after[i] = solved[perm[i]];
		out[name] = faceletsToPocket(after);
	}
	return out;
})();

/** Apply a named turn to a corner state. */
export function turnPocket(state: PocketState, name: string): PocketState {
	const effect = MOVE_EFFECT[name];
	if (!effect) throw new Error(`${name} is not one of the nine 2×2 turns`);
	return applyPocket(state, effect);
}

export function playPocket(state: PocketState, moves: readonly string[]): PocketState {
	let out = state;
	for (const name of moves) out = turnPocket(out, name);
	return out;
}

// ---------------------------------------------------------------------------
// Indexing
// ---------------------------------------------------------------------------

const CO_STATES = 729; // 3⁶ — the seventh twist is forced by the others
const CP_STATES = 5040; // 7!

/**
 * Corner orientation as a number.
 *
 * Only six of the seven movable twists are free: the total twist of a real cube
 * is always a multiple of three, so the last one is determined. Encoding six
 * digits rather than seven is what keeps the table at 729 entries instead of
 * 2,187 mostly-unreachable ones.
 */
export function coIndex(s: PocketState): number {
	let n = 0;
	for (let i = 0; i < 6; i++) n = n * 3 + s.co[MOVABLE[i]];
	return n;
}

export function cpIndex(s: PocketState): number {
	// Lehmer code over the seven movable slots.
	let n = 0;
	for (let i = 0; i < 7; i++) {
		let smaller = 0;
		for (let j = i + 1; j < 7; j++) if (s.cp[MOVABLE[j]] < s.cp[MOVABLE[i]]) smaller++;
		n = n * (7 - i) + smaller;
	}
	return n;
}

function coFromIndex(n: number): number[] {
	const co = new Array<number>(8).fill(0);
	let rest = n;
	let total = 0;
	for (let i = 5; i >= 0; i--) {
		const digit = rest % 3;
		rest = Math.floor(rest / 3);
		co[MOVABLE[i]] = digit;
		total += digit;
	}
	co[MOVABLE[6]] = (3 - (total % 3)) % 3;
	return co;
}

function cpFromIndex(n: number): number[] {
	// Undo the Lehmer code.
	const digits = new Array<number>(7);
	let rest = n;
	for (let i = 6; i >= 0; i--) {
		digits[i] = rest % (7 - i);
		rest = Math.floor(rest / (7 - i));
	}
	// The Lehmer digit is the position of the chosen piece among those still
	// unused, so decoding is just repeated removal from the sorted pool.
	const cp = new Array<number>(8).fill(DBL);
	const available = [...MOVABLE];
	for (let i = 0; i < 7; i++) cp[MOVABLE[i]] = available.splice(digits[i], 1)[0];
	return cp;
}

/** Build an exact distance table by breadth-first search from solved. */
function buildTable(
	size: number,
	indexOf: (s: PocketState) => number,
	decode: (n: number) => PocketState
): Uint8Array {
	const table = new Uint8Array(size).fill(255);
	const start = indexOf(solvedPocket());
	table[start] = 0;
	let frontier = [start];
	let depth = 0;
	let filled = 1;
	while (filled < size && frontier.length > 0) {
		const next: number[] = [];
		for (const n of frontier) {
			const state = decode(n);
			for (const move of POCKET_MOVES) {
				const to = indexOf(turnPocket(state, move));
				if (table[to] !== 255) continue;
				table[to] = depth + 1;
				filled++;
				next.push(to);
			}
		}
		frontier = next;
		depth++;
	}
	return table;
}

let CO_TABLE: Uint8Array | null = null;
let CP_TABLE: Uint8Array | null = null;

function tables(): { co: Uint8Array; cp: Uint8Array } {
	if (!CO_TABLE) {
		CO_TABLE = buildTable(CO_STATES, coIndex, (n) => ({
			cp: [0, 1, 2, 3, 4, 5, 6, 7],
			co: coFromIndex(n)
		}));
	}
	if (!CP_TABLE) {
		CP_TABLE = buildTable(CP_STATES, cpIndex, (n) => ({
			cp: cpFromIndex(n),
			co: [0, 0, 0, 0, 0, 0, 0, 0]
		}));
	}
	return { co: CO_TABLE, cp: CP_TABLE };
}

/** God's number for the 2×2 in quarter-and-half turns. */
export const POCKET_DIAMETER = 11;

/** The face a move turns, so a search never turns the same face twice running. */
const FACE_OF: Record<string, string> = {};
for (const name of POCKET_MOVES) FACE_OF[name] = name[0];

export interface PocketSolveOptions {
	/** Stop once a solution this short is found. Defaults to optimal. */
	maxLength?: number;
}

/**
 * The shortest sequence of U, R and F turns that solves a 2×2.
 *
 * Returns `null` only if the state is unreachable, which
 * {@link faceletsToPocket} will usually have rejected first.
 */
export function solvePocket(state: PocketState, options: PocketSolveOptions = {}): string[] | null {
	const limit = Math.min(options.maxLength ?? POCKET_DIAMETER, POCKET_DIAMETER);
	const { co, cp } = tables();

	const heuristic = (s: PocketState) => {
		const a = co[coIndex(s)];
		const b = cp[cpIndex(s)];
		return Math.max(a === 255 ? 0 : a, b === 255 ? 0 : b);
	};

	if (isSolvedPocket(state)) return [];

	const path: string[] = [];

	function search(s: PocketState, depth: number, bound: number, lastFace: string): boolean {
		const h = heuristic(s);
		if (h === 0 && isSolvedPocket(s)) return true;
		if (depth + h > bound) return false;
		for (const move of POCKET_MOVES) {
			// Two turns of the same face in a row are always one turn.
			if (FACE_OF[move] === lastFace) continue;
			path.push(move);
			if (search(turnPocket(s, move), depth + 1, bound, FACE_OF[move])) return true;
			path.pop();
		}
		return false;
	}

	for (let bound = heuristic(state); bound <= limit; bound++) {
		path.length = 0;
		if (search(state, 0, bound, '')) return [...path];
	}
	return null;
}

/** The shortest solution for a sticker state, or `null` if there is none. */
export function solvePocketFacelets(f: Facelets, options?: PocketSolveOptions): string[] | null {
	return solvePocket(faceletsToPocket(f), options);
}

// ---------------------------------------------------------------------------
// Case classification
// ---------------------------------------------------------------------------

/** The four slots of the last layer, and the four of the first. */
export const LAST_LAYER_SLOTS = [0, 1, 2, 3] as const;
export const FIRST_LAYER_SLOTS = [4, 5, 6, 7] as const;

/** True when the bottom four corners are home and untwisted. */
export function firstLayerSolved(s: PocketState): boolean {
	return FIRST_LAYER_SLOTS.every((slot) => s.cp[slot] === slot && s.co[slot] === 0);
}

/** True when the bottom four corners all show the same colour downwards. */
export function firstFaceBuilt(s: PocketState): boolean {
	return FIRST_LAYER_SLOTS.every((slot) => s.cp[slot] >= 4 && s.co[slot] === 0);
}

/** True when every last-layer corner shows the top colour upwards. */
export function lastLayerOriented(s: PocketState): boolean {
	return LAST_LAYER_SLOTS.every((slot) => s.co[slot] === 0);
}

/**
 * A key naming the orientation case of the last layer.
 *
 * Recognition happens before any adjusting turn, so a case is whatever you see
 * once you have turned the top to its best position — which makes the key the
 * smallest of the four readings you get by turning U. There are eight such keys
 * for a real 2×2: the solved one and the seven that Ortega's first step names.
 */
export function pocketOrientationKey(s: PocketState): string {
	let best = '';
	let current = s;
	for (let k = 0; k < 4; k++) {
		const key = LAST_LAYER_SLOTS.map((slot) => current.co[slot]).join('');
		if (best === '' || key < best) best = key;
		current = turnPocket(current, 'U');
	}
	return best;
}

export type PocketPermutationCase = 'solved' | 'adjacent' | 'diagonal' | 'other';

/**
 * A key naming the permutation case of a fully oriented last layer, given a
 * solved first layer.
 *
 * You turn the top to whichever position leaves the most corners already home,
 * and read what is left. Counting fixed corners is not enough on its own — an
 * adjacent swap and a diagonal swap both leave two corners in place — so the
 * two that need trading are checked for whether they are neighbours. The slots
 * are numbered round the top face, so neighbours differ by one and opposites by
 * two.
 */
export function pocketPermutationKey(s: PocketState): PocketPermutationCase {
	if (!lastLayerOriented(s) || !firstLayerSolved(s)) return 'other';

	let best: number[] | null = null;
	let bestFixed = -1;
	for (let k = 0; k < 4; k++) {
		const turned = playPocket(s, new Array(k).fill('U'));
		const fixed = LAST_LAYER_SLOTS.filter((slot) => turned.cp[slot] === slot).length;
		if (fixed > bestFixed) {
			bestFixed = fixed;
			best = LAST_LAYER_SLOTS.map((slot) => turned.cp[slot]);
		}
	}
	if (bestFixed === 4) return 'solved';
	if (bestFixed === 2 && best) {
		const moved = LAST_LAYER_SLOTS.filter((slot) => best![slot] !== slot);
		const apart = Math.abs(moved[0] - moved[1]);
		return apart === 2 ? 'diagonal' : 'adjacent';
	}
	return 'other';
}

/**
 * Every orientation case of the last layer, found by exhaustion rather than
 * transcribed: all 3⁴ twist patterns whose total is a multiple of three.
 */
export function enumeratePocketOrientations(): string[] {
	const keys = new Set<string>();
	for (let a = 0; a < 3; a++) {
		for (let b = 0; b < 3; b++) {
			for (let c = 0; c < 3; c++) {
				for (let d = 0; d < 3; d++) {
					if ((a + b + c + d) % 3 !== 0) continue;
					keys.add(
						pocketOrientationKey({
							cp: [0, 1, 2, 3, 4, 5, 6, 7],
							co: [a, b, c, d, 0, 0, 0, 0]
						})
					);
				}
			}
		}
	}
	return [...keys].sort();
}
