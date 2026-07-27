/**
 * The advice engine.
 *
 * Given the state of someone's actual cube, work out where they are in a solve
 * and what to do next — pitched at their level. A beginner and an expert looking
 * at the same cube should get different, both-correct answers: the beginner gets
 * the layer-by-layer step with an algorithm they already know, the expert gets
 * the one-look case.
 *
 * Nothing here hard-codes which algorithm belongs to which case. Cases are
 * matched by the keys computed in `ll.ts`, and where a step has a small set of
 * candidate algorithms the engine *tries them* and keeps the one that works. So
 * the advice cannot drift out of step with the library, and an algorithm that
 * would not actually solve the case in front of you is never offered.
 */

import {
	applyAlg,
	isSolvedIgnoringOrientation,
	reorientationFor,
	solvedFacelets
} from '../facelets';
import { htmLength, parseAlg } from '../moves';
import {
	analyze,
	f2lKey,
	F2L_SLOTS,
	isLastLayerOriented,
	LL_CORNERS,
	LL_EDGES,
	orientationKey,
	permutationKey,
	type F2lSlotId,
	type StateAnalysis
} from '../ll';
import { faceletsToCubie } from '../cubie';
import type { Facelets } from '../types';
import { solveCross } from './cross';
import { casesOfSet, caseById, F2L_BY_KEY } from '$data/algorithms';
import type { ResolvedAlgCase, SkillTier } from '$data/types';

/** One suggestion for what to do next. */
export interface Recommendation {
	/** Who this is for. */
	tier: SkillTier;
	/** What the reader is about to do, in a few words. */
	title: string;
	/** The reasoning, in a sentence or two of plain English. */
	detail: string;
	/** Moves to perform, AUF and any setup rotation included. */
	moves?: string;
	/** Move count of `moves`, half-turn metric. */
	moveCount?: number;
	/** The library case this draws on, for a "see the full entry" link. */
	caseId?: string;
	/** The algorithm set to point at when there is no single case. */
	setId?: string;
	/** Broken-down sub-steps, when the advice is a sequence rather than one algorithm. */
	steps?: { label: string; moves: string }[];
}

export interface SolvePlan {
	analysis: StateAnalysis;
	/** The step the cube is at, named the way a cuber would name it. */
	stepName: string;
	/** One sentence on what this step is for. */
	stepDescription: string;
	/** Rough fraction of the solve completed, for a progress bar. */
	progress: number;
	/** Advice, one entry per skill tier that has something distinct to say. */
	recommendations: Recommendation[];
}

/** Rotations that bring each slot round to the front-right. */
const SLOT_ROTATION: Record<F2lSlotId, string> = {
	FR: '',
	FL: "y'",
	BL: 'y2',
	BR: 'y'
};

/** The rotation that puts each slot back where it came from. */
const SLOT_ROTATION_UNDO: Record<F2lSlotId, string> = {
	FR: '',
	FL: 'y',
	BL: 'y2',
	BR: "y'"
};

const SLOT_PROSE: Record<F2lSlotId, string> = {
	FR: 'front-right',
	FL: 'front-left',
	BL: 'back-left',
	BR: 'back-right'
};

const AUF = ['', 'U', 'U2', "U'"] as const;

/**
 * Try every candidate algorithm with every setup and finishing U turn, and
 * return the shortest sequence that reaches `goal`.
 *
 * The important detail is that each candidate is checked by **applying it
 * literally** to the cube in front of the reader, rather than by trusting a
 * lookup table or a helper with its own orientation conventions. Whatever comes
 * back is a string the reader can perform exactly as written, ending with the
 * cube the way up it started — which is what makes the "do it on this cube"
 * button and the advice agree.
 */
function bestFit(
	state: Facelets,
	candidates: readonly { id?: string; moves: string }[],
	goal: (s: Facelets) => boolean
): { id?: string; moves: string; length: number } | null {
	let best: { id?: string; moves: string; length: number } | null = null;
	for (const candidate of candidates) {
		for (const pre of AUF) {
			for (const post of AUF) {
				const body = [pre, candidate.moves, post].filter(Boolean).join(' ');
				let after = applyAlg(state, body);
				// An algorithm written with a leading rotation finishes tilted; put the
				// cube back the way up it started before judging the result.
				const fix = reorientationFor(after);
				if (fix === null) continue;
				if (fix) after = applyAlg(after, fix);
				if (!goal(after)) continue;
				const full = [body, fix].filter(Boolean).join(' ');
				const length = htmLength(parseAlg(full));
				if (!best || length < best.length) best = { id: candidate.id, moves: full, length };
			}
		}
	}
	return best;
}

/** True when all four last-layer edges show the top colour. */
function edgesOriented(state: Facelets): boolean {
	const { eo } = faceletsToCubie(state);
	return LL_EDGES.every((slot) => eo[slot] === 0);
}

/** True when all four last-layer corners are home and untwisted. */
function cornersPlaced(state: Facelets): boolean {
	const solved = solvedFacelets();
	return [0, 2, 6, 8, 9, 11, 18, 20, 36, 38, 45, 47].every((i) => state[i] === solved[i]);
}

/** Candidate lists, computed once from the library. */
function candidates(setId: Parameters<typeof casesOfSet>[0]) {
	return casesOfSet(setId).flatMap((c) => c.algs.map((a) => ({ id: c.id, moves: a.moves })));
}

/**
 * F2L candidates for a slot, narrowed by the case key before anything is
 * simulated.
 *
 * Trying all 41 cases against all 16 AUF combinations for every unsolved slot is
 * roughly four million array operations, which is slow enough to be felt when it
 * runs on every keystroke in the sticker editor — and pointless, because the case
 * key already says which entry applies. The full scan stays as a fallback for the
 * awkward positions the key reports as `elsewhere`.
 */
function f2lCandidates(key: string, slot: F2lSlotId) {
	const matched = F2L_BY_KEY.get(key);
	const pool = matched?.length ? matched : casesOfSet('f2l');
	const before = SLOT_ROTATION[slot];
	const after = SLOT_ROTATION_UNDO[slot];
	// Conjugate: turn the cube so the slot is at the front-right, do the
	// algorithm, turn it back. Rotations cost no moves, and the reader ends up
	// holding the cube exactly as they started.
	return pool.flatMap((c) =>
		c.algs.map((a) => ({ id: c.id, moves: [before, a.moves, after].filter(Boolean).join(' ') }))
	);
}

/**
 * How many slots have a piece stranded in a *different* slot.
 *
 * These are the positions no F2L algorithm covers: you cannot pair a corner with
 * its edge while one of them is buried in another slot. The fix is always to lift
 * the offender into the top layer, and counting *pieces* rather than *slots* is
 * what makes that provably progress — when three pairs are tangled in a cycle,
 * one extraction frees a piece without yet freeing any whole pair, so a
 * slot-based count would not budge and the advice could loop forever.
 */
function strandedPieces(state: Facelets): number {
	const { cp, ep } = faceletsToCubie(state);
	const cornerHomes: number[] = F2L_SLOTS.map((s) => s.corner);
	const edgeHomes: number[] = F2L_SLOTS.map((s) => s.edge);
	let n = 0;
	for (const spec of F2L_SLOTS) {
		// Only pieces that belong to *some* slot count. A last-layer piece sitting
		// in a slot is not a problem: an ordinary F2L insertion displaces it as it
		// goes.
		const corner = cp[spec.corner];
		if (corner !== spec.corner && cornerHomes.includes(corner)) n++;
		const edge = ep[spec.edge];
		if (edge !== spec.edge && edgeHomes.includes(edge)) n++;
	}
	return n;
}

/**
 * Short sequences that lift whatever is sitting in a slot up into the top layer,
 * conjugated so they act on the slot named.
 */
function extractions(slot: F2lSlotId): { moves: string }[] {
	const before = SLOT_ROTATION[slot];
	const after = SLOT_ROTATION_UNDO[slot];
	return ["R U R'", "R U' R'", "R U2 R'", "F' U F", "F' U' F", "R U2 R' U' R U R'"].map((alg) => ({
		moves: [before, alg, after].filter(Boolean).join(' ')
	}));
}

/**
 * The three beginner algorithms that carry the whole last layer. Written out
 * here rather than looked up, because the beginner method is defined by these
 * specific sequences and a learner is told to memorise exactly them.
 */
/**
 * The beginner method leans on repeating one algorithm until a step is done, and
 * which repetition helps depends on where the cube is turned to. Rather than
 * quoting the algorithm bare and hoping, each beginner step is searched for the
 * setup turn and repeat count that *demonstrably* moves the step forward.
 *
 * Without this, "repeat sune" is advice that can cycle forever: applied at the
 * wrong angle it undoes exactly what the previous repetition achieved.
 */
function repeated(alg: string, times: number): { moves: string }[] {
	// The instruction is never bare "do it again": it is "turn the top so the next
	// piece is in position, then do it again". Allowing a U turn between
	// repetitions is what makes the sequence able to finish the step at all — with
	// the H corner case, for instance, two sunes with no turn between them get you
	// precisely nowhere.
	let frontier = [alg];
	const out = [{ moves: alg }];
	for (let round = 1; round < times; round++) {
		frontier = frontier.flatMap((chain) =>
			AUF.map((turn) => [chain, turn, alg].filter(Boolean).join(' '))
		);
		out.push(...frontier.map((moves) => ({ moves })));
	}
	return out;
}

/** How many last-layer corners already show the top colour. */
function orientedCorners(state: Facelets): number {
	const { co } = faceletsToCubie(state);
	return LL_CORNERS.filter((slot) => co[slot] === 0).length;
}

/** How many last-layer corners are home, ignoring which way round they face. */
function placedCorners(state: Facelets): number {
	const { cp } = faceletsToCubie(state);
	// Corners count as placed when they sit in the right slot relative to each
	// other, which a closing U turn can always arrange.
	let best = 0;
	for (let auf = 0; auf < 4; auf++) {
		const rotated = auf === 0 ? state : applyAlg(state, AUF[auf]);
		const perm = faceletsToCubie(rotated).cp;
		const n = LL_CORNERS.filter((slot) => perm[slot] === slot).length;
		if (n > best) best = n;
	}
	void cp;
	return best;
}

const BEGINNER = {
	cross: "F R U R' U' F'",
	sune: "R U R' U R U2 R'",
	/*
	 * A corner three-cycle that leaves orientation alone. The commutator usually
	 * quoted for beginners, U R U' L' U R' U' L, twists corners as it goes — fine
	 * in guides that permute the corners *before* orienting them, but wrong here,
	 * where the top face is already yellow by this point and must stay that way.
	 */
	cornerCycle: "R' F R' B2 R F' R' B2 R2",
	edgeCycle: "R U' R U R U R U' R' U' R2"
} as const;

// ---------------------------------------------------------------------------

/** Work out where a cube is and what to do about it. */
export function planSolve(state: Facelets): SolvePlan {
	const analysis = analyze(state);

	if (analysis.solved) {
		return {
			analysis,
			stepName: 'Solved',
			stepDescription: 'Every face is a single colour. Nothing left to do.',
			progress: 1,
			recommendations: [
				{
					tier: 'beginner',
					title: 'This cube is solved',
					detail:
						'Scramble it and go again. If you were timing yourself, the thing worth working on next is usually the pause between steps rather than the steps themselves.'
				}
			]
		};
	}

	if (!analysis.crossSolved) return planCross(state, analysis);
	if (!analysis.f2lSolved) return planF2l(state, analysis);
	if (!analysis.lastLayerOriented) return planOll(state, analysis);
	return planPll(state, analysis);
}

// --- cross -----------------------------------------------------------------

function planCross(state: Facelets, analysis: StateAnalysis): SolvePlan {
	const solution = solveCross(state);
	const recommendations: Recommendation[] = [];

	if (solution) {
		recommendations.push({
			tier: 'beginner',
			title: 'Build the cross one edge at a time',
			detail:
				'Place each yellow edge so that its second colour matches the centre next to it. Do them one at a time and check each is right before starting the next — a cross with one edge in the wrong place will make everything afterwards go wrong in ways that are hard to spot.',
			steps: solution.steps.map((step) => ({
				label: `Place the ${step.edge} edge`,
				moves: step.moves
			})),
			moves: solution.steps.map((s) => s.moves).join(' '),
			moveCount: solution.steps[solution.steps.length - 1]?.total,
			setId: 'beginner-f2l'
		});

		recommendations.push({
			tier: 'intermediate',
			title: `Cross in ${solution.length} move${solution.length === 1 ? '' : 's'}`,
			detail:
				'This is the shortest cross available from here. Every cross can be done in eight moves or fewer, so if yours regularly runs longer, the gain is in planning rather than in turning faster.',
			moves: solution.moves,
			moveCount: solution.length
		});

		recommendations.push({
			tier: 'advanced',
			title: 'Plan the whole cross during inspection',
			detail: `The optimal solution here is ${solution.length} moves. Work it out in your head before you start the timer, then spend the turning itself looking ahead to your first pair rather than at the cross.`,
			moves: solution.moves,
			moveCount: solution.length
		});
	}

	return {
		analysis,
		stepName: 'Cross',
		stepDescription:
			'Four edges around the bottom centre, each matching the centre beside it. Everything else is built on top of this.',
		progress: (analysis.crossProgress / 4) * 0.15,
		recommendations
	};
}

// --- first two layers ------------------------------------------------------

function planF2l(state: Facelets, analysis: StateAnalysis): SolvePlan {
	const unsolved = analysis.slots.filter((s) => !s.solved);
	const recommendations: Recommendation[] = [];

	// Look at every unfinished slot and keep whichever gives the cheapest solution.
	type SlotOption = {
		slot: F2lSlotId;
		rotation: string;
		rotated: Facelets;
		key: string;
		fit: ReturnType<typeof bestFit>;
	};
	// Pairs that are already finished must still be finished afterwards. The
	// library's algorithms guarantee this by construction, but the advice engine
	// should not depend on that being true of every entry.
	const alreadySolved = analysis.slots.filter((x) => x.solved).map((x) => x.id);

	const options: SlotOption[] = unsolved.map((s) => {
		const slot = s.id as F2lSlotId;
		const rotation = SLOT_ROTATION[slot];
		// The case key is read with the slot turned round to the front-right, which
		// is the only frame the F2L library is written for.
		const rotated = rotation ? applyAlg(state, rotation) : state;
		const key = f2lKey(rotated, 'FR');
		return {
			slot,
			rotation,
			rotated,
			key,
			// The fit, though, is judged in the reader's own frame against the
			// conjugated algorithm: the cross must survive and *this* slot must end
			// up filled, with the cube left the way up it started.
			fit: bestFit(state, f2lCandidates(key, slot), (after) => {
				const a = analyze(after);
				if (!a.crossSolved) return false;
				if (!a.slots.find((x) => x.id === slot)!.solved) return false;
				return alreadySolved.every((id) => a.slots.find((x) => x.id === id)!.solved);
			})
		};
	});

	const workable = options.filter((o) => o.fit !== null);
	const cheapest = workable.sort((a, b) => a.fit!.length - b.fit!.length)[0];

	if (cheapest) {
		const prose = SLOT_PROSE[cheapest.slot];
		const withRotation = cheapest.fit!.moves;
		const holdNote =
			cheapest.rotation === ''
				? 'Hold the cube with that slot at the front-right.'
				: `Turn the cube ${cheapest.rotation === 'y2' ? 'half a turn' : cheapest.rotation === 'y' ? 'one turn to the left' : 'one turn to the right'} first, so the slot sits at the front-right.`;

		recommendations.push({
			tier: 'beginner',
			title: `Work on the ${prose} slot`,
			detail: `${holdNote} The beginner method does the corner first and the edge afterwards; if you are ready to do both at once, the intermediate suggestion below pairs them up. Either way, the corner belongs between the two centres whose colours it carries.`,
			moves: withRotation,
			moveCount: htmLength(parseAlg(withRotation)),
			setId: 'beginner-f2l'
		});

		recommendations.push({
			tier: 'intermediate',
			title: `Pair and insert the ${prose} slot`,
			detail: `${holdNote} Pair the corner with its edge in the top layer, then put the pair in with one motion. This solution is ${cheapest.fit!.length} moves.`,
			moves: withRotation,
			moveCount: htmLength(parseAlg(withRotation)),
			caseId: cheapest.fit!.id,
			setId: 'f2l'
		});

		const others = workable.filter((o) => o.slot !== cheapest.slot);
		recommendations.push({
			tier: 'advanced',
			title:
				others.length > 0
					? `Take the ${prose} slot next — it is the cheapest of ${workable.length}`
					: `Finish with the ${prose} slot`,
			detail:
				others.length > 0
					? `The remaining slots cost ${workable
							.map((o) => `${SLOT_PROSE[o.slot]} ${o.fit!.length}`)
							.join(
								', '
							)} moves. Take the cheap one now, but while your hands are busy, look for where the next pair's pieces are — the pause between pairs costs more than the turns do.`
					: 'One pair left. Watch where the last-layer pieces end up as you insert it; if you are learning to influence the last layer, this is the insertion to vary.',
			moves: withRotation,
			moveCount: htmLength(parseAlg(withRotation)),
			caseId: cheapest.fit!.id,
			setId: 'f2l'
		});
	}

	if (!cheapest) {
		// Nothing can be inserted, which means a piece is buried in a slot it does
		// not belong in. Try lifting each unfinished slot in turn, and take whichever
		// move genuinely reduces the number of stranded pairs — so this can never
		// become a move that simply shuffles the problem sideways.
		const strandedBefore = strandedPieces(state);
		let rescue: { slot: F2lSlotId; moves: string; length: number } | null = null;

		for (const option of options) {
			const fit = bestFit(state, extractions(option.slot), (after) => {
				const a = analyze(after);
				if (!a.crossSolved) return false;
				if (!alreadySolved.every((id) => a.slots.find((x) => x.id === id)!.solved)) return false;
				return strandedPieces(after) < strandedBefore;
			});
			if (fit && (!rescue || fit.length < rescue.length)) {
				rescue = { slot: option.slot, moves: fit.moves, length: fit.length };
			}
		}

		if (rescue) {
			const detail = `The two pieces for one of the remaining slots cannot be paired up, because one of them is buried in a slot it does not belong in. Lift it out into the top layer first — hold the ${SLOT_PROSE[rescue.slot]} slot at the front-right and do R U R' — and then carry on as normal. It looks like a step backwards and is not.`;
			recommendations.push({
				tier: 'beginner',
				title: 'Lift a trapped piece out first',
				detail,
				moves: rescue.moves,
				moveCount: rescue.length
			});
			recommendations.push({
				tier: 'advanced',
				title: `Free the ${SLOT_PROSE[rescue.slot]} slot`,
				detail:
					'Nothing is insertable, so a pair has to come out before anything goes in. Watch where both pieces land as you do it — the extraction usually sets up the pair for free.',
				moves: rescue.moves,
				moveCount: rescue.length
			});
		}
	}

	return {
		analysis,
		stepName: 'First two layers',
		stepDescription:
			'Four corner-and-edge pairs, each dropped into the gap between two centres. This is where most of a solve’s time goes.',
		progress: 0.15 + (analysis.f2lProgress / 4) * 0.5,
		recommendations
	};
}

// --- orientation -----------------------------------------------------------

function planOll(state: Facelets, analysis: StateAnalysis): SolvePlan {
	const recommendations: Recommendation[] = [];
	const key = orientationKey(state);

	// Beginner and intermediate both go two-look; they differ in what comes second.
	const crossDone = edgesOriented(state);

	if (!crossDone) {
		const fit = bestFit(state, repeated(BEGINNER.cross, 3), edgesOriented);
		const oriented = LL_EDGES.filter((slot) => faceletsToCubie(state).eo[slot] === 0).length;
		const shape = oriented === 0 ? 'a dot' : 'a line or an L';
		recommendations.push({
			tier: 'beginner',
			title: 'Make the cross on top',
			detail: `You have ${shape} on top. Run F R U R' U' F' — once for an L, once for a line, and twice for a dot, turning the top face between goes so the shape faces you the right way. Ignore the corners entirely for now.`,
			moves: fit?.moves ?? BEGINNER.cross,
			moveCount: htmLength(parseAlg(fit?.moves ?? BEGINNER.cross)),
			setId: 'beginner-ll'
		});

		const twoLook = bestFit(state, candidates('oll-2look'), edgesOriented);
		if (twoLook) {
			recommendations.push({
				tier: 'intermediate',
				title: 'Orient the edges first',
				detail:
					'Two-look OLL splits the job: get the four edges pointing up now, then handle the corners with one of seven algorithms. Ten algorithms total instead of fifty-seven.',
				moves: twoLook.moves,
				moveCount: twoLook.length,
				caseId: twoLook.id,
				setId: 'oll-2look'
			});
		}
	} else {
		// Either finish the job outright, or at least orient one more corner.
		const before = orientedCorners(state);
		const sune =
			bestFit(state, repeated(BEGINNER.sune, 4), isLastLayerOriented) ??
			bestFit(state, repeated(BEGINNER.sune, 3), (after) => orientedCorners(after) > before);
		recommendations.push({
			tier: 'beginner',
			title: 'Turn the corners the right way up',
			detail: `Hold the cube so a corner that still needs turning is at the front-right, then run R U R' U R U2 R'. Repeat it until that corner is yellow on top, move to the next one, and keep going. The top will look badly broken part-way through — that is expected, and it comes back together.`,
			moves: sune?.moves ?? BEGINNER.sune,
			moveCount: htmLength(parseAlg(sune?.moves ?? BEGINNER.sune)),
			setId: 'beginner-ll'
		});

		const twoLook = bestFit(state, candidates('oll-2look'), isLastLayerOriented);
		if (twoLook) {
			recommendations.push({
				tier: 'intermediate',
				title: 'One of the seven corner cases',
				detail:
					'Your edges are already up, so this is the second look: one algorithm finishes the top face.',
				moves: twoLook.moves,
				moveCount: twoLook.length,
				caseId: twoLook.id,
				setId: 'oll-2look'
			});
		}
	}

	// Full OLL: match the case by its computed key, then confirm the algorithm fits.
	const full = casesOfSet('oll').filter((c) => orientationKey(c.caseState) === key);
	const fullFit = bestFit(
		state,
		full.flatMap((c) => c.algs.map((a) => ({ id: c.id, moves: a.moves }))),
		isLastLayerOriented
	);
	if (fullFit) {
		const matched = fullFit.id ? caseById(fullFit.id) : undefined;
		recommendations.push({
			tier: 'advanced',
			title: matched ? `${matched.shortName} — ${matched.name}` : 'Orient the last layer in one go',
			detail:
				(matched?.recognition ? `${matched.recognition} ` : '') +
				`One algorithm turns the whole top face yellow, in ${fullFit.length} moves.`,
			moves: fullFit.moves,
			moveCount: fullFit.length,
			caseId: fullFit.id,
			setId: 'oll'
		});
	}

	return {
		analysis,
		stepName: 'Orienting the last layer',
		stepDescription:
			'Make the whole top face one colour, without caring yet about where the pieces sit.',
		progress: 0.65 + (crossDone ? 0.1 : 0),
		recommendations
	};
}

// --- permutation -----------------------------------------------------------

function planPll(state: Facelets, analysis: StateAnalysis): SolvePlan {
	const recommendations: Recommendation[] = [];
	const key = permutationKey(state);
	const cornersDone = cornersPlaced(state);

	if (!cornersDone) {
		const placedBefore = placedCorners(state);
		const corner =
			bestFit(state, repeated(BEGINNER.cornerCycle, 3), cornersPlaced) ??
			bestFit(
				state,
				repeated(BEGINNER.cornerCycle, 2),
				// Progress means more corners home *without* unpicking the orientation
				// that the previous step just finished.
				(after) => isLastLayerOriented(after) && placedCorners(after) > placedBefore
			);
		recommendations.push({
			tier: 'beginner',
			title: 'Put the corners in the right places',
			detail: `The top is yellow, but the corners are in the wrong places. This algorithm cycles three of them round without disturbing which way up they face. Turn the top until one corner is already correct, hold it at the back-right, and run it — repeating if the first go does not finish the job.`,
			moves: corner?.moves ?? BEGINNER.cornerCycle,
			moveCount: htmLength(parseAlg(corner?.moves ?? BEGINNER.cornerCycle)),
			setId: 'beginner-ll'
		});

		const twoLook = bestFit(state, candidates('pll-2look'), cornersPlaced);
		if (twoLook) {
			recommendations.push({
				tier: 'intermediate',
				title: 'Corners first',
				detail:
					'Two-look PLL does corners then edges. This algorithm puts all four corners home; you will be left with one of only four edge cases.',
				moves: twoLook.moves,
				moveCount: twoLook.length,
				caseId: twoLook.id,
				setId: 'pll-2look'
			});
		}
	} else {
		const edge = bestFit(state, repeated(BEGINNER.edgeCycle, 3), isSolvedIgnoringOrientation);
		recommendations.push({
			tier: 'beginner',
			title: 'Cycle the last three edges',
			detail: `The corners are home, so only the edges are left. Hold the cube so the one edge that is already correct is at the back, then run R U' R U R U R U' R' U' R2. If none looks correct, run it once anyway and one will appear.`,
			moves: edge?.moves ?? BEGINNER.edgeCycle,
			moveCount: htmLength(parseAlg(edge?.moves ?? BEGINNER.edgeCycle)),
			setId: 'beginner-ll'
		});

		const twoLook = bestFit(state, candidates('pll-2look'), isSolvedIgnoringOrientation);
		if (twoLook) {
			recommendations.push({
				tier: 'intermediate',
				title: 'Finish the edges',
				detail:
					'Corners are done, so this is one of the four edge cases: U-perm either way, H, or Z. One algorithm and the cube is solved.',
				moves: twoLook.moves,
				moveCount: twoLook.length,
				caseId: twoLook.id,
				setId: 'pll-2look'
			});
		}
	}

	const full = casesOfSet('pll').filter((c) => permutationKey(c.caseState) === key);
	const fullFit = bestFit(
		state,
		full.flatMap((c) => c.algs.map((a) => ({ id: c.id, moves: a.moves }))),
		isSolvedIgnoringOrientation
	);
	if (fullFit) {
		const matched: ResolvedAlgCase | undefined = fullFit.id ? caseById(fullFit.id) : undefined;
		recommendations.push({
			tier: 'advanced',
			title: matched ? `${matched.name}` : 'Finish in one algorithm',
			detail:
				(matched?.recognition ? `${matched.recognition} ` : '') +
				`This solves the cube outright, in ${fullFit.length} moves including the setup turn.`,
			moves: fullFit.moves,
			moveCount: fullFit.length,
			caseId: fullFit.id,
			setId: 'pll'
		});
	}

	return {
		analysis,
		stepName: 'Permuting the last layer',
		stepDescription: 'The top is all one colour; now slide the pieces round into their places.',
		progress: 0.85 + (cornersDone ? 0.1 : 0),
		recommendations
	};
}

// ---------------------------------------------------------------------------

export interface FullSolveStep {
	stage: string;
	moves: string;
	moveCount: number;
	/** Library case used, if any. */
	caseId?: string;
}

/**
 * Produce a complete solution from any state, by repeatedly asking for advice at
 * one tier and following it.
 *
 * The result is a solve a human could actually perform and follow, not a
 * god's-number solution. `beginner` gives the longest and most explicable route;
 * `advanced` gives roughly what a CFOP solver would do.
 */
export function solveFully(
	state: Facelets,
	tier: SkillTier = 'advanced',
	limit = 60
): { steps: FullSolveStep[]; moves: string; solved: boolean } {
	const steps: FullSolveStep[] = [];
	let current = state;

	for (let guard = 0; guard < limit; guard++) {
		const plan = planSolve(current);
		if (plan.analysis.solved) break;

		// Fall back down the tiers if this one has nothing to say here.
		const order: SkillTier[] = ['expert', 'advanced', 'intermediate', 'beginner'];
		const from = order.indexOf(tier) === -1 ? 1 : order.indexOf(tier);
		const pick =
			plan.recommendations.find((r) => r.tier === tier && r.moves) ??
			order
				.slice(from)
				.map((t) => plan.recommendations.find((r) => r.tier === t && r.moves))
				.find(Boolean) ??
			plan.recommendations.find((r) => r.moves);

		if (!pick?.moves) break;
		steps.push({
			stage: plan.stepName,
			moves: pick.moves,
			moveCount: htmLength(parseAlg(pick.moves)),
			caseId: pick.caseId
		});
		current = applyAlg(current, pick.moves);
	}

	return {
		steps,
		moves: steps.map((s) => s.moves).join(' '),
		solved: analyze(current).solved
	};
}

export { F2L_SLOTS };
