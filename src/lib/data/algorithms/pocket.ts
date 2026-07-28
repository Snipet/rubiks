/**
 * The 2×2 algorithm library.
 *
 * A 2×2 is a 3×3 with the edges and centres taken away, so nearly everything
 * here is an algorithm you already know from the bigger puzzle, doing exactly
 * what it did there. That is not a coincidence to gloss over — it is the reason
 * a 2×2 is worth learning on, and the reason this set is small.
 *
 * Nothing below was transcribed on trust. Each algorithm was run through the
 * engine and its case read back off the result, and the tests check that the
 * seven orientation algorithms cover all seven orientation cases the engine
 * enumerates from first principles — no more, no fewer, none repeated.
 */

import type { AlgCase } from '../types';

/**
 * Orientation of the last layer — Ortega's second step.
 *
 * These are the 3×3 corner-orientation algorithms under their usual names. On a
 * 3×3 they leave the last-layer edges alone as well, which on a 2×2 is simply
 * nothing to leave alone.
 */
export const POCKET_OLL_CASES: readonly AlgCase[] = [
	{
		id: 'pocket-oll-sune',
		set: 'pocket-oll',
		name: 'Sune',
		shortName: 'Sune',
		tier: 'beginner',
		probability: '2/27',
		recognition:
			'One corner already showing the top colour, and the three side stickers of the top colour all facing anticlockwise round the layer. Hold the finished corner at back-left.',
		notes:
			'The one to learn first. Doing it repeatedly with a turn of the top in between will orient any case at all, which is how the beginner method gets through this step with a single algorithm.',
		triggers: ['sexy move'],
		algs: [
			{ moves: "R U R' U R U2 R'", note: 'The same sune you use on a 3×3.' },
			{ moves: "L' U' L U' L' U2 L", label: 'left-hand' }
		]
	},
	{
		id: 'pocket-oll-antisune',
		set: 'pocket-oll',
		name: 'Anti-Sune',
		shortName: 'Anti-Sune',
		tier: 'beginner',
		probability: '2/27',
		recognition:
			'One corner already showing the top colour, with the three top-colour stickers facing clockwise round the layer — the mirror of sune.',
		notes: 'Sune with the turns reversed. If sune left you worse off, this was the case.',
		algs: [{ moves: "R U2 R' U' R U' R'" }, { moves: "L' U2 L U L' U L", label: 'left-hand' }]
	},
	{
		id: 'pocket-oll-t',
		set: 'pocket-oll',
		name: 'T',
		shortName: 'T',
		tier: 'intermediate',
		probability: '2/27',
		recognition:
			'Two corners done, sitting next to each other, with the remaining two top-colour stickers facing you on the left and right of the front face.',
		triggers: ['sexy move', 'sledgehammer'],
		algs: [{ moves: "R U R' U' R' F R F'" }]
	},
	{
		id: 'pocket-oll-u',
		set: 'pocket-oll',
		name: 'U',
		shortName: 'U',
		tier: 'intermediate',
		probability: '2/27',
		recognition:
			'Two corners done side by side, and the other two top-colour stickers both facing you across the front — a matching pair, unlike the T.',
		notes:
			'Six moves and entirely finger-friendly; usually the first case after the sunes that people learn properly.',
		algs: [{ moves: "F R U R' U' F'" }]
	},
	{
		id: 'pocket-oll-l',
		set: 'pocket-oll',
		name: 'L',
		shortName: 'L',
		tier: 'intermediate',
		probability: '2/27',
		recognition:
			'Two corners done diagonally opposite each other, with the two remaining top-colour stickers on adjacent faces.',
		triggers: ['sledgehammer'],
		algs: [{ moves: "F R' F' R U R U' R'" }]
	},
	{
		id: 'pocket-oll-pi',
		set: 'pocket-oll',
		name: 'Pi',
		shortName: 'Pi',
		tier: 'intermediate',
		probability: '4/27',
		recognition:
			'No corner showing the top colour, with two top-colour stickers facing you on the front and the other two on the back.',
		notes:
			'The sexy move twice, wrapped in F and F prime. Long, but it is just a trigger you already have, done twice.',
		triggers: ['sexy move'],
		algs: [
			{ moves: "F R U R' U' R U R' U' F'" },
			{ moves: "R U2 R2 U' R2 U' R2 U2 R", label: '2-gen', note: 'Only R and U, so no regrip.' }
		]
	},
	{
		id: 'pocket-oll-h',
		set: 'pocket-oll',
		name: 'H',
		shortName: 'H',
		tier: 'intermediate',
		probability: '1/27',
		recognition:
			'No corner showing the top colour, with all four top-colour stickers on the left and right faces — two bars facing outwards.',
		notes:
			'Five moves, and the shortest algorithm on the whole site. Rarest case too, at one solve in twenty-seven.',
		algs: [{ moves: 'R2 U2 R U2 R2' }]
	}
];

/**
 * Permutation of the last layer, once the first layer is genuinely solved.
 *
 * Only two things can be wrong: a pair of neighbouring corners want swapping, or
 * a pair of diagonal ones do. That is the whole of 2×2 PLL.
 */
export const POCKET_PLL_CASES: readonly AlgCase[] = [
	{
		id: 'pocket-pll-adjacent',
		set: 'pocket-pll',
		name: 'Adjacent swap',
		shortName: 'Adjacent',
		tier: 'intermediate',
		probability: '2/3',
		recognition:
			'One face of the top layer shows two matching stickers — a pair of headlights. Hold that face at the back; the two corners in front of you are the ones that swap.',
		notes:
			'The corner half of a 3×3 T permutation. If you already know the T perm, you already know this.',
		algs: [
			{ moves: "R' U L' U2 R U' R' U2 R L", note: 'Shortest, but it needs both hands.' },
			{
				moves: "R U R' F' R U R' U' R' F R2 U' R'",
				label: 'T perm',
				note: 'The full 3×3 T permutation, if that is what your fingers already know.'
			}
		]
	},
	{
		id: 'pocket-pll-diagonal',
		set: 'pocket-pll',
		name: 'Diagonal swap',
		shortName: 'Diagonal',
		tier: 'intermediate',
		probability: '1/3',
		recognition:
			'No face of the top layer shows a matching pair. Every side is two different colours, which only happens when the corners that need trading are across from each other.',
		notes:
			'The corner half of a 3×3 Y permutation, though the shorter algorithm below is the one most 2×2 solvers use.',
		algs: [
			{ moves: "R U' R' U' F2 U' R U R' U F2" },
			{
				moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
				label: 'Y perm',
				note: 'The full 3×3 Y permutation.'
			}
		]
	}
];

/**
 * Permutation of both layers at once — Ortega's last step.
 *
 * Ortega does not solve the bottom layer, only the bottom *face*: the four
 * bottom corners show one colour downwards but may be in any order. That saves
 * time earlier and costs it here, where both layers have to be sorted out
 * together.
 *
 * A layer is in one of three states once you allow yourself to turn it: already
 * right, one pair of neighbours swapped, or one pair of diagonals swapped. Nine
 * combinations, of which one is finished and the rest reduce to these five by
 * turning the puzzle over.
 */
export const POCKET_PBL_CASES: readonly AlgCase[] = [
	{
		id: 'pocket-pbl-bottom-adjacent',
		set: 'pocket-pbl',
		name: 'Bottom done, top adjacent',
		shortName: 'Top adjacent',
		tier: 'intermediate',
		recognition:
			'The bottom layer is already right. On top, one face shows a matching pair — hold it at the back.',
		notes: 'The same case as the 2×2 adjacent PLL, and the same algorithm.',
		algs: [{ moves: "R' U L' U2 R U' R' U2 R L" }]
	},
	{
		id: 'pocket-pbl-bottom-diagonal',
		set: 'pocket-pbl',
		name: 'Bottom done, top diagonal',
		shortName: 'Top diagonal',
		tier: 'intermediate',
		recognition: 'The bottom layer is right and no face of the top shows a matching pair.',
		algs: [{ moves: "R U' R' U' F2 U' R U R' U F2" }]
	},
	{
		id: 'pocket-pbl-both-adjacent',
		set: 'pocket-pbl',
		name: 'Both layers adjacent',
		shortName: 'Both adjacent',
		tier: 'intermediate',
		recognition:
			'Each layer has one face showing a matching pair. Hold the puzzle with both pairs at the back.',
		notes: 'Seven moves for both layers at once, which is what makes Ortega worth the extra step.',
		algs: [{ moves: "R2 U' B2 U2 R2 U' R2" }]
	},
	{
		id: 'pocket-pbl-adjacent-diagonal',
		set: 'pocket-pbl',
		name: 'One adjacent, one diagonal',
		shortName: 'Mixed',
		tier: 'intermediate',
		recognition:
			'One layer has a matching pair somewhere, the other has none. Hold the diagonal layer on the bottom.',
		algs: [{ moves: "R U' R F2 R' U R'" }]
	},
	{
		id: 'pocket-pbl-both-diagonal',
		set: 'pocket-pbl',
		name: 'Both layers diagonal',
		shortName: 'Both diagonal',
		tier: 'intermediate',
		recognition: 'Neither layer shows a matching pair on any face.',
		notes:
			'Three moves. Worth knowing even if you never learn the rest of Ortega, because it turns the worst-looking case on the puzzle into the easiest.',
		algs: [{ moves: 'R2 F2 R2' }]
	}
];
