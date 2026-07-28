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
