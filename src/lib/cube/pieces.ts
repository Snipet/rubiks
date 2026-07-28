/**
 * Pieces, rather than stickers, for any size.
 *
 * The sticker model answers "what colour is here", which is the right question
 * for a diagram and the wrong one for a big-cube algorithm. A last-two-edges
 * algorithm on a 4×4 is *defined* by which wing pieces it cycles: the two wings
 * of an edge carry identical colours, so swapping them changes no sticker at all
 * and yet is exactly what the algorithm is for.
 *
 * So this derives the piece permutation from the sticker permutation. A piece is
 * a set of sticker slots that belong to one physical cubie; the sticker
 * permutation carries that set to another one, and the piece it lands on is the
 * cubie that owns those slots. Nothing here is tabulated — a wrong entry would
 * mean claiming an algorithm does something it does not.
 */

import { puzzle, type Puzzle, type PuzzleSize } from './puzzle';
import { tokenise } from './puzzleState';

/** The families of piece a cubed puzzle has. */
export type PieceKind = 'corner' | 'edge' | 'centre';

export interface PieceSlot {
	kind: PieceKind;
	/** The sticker indices this cubie shows, in a stable order. */
	stickers: number[];
	/** A readable name: the faces it touches, plus an index where ambiguous. */
	name: string;
}

const FACE_LETTERS = 'URFDLB';

/** Every visible cubie of a puzzle, as a slot with the stickers it owns. */
export function pieceSlots(p: Puzzle): PieceSlot[] {
	const slots: PieceSlot[] = [];
	for (const cell of p.cubies) {
		const faces = p.facesOf(cell);
		const stickers = faces.map((f) => p.stickerFacing(cell, f));
		const kind: PieceKind = faces.length === 3 ? 'corner' : faces.length === 2 ? 'edge' : 'centre';
		slots.push({ kind, stickers, name: faces.map((f) => FACE_LETTERS[f]).join('') });
	}
	// Same-named pieces (a 4×4 has two UF wings and four U centres) get numbered
	// in a stable order so a cycle can be written down and read back.
	const seen = new Map<string, number>();
	const total = new Map<string, number>();
	for (const s of slots) total.set(s.name, (total.get(s.name) ?? 0) + 1);
	for (const s of slots) {
		if ((total.get(s.name) ?? 0) === 1) continue;
		const n = (seen.get(s.name) ?? 0) + 1;
		seen.set(s.name, n);
		s.name = `${s.name}${n}`;
	}
	return slots;
}

const CACHE = new Map<PuzzleSize, PieceSlot[]>();

export function slotsFor(size: PuzzleSize): PieceSlot[] {
	const hit = CACHE.get(size);
	if (hit) return hit;
	const built = pieceSlots(puzzle(size));
	CACHE.set(size, built);
	return built;
}

/**
 * Where each piece slot ends up when an algorithm is performed.
 *
 * `to[i] = j` means the cubie that started in slot `i` finishes in slot `j`.
 * Throws if a cubie's stickers scatter, which would mean the geometry and the
 * permutation disagree — it cannot happen, and the check is cheap.
 */
export function pieceMap(size: PuzzleSize, alg: string): number[] {
	const p = puzzle(size);
	const slots = slotsFor(size);
	const names = tokenise(alg);
	for (const name of names) {
		if (p.parse(name) === null) throw new Error(`${name} is not a move on a ${size}×${size}`);
	}
	const perm = p.algPerm(names);

	// `perm` is in source-index form: the sticker now at `i` came from `perm[i]`.
	// Invert it to ask where a given sticker went.
	const wentTo = new Array<number>(p.stickers);
	for (let i = 0; i < p.stickers; i++) wentTo[perm[i]] = i;

	const ownerOf = new Map<number, number>();
	slots.forEach((slot, index) => slot.stickers.forEach((s) => ownerOf.set(s, index)));

	return slots.map((slot, index) => {
		const landed = slot.stickers.map((s) => ownerOf.get(wentTo[s])!);
		if (landed.some((l) => l !== landed[0])) {
			throw new Error(`the stickers of slot ${index} did not stay on one cubie`);
		}
		return landed[0];
	});
}

export interface Effect {
	/** Cycles of moved pieces, by kind, each written as slot names. */
	cycles: Record<PieceKind, string[][]>;
	/** How many pieces of each kind moved at all. */
	moved: Record<PieceKind, number>;
	/** True when the algorithm returns every piece to its own slot. */
	identity: boolean;
}

/**
 * What an algorithm does, written as cycles of pieces.
 *
 * This is the language big-cube algorithms are described in — "a three-cycle of
 * wings", "two centres swapped" — so it is the language they should be checked
 * in. Orientation is deliberately not tracked: a cycle that returns a piece to
 * its own slot flipped shows up as a fixed point here, which is why the callers
 * that care about flips compare stickers as well.
 */
export function describeEffect(size: PuzzleSize, alg: string): Effect {
	const slots = slotsFor(size);
	const to = pieceMap(size, alg);
	const cycles: Record<PieceKind, string[][]> = { corner: [], edge: [], centre: [] };
	const moved: Record<PieceKind, number> = { corner: 0, edge: 0, centre: 0 };

	const done = new Set<number>();
	for (let start = 0; start < slots.length; start++) {
		if (done.has(start) || to[start] === start) continue;
		const cycle: string[] = [];
		let at = start;
		while (!done.has(at)) {
			done.add(at);
			cycle.push(slots[at].name);
			moved[slots[at].kind]++;
			at = to[at];
		}
		cycles[slots[start].kind].push(cycle);
	}

	return {
		cycles,
		moved,
		identity: to.every((v, i) => v === i)
	};
}

/** A compact one-line rendering of an effect, for test messages and probes. */
export function effectSummary(effect: Effect): string {
	if (effect.identity) return 'nothing';
	const parts: string[] = [];
	for (const kind of ['corner', 'edge', 'centre'] as const) {
		if (effect.cycles[kind].length === 0) continue;
		parts.push(`${kind}: ${effect.cycles[kind].map((c) => `(${c.join(' ')})`).join('')}`);
	}
	return parts.join('  ');
}
