import { describe, expect, it } from 'vitest';
import { planSolve, solveFully } from './plan';
import { applyAlg, caseFromAlg, solvedFacelets, stateFromAlg } from '../facelets';
import { analyze } from '../ll';
import { randomScramble } from '../scramble';
import { parseAlg } from '../moves';
import { casesOfSet } from '$data/algorithms';
import type { SkillTier } from '$data/types';

const TIERS: SkillTier[] = ['beginner', 'intermediate', 'advanced', 'expert'];

/** Rank the stages so a test can assert that advice moves the solve forward. */
const STAGE_ORDER = [
	'scrambled',
	'cross',
	'first-layer-corners',
	'first-two-layers',
	'last-layer-orientation',
	'last-layer-permutation',
	'solved'
];

describe('reading the cube', () => {
	it('knows a solved cube is solved', () => {
		const plan = planSolve(solvedFacelets());
		expect(plan.analysis.solved).toBe(true);
		expect(plan.stepName).toBe('Solved');
		expect(plan.progress).toBe(1);
	});

	it('names the step for each stage', () => {
		expect(planSolve(stateFromAlg('F R U')).stepName).toBe('Cross');
		expect(planSolve(stateFromAlg("R U R'")).stepName).toBe('First two layers');
		expect(planSolve(caseFromAlg("R U R' U R U2 R'")).stepName).toBe('Orienting the last layer');
		expect(planSolve(caseFromAlg("R U R' U' R' F R2 U' R' U' R U R' F'")).stepName).toBe(
			'Permuting the last layer'
		);
	});

	it('reports progress that only ever increases', () => {
		const stages = [
			stateFromAlg('F R U B L D'),
			stateFromAlg("R U R'"),
			caseFromAlg("R U R' U R U2 R'"),
			caseFromAlg("R U R' U' R' F R2 U' R' U' R U R' F'"),
			solvedFacelets()
		];
		const progresses = stages.map((s) => planSolve(s).progress);
		for (let i = 1; i < progresses.length; i++) {
			expect(progresses[i], `step ${i}`).toBeGreaterThan(progresses[i - 1]);
		}
	});
});

describe('advice is always at least one usable option', () => {
	it('offers something for every stage of a real solve', () => {
		let state = stateFromAlg(randomScramble({ seed: 7, length: 25 }));
		for (let step = 0; step < 40; step++) {
			const plan = planSolve(state);
			if (plan.analysis.solved) break;
			const usable = plan.recommendations.filter((r) => r.moves);
			expect(usable.length, `nothing to suggest at ${plan.stepName}`).toBeGreaterThan(0);
			state = applyAlg(state, usable[0].moves!);
		}
	});

	it('every suggested algorithm parses', () => {
		for (let seed = 1; seed <= 15; seed++) {
			let state = stateFromAlg(randomScramble({ seed, length: 25 }));
			for (let step = 0; step < 30; step++) {
				const plan = planSolve(state);
				if (plan.analysis.solved) break;
				for (const rec of plan.recommendations) {
					if (rec.moves) expect(() => parseAlg(rec.moves!), `${rec.title}`).not.toThrow();
					for (const sub of rec.steps ?? []) {
						expect(() => parseAlg(sub.moves), `${rec.title} / ${sub.label}`).not.toThrow();
					}
				}
				const pick = plan.recommendations.find((r) => r.moves);
				if (!pick) break;
				state = applyAlg(state, pick.moves!);
			}
		}
	});

	it('never suggests a move sequence that undoes earlier progress', () => {
		for (let seed = 1; seed <= 10; seed++) {
			let state = stateFromAlg(randomScramble({ seed, length: 25 }));
			for (let step = 0; step < 30; step++) {
				const before = planSolve(state);
				if (before.analysis.solved) break;
				const pick = before.recommendations.find((r) => r.moves);
				if (!pick) break;
				const after = analyze(applyAlg(state, pick.moves!));
				// The stage must not regress.
				expect(
					STAGE_ORDER.indexOf(after.stage),
					`seed ${seed}: "${pick.title}" went from ${before.analysis.stage} to ${after.stage}`
				).toBeGreaterThanOrEqual(STAGE_ORDER.indexOf(before.analysis.stage));
				state = applyAlg(state, pick.moves!);
			}
		}
	});
});

describe('solving all the way through', () => {
	// Only run the full-solve check once the library actually covers the steps it
	// needs. Until F2L lands there is nothing to insert pairs with.
	const f2lReady = casesOfSet('f2l').length >= 41;

	it.runIf(f2lReady)('solves a hundred random cubes at every skill level', () => {
		for (const tier of TIERS) {
			for (let seed = 1; seed <= 25; seed++) {
				const scramble = randomScramble({ seed, length: 25 });
				const result = solveFully(stateFromAlg(scramble), tier);
				expect(result.solved, `${tier} failed on ${scramble}`).toBe(true);
			}
		}
	});

	it.runIf(f2lReady)('produces a solution a human could follow', () => {
		const result = solveFully(stateFromAlg(randomScramble({ seed: 42, length: 25 })), 'advanced');
		expect(result.solved).toBe(true);
		// A CFOP-shaped solve: cross, four pairs, OLL, PLL. Allow slack for
		// beginner-style splits and awkward cases, but it should not be hundreds.
		const moves = parseAlg(result.moves).length;
		expect(moves).toBeGreaterThan(30);
		expect(moves).toBeLessThan(160);
		expect(result.steps.length).toBeGreaterThanOrEqual(4);
	});

	it.runIf(f2lReady)('the reported move string really solves the cube', () => {
		for (let seed = 100; seed < 110; seed++) {
			const scramble = randomScramble({ seed, length: 25 });
			const result = solveFully(stateFromAlg(scramble), 'intermediate');
			const finished = applyAlg(stateFromAlg(scramble), result.moves);
			expect(analyze(finished).solved, `seed ${seed}`).toBe(true);
		}
	});
});
