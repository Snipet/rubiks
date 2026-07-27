/**
 * The N×N×N engine.
 *
 * The 3×3 engine in `moves.ts` is built from nine hand-derived permutations. That
 * approach does not scale: a 5×5 has thirty distinct layer turns and nobody
 * should transcribe those by hand. So this module derives every permutation from
 * geometry instead.
 *
 * Each sticker knows which little cube it sits on and which way it faces. A layer
 * turn is then a 90° rotation applied to both — position and normal — and the new
 * sticker index is whatever sticker now occupies that position facing that way.
 * Nothing is tabulated, so nothing can be mistyped.
 *
 * The two engines are locked together by a test that checks `puzzle(3)` produces
 * *byte-identical* permutations to the hand-derived ones for every move they share.
 * That is what lets this file be trusted: it agrees with an engine that already
 * reproduces the superflip and a dozen published group orders.
 *
 * Model coordinates are the natural ones — **x right, y up, z towards the
 * viewer** — and faces are numbered U, R, F, D, L, B, each read row-major from
 * outside, exactly as `types.ts` describes for the 3×3.
 */

import { B, D, F, L, R, U, type Face, type Facelets } from './types';

/** Sizes the site knows how to draw and turn. */
export type PuzzleSize = 2 | 3 | 4 | 5;

export const PUZZLE_SIZES: readonly PuzzleSize[] = [2, 3, 4, 5];

/** A sticker permutation in source-index form: `next[i] = prev[perm[i]]`. */
export type Perm = Readonly<Uint8Array>;

interface Vec {
	x: number;
	y: number;
	z: number;
}

/** Outward normal of each face, in model coordinates. */
const FACE_NORMAL: Record<Face, Vec> = {
	[U]: { x: 0, y: 1, z: 0 },
	[R]: { x: 1, y: 0, z: 0 },
	[F]: { x: 0, y: 0, z: 1 },
	[D]: { x: 0, y: -1, z: 0 },
	[L]: { x: -1, y: 0, z: 0 },
	[B]: { x: 0, y: 0, z: -1 }
};

/**
 * One clockwise quarter turn as seen from outside each face, written as a map on
 * centred coordinates.
 *
 * The three positive-facing ones are derived the same way the 3×3 engine's were:
 * a `U` turn carries the front face round to the left, an `R` turn carries the
 * front face up, and an `F` turn carries the top face to the right. The three
 * negative-facing ones are simply those run backwards.
 */
const ROTATE: Record<Face, (v: Vec) => Vec> = {
	[U]: ({ x, y, z }) => ({ x: -z, y, z: x }),
	[D]: ({ x, y, z }) => ({ x: z, y, z: -x }),
	[R]: ({ x, y, z }) => ({ x, y: z, z: -y }),
	[L]: ({ x, y, z }) => ({ x, y: -z, z: y }),
	[F]: ({ x, y, z }) => ({ x: y, y: -x, z }),
	[B]: ({ x, y, z }) => ({ x: -y, y: x, z })
};

/** A parsed layer turn, independent of how it was written. */
export interface LayerTurn {
	/** The face the turn is named after, and seen from which it is clockwise. */
	face: Face;
	/** Depth of the shallowest layer turned; 0 is the face itself. */
	from: number;
	/** Depth of the deepest layer turned. */
	to: number;
	/** Quarter turns clockwise: 1, 2 or 3. */
	amount: 1 | 2 | 3;
}

export interface Puzzle {
	readonly size: PuzzleSize;
	/** Total stickers: 6·n². */
	readonly stickers: number;
	/** Stickers per face: n². */
	readonly faceStride: number;
	/** A solved sticker state. */
	solved(): Facelets;
	/** The permutation for a named move, memoised. */
	perm(name: string): Perm;
	/** The permutation for a whole algorithm. */
	algPerm(names: readonly string[]): Perm;
	/** Every move name this size accepts, in a stable order. */
	readonly moveNames: readonly string[];
	/** The turns a scramble generator should draw from. */
	readonly scrambleMoves: readonly string[];
	/** Parse a move name into a layer turn, or `null` if it means nothing here. */
	parse(name: string): LayerTurn | null;
	/** Sticker index from face, row and column. */
	index(face: Face, row: number, col: number): number;
	/** Face, row and column of a sticker index. */
	locate(index: number): { face: Face; row: number; col: number };
	/** True when the puzzle has a fixed centre on each face — odd sizes only. */
	readonly hasFixedCentres: boolean;
}

const CACHE = new Map<number, Puzzle>();

/** Build (or reuse) the engine for a given size. */
export function puzzle(size: PuzzleSize): Puzzle {
	const existing = CACHE.get(size);
	if (existing) return existing;
	const built = build(size);
	CACHE.set(size, built);
	return built;
}

function build(size: PuzzleSize): Puzzle {
	const faceStride = size * size;
	const stickers = 6 * faceStride;
	const centre = (size - 1) / 2;

	/**
	 * Where each sticker sits and which way it faces.
	 *
	 * The row and column conventions are the ones the 3×3 already uses: `U1` is
	 * the up-back-left sticker, `D1` the down-front-left, and the `R` and `B`
	 * faces are numbered as seen from outside themselves, which is why their
	 * columns count backwards relative to the model axes.
	 */
	function place(face: Face, row: number, col: number): Vec {
		const last = size - 1;
		switch (face) {
			case U:
				return { x: col, y: last, z: row };
			case D:
				return { x: col, y: 0, z: last - row };
			case F:
				return { x: col, y: last - row, z: last };
			case B:
				return { x: last - col, y: last - row, z: 0 };
			case R:
				return { x: last, y: last - row, z: last - col };
			case L:
				return { x: 0, y: last - row, z: col };
		}
	}

	// Forward table: sticker index → centred position and normal.
	const position: Vec[] = new Array(stickers);
	const normal: Vec[] = new Array(stickers);
	// Reverse lookup: packed (position, normal) → sticker index.
	const lookup = new Map<number, number>();

	const key = (p: Vec, n: Vec) =>
		((((p.x + 2) * 8 + (p.y + 2)) * 8 + (p.z + 2)) * 64 +
			((n.x + 1) * 3 + (n.y + 1)) * 3 +
			(n.z + 1)) *
			2 +
		1;

	for (let face = 0 as Face; face < 6; face = (face + 1) as Face) {
		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				const idx = face * faceStride + row * size + col;
				const raw = place(face, row, col);
				const p = { x: raw.x - centre, y: raw.y - centre, z: raw.z - centre };
				position[idx] = p;
				normal[idx] = FACE_NORMAL[face];
				lookup.set(key(p, FACE_NORMAL[face]), idx);
			}
		}
	}

	/** The coordinate that selects layers for a face, and which end depth 0 is. */
	function depthOf(face: Face, p: Vec): number {
		const last = size - 1;
		switch (face) {
			case U:
				return last - (p.y + centre);
			case D:
				return p.y + centre;
			case R:
				return last - (p.x + centre);
			case L:
				return p.x + centre;
			case F:
				return last - (p.z + centre);
			case B:
				return p.z + centre;
		}
	}

	function turnPerm(turn: LayerTurn): Perm {
		const rotate = ROTATE[turn.face];
		const out = new Uint8Array(stickers);
		for (let i = 0; i < stickers; i++) out[i] = i;

		for (let s = 0; s < stickers; s++) {
			const depth = depthOf(turn.face, position[s]);
			if (depth < turn.from || depth > turn.to) continue;
			let p = position[s];
			let n = normal[s];
			for (let q = 0; q < turn.amount; q++) {
				p = rotate(p);
				n = rotate(n);
			}
			const dest = lookup.get(key(p, n));
			if (dest === undefined) {
				throw new Error(`Sticker ${s} rotated off the puzzle — geometry is inconsistent`);
			}
			// The sticker at `s` ends up at `dest`, so `dest` sources from `s`.
			out[dest] = s;
		}
		return out;
	}

	// --- names ------------------------------------------------------------

	const FACE_LETTER: Record<string, Face> = { U, R, F, D, L, B };

	/**
	 * Read a move name into a layer turn.
	 *
	 * Understands the notation the WCA uses across sizes: outer turns (`R`), wide
	 * turns (`Rw` or `r`, two layers), deeper wide turns (`3Rw`, three layers),
	 * bare inner slices (`3R`, the third layer alone), slice turns on odd sizes
	 * (`M`, `E`, `S`) and whole-cube rotations (`x`, `y`, `z`). Returns `null` for
	 * anything this size has no meaning for — a `2×2` has no middle to slice.
	 *
	 * One deliberate difference from the 3×3 parser in `moves.ts`: there `2R` is an
	 * alias for `Rw`, which is convenient on a cube with only one inner layer but
	 * wrong everywhere else. Here the WCA reading wins — a number without a `w`
	 * names one layer, a number with a `w` names every layer down to it.
	 */
	function parse(name: string): LayerTurn | null {
		const match = /^(\d*)([URFDLBurfdlbMESxyz])(w?)(2|')?$/.exec(name);
		if (!match) return null;
		const [, depthText, letter, wide, suffix] = match;
		const amount: 1 | 2 | 3 = suffix === '2' ? 2 : suffix === "'" ? 3 : 1;

		if (letter === 'x' || letter === 'y' || letter === 'z') {
			const face = letter === 'x' ? R : letter === 'y' ? U : F;
			return { face, from: 0, to: size - 1, amount };
		}

		if (letter === 'M' || letter === 'E' || letter === 'S') {
			// Slice turns need a genuine middle, and follow L, D and F respectively.
			if (size % 2 === 0) return null;
			const middle = (size - 1) / 2;
			const face = letter === 'M' ? L : letter === 'E' ? D : F;
			return { face, from: middle, to: middle, amount };
		}

		const lower = letter === letter.toLowerCase();
		const face = FACE_LETTER[letter.toUpperCase()];
		if (face === undefined) return null;

		// `3Rw` reaches three layers deep; `Rw` and `r` reach two; `R` reaches one.
		const depth = depthText ? Number(depthText) : wide || lower ? 2 : 1;
		if (!Number.isInteger(depth) || depth < 1 || depth > size) return null;
		// A bare number names that layer on its own; everything else starts outside.
		const from = depthText && !wide ? depth - 1 : 0;
		return { face, from, to: depth - 1, amount };
	}

	/**
	 * Every name worth offering, in a stable order.
	 *
	 * The two-layer wide turn is standard at every size from 3 up, so it is always
	 * here. Deeper ones stop before the point where only a single layer is left
	 * behind: turning three of a 4×4's four layers is the whole cube rotated with
	 * the last layer put back, which the rotations and the outer turns already say.
	 */
	const moveNames: string[] = (() => {
		const out: string[] = [];
		const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
		const suffixes = ['', '2', "'"];
		for (const f of faces) for (const s of suffixes) out.push(f + s);
		const deepest = size >= 3 ? Math.max(2, size - 2) : 0;
		for (let depth = 2; depth <= deepest; depth++) {
			const prefix = depth === 2 ? '' : String(depth);
			for (const f of faces) for (const s of suffixes) out.push(`${prefix}${f}w${s}`);
		}
		if (size % 2 === 1 && size >= 3) {
			for (const m of ['M', 'E', 'S']) for (const s of suffixes) out.push(m + s);
		}
		for (const r of ['x', 'y', 'z']) for (const s of suffixes) out.push(r + s);
		return out;
	})();

	/**
	 * The turns a scramble should use.
	 *
	 * A 2×2 has no fixed centres, so turning D, L or B is the same as turning the
	 * opposite face and rotating the whole puzzle; scrambles use only three faces,
	 * which is the WCA convention. From 4×4 up, two-layer wide turns are added so a
	 * scramble genuinely reaches the inner slices — also the WCA convention, which
	 * uses nothing deeper than a wide turn until 6×6.
	 */
	const scrambleMoves: readonly string[] = (() => {
		const suffixes = ['', '2', "'"];
		if (size === 2) return ['U', 'R', 'F'].flatMap((f) => suffixes.map((s) => f + s));
		const faces = ['U', 'R', 'F', 'D', 'L', 'B'].flatMap((f) => suffixes.map((s) => f + s));
		if (size === 3) return faces;
		const wides = ['Uw', 'Rw', 'Fw'].flatMap((f) => suffixes.map((s) => f + s));
		return [...faces, ...wides];
	})();

	const permCache = new Map<string, Perm>();
	const identity = (() => {
		const p = new Uint8Array(stickers);
		for (let i = 0; i < stickers; i++) p[i] = i;
		return p as Perm;
	})();

	/**
	 * Unknown names throw rather than quietly doing nothing. Returning the identity
	 * would turn "`M` means nothing on a 4×4" into a silently dropped turn, which is
	 * exactly the kind of bug that survives every test that only checks solvedness.
	 */
	function perm(name: string): Perm {
		const cached = permCache.get(name);
		if (cached) return cached;
		const turn = parse(name);
		if (!turn) throw new Error(`${name} is not a move on a ${size}×${size}`);
		const result = turnPerm(turn);
		permCache.set(name, result);
		return result;
	}

	function algPerm(names: readonly string[]): Perm {
		let acc = identity;
		for (const name of names) {
			const next = perm(name);
			const merged = new Uint8Array(stickers);
			for (let i = 0; i < stickers; i++) merged[i] = acc[next[i]];
			acc = merged;
		}
		return acc;
	}

	return {
		size,
		stickers,
		faceStride,
		hasFixedCentres: size % 2 === 1,
		moveNames,
		scrambleMoves,
		parse,
		perm,
		algPerm,
		solved() {
			const f = new Uint8Array(stickers);
			for (let face = 0; face < 6; face++) {
				f.fill(face, face * faceStride, (face + 1) * faceStride);
			}
			return f;
		},
		index: (face, row, col) => face * faceStride + row * size + col,
		locate(index) {
			const face = Math.floor(index / faceStride) as Face;
			const within = index % faceStride;
			return { face, row: Math.floor(within / size), col: within % size };
		}
	};
}

/** Apply a permutation to a sticker state. */
export function applyPerm(state: Facelets, perm: Perm): Facelets {
	const out = new Uint8Array(perm.length);
	for (let i = 0; i < perm.length; i++) out[i] = state[perm[i]];
	return out;
}

/** Apply a whole algorithm, given as a list of move names. */
export function applyMoves(p: Puzzle, state: Facelets, names: readonly string[]): Facelets {
	return applyPerm(state, p.algPerm(names));
}

/** True when every face of a state shows a single colour. */
export function isSolvedState(p: Puzzle, state: Facelets): boolean {
	for (let face = 0; face < 6; face++) {
		const first = state[face * p.faceStride];
		for (let i = 1; i < p.faceStride; i++) {
			if (state[face * p.faceStride + i] !== first) return false;
		}
	}
	return true;
}
