/**
 * Tests for the diagram layout.
 *
 * The size-generic layout has to reproduce the hand-written 3×3 table exactly.
 * That table was checked against real OLL and PLL sheets when it was written, so
 * agreement with it is the whole warrant for drawing a 2×2 the same way.
 */

import { describe, expect, it } from 'vitest';
import { flatLayout, FLAT_LAYOUT, lastLayerOriented } from './mask';
import { puzzle } from './puzzle';
import { stateFromAlg } from './facelets';

function sortLayout(cells: { index: number }[]) {
	return [...cells].sort((a, b) => a.index - b.index);
}

describe('the flat last-layer layout', () => {
	it('reproduces the hand-written 3×3 table', () => {
		expect(sortLayout(flatLayout(3))).toEqual(sortLayout([...FLAT_LAYOUT]));
	});

	it.each([2, 3, 4, 5])('places every %i×%i last-layer sticker exactly once', (order) => {
		const cells = flatLayout(order);
		// The U face plus one strip from each of the four sides.
		expect(cells.length).toBe(order * order + 4 * order);
		expect(new Set(cells.map((c) => c.index)).size).toBe(cells.length);
		expect(new Set(cells.map((c) => `${c.col},${c.row}`)).size).toBe(cells.length);
	});

	it('fills the grid without straying outside it', () => {
		for (const order of [2, 3, 4, 5]) {
			for (const cell of flatLayout(order)) {
				expect(cell.col).toBeGreaterThanOrEqual(0);
				expect(cell.col).toBeLessThanOrEqual(order + 1);
				expect(cell.row).toBeGreaterThanOrEqual(0);
				expect(cell.row).toBeLessThanOrEqual(order + 1);
			}
		}
	});

	it('leaves the four corners of the grid empty', () => {
		for (const order of [2, 3, 4, 5]) {
			const taken = new Set(flatLayout(order).map((c) => `${c.col},${c.row}`));
			const outer = order + 1;
			for (const spot of [`0,0`, `${outer},0`, `0,${outer}`, `${outer},${outer}`]) {
				expect(taken.has(spot), `${order}×${order} ${spot}`).toBe(false);
			}
		}
	});

	it('only ever draws stickers that touch the top layer', () => {
		// A side strip must be the row of that face adjacent to U, which is the
		// face's own first row — indices 0…order-1 within the face.
		for (const order of [2, 3, 4, 5]) {
			const p = puzzle(order as 2 | 3 | 4 | 5);
			for (const cell of flatLayout(order)) {
				if (cell.kind === 'top') continue;
				const { face, row } = p.locate(cell.index);
				expect(face).toBe(cell.face);
				expect(row, `${order}×${order} index ${cell.index}`).toBe(0);
			}
		}
	});

	it('runs the side strips outwards from the U face', () => {
		// The B and R strips read backwards relative to their own numbering; F and
		// L read forwards. That is what makes the picture continuous round the U
		// face, and it is the detail easiest to get wrong.
		const cells = flatLayout(4);
		const strip = (face: number) =>
			cells
				.filter((c) => c.face === face && c.kind === 'side')
				.sort((a, b) => a.col - b.col || a.row - b.row)
				.map((c) => c.index - face * 16);
		expect(strip(5)).toEqual([3, 2, 1, 0]); // B, left to right
		expect(strip(2)).toEqual([0, 1, 2, 3]); // F, left to right
		expect(strip(4)).toEqual([0, 1, 2, 3]); // L, top to bottom
		expect(strip(1)).toEqual([3, 2, 1, 0]); // R, top to bottom
	});
});

describe('last-layer orientation', () => {
	it('reads a solved cube as oriented at every size', () => {
		for (const order of [2, 3, 4, 5] as const) {
			expect(lastLayerOriented(puzzle(order).solved(), order)).toBe(true);
		}
	});

	it('reads a sune as not oriented, and still says so on a 2×2', () => {
		expect(lastLayerOriented(stateFromAlg("R U R' U R U2 R'"), 3)).toBe(false);
		const p = puzzle(2);
		const sune = p.algPerm(['R', 'U', "R'", 'U', 'R', 'U2', "R'"]);
		const state = new Uint8Array(24);
		const solved = p.solved();
		for (let i = 0; i < 24; i++) state[i] = solved[sune[i]];
		expect(lastLayerOriented(state, 2)).toBe(false);
	});

	it('defaults to the 3×3 when no size is given', () => {
		expect(lastLayerOriented(stateFromAlg(''))).toBe(true);
	});
});
