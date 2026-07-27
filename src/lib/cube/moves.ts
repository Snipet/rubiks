/**
 * The move engine.
 *
 * Everything is built from nine hand-derived primitives — the six face quarter
 * turns plus the three whole-cube rotations — expressed as facelet
 * permutations. Wide turns, slice turns, half turns and inverses are all
 * *derived* from those primitives by composition, so there is exactly one place
 * where a transcription mistake could hide, and the unit tests pin it down.
 *
 * A permutation is stored in "source index" form: `next[i] = prev[perm[i]]`.
 * Composing "apply A, then apply B" is therefore `C[i] = A[B[i]]`.
 */

import { N_FACELETS } from './types';

/** A facelet permutation in source-index form. */
export type Perm = Readonly<Uint8Array>;

export const IDENTITY: Perm = (() => {
	const p = new Uint8Array(N_FACELETS);
	for (let i = 0; i < N_FACELETS; i++) p[i] = i;
	return p;
})();

/** Apply `b` after `a`. */
export function composePerm(a: Perm, b: Perm): Perm {
	const out = new Uint8Array(N_FACELETS);
	for (let i = 0; i < N_FACELETS; i++) out[i] = a[b[i]];
	return out;
}

/** Repeat a permutation `n` times (n ≥ 0). */
export function powPerm(p: Perm, n: number): Perm {
	let out: Perm = IDENTITY;
	for (let i = 0; i < n; i++) out = composePerm(out, p);
	return out;
}

/** The permutation that undoes `p`. */
export function invertPerm(p: Perm): Perm {
	const out = new Uint8Array(N_FACELETS);
	for (let i = 0; i < N_FACELETS; i++) out[p[i]] = i;
	return out;
}

/**
 * Build a permutation from cycle notation, where `(a b c d)` means "the sticker
 * at `a` moves to `b`, `b` moves to `c`, …, `d` moves back to `a`".
 */
function permFromCycles(cycles: readonly (readonly number[])[]): Perm {
	const p = new Uint8Array(IDENTITY);
	for (const cycle of cycles) {
		for (let i = 0; i < cycle.length; i++) {
			const from = cycle[i];
			const to = cycle[(i + 1) % cycle.length];
			p[to] = from;
		}
	}
	return p;
}

// Within-face 3×3 content rotations, in source-index form.
const ROT_CW = [6, 3, 0, 7, 4, 1, 8, 5, 2];
const ROT_CCW = [2, 5, 8, 1, 4, 7, 0, 3, 6];
const ROT_HALF = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const ROT_ID = [0, 1, 2, 3, 4, 5, 6, 7, 8];

type LocalRot = 'id' | 'cw' | 'ccw' | 'half';
const LOCAL_ROTS: Record<LocalRot, readonly number[]> = {
	id: ROT_ID,
	cw: ROT_CW,
	ccw: ROT_CCW,
	half: ROT_HALF
};

/**
 * Build a whole-cube rotation from a face-block map. Each entry says "the new
 * contents of face `dest` are the old contents of face `src`, rotated by `rot`
 * within the face".
 */
function permFromFaceMap(map: readonly (readonly [number, number, LocalRot])[]): Perm {
	const p = new Uint8Array(N_FACELETS);
	for (const [dest, src, rot] of map) {
		const table = LOCAL_ROTS[rot];
		for (let i = 0; i < 9; i++) p[dest * 9 + i] = src * 9 + table[i];
	}
	return p;
}

// ---------------------------------------------------------------------------
// The nine primitives
// ---------------------------------------------------------------------------

/** Quarter turn of U, clockwise seen from above. */
const P_U = permFromCycles([
	[0, 2, 8, 6],
	[1, 5, 7, 3],
	[9, 18, 36, 45],
	[10, 19, 37, 46],
	[11, 20, 38, 47]
]);

/** Quarter turn of D, clockwise seen from below. */
const P_D = permFromCycles([
	[27, 29, 35, 33],
	[28, 32, 34, 30],
	[24, 15, 51, 42],
	[25, 16, 52, 43],
	[26, 17, 53, 44]
]);

/** Quarter turn of R, clockwise seen from the right. */
const P_R = permFromCycles([
	[9, 11, 17, 15],
	[10, 14, 16, 12],
	[20, 2, 51, 29],
	[23, 5, 48, 32],
	[26, 8, 45, 35]
]);

/** Quarter turn of L, clockwise seen from the left. */
const P_L = permFromCycles([
	[36, 38, 44, 42],
	[37, 41, 43, 39],
	[0, 18, 27, 53],
	[3, 21, 30, 50],
	[6, 24, 33, 47]
]);

/** Quarter turn of F, clockwise seen from the front. */
const P_F = permFromCycles([
	[18, 20, 26, 24],
	[19, 23, 25, 21],
	[8, 15, 27, 38],
	[7, 12, 28, 41],
	[6, 9, 29, 44]
]);

/** Quarter turn of B, clockwise seen from behind. */
const P_B = permFromCycles([
	[45, 47, 53, 51],
	[46, 50, 52, 48],
	[0, 42, 35, 11],
	[1, 39, 34, 14],
	[2, 36, 33, 17]
]);

/** Whole-cube rotation in the direction of a U turn. */
const P_y = permFromFaceMap([
	[0, 0, 'cw'], // U ← U
	[3, 3, 'ccw'], // D ← D
	[4, 2, 'id'], // L ← F
	[5, 4, 'id'], // B ← L
	[1, 5, 'id'], // R ← B
	[2, 1, 'id'] // F ← R
]);

/** Whole-cube rotation in the direction of an R turn. */
const P_x = permFromFaceMap([
	[1, 1, 'cw'], // R ← R
	[4, 4, 'ccw'], // L ← L
	[0, 2, 'id'], // U ← F
	[5, 0, 'half'], // B ← U
	[3, 5, 'half'], // D ← B
	[2, 3, 'id'] // F ← D
]);

/**
 * Whole-cube rotation in the direction of an F turn, derived as `y' x y` rather
 * than transcribed by hand.
 */
const P_z = composePerm(composePerm(invertPerm(P_y), P_x), P_y);

// ---------------------------------------------------------------------------
// Derived turns
// ---------------------------------------------------------------------------

const seq = (...perms: Perm[]): Perm =>
	perms.reduce((acc, p) => composePerm(acc, p), IDENTITY as Perm);

const P_xi = invertPerm(P_x);
const P_yi = invertPerm(P_y);
const P_zi = invertPerm(P_z);

/**
 * Wide turns: rotate the whole cube, then put the far face back.
 *
 * Note the direction. `x` drags the L layer round in the R direction, which seen
 * from the left is a counter-clockwise turn — an `L'`. Undoing it therefore takes
 * a plain `L`, not an `L'`. (`x = Rw L'` is the identity people quote; solving it
 * for `Rw` is what these lines do.)
 */
const P_Rw = seq(P_x, P_L);
const P_Lw = seq(P_xi, P_R);
const P_Uw = seq(P_y, P_D);
const P_Dw = seq(P_yi, P_U);
const P_Fw = seq(P_z, P_B);
const P_Bw = seq(P_zi, P_F);

/** Slice turns: a wide turn with its outer face peeled back off. */
const P_M = seq(P_Lw, invertPerm(P_L)); // follows L
const P_E = seq(P_Dw, invertPerm(P_D)); // follows D
const P_S = seq(P_Fw, invertPerm(P_F)); // follows F

/** The base (quarter-turn / single-rotation) generators, keyed by canonical name. */
const BASE: Record<string, Perm> = {
	U: P_U,
	R: P_R,
	F: P_F,
	D: P_D,
	L: P_L,
	B: P_B,
	Uw: P_Uw,
	Rw: P_Rw,
	Fw: P_Fw,
	Dw: P_Dw,
	Lw: P_Lw,
	Bw: P_Bw,
	M: P_M,
	E: P_E,
	S: P_S,
	x: P_x,
	y: P_y,
	z: P_z
};

/** Every base generator name, in a stable display order. */
export const BASE_MOVES = Object.keys(BASE);

/** The 18 outer-layer quarter/half turns — the standard 3×3 move set. */
export const HTM_MOVES: readonly string[] = (['U', 'R', 'F', 'D', 'L', 'B'] as const).flatMap(
	(f) => [f, `${f}2`, `${f}'`]
);

/** Turns that reorient the cube without changing the solved-ness of any piece. */
export const ROTATIONS: readonly string[] = ['x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2'];

/** Aliases accepted by the parser, mapped onto canonical base names. */
const ALIASES: Record<string, string> = {
	u: 'Uw',
	r: 'Rw',
	f: 'Fw',
	d: 'Dw',
	l: 'Lw',
	b: 'Bw',
	'2U': 'Uw',
	'2R': 'Rw',
	'2F': 'Fw',
	'2D': 'Dw',
	'2L': 'Lw',
	'2B': 'Bw',
	X: 'x',
	Y: 'y',
	Z: 'z'
};

/** A single parsed turn. */
export interface Move {
	/** Canonical base name, e.g. `R`, `Rw`, `M`, `y`. */
	readonly base: string;
	/** 1 = clockwise, 2 = half turn, 3 = counter-clockwise. */
	readonly amount: 1 | 2 | 3;
	/** Canonical printed form, e.g. `R`, `R2`, `R'`. */
	readonly name: string;
}

export class NotationError extends Error {
	constructor(
		message: string,
		readonly token: string,
		readonly index: number
	) {
		super(message);
		this.name = 'NotationError';
	}
}

function canonicalName(base: string, amount: 1 | 2 | 3): string {
	return base + (amount === 1 ? '' : amount === 2 ? '2' : "'");
}

function makeMove(base: string, amount: 1 | 2 | 3): Move {
	return { base, amount, name: canonicalName(base, amount) };
}

const PERM_CACHE = new Map<string, Perm>();

/** The facelet permutation for a single move. */
export function movePerm(move: Move | string): Perm {
	const name = typeof move === 'string' ? move : move.name;
	const cached = PERM_CACHE.get(name);
	if (cached) return cached;
	const parsed = typeof move === 'string' ? parseMove(move) : move;
	const base = BASE[parsed.base];
	if (!base) throw new NotationError(`Unknown move "${parsed.base}"`, parsed.base, 0);
	const perm = powPerm(base, parsed.amount);
	PERM_CACHE.set(parsed.name, perm);
	return perm;
}

const TOKEN_RE = /^(2?[URFDLB]w?|[urfdlb]|[MESxyzXYZ])(2|')?('|2)?$/;

/** Parse a single token such as `R`, `Rw'`, `M2`, `y'`. */
export function parseMove(token: string): Move {
	const m = TOKEN_RE.exec(token);
	if (!m) throw new NotationError(`Could not read "${token}" as a move`, token, 0);
	let base = m[1];
	if (base.endsWith('w') && base.length > 1) base = base[0].toUpperCase() + 'w';
	base = ALIASES[base] ?? base;
	if (!BASE[base]) throw new NotationError(`Unknown move "${token}"`, token, 0);

	// `2'` and `'2` both just mean a half turn.
	const marks = [m[2], m[3]].filter(Boolean) as string[];
	let amount: 1 | 2 | 3 = 1;
	if (marks.includes('2')) amount = 2;
	else if (marks.includes("'")) amount = 3;
	if (marks.includes('2') && marks.includes("'")) amount = 2;
	return makeMove(base, amount);
}

/**
 * Parse an algorithm string into moves.
 *
 * Accepts the notation people actually paste around: spaces or commas between
 * moves, `'` or `’` for inverses, wide turns as either `Rw` or `r`, slice turns,
 * whole-cube rotations, and parenthesised groups with an optional repeat count
 * (`(R U R' U')*3` or `(R U R' U')3`). Square brackets are treated like
 * parentheses. A leading/trailing `[` `]` pair wrapping the whole string — as
 * used for commutators in some sources — is *not* interpreted as a commutator;
 * write those out in full.
 */
export function parseAlg(input: string): Move[] {
	const text = input.replace(/[’´`]/g, "'").replace(/[[\]]/g, (c) => (c === '[' ? '(' : ')'));
	const out: Move[] = [];
	// Each stack frame collects the moves of one parenthesised group.
	const stack: Move[][] = [out];
	let i = 0;

	while (i < text.length) {
		const ch = text[i];
		if (/[\s,+·]/.test(ch)) {
			i++;
			continue;
		}
		if (ch === '(') {
			stack.push([]);
			i++;
			continue;
		}
		if (ch === ')') {
			if (stack.length === 1) throw new NotationError('Unmatched ")"', ')', i);
			const group = stack.pop()!;
			i++;
			// Optional repeat: `*3`, `x3` or a bare `3`.
			const rep = /^\s*(?:\*|x)?\s*(\d+)/.exec(text.slice(i));
			let times = 1;
			let inverse = false;
			if (text[i] === "'") {
				inverse = true;
				i++;
			} else if (rep) {
				times = Number(rep[1]);
				i += rep[0].length;
				if (text[i] === "'") {
					inverse = true;
					i++;
				}
			}
			const body = inverse ? invertAlg(group) : group;
			const target = stack[stack.length - 1];
			for (let t = 0; t < times; t++) target.push(...body);
			continue;
		}
		// Longest-match a move token.
		const m = /^(?:2?[URFDLB]w?|[urfdlb]|[MESxyzXYZ])(?:2'|'2|2|')?/.exec(text.slice(i));
		if (!m) throw new NotationError(`Unexpected "${ch}"`, ch, i);
		stack[stack.length - 1].push(parseMove(m[0]));
		i += m[0].length;
	}
	if (stack.length !== 1) throw new NotationError('Unmatched "("', '(', text.length);
	return out;
}

/** Render moves back to a canonical, space-separated string. */
export function formatAlg(moves: readonly Move[]): string {
	return moves.map((m) => m.name).join(' ');
}

/** The algorithm that undoes `moves`. */
export function invertAlg(moves: readonly Move[]): Move[] {
	return moves
		.slice()
		.reverse()
		.map((m) => makeMove(m.base, m.amount === 2 ? 2 : m.amount === 1 ? 3 : 1));
}

/** Mirror map for reflection through the M plane (the L/R mirror). */
const MIRROR_M: Record<string, string> = {
	R: 'L',
	L: 'R',
	Rw: 'Lw',
	Lw: 'Rw',
	U: 'U',
	D: 'D',
	F: 'F',
	B: 'B',
	Uw: 'Uw',
	Dw: 'Dw',
	Fw: 'Fw',
	Bw: 'Bw',
	M: 'M',
	E: 'E',
	S: 'S',
	x: 'x',
	y: 'y',
	z: 'z'
};

/**
 * Reflect an algorithm through the M plane. Every turn direction flips, and R↔L
 * (and Rw↔Lw) swap. Useful for generating the mirror case of an F2L or OLL alg.
 */
export function mirrorAlg(moves: readonly Move[]): Move[] {
	return moves.map((m) =>
		makeMove(MIRROR_M[m.base] ?? m.base, m.amount === 2 ? 2 : m.amount === 1 ? 3 : 1)
	);
}

/** Faces that share an axis, used for cancellation. */
const AXIS: Record<string, string> = {
	U: 'UD',
	D: 'UD',
	Uw: 'UD',
	Dw: 'UD',
	E: 'UD',
	y: 'UD',
	R: 'RL',
	L: 'RL',
	Rw: 'RL',
	Lw: 'RL',
	M: 'RL',
	x: 'RL',
	F: 'FB',
	B: 'FB',
	Fw: 'FB',
	Bw: 'FB',
	S: 'FB',
	z: 'FB'
};

/**
 * Collapse trivially redundant turns: merge repeats of the same layer and drop
 * anything that cancels to nothing, commuting past the opposite face when that
 * exposes a merge (`R L R'` → `L`). This is a tidy-up pass, not an optimiser —
 * it never shortens an algorithm by finding a different solution.
 */
export function simplifyAlg(moves: readonly Move[]): Move[] {
	const out: Move[] = [];
	for (const move of moves) {
		let placed = false;
		// Walk back over moves on the same axis looking for the same layer.
		for (let j = out.length - 1; j >= 0; j--) {
			const prev = out[j];
			if (prev.base === move.base) {
				const total = (prev.amount + move.amount) % 4;
				out.splice(j, 1);
				if (total !== 0) {
					const merged = makeMove(move.base, total as 1 | 2 | 3);
					out.splice(j, 0, merged);
				}
				placed = true;
				break;
			}
			// Only outer-face turns on the same axis commute freely.
			if (AXIS[prev.base] !== AXIS[move.base]) break;
			if (!'URFDLB'.includes(prev.base) || !'URFDLB'.includes(move.base)) break;
		}
		if (!placed) out.push(move);
	}
	return out;
}

/** Move count in half-turn metric (each listed turn counts once; rotations are free). */
export function htmLength(moves: readonly Move[]): number {
	return moves.filter((m) => !'xyz'.includes(m.base)).length;
}

/** Move count in quarter-turn metric — half turns count double. */
export function qtmLength(moves: readonly Move[]): number {
	return moves
		.filter((m) => !'xyz'.includes(m.base))
		.reduce((n, m) => n + (m.amount === 2 ? 2 : 1), 0);
}

/** The facelet permutation performed by a whole algorithm. */
export function algPerm(alg: string | readonly Move[]): Perm {
	const moves = typeof alg === 'string' ? parseAlg(alg) : alg;
	let p: Perm = IDENTITY;
	for (const m of moves) p = composePerm(p, movePerm(m));
	return p;
}
