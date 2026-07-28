/**
 * CLL — the whole of a 2×2 last layer in one algorithm.
 *
 * ### Where the forty cases come from
 *
 * Not from a sheet. With the first layer solved there are 4! × 3³ = 648 ways the
 * top can sit. Two of them are the same case when one can be turned into the
 * other by an adjusting turn before the algorithm and another after it — a
 * double coset — and counting those gives **43**. One is already solved and two
 * need no twisting at all (those are the two 2×2 PLL cases, which live in their
 * own set), leaving the forty below.
 *
 * That is the published structure exactly, including the detail that catches
 * people out: the H group has four cases rather than six, because the H shape
 * looks the same after a half turn and two of its arrangements coincide. The
 * count was derived here rather than assumed, and a test re-derives it.
 *
 * ### A caution about the algorithms
 *
 * These are **shortest solutions, found by search** — not the ergonomically
 * chosen sequences a speedsolver would drill. They average nine moves and none
 * is longer than eleven, so they are efficient; but only a handful are two-gen,
 * and some want a regrip in an awkward place.
 *
 * The site's own advice is not to learn an algorithm you cannot finger, and that
 * advice applies here. Treat this as a complete and verified map of the cases —
 * for recognition practice, for the solve page, and for knowing what you are
 * looking at — rather than as a sheet to memorise front to back. Where you mean
 * to learn a case properly, it is worth finding a version your hands like.
 */

import type { AlgCase } from '../types';

export const POCKET_CLL_CASES: readonly AlgCase[] = [
	{
		id: 'pocket-cll-t-1',
		set: 'pocket-cll',
		name: 'T 1',
		shortName: 'T 1',
		group: 'T',
		tier: 'advanced',
		recognition:
			'The T shape — two corners up side by side, the remaining two facing you across the front — and the corners are already in the right places.',
		algs: [{ moves: "U R U2 F2 R' F' U F' U R'" }]
	},
	{
		id: 'pocket-cll-t-2',
		set: 'pocket-cll',
		name: 'T 2',
		shortName: 'T 2',
		group: 'T',
		tier: 'advanced',
		recognition:
			'The T shape — two corners up side by side, the remaining two facing you across the front — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U2 R U' R F U2 R2 U F R'" }]
	},
	{
		id: 'pocket-cll-t-3',
		set: 'pocket-cll',
		name: 'T 3',
		shortName: 'T 3',
		group: 'T',
		tier: 'advanced',
		recognition:
			'The T shape — two corners up side by side, the remaining two facing you across the front — and two corners want swapping and the other two are home.',
		algs: [{ moves: "F' R' U R U F R'" }]
	},
	{
		id: 'pocket-cll-t-4',
		set: 'pocket-cll',
		name: 'T 4',
		shortName: 'T 4',
		group: 'T',
		tier: 'advanced',
		recognition:
			'The T shape — two corners up side by side, the remaining two facing you across the front — and three corners cycle round and one is home.',
		algs: [{ moves: "F R F' U' R' U' R" }]
	},
	{
		id: 'pocket-cll-t-5',
		set: 'pocket-cll',
		name: 'T 5',
		shortName: 'T 5',
		group: 'T',
		tier: 'advanced',
		recognition:
			'The T shape — two corners up side by side, the remaining two facing you across the front — and three corners cycle round and one is home.',
		algs: [{ moves: "U2 F R' U' R F' R' U F' R" }]
	},
	{
		id: 'pocket-cll-t-6',
		set: 'pocket-cll',
		name: 'T 6',
		shortName: 'T 6',
		group: 'T',
		tier: 'advanced',
		recognition:
			'The T shape — two corners up side by side, the remaining two facing you across the front — and two corners want swapping and the other two are home.',
		algs: [{ moves: "R U' F' R' F2 U R F U2 R2" }]
	},
	{
		id: 'pocket-cll-u-1',
		set: 'pocket-cll',
		name: 'U 1',
		shortName: 'U 1',
		group: 'U',
		tier: 'advanced',
		recognition:
			'The U shape — two corners up side by side, the other two showing a matching pair on one side — and the corners are already in the right places.',
		algs: [{ moves: "U F2 R2 U' F' U R' U R' F" }]
	},
	{
		id: 'pocket-cll-u-2',
		set: 'pocket-cll',
		name: 'U 2',
		shortName: 'U 2',
		group: 'U',
		tier: 'advanced',
		recognition:
			'The U shape — two corners up side by side, the other two showing a matching pair on one side — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U R U' R2 F' R F' U' F U2 F" }]
	},
	{
		id: 'pocket-cll-u-3',
		set: 'pocket-cll',
		name: 'U 3',
		shortName: 'U 3',
		group: 'U',
		tier: 'advanced',
		recognition:
			'The U shape — two corners up side by side, the other two showing a matching pair on one side — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U R2 U' R F2 R' U R F2 R" }]
	},
	{
		id: 'pocket-cll-u-4',
		set: 'pocket-cll',
		name: 'U 4',
		shortName: 'U 4',
		group: 'U',
		tier: 'advanced',
		recognition:
			'The U shape — two corners up side by side, the other two showing a matching pair on one side — and three corners cycle round and one is home.',
		algs: [{ moves: "U' R2 U R' U' R2 U' F' U2 F" }]
	},
	{
		id: 'pocket-cll-u-5',
		set: 'pocket-cll',
		name: 'U 5',
		shortName: 'U 5',
		group: 'U',
		tier: 'advanced',
		recognition:
			'The U shape — two corners up side by side, the other two showing a matching pair on one side — and three corners cycle round and one is home.',
		algs: [{ moves: "U2 R F' R F' R' F R' U' F" }]
	},
	{
		id: 'pocket-cll-u-6',
		set: 'pocket-cll',
		name: 'U 6',
		shortName: 'U 6',
		group: 'U',
		tier: 'advanced',
		recognition:
			'The U shape — two corners up side by side, the other two showing a matching pair on one side — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U F U R U' R' F'" }]
	},
	{
		id: 'pocket-cll-l-1',
		set: 'pocket-cll',
		name: 'L 1',
		shortName: 'L 1',
		group: 'L',
		tier: 'advanced',
		recognition:
			'The L shape — two corners up diagonally opposite, the remaining stickers on adjacent faces — and the corners are already in the right places.',
		algs: [
			{ moves: "U R2 U' R U2 R' U2 R U' R2" },
			{
				moves: "U2 R2 U R' U2 R U2 R' U R2 U",
				label: 'two-gen',
				note: 'Only R and U, so no regrip.'
			}
		]
	},
	{
		id: 'pocket-cll-l-2',
		set: 'pocket-cll',
		name: 'L 2',
		shortName: 'L 2',
		group: 'L',
		tier: 'advanced',
		recognition:
			'The L shape — two corners up diagonally opposite, the remaining stickers on adjacent faces — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U R' F2 R U F2 U F U' F2" }]
	},
	{
		id: 'pocket-cll-l-3',
		set: 'pocket-cll',
		name: 'L 3',
		shortName: 'L 3',
		group: 'L',
		tier: 'advanced',
		recognition:
			'The L shape — two corners up diagonally opposite, the remaining stickers on adjacent faces — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U' R U2 R' U' F2 U' F' U F2" }]
	},
	{
		id: 'pocket-cll-l-4',
		set: 'pocket-cll',
		name: 'L 4',
		shortName: 'L 4',
		group: 'L',
		tier: 'advanced',
		recognition:
			'The L shape — two corners up diagonally opposite, the remaining stickers on adjacent faces — and three corners cycle round and one is home.',
		algs: [{ moves: "R F' U' R' U' R F" }]
	},
	{
		id: 'pocket-cll-l-5',
		set: 'pocket-cll',
		name: 'L 5',
		shortName: 'L 5',
		group: 'L',
		tier: 'advanced',
		recognition:
			'The L shape — two corners up diagonally opposite, the remaining stickers on adjacent faces — and three corners cycle round and one is home.',
		algs: [{ moves: "R' U R U F R' F'" }]
	},
	{
		id: 'pocket-cll-l-6',
		set: 'pocket-cll',
		name: 'L 6',
		shortName: 'L 6',
		group: 'L',
		tier: 'advanced',
		recognition:
			'The L shape — two corners up diagonally opposite, the remaining stickers on adjacent faces — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U F U2 F2 R U R' F U2 F'" }]
	},
	{
		id: 'pocket-cll-antisune-1',
		set: 'pocket-cll',
		name: 'Anti-Sune 1',
		shortName: 'Anti-Sune 1',
		group: 'Anti-Sune',
		tier: 'advanced',
		recognition:
			'The Anti-Sune shape — one corner already up, the rest twisted the other way — sune in a mirror — and the corners are already in the right places.',
		algs: [
			{ moves: "U2 R' U' R U' R' U2 R" },
			{ moves: "U' R U2 R' U' R U' R' U'", label: 'two-gen', note: 'Only R and U, so no regrip.' }
		]
	},
	{
		id: 'pocket-cll-antisune-2',
		set: 'pocket-cll',
		name: 'Anti-Sune 2',
		shortName: 'Anti-Sune 2',
		group: 'Anti-Sune',
		tier: 'advanced',
		recognition:
			'The Anti-Sune shape — one corner already up, the rest twisted the other way — sune in a mirror — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U' F R2 F' U2 F' U F R'" }]
	},
	{
		id: 'pocket-cll-antisune-3',
		set: 'pocket-cll',
		name: 'Anti-Sune 3',
		shortName: 'Anti-Sune 3',
		group: 'Anti-Sune',
		tier: 'advanced',
		recognition:
			'The Anti-Sune shape — one corner already up, the rest twisted the other way — sune in a mirror — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U' F' R U R' U2 R' F2 R" }]
	},
	{
		id: 'pocket-cll-antisune-4',
		set: 'pocket-cll',
		name: 'Anti-Sune 4',
		shortName: 'Anti-Sune 4',
		group: 'Anti-Sune',
		tier: 'advanced',
		recognition:
			'The Anti-Sune shape — one corner already up, the rest twisted the other way — sune in a mirror — and three corners cycle round and one is home.',
		algs: [{ moves: "U2 F' R U R' F U F'" }]
	},
	{
		id: 'pocket-cll-antisune-5',
		set: 'pocket-cll',
		name: 'Anti-Sune 5',
		shortName: 'Anti-Sune 5',
		group: 'Anti-Sune',
		tier: 'advanced',
		recognition:
			'The Anti-Sune shape — one corner already up, the rest twisted the other way — sune in a mirror — and three corners cycle round and one is home.',
		algs: [{ moves: "U2 R2 F R F2 U' F2 R' F' R2" }]
	},
	{
		id: 'pocket-cll-antisune-6',
		set: 'pocket-cll',
		name: 'Anti-Sune 6',
		shortName: 'Anti-Sune 6',
		group: 'Anti-Sune',
		tier: 'advanced',
		recognition:
			'The Anti-Sune shape — one corner already up, the rest twisted the other way — sune in a mirror — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U R U' R2 U F' U2 F U R2" }]
	},
	{
		id: 'pocket-cll-sune-1',
		set: 'pocket-cll',
		name: 'Sune 1',
		shortName: 'Sune 1',
		group: 'Sune',
		tier: 'advanced',
		recognition:
			'The Sune shape — one corner already showing the top colour, the other three twisted the same way round — and the corners are already in the right places.',
		algs: [
			{ moves: "R' U2 R U R' U R U2" },
			{ moves: "U R U R' U R U2 R' U", label: 'two-gen', note: 'Only R and U, so no regrip.' }
		]
	},
	{
		id: 'pocket-cll-sune-2',
		set: 'pocket-cll',
		name: 'Sune 2',
		shortName: 'Sune 2',
		group: 'Sune',
		tier: 'advanced',
		recognition:
			'The Sune shape — one corner already showing the top colour, the other three twisted the same way round — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U F R' F' R U2 R U2 R'" }]
	},
	{
		id: 'pocket-cll-sune-3',
		set: 'pocket-cll',
		name: 'Sune 3',
		shortName: 'Sune 3',
		group: 'Sune',
		tier: 'advanced',
		recognition:
			'The Sune shape — one corner already showing the top colour, the other three twisted the same way round — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U F' R2 F R2 F R' U' R" }]
	},
	{
		id: 'pocket-cll-sune-4',
		set: 'pocket-cll',
		name: 'Sune 4',
		shortName: 'Sune 4',
		group: 'Sune',
		tier: 'advanced',
		recognition:
			'The Sune shape — one corner already showing the top colour, the other three twisted the same way round — and three corners cycle round and one is home.',
		algs: [{ moves: "U2 R2 F R U2 F U2 R' F' R2" }]
	},
	{
		id: 'pocket-cll-sune-5',
		set: 'pocket-cll',
		name: 'Sune 5',
		shortName: 'Sune 5',
		group: 'Sune',
		tier: 'advanced',
		recognition:
			'The Sune shape — one corner already showing the top colour, the other three twisted the same way round — and three corners cycle round and one is home.',
		algs: [{ moves: "U2 F R' F' R F' U' F" }]
	},
	{
		id: 'pocket-cll-sune-6',
		set: 'pocket-cll',
		name: 'Sune 6',
		shortName: 'Sune 6',
		group: 'Sune',
		tier: 'advanced',
		recognition:
			'The Sune shape — one corner already showing the top colour, the other three twisted the same way round — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U' F2 U' F' U2 F R' F2 R F'" }]
	},
	{
		id: 'pocket-cll-pi-1',
		set: 'pocket-cll',
		name: 'Pi 1',
		shortName: 'Pi 1',
		group: 'Pi',
		tier: 'advanced',
		recognition:
			'The Pi shape — no corner up, two top-colour stickers on the front and two on the back — and the corners are already in the right places.',
		algs: [
			{ moves: "U2 R U2 R2 U' R2 U R2 U2 R'" },
			{
				moves: "U' F U2 F2 U' F2 U F2 U2 F' U'",
				label: 'two-gen',
				note: 'Only R and U, so no regrip.'
			}
		]
	},
	{
		id: 'pocket-cll-pi-2',
		set: 'pocket-cll',
		name: 'Pi 2',
		shortName: 'Pi 2',
		group: 'Pi',
		tier: 'advanced',
		recognition:
			'The Pi shape — no corner up, two top-colour stickers on the front and two on the back — and two corners want swapping and the other two are home.',
		algs: [{ moves: "R U2 R' F2 U R' F2 R U F'" }]
	},
	{
		id: 'pocket-cll-pi-3',
		set: 'pocket-cll',
		name: 'Pi 3',
		shortName: 'Pi 3',
		group: 'Pi',
		tier: 'advanced',
		recognition:
			'The Pi shape — no corner up, two top-colour stickers on the front and two on the back — and two corners want swapping and the other two are home.',
		algs: [{ moves: 'R2 U2 F U F2 U R2 U F' }]
	},
	{
		id: 'pocket-cll-pi-4',
		set: 'pocket-cll',
		name: 'Pi 4',
		shortName: 'Pi 4',
		group: 'Pi',
		tier: 'advanced',
		recognition:
			'The Pi shape — no corner up, two top-colour stickers on the front and two on the back — and three corners cycle round and one is home.',
		algs: [{ moves: "F U' F U2 F2 R' F R U F2" }]
	},
	{
		id: 'pocket-cll-pi-5',
		set: 'pocket-cll',
		name: 'Pi 5',
		shortName: 'Pi 5',
		group: 'Pi',
		tier: 'advanced',
		recognition:
			'The Pi shape — no corner up, two top-colour stickers on the front and two on the back — and three corners cycle round and one is home.',
		algs: [{ moves: "R' F2 R F2 U' R U2 R' U' F" }]
	},
	{
		id: 'pocket-cll-pi-6',
		set: 'pocket-cll',
		name: 'Pi 6',
		shortName: 'Pi 6',
		group: 'Pi',
		tier: 'advanced',
		recognition:
			'The Pi shape — no corner up, two top-colour stickers on the front and two on the back — and two corners want swapping and the other two are home.',
		algs: [{ moves: "U F2 U F2 R' F2 R F2 U' F2" }]
	},
	{
		id: 'pocket-cll-h-1',
		set: 'pocket-cll',
		name: 'H 1',
		shortName: 'H 1',
		group: 'H',
		tier: 'advanced',
		recognition:
			'The H shape — no corner up, all four top-colour stickers on the left and right — and the corners are already in the right places.',
		algs: [
			{ moves: 'U R2 U2 R U2 R2' },
			{ moves: "U' R2 U2 R' U2 R2", label: 'two-gen', note: 'Only R and U, so no regrip.' }
		]
	},
	{
		id: 'pocket-cll-h-2',
		set: 'pocket-cll',
		name: 'H 2',
		shortName: 'H 2',
		group: 'H',
		tier: 'advanced',
		recognition:
			'The H shape — no corner up, all four top-colour stickers on the left and right — and two corners want swapping and the other two are home.',
		algs: [{ moves: 'F U R2 U R2 U F U2 R2' }]
	},
	{
		id: 'pocket-cll-h-3',
		set: 'pocket-cll',
		name: 'H 3',
		shortName: 'H 3',
		group: 'H',
		tier: 'advanced',
		recognition:
			'The H shape — no corner up, all four top-colour stickers on the left and right — and two corners want swapping and the other two are home.',
		algs: [{ moves: "F2 U R U R' F2 U2 F U' F" }]
	},
	{
		id: 'pocket-cll-h-4',
		set: 'pocket-cll',
		name: 'H 4',
		shortName: 'H 4',
		group: 'H',
		tier: 'advanced',
		recognition:
			'The H shape — no corner up, all four top-colour stickers on the left and right — and two corners want swapping and the other two are home.',
		algs: [{ moves: 'U F2 R F2 R2 U2 R F2' }]
	}
];
