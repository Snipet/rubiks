/**
 * Sticker state, for any size.
 *
 * `facelets.ts` does this for the 3×3 and does it well; it is verified, it is
 * used by the solver, and rewriting it to take a size parameter would put every
 * one of those tests at risk for no gain. So this is the parallel path the
 * variable-size parts of the site use, and a test pins it to the 3×3 module at
 * size 3 so the two cannot quietly disagree.
 */

import { UNSET } from './facelets';
import {
	applyPerm,
	isSolvedState,
	puzzle,
	type Perm,
	type Puzzle,
	type PuzzleSize
} from './puzzle';
import { FACE_NAMES, FACES, type Face, type Facelets } from './types';

export { UNSET };

/** A freshly solved puzzle. */
export function solved(p: Puzzle): Facelets {
	return p.solved();
}

/**
 * The stickers a blank sticker editor starts with already filled in.
 *
 * Something has to anchor the colour scheme, or a state is only defined up to
 * turning the whole puzzle over. On odd sizes the centres do it, because they
 * cannot move relative to each other. A 2×2 has no centres, so the convention
 * cubers already use takes over: the back-bottom-left corner is the reference
 * and everything else is read against it.
 *
 * A 4×4 has neither. Its centres are four loose stickers that any turn can move,
 * so there is no sticker whose colour is knowable in advance — the editor starts
 * completely empty and the reader is asked to hold the puzzle a stated way up.
 */
export function anchors(p: Puzzle): Map<number, Face> {
	const out = new Map<number, Face>();
	if (p.hasFixedCentres) {
		const mid = (p.size - 1) / 2;
		for (const face of FACES) out.set(p.index(face, mid, mid), face);
		return out;
	}
	if (p.size === 2) {
		// The three stickers of the down-back-left corner.
		const corner = { x: -0.5, y: -0.5, z: -0.5 };
		for (const face of [3, 4, 5] as Face[]) {
			const index = p.stickerFacing(corner, face);
			if (index >= 0) out.set(index, face);
		}
	}
	return out;
}

/** A blank canvas for the sticker editor, with whatever anchors the size has. */
export function blank(p: Puzzle): Facelets {
	const f = new Uint8Array(p.stickers).fill(UNSET);
	for (const [index, face] of anchors(p)) f[index] = face;
	return f;
}

export function clone(f: Facelets): Facelets {
	return new Uint8Array(f);
}

export function equal(a: Facelets, b: Facelets): boolean {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}

/** True when every sticker sits on its own face — solved in the home frame. */
export function isSolved(p: Puzzle, f: Facelets): boolean {
	for (let i = 0; i < p.stickers; i++) {
		if (f[i] !== Math.floor(i / p.faceStride)) return false;
	}
	return true;
}

/** True when every face shows one colour, whichever way up the puzzle is held. */
export function isSolvedAnyOrientation(p: Puzzle, f: Facelets): boolean {
	return isSolvedState(p, f);
}

/** Apply an algorithm written as a move list. */
export function apply(p: Puzzle, f: Facelets, names: readonly string[]): Facelets {
	return applyPerm(f, p.algPerm(names));
}

/** Apply an algorithm written as a string. Unknown names throw. */
export function applyAlgString(p: Puzzle, f: Facelets, alg: string): Facelets {
	return apply(p, f, tokenise(alg));
}

/** Split an algorithm string into move names, ignoring brackets and commas. */
export function tokenise(alg: string): string[] {
	return alg
		.replace(/[()[\],]/g, ' ')
		.replace(/[’‘`´]/g, "'")
		.trim()
		.split(/\s+/)
		.filter(Boolean);
}

/** True when every name in an algorithm means something at this size. */
export function understands(p: Puzzle, alg: string): boolean {
	return tokenise(alg).every((name) => p.parse(name) !== null);
}

/** The sticker indices of a face, row-major. */
export function faceIndices(p: Puzzle, face: Face): number[] {
	return Array.from({ length: p.faceStride }, (_, i) => face * p.faceStride + i);
}

export function faceOf(p: Puzzle, index: number): Face {
	return Math.floor(index / p.faceStride) as Face;
}

/** True when every sticker on a face shows that face's own colour. */
export function faceIsUniform(p: Puzzle, f: Facelets, face: Face): boolean {
	for (let i = 0; i < p.faceStride; i++) {
		if (f[face * p.faceStride + i] !== face) return false;
	}
	return true;
}

export function countUnset(p: Puzzle, f: Facelets): number {
	let n = 0;
	for (let i = 0; i < p.stickers; i++) if (f[i] === UNSET) n++;
	return n;
}

/** Tally of how many stickers carry each colour, ignoring unset ones. */
export function colorCounts(p: Puzzle, f: Facelets): number[] {
	const counts = [0, 0, 0, 0, 0, 0];
	for (let i = 0; i < p.stickers; i++) if (f[i] !== UNSET) counts[f[i]]++;
	return counts;
}

/** Serialise to the conventional `UUUU…RRRR…` string. */
export function toString(p: Puzzle, f: Facelets): string {
	let s = '';
	for (let i = 0; i < p.stickers; i++) s += f[i] === UNSET ? '.' : FACE_NAMES[f[i] as Face];
	return s;
}

/** Parse a sticker string. `.` or `-` mean "not set yet". */
export function fromString(p: Puzzle, s: string): Facelets {
	const cleaned = s.replace(/\s+/g, '').toUpperCase();
	if (cleaned.length !== p.stickers) {
		throw new Error(
			`Expected ${p.stickers} stickers for a ${p.size}×${p.size}, got ${cleaned.length}`
		);
	}
	const f = new Uint8Array(p.stickers);
	for (let i = 0; i < p.stickers; i++) {
		const c = cleaned[i];
		if (c === '.' || c === '-') {
			f[i] = UNSET;
			continue;
		}
		const face = FACE_NAMES.indexOf(c as (typeof FACE_NAMES)[number]);
		if (face < 0) throw new Error(`${c} is not a face letter`);
		f[i] = face;
	}
	return f;
}

/**
 * The 24 ways of holding the puzzle, as rotation algorithms. Rotations mean the
 * same thing at every size, so this list is shared rather than re-derived.
 */
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

const ORIENTATION_PERMS = new Map<PuzzleSize, (Perm | null)[]>();

function orientationPerms(p: Puzzle): (Perm | null)[] {
	const cached = ORIENTATION_PERMS.get(p.size);
	if (cached) return cached;
	const built = ORIENTATIONS.map((alg) => (alg === '' ? null : p.algPerm(tokenise(alg))));
	ORIENTATION_PERMS.set(p.size, built);
	return built;
}

/**
 * Rotate a state into the canonical frame, or `null` if no rotation gets there.
 *
 * On odd sizes "canonical" means the centres are home. On even sizes there are
 * no centres to check, so the anchor corner is used instead — which is what
 * makes a 2×2 state well defined at all.
 */
export function reorientToStandard(p: Puzzle, f: Facelets): Facelets | null {
	const alg = reorientationFor(p, f);
	if (alg === null) return null;
	return alg === '' ? clone(f) : apply(p, f, tokenise(alg));
}

/**
 * The rotation that would put a state back in the canonical frame, as an
 * algorithm string. Empty when it is already there, `null` when the reference
 * stickers do not form a valid colour scheme.
 */
export function reorientationFor(p: Puzzle, f: Facelets): string | null {
	const reference = anchors(p);
	if (reference.size === 0) return '';
	const perms = orientationPerms(p);
	for (let i = 0; i < perms.length; i++) {
		const perm = perms[i];
		const candidate = perm ? applyPerm(f, perm) : f;
		let ok = true;
		for (const [index, face] of reference) {
			if (candidate[index] !== face) {
				ok = false;
				break;
			}
		}
		if (ok) return ORIENTATIONS[i];
	}
	return null;
}

/** Convenience for callers that hold a size rather than a puzzle. */
export function forSize(size: PuzzleSize): Puzzle {
	return puzzle(size);
}
