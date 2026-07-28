/**
 * The algorithm library.
 *
 * Cases are authored as plain data; everything derivable is derived here at load
 * time — the sticker state each case represents, its move count, and the case key
 * used to look it up from a scrambled cube. Nothing that can be computed is
 * stored, so nothing can fall out of step.
 */

import { caseFromAlg, stateFromAlg } from '$cube/facelets';
import { f2lKey, orientationKey, permutationKey } from '$cube/ll';
import { htmLength, parseAlg } from '$cube/moves';
import { applyPerm, puzzle, type PuzzleSize } from '$cube/puzzle';
import { tokenise } from '$cube/puzzleState';
import type { AlgCase, AlgSetId, AlgSetMeta, ResolvedAlgCase, SkillTier } from '../types';
import { algSet, ALG_SETS } from './sets';

import { BEGINNER_F2L_CASES, BEGINNER_LL_CASES } from './beginner';
import { F2L_CASES } from './f2l';
import { OLL_CASES, TWO_LOOK_OLL_EDGE_CASES } from './oll';
import { PLL_CASES } from './pll';
import { CMLL_CASES, COLL_CASES, COMMUTATOR_CASES, WINTER_VARIATION_CASES } from './advanced';
import { POCKET_OLL_CASES, POCKET_PBL_CASES, POCKET_PLL_CASES } from './pocket';
import { REVENGE_CENTRE_CASES, REVENGE_PARITY_CASES } from './revenge';

/** Every authored case, in set order. */
export const ALL_CASES: readonly AlgCase[] = [
	...BEGINNER_F2L_CASES,
	...BEGINNER_LL_CASES,
	...F2L_CASES,
	...OLL_CASES,
	...TWO_LOOK_OLL_EDGE_CASES,
	...PLL_CASES,
	...COLL_CASES,
	...WINTER_VARIATION_CASES,
	...CMLL_CASES,
	...COMMUTATOR_CASES,
	...POCKET_OLL_CASES,
	...POCKET_PLL_CASES,
	...POCKET_PBL_CASES,
	...REVENGE_CENTRE_CASES,
	...REVENGE_PARITY_CASES
];

/**
 * The state a case represents: what the puzzle looks like *before* the algorithm.
 *
 * Derived by running the algorithm backwards from solved, never stored, so a
 * diagram can never drift away from the moves printed under it.
 */
function caseStateFor(c: AlgCase, size: PuzzleSize): import('$cube/types').Facelets {
	const p = puzzle(size);
	const source = c.setup ?? c.algs[0]?.moves ?? '';
	const names = tokenise(source);
	const moves = c.setup
		? names
		: [...names]
				.reverse()
				.map((n) => (n.endsWith('2') ? n : n.endsWith("'") ? n.slice(0, -1) : `${n}'`));
	return applyPerm(p.solved(), p.algPerm(moves));
}

/** Fill in everything derivable about a case. */
export function resolveCase(c: AlgCase): ResolvedAlgCase {
	const set = algSet(c.set);
	const size = set.puzzle ?? 3;
	const primaryAlg = c.algs[0]?.moves ?? '';
	// The 3×3 keeps its own parser, which knows about aliases and named triggers
	// the general one has no reason to carry.
	if (size === 3) {
		const primary = parseAlg(primaryAlg);
		return {
			...c,
			primary,
			moveCount: htmLength(primary),
			caseState: c.setup ? stateFromAlg(c.setup) : caseFromAlg(primary),
			set_: set
		};
	}
	return {
		...c,
		primary: [],
		moveCount: tokenise(primaryAlg).length,
		caseState: caseStateFor(c, size),
		set_: set
	};
}

export const RESOLVED_CASES: readonly ResolvedAlgCase[] = ALL_CASES.map(resolveCase);

const BY_ID = new Map(RESOLVED_CASES.map((c) => [c.id, c]));

export function caseById(id: string): ResolvedAlgCase | undefined {
	return BY_ID.get(id);
}

/**
 * The cases of a set, in order. For a curated view such as two-look OLL, this
 * returns the referenced cases from the source set, in the teaching order the
 * view lists them in.
 */
export function casesOfSet(id: AlgSetId): ResolvedAlgCase[] {
	const set = algSet(id);
	const authored = RESOLVED_CASES.filter((c) => c.set === id);
	if (!set.derivedFrom) return authored;
	const borrowed = set.derivedFrom.caseIds
		.map((caseId) => BY_ID.get(caseId))
		.filter((c): c is ResolvedAlgCase => c !== undefined);
	return [...authored, ...borrowed];
}

// ---------------------------------------------------------------------------
// Case-key indexes — how a scrambled cube finds its algorithm
// ---------------------------------------------------------------------------

function buildIndex(
	cases: readonly ResolvedAlgCase[],
	keyOf: (c: ResolvedAlgCase) => string
): Map<string, ResolvedAlgCase[]> {
	const index = new Map<string, ResolvedAlgCase[]>();
	for (const c of cases) {
		const key = keyOf(c);
		index.set(key, [...(index.get(key) ?? []), c]);
	}
	return index;
}

/** OLL cases by last-layer orientation key. */
export const OLL_BY_KEY = buildIndex(
	RESOLVED_CASES.filter((c) => c.set === 'oll'),
	(c) => orientationKey(c.caseState)
);

/** PLL cases by last-layer permutation key. */
export const PLL_BY_KEY = buildIndex(
	RESOLVED_CASES.filter((c) => c.set === 'pll'),
	(c) => permutationKey(c.caseState)
);

/** F2L cases by front-right slot key. */
export const F2L_BY_KEY = buildIndex(
	RESOLVED_CASES.filter((c) => c.set === 'f2l'),
	(c) => f2lKey(c.caseState, 'FR')
);

/** COLL cases by last-layer orientation key — several share one key. */
export const COLL_BY_KEY = buildIndex(
	RESOLVED_CASES.filter((c) => c.set === 'coll'),
	(c) => orientationKey(c.caseState)
);

// ---------------------------------------------------------------------------
// Search and filtering, for the library page
// ---------------------------------------------------------------------------

export interface CaseFilter {
	sets?: readonly AlgSetId[];
	tiers?: readonly SkillTier[];
	/** Free-text query matched against name, id, group, tags and the moves. */
	query?: string;
	/** Only cases whose primary algorithm is at most this many moves. */
	maxMoves?: number;
	/** Only cases containing this trigger. */
	trigger?: string;
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Everything searchable about a case, precomputed. */
const HAYSTACK = new Map(
	RESOLVED_CASES.map((c) => [
		c.id,
		normalise(
			[
				c.id,
				c.name,
				c.shortName,
				c.group ?? '',
				c.set,
				c.set_.shortName,
				...(c.tags ?? []),
				...(c.triggers ?? []),
				...c.algs.map((a) => a.moves)
			].join(' ')
		)
	])
);

export function filterCases(filter: CaseFilter): ResolvedAlgCase[] {
	const query = filter.query ? normalise(filter.query) : '';
	return RESOLVED_CASES.filter((c) => {
		if (filter.sets?.length && !filter.sets.includes(c.set)) return false;
		if (filter.tiers?.length && !filter.tiers.includes(c.tier)) return false;
		if (filter.maxMoves !== undefined && c.moveCount > filter.maxMoves) return false;
		if (filter.trigger && !(c.triggers ?? []).includes(filter.trigger)) return false;
		if (query && !HAYSTACK.get(c.id)!.includes(query)) return false;
		return true;
	});
}

/** Every trigger name used anywhere, for the filter menu. */
export const ALL_TRIGGERS: readonly string[] = [
	...new Set(RESOLVED_CASES.flatMap((c) => c.triggers ?? []))
].sort();

/** Every tag used anywhere. */
export const ALL_TAGS: readonly string[] = [
	...new Set(RESOLVED_CASES.flatMap((c) => c.tags ?? []))
].sort();

/** Count of authored cases per set, for the library index page. */
export function setCounts(): Record<AlgSetId, number> {
	const counts = Object.fromEntries(ALG_SETS.map((s) => [s.id, 0])) as Record<AlgSetId, number>;
	for (const set of ALG_SETS) counts[set.id] = casesOfSet(set.id).length;
	return counts;
}

/** Total number of distinct algorithm strings in the library. */
export function algorithmCount(): number {
	return ALL_CASES.reduce((n, c) => n + c.algs.length, 0);
}

export { ALG_SETS, algSet, PRIMARY_SETS, DERIVED_SETS } from './sets';
export type { AlgSetMeta };
