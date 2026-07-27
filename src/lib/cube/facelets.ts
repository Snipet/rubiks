/**
 * Sticker-level cube state and the operations the UI performs on it.
 */

import {
	CENTER_FACELETS,
	FACE_NAMES,
	FACES,
	N_FACELETS,
	type Face,
	type FaceName,
	type Facelets
} from './types';
import { algPerm, movePerm, parseAlg, type Move, type Perm } from './moves';

/** A freshly solved cube. */
export function solvedFacelets(): Facelets {
	const f = new Uint8Array(N_FACELETS);
	for (const face of FACES) f.fill(face, face * 9, face * 9 + 9);
	return f;
}

/** A blank canvas for the sticker editor: centres fixed, everything else unset. */
export const UNSET = 255;

export function blankFacelets(): Facelets {
	const f = new Uint8Array(N_FACELETS).fill(UNSET);
	for (const face of FACES) f[CENTER_FACELETS[face]] = face;
	return f;
}

export function cloneFacelets(f: Facelets): Facelets {
	return new Uint8Array(f);
}

export function faceletsEqual(a: Facelets, b: Facelets): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}

export function isSolved(f: Facelets): boolean {
	for (let i = 0; i < N_FACELETS; i++) if (f[i] !== ((i / 9) | 0)) return false;
	return true;
}

/** Apply a raw permutation to a sticker state. */
export function applyPerm(f: Facelets, perm: Perm): Facelets {
	const out = new Uint8Array(N_FACELETS);
	for (let i = 0; i < N_FACELETS; i++) out[i] = f[perm[i]];
	return out;
}

/** Apply one move. */
export function applyMove(f: Facelets, move: Move | string): Facelets {
	return applyPerm(f, movePerm(move));
}

/** Apply an algorithm, given either as a string or pre-parsed moves. */
export function applyAlg(f: Facelets, alg: string | readonly Move[]): Facelets {
	return applyPerm(f, algPerm(alg));
}

/** The state reached by applying `alg` to a solved cube. */
export function stateFromAlg(alg: string | readonly Move[]): Facelets {
	return applyAlg(solvedFacelets(), alg);
}

/**
 * The state that `alg` *solves*: the inverse of the algorithm applied to a solved
 * cube. This is how every case diagram in the algorithm library is generated —
 * the picture is derived from the algorithm rather than transcribed alongside it,
 * so the two can never disagree.
 */
export function caseFromAlg(alg: string | readonly Move[]): Facelets {
	const moves = typeof alg === 'string' ? parseAlg(alg) : alg;
	return applyAlg(
		solvedFacelets(),
		moves
			.slice()
			.reverse()
			.map((m) => ({
				base: m.base,
				amount: (m.amount === 2 ? 2 : m.amount === 1 ? 3 : 1) as 1 | 2 | 3,
				name: m.base + (m.amount === 2 ? '2' : m.amount === 1 ? "'" : '')
			}))
	);
}

/** Serialise to the conventional 54-character `UUUUUUUUURRR…` string. */
export function faceletsToString(f: Facelets): string {
	let s = '';
	for (let i = 0; i < N_FACELETS; i++) s += f[i] === UNSET ? '.' : FACE_NAMES[f[i] as Face];
	return s;
}

const FACE_BY_NAME: Record<string, Face> = Object.fromEntries(
	FACE_NAMES.map((n, i) => [n, i as Face])
) as Record<string, Face>;

/** Parse a 54-character facelet string. `.` or `-` mean "not set yet". */
export function faceletsFromString(s: string): Facelets {
	const cleaned = s.replace(/\s+/g, '').toUpperCase();
	if (cleaned.length !== N_FACELETS) {
		throw new Error(`Expected ${N_FACELETS} facelets, got ${cleaned.length}`);
	}
	const f = new Uint8Array(N_FACELETS);
	for (let i = 0; i < N_FACELETS; i++) {
		const ch = cleaned[i];
		if (ch === '.' || ch === '-') {
			f[i] = UNSET;
			continue;
		}
		const face = FACE_BY_NAME[ch];
		if (face === undefined) throw new Error(`Unknown facelet letter "${ch}" at position ${i}`);
		f[i] = face;
	}
	return f;
}

/** The nine sticker indices of a face, row-major. */
export function faceIndices(face: Face): number[] {
	return Array.from({ length: 9 }, (_, i) => face * 9 + i);
}

/** Which face a sticker index belongs to. */
export function faceOf(index: number): Face {
	return ((index / 9) | 0) as Face;
}

export function faceName(face: Face): FaceName {
	return FACE_NAMES[face];
}

/** True when every sticker on `face` shows that face's colour. */
export function faceIsUniform(f: Facelets, face: Face): boolean {
	for (let i = 0; i < 9; i++) if (f[face * 9 + i] !== face) return false;
	return true;
}

/** How many stickers still hold {@link UNSET}. */
export function countUnset(f: Facelets): number {
	let n = 0;
	for (let i = 0; i < N_FACELETS; i++) if (f[i] === UNSET) n++;
	return n;
}

/** The 24 whole-cube orientations, as rotation algorithms. */
export const ORIENTATIONS: readonly string[] = [
	'',
	'y',
	'y2',
	"y'",
	'x',
	'x y',
	'x y2',
	"x y'",
	'x2',
	'x2 y',
	'x2 y2',
	"x2 y'",
	"x'",
	"x' y",
	"x' y2",
	"x' y'",
	'z',
	'z y',
	'z y2',
	"z y'",
	"z'",
	"z' y",
	"z' y2",
	"z' y'"
];

const ORIENTATION_PERMS = ORIENTATIONS.map((alg) => (alg === '' ? null : algPerm(alg)));

/**
 * True when every face shows a single colour — that is, the cube is solved,
 * possibly held in a different orientation than the canonical one.
 *
 * Algorithms containing `x`/`y`/`z` finish in a rotated frame, so this is the
 * check to use when verifying that an algorithm solves a case.
 */
export function isSolvedIgnoringOrientation(f: Facelets): boolean {
	for (const face of FACES) {
		const c = f[face * 9];
		for (let i = 1; i < 9; i++) if (f[face * 9 + i] !== c) return false;
	}
	return true;
}

/**
 * Rotate a state so that its centres sit in the canonical U/R/F/D/L/B positions.
 *
 * Useful after running an algorithm that contains cube rotations, and for
 * accepting sticker input from someone who held their cube a different way up.
 * Returns `null` when the centres do not form a valid colour scheme.
 */
export function reorientToStandard(f: Facelets): Facelets | null {
	for (let i = 0; i < ORIENTATION_PERMS.length; i++) {
		const perm = ORIENTATION_PERMS[i];
		const candidate = perm ? applyPerm(f, perm) : f;
		let ok = true;
		for (const face of FACES) {
			if (candidate[CENTER_FACELETS[face]] !== face) {
				ok = false;
				break;
			}
		}
		if (ok) return cloneFacelets(candidate);
	}
	return null;
}

/**
 * The rotation that would put a state back in the canonical frame, as an
 * algorithm string. Empty when it is already there, `null` when the centres do
 * not form a valid colour scheme.
 *
 * Needed because an algorithm written with a leading `x` or `y` leaves the cube
 * tilted, and a recommendation the reader is going to perform literally has to
 * end with the cube the way up it started.
 */
export function reorientationFor(f: Facelets): string | null {
	for (let i = 0; i < ORIENTATION_PERMS.length; i++) {
		const perm = ORIENTATION_PERMS[i];
		const candidate = perm ? applyPerm(f, perm) : f;
		let ok = true;
		for (const face of FACES) {
			if (candidate[CENTER_FACELETS[face]] !== face) {
				ok = false;
				break;
			}
		}
		if (ok) return ORIENTATIONS[i];
	}
	return null;
}

/** Tally of how many stickers carry each colour, ignoring unset ones. */
export function colorCounts(f: Facelets): number[] {
	const counts = [0, 0, 0, 0, 0, 0];
	for (let i = 0; i < N_FACELETS; i++) if (f[i] !== UNSET) counts[f[i]]++;
	return counts;
}
