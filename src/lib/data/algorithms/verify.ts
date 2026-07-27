/**
 * Algorithm verification.
 *
 * Every algorithm in the library is executed by the cube engine and checked
 * against what its set claims to do. A PLL algorithm must permute the last layer
 * and disturb nothing else; an OLL algorithm must leave the first two layers
 * alone; an F2L algorithm must fill its slot. A mistyped move fails these checks,
 * so it fails the build.
 *
 * On top of the per-case checks there is a **coverage** check: the set of case
 * keys the OLL algorithms solve is compared against the 57 keys the engine
 * enumerates from first principles, and likewise 21 for PLL and 41 for F2L. That
 * makes the library provably complete rather than complete-looking.
 */

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
	SOLVED_PERMUTATION_KEY,
	type F2lSlotId
} from '$cube/ll';
import {
	applyAlg,
	caseFromAlg,
	isSolvedIgnoringOrientation,
	solvedFacelets,
	stateFromAlg
} from '$cube/facelets';
import { htmLength, NotationError, parseAlg } from '$cube/moves';
import type { Facelets } from '$cube/types';

export interface CaseCheck {
	ok: boolean;
	problems: string[];
}

const ok: CaseCheck = { ok: true, problems: [] };
const fail = (...problems: string[]): CaseCheck => ({ ok: false, problems });

/** Parse an algorithm, reporting notation errors as check failures. */
function parsed(alg: string): { moves: ReturnType<typeof parseAlg> } | CaseCheck {
	try {
		return { moves: parseAlg(alg) };
	} catch (err) {
		if (err instanceof NotationError) return fail(`cannot be read as moves: ${err.message}`);
		throw err;
	}
}

/**
 * The state an algorithm solves, i.e. the case it is for.
 *
 * `setup` overrides the default of "the inverse of the algorithm", which matters
 * only for the handful of algorithms whose published form assumes a particular
 * starting grip.
 */
export function caseStateOf(alg: string, setup?: string): Facelets {
	return setup ? stateFromAlg(setup) : caseFromAlg(alg);
}

/**
 * A PLL algorithm must:
 * - leave the first two layers solved,
 * - leave the last layer oriented,
 * - actually move something in the last layer.
 */
export function checkPll(alg: string, setup?: string): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;

	const state = caseStateOf(alg, setup);
	const a = analyze(state);
	const problems: string[] = [];
	if (!a.f2lSolved) {
		problems.push(
			`disturbs the first two layers (cross ${a.crossProgress}/4, slots ${a.f2lProgress}/4)`
		);
	}
	if (!a.lastLayerOriented) problems.push('leaves the last layer unoriented, so it is not a PLL');
	if (a.lastLayerPermuted) problems.push('does nothing — the case it solves is already solved');
	if (!isSolvedIgnoringOrientation(applyAlg(state, alg))) {
		problems.push('does not solve the case it is derived from');
	}
	return problems.length ? fail(...problems) : ok;
}

/**
 * An OLL algorithm must:
 * - leave the first two layers solved,
 * - leave the last layer oriented afterwards,
 * - be needed, i.e. its case is not already oriented.
 *
 * It is explicitly allowed to permute the last layer however it likes.
 */
export function checkOll(alg: string, setup?: string): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;

	const state = caseStateOf(alg, setup);
	const a = analyze(state);
	const problems: string[] = [];
	if (!a.f2lSolved) {
		problems.push(
			`disturbs the first two layers (cross ${a.crossProgress}/4, slots ${a.f2lProgress}/4)`
		);
	}
	if (a.lastLayerOriented) problems.push('its case is already oriented, so there is nothing to do');
	if (!findAuf(state, alg, isLastLayerOriented)) {
		problems.push('does not orient the last layer of the case it is derived from');
	}
	return problems.length ? fail(...problems) : ok;
}

/**
 * An F2L algorithm must fill its slot without breaking the cross or the other
 * three slots. It may do anything it likes to the last layer.
 */
export function checkF2l(alg: string, slot: F2lSlotId = 'FR', setup?: string): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;

	const state = caseStateOf(alg, setup);
	const before = analyze(state);
	const problems: string[] = [];

	if (!before.crossSolved) {
		problems.push(`its case has a broken cross (${before.crossProgress}/4 edges placed)`);
	}
	const others = before.slots.filter((s) => s.id !== slot);
	const brokenOthers = others.filter((s) => !s.solved).map((s) => s.id);
	if (brokenOthers.length) {
		problems.push(`its case has other slots unsolved: ${brokenOthers.join(', ')}`);
	}
	if (before.slots.find((s) => s.id === slot)!.solved) {
		problems.push(`the ${slot} slot is already solved in its case, so there is nothing to do`);
	}

	const after = analyze(applyAlg(state, alg));
	if (!after.crossSolved) problems.push('breaks the cross');
	if (!after.slots.find((s) => s.id === slot)!.solved)
		problems.push(`does not fill the ${slot} slot`);
	const brokenAfter = after.slots.filter((s) => s.id !== slot && !s.solved).map((s) => s.id);
	if (brokenAfter.length) problems.push(`breaks other slots: ${brokenAfter.join(', ')}`);

	return problems.length ? fail(...problems) : ok;
}

/**
 * A COLL algorithm solves the last-layer corners while leaving the last-layer
 * edges oriented — permuted however, but never flipped — and the first two layers
 * untouched.
 */
export function checkColl(alg: string, setup?: string): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;

	const state = caseStateOf(alg, setup);
	const before = analyze(state);
	const problems: string[] = [];
	if (!before.f2lSolved) problems.push('disturbs the first two layers');

	const after = analyze(applyAlg(state, alg));
	if (!after.f2lSolved) problems.push('breaks the first two layers');
	if (!after.lastLayerOriented) problems.push('leaves the last layer unoriented');
	// Corners must end up genuinely solved, allowing for a closing U turn.
	const cornersSolved = [0, 1, 2, 3].some((auf) => {
		const s = applyAlg(applyAlg(state, alg), ['', 'U', 'U2', "U'"][auf]);
		const cubie = analyze(s);
		return cubie.lastLayerOriented && cornersHome(s);
	});
	if (!cornersSolved) problems.push('does not solve the last-layer corners');
	return problems.length ? fail(...problems) : ok;
}

function cornersHome(state: Facelets): boolean {
	// The four last-layer corners each back in their own slot.
	const solved = solvedFacelets();
	for (const idx of [0, 2, 6, 8, 9, 11, 18, 20, 36, 38, 45, 47]) {
		if (state[idx] !== solved[idx]) return false;
	}
	return true;
}

/**
 * A CMLL algorithm — the Roux corners step — solves all last-layer corners while
 * leaving the M slice free. The D-layer corners and the left and right blocks
 * must survive; edges in U and the M slice may go anywhere.
 */
export function checkCmll(alg: string, setup?: string): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;

	const state = caseStateOf(alg, setup);
	const after = applyAlg(state, alg);
	const problems: string[] = [];

	// Roux's first two blocks: the DFR/DLF/DBL/DRB corners plus the FR/FL/BL/BR
	// edges. The M slice — UF, UB, DF, DB and the centres — is deliberately free.
	const blockFacelets = [
		// D-layer corners
		29, 26, 15, 27, 44, 24, 33, 53, 42, 35, 17, 51,
		// middle-slice edges
		23, 12, 21, 41, 50, 39, 48, 14,
		// D-layer left and right edges
		32, 16, 30, 43
	];
	const solved = solvedFacelets();
	const broken = blockFacelets.filter((i) => after[i] !== solved[i]);
	if (broken.length) problems.push(`breaks the first two blocks at ${broken.length} stickers`);

	const cornersSolved = [0, 1, 2, 3].some((auf) =>
		cornersHome(applyAlg(after, ['', 'U', 'U2', "U'"][auf]))
	);
	if (!cornersSolved) problems.push('does not solve the last-layer corners');
	return problems.length ? fail(...problems) : ok;
}

/**
 * An edge-orientation algorithm — the first look of two-look OLL — must leave
 * every last-layer edge oriented while leaving the first two layers alone. It is
 * explicitly allowed to leave the corners in a mess; that is the second look's job.
 */
export function checkEdgeOrientation(alg: string, setup?: string): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;

	const state = caseStateOf(alg, setup);
	const before = analyze(state);
	const problems: string[] = [];
	if (!before.f2lSolved) problems.push('disturbs the first two layers');

	const edgesOriented = (s: Facelets) => {
		const a = analyze(s);
		return a.f2lSolved && [1, 3, 5, 7].every((i) => s[i] === 0);
	};
	if (edgesOriented(state)) problems.push('its case already has the edges oriented');
	if (!findAuf(state, alg, edgesOriented)) {
		problems.push('does not orient all four last-layer edges');
	}
	return problems.length ? fail(...problems) : ok;
}

/**
 * The weakest useful check, for sets whose members do not share one clean
 * invariant: the algorithm parses, is not empty, and is not absurdly long.
 */
export function checkWellFormed(alg: string, maxLength = 40): CaseCheck {
	const p = parsed(alg);
	if ('problems' in p) return p;
	const problems: string[] = [];
	const n = htmLength(p.moves);
	if (n === 0) problems.push('is empty');
	if (n > maxLength) problems.push(`is ${n} moves, which is longer than this set should need`);
	return problems.length ? fail(...problems) : ok;
}

/**
 * Two algorithms for the same case must have the same effect, up to the free U
 * turns either side. This catches a variant that has been pasted against the
 * wrong case.
 */
export function checkVariantAgrees(
	primary: string,
	variant: string,
	goal: (s: Facelets) => boolean = isSolvedIgnoringOrientation,
	setup?: string
): CaseCheck {
	const state = caseStateOf(primary, setup);
	return findAuf(state, variant, goal)
		? ok
		: fail('does not solve the same case as the primary algorithm');
}

// ---------------------------------------------------------------------------
// Coverage
// ---------------------------------------------------------------------------

export interface Coverage {
	/** Keys the engine says exist. */
	expected: Set<string>;
	/** Keys the library actually covers. */
	covered: Set<string>;
	missing: string[];
	/** Keys covered more than once, which means two cases are duplicates. */
	duplicated: string[];
}

function coverageOf(
	expectedKeys: Set<string>,
	entries: readonly { id: string; key: string }[]
): Coverage {
	const covered = new Set<string>();
	const seen = new Map<string, string[]>();
	for (const { id, key } of entries) {
		covered.add(key);
		seen.set(key, [...(seen.get(key) ?? []), id]);
	}
	return {
		expected: expectedKeys,
		covered,
		missing: [...expectedKeys].filter((k) => !covered.has(k)).sort(),
		duplicated: [...seen.entries()]
			.filter(([, ids]) => ids.length > 1)
			.map(([key, ids]) => `${key} → ${ids.join(', ')}`)
			.sort()
	};
}

/** The 57 OLL case keys, derived from the engine rather than a list. */
export function expectedOllKeys(): Set<string> {
	const keys = new Set(enumerateOrientations().map(orientationKey));
	keys.delete(SOLVED_ORIENTATION_KEY);
	return keys;
}

/** The 21 PLL case keys. */
export function expectedPllKeys(): Set<string> {
	const keys = new Set(enumeratePermutations().map(permutationKey));
	keys.delete(SOLVED_PERMUTATION_KEY);
	return keys;
}

/** The 41 F2L case keys for the front-right slot. */
export function expectedF2lKeys(): Set<string> {
	const keys = new Set(enumerateF2l().map((s) => f2lKey(s, 'FR')));
	keys.delete(f2lKey(solvedFacelets(), 'FR'));
	return keys;
}

export function ollCoverage(
	cases: readonly { id: string; alg: string; setup?: string }[]
): Coverage {
	return coverageOf(
		expectedOllKeys(),
		cases.map((c) => ({ id: c.id, key: orientationKey(caseStateOf(c.alg, c.setup)) }))
	);
}

export function pllCoverage(
	cases: readonly { id: string; alg: string; setup?: string }[]
): Coverage {
	return coverageOf(
		expectedPllKeys(),
		cases.map((c) => ({ id: c.id, key: permutationKey(caseStateOf(c.alg, c.setup)) }))
	);
}

export function f2lCoverage(
	cases: readonly { id: string; alg: string; setup?: string }[]
): Coverage {
	return coverageOf(
		expectedF2lKeys(),
		cases.map((c) => ({ id: c.id, key: f2lKey(caseStateOf(c.alg, c.setup), 'FR') }))
	);
}
