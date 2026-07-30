/**
 * Filling in the stickers you did not see.
 *
 * A scanner shows you three faces at a time at best, and the tempting claim is
 * that the other three follow. Most of the time they do not, and the difference
 * matters: a solver handed a guess produces a confident answer to the wrong
 * question.
 *
 * ### What actually follows from what
 *
 * The centres are easy. There are six of them, they never move relative to each
 * other, and each is opposite a known colour — so seeing three centres gives you
 * all six.
 *
 * The rest is constraint propagation, and it is worth being precise about it. A
 * corner slot showing **two** of its three stickers is pinned down: exactly one
 * of the eight corner pieces carries those two colours in that arrangement, so
 * the third sticker follows. A slot showing **one** sticker is not pinned down by
 * itself — but once its neighbours are resolved, the pieces they used are no
 * longer available, and often only one candidate survives. That is the whole
 * method: assign what is forced, remove it from everyone else's options, repeat.
 *
 * With three faces scanned this fills in a good deal and leaves a good deal
 * unknown. The function says which, rather than guessing, and the scanner uses
 * that to ask for what it still needs.
 */

import { UNSET } from './facelets';
import {
	CORNER_COLORS,
	CORNER_FACELETS,
	CENTER_FACELETS,
	EDGE_COLORS,
	EDGE_FACELETS,
	FACES,
	type Face,
	type Facelets
} from './types';

export interface Deduction {
	/** The state with everything that follows filled in. */
	facelets: Facelets;
	/** Sticker indices still unknown after propagating everything. */
	unknown: number[];
	/** True when nothing is left unknown. */
	complete: boolean;
	/** Slots whose piece could not be pinned down, for explaining the gap. */
	ambiguous: { kind: 'corner' | 'edge'; slot: number; candidates: number }[];
}

/** The opposite face. The scheme is fixed: U–D, R–L, F–B, three apart. */
export function oppositeFace(face: Face): Face {
	return ((face + 3) % 6) as Face;
}

/**
 * Every way a piece could sit in a slot, as the colours it would show.
 *
 * A corner has three rotations and an edge two, so each slot has 24 candidate
 * placements before any sticker is known.
 */
interface Placement {
	piece: number;
	/** The colour each of the slot's stickers would show. */
	colours: Face[];
}

function cornerPlacements(): Placement[] {
	const out: Placement[] = [];
	for (let piece = 0; piece < 8; piece++) {
		const c = CORNER_COLORS[piece];
		for (let twist = 0; twist < 3; twist++) {
			out.push({
				piece,
				colours: [c[twist % 3], c[(twist + 1) % 3], c[(twist + 2) % 3]]
			});
		}
	}
	return out;
}

function edgePlacements(): Placement[] {
	const out: Placement[] = [];
	for (let piece = 0; piece < 12; piece++) {
		const c = EDGE_COLORS[piece];
		out.push({ piece, colours: [c[0], c[1]] });
		out.push({ piece, colours: [c[1], c[0]] });
	}
	return out;
}

const CORNER_PLACEMENTS = cornerPlacements();
const EDGE_PLACEMENTS = edgePlacements();

/**
 * Fill in every sticker that follows from the ones already known.
 *
 * Never guesses. A sticker is written only when exactly one possibility remains,
 * so the result is either right or marked unknown.
 */
export function deduce(input: Facelets): Deduction {
	const f = new Uint8Array(input);

	// --- centres -----------------------------------------------------------
	// Three seen gives six, because opposite centres are fixed by the scheme.
	for (const face of FACES) {
		const here = CENTER_FACELETS[face];
		const there = CENTER_FACELETS[oppositeFace(face)];
		if (f[here] !== UNSET && f[there] === UNSET) f[there] = oppositeFace(f[here] as Face);
	}

	// --- pieces ------------------------------------------------------------
	interface Slot {
		kind: 'corner' | 'edge';
		index: number;
		stickers: readonly number[];
		candidates: Placement[];
	}

	const slots: Slot[] = [
		...CORNER_FACELETS.map((stickers, index) => ({
			kind: 'corner' as const,
			index,
			stickers,
			candidates: CORNER_PLACEMENTS.slice()
		})),
		...EDGE_FACELETS.map((stickers, index) => ({
			kind: 'edge' as const,
			index,
			stickers,
			candidates: EDGE_PLACEMENTS.slice()
		}))
	];

	/** Drop placements that disagree with a sticker we can already see. */
	const narrowBySeen = (slot: Slot) => {
		slot.candidates = slot.candidates.filter((p) =>
			slot.stickers.every((sticker, i) => f[sticker] === UNSET || f[sticker] === p.colours[i])
		);
	};

	for (const slot of slots) narrowBySeen(slot);

	// Assign what is forced, remove the piece from *everyone else*, and go round
	// again — a resolved neighbour is often what makes the next one certain.
	//
	// "Everyone else" is the part worth stating: a slot must not exclude the piece
	// it has itself committed to, or its own candidate list empties on the next
	// pass and the deduction collapses.
	const owner = new Map<string, number>();
	const key = (slot: Slot) => `${slot.kind}:${slot.index}`;

	let progress = true;
	let rounds = 0;
	while (progress && rounds++ < 64) {
		progress = false;
		for (const slot of slots) {
			const mine = key(slot);
			const before = slot.candidates.length;

			// Pieces claimed by other slots of the same kind are unavailable here.
			const spokenFor = new Set(
				[...owner.entries()]
					.filter(([at]) => at !== mine && at.startsWith(slot.kind))
					.map(([, piece]) => piece)
			);
			slot.candidates = slot.candidates.filter((p) => !spokenFor.has(p.piece));
			narrowBySeen(slot);
			if (slot.candidates.length !== before) progress = true;

			// One piece across all remaining placements: this slot owns it.
			const pieces = new Set(slot.candidates.map((p) => p.piece));
			if (pieces.size === 1 && owner.get(mine) === undefined) {
				owner.set(mine, [...pieces][0]);
				progress = true;
			}

			// A single *placement* fixes the orientation too, so the stickers follow.
			if (slot.candidates.length === 1) {
				const only = slot.candidates[0];
				slot.stickers.forEach((sticker, i) => {
					if (f[sticker] === UNSET) {
						f[sticker] = only.colours[i];
						progress = true;
					}
				});
			}
		}
	}

	const unknown: number[] = [];
	for (let i = 0; i < f.length; i++) if (f[i] === UNSET) unknown.push(i);

	const ambiguous = slots
		.filter((slot) => slot.stickers.some((s) => f[s] === UNSET))
		.map((slot) => ({ kind: slot.kind, slot: slot.index, candidates: slot.candidates.length }));

	return { facelets: f, unknown, complete: unknown.length === 0, ambiguous };
}

/**
 * How many faces a scan still needs, and which are worth pointing the camera at.
 *
 * Ordered by how much each would resolve: the face opposite a scanned one adds
 * least, because its centre is already known and its pieces are the ones you have
 * seen least of.
 */
export function facesStillNeeded(state: Facelets): Face[] {
	const after = deduce(state);
	if (after.complete) return [];
	const scanned = new Set(
		FACES.filter((face) => {
			for (let i = 0; i < 9; i++) if (state[face * 9 + i] === UNSET) return false;
			return true;
		})
	);
	// Score each unscanned face by how many currently-unknown stickers it carries.
	const unknown = new Set(after.unknown);
	return FACES.filter((face) => !scanned.has(face))
		.map((face) => ({
			face,
			gain: Array.from({ length: 9 }, (_, i) => face * 9 + i).filter((i) => unknown.has(i)).length
		}))
		.filter((row) => row.gain > 0)
		.sort((a, b) => b.gain - a.gain)
		.map((row) => row.face);
}
