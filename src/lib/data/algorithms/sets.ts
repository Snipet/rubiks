/**
 * The algorithm sets, and what each one is for.
 *
 * Ordered roughly by when a learner meets them, which is also the order they
 * appear in the library's sidebar.
 */

import type { AlgSetId, AlgSetMeta } from '../types';

export const ALG_SETS: readonly AlgSetMeta[] = [
	{
		id: 'beginner-f2l',
		name: 'Beginner — first two layers',
		shortName: 'Beginner F2L',
		summary: 'The handful of moves that get the bottom two layers done, one piece at a time.',
		description:
			'The beginner method builds the cube in strict order: a cross on the bottom, then the four bottom corners, then the four middle edges. It is not fast, but every step is a short sequence you can understand rather than memorise, and nothing here will be wasted — the same finger patterns reappear in F2L later.',
		tier: 'beginner',
		view: 'f2l',
		verify: 'well-formed',
		groups: ['Cross', 'Bottom corners', 'Middle edges']
	},
	{
		id: 'beginner-ll',
		name: 'Beginner — last layer',
		shortName: 'Beginner LL',
		summary: 'Four steps and a handful of algorithms to finish the cube.',
		description:
			'Finishing the last layer the beginner way splits into four steps: make the cross on top, orient the corners, put the corners in the right places, then the edges. Six short algorithms cover all of it, and two of them are the same sequence applied differently.',
		tier: 'beginner',
		view: 'last-layer',
		verify: 'well-formed',
		groups: ['Top cross', 'Corner orientation', 'Corner permutation', 'Edge permutation']
	},
	{
		id: 'f2l',
		name: 'F2L — first two layers',
		shortName: 'F2L',
		summary:
			'All 41 ways a corner and its edge can be arranged, and the most efficient way to pair and insert each.',
		description:
			'F2L replaces the beginner method\'s "corners then edges" with "pair them up, then insert the pair". It is the single biggest speed gain available, and most of it can be worked out rather than memorised — the algorithms here are what your hands settle into once you understand the idea. Learn to see the pair, not the sequence.',
		tier: 'intermediate',
		view: 'f2l',
		verify: 'f2l',
		expectedCount: 41,
		groups: [
			'Corner in the top, edge in the top',
			'Corner in the top, edge in the slot',
			'Corner in the slot, edge in the top',
			'Both pieces in the slot'
		]
	},
	{
		id: 'oll-2look',
		name: 'Two-look OLL',
		shortName: '2-look OLL',
		summary: 'Orient the last layer in two steps using ten algorithms instead of fifty-seven.',
		description:
			'A route through OLL for people who do not want to learn 57 algorithms yet. First make the yellow cross with one of three algorithms, then orient the corners with one of seven. It costs a few moves and one extra pause compared with full OLL, and it gets you almost all of the benefit for a fifth of the memorisation.',
		tier: 'intermediate',
		view: 'oll',
		// The first step's three cases orient edges while ignoring corners, so they
		// are not OLL cases and are authored here. The second step's seven are
		// genuine OLL cases — the ones where every edge is already oriented — and
		// are borrowed rather than duplicated.
		verify: 'll-edges',
		groups: ['Edge orientation', 'Corner orientation'],
		derivedFrom: {
			source: 'oll',
			caseIds: ['oll-21', 'oll-22', 'oll-23', 'oll-24', 'oll-25', 'oll-26', 'oll-27']
		}
	},
	{
		id: 'oll',
		name: 'OLL — orientation of the last layer',
		shortName: 'OLL',
		summary: 'All 57 cases, each turning the top face yellow in one algorithm.',
		description:
			'OLL makes the whole top face one colour in a single algorithm, ignoring where the pieces end up. The 57 cases sound daunting; they are not learnt in one go. Most people pick them up in groups that share a shape or a trigger, and the awkward ones — the dots — come last because they are also the rarest.',
		tier: 'advanced',
		view: 'oll',
		verify: 'oll',
		expectedCount: 57,
		groups: [
			'All edges oriented',
			'T shapes',
			'Squares',
			'C shapes',
			'W shapes',
			'Corners oriented',
			'P shapes',
			'I shapes',
			'Fish shapes',
			'Knight move shapes',
			'Awkward shapes',
			'L shapes',
			'Lightning bolts',
			'Dots'
		]
	},
	{
		id: 'pll-2look',
		name: 'Two-look PLL',
		shortName: '2-look PLL',
		summary: 'Permute the last layer in two steps with six algorithms instead of twenty-one.',
		description:
			'Corners first, then edges. Two algorithms handle every corner case and four handle every edge case, so six algorithms finish any last layer. This is the natural stepping stone to full PLL, and the algorithms are all part of the full set — nothing learnt here is thrown away.',
		tier: 'intermediate',
		view: 'pll',
		verify: 'well-formed',
		groups: ['Corner permutation', 'Edge permutation'],
		derivedFrom: {
			source: 'pll',
			caseIds: ['pll-aa', 'pll-ab', 'pll-e', 'pll-ua', 'pll-ub', 'pll-h', 'pll-z']
		}
	},
	{
		id: 'pll',
		name: 'PLL — permutation of the last layer',
		shortName: 'PLL',
		summary: 'All 21 cases, each finishing the cube in one algorithm.',
		description:
			'The last algorithm of every solve. Twenty-one cases, all of them worth knowing well — this is the set where fluency pays off most, because it is the one you use every single solve. Learn the recognition as carefully as the fingers: knowing a T-perm is useless if it takes you two seconds to see that it is a T-perm.',
		tier: 'intermediate',
		view: 'pll',
		verify: 'pll',
		expectedCount: 21,
		groups: [
			'Edges only',
			'Corners only',
			'Adjacent corner swap',
			'Diagonal corner swap',
			'G permutations'
		]
	},
	{
		id: 'coll',
		name: 'COLL — corners of the last layer',
		shortName: 'COLL',
		summary:
			'Orient and permute the last-layer corners at once, leaving the edges oriented but scrambled.',
		description:
			'COLL solves the corners completely while the edges stay oriented, which leaves you with one of only four edge cases to finish — U-perm either way, H, or Z. It is the first real step past CFOP and the usual gateway into one-look last layers, because a fair few of these algorithms are ones you already know from OLL.',
		tier: 'expert',
		view: 'last-layer',
		verify: 'coll',
		groups: [
			'Corners oriented',
			'Sune family',
			'Anti-sune family',
			'Pi family',
			'H family',
			'L family',
			'T family',
			'U family'
		]
	},
	{
		id: 'winter-variation',
		name: 'Winter Variation',
		shortName: 'WV',
		summary:
			'Orient the last-layer corners while inserting the final F2L pair, skipping most of OLL.',
		description:
			'When the last F2L pair is ready to insert with a plain three-move insertion and the last layer edges are already oriented, Winter Variation lets you insert the pair and orient all four corners in one algorithm. You arrive at the last layer with only corner permutation and edge permutation left. Cheap to learn relative to the payoff, and a good first taste of "influencing" a later step.',
		tier: 'expert',
		view: 'f2l',
		verify: 'well-formed',
		groups: [
			'Sune cases',
			'Anti-sune cases',
			'Pi cases',
			'H cases',
			'L cases',
			'T cases',
			'U cases'
		]
	},
	{
		id: 'cmll',
		name: 'CMLL — Roux corners',
		shortName: 'CMLL',
		summary: 'Solve all last-layer corners in one algorithm, with the M slice left free.',
		description:
			'The third step of the Roux method. After building two blocks you solve the six remaining corners in a single algorithm, using only R, U and F moves so the M slice stays untouched for the last step. Many of these are OLL and COLL algorithms wearing a different hat.',
		tier: 'expert',
		view: 'last-layer',
		verify: 'cmll',
		groups: [
			'No corners oriented',
			'One corner oriented',
			'Two corners oriented',
			'All corners oriented'
		]
	},
	{
		id: 'commutators',
		name: 'Commutators',
		shortName: 'Commutators',
		summary:
			'Build your own algorithms: swap exactly three pieces and leave everything else alone.',
		description:
			'A commutator is the pattern [A, B] = A B A′ B′, and it is why most last-layer algorithms look the way they do. Understanding it turns memorisation into construction: you can work out an algorithm for a case you have never seen, and it is the foundation of blindfolded solving. This set is a teaching sequence rather than a list to drill.',
		tier: 'expert',
		view: 'full',
		verify: 'well-formed'
	},
	{
		id: 'pocket-oll',
		name: 'Ortega OLL — orienting the 2×2 top',
		shortName: '2×2 OLL',
		summary: 'Seven algorithms that turn every top-colour sticker upwards.',
		description:
			'Once the bottom of a 2×2 shows a single colour, every remaining case is one of exactly seven — a fact the site works out from first principles rather than taking on faith, by counting the ways four corners can be twisted so the total comes to a multiple of three. Each of the seven is a 3×3 corner-orientation algorithm doing here what it does there. Learn the two sunes first: repeating sune with a turn of the top between goes will orient any case at all, which is enough to finish the puzzle before you know the other five.',
		tier: 'beginner',
		puzzle: 2,
		view: 'oll',
		verify: 'pocket-oll',
		expectedCount: 7
	},
	{
		id: 'pocket-pll',
		name: '2×2 PLL — finishing the top',
		shortName: '2×2 PLL',
		summary: 'The two ways a solved-but-jumbled top layer can be wrong.',
		description:
			'With the first layer genuinely solved and the top oriented, only two things can be left: a pair of neighbouring corners want swapping, or a pair of diagonal ones do. Telling them apart takes no counting — turn the top and look for two matching stickers on one face. A pair means adjacent. No pair anywhere means diagonal.',
		tier: 'intermediate',
		puzzle: 2,
		view: 'last-layer',
		verify: 'pocket-pll',
		expectedCount: 2
	},
	{
		id: 'pocket-pbl',
		name: 'PBL — permuting both layers',
		shortName: 'PBL',
		summary: 'Ortega’s finish: sort out the top and the bottom in one algorithm.',
		description:
			'Ortega does not solve the first layer, only the first face — the bottom corners all show one colour but may be in any order. That is quicker to build and leaves both layers to permute at the end, which is what these five algorithms do. Two of them are the 2×2 PLLs you already have; the other three handle a bottom layer that is also out of order. The three-move one for the worst-looking case is worth learning on its own even if you never touch the rest of the method.',
		tier: 'intermediate',
		puzzle: 2,
		view: 'last-layer',
		verify: 'pocket-pbl',
		expectedCount: 5
	},
	{
		id: 'revenge-parity',
		name: '4×4 parity',
		shortName: 'Parity',
		summary: 'The position a 4×4 can reach that a 3×3 cannot, and the way out of it.',
		description:
			'Reduce a 4×4 — centres built, wings paired — and it behaves like a 3×3 until it does not. Because there are two of each wing piece and no fixed centres, the puzzle can finish in a position no real 3×3 could hold: two edges wanting to swap with nothing else out of place. That is parity, and no amount of 3×3 technique touches it, because as a 3×3 the position does not exist. The site detects it the same way: it reduces your 4×4 to the 3×3 it has become and asks whether that cube could be assembled. Note the notation carefully — 2R is the slice one layer in, turned on its own. It is not Rw, and substituting one for the other turns a parity fix into a scramble.',
		tier: 'intermediate',
		puzzle: 4,
		view: 'full',
		verify: 'edge-swap',
		expectedCount: 1,
		groups: ['Parity']
	}
];

const BY_ID = new Map<AlgSetId, AlgSetMeta>(ALG_SETS.map((s) => [s.id, s]));

export function algSet(id: AlgSetId): AlgSetMeta {
	const set = BY_ID.get(id);
	if (!set) throw new Error(`Unknown algorithm set "${id}"`);
	return set;
}

/** Sets that hold their own cases, as opposed to curated views over other sets. */
export const PRIMARY_SETS = ALG_SETS.filter((s) => !s.derivedFrom);
/** Sets that are a route through another set. */
export const DERIVED_SETS = ALG_SETS.filter((s) => s.derivedFrom);
