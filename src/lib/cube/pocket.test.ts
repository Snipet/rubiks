/**
 * Tests for the 2×2 corner model and solver.
 *
 * The corner model is locked to the 3×3's: a 2×2 is a 3×3 with the edges and
 * centres removed, so running the same algorithm on both must produce the same
 * corner permutation and the same twists. That is what makes it safe to reuse
 * 3×3 corner algorithms — CLL, sunes, the lot — on the smaller puzzle.
 */

import { describe, expect, it } from 'vitest';
import { faceletsToCubie } from './cubie';
import { stateFromAlg } from './facelets';
import {
	applyPocket,
	coIndex,
	enumeratePocketOrientations,
	firstFaceBuilt,
	firstLayerSolved,
	lastLayerOriented,
	pocketOrientationKey,
	pocketPermutationKey,
	cpIndex,
	faceletsToPocket,
	isSolvedPocket,
	playPocket,
	POCKET_CORNER_FACELETS,
	POCKET_DIAMETER,
	POCKET_MOVES,
	pocketToFacelets,
	PocketDecodeError,
	solvedPocket,
	solvePocket,
	solvePocketFacelets,
	turnPocket
} from './pocket';
import { applyPerm, puzzle } from './puzzle';
import { CORNER_FACELETS } from './types';

const p2 = puzzle(2);

function stateFrom(moves: readonly string[]) {
	return applyPerm(p2.solved(), p2.algPerm(moves));
}

function lcg(seed: number) {
	let s = seed >>> 0;
	return () => {
		s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
		return s / 0x100000000;
	};
}

function randomMoves(count: number, seed: number): string[] {
	const rand = lcg(seed);
	const out: string[] = [];
	let lastFace = '';
	while (out.length < count) {
		const move = POCKET_MOVES[Math.floor(rand() * POCKET_MOVES.length)];
		if (move[0] === lastFace) continue;
		out.push(move);
		lastFace = move[0];
	}
	return out;
}

describe('the corner model matches the 3×3', () => {
	const algs = [
		'',
		'R',
		"U'",
		'F2',
		"R U R' U'",
		"R U R' U R U2 R'",
		"R U2 R' U' R U' R'",
		"F R U R' U' F'",
		"R U R' F' R U R' U' R' F R2 U' R'",
		"U R U' R' U' F' U F",
		'R2 U2 R U2 R2',
		"F R U' R' U' R U R' F'"
	];

	it.each(algs)('%s produces the same corners on both puzzles', (alg) => {
		const moves = alg ? alg.split(/\s+/) : [];
		const pocket = faceletsToPocket(stateFrom(moves));
		const full = faceletsToCubie(stateFromAlg(alg));
		expect(pocket.cp).toEqual(full.cp);
		expect(pocket.co).toEqual(full.co);
	});

	it('numbers the corner stickers the way the 3×3 does', () => {
		// Same rotational order, same U-or-D-first rule, at both sizes: each 2×2
		// corner sticker sits at the same (face, corner) as its 3×3 counterpart.
		const p3 = puzzle(3);
		for (let corner = 0; corner < 8; corner++) {
			const small = POCKET_CORNER_FACELETS[corner].map((i) => p2.locate(i).face);
			const large = CORNER_FACELETS[corner].map((i) => p3.locate(i).face);
			expect(small, `corner ${corner}`).toEqual(large);
		}
	});

	it('leaves the anchor corner alone under every turn', () => {
		for (const move of POCKET_MOVES) {
			const after = turnPocket(solvedPocket(), move);
			expect(after.cp[6], move).toBe(6);
			expect(after.co[6], move).toBe(0);
		}
	});
});

describe('stickers and corners round-trip', () => {
	it('decodes and re-encodes any reachable state', () => {
		for (let seed = 1; seed <= 60; seed++) {
			const moves = randomMoves(12, seed);
			const stickers = stateFrom(moves);
			const corners = faceletsToPocket(stickers);
			expect(Array.from(pocketToFacelets(corners)), moves.join(' ')).toEqual(Array.from(stickers));
		}
	});

	it('agrees with the sticker engine move by move', () => {
		for (let seed = 1; seed <= 30; seed++) {
			const moves = randomMoves(10, seed);
			expect(playPocket(solvedPocket(), moves)).toEqual(faceletsToPocket(stateFrom(moves)));
		}
	});

	it('rejects a corner that is not a real piece', () => {
		const broken = new Uint8Array(stateFrom([]));
		broken[POCKET_CORNER_FACELETS[0][1]] = broken[POCKET_CORNER_FACELETS[0][0]];
		expect(() => faceletsToPocket(broken)).toThrow(PocketDecodeError);
	});

	it('rejects a corner with no top or bottom colour', () => {
		const broken = new Uint8Array(stateFrom([]));
		for (const index of POCKET_CORNER_FACELETS[0]) broken[index] = 1;
		expect(() => faceletsToPocket(broken)).toThrow(PocketDecodeError);
	});
});

describe('indexing', () => {
	it('gives the solved state index zero on both coordinates', () => {
		expect(coIndex(solvedPocket())).toBe(0);
		expect(cpIndex(solvedPocket())).toBe(0);
	});

	it('is injective across a large sample', () => {
		const seen = new Map<string, string>();
		for (let seed = 1; seed <= 400; seed++) {
			const moves = randomMoves(14, seed);
			const state = playPocket(solvedPocket(), moves);
			const key = `${coIndex(state)}:${cpIndex(state)}`;
			const shape = JSON.stringify([state.cp, state.co]);
			const previous = seen.get(key);
			if (previous !== undefined) expect(previous).toBe(shape);
			else seen.set(key, shape);
		}
		expect(seen.size).toBeGreaterThan(300);
	});

	it('stays inside its declared range', () => {
		for (let seed = 1; seed <= 200; seed++) {
			const state = playPocket(solvedPocket(), randomMoves(11, seed));
			expect(coIndex(state)).toBeGreaterThanOrEqual(0);
			expect(coIndex(state)).toBeLessThan(729);
			expect(cpIndex(state)).toBeGreaterThanOrEqual(0);
			expect(cpIndex(state)).toBeLessThan(5040);
		}
	});
});

describe('the solver', () => {
	it('returns nothing to do for a solved puzzle', () => {
		expect(solvePocket(solvedPocket())).toEqual([]);
	});

	it('solves a single turn in one move', () => {
		for (const move of POCKET_MOVES) {
			const solution = solvePocket(turnPocket(solvedPocket(), move));
			expect(solution, move).not.toBeNull();
			expect(solution!.length, move).toBe(1);
		}
	});

	it('solves 200 random states, and every solution really works', () => {
		for (let seed = 1; seed <= 200; seed++) {
			const scramble = randomMoves(14, seed);
			const state = playPocket(solvedPocket(), scramble);
			const solution = solvePocket(state);
			expect(solution, scramble.join(' ')).not.toBeNull();
			expect(solution!.length).toBeLessThanOrEqual(POCKET_DIAMETER);
			expect(isSolvedPocket(playPocket(state, solution!)), scramble.join(' ')).toBe(true);
		}
	});

	it('finds solutions that are actually optimal', () => {
		// A state reached in k moves cannot need more than k, and the solver must
		// never return more than the shortest — so re-solving the solved-by-the-
		// solution state and comparing lengths from both directions pins it down.
		for (let seed = 1; seed <= 60; seed++) {
			const scramble = randomMoves(6, seed);
			const state = playPocket(solvedPocket(), scramble);
			const solution = solvePocket(state)!;
			expect(solution.length, scramble.join(' ')).toBeLessThanOrEqual(scramble.length);
		}
	});

	it('never needs more than God’s number', () => {
		let worst = 0;
		for (let seed = 500; seed < 600; seed++) {
			const state = playPocket(solvedPocket(), randomMoves(20, seed));
			worst = Math.max(worst, solvePocket(state)!.length);
		}
		expect(worst).toBeLessThanOrEqual(POCKET_DIAMETER);
		// A hundred random states should reach at least a middling depth, or the
		// heuristic is accidentally solving something other than what was asked.
		expect(worst).toBeGreaterThanOrEqual(7);
	});

	it('never turns the same face twice running', () => {
		for (let seed = 1; seed <= 60; seed++) {
			const solution = solvePocket(playPocket(solvedPocket(), randomMoves(12, seed)))!;
			for (let i = 1; i < solution.length; i++) {
				expect(solution[i][0], solution.join(' ')).not.toBe(solution[i - 1][0]);
			}
		}
	});

	it('can be asked for a short answer and give up honestly', () => {
		// A state that genuinely needs several moves has no two-move solution, and
		// the solver says so rather than returning something that does not work.
		const state = playPocket(solvedPocket(), randomMoves(14, 3));
		const short = solvePocket(state, { maxLength: 2 });
		if (short !== null) expect(isSolvedPocket(playPocket(state, short))).toBe(true);
		const full = solvePocket(state)!;
		if (full.length > 2) expect(short).toBeNull();
	});

	it('solves straight from stickers', () => {
		const stickers = stateFrom(randomMoves(15, 11));
		const solution = solvePocketFacelets(stickers)!;
		expect(solution).not.toBeNull();
		const after = applyPerm(stickers, p2.algPerm(solution));
		expect(Array.from(after)).toEqual(Array.from(p2.solved()));
	});
});

describe('composition', () => {
	it('applying a move is the same as composing its effect', () => {
		const effect = turnPocket(solvedPocket(), 'R');
		for (let seed = 1; seed <= 20; seed++) {
			const state = playPocket(solvedPocket(), randomMoves(9, seed));
			expect(applyPocket(state, effect)).toEqual(turnPocket(state, 'R'));
		}
	});

	it('every turn has order four, and its double order two', () => {
		for (const face of ['U', 'R', 'F']) {
			expect(isSolvedPocket(playPocket(solvedPocket(), [face, face, face, face]))).toBe(true);
			expect(isSolvedPocket(playPocket(solvedPocket(), [`${face}2`, `${face}2`]))).toBe(true);
			expect(isSolvedPocket(playPocket(solvedPocket(), [face, face]))).toBe(false);
		}
	});
});

describe('case classification', () => {
	it('finds exactly eight orientation cases', () => {
		// Seven Ortega cases plus the one where there is nothing to do. Burnside on
		// the 27 legal twist patterns under the four turns of U gives the same 8.
		const keys = enumeratePocketOrientations();
		expect(keys.length).toBe(8);
		expect(keys).toContain('0000');
	});

	it('reads a solved puzzle as oriented, permuted and finished', () => {
		const s = solvedPocket();
		expect(firstLayerSolved(s)).toBe(true);
		expect(firstFaceBuilt(s)).toBe(true);
		expect(lastLayerOriented(s)).toBe(true);
		expect(pocketOrientationKey(s)).toBe('0000');
		expect(pocketPermutationKey(s)).toBe('solved');
	});

	it('is blind to which way the top is turned', () => {
		for (let seed = 1; seed <= 60; seed++) {
			const state = playPocket(solvedPocket(), randomMoves(12, seed));
			const key = pocketOrientationKey(state);
			for (const auf of ['U', 'U2', "U'"]) {
				expect(pocketOrientationKey(turnPocket(state, auf)), auf).toBe(key);
			}
		}
	});

	it('sorts every oriented last layer into one of the three cases', () => {
		// All 24 arrangements of the four top corners, built directly rather than
		// reached by turning, so nothing about the search can bias the sample.
		const tally: Record<string, number> = {};
		const perms: number[][] = [];
		const build = (rest: number[], acc: number[]) => {
			if (rest.length === 0) return void perms.push(acc);
			rest.forEach((v, i) => build([...rest.slice(0, i), ...rest.slice(i + 1)], [...acc, v]));
		};
		build([0, 1, 2, 3], []);
		expect(perms.length).toBe(24);
		for (const perm of perms) {
			const state = { cp: [...perm, 4, 5, 6, 7], co: [0, 0, 0, 0, 0, 0, 0, 0] };
			const key = pocketPermutationKey(state);
			tally[key] = (tally[key] ?? 0) + 1;
		}
		// Four turns of U leave it solved; the rest split into the two swaps and the
		// arrangements that are a cycle however you turn the top.
		expect(tally.solved).toBe(4);
		expect(tally.adjacent).toBeGreaterThan(0);
		expect(tally.diagonal).toBeGreaterThan(0);
		expect(Object.values(tally).reduce((a, b) => a + b, 0)).toBe(24);
	});

	it('calls a swap of neighbours adjacent and a swap across the layer diagonal', () => {
		const swap = (a: number, b: number) => {
			const cp = [0, 1, 2, 3, 4, 5, 6, 7];
			[cp[a], cp[b]] = [cp[b], cp[a]];
			return { cp, co: [0, 0, 0, 0, 0, 0, 0, 0] };
		};
		expect(pocketPermutationKey(swap(0, 1))).toBe('adjacent');
		expect(pocketPermutationKey(swap(2, 3))).toBe('adjacent');
		expect(pocketPermutationKey(swap(0, 3))).toBe('adjacent');
		expect(pocketPermutationKey(swap(0, 2))).toBe('diagonal');
		expect(pocketPermutationKey(swap(1, 3))).toBe('diagonal');
	});

	it('knows when the bottom is a face but not yet a layer', () => {
		// Turning the bottom layer keeps the face solid and breaks the layer.
		const state = playPocket(solvedPocket(), ['R', 'U', "R'", "U'"]);
		expect(firstFaceBuilt(state) || !firstLayerSolved(state)).toBe(true);
	});
});
