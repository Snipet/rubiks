/**
 * What to do next on a 2×2, at whatever level you are.
 *
 * The same shape as the 3×3 planner: work out which step the puzzle is at, then
 * say something different about it to a beginner, to someone learning Ortega,
 * and to someone who just wants the shortest answer.
 *
 * Every suggestion is *checked before it is offered*. A recommendation is
 * generated, applied to the actual state, and kept only if the result really
 * reaches the goal it claims to. Nothing here is trusted because it looks right.
 */

import type { SkillTier } from '$data/types';
import {
	firstFaceBuilt,
	firstLayerSolved,
	isSolvedPocket,
	lastLayerOriented,
	playPocket,
	POCKET_MOVES,
	pocketOrientationKey,
	pocketPermutationKey,
	solvePocket,
	turnPocket,
	type PocketState
} from '../pocket';

export interface PocketRecommendation {
	tier: SkillTier;
	title: string;
	detail: string;
	moves?: string;
	moveCount?: number;
	caseId?: string;
	setId?: string;
}

export type PocketStage = 'solved' | 'first-layer' | 'orient' | 'permute';

export interface PocketPlan {
	stage: PocketStage;
	stepName: string;
	stepDescription: string;
	/** Rough fraction of the solve done, for a progress bar. */
	progress: number;
	/** Length of the shortest solution from here, whatever method you use. */
	optimalLength: number;
	recommendations: PocketRecommendation[];
}

const AUF = ['', 'U', 'U2', "U'"];

/** The shortest sequence of turns reaching a goal, or `null` within the depth. */
function searchFor(
	start: PocketState,
	goal: (s: PocketState) => boolean,
	maxDepth: number
): string[] | null {
	if (goal(start)) return [];
	const path: string[] = [];
	const walk = (state: PocketState, depth: number, lastFace: string): boolean => {
		if (depth === 0) return false;
		for (const move of POCKET_MOVES) {
			if (move[0] === lastFace) continue;
			const next = turnPocket(state, move);
			path.push(move);
			if (goal(next) || walk(next, depth - 1, move[0])) return true;
			path.pop();
		}
		return false;
	};
	for (let depth = 1; depth <= maxDepth; depth++) {
		path.length = 0;
		if (walk(start, depth, '')) return [...path];
	}
	return null;
}

/**
 * Repeat one algorithm, with a turn of the top allowed between goes, until the
 * goal is met. This is what "keep doing sune" actually means: without the turn
 * in between, two sunes in a row get you nowhere on half the cases.
 */
function repeatWithAuf(
	start: PocketState,
	alg: readonly string[],
	goal: (s: PocketState) => boolean,
	maxRepeats: number
): string[] | null {
	interface Node {
		state: PocketState;
		moves: string[];
	}
	let frontier: Node[] = [{ state: start, moves: [] }];
	for (let round = 0; round < maxRepeats; round++) {
		const next: Node[] = [];
		for (const node of frontier) {
			for (const auf of AUF) {
				const setup = auf ? [auf] : [];
				const moves = [...node.moves, ...setup, ...alg];
				const state = playPocket(node.state, [...setup, ...alg]);
				if (goal(state)) {
					// One last adjusting turn is often what finishes it.
					for (const finish of AUF) {
						const done = finish ? turnPocket(state, finish) : state;
						if (goal(done)) return finish ? [...moves, finish] : moves;
					}
					return moves;
				}
				next.push({ state, moves });
			}
		}
		frontier = next;
	}
	return null;
}

/** Try each candidate with a turn of the top before and after; keep what works. */
function bestFit(
	start: PocketState,
	candidates: readonly { id: string; moves: string }[],
	goal: (s: PocketState) => boolean
): { id: string; moves: string } | null {
	let best: { id: string; moves: string; length: number } | null = null;
	for (const candidate of candidates) {
		const alg = candidate.moves.split(/\s+/);
		for (const before of AUF) {
			for (const after of AUF) {
				const full = [...(before ? [before] : []), ...alg, ...(after ? [after] : [])];
				let state: PocketState;
				try {
					state = playPocket(start, full);
				} catch {
					continue; // uses a turn the corner model does not hold still for
				}
				if (!goal(state)) continue;
				if (!best || full.length < best.length) {
					best = { id: candidate.id, moves: full.join(' '), length: full.length };
				}
			}
		}
	}
	return best ? { id: best.id, moves: best.moves } : null;
}

/** The seven orientation algorithms, keyed by the case each one solves. */
const ORIENT_ALGS: readonly { id: string; moves: string }[] = [
	{ id: 'pocket-oll-sune', moves: "R U R' U R U2 R'" },
	{ id: 'pocket-oll-antisune', moves: "R U2 R' U' R U' R'" },
	{ id: 'pocket-oll-t', moves: "R U R' U' R' F R F'" },
	{ id: 'pocket-oll-u', moves: "F R U R' U' F'" },
	{ id: 'pocket-oll-l', moves: "F R' F' R U R U' R'" },
	{ id: 'pocket-oll-pi', moves: "F R U R' U' R U R' U' F'" },
	{ id: 'pocket-oll-h', moves: 'R2 U2 R U2 R2' }
];

const PERMUTE_ALGS: readonly { id: string; moves: string }[] = [
	{ id: 'pocket-pll-adjacent', moves: "R U R' F' R U R' U' R' F R2 U' R'" },
	{ id: 'pocket-pll-diagonal', moves: "R U' R' U' F2 U' R U R' U F2" }
];

const PBL_ALGS: readonly { id: string; moves: string }[] = [
	{ id: 'pocket-pbl-both-diagonal', moves: 'R2 F2 R2' },
	{ id: 'pocket-pbl-adjacent-diagonal', moves: "R U' R F2 R' U R'" },
	{ id: 'pocket-pbl-both-adjacent', moves: "R2 U' B2 U2 R2 U' R2" },
	{ id: 'pocket-pbl-bottom-diagonal', moves: "R U' R' U' F2 U' R U R' U F2" },
	{ id: 'pocket-pbl-bottom-adjacent', moves: "R U R' F' R U R' U' R' F R2 U' R'" }
];

const SUNE = ['R', 'U', "R'", 'U', 'R', 'U2', "R'"];

/** Work out what to say about a 2×2 in a given state. */
export function planPocket(state: PocketState): PocketPlan {
	const optimal = solvePocket(state);
	const optimalLength = optimal?.length ?? 0;

	if (isSolvedPocket(state)) {
		return {
			stage: 'solved',
			stepName: 'Solved',
			stepDescription: 'Nothing left to do. Scramble it and go again.',
			progress: 1,
			optimalLength: 0,
			recommendations: []
		};
	}

	const recommendations: PocketRecommendation[] = [];
	const expert: PocketRecommendation = {
		tier: 'expert',
		title: `Shortest possible: ${optimalLength} moves`,
		detail:
			'Worked out by searching every sequence, so nothing shorter exists. It will not resemble a method, and that is the point — it is the floor, not a technique.',
		moves: optimal?.join(' '),
		moveCount: optimalLength
	};

	/**
	 * Make sure every tier has something to do before handing the plan over.
	 *
	 * The searches above are depth-limited, and a route can reach a position its
	 * own method has no short answer for — a 2×2 whose bottom is a solid face but
	 * whose corners are cycled underneath, for instance. Rather than show a reader
	 * an empty panel, fall through to the sequence that certainly works and say
	 * plainly that it is not part of the method.
	 */
	const finalise = (): PocketRecommendation[] => {
		for (const tier of ['beginner', 'intermediate'] as const) {
			if (recommendations.some((r) => r.tier === tier && r.moves)) continue;
			if (!optimal) continue;
			recommendations.push({
				tier,
				title: 'No step of the method fits this position',
				detail:
					'The puzzle has landed somewhere the usual sequence of steps has no short answer for. This is not an algorithm to learn — it is a way out of here, worked out by searching.',
				moves: optimal.join(' '),
				moveCount: optimal.length
			});
		}
		recommendations.push(expert);
		return recommendations;
	};

	const layerDone = firstLayerSolved(state);
	const faceDone = firstFaceBuilt(state);
	const oriented = faceDone && lastLayerOriented(state);

	// The two routes disagree about what "done with the bottom" means, so they
	// are built separately rather than forced through one ladder of stages. The
	// beginner solves the bottom *layer*; Ortega settles for the bottom *face*
	// and pays for it at the end. Both are followed literally by the tests.

	// --- the bottom -------------------------------------------------------
	if (!layerDone) {
		const toLayer = searchFor(state, firstLayerSolved, 9);
		if (toLayer && toLayer.length > 0) {
			recommendations.push({
				tier: 'beginner',
				title: 'Finish the bottom layer',
				detail:
					'Four corners, each needing all three of its colours to match the faces it touches. This is one way there from where you are — but try to find it yourself first, because working the bottom out by eye is the one part of a 2×2 that no algorithm replaces.',
				moves: toLayer.join(' '),
				moveCount: toLayer.length
			});
		}
	}
	if (!faceDone) {
		const toFace = searchFor(state, firstFaceBuilt, 9);
		if (toFace && toFace.length > 0) {
			recommendations.push({
				tier: 'intermediate',
				title: 'Build the bottom face, not the layer',
				detail:
					'Ortega asks only for one colour facing down; those four corners can be in any order. Quicker to build, and the order gets sorted out at the end along with the top.',
				moves: toFace.join(' '),
				moveCount: toFace.length,
				setId: 'pocket-pbl'
			});
		}
	}

	if (!faceDone) {
		return {
			recommendations: finalise(),
			stage: 'first-layer',
			stepName: 'The bottom',
			stepDescription:
				'Get the bottom done — a whole layer if you are following the beginner route, or just a solid face if you are learning Ortega.',
			progress: 0.15,
			optimalLength
		};
	}

	// --- orientation ------------------------------------------------------
	if (!oriented) {
		const key = pocketOrientationKey(state);
		const sunes = repeatWithAuf(state, SUNE, (s) => lastLayerOriented(s), 3);
		const fit = bestFit(state, ORIENT_ALGS, (s) => lastLayerOriented(s));

		if (sunes && sunes.length > 0) {
			const goes = sunes.filter((m) => m === "R'").length / 2;
			recommendations.push({
				tier: 'beginner',
				title: goes > 1 ? `Sune, ${goes} times` : 'Sune',
				detail:
					'You do not need seven algorithms for this step. Sune, a turn of the top, sune again, and so on orients any case at all. Slower than knowing the case, but it means you can finish the puzzle tonight.',
				moves: sunes.join(' '),
				moveCount: sunes.length,
				caseId: 'pocket-oll-sune'
			});
		}
		if (fit) {
			recommendations.push({
				tier: 'intermediate',
				title: 'One algorithm for this case',
				detail:
					'There are exactly seven ways the top of a 2×2 can be twisted, and this is one of them. Any turn of the top at the start is the adjusting turn — do that first, then the algorithm.',
				moves: fit.moves,
				moveCount: fit.moves.split(' ').length,
				caseId: fit.id,
				setId: 'pocket-oll'
			});
		}
		return {
			recommendations: finalise(),
			stage: 'orient',
			stepName: 'Orient the top',
			stepDescription: `Turn every top-colour sticker upwards. Twist pattern ${key} — one of the seven.`,
			progress: 0.55,
			optimalLength
		};
	}

	// --- permutation ------------------------------------------------------
	// With the bottom a solid face and the top oriented, the finish is either an
	// ordinary last-layer swap (bottom layer already right) or Ortega's PBL,
	// which sorts both layers at once.
	const kind = pocketPermutationKey(state);
	const fit = bestFit(state, layerDone ? PERMUTE_ALGS : PBL_ALGS, isSolvedPocket);
	if (fit && layerDone) {
		recommendations.push({
			tier: 'beginner',
			title: kind === 'diagonal' ? 'Two corners across from each other' : 'Two neighbours to swap',
			detail:
				kind === 'diagonal'
					? 'No face of the top shows a matching pair, which only happens when the two corners that need trading are diagonally opposite.'
					: 'One face of the top shows two matching stickers. Put that face at the back; the pair in front of you is what swaps.',
			moves: fit.moves,
			moveCount: fit.moves.split(' ').length,
			caseId: fit.id,
			setId: 'pocket-pll'
		});
	} else if (fit) {
		recommendations.push({
			tier: 'intermediate',
			title: 'Permute both layers at once',
			detail:
				'The bottom is a solid face but the corners under it are not in order, which is the price Ortega pays for building a face instead of a layer. One algorithm settles both ends.',
			moves: fit.moves,
			moveCount: fit.moves.split(' ').length,
			caseId: fit.id,
			setId: 'pocket-pbl'
		});
	} else if (optimal) {
		// The five PBL algorithms are written for a particular way of holding the
		// puzzle, and turning the top is not always enough to get there. Rather
		// than print one that does not work, say so and give the answer that does.
		recommendations.push({
			tier: 'intermediate',
			title: 'No stored algorithm fits this way round',
			detail:
				'The PBL algorithms assume you have turned the puzzle over to put the easier layer on the bottom, which is a move this page cannot make for you. Here is a sequence that finishes it from exactly where you are.',
			moves: optimal.join(' '),
			moveCount: optimal.length,
			setId: 'pocket-pbl'
		});
	}
	return {
		recommendations: finalise(),
		stage: 'permute',
		stepName: layerDone ? 'Permute the top' : 'Permute both layers',
		stepDescription: layerDone
			? 'Everything faces the right way; the last job is putting the top corners in the right places.'
			: 'Both layers show solid faces. What is left is getting the corners of each into the right order.',
		progress: 0.8,
		optimalLength
	};
}
