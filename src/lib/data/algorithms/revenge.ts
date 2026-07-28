/**
 * The 4×4 algorithm library.
 *
 * A 4×4 is solved by *reduction*: build the four centre pieces of each face into
 * a block, join the wing pieces into pairs, and what is left behaves like a 3×3
 * whose centres and edges happen to be made of several bits. Almost all of the
 * work is therefore done with algorithms you already have, or with no algorithm
 * at all.
 *
 * What a 3×3 cannot prepare you for is **parity**. A 4×4 has two of each wing
 * piece and no fixed centres, so it can reach states that look impossible on a
 * 3×3: a single edge pair flipped over, or two edge pairs wanting to swap. No
 * amount of 3×3 technique fixes those, because as a 3×3 they are not legal
 * positions at all. The algorithms below are the ones that do.
 *
 * ### On the notation
 *
 * `2R` means the second layer in from the right, turned on its own — the slice,
 * not the face, and not the two together. That distinction is the whole point of
 * a parity algorithm: it has to move wing pieces around while leaving every
 * corner exactly where it was, and only a slice turn can do that. `Rw` and `2R`
 * are different moves here, and writing one where the other belongs turns a
 * working parity algorithm into a scramble.
 *
 * Every algorithm below was run through the engine and its effect measured
 * sticker by sticker. The tests assert three things about each: it moves wing
 * pieces and nothing else, it leaves the puzzle still reduced, and the 3×3 it
 * reduces to afterwards is one that could not be assembled. That last property
 * is what parity *is*, so it is what gets checked — not a description of the
 * result that sounds right.
 */

import type { AlgCase } from '../types';

export const REVENGE_PARITY_CASES: readonly AlgCase[] = [
	{
		id: 'revenge-parity-swap',
		set: 'revenge-parity',
		name: 'Two edge pairs swapped',
		shortName: 'Parity',
		group: 'Parity',
		tier: 'intermediate',
		probability: '1/2',
		recognition:
			'You have reduced the puzzle and started solving it as a 3×3, and you reach a last layer that no real 3×3 could show — two edges wanting to trade places with nothing else out of position. Hold the two that need swapping at the back and the right of the top layer.',
		notes:
			'Meets you about half the time, so it is part of the method rather than bad luck. Both versions below leave the puzzle still reduced — centres solid, wings paired — which is the property that makes a parity algorithm usable in the middle of a solve rather than a fresh start. The short one is the one to learn; the long one is the classic, and is here because plenty of guides still teach it and you may want to recognise it.',
		algs: [
			{
				moves: '2R2 U2 2R2 Uw2 2R2 Uw2 U2',
				note: 'Seven moves and only three distinct ones. Swaps the back and front edge pairs of the top layer.'
			},
			{
				moves: "2R2 B2 U2 2L U2 2R' U2 2R U2 F2 2R F2 2L' B2 2R2",
				label: 'classic',
				note: 'The long-standing version, usually written with lowercase r and l. It fixes the same kind of position but swaps a different pair, so it wants the puzzle held differently — it is not a drop-in replacement for the short one.'
			}
		]
	}
];

/**
 * Centre commutators.
 *
 * The centres stage of a 4×4 is mostly done by eye, and the lesson says so. But
 * the last few pieces are the awkward ones — every move that fetches the piece
 * you want undoes a piece you already placed — and that is what a commutator is
 * for: do a thing, do another, undo the first, undo the second, and the two
 * interferences cancel.
 *
 * All of these are built from inner slices alone, which is why they can be
 * offered with a guarantee rather than a hope: a slice turn cannot touch a
 * corner, and the tests measure that no corner and no wing moves. Six centre
 * pieces travel, in two three-cycles, and nothing else on the puzzle changes.
 *
 * They were found by search rather than transcribed — every commutator of two
 * slices was generated, its effect read off the piece model, and these kept.
 */
export const REVENGE_CENTRE_CASES: readonly AlgCase[] = [
	{
		id: 'revenge-centre-basic',
		set: 'revenge-centres',
		name: 'The basic slice commutator',
		shortName: 'Slice comm',
		group: 'Centres',
		tier: 'intermediate',
		recognition:
			'Two centre pieces sit one slice apart and each is in the other\u2019s way. Set the puzzle so both are on inner slices that cross, and this trades them round.',
		notes:
			'Four moves, and the shape behind every other algorithm on this page: turn, turn, undo, undo. Learn what it does to the puzzle rather than the letters — once you can see the two three-cycles you will invent the rest yourself.',
		algs: [
			{
				moves: "2R 2U 2R' 2U'",
				note: 'Three-cycles two sets of three centres and touches nothing else at all.'
			},
			{
				moves: "2R 2U' 2R' 2U",
				label: 'reverse',
				note: 'The same shape the other way, when the cycle you want runs the other direction.'
			}
		]
	},
	{
		id: 'revenge-centre-down',
		set: 'revenge-centres',
		name: 'Against the bottom slice',
		shortName: 'Down comm',
		group: 'Centres',
		tier: 'intermediate',
		recognition: 'The piece you want is in the lower inner slice rather than the upper one.',
		notes:
			'Identical in shape; only the second slice changes. Worth doing a few times to feel that the choice of slice is what picks which centres travel.',
		algs: [{ moves: "2R 2D 2R' 2D'" }]
	},
	{
		id: 'revenge-centre-front',
		set: 'revenge-centres',
		name: 'Against the front slice',
		shortName: 'Front comm',
		group: 'Centres',
		tier: 'intermediate',
		recognition: 'The two pieces cross on the front inner slice rather than a horizontal one.',
		notes:
			'The third axis. Between these three you can reach any centre from any other, which is the whole of the centres stage once you stop guessing.',
		algs: [{ moves: "2R 2F 2R' 2F'" }]
	},
	{
		id: 'revenge-centre-double',
		set: 'revenge-centres',
		name: 'The half-turn commutator',
		shortName: 'Half comm',
		group: 'Centres',
		tier: 'advanced',
		recognition:
			'Two centres directly opposite one another across a slice, where a quarter turn would fetch the wrong one.',
		notes:
			'Half turns instead of quarters. Same length, different pair of three-cycles, and it reaches the arrangements the quarter-turn version keeps missing.',
		algs: [
			{ moves: "2R 2U2 2R' 2U2" },
			{
				moves: '2R2 2U2 2R2 2U2',
				label: 'both halves',
				note: 'Every turn a half turn: the most symmetric of the family, and the easiest to perform without thinking.'
			}
		]
	},
	{
		id: 'revenge-centre-wide-pair',
		set: 'revenge-centres',
		name: 'Two at a time',
		shortName: 'Double slice',
		group: 'Centres',
		tier: 'advanced',
		recognition:
			'Two pieces on the same slice both need moving, and one quarter turn would only fetch one.',
		notes:
			'A double slice in the first half fetches a pair rather than a single, which is what makes the last face of centres quick rather than a grind.',
		algs: [{ moves: "2R2 2U 2R2 2U'" }]
	}
];
