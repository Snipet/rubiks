/**
 * Last-layer and slot analysis.
 *
 * This module answers "which case am I looking at?" — for the algorithm library,
 * for the trainer, and for the advice engine. Cases are identified by a canonical
 * *key* computed from the cube state, normalised over the free U-face turns
 * either side of an algorithm (the "AUF"), so two states that the same algorithm
 * solves always produce the same key.
 *
 * Because keys are computed rather than authored, the library indexes itself: run
 * `orientationKey` on the state an OLL algorithm solves and you have its case id,
 * with no hand-entered recognition data to get wrong.
 *
 * ## Cyclic ordering
 *
 * A U turn sends URF → UFL → ULB → UBR and UR → UF → UL → UB, so listing the
 * last-layer slots in that order turns "apply a U turn" into "rotate the array by
 * one". Every key here relies on that.
 */

import { faceletsToCubie, cubieToFacelets } from './cubie';
import {
	applyAlg,
	isSolvedIgnoringOrientation,
	reorientToStandard,
	solvedFacelets
} from './facelets';
import {
	BL,
	BR,
	DB,
	DBL,
	DF,
	DFR,
	DL,
	DLF,
	DR,
	DRB,
	FL,
	FR,
	UB,
	UBR,
	UF,
	UFL,
	UL,
	ULB,
	UR,
	URF,
	type CubieState,
	type Facelets
} from './types';

/** U-layer corner slots in U-turn cycle order. */
export const LL_CORNERS = [URF, UFL, ULB, UBR] as const;
/** U-layer edge slots in U-turn cycle order. */
export const LL_EDGES = [UR, UF, UL, UB] as const;

/** D-layer corner slots. */
export const D_CORNERS = [DFR, DLF, DBL, DRB] as const;
/** D-layer edge slots — the cross. */
export const D_EDGES = [DR, DF, DL, DB] as const;
/** Middle-slice edge slots. */
export const E_EDGES = [FR, FL, BL, BR] as const;

/** The four first-two-layers slots, each a corner plus its middle-slice edge. */
export const F2L_SLOTS = [
	{ id: 'FR', corner: DFR, edge: FR, label: 'front-right' },
	{ id: 'FL', corner: DLF, edge: FL, label: 'front-left' },
	{ id: 'BL', corner: DBL, edge: BL, label: 'back-left' },
	{ id: 'BR', corner: DRB, edge: BR, label: 'back-right' }
] as const;

export type F2lSlotId = (typeof F2L_SLOTS)[number]['id'];

const AUF_ALGS = ['', 'U', 'U2', "U'"] as const;

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

/**
 * Canonical key for a last-layer *orientation* case — an OLL case.
 *
 * Corner twists and edge flips are unchanged by U turns, so the only freedom is
 * which slot each value sits in. Rotating the pair of arrays through all four
 * offsets and keeping the smallest string gives a key that is the same for every
 * AUF of the case.
 */
export function orientationKey(state: Facelets | CubieState): string {
	const { co, eo } = asCubie(state);
	const c = LL_CORNERS.map((s) => co[s]);
	const e = LL_EDGES.map((s) => eo[s]);
	let best: string | null = null;
	for (let r = 0; r < 4; r++) {
		const key =
			c.map((_, i) => c[(i + r) % 4]).join('') + ':' + e.map((_, i) => e[(i + r) % 4]).join('');
		if (best === null || key < best) best = key;
	}
	return best!;
}

/**
 * Canonical key for a last-layer *permutation* case — a PLL case.
 *
 * A U turn before the algorithm shifts which slot is which; a U turn after it
 * shifts which piece counts as "home". Both freedoms are quotiented out by
 * minimising over all sixteen combinations.
 */
export function permutationKey(state: Facelets | CubieState): string {
	const { cp, ep } = asCubie(state);
	// Reduce to positions within the last layer, in cycle order.
	const cornerAt = new Map<number, number>(LL_CORNERS.map((slot, i) => [slot, i]));
	const edgeAt = new Map<number, number>(LL_EDGES.map((slot, i) => [slot, i]));
	const c = LL_CORNERS.map((slot) => cornerAt.get(cp[slot]) ?? -1);
	const e = LL_EDGES.map((slot) => edgeAt.get(ep[slot]) ?? -1);
	// A piece from outside the last layer means this is not a PLL case at all.
	if (c.includes(-1) || e.includes(-1)) return 'not-ll';

	let best: string | null = null;
	for (let pre = 0; pre < 4; pre++) {
		for (let post = 0; post < 4; post++) {
			const cs = c.map((_, i) => (c[(i + pre) % 4] + post) % 4).join('');
			const es = e.map((_, i) => (e[(i + pre) % 4] + post) % 4).join('');
			const key = `${cs}:${es}`;
			if (best === null || key < best) best = key;
		}
	}
	return best!;
}

/** The key of a solved last layer. */
export const SOLVED_ORIENTATION_KEY = orientationKey(solvedFacelets());
/** The key of an already-permuted last layer. */
export const SOLVED_PERMUTATION_KEY = permutationKey(solvedFacelets());

/**
 * Canonical key for an F2L case at the front-right slot: where the DFR corner and
 * the FR edge are, and how they are twisted, normalised over AUF.
 *
 * Positions are encoded as a cycle index 0–3 for the last layer, or `s` for the
 * slot itself. Anything else — a piece buried in a different slot — yields
 * `elsewhere`, which the solver treats as "get it out first".
 */
export function f2lKey(state: Facelets | CubieState, slot: F2lSlotId = 'FR'): string {
	const spec = F2L_SLOTS.find((s) => s.id === slot)!;
	const { cp, co, ep, eo } = asCubie(state);

	const cornerSlot = findIndexOf(cp, spec.corner);
	const edgeSlot = findIndexOf(ep, spec.edge);

	const cornerPos = LL_CORNERS.indexOf(cornerSlot as never);
	const edgePos = LL_EDGES.indexOf(edgeSlot as never);
	const cornerInSlot = cornerSlot === spec.corner;
	const edgeInSlot = edgeSlot === spec.edge;

	if (cornerPos === -1 && !cornerInSlot) return 'elsewhere';
	if (edgePos === -1 && !edgeInSlot) return 'elsewhere';

	const cornerTwist = co[cornerSlot];
	const edgeFlip = eo[edgeSlot];

	let best: string | null = null;
	for (let pre = 0; pre < 4; pre++) {
		const c = cornerInSlot ? 's' : String((cornerPos + pre) % 4);
		const e = edgeInSlot ? 's' : String((edgePos + pre) % 4);
		const key = `${c}${cornerTwist}:${e}${edgeFlip}`;
		if (best === null || key < best) best = key;
	}
	return best!;
}

function findIndexOf(perm: readonly number[], piece: number): number {
	return perm.indexOf(piece);
}

function asCubie(state: Facelets | CubieState): CubieState {
	return state instanceof Uint8Array ? faceletsToCubie(state) : state;
}

// ---------------------------------------------------------------------------
// Applying algorithms with AUF
// ---------------------------------------------------------------------------

/**
 * Apply `U^pre alg U^post` to a state, reorienting between the algorithm and the
 * closing U turn so that algorithms written with a leading `x` or `y` still get
 * their final AUF on the right face.
 */
export function applyWithAuf(state: Facelets, alg: string, pre: number, post: number): Facelets {
	let s = pre === 0 ? state : applyAlg(state, AUF_ALGS[pre]);
	s = applyAlg(s, alg);
	// Undo any net rotation the algorithm left behind before the closing AUF.
	s = reorientToStandard(s) ?? s;
	return post === 0 ? s : applyAlg(s, AUF_ALGS[post]);
}

export interface AufSolution {
	/** U turns before the algorithm, 0–3 quarter turns. */
	pre: number;
	/** U turns after it. */
	post: number;
	/** Ready-to-read move string, AUF included. */
	full: string;
}

/**
 * Find the setup and finishing U turns that make `alg` solve `state`, if any.
 *
 * `goal` decides what counts as done — a full solve for a PLL algorithm, merely
 * an oriented last layer for an OLL one.
 */
export function findAuf(
	state: Facelets,
	alg: string,
	goal: (s: Facelets) => boolean = isSolvedIgnoringOrientation
): AufSolution | null {
	for (let pre = 0; pre < 4; pre++) {
		for (let post = 0; post < 4; post++) {
			if (goal(applyWithAuf(state, alg, pre, post))) {
				const full = [AUF_ALGS[pre], alg, AUF_ALGS[post]].filter(Boolean).join(' ');
				return { pre, post, full };
			}
		}
	}
	return null;
}

/** True when every last-layer sticker on the U face shows the U colour. */
export function isLastLayerOriented(state: Facelets): boolean {
	for (let i = 0; i < 9; i++) if (state[i] !== 0) return false;
	return true;
}

// ---------------------------------------------------------------------------
// Enumerating every case
// ---------------------------------------------------------------------------

/**
 * Every legal last-layer orientation state, with the first two layers solved and
 * the last layer permuted.
 *
 * Corner twists must sum to a multiple of three and edge flips must be even, so
 * three corners and three edges are free and the fourth of each is forced:
 * 3³ × 2³ = 216 states, of which 215 are unsolved. Those collapse into the 57
 * classic OLL cases under AUF.
 */
export function enumerateOrientations(): Facelets[] {
	const out: Facelets[] = [];
	for (let c = 0; c < 27; c++) {
		const twists = [c % 3, Math.floor(c / 3) % 3, Math.floor(c / 9) % 3, 0];
		twists[3] = (3 - ((twists[0] + twists[1] + twists[2]) % 3)) % 3;
		for (let e = 0; e < 8; e++) {
			const flips = [e & 1, (e >> 1) & 1, (e >> 2) & 1, 0];
			flips[3] = (flips[0] + flips[1] + flips[2]) % 2;
			const state: CubieState = {
				cp: [0, 1, 2, 3, 4, 5, 6, 7],
				co: [0, 0, 0, 0, 0, 0, 0, 0],
				ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			};
			LL_CORNERS.forEach((slot, i) => (state.co[slot] = twists[i]));
			LL_EDGES.forEach((slot, i) => (state.eo[slot] = flips[i]));
			out.push(cubieToFacelets(state));
		}
	}
	return out;
}

/**
 * Every legal last-layer permutation state, with everything oriented.
 *
 * Corner and edge permutation parity must agree, so of the 24 × 24 combinations
 * only half are reachable: 288 states, collapsing into 21 PLL cases plus solved
 * under AUF.
 */
export function enumeratePermutations(): Facelets[] {
	const out: Facelets[] = [];
	const perms = permutationsOf4();
	for (const c of perms) {
		for (const e of perms) {
			if (parity4(c) !== parity4(e)) continue;
			const state: CubieState = {
				cp: [0, 1, 2, 3, 4, 5, 6, 7],
				co: [0, 0, 0, 0, 0, 0, 0, 0],
				ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
				eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			};
			LL_CORNERS.forEach((slot, i) => (state.cp[slot] = LL_CORNERS[c[i]]));
			LL_EDGES.forEach((slot, i) => (state.ep[slot] = LL_EDGES[e[i]]));
			out.push(cubieToFacelets(state));
		}
	}
	return out;
}

/**
 * Every F2L state for the front-right slot: the other three slots and the cross
 * solved, with the DFR corner and FR edge distributed between the last layer and
 * the slot itself.
 *
 * The 41 classic cases are what these collapse to under AUF, once the solved
 * state is excluded.
 */
export function enumerateF2l(): Facelets[] {
	const out: Facelets[] = [];
	const cornerHomes = [...LL_CORNERS, DFR];
	const edgeHomes = [...LL_EDGES, FR];

	for (const cornerSlot of cornerHomes) {
		for (let twist = 0; twist < 3; twist++) {
			for (const edgeSlot of edgeHomes) {
				for (let flip = 0; flip < 2; flip++) {
					const state: CubieState = {
						cp: [0, 1, 2, 3, 4, 5, 6, 7],
						co: [0, 0, 0, 0, 0, 0, 0, 0],
						ep: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
						eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					};
					// Slots whose contents the case itself pins down, and which the
					// parity fix below must therefore leave alone.
					const usedEdges = new Set<number>([FR]);

					if (cornerSlot !== DFR) {
						// The corner sits in the last layer, displacing the last-layer
						// corner that belongs there into the now-empty slot.
						state.cp[cornerSlot] = DFR;
						state.cp[DFR] = cornerSlot;
						state.co[cornerSlot] = twist;
						// Twists across the whole cube must still sum to a multiple of three.
						state.co[DFR] = (3 - twist) % 3;
					} else {
						state.co[DFR] = twist;
						// A lone twisted corner is illegal, so balance it on a last-layer one.
						state.co[URF] = (3 - twist) % 3;
					}

					if (edgeSlot !== FR) {
						state.ep[edgeSlot] = FR;
						state.ep[FR] = edgeSlot;
						state.eo[edgeSlot] = flip;
						state.eo[FR] = flip;
						usedEdges.add(edgeSlot);
					} else {
						state.eo[FR] = flip;
						state.eo[UR] = flip;
						usedEdges.add(UR);
					}

					// Corner and edge permutation parity must agree. Each two-piece swap
					// above flipped one of them, so when only one happened the state is
					// unreachable. Fix it by swapping two last-layer edges the case does
					// not care about — that shifts edge parity and nothing else.
					if (parityOf(state.cp) !== parityOf(state.ep)) {
						const free = LL_EDGES.filter((slot) => !usedEdges.has(slot));
						const [a, b] = free;
						[state.ep[a], state.ep[b]] = [state.ep[b], state.ep[a]];
						[state.eo[a], state.eo[b]] = [state.eo[b], state.eo[a]];
					}

					out.push(cubieToFacelets(state));
				}
			}
		}
	}
	return out;
}

function parityOf(perm: readonly number[]): 0 | 1 {
	let swaps = 0;
	const a = [...perm];
	for (let i = 0; i < a.length; i++) {
		while (a[i] !== i) {
			const j = a[i];
			[a[i], a[j]] = [a[j], a[i]];
			swaps++;
		}
	}
	return (swaps % 2) as 0 | 1;
}

function permutationsOf4(): number[][] {
	const out: number[][] = [];
	const walk = (prefix: number[], rest: number[]) => {
		if (rest.length === 0) {
			out.push(prefix);
			return;
		}
		rest.forEach((v, i) => walk([...prefix, v], [...rest.slice(0, i), ...rest.slice(i + 1)]));
	};
	walk([], [0, 1, 2, 3]);
	return out;
}

function parity4(p: readonly number[]): 0 | 1 {
	let swaps = 0;
	const a = [...p];
	for (let i = 0; i < a.length; i++) {
		while (a[i] !== i) {
			const j = a[i];
			[a[i], a[j]] = [a[j], a[i]];
			swaps++;
		}
	}
	return (swaps % 2) as 0 | 1;
}

// ---------------------------------------------------------------------------
// Whole-state analysis
// ---------------------------------------------------------------------------

export type Stage =
	| 'solved'
	| 'last-layer-permutation'
	| 'last-layer-orientation'
	| 'first-two-layers'
	| 'first-layer-corners'
	| 'cross'
	| 'scrambled';

export interface SlotStatus {
	id: F2lSlotId;
	label: string;
	cornerPlaced: boolean;
	edgePlaced: boolean;
	solved: boolean;
}

export interface StateAnalysis {
	solved: boolean;
	/** The four D-layer edges, in place and the right way up. */
	crossSolved: boolean;
	crossProgress: number;
	/** Cross plus all four D-layer corners — the beginner's "first layer". */
	firstLayerSolved: boolean;
	dCornersPlaced: number;
	slots: SlotStatus[];
	f2lSolved: boolean;
	f2lProgress: number;
	lastLayerOriented: boolean;
	lastLayerPermuted: boolean;
	/** The furthest step the solver has genuinely reached. */
	stage: Stage;
	/** Case keys, where the stage makes them meaningful. */
	orientationKey: string;
	permutationKey: string;
}

/**
 * Work out how far through a solve a state is.
 *
 * The order matters: a state only counts as "at OLL" if the first two layers are
 * genuinely finished. Someone whose cube looks nearly done but has a corner
 * buried in the middle layer needs to hear about that corner, not about OLL.
 */
export function analyze(state: Facelets): StateAnalysis {
	const cubie = faceletsToCubie(state);
	const { cp, co, ep, eo } = cubie;

	const edgeSolved = (slot: number) => ep[slot] === slot && eo[slot] === 0;
	const cornerSolved = (slot: number) => cp[slot] === slot && co[slot] === 0;

	const crossProgress = D_EDGES.filter(edgeSolved).length;
	const crossSolved = crossProgress === 4;
	const dCornersPlaced = D_CORNERS.filter(cornerSolved).length;

	const slots: SlotStatus[] = F2L_SLOTS.map((s) => {
		const cornerPlaced = cornerSolved(s.corner);
		const edgePlaced = edgeSolved(s.edge);
		return {
			id: s.id,
			label: s.label,
			cornerPlaced,
			edgePlaced,
			solved: cornerPlaced && edgePlaced
		};
	});
	const f2lProgress = slots.filter((s) => s.solved).length;
	const f2lSolved = crossSolved && f2lProgress === 4;

	const lastLayerOriented =
		LL_CORNERS.every((s) => co[s] === 0) && LL_EDGES.every((s) => eo[s] === 0);
	const lastLayerPermuted =
		LL_CORNERS.every((s) => cp[s] === s) && LL_EDGES.every((s) => ep[s] === s);
	const solved = f2lSolved && lastLayerOriented && lastLayerPermuted;

	let stage: Stage;
	if (solved) stage = 'solved';
	else if (f2lSolved && lastLayerOriented) stage = 'last-layer-permutation';
	else if (f2lSolved) stage = 'last-layer-orientation';
	else if (crossSolved && dCornersPlaced === 4 && f2lProgress < 4) {
		// The beginner method finishes the whole first layer before the middle one.
		stage = f2lProgress > 0 ? 'first-two-layers' : 'first-layer-corners';
	} else if (crossSolved) stage = 'first-two-layers';
	else if (crossProgress > 0) stage = 'cross';
	else stage = 'scrambled';

	return {
		solved,
		crossSolved,
		crossProgress,
		firstLayerSolved: crossSolved && dCornersPlaced === 4,
		dCornersPlaced,
		slots,
		f2lSolved,
		f2lProgress,
		lastLayerOriented,
		lastLayerPermuted,
		stage,
		orientationKey: orientationKey(cubie),
		permutationKey: permutationKey(cubie)
	};
}
