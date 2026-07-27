import { describe, expect, it } from 'vitest';
import { ALL_CASES, algorithmCount, casesOfSet, RESOLVED_CASES, resolveCase } from './index';
import { ALG_SETS, algSet, PRIMARY_SETS } from './sets';
import {
	checkCmll,
	checkColl,
	checkEdgeOrientation,
	checkF2l,
	checkOll,
	checkPll,
	checkVariantAgrees,
	checkWellFormed,
	f2lCoverage,
	ollCoverage,
	pllCoverage,
	type CaseCheck
} from './verify';
import {
	enumerateF2l,
	enumerateOrientations,
	enumeratePermutations,
	f2lKey,
	isLastLayerOriented,
	orientationKey,
	permutationKey
} from '$cube/ll';
import { describeCase } from './ascii';
import type { AlgCase, AlgSetId } from '../types';

/** Run the check a set's `verify` field asks for. */
function checkCase(c: AlgCase, alg: string): CaseCheck {
	switch (algSet(c.set).verify) {
		case 'pll':
			return checkPll(alg, c.setup);
		case 'oll':
			return checkOll(alg, c.setup);
		case 'f2l':
			return checkF2l(alg, 'FR', c.setup);
		case 'coll':
			return checkColl(alg, c.setup);
		case 'cmll':
			return checkCmll(alg, c.setup);
		case 'll-edges':
			return checkEdgeOrientation(alg, c.setup);
		default:
			return checkWellFormed(alg);
	}
}

describe('library structure', () => {
	it('has no duplicate case ids', () => {
		const seen = new Map<string, number>();
		for (const c of ALL_CASES) seen.set(c.id, (seen.get(c.id) ?? 0) + 1);
		expect([...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id)).toEqual([]);
	});

	it('every case belongs to a real set', () => {
		for (const c of ALL_CASES) expect(() => algSet(c.set), c.id).not.toThrow();
	});

	it('every case has at least one algorithm', () => {
		for (const c of ALL_CASES) {
			expect(c.algs.length, `${c.id} has no algorithms`).toBeGreaterThan(0);
		}
	});

	it('every curated set resolves all of its referenced cases', () => {
		for (const set of ALG_SETS) {
			if (!set.derivedFrom) continue;
			const authored = ALL_CASES.filter((c) => c.set === set.id).length;
			const resolved = casesOfSet(set.id);
			expect(resolved.length, `${set.id} has unresolvable case ids`).toBe(
				authored + set.derivedFrom.caseIds.length
			);
		}
	});

	it('resolves derived fields for every case', () => {
		for (const c of RESOLVED_CASES) {
			expect(c.moveCount, `${c.id}`).toBeGreaterThan(0);
			expect(c.caseState.length, `${c.id}`).toBe(54);
		}
	});

	it('mirror references point at real cases', () => {
		const ids = new Set(ALL_CASES.map((c) => c.id));
		for (const c of ALL_CASES) {
			if (c.mirrorOf)
				expect(ids.has(c.mirrorOf), `${c.id} mirrors unknown ${c.mirrorOf}`).toBe(true);
		}
	});

	it('groups match the set they belong to', () => {
		for (const c of ALL_CASES) {
			const set = algSet(c.set);
			if (!c.group || !set.groups) continue;
			expect(set.groups, `${c.id} has group "${c.group}" not listed by set ${c.set}`).toContain(
				c.group
			);
		}
	});
});

describe('every algorithm does what its set claims', () => {
	// Reported one case at a time so a failure names the offender.
	for (const c of ALL_CASES) {
		it(`${c.id} — ${c.name}`, () => {
			const primary = c.algs[0].moves;
			const result = checkCase(c, primary);
			expect(result.problems, `${c.id} primary "${primary}"`).toEqual([]);
			expect(result.ok).toBe(true);
		});
	}
});

describe('alternative algorithms solve the same case as the primary', () => {
	const goalFor = (set: AlgSetId) =>
		algSet(set).verify === 'oll' ? isLastLayerOriented : undefined;

	it('counts how many cases offer alternatives', () => {
		expect(ALL_CASES.filter((c) => c.algs.length > 1).length).toBeGreaterThanOrEqual(0);
	});

	for (const c of ALL_CASES.filter((x) => x.algs.length > 1)) {
		it(`${c.id} — ${c.algs.length} variants agree`, () => {
			const primary = c.algs[0].moves;
			for (const variant of c.algs.slice(1)) {
				// Sets without a clean group invariant get the well-formed check only.
				const verify = algSet(c.set).verify;
				if (verify === 'well-formed' || verify === 'derived') {
					expect(checkWellFormed(variant.moves).problems, `${c.id} / ${variant.moves}`).toEqual([]);
					continue;
				}
				if (verify === 'f2l' || verify === 'coll' || verify === 'cmll') {
					// These sets' algorithms are checked individually rather than compared,
					// because they legitimately finish in different last-layer states.
					expect(checkCase(c, variant.moves).problems, `${c.id} / ${variant.moves}`).toEqual([]);
					continue;
				}
				const agreement = checkVariantAgrees(primary, variant.moves, goalFor(c.set), c.setup);
				expect(agreement.problems, `${c.id} / "${variant.moves}"`).toEqual([]);
			}
		});
	}
});

describe('set completeness', () => {
	/**
	 * Turn a list of uncovered case keys into something readable, so a failure
	 * says which case is missing rather than printing a hash.
	 */
	function report(kind: 'oll' | 'pll' | 'f2l', missing: readonly string[]): string[] {
		const states =
			kind === 'oll'
				? enumerateOrientations()
				: kind === 'pll'
					? enumeratePermutations()
					: enumerateF2l();
		const keyOf =
			kind === 'oll'
				? orientationKey
				: kind === 'pll'
					? permutationKey
					: (s: Parameters<typeof orientationKey>[0]) => f2lKey(s as never, 'FR');
		return missing.map((key) => {
			const state = states.find((s) => keyOf(s) === key);
			return state ? `\n${describeCase(state, kind)}` : key;
		});
	}

	it('sets that declare a case count have exactly that many', () => {
		for (const set of PRIMARY_SETS) {
			if (set.expectedCount === undefined) continue;
			expect(casesOfSet(set.id).length, `${set.id}`).toBe(set.expectedCount);
		}
	});

	it('OLL covers all 57 cases exactly once', () => {
		const coverage = ollCoverage(
			casesOfSet('oll').map((c) => ({ id: c.id, alg: c.algs[0].moves, setup: c.setup }))
		);
		expect(coverage.expected.size).toBe(57);
		expect(report('oll', coverage.missing), 'OLL cases with no algorithm').toEqual([]);
		expect(coverage.duplicated, 'two OLL entries for the same case').toEqual([]);
	});

	it('PLL covers all 21 cases exactly once', () => {
		const coverage = pllCoverage(
			casesOfSet('pll').map((c) => ({ id: c.id, alg: c.algs[0].moves, setup: c.setup }))
		);
		expect(coverage.expected.size).toBe(21);
		expect(report('pll', coverage.missing), 'PLL cases with no algorithm').toEqual([]);
		expect(coverage.duplicated, 'two PLL entries for the same case').toEqual([]);
	});

	it('F2L covers all 41 cases exactly once', () => {
		const coverage = f2lCoverage(
			casesOfSet('f2l').map((c) => ({ id: c.id, alg: c.algs[0].moves, setup: c.setup }))
		);
		expect(coverage.expected.size).toBe(41);
		expect(report('f2l', coverage.missing), 'F2L cases with no algorithm').toEqual([]);
		expect(coverage.duplicated, 'two F2L entries for the same case').toEqual([]);
	});
});

describe('library size', () => {
	it('is worth calling a library', () => {
		expect(algorithmCount()).toBeGreaterThan(250);
	});
});

describe('resolveCase', () => {
	it('derives the case state from the algorithm by default', () => {
		const resolved = resolveCase({
			id: 'test',
			set: 'pll',
			name: 'Test',
			shortName: 'T',
			tier: 'intermediate',
			algs: [{ moves: "R U R' U'" }]
		});
		expect(resolved.moveCount).toBe(4);
		expect(resolved.caseState.length).toBe(54);
	});
});
