/**
 * Tests for the size-generic sticker layer.
 *
 * Same idea as `puzzle.test.ts`: at size 3 everything here must agree with the
 * verified 3×3 module, and the size-specific behaviour is checked on its own.
 */

import { describe, expect, it } from 'vitest';
import * as three from './facelets';
import { puzzle, PUZZLE_SIZES, type PuzzleSize } from './puzzle';
import { caseSetupFor, scrambleFor, scrambledStateFor, SCRAMBLE_LENGTH } from './puzzleScramble';
import * as ps from './puzzleState';
import { FACES, type Face } from './types';

/**
 * A trainer setup does not have to leave the case bolt upright — that is the
 * point of the random adjusting turns. What it must guarantee is that the case
 * is *the* case: solvable by turning the top, doing the algorithm, and turning
 * the top again. Anything weaker would let a broken setup pass.
 */
function solvableWithAuf(p: ReturnType<typeof puzzle>, setup: string, alg: string): boolean {
	const AUF = ['', 'U', 'U2', "U'"];
	const start = ps.applyAlgString(p, p.solved(), setup);
	for (const before of AUF) {
		for (const after of AUF) {
			const moves = [before, alg, after].filter(Boolean).join(' ');
			if (ps.equal(ps.applyAlgString(p, start, moves), p.solved())) return true;
		}
	}
	return false;
}

describe('at size 3 it agrees with the 3×3 module', () => {
	const p = puzzle(3);

	it('solved and blank states match', () => {
		expect(Array.from(ps.solved(p))).toEqual(Array.from(three.solvedFacelets()));
		expect(Array.from(ps.blank(p))).toEqual(Array.from(three.blankFacelets()));
	});

	it('the same 24 orientations, in the same order', () => {
		expect(ps.ORIENTATIONS).toEqual(three.ORIENTATIONS);
	});

	it('serialising round-trips against the 3×3 reader', () => {
		const state = three.stateFromAlg("R U R' F' R U R' U' R' F R2 U' R'");
		const text = ps.toString(p, state);
		expect(text).toBe(three.faceletsToString(state));
		expect(Array.from(ps.fromString(p, text))).toEqual(Array.from(state));
	});

	it('reorientation agrees', () => {
		for (const alg of ['', 'x', "y'", 'z2', "x y'", "x' y2"]) {
			const state = three.stateFromAlg(alg || 'U U2 U');
			expect(ps.reorientationFor(p, state), alg).toBe(three.reorientationFor(state));
		}
	});

	it('face helpers agree', () => {
		const state = three.stateFromAlg("R U R' U'");
		for (const face of FACES) {
			expect(ps.faceIndices(p, face)).toEqual(three.faceIndices(face));
			expect(ps.faceIsUniform(p, state, face)).toBe(three.faceIsUniform(state, face));
		}
		expect(ps.colorCounts(p, state)).toEqual(three.colorCounts(state));
		expect(ps.countUnset(p, ps.blank(p))).toBe(three.countUnset(three.blankFacelets()));
		expect(ps.isSolved(p, state)).toBe(three.isSolved(state));
		expect(ps.isSolvedAnyOrientation(p, three.stateFromAlg('x y'))).toBe(true);
	});
});

describe('anchors give every size a colour scheme it can be read against', () => {
	it('odd sizes anchor on the centres', () => {
		for (const size of [3, 5] as const) {
			const p = puzzle(size);
			const found = ps.anchors(p);
			expect(found.size).toBe(6);
			for (const [index, face] of found) expect(ps.faceOf(p, index)).toBe(face);
		}
	});

	it('a 2×2 anchors on the back-bottom-left corner', () => {
		const p = puzzle(2);
		const found = ps.anchors(p);
		expect(found.size).toBe(3);
		expect([...found.values()].sort()).toEqual([3, 4, 5]);
		// Those three stickers must genuinely belong to one corner, which means no
		// turn of the three scramble faces can touch any of them.
		for (const name of p.scrambleMoves) {
			const perm = p.perm(name);
			for (const index of found.keys()) expect(perm[index], `${name}`).toBe(index);
		}
	});

	it('a 4×4 has nothing that can be anchored', () => {
		expect(ps.anchors(puzzle(4)).size).toBe(0);
		// So a blank 4×4 is entirely unset, and that is the honest answer.
		expect(ps.countUnset(puzzle(4), ps.blank(puzzle(4)))).toBe(96);
	});

	it('a blank state is unset everywhere except its anchors', () => {
		for (const size of PUZZLE_SIZES) {
			const p = puzzle(size);
			const b = ps.blank(p);
			expect(ps.countUnset(p, b)).toBe(p.stickers - ps.anchors(p).size);
		}
	});
});

describe('reorientation without centres', () => {
	it('finds the rotation that brings a 2×2 home', () => {
		const p = puzzle(2);
		for (const alg of ['x', "y'", 'z2', "x y'", 'x2 y']) {
			const rotated = ps.applyAlgString(p, p.solved(), alg);
			const home = ps.reorientToStandard(p, rotated);
			expect(home, alg).not.toBeNull();
			expect(Array.from(home!), alg).toEqual(Array.from(p.solved()));
		}
	});

	it('brings a scrambled 2×2 back to its reference corner', () => {
		const p = puzzle(2);
		const { state } = scrambledStateFor(p, { seed: 7 });
		const rotated = ps.applyAlgString(p, state, 'z y');
		const home = ps.reorientToStandard(p, rotated);
		expect(home).not.toBeNull();
		// Scrambles only use U, R and F, so the reference corner never moved.
		for (const [index, face] of ps.anchors(p)) expect(home![index]).toBe(face);
	});

	it('says so when the reference stickers are nonsense', () => {
		const p = puzzle(3);
		const broken = ps.clone(p.solved());
		broken[p.index(0, 1, 1)] = 1; // two red centres
		expect(ps.reorientationFor(p, broken)).toBeNull();
		expect(ps.reorientToStandard(p, broken)).toBeNull();
	});

	it('cannot orient a 4×4, and does not pretend to', () => {
		// With nothing anchored, every way up is as canonical as any other.
		const p = puzzle(4);
		expect(ps.reorientationFor(p, p.solved())).toBe('');
	});
});

describe('notation understood at each size', () => {
	it('knows which algorithms a size can perform', () => {
		expect(ps.understands(puzzle(3), "R U R' U'")).toBe(true);
		expect(ps.understands(puzzle(3), 'M2 U M2')).toBe(true);
		expect(ps.understands(puzzle(4), 'M2 U M2')).toBe(false);
		expect(ps.understands(puzzle(2), "R U R' U'")).toBe(true);
		expect(ps.understands(puzzle(2), "Rw U Rw'")).toBe(true);
		expect(ps.understands(puzzle(4), "Rw U2 Rw' U2")).toBe(true);
	});

	it('tokenises the punctuation algorithm sheets use', () => {
		expect(ps.tokenise("[R U R', D2]")).toEqual(['R', 'U', "R'", 'D2']);
		expect(ps.tokenise('R U R’')).toEqual(['R', 'U', "R'"]);
	});
});

describe('scrambles', () => {
	it.each(PUZZLE_SIZES)('a %i×%i scramble is the right length and reachable', (size) => {
		const p = puzzle(size);
		const { scramble, moves, state } = scrambledStateFor(p, { seed: 1234 + size });
		expect(moves.length).toBe(SCRAMBLE_LENGTH[size]);
		expect(scramble.split(' ').length).toBe(moves.length);
		for (const name of moves) expect(p.parse(name), name).not.toBeNull();
		expect(ps.isSolvedAnyOrientation(p, state)).toBe(false);
	});

	it('never repeats the same layers twice running', () => {
		for (const size of PUZZLE_SIZES) {
			const p = puzzle(size);
			for (let seed = 1; seed <= 40; seed++) {
				const moves = scrambleFor(p, { seed }).split(' ');
				for (let i = 1; i < moves.length; i++) {
					const a = p.parse(moves[i - 1])!;
					const b = p.parse(moves[i])!;
					const same = a.face === b.face && a.from === b.from && a.to === b.to;
					expect(same, `${moves[i - 1]} ${moves[i]} on ${size}×${size}`).toBe(false);
				}
			}
		}
	});

	it('never builds a same-axis sandwich', () => {
		for (const size of PUZZLE_SIZES) {
			const p = puzzle(size);
			for (let seed = 1; seed <= 40; seed++) {
				const moves = scrambleFor(p, { seed }).split(' ');
				for (let i = 2; i < moves.length; i++) {
					const [a, b, c] = [moves[i - 2], moves[i - 1], moves[i]].map((n) => p.parse(n)!);
					const key = (t: typeof a) => `${t.face}:${t.from}:${t.to}`;
					const sameAxis = a.face % 3 === b.face % 3 && b.face % 3 === c.face % 3;
					expect(sameAxis && key(a) === key(c), moves.slice(i - 2, i + 1).join(' ')).toBe(false);
				}
			}
		}
	});

	it('is reproducible from a seed and varies without one', () => {
		const p = puzzle(4);
		expect(scrambleFor(p, { seed: 99 })).toBe(scrambleFor(p, { seed: 99 }));
		expect(scrambleFor(p, { seed: 99 })).not.toBe(scrambleFor(p, { seed: 100 }));
	});

	it('a 2×2 scramble only ever turns three faces', () => {
		const p = puzzle(2);
		for (let seed = 1; seed <= 30; seed++) {
			for (const name of scrambleFor(p, { seed }).split(' ')) {
				expect(['U', 'R', 'F']).toContain(name[0]);
			}
		}
	});

	it('a 4×4 scramble reaches the inner layers', () => {
		const p = puzzle(4);
		const moves = scrambleFor(p, { seed: 5 }).split(' ');
		expect(moves.some((m) => m.includes('w'))).toBe(true);
	});
});

describe('geometry matches the sticker model', () => {
	it.each(PUZZLE_SIZES)('every %i×%i sticker belongs to exactly one cubie', (size: PuzzleSize) => {
		const p = puzzle(size);
		const seen = new Set<number>();
		for (const cell of p.cubies) {
			for (const face of p.facesOf(cell)) {
				const index = p.stickerFacing(cell, face);
				expect(index).toBeGreaterThanOrEqual(0);
				expect(seen.has(index), `sticker ${index} seen twice`).toBe(false);
				seen.add(index);
			}
		}
		expect(seen.size).toBe(p.stickers);
	});

	it.each(PUZZLE_SIZES)('a %i×%i shows the right number of cubies', (size: PuzzleSize) => {
		// Everything but the hidden core: n³ minus the (n−2)³ inside.
		const inner = Math.max(0, size - 2);
		expect(puzzle(size).cubies.length).toBe(size ** 3 - inner ** 3);
	});

	it('the cubies a turn carries hold exactly the stickers it moves', () => {
		for (const size of PUZZLE_SIZES) {
			const p = puzzle(size);
			for (const name of p.moveNames) {
				if (name.endsWith('2') || name.endsWith("'")) continue;
				const turn = p.parse(name)!;
				const perm = p.perm(name);
				const carried = new Set<number>();
				for (const cell of p.cubies) {
					if (!p.inLayer(turn, cell)) continue;
					for (const face of p.facesOf(cell)) carried.add(p.stickerFacing(cell, face));
				}
				for (let i = 0; i < p.stickers; i++) {
					if (perm[i] !== i) {
						expect(carried.has(i), `${name} moved sticker ${i} from outside its layer`).toBe(true);
					}
				}
			}
		}
	});

	it('agrees with the 3×3 view geometry', async () => {
		const geometry = await import('./geometry');
		const p = puzzle(3);
		for (const c of geometry.CUBIES) {
			expect(p.facesOf(c).slice().sort()).toEqual(
				geometry.visibleFaces(c.x, c.y, c.z).slice().sort()
			);
			for (const face of geometry.visibleFaces(c.x, c.y, c.z)) {
				expect(p.stickerFacing(c, face), `${c.x},${c.y},${c.z} face ${face}`).toBe(
					geometry.faceletAt(face as Face, c.x, c.y, c.z)
				);
			}
		}
	});

	it('agrees with the 3×3 layer membership', async () => {
		const geometry = await import('./geometry');
		const p = puzzle(3);
		for (const base of Object.keys(geometry.TURN)) {
			const turn = p.parse(base);
			if (!turn) continue;
			for (const c of geometry.CUBIES) {
				expect(p.inLayer(turn, c), `${base} at ${c.x},${c.y},${c.z}`).toBe(
					geometry.inLayer(base, c)
				);
			}
		}
	});
});

describe('case setups are never rewritten', () => {
	it('inverts a 4×4 parity algorithm token for token', () => {
		// The bug this guards against: the 3×3 parser canonicalises `2R` to `Rw`,
		// which on a 4×4 is a different move — the slice versus the slice dragging
		// the face with it. A setup built that way does not produce the case.
		const p = puzzle(4);
		const alg = '2R2 U2 2R2 Uw2 2R2 Uw2 U2';
		const setup = caseSetupFor(p, alg, { seed: 5 });
		expect(setup).toContain('2R2');
		expect(setup).not.toContain('Rw2');

		// And it must actually set the case up.
		expect(solvableWithAuf(p, setup, alg), setup).toBe(true);
	});

	it('gives up rather than guess at notation the size does not have', () => {
		expect(caseSetupFor(puzzle(4), 'M2 U M2')).toBe('');
		expect(caseSetupFor(puzzle(2), "Rw U Rw'")).not.toBe('');
	});

	it('sets a 3×3 case up too', () => {
		const p = puzzle(3);
		for (let seed = 1; seed <= 20; seed++) {
			const alg = "R U R' U' R' F R2 U' R' U' R U R' F'";
			const setup = caseSetupFor(p, alg, { seed });
			expect(solvableWithAuf(p, setup, alg), `${setup} (seed ${seed})`).toBe(true);
		}
	});
});

describe('setup seams', () => {
	it('merges an adjusting turn that lands on the algorithm’s own first move', () => {
		// `U2` from the random adjust next to the inverse's leading `U2` should read
		// as nothing at all, not as `U2 U2`.
		const p = puzzle(4);
		for (let seed = 1; seed <= 40; seed++) {
			const setup = caseSetupFor(p, '2R2 U2 2R2 Uw2 2R2 Uw2 U2', { seed });
			if (!setup) continue;
			const names = setup.split(' ');
			for (let i = 1; i < names.length; i++) {
				const a = p.parse(names[i - 1])!;
				const b = p.parse(names[i])!;
				const same = a.face === b.face && a.from === b.from && a.to === b.to;
				expect(same, `${setup} (seed ${seed})`).toBe(false);
			}
		}
	});

	it('still sets the case up after merging', () => {
		const p = puzzle(4);
		const alg = '2R2 U2 2R2 Uw2 2R2 Uw2 U2';
		for (let seed = 1; seed <= 40; seed++) {
			const setup = caseSetupFor(p, alg, { seed });
			expect(solvableWithAuf(p, setup, alg), `${setup} (seed ${seed})`).toBe(true);
		}
	});
});
