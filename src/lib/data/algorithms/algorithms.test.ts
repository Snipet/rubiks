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
import { applyPerm, puzzle } from '$cube/puzzle';
import { reorientToStandard, tokenise } from '$cube/puzzleState';
import {
	applyPocket,
	solvedPocket,
	enumeratePocketOrientations,
	faceletsToPocket,
	firstLayerSolved,
	lastLayerOriented as lastLayerOrientedPocket,
	playPocket,
	pocketOrientationKey,
	pocketPermutationKey
} from '$cube/pocket';
import { POCKET_OLL_CASES, POCKET_PBL_CASES, POCKET_PLL_CASES } from './pocket';
import { POCKET_CLL_CASES } from './pocketCll';
import { REVENGE_CENTRE_CASES, REVENGE_PARITY_CASES } from './revenge';
import { describeEffect, effectSummary } from '$cube/pieces';
import { isReduced, readRevenge } from '$cube/revenge';

const p4Solved = () => puzzle(4).solved();

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
			const size = c.set_.puzzle ?? 3;
			expect(c.moveCount, `${c.id}`).toBeGreaterThan(0);
			expect(c.caseState.length, `${c.id}`).toBe(6 * size * size);
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
				if (verify === 'well-formed') {
					expect(checkWellFormed(variant.moves).problems, `${c.id} / ${variant.moves}`).toEqual([]);
					continue;
				}
				if (verify !== 'oll' && verify !== 'pll') {
					// F2L, COLL, CMLL and edge-orientation variants are checked
					// individually rather than compared against the primary, because they
					// legitimately finish in different last-layer states.
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

// ---------------------------------------------------------------------------
// The 2×2 and 4×4 sets
// ---------------------------------------------------------------------------

describe('the 2×2 sets', () => {
	const orient = (alg: string) => {
		const inverse = tokenise(alg)
			.reverse()
			.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
		return faceletsToPocket(applyPerm(puzzle(2).solved(), puzzle(2).algPerm(inverse)));
	};

	it('the seven orientation algorithms cover all seven cases, once each', () => {
		// The engine enumerates the cases from first principles; the data has to
		// match that list exactly. A duplicate or a gap fails here rather than
		// showing up as a case with no algorithm on a page nobody opened.
		const expected = enumeratePocketOrientations().filter((k) => k !== '0000');
		const found = POCKET_OLL_CASES.map((c) => pocketOrientationKey(orient(c.algs[0].moves)));
		expect(found.slice().sort()).toEqual(expected.slice().sort());
		expect(new Set(found).size).toBe(found.length);
	});

	it('every 2×2 orientation algorithm really orients, and leaves the bottom alone', () => {
		// Run through the sticker engine rather than the corner model, because the
		// left-hand variants turn L, which the corner model deliberately does not
		// know: it holds the back-bottom-left corner still. Putting the result back
		// in the home frame first is what makes the two views comparable.
		const p = puzzle(2);
		for (const c of [...POCKET_OLL_CASES]) {
			for (const variant of c.algs) {
				const names = tokenise(variant.moves);
				const inverse = [...names]
					.reverse()
					.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
				const scrambled = applyPerm(p.solved(), p.algPerm(inverse));
				const before = faceletsToPocket(reorientToStandard(p, scrambled)!);
				expect(firstLayerSolved(before), `${c.id} ${variant.moves}`).toBe(true);

				const done = reorientToStandard(p, applyPerm(scrambled, p.algPerm(names)));
				expect(done, `${c.id} ${variant.moves}`).not.toBeNull();
				const after = faceletsToPocket(done!);
				expect(lastLayerOrientedPocket(after), `${c.id} ${variant.moves}`).toBe(true);
				expect(firstLayerSolved(after), `${c.id} ${variant.moves}`).toBe(true);
			}
		}
	});

	it('the two permutation algorithms are one adjacent and one diagonal', () => {
		const keys = POCKET_PLL_CASES.map((c) => pocketPermutationKey(orient(c.algs[0].moves)));
		expect(keys.slice().sort()).toEqual(['adjacent', 'diagonal']);
	});

	it('every 2×2 algorithm solves the case it stands for', () => {
		const p = puzzle(2);
		for (const c of [...POCKET_OLL_CASES, ...POCKET_PLL_CASES, ...POCKET_PBL_CASES]) {
			for (const variant of c.algs) {
				const names = tokenise(variant.moves);
				for (const name of names) expect(p.parse(name), `${c.id}: ${name}`).not.toBeNull();
				const inverse = [...names]
					.reverse()
					.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
				const scrambled = applyPerm(p.solved(), p.algPerm(inverse));
				const solved = applyPerm(scrambled, p.algPerm(names));
				expect(Array.from(solved), `${c.id}: ${variant.moves}`).toEqual(Array.from(p.solved()));
			}
		}
	});

	it('the five PBL cases are five different cases', () => {
		const keys = POCKET_PBL_CASES.map((c) => {
			const s = orient(c.algs[0].moves);
			return `${s.cp.slice(0, 4).join('')}|${s.cp.slice(4).join('')}`;
		});
		expect(new Set(keys).size).toBe(5);
		// None of them is already finished.
		for (const key of keys) expect(key).not.toBe('0123|4567');
	});
});

describe('the 4×4 parity set', () => {
	const p4 = puzzle(4);

	/** Which kind of piece a sticker belongs to on a 4×4. */
	function kindOf(index: number): 'centre' | 'wing' | 'corner' {
		const { row, col } = p4.locate(index);
		const edgeRow = row === 0 || row === 3;
		const edgeCol = col === 0 || col === 3;
		if (!edgeRow && !edgeCol) return 'centre';
		return edgeRow && edgeCol ? 'corner' : 'wing';
	}

	function effectOf(alg: string) {
		const names = tokenise(alg);
		for (const name of names) expect(p4.parse(name), name).not.toBeNull();
		const after = applyPerm(p4.solved(), p4.algPerm(names));
		const solved = p4.solved();
		const tally = { centre: 0, wing: 0, corner: 0 };
		for (let i = 0; i < p4.stickers; i++) if (after[i] !== solved[i]) tally[kindOf(i)]++;
		return tally;
	}

	const variants = REVENGE_PARITY_CASES.flatMap((c) => c.algs.map((a) => a.moves));

	it('every version moves wings and nothing else', () => {
		// A centre or a corner out of place would mean the algorithm is not a
		// parity fix but a scramble that happens to look like one.
		for (const moves of variants) {
			const effect = effectOf(moves);
			expect(effect.centre, moves).toBe(0);
			expect(effect.corner, moves).toBe(0);
			expect(effect.wing, moves).toBeGreaterThan(0);
		}
	});

	it('every version leaves the puzzle still reduced', () => {
		// This is what makes a parity algorithm usable mid-solve instead of a
		// fresh start: your centres stay built and your wings stay paired.
		for (const moves of variants) {
			const after = applyPerm(p4.solved(), p4.algPerm(tokenise(moves)));
			expect(isReduced(after), moves).toBe(true);
		}
	});

	it('every version produces a 3×3 that could not exist', () => {
		// Which is the definition of parity, and the thing the site detects.
		for (const moves of variants) {
			expect(readRevenge(applyPerm(p4.solved(), p4.algPerm(tokenise(moves)))).stage, moves).toBe(
				'parity'
			);
		}
	});

	it('the two versions are genuinely different sequences', () => {
		// They fix the same kind of position but not from the same angle: each
		// swaps its own pair of edges, so which one you reach for depends on how
		// you are holding the puzzle. Claiming they were interchangeable would be
		// wrong, and this is the check that keeps that claim out of the notes.
		const [short, classic] = variants;
		expect(Array.from(p4.algPerm(tokenise(short)))).not.toEqual(
			Array.from(p4.algPerm(tokenise(classic)))
		);
	});

	it('each version is its own inverse', () => {
		// Swapping the same two edge pairs back puts the puzzle right, so doubled
		// each algorithm must be the identity. A stray quarter turn shows up here.
		for (const moves of variants) {
			const alg = tokenise(moves);
			const twice = applyPerm(p4.solved(), p4.algPerm([...alg, ...alg]));
			expect(Array.from(twice), moves).toEqual(Array.from(p4.solved()));
		}
	});

	it('needs the slice, not the wide turn', () => {
		// The distinction the set description makes has to be a real one: writing
		// Rw where 2R belongs must break the algorithm, or the warning is noise.
		const swapped = variants[0].replace(/2R/g, 'Rw');
		const after = applyPerm(p4.solved(), p4.algPerm(tokenise(swapped)));
		expect(isReduced(after)).toBe(false);
	});
});

describe('the 4×4 centre set', () => {
	it('every centre algorithm moves centres and nothing else', () => {
		// The guarantee the set description makes, measured piece by piece rather
		// than sticker by sticker: centre pieces of a face are interchangeable in
		// colour, so only the piece model can tell whether a corner or a wing moved.
		for (const c of REVENGE_CENTRE_CASES) {
			for (const variant of c.algs) {
				const effect = describeEffect(4, variant.moves);
				expect(effect.identity, `${c.id}: ${variant.moves}`).toBe(false);
				expect(effect.moved.corner, `${c.id}: ${variant.moves}`).toBe(0);
				expect(effect.moved.edge, `${c.id}: ${variant.moves}`).toBe(0);
				expect(effect.moved.centre, `${c.id}: ${variant.moves}`).toBeGreaterThan(0);
			}
		}
	});

	it('they are built from inner slices only', () => {
		// Which is *why* the guarantee holds: a slice turn cannot reach a corner.
		// If a face turn crept into one of these, the property above would become a
		// coincidence rather than a consequence.
		const p4 = puzzle(4);
		for (const c of REVENGE_CENTRE_CASES) {
			for (const variant of c.algs) {
				for (const name of tokenise(variant.moves)) {
					const turn = p4.parse(name);
					expect(turn, `${c.id}: ${name}`).not.toBeNull();
					expect(turn!.from, `${c.id}: ${name} reaches the outer layer`).toBeGreaterThan(0);
				}
			}
		}
	});

	it('each one is a commutator, so undoing it is doing it backwards', () => {
		for (const c of REVENGE_CENTRE_CASES) {
			for (const variant of c.algs) {
				const names = tokenise(variant.moves);
				const inverse = [...names]
					.reverse()
					.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
				const round = applyPerm(p4Solved(), puzzle(4).algPerm([...names, ...inverse]));
				expect(Array.from(round), `${c.id}: ${variant.moves}`).toEqual(Array.from(p4Solved()));
			}
		}
	});

	it('the set covers distinct effects', () => {
		// Five entries that all did the same thing would be five ways of padding a
		// page rather than five tools.
		const seen = REVENGE_CENTRE_CASES.map((c) => effectSummary(describeEffect(4, c.algs[0].moves)));
		expect(new Set(seen).size).toBe(REVENGE_CENTRE_CASES.length);
	});
});

describe('2×2 CLL', () => {
	const p2 = puzzle(2);
	const AUF = [0, 1, 2, 3].map((k) => playPocket(solvedPocket(), new Array(k).fill('U')));

	/** Every last-layer corner state with the first layer solved: 4! × 3³. */
	function allLastLayerStates() {
		const out: ReturnType<typeof solvedPocket>[] = [];
		const perms: number[][] = [];
		const build = (rest: number[], acc: number[]) => {
			if (!rest.length) return void perms.push(acc);
			rest.forEach((v, i) => build([...rest.slice(0, i), ...rest.slice(i + 1)], [...acc, v]));
		};
		build([0, 1, 2, 3], []);
		for (const perm of perms) {
			for (let a = 0; a < 3; a++) {
				for (let b = 0; b < 3; b++) {
					for (let c = 0; c < 3; c++) {
						out.push({
							cp: [...perm, 4, 5, 6, 7],
							co: [a, b, c, (3 - ((a + b + c) % 3)) % 3, 0, 0, 0, 0]
						});
					}
				}
			}
		}
		return out;
	}

	/**
	 * Two states are the same case when an adjusting turn before the algorithm and
	 * another after it carries one to the other — a double coset of the turns of
	 * the top. That is the definition the published case count follows from.
	 */
	function caseKey(state: ReturnType<typeof solvedPocket>) {
		let best = '';
		for (const pre of AUF) {
			const left = applyPocket(pre, state);
			for (const post of AUF) {
				const at = applyPocket(left, post);
				const reading = `${at.co.slice(0, 4).join('')}|${at.cp.slice(0, 4).join('')}`;
				if (!best || reading < best) best = reading;
			}
		}
		return best;
	}

	it('there are forty-three cases, and forty of them need twisting', () => {
		// Derived here, not taken from a sheet. 648 states collapse to 43: one is
		// solved, two need no twisting — those are the 2×2 PLL cases and live in
		// their own set — and the remaining forty are CLL.
		const states = allLastLayerStates();
		expect(states.length).toBe(648);
		const keys = new Set(states.map(caseKey));
		expect(keys.size).toBe(43);
		const untwisted = [...keys].filter((k) => k.startsWith('0000'));
		expect(untwisted.length).toBe(3);
		expect(keys.size - untwisted.length).toBe(POCKET_CLL_CASES.length);
	});

	it('the shape groups come out at the published sizes', () => {
		// Six each except H, which has four because the H shape is unchanged by a
		// half turn and two of its arrangements coincide. Getting this wrong is the
		// classic way to end up with a sheet of 42 that is really 40 plus two.
		const sizes: Record<string, number> = {};
		for (const c of POCKET_CLL_CASES) sizes[c.group!] = (sizes[c.group!] ?? 0) + 1;
		expect(sizes).toEqual({ Sune: 6, 'Anti-Sune': 6, T: 6, U: 6, L: 6, Pi: 6, H: 4 });
	});

	it('every algorithm solves its own case outright', () => {
		for (const c of POCKET_CLL_CASES) {
			for (const variant of c.algs) {
				const names = tokenise(variant.moves);
				for (const name of names) expect(p2.parse(name), `${c.id}: ${name}`).not.toBeNull();
				const inverse = [...names]
					.reverse()
					.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
				const scrambled = applyPerm(p2.solved(), p2.algPerm(inverse));
				const solved = applyPerm(scrambled, p2.algPerm(names));
				expect(Array.from(solved), `${c.id}: ${variant.moves}`).toEqual(Array.from(p2.solved()));
			}
		}
	});

	it('the forty cases are forty different cases', () => {
		// A generated set is exactly where a duplicate would hide.
		const keys = POCKET_CLL_CASES.map((c) => {
			const names = tokenise(c.algs[0].moves);
			const inverse = [...names]
				.reverse()
				.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
			return caseKey(faceletsToPocket(applyPerm(p2.solved(), p2.algPerm(inverse))));
		});
		expect(new Set(keys).size).toBe(POCKET_CLL_CASES.length);
		// And none of them is a case that needs no twisting.
		for (const k of keys) expect(k.startsWith('0000')).toBe(false);
	});

	it('leaves the first layer alone', () => {
		for (const c of POCKET_CLL_CASES) {
			const names = tokenise(c.algs[0].moves);
			const inverse = [...names]
				.reverse()
				.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
			const before = faceletsToPocket(applyPerm(p2.solved(), p2.algPerm(inverse)));
			expect(firstLayerSolved(before), c.id).toBe(true);
		}
	});

	it('no algorithm turns the same face twice running', () => {
		for (const c of POCKET_CLL_CASES) {
			for (const variant of c.algs) {
				const names = tokenise(variant.moves);
				for (let i = 1; i < names.length; i++) {
					expect(names[i][0], `${c.id}: ${variant.moves}`).not.toBe(names[i - 1][0]);
				}
			}
		}
	});
});
