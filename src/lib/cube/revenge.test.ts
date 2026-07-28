/**
 * Tests for reading a 4×4 as a 3×3.
 *
 * The claim being tested is the reduction method's own: with centres built and
 * wings paired, a 4×4 behaves like a 3×3. So the checks are, in order — a solved
 * puzzle reduces to a solved cube; outer turns keep it reduced and the reduction
 * tracks them exactly; inner turns break it; and the parity algorithms produce
 * precisely the position a 3×3 could never hold.
 */

import { describe, expect, it } from 'vitest';
import { algPerm } from './moves';
import { applyPerm as apply3, solvedFacelets } from './facelets';
import { applyPerm, puzzle } from './puzzle';
import { tokenise } from './puzzleState';
import {
	centresBuilt,
	isReduced,
	readRevenge,
	reduceToCube,
	WING_PAIRS,
	wingsPaired
} from './revenge';

const p4 = puzzle(4);
const play = (alg: string) => applyPerm(p4.solved(), p4.algPerm(tokenise(alg)));

describe('reading a 4×4', () => {
	it('finds twelve edges, each with two wings', () => {
		expect(WING_PAIRS.length).toBe(12);
		const seen = new Set(WING_PAIRS.flatMap(([a, b]) => [...a, ...b]));
		// Twelve edges, two wings each, two stickers a wing.
		expect(seen.size).toBe(48);
	});

	it('a solved puzzle is reduced and reduces to a solved cube', () => {
		const state = p4.solved();
		expect(centresBuilt(state)).toBe(true);
		expect(wingsPaired(state)).toBe(true);
		const cube = reduceToCube(state)!;
		expect(Array.from(cube)).toEqual(Array.from(solvedFacelets()));
	});

	it('outer turns keep it reduced, and the reduction follows them exactly', () => {
		// This is the reduction method's whole promise, stated as an equation: turn
		// the 4×4's outer layers, and the 3×3 you read off it is the 3×3 you would
		// have got by making the same turns on a real one.
		for (const alg of [
			"R U R' U'",
			"F R U R' U' F'",
			'R2 U2 R2',
			"L' U B2 D'",
			"R U R' F' R U R' U' R' F R2 U' R'"
		]) {
			const state = play(alg);
			expect(isReduced(state), alg).toBe(true);
			const viaFour = reduceToCube(state)!;
			const viaThree = apply3(solvedFacelets(), algPerm(alg));
			expect(Array.from(viaFour), alg).toEqual(Array.from(viaThree));
		}
	});

	it('an inner slice breaks the reduction', () => {
		expect(centresBuilt(play('2R'))).toBe(false);
		expect(isReduced(play('2R'))).toBe(false);
		expect(reduceToCube(play('2R'))).toBeNull();
	});

	it('a wide turn breaks both the centres and the pairing', () => {
		// Rw drags the slice along with the face, so the ring of centre stickers on
		// U, F, D and B moves too — a wide turn is not a gentler inner turn.
		const state = play('Rw');
		expect(centresBuilt(state)).toBe(false);
		expect(wingsPaired(state)).toBe(false);
	});

	it('names the stage a scramble is at', () => {
		expect(readRevenge(p4.solved()).stage).toBe('solved');
		expect(readRevenge(play("R U R' U'")).stage).toBe('as-a-cube');
		expect(readRevenge(play('2R')).stage).toBe('centres');
		expect(readRevenge(play('Rw')).stage).toBe('centres');
		// Two wide turns on the same axis put the centres back but leave the wings
		// scattered, which is the state the pairing step exists for.
		expect(readRevenge(play('Rw U2 Rw')).stage).toBe('centres');
	});
});

describe('parity', () => {
	// Both published versions of the parity fix. They are the same permutation;
	// the tests in the algorithm library check that too.
	const SHORT = '2R2 U2 2R2 Uw2 2R2 Uw2 U2';
	const CLASSIC = "2R2 B2 U2 2L U2 2R' U2 2R U2 F2 2R F2 2L' B2 2R2";

	it('both parity algorithms leave a puzzle that is still reduced', () => {
		// The point of a parity algorithm: it does not undo your reduction.
		for (const alg of [SHORT, CLASSIC]) {
			expect(isReduced(play(alg)), alg).toBe(true);
		}
	});

	it('and leave a 3×3 that could not exist', () => {
		for (const alg of [SHORT, CLASSIC]) {
			const reading = readRevenge(play(alg));
			expect(reading.stage, alg).toBe('parity');
			expect(reading.parityReason, alg).toBeTruthy();
		}
	});

	it('doing a parity algorithm twice puts it back to an ordinary cube', () => {
		const reading = readRevenge(play(`${SHORT} ${SHORT}`));
		expect(reading.stage).toBe('solved');
	});

	it('parity survives being solved as a 3×3 afterwards', () => {
		// You cannot turn your way out of it: whatever outer turns follow, the
		// reduced cube stays impossible until the parity itself is fixed.
		for (const after of ["R U R' U'", 'U2 R2 F2', "L' U' L"]) {
			expect(readRevenge(play(`${SHORT} ${after}`)).stage, after).toBe('parity');
		}
	});

	it('an ordinary scramble of the outer layers never reports parity', () => {
		for (const alg of ["R U R' U' F' U F", 'R2 U2 F2 D2 L2', "B U2 L' D R"]) {
			expect(readRevenge(play(alg)).stage, alg).toBe('as-a-cube');
		}
	});
});
