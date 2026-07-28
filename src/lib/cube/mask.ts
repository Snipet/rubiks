/**
 * Diagram geometry.
 *
 * Case pictures are *derived* from the algorithm, never stored alongside it, so a
 * diagram cannot drift out of sync with the moves underneath it. This module
 * turns a sticker state into the shapes a diagram component draws.
 *
 * Two layouts cover everything:
 *
 * - **flat** — the U face with the top strip of each side face folded outwards.
 *   This is the classic last-layer picture, right for OLL, PLL and cross cases.
 * - **iso** — an isometric view showing U, F and R. Right for F2L, where the
 *   interesting pieces live in the front-right slot.
 */

import { faceletsToCubie } from './cubie';
import { UNSET } from './facelets';
import { EDGE_FACELETS, U, type Face, type Facelets } from './types';

/** A sticker placed on a diagram grid. */
export interface FlatSticker {
	/** Facelet index in the underlying state. */
	index: number;
	/** Which face it belongs to. */
	face: Face;
	/** Grid column, 0..4. */
	col: number;
	/** Grid row, 0..4. */
	row: number;
	/** `top` stickers face upwards; `side` stickers are folded out. */
	kind: 'top' | 'side';
}

/**
 * The 5×5 last-layer layout, corners left empty:
 *
 * ```
 *      B3 B2 B1
 *   L1 U1 U2 U3 R3
 *   L2 U4 U5 U6 R2
 *   L3 U7 U8 U9 R1
 *      F1 F2 F3
 * ```
 *
 * The side strips read outwards from the U face, which is why B and R run
 * "backwards" relative to their own face numbering.
 */
export const FLAT_LAYOUT: readonly FlatSticker[] = [
	// U face, row-major. U1 is the up-back-left corner.
	...Array.from({ length: 9 }, (_, i) => ({
		index: i,
		face: U as Face,
		col: 1 + (i % 3),
		row: 1 + Math.floor(i / 3),
		kind: 'top' as const
	})),
	// B top row, drawn left→right as B3 B2 B1 (the cube's left is B3).
	{ index: 47, face: 5 as Face, col: 1, row: 0, kind: 'side' },
	{ index: 46, face: 5 as Face, col: 2, row: 0, kind: 'side' },
	{ index: 45, face: 5 as Face, col: 3, row: 0, kind: 'side' },
	// F top row, drawn left→right as F1 F2 F3.
	{ index: 18, face: 2 as Face, col: 1, row: 4, kind: 'side' },
	{ index: 19, face: 2 as Face, col: 2, row: 4, kind: 'side' },
	{ index: 20, face: 2 as Face, col: 3, row: 4, kind: 'side' },
	// L top row, drawn top→bottom as L1 L2 L3 (back→front).
	{ index: 36, face: 4 as Face, col: 0, row: 1, kind: 'side' },
	{ index: 37, face: 4 as Face, col: 0, row: 2, kind: 'side' },
	{ index: 38, face: 4 as Face, col: 0, row: 3, kind: 'side' },
	// R top row, drawn top→bottom as R3 R2 R1 (back→front).
	{ index: 11, face: 1 as Face, col: 4, row: 1, kind: 'side' },
	{ index: 10, face: 1 as Face, col: 4, row: 2, kind: 'side' },
	{ index: 9, face: 1 as Face, col: 4, row: 3, kind: 'side' }
];

/** The 9 U-face stickers of the flat layout. */
export const FLAT_TOP = FLAT_LAYOUT.filter((s) => s.kind === 'top');
/** The 12 folded-out side stickers of the flat layout. */
export const FLAT_SIDES = FLAT_LAYOUT.filter((s) => s.kind === 'side');

/**
 * The same layout at any size.
 *
 * A 2×2 last layer wants exactly this picture too — it is how every Ortega and
 * CLL sheet is drawn — so the shape above is generalised rather than duplicated.
 * A test checks that this reproduces {@link FLAT_LAYOUT} at size 3, which is why
 * the hand-written table above is kept: it is the thing being checked against.
 */
export function flatLayout(order: number): FlatSticker[] {
	const stride = order * order;
	const out: FlatSticker[] = [];
	for (let i = 0; i < stride; i++) {
		out.push({
			index: i,
			face: U as Face,
			col: 1 + (i % order),
			row: 1 + Math.floor(i / order),
			kind: 'top'
		});
	}
	for (let c = 0; c < order; c++) {
		// Each side strip is that face's top row, read outwards from U. B and R
		// therefore run backwards relative to their own row-major numbering.
		out.push({ index: 5 * stride + c, face: 5, col: order - c, row: 0, kind: 'side' });
		out.push({ index: 2 * stride + c, face: 2, col: 1 + c, row: order + 1, kind: 'side' });
		out.push({ index: 4 * stride + c, face: 4, col: 0, row: 1 + c, kind: 'side' });
		out.push({ index: 1 * stride + c, face: 1, col: order + 1, row: order - c, kind: 'side' });
	}
	return out;
}

/**
 * The three faces visible in the isometric view, each listed row-major as seen
 * from the front-top-right. A component maps `(face, row, col)` onto its
 * parallelogram.
 */
export const ISO_FACES: readonly { face: Face; indices: readonly number[] }[] = [
	{ face: 0, indices: [0, 1, 2, 3, 4, 5, 6, 7, 8] }, // U
	{ face: 2, indices: [18, 19, 20, 21, 22, 23, 24, 25, 26] }, // F
	{ face: 1, indices: [9, 10, 11, 12, 13, 14, 15, 16, 17] } // R
];

/** How a diagram should colour a given sticker. */
export type StickerPaint =
	| { kind: 'color'; face: Face }
	/** Deliberately not shown — "any colour will do here". */
	| { kind: 'ignored' }
	/** Oriented correctly (used by orientation-only views). */
	| { kind: 'oriented' }
	/** Present but not yet oriented. */
	| { kind: 'unoriented' }
	/** No colour assigned yet, in the sticker editor. */
	| { kind: 'blank' };

/** Which aspects of a case a diagram should communicate. */
export type DiagramView =
	/** Orientation only: yellow vs grey. The standard OLL picture. */
	| 'oll'
	/** Real colours plus permutation arrows. The standard PLL picture. */
	| 'pll'
	/** Real colours, last layer only, nothing hidden. */
	| 'last-layer'
	/** First two layers, isometric, with the rest greyed out. */
	| 'f2l'
	/** The D-layer cross, isometric. */
	| 'cross'
	/** Everything, in full colour. */
	| 'full';

/** Views drawn with the folded-out last-layer layout. */
export const FLAT_VIEWS: readonly DiagramView[] = ['oll', 'pll', 'last-layer'];

/**
 * Decide how to paint one sticker of a case state under a given view.
 */
export function paintSticker(
	state: Facelets,
	sticker: FlatSticker,
	view: DiagramView
): StickerPaint {
	const color = state[sticker.index];
	if (color === UNSET) return { kind: 'blank' };
	if (view === 'oll') {
		return color === U ? { kind: 'oriented' } : { kind: 'unoriented' };
	}
	return { kind: 'color', face: color as Face };
}

/** A permutation arrow between two stickers of the last layer. */
export interface CaseArrow {
	from: number;
	to: number;
	kind: 'corner' | 'edge';
	/** True when the pair simply swaps, so one double-headed arrow suffices. */
	swap: boolean;
}

/** U-layer corner slots and the facelet each one's arrow should anchor to. */
const U_CORNER_ANCHORS: readonly [slot: number, facelet: number][] = [
	[0, 8], // URF
	[1, 6], // UFL
	[2, 0], // ULB
	[3, 2] // UBR
];

/** U-layer edge slots and their anchor facelets. */
const U_EDGE_ANCHORS: readonly [slot: number, facelet: number][] = [
	[0, EDGE_FACELETS[0][0]], // UR → U6
	[1, EDGE_FACELETS[1][0]], // UF → U8
	[2, EDGE_FACELETS[2][0]], // UL → U4
	[3, EDGE_FACELETS[3][0]] // UB → U2
];

/**
 * Work out the arrows for a PLL diagram.
 *
 * A piece sitting in slot `s` belongs in slot `cp[s]`, so the arrow runs from
 * `s` to `cp[s]`. Mutual pairs collapse into a single double-headed arrow so an
 * ordinary two-corner swap reads as one line rather than two.
 */
export function caseArrows(state: Facelets): CaseArrow[] {
	const { cp, ep } = faceletsToCubie(state);
	const arrows: CaseArrow[] = [];

	const collect = (
		anchors: readonly [number, number][],
		perm: readonly number[],
		kind: 'corner' | 'edge'
	) => {
		const anchorOf = new Map(anchors);
		const done = new Set<number>();
		for (const [slot, facelet] of anchors) {
			if (done.has(slot)) continue;
			const home = perm[slot];
			if (home === slot) continue;
			const target = anchorOf.get(home);
			// Only draw arrows that stay inside the last layer.
			if (target === undefined) continue;
			const mutual = perm[home] === slot;
			arrows.push({ from: facelet, to: target, kind, swap: mutual });
			done.add(slot);
			if (mutual) done.add(home);
		}
	};

	collect(U_CORNER_ANCHORS, cp, 'corner');
	collect(U_EDGE_ANCHORS, ep, 'edge');
	return arrows;
}

/**
 * True when the last layer is fully oriented — every U-face sticker shows the U
 * colour. This is the boundary between OLL and PLL.
 */
export function lastLayerOriented(state: Facelets, order = 3): boolean {
	for (let i = 0; i < order * order; i++) if (state[i] !== U) return false;
	return true;
}

/**
 * Which pieces a view considers relevant. Everything else is drawn greyed out so
 * a learner's eye lands on the part of the cube the case is about.
 */
export function relevantFacelets(view: DiagramView): Set<number> | null {
	switch (view) {
		case 'oll':
		case 'pll':
		case 'last-layer':
			return new Set(FLAT_LAYOUT.map((s) => s.index));
		case 'cross':
			// D centre, the four D-layer edges, and their side stickers.
			return new Set([31, 28, 25, 30, 43, 32, 16, 34, 52]);
		case 'f2l':
			return null; // handled per-case by the caller, which knows the slot
		case 'full':
			return null;
	}
}
