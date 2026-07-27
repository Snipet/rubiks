/**
 * Core cube types.
 *
 * Two representations are used throughout:
 *
 * 1. **Facelets** — 54 stickers, one byte each, holding the *colour* of that
 *    sticker expressed as the face whose centre carries that colour on a solved
 *    cube. This is what the UI paints and reads.
 * 2. **Cubies** — corner/edge permutation + orientation arrays. This is what the
 *    solvers and the state validator reason about.
 *
 * Facelet indices follow the widely used Kociemba ordering: the faces appear in
 * the order U, R, F, D, L, B and each face is read row-major as seen from
 * outside that face with U (or, for the U/D faces, B / F respectively) at the top:
 *
 * ```
 *              ┌──┬──┬──┐
 *              │ 0│ 1│ 2│
 *              ├──┼──┼──┤
 *              │ 3│ 4│ 5│           U
 *              ├──┼──┼──┤
 *              │ 6│ 7│ 8│
 *  ┌──┬──┬──┐  ├──┼──┼──┤  ┌──┬──┬──┐  ┌──┬──┬──┐
 *  │36│37│38│  │18│19│20│  │ 9│10│11│  │45│46│47│
 *  ├──┼──┼──┤  ├──┼──┼──┤  ├──┼──┼──┤  ├──┼──┼──┤
 *  │39│40│41│  │21│22│23│  │12│13│14│  │48│49│50│
 *  ├──┼──┼──┤  ├──┼──┼──┤  ├──┼──┼──┤  ├──┼──┼──┤
 *  │42│43│44│  │24│25│26│  │15│16│17│  │51│52│53│
 *  └──┴──┴──┘  ├──┼──┼──┤  └──┴──┴──┘  └──┴──┴──┘
 *      L       │27│28│29│      R            B
 *              ├──┼──┼──┤
 *              │30│31│32│           D
 *              ├──┼──┼──┤
 *              │33│34│35│
 *              └──┴──┴──┘
 * ```
 */

/** Face / colour index. The numeric values double as facelet colour values. */
export const U = 0;
export const R = 1;
export const F = 2;
export const D = 3;
export const L = 4;
export const B = 5;

export type Face = 0 | 1 | 2 | 3 | 4 | 5;

export const FACES: readonly Face[] = [U, R, F, D, L, B];
export const FACE_NAMES = ['U', 'R', 'F', 'D', 'L', 'B'] as const;
export type FaceName = (typeof FACE_NAMES)[number];

/** Number of stickers on a 3×3×3. */
export const N_FACELETS = 54;

/**
 * A full sticker state: 54 entries, each a {@link Face} value naming the colour.
 * Index 0..8 = U, 9..17 = R, 18..26 = F, 27..35 = D, 36..44 = L, 45..53 = B.
 */
export type Facelets = Uint8Array;

/** Corner slots, in the canonical order used by every corner-indexed array. */
export const CORNERS = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'] as const;
export type CornerName = (typeof CORNERS)[number];
export const URF = 0;
export const UFL = 1;
export const ULB = 2;
export const UBR = 3;
export const DFR = 4;
export const DLF = 5;
export const DBL = 6;
export const DRB = 7;

/** Edge slots, in the canonical order used by every edge-indexed array. */
export const EDGES = [
	'UR',
	'UF',
	'UL',
	'UB',
	'DR',
	'DF',
	'DL',
	'DB',
	'FR',
	'FL',
	'BL',
	'BR'
] as const;
export type EdgeName = (typeof EDGES)[number];
export const UR = 0;
export const UF = 1;
export const UL = 2;
export const UB = 3;
export const DR = 4;
export const DF = 5;
export const DL = 6;
export const DB = 7;
export const FR = 8;
export const FL = 9;
export const BL = 10;
export const BR = 11;

/**
 * Cubie-level state.
 *
 * - `cp[i]` — which corner cubie currently sits in slot `i`.
 * - `co[i]` — its twist in that slot: 0 = correctly oriented, 1 = twisted
 *   clockwise, 2 = twisted counter-clockwise, measured against the U/D sticker.
 * - `ep[i]` / `eo[i]` — the same for edges, with `eo` being 0 or 1 (flipped).
 */
export interface CubieState {
	cp: number[];
	co: number[];
	ep: number[];
	eo: number[];
}

/**
 * The three facelets of each corner slot, ordered so that the first entry is
 * the U or D sticker. Rotating the triple left by `co` gives the actual sticker
 * positions of the cubie's own (U/D, clockwise, counter-clockwise) stickers.
 */
export const CORNER_FACELETS: readonly (readonly [number, number, number])[] = [
	[8, 9, 20], // URF: U9 R1 F3
	[6, 18, 38], // UFL: U7 F1 L3
	[0, 36, 47], // ULB: U1 L1 B3
	[2, 45, 11], // UBR: U3 B1 R3
	[29, 26, 15], // DFR: D3 F9 R7
	[27, 44, 24], // DLF: D1 L9 F7
	[33, 53, 42], // DBL: D7 B9 L7
	[35, 17, 51] // DRB: D9 R9 B7
];

/** The colours of each corner cubie, in the same rotational order as above. */
export const CORNER_COLORS: readonly (readonly [Face, Face, Face])[] = [
	[U, R, F],
	[U, F, L],
	[U, L, B],
	[U, B, R],
	[D, F, R],
	[D, L, F],
	[D, B, L],
	[D, R, B]
];

/**
 * The two facelets of each edge slot. The first entry is the "primary" sticker
 * (U/D face for U/D-layer edges, F/B face for the middle-slice edges); an
 * unflipped edge shows its own primary colour there.
 */
export const EDGE_FACELETS: readonly (readonly [number, number])[] = [
	[5, 10], // UR: U6 R2
	[7, 19], // UF: U8 F2
	[3, 37], // UL: U4 L2
	[1, 46], // UB: U2 B2
	[32, 16], // DR: D6 R8
	[28, 25], // DF: D2 F8
	[30, 43], // DL: D4 L8
	[34, 52], // DB: D8 B8
	[23, 12], // FR: F6 R4
	[21, 41], // FL: F4 L6
	[50, 39], // BL: B6 L4
	[48, 14] // BR: B4 R6
];

/** The colours of each edge cubie, in the same order as {@link EDGE_FACELETS}. */
export const EDGE_COLORS: readonly (readonly [Face, Face])[] = [
	[U, R],
	[U, F],
	[U, L],
	[U, B],
	[D, R],
	[D, F],
	[D, L],
	[D, B],
	[F, R],
	[F, L],
	[B, L],
	[B, R]
];

/** Facelet index of each face's centre sticker. */
export const CENTER_FACELETS: readonly number[] = [4, 13, 22, 31, 40, 49];
