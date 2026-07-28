/**
 * Tests for the piece model.
 *
 * The model earns its place by answering a question the sticker model cannot:
 * a 4×4's two wings of an edge carry identical colours, so swapping them changes
 * no sticker and is nonetheless exactly what a last-two-edges algorithm does.
 * Before trusting it on a 4×4, it has to reproduce facts about the 3×3 that are
 * already known independently — which is what the first block checks.
 */

import { describe, expect, it } from 'vitest';
import { describeEffect, effectSummary, pieceMap, slotsFor } from './pieces';
import { PUZZLE_SIZES, puzzle, type PuzzleSize } from './puzzle';

describe('the model agrees with what the 3×3 already knows', () => {
	it('counts the pieces every size has', () => {
		const counts = (size: PuzzleSize) => {
			const tally = { corner: 0, edge: 0, centre: 0 };
			for (const s of slotsFor(size)) tally[s.kind]++;
			return tally;
		};
		expect(counts(2)).toEqual({ corner: 8, edge: 0, centre: 0 });
		expect(counts(3)).toEqual({ corner: 8, edge: 12, centre: 6 });
		// A 4×4 has two wings per edge and four centres per face.
		expect(counts(4)).toEqual({ corner: 8, edge: 24, centre: 24 });
		// A 5×5 has three per edge — two wings and a midge — and nine centres.
		expect(counts(5)).toEqual({ corner: 8, edge: 36, centre: 54 });
	});

	it('a face turn is a four-cycle of corners and a four-cycle of edges', () => {
		const effect = describeEffect(3, 'R');
		expect(effect.cycles.corner.length).toBe(1);
		expect(effect.cycles.corner[0].length).toBe(4);
		expect(effect.cycles.edge.length).toBe(1);
		expect(effect.cycles.edge[0].length).toBe(4);
		expect(effect.moved.centre).toBe(0);
	});

	it('a T permutation is one corner three-cycle and one edge three-cycle', () => {
		// The defining property of the T perm, and a fact about the 3×3 that was
		// verified long before this file existed.
		const effect = describeEffect(3, "R U R' F' R U R' U' R' F R2 U' R'");
		expect(effect.moved.centre).toBe(0);
		expect(effect.cycles.corner.map((c) => c.length)).toEqual([3]);
		expect(effect.cycles.edge.map((c) => c.length)).toEqual([3]);
	});

	it('sune both twists and permutes, and the model says so', () => {
		// Worth stating because it is easy to assume otherwise: sune is not a pure
		// twist. It cycles three edges and swaps two pairs of corners as well.
		const effect = describeEffect(3, "R U R' U R U2 R'");
		expect(effect.identity).toBe(false);
		expect(effect.cycles.edge.map((c) => c.length)).toEqual([3]);
		expect(effect.moved.corner).toBe(4);
	});

	it('reads the superflip as moving nothing, which is the model’s blind spot', () => {
		// Every edge flipped in place, nothing permuted — a cube as far from solved
		// as a 3×3 gets, and the piece model calls it the identity because
		// orientation is deliberately not tracked. This test exists so that
		// limitation is written down and checked rather than discovered later by
		// someone trusting `identity` to mean "solved".
		const superflip = "R L U2 F U' D F2 R2 B2 L U2 F' B' U R2 D F2 U R2 U";
		expect(describeEffect(3, superflip).identity).toBe(true);
		expect(effectSummary(describeEffect(3, superflip))).toBe('nothing');
	});

	it('a rotation moves every piece to a different slot', () => {
		expect(describeEffect(3, 'x').moved.corner).toBe(8);
		expect(describeEffect(3, 'x').moved.centre).toBe(4);
	});
});

describe('it is a permutation, at every size', () => {
	it.each(PUZZLE_SIZES)('a %i×%i move sends each slot somewhere, once', (size: PuzzleSize) => {
		const slots = slotsFor(size);
		for (const name of puzzle(size).moveNames) {
			const to = pieceMap(size, name);
			expect(to.length, name).toBe(slots.length);
			expect(new Set(to).size, name).toBe(slots.length);
			// A piece can only land where a piece of its own kind fits.
			to.forEach((dest, from) =>
				expect(slots[dest].kind, `${name} ${from}`).toBe(slots[from].kind)
			);
		}
	});

	it.each(PUZZLE_SIZES)('doing and undoing puts every %i×%i piece back', (size: PuzzleSize) => {
		const alg = size === 2 ? "R U R' U'" : "R U R' U' F R2 U'";
		const inverse = alg
			.split(' ')
			.reverse()
			.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`))
			.join(' ');
		expect(describeEffect(size, `${alg} ${inverse}`).identity).toBe(true);
	});

	it('rejects notation the size does not have', () => {
		expect(() => pieceMap(4, 'M2')).toThrow();
		expect(() => pieceMap(2, '3Rw')).toThrow();
	});
});

describe('what it makes visible on a 4×4', () => {
	it('sees a wing swap the sticker model cannot', () => {
		// The parity algorithm exchanges two edge pairs. In colours that is four
		// stickers; in pieces it is two two-cycles of wings, which is the thing the
		// algorithm is actually named after.
		const effect = describeEffect(4, '2R2 U2 2R2 Uw2 2R2 Uw2 U2');
		expect(effect.moved.corner).toBe(0);
		expect(effect.cycles.edge.map((c) => c.length).sort()).toEqual([2, 2]);
	});

	it('shows that a slice commutator cannot reach a corner', () => {
		const effect = describeEffect(4, "2R 2U 2R' 2U'");
		expect(effect.moved.corner).toBe(0);
		expect(effect.moved.edge).toBe(0);
		expect(effect.cycles.centre.map((c) => c.length)).toEqual([3, 3]);
	});

	it('summarises an effect readably', () => {
		expect(effectSummary(describeEffect(3, 'R'))).toMatch(/^corner: \(.+\)\s+edge: \(.+\)$/);
		expect(effectSummary(describeEffect(3, "R U R' U'"))).toContain('corner:');
	});
});
