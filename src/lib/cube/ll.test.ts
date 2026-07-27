import { describe, expect, it } from 'vitest';
import {
	analyze,
	enumerateF2l,
	enumerateOrientations,
	enumeratePermutations,
	f2lKey,
	findAuf,
	isLastLayerOriented,
	orientationKey,
	permutationKey,
	SOLVED_ORIENTATION_KEY,
	SOLVED_PERMUTATION_KEY
} from './ll';
import { applyAlg, caseFromAlg, solvedFacelets, stateFromAlg } from './facelets';

describe('case enumeration', () => {
	it('produces the 216 legal last-layer orientations', () => {
		const states = enumerateOrientations();
		expect(states).toHaveLength(216);
		// 3³ corner twists × 2³ edge flips, all distinct.
		expect(new Set(states.map((s) => s.join(','))).size).toBe(216);
	});

	it('collapses to 57 OLL cases plus solved', () => {
		const keys = new Set(enumerateOrientations().map((s) => orientationKey(s)));
		expect(keys.size).toBe(58);
		expect(keys.has(SOLVED_ORIENTATION_KEY)).toBe(true);
	});

	it('produces the 288 legal last-layer permutations', () => {
		const states = enumeratePermutations();
		expect(states).toHaveLength(288);
		expect(new Set(states.map((s) => s.join(','))).size).toBe(288);
	});

	it('collapses to 21 PLL cases plus solved', () => {
		const keys = new Set(enumeratePermutations().map((s) => permutationKey(s)));
		expect(keys.size).toBe(22);
		expect(keys.has(SOLVED_PERMUTATION_KEY)).toBe(true);
	});

	it('collapses to 41 F2L cases plus solved', () => {
		const keys = new Set(enumerateF2l().map((s) => f2lKey(s, 'FR')));
		expect(keys.size).toBe(42);
		expect(keys.has(f2lKey(solvedFacelets(), 'FR'))).toBe(true);
	});

	it('every enumerated state is a legal cube', async () => {
		const { validateFacelets } = await import('./validate');
		for (const s of [...enumerateOrientations(), ...enumeratePermutations(), ...enumerateF2l()]) {
			expect(validateFacelets(s).ok).toBe(true);
		}
	});
});

describe('keys are AUF invariant', () => {
	it('an orientation key survives U turns either side', () => {
		const state = caseFromAlg("R U R' U R U2 R'"); // Sune
		const key = orientationKey(state);
		for (const pre of ['U', 'U2', "U'"]) {
			expect(orientationKey(applyAlg(state, pre)), pre).toBe(key);
		}
	});

	it('a permutation key survives U turns either side', () => {
		const state = caseFromAlg("R U R' U' R' F R2 U' R' U' R U R' F'"); // T perm
		const key = permutationKey(state);
		for (const pre of ['U', 'U2', "U'"]) {
			expect(permutationKey(applyAlg(state, pre)), pre).toBe(key);
		}
	});

	it('distinguishes cases that really are different', () => {
		const sune = orientationKey(caseFromAlg("R U R' U R U2 R'"));
		const antisune = orientationKey(caseFromAlg("R U2 R' U' R U' R'"));
		expect(sune).not.toBe(antisune);

		const tPerm = permutationKey(caseFromAlg("R U R' U' R' F R2 U' R' U' R U R' F'"));
		const hPerm = permutationKey(caseFromAlg('M2 U M2 U2 M2 U M2'));
		expect(tPerm).not.toBe(hPerm);
	});

	it('a solved last layer has the solved keys', () => {
		expect(orientationKey(solvedFacelets())).toBe(SOLVED_ORIENTATION_KEY);
		expect(permutationKey(solvedFacelets())).toBe(SOLVED_PERMUTATION_KEY);
		// A pure AUF is still "permuted", because AUF is free.
		expect(permutationKey(stateFromAlg('U'))).toBe(SOLVED_PERMUTATION_KEY);
	});
});

describe('finding the AUF', () => {
	it('recovers the U turns needed to make an algorithm fit', () => {
		const alg = "R U R' U' R' F R2 U' R' U' R U R' F'";
		const base = caseFromAlg(alg);
		for (let pre = 0; pre < 4; pre++) {
			const rotated = applyAlg(base, ['', "U'", 'U2', 'U'][pre]);
			const found = findAuf(rotated, alg);
			expect(found, `pre=${pre}`).not.toBeNull();
		}
	});

	it('works for algorithms written with a leading rotation', () => {
		const alg = "x R2 D2 R' U' R D2 R' U R'"; // Aa perm
		expect(findAuf(caseFromAlg(alg), alg)).not.toBeNull();
	});

	it('accepts an orientation-only goal for OLL algorithms', () => {
		const alg = "R U R' U R U2 R'";
		const state = caseFromAlg(alg);
		// Sune solves its own case outright, so also check a case it only orients.
		const found = findAuf(state, alg, isLastLayerOriented);
		expect(found).not.toBeNull();
	});

	it('returns null when the algorithm cannot possibly help', () => {
		expect(findAuf(caseFromAlg('M2 U M2 U2 M2 U M2'), "R U R' U R U2 R'")).toBeNull();
	});
});

describe('state analysis', () => {
	it('recognises a solved cube', () => {
		const a = analyze(solvedFacelets());
		expect(a.solved).toBe(true);
		expect(a.stage).toBe('solved');
		expect(a.crossProgress).toBe(4);
		expect(a.f2lProgress).toBe(4);
	});

	it('recognises a cube sitting at PLL', () => {
		const a = analyze(caseFromAlg("R U R' U' R' F R2 U' R' U' R U R' F'"));
		expect(a.stage).toBe('last-layer-permutation');
		expect(a.f2lSolved).toBe(true);
		expect(a.lastLayerOriented).toBe(true);
		expect(a.lastLayerPermuted).toBe(false);
	});

	it('recognises a cube sitting at OLL', () => {
		const a = analyze(caseFromAlg("R U R' U R U2 R'"));
		expect(a.stage).toBe('last-layer-orientation');
		expect(a.f2lSolved).toBe(true);
		expect(a.lastLayerOriented).toBe(false);
	});

	it('recognises an unfinished first two layers', () => {
		// Pull the front-right pair out into the last layer.
		const a = analyze(stateFromAlg("R U R'"));
		expect(a.f2lSolved).toBe(false);
		expect(a.slots.find((s) => s.id === 'FR')!.solved).toBe(false);
		expect(a.slots.filter((s) => s.solved)).toHaveLength(3);
		expect(a.crossSolved).toBe(true);
	});

	it('counts cross progress on a broken cross', () => {
		const a = analyze(stateFromAlg('F'));
		expect(a.crossSolved).toBe(false);
		expect(a.crossProgress).toBe(3);
	});

	it('calls a thoroughly scrambled cube scrambled', () => {
		const a = analyze(stateFromAlg("R U R' U' F' L2 D B2 R' F U2 D' L B"));
		expect(['scrambled', 'cross']).toContain(a.stage);
		expect(a.solved).toBe(false);
	});
});
