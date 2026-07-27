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

import { applyAlg, isSolvedIgnoringOrientation, solvedFacelets } from '../facelets';
import { htmLength, parseAlg } from '../moves';
import {
	analyze,
	f2lKey,
	F2L_SLOTS,
	findAuf,
	isLastLayerOriented,
	LL_EDGES,
	orientationKey,
	permutationKey,
	type F2lSlotId,
	type StateAnalysis
} from '../ll';
import { faceletsToCubie } from '../cubie';
import type { Facelets } from '../types';
import { solveCross } from './cross';
import { casesOfSet, caseById } from '$data/algorithms';
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

const SLOT_PROSE: Record<F2lSlotId, string> = {
	FR: 'front-right',
	FL: 'front-left',
	BL: 'back-left',
	BR: 'back-right'
};

/**
 * Try every candidate algorithm with every AUF, and return the shortest that
 * reaches `goal`.
 *
 * This is the workhorse: rather than trusting a lookup table, the engine
 * verifies on the spot that the algorithm it is about to recommend actually
 * works on the cube in front of the user.
 */
function bestFit(
	state: Facelets,
	candidates: readonly { id?: string; moves: string }[],
	goal: (s: Facelets) => boolean
): { id?: string; moves: string; length: number } | null {
	let best: { id?: string; moves: string; length: number } | null = null;
	for (const candidate of candidates) {
		const fit = findAuf(state, candidate.moves, goal);
		if (!fit) continue;
		const length = htmLength(parseAlg(fit.full));
		if (!best || length < best.length) best = { id: candidate.id, moves: fit.full, length };
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
 * The three beginner algorithms that carry the whole last layer. Written out
 * here rather than looked up, because the beginner method is defined by these
 * specific sequences and a learner is told to memorise exactly them.
 */
const BEGINNER = {
	cross: "F R U R' U' F'",
	sune: "R U R' U R U2 R'",
	cornerCycle: "U R U' L' U R' U' L",
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
	const options: SlotOption[] = unsolved.map((s) => {
		const rotation = SLOT_ROTATION[s.id as F2lSlotId];
		const rotated = rotation ? applyAlg(state, rotation) : state;
		return {
			slot: s.id as F2lSlotId,
			rotation,
			rotated,
			key: f2lKey(rotated, 'FR'),
			fit: bestFit(rotated, candidates('f2l'), (after) => {
				const a = analyze(after);
				return a.crossSolved && a.slots.find((x) => x.id === 'FR')!.solved;
			})
		};
	});

	const workable = options.filter((o) => o.fit !== null);
	const cheapest = workable.sort((a, b) => a.fit!.length - b.fit!.length)[0];
	const stuck = options.filter((o) => o.key === 'elsewhere');

	if (cheapest) {
		const prose = SLOT_PROSE[cheapest.slot];
		const withRotation = [cheapest.rotation, cheapest.fit!.moves].filter(Boolean).join(' ');
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

	if (stuck.length > 0 && !cheapest) {
		recommendations.push({
			tier: 'beginner',
			title: 'A piece is trapped in the wrong slot',
			detail: `The pieces for the ${stuck.map((o) => SLOT_PROSE[o.slot]).join(' and ')} slot are stuck in a slot they do not belong in. Pull one out into the top layer first — hold the offending slot at the front-right and do R U R' — then carry on as normal.`,
			moves: "R U R'",
			moveCount: 3
		});
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
		const fit = findAuf(state, BEGINNER.cross, edgesOriented);
		const oriented = LL_EDGES.filter((slot) => faceletsToCubie(state).eo[slot] === 0).length;
		const shape = oriented === 0 ? 'a dot' : 'a line or an L';
		recommendations.push({
			tier: 'beginner',
			title: 'Make the cross on top',
			detail: `You have ${shape} on top. Run F R U R' U' F' — once for an L, once for a line, and twice for a dot, turning the top face between goes so the shape faces you the right way. Ignore the corners entirely for now.`,
			moves: fit?.full ?? BEGINNER.cross,
			moveCount: htmLength(parseAlg(fit?.full ?? BEGINNER.cross)),
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
		const sune = findAuf(state, BEGINNER.sune, isLastLayerOriented);
		recommendations.push({
			tier: 'beginner',
			title: 'Turn the corners the right way up',
			detail: `Hold the cube so a corner that still needs turning is at the front-right, then run R U R' U R U2 R'. Repeat it until that corner is yellow on top, move to the next one, and keep going. The top will look badly broken part-way through — that is expected, and it comes back together.`,
			moves: sune?.full ?? BEGINNER.sune,
			moveCount: htmLength(parseAlg(sune?.full ?? BEGINNER.sune)),
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
		const corner = findAuf(state, BEGINNER.cornerCycle, cornersPlaced);
		recommendations.push({
			tier: 'beginner',
			title: 'Put the corners in the right places',
			detail: `Find two corners that are already next to each other correctly — hold that pair at the back — then run U R U' L' U R' U' L. Repeat until all four corners sit between the right centres. Their colours will still be facing every which way; that is the next step's problem.`,
			moves: corner?.full ?? BEGINNER.cornerCycle,
			moveCount: htmLength(parseAlg(corner?.full ?? BEGINNER.cornerCycle)),
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
		const edge = findAuf(state, BEGINNER.edgeCycle, isSolvedIgnoringOrientation);
		recommendations.push({
			tier: 'beginner',
			title: 'Cycle the last three edges',
			detail: `The corners are home, so only the edges are left. Hold the cube so the one edge that is already correct is at the back, then run R U' R U R U R U' R' U' R2. If none looks correct, run it once anyway and one will appear.`,
			moves: edge?.full ?? BEGINNER.edgeCycle,
			moveCount: htmLength(parseAlg(edge?.full ?? BEGINNER.edgeCycle)),
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
