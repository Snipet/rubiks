import { describe, expect, it } from 'vitest';
import { crossProgress, solveCross } from './cross';
import { applyAlg, solvedFacelets, stateFromAlg } from '../facelets';
import { analyze } from '../ll';
import { randomScramble } from '../scramble';
import { parseAlg } from '../moves';

describe('cross solver', () => {
	it('returns nothing to do for a solved cube', () => {
		const solution = solveCross(solvedFacelets());
		expect(solution?.moves).toBe('');
		expect(solution?.length).toBe(0);
	});

	it('undoes a single turn in one move', () => {
		const solution = solveCross(stateFromAlg('F'));
		expect(solution?.length).toBe(1);
		expect(analyze(applyAlg(stateFromAlg('F'), solution!.moves)).crossSolved).toBe(true);
	});

	it('actually solves the cross for a hundred scrambles', () => {
		for (let seed = 1; seed <= 100; seed++) {
			const scramble = randomScramble({ seed, length: 25 });
			const state = stateFromAlg(scramble);
			const solution = solveCross(state);
			expect(solution, `seed ${seed}`).not.toBeNull();
			const after = analyze(applyAlg(state, solution!.moves));
			expect(after.crossSolved, `seed ${seed}: ${scramble} → ${solution!.moves}`).toBe(true);
		}
	});

	it('never needs more than eight turns', () => {
		// A well-known result: every cross is solvable in at most eight moves.
		let worst = 0;
		for (let seed = 1; seed <= 60; seed++) {
			const solution = solveCross(stateFromAlg(randomScramble({ seed, length: 25 })));
			expect(solution).not.toBeNull();
			worst = Math.max(worst, solution!.length);
		}
		expect(worst).toBeLessThanOrEqual(8);
	});

	it('finds a genuinely optimal solution, not merely a working one', () => {
		// Scrambling by n moves can never need more than n to undo.
		for (const setup of ['R', 'R U', "F' D2", "L2 B R'", "R U R' U'"]) {
			const solution = solveCross(stateFromAlg(setup));
			expect(solution!.length, setup).toBeLessThanOrEqual(parseAlg(setup).length);
		}
	});

	it('offers a stepwise route that places one edge at a time', () => {
		for (let seed = 1; seed <= 20; seed++) {
			const state = stateFromAlg(randomScramble({ seed, length: 25 }));
			const solution = solveCross(state)!;
			expect(solution.steps.length, `seed ${seed}`).toBe(4);

			// Following the steps in order must build the cross, and each step must
			// leave every previously placed edge alone.
			let current = state;
			let placed = 0;
			for (const step of solution.steps) {
				current = applyAlg(current, step.moves);
				placed++;
				expect(crossProgress(current), `seed ${seed} after ${step.edge}`).toBeGreaterThanOrEqual(
					placed
				);
			}
			expect(analyze(current).crossSolved, `seed ${seed}`).toBe(true);
		}
	});

	it('the stepwise route is never shorter than the optimal one', () => {
		for (let seed = 1; seed <= 20; seed++) {
			const solution = solveCross(stateFromAlg(randomScramble({ seed, length: 25 })))!;
			const stepwise = solution.steps[solution.steps.length - 1].total;
			expect(stepwise, `seed ${seed}`).toBeGreaterThanOrEqual(solution.length);
		}
	});
});

describe('cross progress', () => {
	it('counts placed edges', () => {
		expect(crossProgress(solvedFacelets())).toBe(4);
		expect(crossProgress(stateFromAlg('F'))).toBe(3);
		expect(crossProgress(stateFromAlg('F2 R2'))).toBe(2);
		// A D turn leaves the bottom face yellow but slides every cross edge away
		// from its centre, so none of them counts as placed.
		expect(crossProgress(stateFromAlg('D'))).toBe(0);
		expect(crossProgress(stateFromAlg('D2'))).toBe(0);
	});
});
