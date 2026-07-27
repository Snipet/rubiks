/**
 * Conversion between the sticker view and the cubie view, plus the small
 * permutation utilities the solvers need.
 */

import {
	CORNER_COLORS,
	CORNER_FACELETS,
	D,
	EDGE_COLORS,
	EDGE_FACELETS,
	N_FACELETS,
	U,
	type CubieState,
	type Face,
	type Facelets
} from './types';
import { solvedFacelets } from './facelets';

export function solvedCubie(): CubieState {
	return {
		cp: [0, 1, 2, 3, 4, 5, 6, 7],
		co: [0, 0, 0, 0, 0, 0, 0, 0],
		ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	};
}

export function cloneCubie(s: CubieState): CubieState {
	return { cp: [...s.cp], co: [...s.co], ep: [...s.ep], eo: [...s.eo] };
}

export function cubieEqual(a: CubieState, b: CubieState): boolean {
	for (let i = 0; i < 8; i++) if (a.cp[i] !== b.cp[i] || a.co[i] !== b.co[i]) return false;
	for (let i = 0; i < 12; i++) if (a.ep[i] !== b.ep[i] || a.eo[i] !== b.eo[i]) return false;
	return true;
}

/** Raised when a sticker state does not describe a physically assembled cube. */
export class CubieDecodeError extends Error {
	constructor(
		message: string,
		readonly kind: 'corner' | 'edge',
		readonly slot: number
	) {
		super(message);
		this.name = 'CubieDecodeError';
	}
}

/**
 * Read cubie permutation and orientation out of a sticker state.
 *
 * Throws {@link CubieDecodeError} if any single cubie's stickers do not form a
 * real corner or edge of the puzzle — that is a stronger check than colour
 * counting and catches most mis-typed states immediately.
 */
export function faceletsToCubie(f: Facelets): CubieState {
	const cp = new Array<number>(8).fill(0);
	const co = new Array<number>(8).fill(0);
	const ep = new Array<number>(12).fill(0);
	const eo = new Array<number>(12).fill(0);

	for (let slot = 0; slot < 8; slot++) {
		const stickers = CORNER_FACELETS[slot];
		// The U/D sticker's position within the triple *is* the orientation.
		let ori = -1;
		for (let o = 0; o < 3; o++) {
			const c = f[stickers[o]];
			if (c === U || c === D) {
				if (ori !== -1) {
					throw new CubieDecodeError(
						`The corner at ${cornerLabel(slot)} shows two white/yellow stickers.`,
						'corner',
						slot
					);
				}
				ori = o;
			}
		}
		if (ori === -1) {
			throw new CubieDecodeError(
				`The corner at ${cornerLabel(slot)} has no white or yellow sticker.`,
				'corner',
				slot
			);
		}
		const a = f[stickers[(ori + 1) % 3]] as Face;
		const b = f[stickers[(ori + 2) % 3]] as Face;
		const found = CORNER_COLORS.findIndex((cols) => cols[1] === a && cols[2] === b);
		if (found === -1) {
			throw new CubieDecodeError(
				`The corner at ${cornerLabel(slot)} is not a real corner of the cube.`,
				'corner',
				slot
			);
		}
		cp[slot] = found;
		co[slot] = ori;
	}

	for (let slot = 0; slot < 12; slot++) {
		const [p, q] = EDGE_FACELETS[slot];
		const a = f[p] as Face;
		const b = f[q] as Face;
		let piece = EDGE_COLORS.findIndex((cols) => cols[0] === a && cols[1] === b);
		if (piece !== -1) {
			ep[slot] = piece;
			eo[slot] = 0;
			continue;
		}
		piece = EDGE_COLORS.findIndex((cols) => cols[0] === b && cols[1] === a);
		if (piece === -1) {
			throw new CubieDecodeError(
				`The edge at ${edgeLabel(slot)} is not a real edge of the cube.`,
				'edge',
				slot
			);
		}
		ep[slot] = piece;
		eo[slot] = 1;
	}

	return { cp, co, ep, eo };
}

/** Render a cubie state back to stickers. */
export function cubieToFacelets(s: CubieState): Facelets {
	const f = new Uint8Array(N_FACELETS);
	const solved = solvedFacelets();
	for (let face = 0; face < 6; face++) f[face * 9 + 4] = solved[face * 9 + 4];

	for (let slot = 0; slot < 8; slot++) {
		const stickers = CORNER_FACELETS[slot];
		const colors = CORNER_COLORS[s.cp[slot]];
		const ori = s.co[slot];
		for (let k = 0; k < 3; k++) f[stickers[(k + ori) % 3]] = colors[k];
	}
	for (let slot = 0; slot < 12; slot++) {
		const stickers = EDGE_FACELETS[slot];
		const colors = EDGE_COLORS[s.ep[slot]];
		const flip = s.eo[slot];
		f[stickers[0]] = colors[flip];
		f[stickers[1]] = colors[1 - flip];
	}
	return f;
}

/** Parity of a permutation: 0 for even, 1 for odd. */
export function permutationParity(perm: readonly number[]): 0 | 1 {
	let swaps = 0;
	const p = [...perm];
	for (let i = 0; i < p.length; i++) {
		while (p[i] !== i) {
			const j = p[i];
			[p[i], p[j]] = [p[j], p[i]];
			swaps++;
		}
	}
	return (swaps % 2) as 0 | 1;
}

const CORNER_LABELS = [
	'up-front-right',
	'up-front-left',
	'up-back-left',
	'up-back-right',
	'down-front-right',
	'down-front-left',
	'down-back-left',
	'down-back-right'
];
const EDGE_LABELS = [
	'up-right',
	'up-front',
	'up-left',
	'up-back',
	'down-right',
	'down-front',
	'down-left',
	'down-back',
	'front-right',
	'front-left',
	'back-left',
	'back-right'
];

export function cornerLabel(slot: number): string {
	return CORNER_LABELS[slot] ?? `corner ${slot}`;
}
export function edgeLabel(slot: number): string {
	return EDGE_LABELS[slot] ?? `edge ${slot}`;
}
