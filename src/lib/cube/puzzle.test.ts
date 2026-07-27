/**
 * Tests for the N×N engine.
 *
 * The first block is the one that matters. `puzzle(3)` is checked byte-for-byte
 * against the hand-derived 3×3 engine for every move the two share. That engine
 * is already pinned down by its own tests — superflip, published group orders,
 * hand-traced cycles — so agreement with it is not a restatement of the
 * geometry, it is an independent confirmation of it.
 *
 * Everything after that checks properties the 3×3 cannot: inner slices, deeper
 * wide turns, and the sizes with no fixed centres.
 */

import { describe, expect, it } from 'vitest';
import { BASE_MOVES, IDENTITY, algPerm as algPerm3, movePerm, type Perm } from './moves';
import {
	applyPerm,
	isSolvedState,
	PUZZLE_SIZES,
	puzzle,
	type Puzzle,
	type PuzzleSize
} from './puzzle';
import { B, D, F, L, R, U, type Face } from './types';

const SUFFIXES = ['', '2', "'"] as const;

function compose(p: Puzzle, ...names: string[]) {
	return p.algPerm(names);
}

function identityOf(p: Puzzle): Uint8Array {
	const out = new Uint8Array(p.stickers);
	for (let i = 0; i < p.stickers; i++) out[i] = i;
	return out;
}

function power(p: Puzzle, name: string, times: number) {
	return p.algPerm(new Array(times).fill(name));
}

/** A deterministic pseudo-random sequence, so a failure is always reproducible. */
function* lcg(seed: number) {
	let s = seed >>> 0;
	for (;;) {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		yield s / 0x100000000;
	}
}

function randomMoves(p: Puzzle, count: number, seed: number): string[] {
	const rng = lcg(seed);
	const out: string[] = [];
	for (let i = 0; i < count; i++) {
		const draw = rng.next().value ?? 0;
		out.push(p.scrambleMoves[Math.floor(draw * p.scrambleMoves.length)]);
	}
	return out;
}

function inverseNames(names: readonly string[]): string[] {
	return [...names]
		.reverse()
		.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
}

// ---------------------------------------------------------------------------
// The lock: puzzle(3) must reproduce the hand-derived engine exactly
// ---------------------------------------------------------------------------

describe('puzzle(3) agrees with the hand-derived 3×3 engine', () => {
	const p3 = puzzle(3);

	const shared = BASE_MOVES.flatMap((base) => SUFFIXES.map((s) => base + s));

	it.each(shared)('%s is byte-identical', (name) => {
		const derived = p3.perm(name);
		const authored = movePerm(name);
		expect(derived.length).toBe(54);
		expect(Array.from(derived)).toEqual(Array.from(authored));
	});

	it('covers every base move the 3×3 engine knows', () => {
		// If someone adds a generator to moves.ts, this test starts failing rather
		// than silently leaving the new move unchecked.
		expect(shared.length).toBe(BASE_MOVES.length * 3);
		for (const name of shared) expect(p3.parse(name)).not.toBeNull();
	});

	it('agrees on whole algorithms, not just single turns', () => {
		const algs = [
			"R U R' U'",
			"F R U R' U' F'",
			"R U2 R' U' R U' R'",
			'M2 U M2 U2 M2 U M2',
			"r U R' U' r' F R F'",
			"x R' U R' D2 R U' R' D2 R2",
			"y' L' U' L U' L' U2 L",
			"z2 D R' U' R D' R2 U R U' R' U' R2 U2"
		];
		for (const alg of algs) {
			const names = alg.split(/\s+/);
			expect(Array.from(p3.algPerm(names)), alg).toEqual(Array.from(algPerm3(alg)));
		}
	});

	it('produces the same solved state the 3×3 uses', () => {
		const solved = p3.solved();
		expect(solved.length).toBe(54);
		for (let i = 0; i < 54; i++) expect(solved[i]).toBe(Math.floor(i / 9));
	});

	it('has no sticker index the two engines disagree about', () => {
		// A stronger form of the per-move check: a long random 3×3 scramble run
		// through both engines must land on identical stickers.
		const names = randomMoves(p3, 200, 20250727);
		const viaPuzzle = applyPerm(p3.solved(), p3.algPerm(names));
		const viaMoves = applyPerm(p3.solved(), algPerm3(names.join(' ')) as Perm);
		expect(Array.from(viaPuzzle)).toEqual(Array.from(viaMoves));
	});
});

// ---------------------------------------------------------------------------
// Group properties that must hold at every size
// ---------------------------------------------------------------------------

describe.each(PUZZLE_SIZES)('%i×%i invariants', (size: PuzzleSize) => {
	const p = puzzle(size);
	const id = identityOf(p);

	it('has the right number of stickers', () => {
		expect(p.stickers).toBe(6 * size * size);
		expect(p.faceStride).toBe(size * size);
		expect(p.solved().length).toBe(p.stickers);
	});

	it('every move is a bijection', () => {
		for (const name of p.moveNames) {
			const perm = p.perm(name);
			expect(new Set(perm), name).toHaveProperty('size', p.stickers);
			for (const v of perm) expect(v).toBeLessThan(p.stickers);
		}
	});

	it('quarter turns have order four and half turns order two', () => {
		for (const name of p.moveNames) {
			if (name.endsWith('2')) {
				expect(Array.from(power(p, name, 2)), name).toEqual(Array.from(id));
			} else {
				expect(Array.from(power(p, name, 4)), name).toEqual(Array.from(id));
				expect(Array.from(power(p, name, 2)), name).not.toEqual(Array.from(id));
			}
		}
	});

	it('a turn and its inverse cancel', () => {
		for (const name of p.moveNames) {
			if (name.endsWith('2') || name.endsWith("'")) continue;
			expect(Array.from(compose(p, name, `${name}'`)), name).toEqual(Array.from(id));
			expect(Array.from(compose(p, `${name}'`, name)), name).toEqual(Array.from(id));
		}
	});

	it('a half turn is the quarter turn done twice', () => {
		for (const name of p.moveNames) {
			if (name.endsWith('2') || name.endsWith("'")) continue;
			expect(Array.from(power(p, name, 2)), name).toEqual(Array.from(p.perm(`${name}2`)));
			expect(Array.from(power(p, name, 3)), name).toEqual(Array.from(p.perm(`${name}'`)));
		}
	});

	it('opposite faces commute', () => {
		for (const [a, b] of [
			['U', 'D'],
			['R', 'L'],
			['F', 'B']
		]) {
			expect(Array.from(compose(p, a, b)), `${a}${b}`).toEqual(Array.from(compose(p, b, a)));
		}
	});

	it('an outer turn moves exactly the stickers in its layer', () => {
		// The face itself turns — every sticker on it moves except the one true
		// centre an odd size has — and the ring of side stickers goes round.
		const expected = size * size - (size % 2) + 4 * size;
		for (const face of ['U', 'R', 'F', 'D', 'L', 'B']) {
			const perm = p.perm(face);
			let moved = 0;
			for (let i = 0; i < p.stickers; i++) if (perm[i] !== i) moved++;
			expect(moved, face).toBe(expected);
		}
	});

	it('a rotation leaves every face a single colour', () => {
		for (const r of ['x', 'y', 'z', "x'", 'y2', "z'"]) {
			expect(isSolvedState(p, applyPerm(p.solved(), p.perm(r))), r).toBe(true);
		}
	});

	it('turning every layer of a face is the same as rotating the cube', () => {
		// `3Rw` on a 3×3, `4Rw` on a 4×4: nothing is left behind to turn against.
		const all = `${size}Rw`;
		expect(Array.from(p.perm(all)), all).toEqual(Array.from(p.perm('x')));
		expect(Array.from(p.perm(`${size}Uw`))).toEqual(Array.from(p.perm('y')));
		expect(Array.from(p.perm(`${size}Fw`))).toEqual(Array.from(p.perm('z')));
	});

	it('index and locate are inverses', () => {
		for (let i = 0; i < p.stickers; i++) {
			const { face, row, col } = p.locate(i);
			expect(p.index(face, row, col)).toBe(i);
		}
	});

	it('a scramble followed by its inverse returns to solved', () => {
		const names = randomMoves(p, 60, 4242 + size);
		const state = applyPerm(
			applyPerm(p.solved(), p.algPerm(names)),
			p.algPerm(inverseNames(names))
		);
		expect(Array.from(state)).toEqual(Array.from(p.solved()));
	});

	it('a scramble does not accidentally solve the puzzle', () => {
		const names = randomMoves(p, 40, 99 + size);
		expect(isSolvedState(p, applyPerm(p.solved(), p.algPerm(names)))).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// Layer arithmetic — the part the 3×3 could never exercise
// ---------------------------------------------------------------------------

describe('wide turns are their layers stacked', () => {
	it.each([3, 4, 5] as const)('on a %i×%i', (size) => {
		const p = puzzle(size);
		// `Rw` is the outer layer plus the second; `3Rw` adds the third.
		expect(Array.from(p.perm('Rw'))).toEqual(Array.from(compose(p, 'R', '2R')));
		if (size >= 3) {
			expect(Array.from(p.perm('3Rw'))).toEqual(Array.from(compose(p, 'R', '2R', '3R')));
		}
		// Distinct layers of the same axis never interfere, so they commute.
		expect(Array.from(compose(p, 'R', '2R'))).toEqual(Array.from(compose(p, '2R', 'R')));
	});

	it('a bare inner slice leaves both outer faces alone', () => {
		const p = puzzle(5);
		const perm = p.perm('2R');
		// Only the ring of side stickers moves: nothing on the R or L face at all.
		for (let i = 0; i < p.stickers; i++) {
			const face = p.locate(i).face;
			if (face === R || face === L) expect(perm[i], `sticker ${i}`).toBe(i);
		}
		let moved = 0;
		for (let i = 0; i < p.stickers; i++) if (perm[i] !== i) moved++;
		expect(moved).toBe(4 * 5);
	});

	it('lowercase is wide', () => {
		const p = puzzle(4);
		for (const [lower, wide] of [
			['r', 'Rw'],
			['u', 'Uw'],
			['f', 'Fw'],
			['d', 'Dw'],
			['l', 'Lw'],
			['b', 'Bw']
		]) {
			expect(Array.from(p.perm(lower)), lower).toEqual(Array.from(p.perm(wide)));
		}
	});
});

describe('notation each size actually has', () => {
	it('rejects slices on even sizes', () => {
		for (const size of [2, 4] as const) {
			const p = puzzle(size);
			for (const name of ['M', 'E', 'S', "M'", 'E2']) {
				expect(p.parse(name), `${name} on ${size}×${size}`).toBeNull();
			}
			expect(() => p.perm('M')).toThrow();
		}
	});

	it('accepts slices on odd sizes and lines them up with the wide turns', () => {
		for (const size of [3, 5] as const) {
			const p = puzzle(size);
			const middle = (size + 1) / 2;
			// M is the middle layer turned the way L goes.
			expect(Array.from(p.perm('M')), `M on ${size}`).toEqual(Array.from(p.perm(`${middle}L`)));
			expect(Array.from(p.perm('E')), `E on ${size}`).toEqual(Array.from(p.perm(`${middle}D`)));
			expect(Array.from(p.perm('S')), `S on ${size}`).toEqual(Array.from(p.perm(`${middle}F`)));
		}
	});

	it('rejects depths the puzzle does not have', () => {
		expect(puzzle(2).parse('3Rw')).toBeNull();
		expect(puzzle(3).parse('4Rw')).toBeNull();
		expect(puzzle(4).parse('5R')).toBeNull();
		expect(puzzle(5).parse('6R')).toBeNull();
	});

	it('rejects nonsense', () => {
		const p = puzzle(3);
		for (const name of ['', 'Q', 'R3', "R''", 'Rww', 'R22', 'RU']) {
			expect(p.parse(name), name).toBeNull();
		}
	});

	it('offers no wide turns on a 2×2 and no slices on even sizes', () => {
		expect(puzzle(2).moveNames.some((n) => n.includes('w'))).toBe(false);
		expect(puzzle(4).moveNames.some((n) => /^[MES]/.test(n))).toBe(false);
		expect(puzzle(3).moveNames).toContain('Rw');
		expect(puzzle(4).moveNames).toContain('Rw');
	});

	it('offers no wide turn that leaves only one layer behind', () => {
		// `3Rw` on a 4×4 turns three of four layers, which is `x` with the last one
		// put back — a name for something the list already says another way. The
		// two-layer wide is exempt: it is standard notation at every size.
		for (const size of PUZZLE_SIZES) {
			const p = puzzle(size);
			for (const name of p.moveNames) {
				if (!name.includes('w')) continue;
				const layers = p.parse(name)!.to + 1;
				expect(layers === 2 || layers <= size - 2, `${name} on ${size}×${size}`).toBe(true);
			}
		}
		expect(puzzle(4).moveNames).not.toContain('3Rw');
		expect(puzzle(5).moveNames).toContain('3Rw');
	});

	it('still turns deeper layers when asked directly', () => {
		// Not offered is not the same as not supported: an alg from elsewhere that
		// writes `3Rw` must still work.
		const p = puzzle(4);
		expect(Array.from(p.perm('3Rw'))).toEqual(Array.from(p.algPerm(['x', 'L'])));
	});

	it('scrambles a 2×2 with three faces only, because it has no fixed centres', () => {
		const p = puzzle(2);
		expect(p.hasFixedCentres).toBe(false);
		expect(new Set(p.scrambleMoves.map((m) => m[0]))).toEqual(new Set(['U', 'R', 'F']));
	});

	it('knows which sizes have a fixed centre', () => {
		expect(puzzle(3).hasFixedCentres).toBe(true);
		expect(puzzle(5).hasFixedCentres).toBe(true);
		expect(puzzle(4).hasFixedCentres).toBe(false);
	});
});

describe('centres behave the way the size demands', () => {
	it('odd sizes keep their six centre stickers pinned under every outer turn', () => {
		for (const size of [3, 5] as const) {
			const p = puzzle(size);
			const mid = (size - 1) / 2;
			const centres = ([U, R, F, D, L, B] as Face[]).map((f) => p.index(f, mid, mid));
			for (const name of ['U', 'R', 'F', 'D', 'L', 'B', "U'", 'R2']) {
				const perm = p.perm(name);
				for (const c of centres) expect(perm[c], `${name} moved centre ${c}`).toBe(c);
			}
		}
	});

	it('even sizes have no pinned sticker at all', () => {
		for (const size of [2, 4] as const) {
			const p = puzzle(size);
			// Every sticker is moved by at least one of the six outer turns.
			const pinned = new Set<number>();
			for (let i = 0; i < p.stickers; i++) pinned.add(i);
			for (const name of ['U', 'R', 'F', 'D', 'L', 'B']) {
				const perm = p.perm(name);
				for (let i = 0; i < p.stickers; i++) if (perm[i] !== i) pinned.delete(i);
			}
			expect(pinned.size, `${size}×${size}`).toBe(0);
		}
	});
});

describe('known orders', () => {
	/** How many times an algorithm must repeat before the puzzle comes back. */
	function orderOf(p: Puzzle, alg: string, limit = 5000): number {
		const names = alg.split(/\s+/);
		const step = p.algPerm(names);
		let acc = step;
		for (let n = 1; n <= limit; n++) {
			if (Array.from(acc).every((v, i) => v === i)) return n;
			const merged = new Uint8Array(p.stickers);
			for (let i = 0; i < p.stickers; i++) merged[i] = acc[step[i]];
			acc = merged;
		}
		throw new Error(`${alg} did not close inside ${limit} repetitions`);
	}

	it('the sexy move closes after six at every size', () => {
		// True on a 3×3 and true on the bigger ones for the same reason: the outer
		// layers are all it touches, and the centre blocks it turns it turns back.
		for (const size of PUZZLE_SIZES) {
			expect(orderOf(puzzle(size), "R U R' U'"), `${size}×${size}`).toBe(6);
		}
	});

	it('R U closes after 105 on a 3×3 and after 15 on a 2×2', () => {
		// The classic 105 factors as lcm(15, 7): the corners come back after 15 and
		// the edges after 7. A 2×2 is the corners on their own, so it must be 15 —
		// and that is a real check, because the 2×2 corner permutation comes out of
		// the same geometry as the 3×3 one rather than being copied from it.
		expect(orderOf(puzzle(3), 'R U')).toBe(105);
		expect(orderOf(puzzle(2), 'R U')).toBe(15);
	});

	it('R U on the bigger sizes is a multiple of the 3×3 answer', () => {
		// Corners and midges repeat on the 3×3's schedule; the wing orbits the big
		// cubes add bring in a factor of four. These two numbers are measured, not
		// derived — they are here to pin the engine down, so a refactor that
		// quietly changed a layer boundary could not slip past.
		expect(orderOf(puzzle(4), 'R U')).toBe(420);
		expect(orderOf(puzzle(5), 'R U')).toBe(420);
		expect(420 % 105).toBe(0);
	});
});

describe('memoisation does not leak between sizes', () => {
	it('returns the same instance for the same size', () => {
		expect(puzzle(4)).toBe(puzzle(4));
		expect(puzzle(4)).not.toBe(puzzle(5));
	});

	it('keeps permutation lengths separate', () => {
		expect(puzzle(2).perm('R').length).toBe(24);
		expect(puzzle(3).perm('R').length).toBe(54);
		expect(puzzle(4).perm('R').length).toBe(96);
		expect(puzzle(5).perm('R').length).toBe(150);
	});

	it('never hands back the shared identity as a move', () => {
		const p = puzzle(3);
		expect(Array.from(p.perm('U'))).not.toEqual(Array.from(IDENTITY));
	});
});
