/**
 * Reading a 4×4 as a 3×3.
 *
 * The whole of the reduction method is the claim that once the centres are built
 * and the wings are paired, a 4×4 *is* a 3×3 with fat pieces. This module makes
 * that claim literal: it checks the two conditions, and when they hold it builds
 * the actual 54-sticker 3×3 the puzzle has become — which means the solver, the
 * advice engine and the whole algorithm library work on a 4×4 without knowing
 * anything about one.
 *
 * It also makes parity precise. A reduced 4×4 can present a position no real
 * 3×3 could hold, and the way to detect that is not a special case: reduce it,
 * and ask the 3×3 validator whether the result is a cube that could exist. If it
 * says no, that is parity, and it is the only thing 3×3 technique cannot fix.
 */

import { puzzle } from './puzzle';
import { UNSET } from './facelets';
import { validateFacelets } from './validate';
import type { Face, Facelets } from './types';

const p4 = puzzle(4);

/** True when every face's four middle stickers show one colour. */
export function centresBuilt(state: Facelets): boolean {
	for (let face = 0; face < 6; face++) {
		const first = state[p4.index(face as Face, 1, 1)];
		if (first === UNSET) return false;
		for (const [r, c] of [
			[1, 2],
			[2, 1],
			[2, 2]
		]) {
			if (state[p4.index(face as Face, r, c)] !== first) return false;
		}
	}
	return true;
}

/**
 * The two wing slots of each edge, as sticker index pairs.
 *
 * Built from the geometry: an edge cubie is one with exactly two faces showing,
 * and on a 4×4 each edge of the puzzle holds two of them side by side.
 */
export const WING_PAIRS: readonly (readonly [readonly number[], readonly number[]])[] = (() => {
	const byEdge = new Map<string, number[][]>();
	for (const cell of p4.cubies) {
		const faces = p4.facesOf(cell);
		if (faces.length !== 2) continue;
		// Which edge of the puzzle this wing sits on: the two faces name it.
		const key = faces.slice().sort().join('-');
		const stickers = faces.map((f) => p4.stickerFacing(cell, f));
		const list = byEdge.get(key) ?? [];
		list.push(stickers);
		byEdge.set(key, list);
	}
	const out: [number[], number[]][] = [];
	for (const list of byEdge.values()) {
		if (list.length === 2) out.push([list[0], list[1]]);
	}
	return out;
})();

/** True when both wings of every edge show the same two colours the same way. */
export function wingsPaired(state: Facelets): boolean {
	for (const [a, b] of WING_PAIRS) {
		if (a.some((i) => state[i] === UNSET) || b.some((i) => state[i] === UNSET)) return false;
		if (state[a[0]] !== state[b[0]] || state[a[1]] !== state[b[1]]) return false;
	}
	return true;
}

/** True when the puzzle has been reduced: centres built and wings paired. */
export function isReduced(state: Facelets): boolean {
	return centresBuilt(state) && wingsPaired(state);
}

/**
 * The 3×3 a reduced 4×4 has become.
 *
 * One sticker is taken from each group: a corner is a corner, a centre block
 * becomes the centre, and either wing of a pair stands for the whole edge. The
 * choice of which wing does not matter, because the pair being together is
 * exactly what `wingsPaired` has already established.
 */
export function reduceToCube(state: Facelets): Facelets | null {
	if (!isReduced(state)) return null;
	const out = new Uint8Array(54);
	// A 3×3 row or column maps to the 4×4's first, second and last.
	const pick = [0, 1, 3];
	for (let face = 0; face < 6; face++) {
		for (let r = 0; r < 3; r++) {
			for (let c = 0; c < 3; c++) {
				out[face * 9 + r * 3 + c] = state[p4.index(face as Face, pick[r], pick[c])];
			}
		}
	}
	return out;
}

export type RevengeStage =
	'centres' | 'pairing' | 'parity' | 'as-a-cube' | 'solved' | 'not-a-puzzle';

export interface RevengeReading {
	stage: RevengeStage;
	centresBuilt: boolean;
	wingsPaired: boolean;
	/** The 3×3 it reduces to, once it is reduced. */
	cube: Facelets | null;
	/** Why the reduced cube is impossible, when it is. */
	parityReason?: string;
}

/** Work out where a 4×4 is in the reduction method. */
export function readRevenge(state: Facelets): RevengeReading {
	const centres = centresBuilt(state);
	const wings = wingsPaired(state);
	if (!centres) {
		return { stage: 'centres', centresBuilt: false, wingsPaired: wings, cube: null };
	}
	if (!wings) {
		return { stage: 'pairing', centresBuilt: true, wingsPaired: false, cube: null };
	}

	const cube = reduceToCube(state);
	if (!cube) {
		return { stage: 'not-a-puzzle', centresBuilt: centres, wingsPaired: wings, cube: null };
	}

	const check = validateFacelets(cube);
	if (!check.ok) {
		// A reduced 4×4 that does not make a legal 3×3 is exactly what parity is.
		// The validator's own words are more useful than a generic message,
		// because they name which piece group is impossible.
		return {
			stage: 'parity',
			centresBuilt: true,
			wingsPaired: true,
			cube,
			parityReason: check.issues[0]?.message
		};
	}

	const solved = cube.every((colour, i) => colour === Math.floor(i / 9));
	return {
		stage: solved ? 'solved' : 'as-a-cube',
		centresBuilt: true,
		wingsPaired: true,
		cube
	};
}
