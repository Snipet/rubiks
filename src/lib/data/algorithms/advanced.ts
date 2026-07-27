/**
 * The expert sets: COLL, Winter Variation, CMLL and commutators.
 *
 * Three of these four are about the last-layer corners, approached from three
 * directions. COLL finishes them after the first two layers are done, keeping the
 * edges oriented. Winter Variation finishes them a step earlier, while the last
 * F2L pair is going in. CMLL finishes them for Roux, where the middle slice has to
 * stay untouched. The corner cases themselves are the same forty-two either way,
 * so the three sets are the same puzzle wearing different clothes — and learning
 * one makes the others cheaper.
 *
 * The fourth set is not a set of cases at all. Commutators are the construction
 * kit the other algorithms were built with.
 *
 * ## How the corner cases are described
 *
 * Every COLL and CMLL case is one of the seven corner-orientation shapes — Sune,
 * anti-sune, Pi, H, L, T, U — combined with one of six ways the corners can be out
 * of order. The recognition notes always name a way to hold the case first, chosen
 * so that the shape sits in one fixed position, and then say which pair of corners
 * needs to swap. "Counting the finishing U turn" appears a lot: after a COLL or
 * CMLL algorithm you are free to turn the top face once more, so a case where three
 * corners cycle and a case where two corners swap can be the same case.
 *
 * The numbering within each family (S1, S2, Pi3 …) is this library's own. Printed
 * sheets order them differently, so match the picture rather than the number.
 */

import type { AlgCase } from '../types';

// ---------------------------------------------------------------------------
// COLL — corners of the last layer
// ---------------------------------------------------------------------------

export const COLL_CASES: readonly AlgCase[] = [
	// -------------------------------------------------------------------------
	// Corners oriented
	// -------------------------------------------------------------------------
	{
		id: 'coll-o-1',
		set: 'coll',
		name: 'Corners oriented — adjacent swap',
		shortName: 'O1',
		group: 'Corners oriented',
		tier: 'expert',
		algs: [
			{
				moves: "x R' U R' D2 R U' R' D2 R2 x'",
				note: 'The A permutation, which you already know.'
			},
			{
				moves: "R U R' F' R U R' U' R' F R2 U' R'",
				label: 'T permutation',
				note: 'Longer, but it tidies two edges on the way past.'
			},
			{
				moves: "R U' L U2 R' U R U2 L' R'",
				label: 'no rotation',
				note: 'Keeps the cube still, at the cost of a left hand.'
			}
		],
		recognition:
			'The whole top face is already one colour and the corners still need moving. Three corners cycle, or — counting the finishing U turn — two neighbouring corners swap.',
		notes:
			'This case and the diagonal one are the two COLL cases you get for free: any corner three-cycle or adjacent-corner permutation will do, so reach for the A or T permutation you use every day. The edges will be left scrambled but oriented, which is exactly what COLL promises.',
		triggers: ['Aa insert'],
		tags: ['pll', 'familiar', 'rare']
	},
	{
		id: 'coll-o-2',
		set: 'coll',
		name: 'Corners oriented — diagonal swap',
		shortName: 'O2',
		group: 'Corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'", note: 'The Y permutation.' },
			{
				moves: "R' U' R F2 R' U R U F2 U' F2 U' F2",
				label: 'corners only',
				note: 'Four moves shorter than the Y perm and it ignores the edges entirely.'
			}
		],
		recognition:
			'Top face solid, and the two corners that need to swap sit diagonally opposite each other. Every side face shows a matching pair of corner stickers, but no U turn lines them all up with the centres.',
		notes:
			'A diagonal corner swap cannot be done in fewer than about eleven moves however you attack it, so most people keep using the Y or E permutation here and accept the length. It is the rarest shape in the set.',
		triggers: ['sexy move', 'sledgehammer', 'Aa insert'],
		tags: ['pll', 'long', 'rare']
	},

	// -------------------------------------------------------------------------
	// Sune family
	// -------------------------------------------------------------------------
	{
		id: 'coll-sune-1',
		set: 'coll',
		name: 'Sune — corners in order',
		shortName: 'S1',
		group: 'Sune family',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U R U2 R'" },
			{ moves: "R' U2 R U R' U R", label: '2-gen', note: 'Same case, opposite hand pattern.' }
		],
		recognition:
			'Sune shape: one corner solved, the other three showing the top colour on their sides in the same rotational direction. Hold the solved corner at the front-right and the corners are already in the order they belong.',
		notes:
			'The best case in the set, and the reason COLL is worth starting here: the algorithm is the Sune you learnt for OLL, and it happens to leave the corners done. Learn to spot it and you get a free COLL on roughly one Sune in six.',
		triggers: ['sune'],
		tags: ['2-gen', 'fast', 'oll']
	},
	{
		id: 'coll-sune-2',
		set: 'coll',
		name: 'Sune — back pair swaps',
		shortName: 'S2',
		group: 'Sune family',
		tier: 'expert',
		algs: [
			{ moves: "L' R U R' U' L U2 R U2 R'" },
			{ moves: "R' U' F U F' R U F U2 F'", label: 'right-hand', note: 'No left hand needed.' }
		],
		recognition:
			'Sune with the solved corner at the front-right; the two corners along the back are the pair that still need to trade places.',
		notes:
			'A sexy move wrapped in L and L prime, then a Sune finish. The opening L prime is only there to hold the back pair still while the sexy move works.',
		triggers: ['sexy move'],
		tags: ['two-handed', 'sexy']
	},
	{
		id: 'coll-sune-3',
		set: 'coll',
		name: 'Sune — left pair swaps',
		shortName: 'S3',
		group: 'Sune family',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 R U F R' U R U' F'" },
			{ moves: "R' U2 R U2 L U' R' U L' R", label: 'two-handed' }
		],
		recognition:
			'Sune with the solved corner at the front-right; the two corners down the left-hand side are the ones out of place.',
		notes:
			'The first three moves are an anti-sune opening, which makes the case easy to start before you have finished reading it.',
		tags: ['awkward']
	},
	{
		id: 'coll-sune-4',
		set: 'coll',
		name: 'Sune — right pair swaps',
		shortName: 'S4',
		group: 'Sune family',
		tier: 'expert',
		algs: [
			{ moves: "F R' U2 R F' R' F U2 F' R" },
			{ moves: "L F' U2 F L' F' L U2 L' F", label: 'left-hand' }
		],
		recognition:
			'Sune with the solved corner at the front-right; the front-right and back-right corners swap.',
		notes:
			'The shape repeats: F, a three-move block, F prime, then the same three-move block again on the other face. Seeing the repeat is what makes it memorable.',
		tags: ['symmetric']
	},
	{
		id: 'coll-sune-5',
		set: 'coll',
		name: 'Sune — front pair swaps',
		shortName: 'S5',
		group: 'Sune family',
		tier: 'expert',
		algs: [
			{ moves: "R U' L' U R' U' L" },
			{
				moves: "L U' R' U L' U' R",
				label: 'left-hand',
				note: 'The mirror, if your left hand is the stronger one.'
			}
		],
		recognition: 'Sune with the solved corner at the front-right; the two front corners swap.',
		notes:
			'Seven moves and no regrip. It is the Niklas commutator with its closing U turn dropped, which is exactly what turns a plain corner cycle into a cycle that also twists. One of the two cheapest algorithms in the set.',
		tags: ['fast', 'niklas', 'one-handed']
	},
	{
		id: 'coll-sune-6',
		set: 'coll',
		name: 'Sune — diagonal swap',
		shortName: 'S6',
		group: 'Sune family',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U L' U R U' L U2 R'" },
			{
				moves: "R' U2 L U' R U L' U R' U R",
				label: 'inverse-ish',
				note: 'Starts on the left instead.'
			}
		],
		recognition:
			'Sune with the solved corner at the front-right; the two corners that need to swap sit diagonally.',
		notes:
			'Diagonal cases are the longest in every family. Take the extra half second to check before you commit.',
		tags: ['long', 'two-handed']
	},

	// -------------------------------------------------------------------------
	// Anti-sune family
	// -------------------------------------------------------------------------
	{
		id: 'coll-as-1',
		set: 'coll',
		name: 'Anti-sune — corners in order',
		shortName: 'AS1',
		group: 'Anti-sune family',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R' U' R U' R'" },
			{ moves: "R' U' R U' R' U2 R", label: '2-gen', note: 'The same seven moves read backwards.' }
		],
		recognition:
			'Anti-sune shape: one solved corner, the other three twisted the other way from a Sune. Hold the solved corner at the front-right and the corners are already in order.',
		notes: 'The free one, exactly as with the Sune. Plain anti-sune does the whole job.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'fast', 'oll']
	},
	{
		id: 'coll-as-2',
		set: 'coll',
		name: 'Anti-sune — back pair swaps',
		shortName: 'AS2',
		group: 'Anti-sune family',
		tier: 'expert',
		algs: [
			{ moves: "F U2 F' U' R' F U' F' U R" },
			{ moves: "L U2 L' U2 R' U L U' L' R", label: 'two-handed' }
		],
		recognition:
			'Anti-sune with the solved corner at the front-right; the two corners along the back swap.',
		notes:
			'Opens with an anti-sune played on F rather than R, which is worth practising slowly a few times before it feels natural.',
		tags: ['awkward']
	},
	{
		id: 'coll-as-3',
		set: 'coll',
		name: 'Anti-sune — left pair swaps',
		shortName: 'AS3',
		group: 'Anti-sune family',
		tier: 'expert',
		algs: [
			{ moves: "F U R' U' R F' U' R' U2 R" },
			{ moves: "L R' U' R U L' U2 R' U2 R", label: 'two-handed' }
		],
		recognition:
			'Anti-sune with the solved corner at the front-right; the left-hand pair of corners swaps.',
		notes: 'Ends with an anti-sune, so the last four moves are muscle memory already.',
		tags: ['two-handed']
	},
	{
		id: 'coll-as-4',
		set: 'coll',
		name: 'Anti-sune — right pair swaps',
		shortName: 'AS4',
		group: 'Anti-sune family',
		tier: 'expert',
		algs: [{ moves: "R' U L U' R U L'" }, { moves: "L' U R U' L U R'", label: 'left-hand' }],
		recognition:
			'Anti-sune with the solved corner at the front-right; the front-right and back-right corners swap.',
		notes:
			'The anti-sune family answer to S5, and just as cheap: seven moves, no regrip, a Niklas shape with its closing turn dropped. If you learn only two cases outside the free ones, learn this and S5.',
		tags: ['fast', 'niklas', 'one-handed']
	},
	{
		id: 'coll-as-5',
		set: 'coll',
		name: 'Anti-sune — front pair swaps',
		shortName: 'AS5',
		group: 'Anti-sune family',
		tier: 'expert',
		algs: [
			{ moves: "R' F U2 F' R F R' U2 R F'" },
			{ moves: "F' L U2 L' F L F' U2 F L'", label: 'left-hand' }
		],
		recognition: 'Anti-sune with the solved corner at the front-right; the two front corners swap.',
		notes:
			'Mirror of the Sune case S4, and it has the same repeating shape: a wrapper, a three-move block, then the block again on the other face.',
		tags: ['symmetric', 'mirror']
	},
	{
		id: 'coll-as-6',
		set: 'coll',
		name: 'Anti-sune — diagonal swap',
		shortName: 'AS6',
		group: 'Anti-sune family',
		tier: 'expert',
		algs: [
			{ moves: "R U2 L' U R' U' L U' R U' R'" },
			{ moves: "L U2 R' U L' U' R U' L U' L'", label: 'left-hand' }
		],
		recognition:
			'Anti-sune with the solved corner at the front-right; the pair that swaps is diagonal.',
		notes:
			'A Niklas shape followed by an anti-sune finish. Break it there and it is two things you know rather than eleven moves.',
		triggers: ['Aa insert'],
		tags: ['long', 'niklas']
	},

	// -------------------------------------------------------------------------
	// Pi family
	// -------------------------------------------------------------------------
	{
		id: 'coll-pi-1',
		set: 'coll',
		name: 'Pi — corners in order',
		shortName: 'Pi1',
		group: 'Pi family',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R2 U' R2 U' R2 U2 R" },
			{
				moves: "R' U2 R2 U R2 U R2 U2 R'",
				label: '2-gen',
				note: 'The same idea on the other side.'
			}
		],
		recognition:
			'Pi shape: no corner solved, two twisted clockwise sitting next to each other and two anticlockwise. Hold the clockwise pair at the front and the corners are already in order.',
		notes:
			'This is the OLL 22 algorithm, so it costs nothing extra to learn. Nine moves and entirely two-generator — one of the nicest things in the set.',
		tags: ['2-gen', 'fast', 'oll']
	},
	{
		id: 'coll-pi-2',
		set: 'coll',
		name: 'Pi — back pair swaps',
		shortName: 'Pi2',
		group: 'Pi family',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U F2 R U2 R' U2 R' F2 R" },
			{ moves: "F R2 F' U2 F' U2 F R2 U F' U F", label: 'front-face' }
		],
		recognition:
			'Pi with the clockwise pair at the front; the two corners at the back need to trade.',
		notes:
			'The F2 turns are doing the work of a rotation. Set the cube down flat and they come out faster than they look.',
		tags: ['long', 'awkward']
	},
	{
		id: 'coll-pi-3',
		set: 'coll',
		name: 'Pi — left pair swaps',
		shortName: 'Pi3',
		group: 'Pi family',
		tier: 'expert',
		algs: [
			{ moves: "R' U' F U' R2 U R2 U F' R2 U2 R'" },
			{ moves: "R F U R2 U2 R2 U R2 U R2 F' R'", label: 'alternative' }
		],
		recognition: 'Pi with the clockwise pair at the front; the left-hand pair of corners swaps.',
		tags: ['long', 'awkward']
	},
	{
		id: 'coll-pi-4',
		set: 'coll',
		name: 'Pi — right pair swaps',
		shortName: 'Pi4',
		group: 'Pi family',
		tier: 'expert',
		algs: [
			{ moves: "L U' R' U L' U R U R' U R" },
			{ moves: "R U' L' U R' U L U L' U L", label: 'left-hand' }
		],
		recognition: 'Pi with the clockwise pair at the front; the two right-hand corners swap.',
		notes:
			'A Niklas shape, then a four-move tail. The opening is the same seven moves that solve S5, so learn this case straight after that one.',
		tags: ['niklas', 'two-handed']
	},
	{
		id: 'coll-pi-5',
		set: 'coll',
		name: 'Pi — front pair swaps',
		shortName: 'Pi5',
		group: 'Pi family',
		tier: 'expert',
		algs: [
			{ moves: "R' F2 R U2 R U2 R' F2 U' R U' R'" },
			{ moves: "F' U' F U' R2 F' U2 F U2 F R2 F'", label: 'front-face' }
		],
		recognition: 'Pi with the clockwise pair at the front; those same two front corners swap.',
		notes:
			'Finishes with an Aa insert, which is a comfortable place to land after a long algorithm.',
		triggers: ['Aa insert'],
		tags: ['long']
	},
	{
		id: 'coll-pi-6',
		set: 'coll',
		name: 'Pi — diagonal swap',
		shortName: 'Pi6',
		group: 'Pi family',
		tier: 'expert',
		algs: [
			{ moves: "F' R U F2 U R' U' R F2 U' R' F" },
			{ moves: "R F' U' R2 U' F U F' R2 U F R'", label: 'alternative' }
		],
		recognition: 'Pi with the clockwise pair at the front; the corners that swap are diagonal.',
		tags: ['long', 'awkward']
	},

	// -------------------------------------------------------------------------
	// H family
	// -------------------------------------------------------------------------
	{
		id: 'coll-h-1',
		set: 'coll',
		name: 'H — corners in order',
		shortName: 'H1',
		group: 'H family',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R' U' R U R' U' R U' R'" },
			{
				moves: "R U R' U R U' R' U R U2 R'",
				label: '2-gen',
				note: 'Reads as a sune with a sexy move inside it.'
			}
		],
		recognition:
			'H shape: no corner solved, and the two twisted clockwise sit diagonally opposite. Hold any clockwise corner at the front-right and the corners are already in order.',
		notes:
			'The OLL 21 algorithm again, so this one comes free. The H family only has four cases rather than six, because the shape looks the same after a half turn.',
		triggers: ['sexy move', 'Aa insert'],
		tags: ['2-gen', 'oll', 'fast']
	},
	{
		id: 'coll-h-2',
		set: 'coll',
		name: 'H — back pair swaps',
		shortName: 'H2',
		group: 'H family',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R2 F U' R2 U' R2 U F' U R" },
			{ moves: "R F R2 U' R2 U' R2 U2 R2 U' F' R'", label: 'alternative' }
		],
		recognition: 'H shape held with a clockwise corner at the front-right; the back pair swaps.',
		notes:
			'The two F turns bracket a short block of U and R2 turns — a conjugate with a setup on each side. Learn the bracket and the filling separately and it stops feeling like twelve moves.',
		tags: ['long']
	},
	{
		id: 'coll-h-3',
		set: 'coll',
		name: 'H — right pair swaps',
		shortName: 'H3',
		group: 'H family',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U R U L' U R' U' L" },
			{ moves: "L U L' U L U R' U L' U' R", label: 'left-hand' }
		],
		recognition:
			'H shape held with a clockwise corner at the front-right; the two right-hand corners swap.',
		notes:
			'The tail is a Niklas again. Because the H shape is symmetric, this case looks the same from two different holds — either works.',
		tags: ['niklas', 'symmetric']
	},
	{
		id: 'coll-h-4',
		set: 'coll',
		name: 'H — diagonal swap',
		shortName: 'H4',
		group: 'H family',
		tier: 'expert',
		algs: [
			{ moves: "R' F2 R2 U2 R' F2 R U2 R2 F2 R" },
			{ moves: "F R2 F2 U2 F R2 F' U2 F2 R2 F'", label: 'front-face' }
		],
		recognition: 'H shape with a diagonal pair of corners to swap.',
		notes:
			'Almost every turn is a half turn, so this one is faster in the hand than an eleven-move count suggests.',
		tags: ['half-turns', 'long']
	},

	// -------------------------------------------------------------------------
	// L family
	// -------------------------------------------------------------------------
	{
		id: 'coll-l-1',
		set: 'coll',
		name: 'L — corners in order',
		shortName: 'L1',
		group: 'L family',
		tier: 'expert',
		algs: [
			{ moves: "L U2 L' R' U' R U' R' U2 L R U L'" },
			{ moves: "R U2 L' R' U' L U' L' U2 L R U R'", label: 'alternative' }
		],
		recognition:
			'L shape — the bowtie — with the two solved corners diagonally opposite. Hold them at the front-right and back-left, with the front-left corner twisted clockwise; the corners are then already in order.',
		notes: 'The one genuinely long case in this family. Everything else here is nine or ten moves.',
		triggers: ['Aa insert'],
		tags: ['long', 'two-handed']
	},
	{
		id: 'coll-l-2',
		set: 'coll',
		name: 'L — back pair swaps',
		shortName: 'L2',
		group: 'L family',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R D R' U2 R D' R2" },
			{
				moves: "F U' R' U' R U F' U2 R' U2 R",
				label: 'no D moves',
				note: 'Two moves longer, but the cube stays flat.'
			}
		],
		recognition:
			'Bowtie held with the solved corners at the front-right and back-left and the front-left twisted clockwise; the two corners at the back swap.',
		notes:
			'The D turn regrip is worth practising: hold the cube loosely in the left hand and let the right thumb do the D.',
		tags: ['d-move', 'fast']
	},
	{
		id: 'coll-l-3',
		set: 'coll',
		name: 'L — left pair swaps',
		shortName: 'L3',
		group: 'L family',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 R' D' R U2 R' D R2" },
			{ moves: "R U R' U2 L U' R U L' U R'", label: 'no D moves' }
		],
		recognition: 'Bowtie in the same hold as L2; this time the left-hand pair of corners swaps.',
		notes:
			'The exact inverse pattern of L2 — same nine moves with every turn flipped. Learn them together.',
		mirrorOf: 'coll-l-2',
		tags: ['d-move', 'mirror', 'fast']
	},
	{
		id: 'coll-l-4',
		set: 'coll',
		name: 'L — right pair swaps',
		shortName: 'L4',
		group: 'L family',
		tier: 'expert',
		algs: [
			{ moves: "R2 D R' U R D' R' U' R'" },
			{ moves: "L' R U R' U' L U R U' R'", label: 'no D moves' }
		],
		recognition: 'Bowtie in the L2 hold; the front-right and back-right corners swap.',
		tags: ['d-move']
	},
	{
		id: 'coll-l-5',
		set: 'coll',
		name: 'L — front pair swaps',
		shortName: 'L5',
		group: 'L family',
		tier: 'expert',
		algs: [{ moves: "F U R' U' R F' R' U R" }, { moves: "R2 D' R U' R' D R U R", label: 'D move' }],
		recognition: 'Bowtie in the L2 hold; the two front corners swap.',
		notes: 'Nine moves, no half turns and no awkward grip — the friendliest case in the family.',
		tags: ['fast']
	},
	{
		id: 'coll-l-6',
		set: 'coll',
		name: 'L — diagonal swap',
		shortName: 'L6',
		group: 'L family',
		tier: 'expert',
		algs: [
			{ moves: "R U L' R' U2 R U R' U2 L" },
			{ moves: "R U2 L' R' U R U' L U2 R'", label: 'alternative' }
		],
		recognition: 'Bowtie in the L2 hold, with a diagonal pair of corners to swap.',
		notes: 'R and L turn together twice here; treat each pair as one motion rather than two moves.',
		tags: ['two-handed']
	},

	// -------------------------------------------------------------------------
	// T family
	// -------------------------------------------------------------------------
	{
		id: 'coll-t-1',
		set: 'coll',
		name: 'T — corners in order',
		shortName: 'T1',
		group: 'T family',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 R U R' U R2 U2 R' U' R U' R'" },
			{
				moves: "R U2 R' U' R U' R2 U2 R U R' U R",
				label: '2-gen',
				note: 'The mirror image, still two-generator.'
			}
		],
		recognition:
			'T shape — two solved corners side by side. Hold them at the front, and check that the back-left corner is the one twisted clockwise. The corners are then already in order.',
		notes:
			'Thirteen moves but entirely R and U, so it runs much faster than the count suggests. It is the two-generator Sune joined to an anti-sune, and the R2 in the middle is where they meet.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'long', 'one-handed']
	},
	{
		id: 'coll-t-2',
		set: 'coll',
		name: 'T — back pair swaps',
		shortName: 'T2',
		group: 'T family',
		tier: 'expert',
		algs: [
			{ moves: "R U' R' U2 L R U' R' U L'" },
			{ moves: "R' U R U2 L' R' U R U' L", label: 'left-hand' }
		],
		recognition:
			'T shape with the solved pair at the front and the back-left corner twisted clockwise; the back pair swaps.',
		notes: 'Two Aa inserts with a bit of left hand between them.',
		triggers: ['Aa insert'],
		tags: ['two-handed']
	},
	{
		id: 'coll-t-3',
		set: 'coll',
		name: 'T — left pair swaps',
		shortName: 'T3',
		group: 'T family',
		tier: 'expert',
		algs: [
			{ moves: "R U R D R' U' R D' R2" },
			{ moves: "R U R' U' L' U R U' L R'", label: 'no D moves' }
		],
		recognition: 'T shape in the T2 hold; the left-hand pair of corners swaps.',
		notes:
			'The D turn does the swapping while the R and U turns shuttle a corner in and out of the slot. Keep the grip loose and the D costs almost nothing.',
		tags: ['d-move', 'fast']
	},
	{
		id: 'coll-t-4',
		set: 'coll',
		name: 'T — right pair swaps',
		shortName: 'T4',
		group: 'T family',
		tier: 'expert',
		algs: [
			{ moves: "R' U' R F R' U R U' F'" },
			{ moves: "R' U' R' D' R U R' D R2", label: 'D move' }
		],
		recognition: 'T shape in the T2 hold; the front-right and back-right corners swap.',
		tags: ['fast']
	},
	{
		id: 'coll-t-5',
		set: 'coll',
		name: 'T — front pair swaps',
		shortName: 'T5',
		group: 'T family',
		tier: 'expert',
		algs: [
			{ moves: "R F R' U2 R F' R' F U2 F'" },
			{ moves: "F' R' F U2 F' R F R' U2 R", label: 'alternative' }
		],
		recognition: 'T shape in the T2 hold; the two front corners swap.',
		notes:
			'Another of the repeating-block shapes: a three-move group, a half turn, the same group on the other face.',
		tags: ['symmetric']
	},
	{
		id: 'coll-t-6',
		set: 'coll',
		name: 'T — diagonal swap',
		shortName: 'T6',
		group: 'T family',
		tier: 'expert',
		algs: [
			{ moves: "R' U F' R' U2 R U2 F U' R' U R2" },
			{ moves: "R2 U' R U F' U2 R' U2 R F U' R", label: 'alternative' }
		],
		recognition: 'T shape in the T2 hold, with a diagonal swap left over.',
		tags: ['long']
	},

	// -------------------------------------------------------------------------
	// U family
	// -------------------------------------------------------------------------
	{
		id: 'coll-u-1',
		set: 'coll',
		name: 'U — corners in order',
		shortName: 'U1',
		group: 'U family',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U R U2 R2 U' R U' R' U2 R" },
			{ moves: "R' U' R U' R' U2 R2 U R' U R U2 R'", label: '2-gen' }
		],
		recognition:
			'U shape — two solved corners side by side, like the T but with the twists the other way round. Hold the solved pair at the front and check that the back-right corner is twisted clockwise. The corners are then in order already.',
		notes:
			'Thirteen moves of pure R and U. It opens with a plain Sune; the R2 in the middle is where the second half begins.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'long', 'one-handed']
	},
	{
		id: 'coll-u-2',
		set: 'coll',
		name: 'U — back pair swaps',
		shortName: 'U2',
		group: 'U family',
		tier: 'expert',
		algs: [
			{ moves: "L U2 L2 R' U2 R U R' U2 L2 U' L' R" },
			{ moves: "L' U2 L2 R U2 R' U' R U2 L2 U L R'", label: 'mirror' }
		],
		recognition:
			'U shape with the solved pair at the front and the back-right corner twisted clockwise; the back pair swaps.',
		notes:
			'The worst case in the set to execute. If you are still learning, do the OLL and then a corner permutation instead — you lose very little.',
		tags: ['long', 'awkward']
	},
	{
		id: 'coll-u-3',
		set: 'coll',
		name: 'U — left pair swaps',
		shortName: 'U3',
		group: 'U family',
		tier: 'expert',
		algs: [
			{ moves: "R2 D' R U2 R' D R U2 R" },
			{ moves: "R U' L U' R' U L' U2 R U' R'", label: 'no D moves' }
		],
		recognition: 'U shape in the U1 hold; the two left-hand corners swap.',
		notes:
			'Sister algorithm to U4 — same nine moves with the D turns and the U turns going the other way.',
		mirrorOf: 'coll-u-4',
		tags: ['d-move', 'fast']
	},
	{
		id: 'coll-u-4',
		set: 'coll',
		name: 'U — right pair swaps',
		shortName: 'U4',
		group: 'U family',
		tier: 'expert',
		algs: [
			{ moves: "R2 D R' U2 R D' R' U2 R'" },
			{ moves: "R' U L' U R U' L U2 R' U R", label: 'no D moves' }
		],
		recognition: 'U shape in the U1 hold; the front-right and back-right corners swap.',
		notes: 'This is the standard OLL 23 algorithm, so most people already have it in their hands.',
		tags: ['d-move', 'oll', 'fast']
	},
	{
		id: 'coll-u-5',
		set: 'coll',
		name: 'U — front pair swaps',
		shortName: 'U5',
		group: 'U family',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 R F' R' F U2 F' R F" },
			{ moves: "F U2 F' R F R' U2 R F' R'", label: 'alternative' }
		],
		recognition: 'U shape in the U1 hold; the two front corners swap.',
		tags: ['symmetric']
	},
	{
		id: 'coll-u-6',
		set: 'coll',
		name: 'U — diagonal swap',
		shortName: 'U6',
		group: 'U family',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 R F U' R' U' R U F'" },
			{ moves: "F U' R' U R U F' R' U2 R", label: 'alternative' }
		],
		recognition: 'U shape in the U1 hold, with a diagonal pair left to swap.',
		notes: 'Ten moves for a diagonal case is unusually cheap. The U family is kind that way.',
		tags: ['two-handed']
	}
];

// ---------------------------------------------------------------------------
// Winter Variation
// ---------------------------------------------------------------------------

/**
 * Every case here starts from the same picture: three F2L slots done, the fourth
 * pair joined and sitting in the top layer at the front-left, ready for a plain
 * `R U' R'`, and all four last-layer edges already oriented. What varies is how
 * the four last-layer corners are twisted — twenty-seven ways, counting the one
 * where they are all already correct.
 *
 * The recognition notes name the corner case you would be left with if you simply
 * inserted the pair, because that is how the case is actually spotted: you see the
 * pair, you see the corners, and you know which OLL you are heading for.
 */
export const WINTER_VARIATION_CASES: readonly AlgCase[] = [
	{
		id: 'wv-oriented',
		set: 'winter-variation',
		name: 'Corners already oriented',
		shortName: 'WV0',
		tier: 'expert',
		algs: [{ moves: "R U' R'" }],
		recognition:
			'The pair is joined at the front-left of the top layer, its two front stickers matching, and all four last-layer corners already show the top colour. Nothing to influence.',
		notes:
			'The case that costs nothing, and a useful reference point: every other Winter Variation algorithm is this insertion with corner twisting folded into it.',
		triggers: ['Aa insert'],
		tags: ['free', 'fast']
	},

	// -------------------------------------------------------------------------
	// Sune cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-sune-1',
		set: 'winter-variation',
		name: 'Sune — solved corner at the front-right',
		shortName: 'WV S1',
		group: 'Sune cases',
		tier: 'expert',
		algs: [{ moves: "R U' R2 U2 R U R' U R" }],
		recognition:
			'Insert the pair with R U prime R prime and you would be looking at a Sune whose one solved corner sits at the front-right.',
		notes:
			'Starts with the insertion itself, then rebuilds the top. Useful when you spot the case late.',
		tags: ['2-gen']
	},
	{
		id: 'wv-sune-2',
		set: 'winter-variation',
		name: 'Sune — solved corner at the front-left',
		shortName: 'WV S2',
		group: 'Sune cases',
		tier: 'expert',
		algs: [{ moves: "U R U2 R'" }],
		recognition:
			'A plain insertion would leave a Sune with the solved corner at the front-left, above the slot you are filling.',
		notes:
			'Four moves to insert a pair and orient every last-layer corner. This case alone repays the cost of learning the set — recognise it, and never do the OLL.',
		tags: ['fast', '2-gen', 'free']
	},
	{
		id: 'wv-sune-3',
		set: 'winter-variation',
		name: 'Sune — solved corner at the back-left',
		shortName: 'WV S3',
		group: 'Sune cases',
		tier: 'expert',
		algs: [
			{ moves: "R U' R' U' R U R' U R U2 R'" },
			{
				moves: "L' U2 L R U R' U L' U L",
				label: 'two-handed',
				note: 'A move shorter if you are happy using both hands.'
			}
		],
		recognition: 'Inserting normally would leave a Sune with its solved corner at the back-left.',
		notes: 'Insertion first, then a sune. The longest of the four Sune cases.',
		triggers: ['sune', 'Aa insert'],
		tags: ['2-gen', 'long']
	},
	{
		id: 'wv-sune-4',
		set: 'winter-variation',
		name: 'Sune — solved corner at the back-right',
		shortName: 'WV S4',
		group: 'Sune cases',
		tier: 'expert',
		algs: [{ moves: "U L' U R U' L U2 R'" }, { moves: "U R2 D R' U2 R D' R2", label: 'D move' }],
		recognition: 'Inserting normally would leave a Sune with its solved corner at the back-right.',
		notes: 'A Niklas shape doing the corner work while the pair goes in behind it.',
		tags: ['niklas', 'two-handed']
	},

	// -------------------------------------------------------------------------
	// Anti-sune cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-as-1',
		set: 'winter-variation',
		name: 'Anti-sune — solved corner at the front-right',
		shortName: 'WV AS1',
		group: 'Anti-sune cases',
		tier: 'expert',
		algs: [{ moves: "U R' U' R2 U' R2 U2 R" }],
		recognition:
			'A plain insertion would leave an anti-sune with the solved corner at the front-right.',
		tags: ['2-gen']
	},
	{
		id: 'wv-as-2',
		set: 'winter-variation',
		name: 'Anti-sune — solved corner at the front-left',
		shortName: 'WV AS2',
		group: 'Anti-sune cases',
		tier: 'expert',
		algs: [
			{ moves: "R U' R' U R' U' R U' R' U2 R" },
			{ moves: "R U' L R' U2 L' U' L U' L'", label: 'two-handed' }
		],
		recognition:
			'A plain insertion would leave an anti-sune with the solved corner at the front-left.',
		notes:
			'Insert, then an anti-sune played from the wrong side. Slow to learn, fine once it settles.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'long']
	},
	{
		id: 'wv-as-3',
		set: 'winter-variation',
		name: 'Anti-sune — solved corner at the back-left',
		shortName: 'WV AS3',
		group: 'Anti-sune cases',
		tier: 'expert',
		algs: [{ moves: "R U' R2 U' R U' R' U2 R" }],
		recognition:
			'A plain insertion would leave an anti-sune with the solved corner at the back-left.',
		triggers: ['Aa insert'],
		tags: ['2-gen']
	},
	{
		id: 'wv-as-4',
		set: 'winter-variation',
		name: 'Anti-sune — solved corner at the back-right',
		shortName: 'WV AS4',
		group: 'Anti-sune cases',
		tier: 'expert',
		algs: [{ moves: "R U R' U' R U' R'" }],
		recognition:
			'A plain insertion would leave an anti-sune with the solved corner at the back-right.',
		notes:
			'A sexy move and an Aa insert: seven moves you already own. Along with WV S2, this is the case that sells the set.',
		triggers: ['sexy move', 'Aa insert'],
		tags: ['fast', '2-gen', 'sexy']
	},

	// -------------------------------------------------------------------------
	// Pi cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-pi-1',
		set: 'winter-variation',
		name: 'Pi — clockwise pair at the front',
		shortName: 'WV Pi1',
		group: 'Pi cases',
		tier: 'expert',
		algs: [{ moves: "U R' U L U' R2 U L' U R'" }],
		recognition:
			'Inserting normally would leave a Pi, with the two corners twisted clockwise sitting along the front.',
		notes:
			'Two Niklas halves sharing a middle. Watch the R2 — under pressure it is easy to turn it only once.',
		tags: ['niklas', 'two-handed']
	},
	{
		id: 'wv-pi-2',
		set: 'winter-variation',
		name: 'Pi — clockwise pair on the right',
		shortName: 'WV Pi2',
		group: 'Pi cases',
		tier: 'expert',
		algs: [{ moves: "U R U2 R2 U2 R U R' U R" }],
		recognition:
			'A plain insertion would leave a Pi with the clockwise pair down the right-hand side.',
		tags: ['2-gen', 'long']
	},
	{
		id: 'wv-pi-3',
		set: 'winter-variation',
		name: 'Pi — clockwise pair on the left',
		shortName: 'WV Pi3',
		group: 'Pi cases',
		tier: 'expert',
		algs: [
			{ moves: "U F' R U2 R' U2 R' F R" },
			{
				moves: "U F2 R U2 R' U2 R' F2 R",
				label: 'half turns',
				note: 'Some people find the F2 grip easier than F and F prime.'
			}
		],
		recognition:
			'A plain insertion would leave a Pi with the clockwise pair down the left-hand side.',
		tags: ['two-handed']
	},
	{
		id: 'wv-pi-4',
		set: 'winter-variation',
		name: 'Pi — clockwise pair at the back',
		shortName: 'WV Pi4',
		group: 'Pi cases',
		tier: 'expert',
		algs: [{ moves: "R U R2 U' R2 U' R2 U2 R" }],
		recognition: 'A plain insertion would leave a Pi with the clockwise pair along the back.',
		notes: 'Very nearly the OLL 22 algorithm, with the opening turn changed to do the insertion.',
		tags: ['2-gen', 'oll']
	},

	// -------------------------------------------------------------------------
	// H cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-h-1',
		set: 'winter-variation',
		name: 'H — clockwise pair front-right to back-left',
		shortName: 'WV H1',
		group: 'H cases',
		tier: 'expert',
		algs: [{ moves: "U R U' R' U R U2 R'" }, { moves: "U R U L' U R' U' L", label: 'two-handed' }],
		recognition:
			'A plain insertion would leave an H, with the two clockwise-twisted corners on the front-right to back-left diagonal.',
		notes:
			'Eight moves, all right hand. The H family only has two cases, so this is cheap knowledge.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'fast']
	},
	{
		id: 'wv-h-2',
		set: 'winter-variation',
		name: 'H — clockwise pair front-left to back-right',
		shortName: 'WV H2',
		group: 'H cases',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U' R U R' U' R U' R'" },
			{ moves: "L' U R U' L U R' U R U R'", label: 'two-handed' }
		],
		recognition:
			'A plain insertion would leave an H, with the clockwise pair on the other diagonal from WV H1.',
		notes: 'Two sexy moves and an Aa insert. Nothing new to learn, only a new place to use it.',
		triggers: ['double sexy', 'Aa insert'],
		tags: ['2-gen', 'sexy', 'long']
	},

	// -------------------------------------------------------------------------
	// L cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-l-1',
		set: 'winter-variation',
		name: 'L — solved corners front-right and back-left, front-left clockwise',
		shortName: 'WV L1',
		group: 'L cases',
		tier: 'expert',
		algs: [
			{ moves: "R2 D R' U R D' R' U2 R'" },
			{ moves: "R U R D R' U2 R D' R2", label: 'alternative' }
		],
		recognition:
			'Inserting normally would leave a bowtie with its two solved corners at the front-right and back-left, and the front-left corner twisted clockwise.',
		notes:
			'The D turns do the corner work. Keep the grip loose so the D and D prime do not cost you a regrip each.',
		tags: ['d-move']
	},
	{
		id: 'wv-l-2',
		set: 'winter-variation',
		name: 'L — solved corners front-right and back-left, front-left anticlockwise',
		shortName: 'WV L2',
		group: 'L cases',
		tier: 'expert',
		algs: [
			{ moves: "R U' R D' R U' R' D R U R" },
			{ moves: "R2 F2 U2 R' U' R U' F2 R' U' R'", label: 'no D moves' }
		],
		recognition:
			'The same bowtie positions as WV L1, but the twists run the other way: the front-left corner is twisted anticlockwise.',
		notes:
			'The pair of L cases with the solved corners in the same place are easy to confuse. Check the twist direction before you start.',
		triggers: ['Aa insert'],
		tags: ['d-move', 'long']
	},
	{
		id: 'wv-l-3',
		set: 'winter-variation',
		name: 'L — solved corners front-left and back-right, front-right clockwise',
		shortName: 'WV L3',
		group: 'L cases',
		tier: 'expert',
		algs: [{ moves: "R2 U' L' U R' U' L R'" }, { moves: "U2 L U' R U L' U R'", label: 'niklas' }],
		recognition:
			'Inserting normally would leave a bowtie with its solved corners at the front-left and back-right, the front-right corner twisted clockwise.',
		tags: ['two-handed', 'fast']
	},
	{
		id: 'wv-l-4',
		set: 'winter-variation',
		name: 'L — solved corners front-left and back-right, front-right anticlockwise',
		shortName: 'WV L4',
		group: 'L cases',
		tier: 'expert',
		algs: [{ moves: "L' U2 R U R' U2 L" }, { moves: "F' U' L' U2 L U F", label: 'front-face' }],
		recognition: 'The mirror twist of WV L3: same solved corners, opposite directions.',
		notes: 'Seven moves and beautifully symmetric — L prime, U2, a three-move middle, U2, L.',
		tags: ['fast', 'symmetric', 'two-handed']
	},

	// -------------------------------------------------------------------------
	// T cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-t-1',
		set: 'winter-variation',
		name: 'T — solved pair at the front',
		shortName: 'WV T1',
		group: 'T cases',
		tier: 'expert',
		algs: [{ moves: "R2 D R' U' R D' R2" }],
		recognition:
			'A plain insertion would leave a T shape with its two solved corners along the front.',
		notes:
			'Seven moves, and two nested conjugates: R2 sets the pair up, then D and D prime bracket a three-move insertion. Reading it that way is quicker than memorising the string.',
		tags: ['d-move', 'conjugate', 'fast']
	},
	{
		id: 'wv-t-2',
		set: 'winter-variation',
		name: 'T — solved pair on the right',
		shortName: 'WV T2',
		group: 'T cases',
		tier: 'expert',
		algs: [{ moves: "U' L' U R U' R' L" }],
		recognition:
			'A plain insertion would leave a T shape with its solved corners down the right-hand side.',
		triggers: ['Aa insert'],
		tags: ['two-handed', 'fast']
	},
	{
		id: 'wv-t-3',
		set: 'winter-variation',
		name: 'T — solved pair at the back',
		shortName: 'WV T3',
		group: 'T cases',
		tier: 'expert',
		algs: [
			{ moves: "F' U' F R' F R F2 U F" },
			{ moves: "R U2 R' U2 L R U' R' U L'", label: 'two-handed' }
		],
		recognition: 'A plain insertion would leave a T shape with its solved corners along the back.',
		tags: ['awkward']
	},
	{
		id: 'wv-t-4',
		set: 'winter-variation',
		name: 'T — solved pair on the left',
		shortName: 'WV T4',
		group: 'T cases',
		tier: 'expert',
		algs: [
			{ moves: "U' R' F' R U2 R U2 R' F" },
			{ moves: "R' F R F' R U' R' F' U F", label: 'alternative' }
		],
		recognition:
			'A plain insertion would leave a T shape with its solved corners down the left-hand side.',
		tags: ['awkward']
	},

	// -------------------------------------------------------------------------
	// U cases
	// -------------------------------------------------------------------------
	{
		id: 'wv-u-1',
		set: 'winter-variation',
		name: 'U — solved pair at the front',
		shortName: 'WV U1',
		group: 'U cases',
		tier: 'expert',
		algs: [{ moves: "L' U2 R U' R' U' R U' L R'" }],
		recognition:
			'A plain insertion would leave a U shape — the headlights — with its two solved corners along the front.',
		triggers: ['Aa insert'],
		tags: ['two-handed', 'long']
	},
	{
		id: 'wv-u-2',
		set: 'winter-variation',
		name: 'U — solved pair on the right',
		shortName: 'WV U2',
		group: 'U cases',
		tier: 'expert',
		algs: [
			{ moves: "U2 R' D' R U2 R' D R2 U' R'" },
			{ moves: "U' R2 F2 R2 U R U' R F2 R2", label: 'no D moves' }
		],
		recognition:
			'A plain insertion would leave headlights with the solved corners down the right-hand side.',
		tags: ['d-move', 'long']
	},
	{
		id: 'wv-u-3',
		set: 'winter-variation',
		name: 'U — solved pair on the left',
		shortName: 'WV U3',
		group: 'U cases',
		tier: 'expert',
		algs: [{ moves: "R' D' R U R' D R2 U2 R'" }],
		recognition:
			'A plain insertion would leave headlights with the solved corners down the left-hand side.',
		notes:
			'This one is the corner commutator R prime D prime R against U, followed by the four-move WV S2 insertion. The two run into each other and a U turn cancels, which is why the written form has an R2 in it.',
		tags: ['d-move', 'commutator']
	},
	{
		id: 'wv-u-4',
		set: 'winter-variation',
		name: 'U — solved pair at the back',
		shortName: 'WV U4',
		group: 'U cases',
		tier: 'expert',
		algs: [
			{ moves: "U R U2 R2 U' R U' R' U2 R" },
			{ moves: "U R' U2 R2 U R2 U R2 U' R'", label: 'alternative' }
		],
		recognition: 'A plain insertion would leave headlights with the solved corners along the back.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'long']
	}
];

// ---------------------------------------------------------------------------
// CMLL — the Roux corners step
// ---------------------------------------------------------------------------

/**
 * The same forty-two corner cases as COLL, solved under a different rule: only R,
 * U and F turns are allowed, so the M slice — and with it the six edges the last
 * Roux step still needs — is left alone. Nothing here contains a slice turn, a
 * wide turn or a rotation.
 *
 * Because the edges are irrelevant, CMLL algorithms can be shorter than their COLL
 * cousins; several of them are permutations you already know, used purely for what
 * they do to the corners.
 */
export const CMLL_CASES: readonly AlgCase[] = [
	// -------------------------------------------------------------------------
	// No corners oriented
	// -------------------------------------------------------------------------
	{
		id: 'cmll-pi-1',
		set: 'cmll',
		name: 'Pi — corners in order',
		shortName: 'Pi1',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R2 U' R2 U' R2 U2 R" },
			{ moves: "R' U2 R2 U R2 U R2 U2 R'", label: '2-gen' },
			{
				moves: "F R U R' U' R U R' U' F'",
				label: 'double sexy',
				note: 'A move longer, but you know it already.'
			}
		],
		recognition:
			'No corner shows the top colour. Two corners twisted clockwise sit next to each other, two anticlockwise. Hold the clockwise pair at the front and the corners are already in the right order.',
		notes:
			'OLL 22 doing double duty. Two-generator, nine moves, and no reason ever to use anything else.',
		tags: ['2-gen', 'fast', 'oll']
	},
	{
		id: 'cmll-pi-2',
		set: 'cmll',
		name: 'Pi — back pair swaps',
		shortName: 'Pi2',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U R2 F2 R' U2 R F2 R2" },
			{ moves: "R U2 R' U2 R' F R2 U R' U' F'", label: 'alternative' }
		],
		recognition:
			'Pi with the clockwise pair at the front; the two corners at the back still need to swap.',
		tags: ['long']
	},
	{
		id: 'cmll-pi-3',
		set: 'cmll',
		name: 'Pi — left pair swaps',
		shortName: 'Pi3',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 F U2 F' U2 F' U2 R" },
			{ moves: "R' F2 U F2 U' F2 U' F2 R", label: 'half turns' }
		],
		recognition: 'Pi with the clockwise pair at the front; the left-hand pair swaps.',
		notes:
			'Bracketed by R prime and R, with alternating U2 turns doing most of the work. Nine moves that come out much faster than they read.',
		tags: ['half-turns', 'fast']
	},
	{
		id: 'cmll-pi-4',
		set: 'cmll',
		name: 'Pi — right pair swaps',
		shortName: 'Pi4',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U R2 F R F' U F R' F' R" },
			{ moves: "F' U' F2 R' F' R U' R' F R F'", label: 'alternative' }
		],
		recognition: 'Pi with the clockwise pair at the front; the two right-hand corners swap.',
		notes: 'Two hedgeslammers with a U turn between them, once you see where to break it.',
		triggers: ['hedgeslammer'],
		tags: ['long', 'sledge']
	},
	{
		id: 'cmll-pi-5',
		set: 'cmll',
		name: 'Pi — front pair swaps',
		shortName: 'Pi5',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R2 F2 R' U2 R F2 R2 U' R U' R'" },
			{ moves: "F U R U' R2 F' R U2 R U2 R'", label: 'alternative' }
		],
		recognition: 'Pi with the clockwise pair at the front; those same two corners swap.',
		triggers: ['Aa insert'],
		tags: ['long']
	},
	{
		id: 'cmll-pi-6',
		set: 'cmll',
		name: 'Pi — diagonal swap',
		shortName: 'Pi6',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' U' R U' R' U F' U F R" },
			{ moves: "R' F' U' F U' R U R' U R", label: 'alternative' }
		],
		recognition: 'Pi with the clockwise pair at the front and a diagonal swap left over.',
		notes:
			'Ten moves for a diagonal case is a bargain. Compare it with the seventeen-move Y permutation in the all-oriented group.',
		triggers: ['Aa insert'],
		tags: ['fast']
	},
	{
		id: 'cmll-h-1',
		set: 'cmll',
		name: 'H — corners in order',
		shortName: 'H1',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R' U' R U R' U' R U' R'" },
			{ moves: "R U R' U R U' R' U R U2 R'", label: '2-gen' }
		],
		recognition:
			'No corner oriented and the two clockwise-twisted ones sit diagonally. Any hold with a clockwise corner at the front-right works; the corners are already in order.',
		notes:
			'OLL 21. The H family has four cases rather than six because the shape survives a half turn unchanged.',
		triggers: ['sexy move', 'Aa insert'],
		tags: ['2-gen', 'oll']
	},
	{
		id: 'cmll-h-2',
		set: 'cmll',
		name: 'H — back pair swaps',
		shortName: 'H2',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' U2 F U2 F U2 F' U2 R" },
			{ moves: "R' F2 U F2 U F2 U' F2 R", label: 'half turns' }
		],
		recognition: 'H shape held with a clockwise corner at the front-right; the back pair swaps.',
		notes:
			'Exactly one turn different from the Pi3 algorithm — the fifth move. Worth learning the two side by side so the difference sticks.',
		tags: ['half-turns', 'fast']
	},
	{
		id: 'cmll-h-3',
		set: 'cmll',
		name: 'H — right pair swaps',
		shortName: 'H3',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' F R F' U' F R' F' R2 U' R'" },
			{ moves: "F R' F' R U R' F R F2 U F", label: 'alternative' }
		],
		recognition:
			'H shape with a clockwise corner at the front-right; the two right-hand corners swap.',
		triggers: ['sledgehammer'],
		tags: ['long', 'sledge']
	},
	{
		id: 'cmll-h-4',
		set: 'cmll',
		name: 'H — diagonal swap',
		shortName: 'H4',
		group: 'No corners oriented',
		tier: 'expert',
		algs: [
			{ moves: 'R U2 R2 F2 R F2 R U2 R2 F2 R' },
			{ moves: "F R2 F2 U2 F R2 F' U2 F2 R2 F'", label: 'front-face' }
		],
		recognition: 'H shape with a diagonal pair still to swap.',
		notes: 'Nothing but half turns after the first move. Put the cube down flat and turn.',
		tags: ['half-turns', 'long']
	},

	// -------------------------------------------------------------------------
	// One corner oriented
	// -------------------------------------------------------------------------
	{
		id: 'cmll-sune-1',
		set: 'cmll',
		name: 'Sune — corners in order',
		shortName: 'S1',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [{ moves: "R U R' U R U2 R'" }, { moves: "R' U2 R U R' U R", label: '2-gen' }],
		recognition:
			'One corner shows the top colour, the other three point their top colour round the same way. Hold the solved corner at the front-right; the corners are already in order.',
		notes:
			'A plain Sune. In Roux this comes up about as often as anything else, so it is the first CMLL to have cold.',
		triggers: ['sune'],
		tags: ['2-gen', 'fast', 'oll']
	},
	{
		id: 'cmll-sune-2',
		set: 'cmll',
		name: 'Sune — back pair swaps',
		shortName: 'S2',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [{ moves: "F R' F' R U2 R U2 R'" }],
		recognition: 'Sune with the solved corner at the front-right; the back pair swaps.',
		notes:
			'A hedgeslammer and then a two-generator tail. Eight moves, and the hedgeslammer sets your grip up nicely for the rest.',
		triggers: ['hedgeslammer'],
		tags: ['fast', 'sledge']
	},
	{
		id: 'cmll-sune-3',
		set: 'cmll',
		name: 'Sune — left pair swaps',
		shortName: 'S3',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [
			{ moves: "F' U2 F U2 F R' F' R" },
			{ moves: "F U R U2 R' U' R U R' F'", label: 'alternative' }
		],
		recognition: 'Sune with the solved corner at the front-right; the left-hand pair swaps.',
		notes: 'The mirror thought of S2: the hedgeslammer has moved to the end.',
		triggers: ['hedgeslammer'],
		tags: ['fast', 'sledge']
	},
	{
		id: 'cmll-sune-4',
		set: 'cmll',
		name: 'Sune — right pair swaps',
		shortName: 'S4',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [{ moves: "F R' U2 R F' R' F U2 F' R" }],
		recognition:
			'Sune with the solved corner at the front-right; the front-right and back-right corners swap.',
		notes:
			'The same repeating shape as its COLL counterpart, which means one algorithm covers the case in both methods.',
		tags: ['symmetric']
	},
	{
		id: 'cmll-sune-5',
		set: 'cmll',
		name: 'Sune — front pair swaps',
		shortName: 'S5',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [
			{ moves: "F2 R' F' R U F' R' F' R" },
			{ moves: "F R' U R U' F' U R' U' R", label: 'alternative' }
		],
		recognition: 'Sune with the solved corner at the front-right; the two front corners swap.',
		notes:
			'The COLL answer to this case is seven moves, but it needs L turns, which Roux cannot spend here. Nine moves is the price of keeping the M slice free.',
		tags: ['awkward']
	},
	{
		id: 'cmll-sune-6',
		set: 'cmll',
		name: 'Sune — diagonal swap',
		shortName: 'S6',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U R' F R F' R U2 R'" },
			{ moves: "R' U2 R U R' U F' U' F U R", label: 'alternative' }
		],
		recognition: 'Sune with the solved corner at the front-right and a diagonal swap to make.',
		notes: 'A Sune with a sledgehammer pushed into the middle of it.',
		triggers: ['sledgehammer'],
		tags: ['long', 'sledge']
	},
	{
		id: 'cmll-as-1',
		set: 'cmll',
		name: 'Anti-sune — corners in order',
		shortName: 'AS1',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [{ moves: "R U2 R' U' R U' R'" }, { moves: "R' U' R U' R' U2 R", label: '2-gen' }],
		recognition:
			'Anti-sune shape with the solved corner at the front-right, and the corners already in order.',
		notes:
			'Plain anti-sune. Together with S1 this is a quarter of all the cases where one corner is oriented.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'fast', 'oll']
	},
	{
		id: 'cmll-as-2',
		set: 'cmll',
		name: 'Anti-sune — back pair swaps',
		shortName: 'AS2',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [{ moves: "R U2 R' U2 R' F R F'" }],
		recognition: 'Anti-sune with the solved corner at the front-right; the back pair swaps.',
		notes:
			'Anti-sune opening, sledgehammer close. Eight moves and both halves are already in your hands.',
		triggers: ['sledgehammer'],
		tags: ['fast', 'sledge']
	},
	{
		id: 'cmll-as-3',
		set: 'cmll',
		name: 'Anti-sune — left pair swaps',
		shortName: 'AS3',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' F R F' U2 F' U2 F" },
			{ moves: "F R U' R' U R U2 R' U' F'", label: 'alternative' }
		],
		recognition: 'Anti-sune with the solved corner at the front-right; the left-hand pair swaps.',
		notes: 'Sledgehammer first this time. Compare with AS2, where it comes last.',
		triggers: ['sledgehammer'],
		tags: ['fast', 'sledge']
	},
	{
		id: 'cmll-as-4',
		set: 'cmll',
		name: 'Anti-sune — right pair swaps',
		shortName: 'AS4',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' F R F U' R' F R F2" },
			{ moves: "R' U R U' F U R' U' R F'", label: 'alternative' }
		],
		recognition:
			'Anti-sune with the solved corner at the front-right; the two right-hand corners swap.',
		notes:
			'Note the F rather than F prime in the middle of the first algorithm — it is not quite the sledgehammer your fingers will expect.',
		tags: ['awkward']
	},
	{
		id: 'cmll-as-5',
		set: 'cmll',
		name: 'Anti-sune — front pair swaps',
		shortName: 'AS5',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [{ moves: "R' F U2 F' R F R' U2 R F'" }],
		recognition: 'Anti-sune with the solved corner at the front-right; the two front corners swap.',
		notes:
			'Identical to the COLL algorithm for the same case, so it is free if you already know one of the two sets.',
		tags: ['symmetric']
	},
	{
		id: 'cmll-as-6',
		set: 'cmll',
		name: 'Anti-sune — diagonal swap',
		shortName: 'AS6',
		group: 'One corner oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R' F R' F' R U' R U' R'" },
			{ moves: "R' U' F' U F U' R U' R' U2 R", label: 'alternative' }
		],
		recognition: 'Anti-sune with the solved corner at the front-right and a diagonal swap left.',
		triggers: ['hedgeslammer', 'Aa insert'],
		tags: ['long']
	},

	// -------------------------------------------------------------------------
	// Two corners oriented
	// -------------------------------------------------------------------------
	{
		id: 'cmll-t-1',
		set: 'cmll',
		name: 'T — corners in order',
		shortName: 'T1',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' U' R U R' F2 U F R' F R2" },
			{ moves: "R U R' F2 U F R' F R2 U' R'", label: 'alternative' }
		],
		recognition:
			'Two corners side by side show the top colour. Hold them at the front and check that the back-left corner is the one twisted clockwise. The corners are then already in order.',
		notes:
			'The T and U shapes are the pair people mix up most. The difference is only which way the two unsolved corners are twisted.',
		tags: ['long']
	},
	{
		id: 'cmll-t-2',
		set: 'cmll',
		name: 'T — back pair swaps',
		shortName: 'T2',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' F' R F' U' F' U F2 U' F'" },
			{ moves: "R' U R U F' U R' U R U2 F", label: 'alternative' }
		],
		recognition:
			'T shape with the solved pair at the front and the back-left corner twisted clockwise; the back pair swaps.',
		tags: ['long', 'awkward']
	},
	{
		id: 'cmll-t-3',
		set: 'cmll',
		name: 'T — left pair swaps',
		shortName: 'T3',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [{ moves: "R U R' U' R' F R F'" }],
		recognition: 'T shape in the T1 hold; the left-hand pair of corners swaps.',
		notes:
			'Sexy move, sledgehammer. Probably the single best-known eight moves on the cube, and here it does a whole CMLL case on its own.',
		triggers: ['sexy move', 'sledgehammer'],
		tags: ['fast', 'sexy', 'sledge']
	},
	{
		id: 'cmll-t-4',
		set: 'cmll',
		name: 'T — right pair swaps',
		shortName: 'T4',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [{ moves: "F U F' U' R' F' R" }, { moves: "R' F R U2 F U2 F'", label: 'alternative' }],
		recognition: 'T shape in the T1 hold; the front-right and back-right corners swap.',
		notes: 'Seven moves; only the six-move U6 is shorter.',
		tags: ['fast']
	},
	{
		id: 'cmll-t-5',
		set: 'cmll',
		name: 'T — front pair swaps',
		shortName: 'T5',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "F R' U' R F' R' U F' R" },
			{ moves: "R U2 R F2 R' U2 R F2 R2", label: 'half turns' }
		],
		recognition: 'T shape in the T1 hold; the two front corners swap.',
		tags: ['awkward']
	},
	{
		id: 'cmll-t-6',
		set: 'cmll',
		name: 'T — diagonal swap',
		shortName: 'T6',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R2 F2 R U' F' U F R' F2 R2" },
			{ moves: "R2 U' R F R' U R2 U' R' F' R", label: 'alternative' }
		],
		recognition: 'T shape in the T1 hold, with a diagonal swap left.',
		tags: ['long']
	},
	{
		id: 'cmll-u-1',
		set: 'cmll',
		name: 'U — corners in order',
		shortName: 'U1',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R2 F' R F' U' F2 R U' R' U R" },
			{ moves: "F2 R U' R' U R U R2 F' R F'", label: 'alternative' }
		],
		recognition:
			'Two solved corners side by side, held at the front, with the back-right corner twisted clockwise. The corners are already in order.',
		notes: 'The headlights shape. If it looks like T1 but the twists feel wrong, it is this.',
		triggers: ['Aa insert'],
		tags: ['long']
	},
	{
		id: 'cmll-u-2',
		set: 'cmll',
		name: 'U — back pair swaps',
		shortName: 'U2',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R2 U' R F R' U R2 F U' F'" },
			{ moves: "F U F' R2 U' R F' R' U R2", label: 'alternative' }
		],
		recognition:
			'Headlights held with the solved pair at the front and the back-right corner clockwise; the back pair swaps.',
		tags: ['long']
	},
	{
		id: 'cmll-u-3',
		set: 'cmll',
		name: 'U — left pair swaps',
		shortName: 'U3',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [{ moves: "R2 U' R F2 R' U R F2 R" }],
		recognition: 'Headlights in the U1 hold; the left-hand pair of corners swaps.',
		notes:
			'Two F2 turns hold the shape together. With the cube flat on the table they cost almost nothing, which makes this one of the quicker nine-move cases.',
		tags: ['half-turns', 'fast']
	},
	{
		id: 'cmll-u-4',
		set: 'cmll',
		name: 'U — right pair swaps',
		shortName: 'U4',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U' R' U' F' U2 F U R U' R'" },
			{ moves: "R' U2 R U2 F U' R' U R U F'", label: 'alternative' }
		],
		recognition: 'Headlights in the U1 hold; the front-right and back-right corners swap.',
		notes:
			'Two Aa inserts either side of F prime, U2, F. Chunk it that way and eleven moves become three thoughts.',
		triggers: ['Aa insert'],
		tags: ['long']
	},
	{
		id: 'cmll-u-5',
		set: 'cmll',
		name: 'U — front pair swaps',
		shortName: 'U5',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R' F U' R F R' U R F'" },
			{ moves: "R2 F2 R' U2 R F2 R' U2 R'", label: 'half turns' }
		],
		recognition: 'Headlights in the U1 hold; the two front corners swap.',
		tags: ['fast']
	},
	{
		id: 'cmll-u-6',
		set: 'cmll',
		name: 'U — diagonal swap',
		shortName: 'U6',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "F R U R' U' F'" },
			{ moves: "F U R U' R' F'", label: 'alternative' },
			{
				moves: "R' U' F' U F R",
				label: 'inverse',
				note: 'The same six moves inverted, if the grip suits you better.'
			}
		],
		recognition: 'Headlights in the U1 hold, with a diagonal swap left to make.',
		notes:
			'Six moves — the cheapest case in the set, and a diagonal one at that. It is the sexy move wrapped in F and F prime, which is to say a conjugate of a commutator.',
		triggers: ['sexy move'],
		tags: ['fast', 'sexy', 'commutator']
	},
	{
		id: 'cmll-l-1',
		set: 'cmll',
		name: 'L — corners in order',
		shortName: 'L1',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U R U' R2 F R F2 U F" },
			{ moves: "F' U' F2 R' F' R2 U R' U' R U' R'", label: 'alternative' }
		],
		recognition:
			'Two corners show the top colour and they sit diagonally — the bowtie. Hold them at the front-right and back-left with the front-left corner twisted clockwise; the corners are already in order.',
		notes:
			'Twelve moves with no obvious structure to hang them on, which is why most people leave this one until last.',
		tags: ['long', 'awkward']
	},
	{
		id: 'cmll-l-2',
		set: 'cmll',
		name: 'L — back pair swaps',
		shortName: 'L2',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U R' U' F' U2 F U R U R'" },
			{ moves: "F U2 F2 U' R U' R' U F2 U' F'", label: 'alternative' }
		],
		recognition:
			'Bowtie held with the solved corners front-right and back-left, front-left twisted clockwise; the back pair swaps.',
		triggers: ['sexy move'],
		tags: ['long', 'sexy']
	},
	{
		id: 'cmll-l-3',
		set: 'cmll',
		name: 'L — left pair swaps',
		shortName: 'L3',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [{ moves: "R' F2 R' U' R F2 R' U R2" }],
		recognition: 'Bowtie in the L1 hold; the left-hand pair swaps.',
		notes:
			'Nine moves with two F2 turns doing the heavy lifting. It is the U3 algorithm run backwards, which is a pleasing accident and one less thing to memorise.',
		tags: ['half-turns', 'fast']
	},
	{
		id: 'cmll-l-4',
		set: 'cmll',
		name: 'L — right pair swaps',
		shortName: 'L4',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "F R' F' R U R U' R'" },
			{ moves: "R U R' F' U F R U' R'", label: 'alternative' }
		],
		recognition: 'Bowtie in the L1 hold; the front-right and back-right corners swap.',
		notes:
			'Hedgeslammer then an Aa insert with a U in between. Eight moves of things you already do without thinking.',
		triggers: ['hedgeslammer', 'Aa insert'],
		tags: ['fast', 'sledge']
	},
	{
		id: 'cmll-l-5',
		set: 'cmll',
		name: 'L — front pair swaps',
		shortName: 'L5',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [{ moves: "R' F R U F U' F'" }, { moves: "F U2 F' U2 R' F' R", label: 'alternative' }],
		recognition: 'Bowtie in the L1 hold; the two front corners swap.',
		notes:
			'Seven moves. Both versions are short enough that it is worth knowing which one your fingers prefer.',
		tags: ['fast']
	},
	{
		id: 'cmll-l-6',
		set: 'cmll',
		name: 'L — diagonal swap',
		shortName: 'L6',
		group: 'Two corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R U2 R' F R' F' R2 U2 R'" },
			{ moves: "R U2 R2 F R F' R U2 R'", label: 'alternative' }
		],
		recognition: 'Bowtie in the L1 hold, with a diagonal swap left over.',
		notes:
			'The two algorithms differ by one turn in the middle. Pick one and stay with it, or you will meet the other by accident.',
		tags: ['fast']
	},

	// -------------------------------------------------------------------------
	// All corners oriented
	// -------------------------------------------------------------------------
	{
		id: 'cmll-o-1',
		set: 'cmll',
		name: 'Corners oriented — adjacent swap',
		shortName: 'O1',
		group: 'All corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "R2 F2 R' U' R F2 R' U R'" },
			{
				moves: "R U R' F' R U R' U' R' F R2 U' R'",
				label: 'T permutation',
				note: 'Four moves longer, and one you already know from CFOP.'
			}
		],
		recognition:
			'The top face is one colour and the corners still need moving; three of them cycle, or, counting the finishing U turn, two neighbours swap.',
		notes:
			'Roux solvers who came from CFOP often use the T permutation here out of habit. The nine-move alternative is worth the small effort of learning.',
		tags: ['pll', 'rare']
	},
	{
		id: 'cmll-o-2',
		set: 'cmll',
		name: 'Corners oriented — diagonal swap',
		shortName: 'O2',
		group: 'All corners oriented',
		tier: 'expert',
		algs: [
			{ moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'", note: 'The Y permutation.' },
			{
				moves: "R2 U2 F2 U' R2 U2 F2 U R2 U2 F2",
				label: 'half turns',
				note: 'Six moves shorter and nothing but half turns after the first.'
			}
		],
		recognition: 'Top face solid, and the two corners that need to trade sit diagonally opposite.',
		notes:
			'The rarest case and the most expensive. Both algorithms are pure R, U and F, so the M slice survives either way.',
		triggers: ['sexy move', 'sledgehammer', 'Aa insert'],
		tags: ['pll', 'long', 'rare']
	}
];

// ---------------------------------------------------------------------------
// Commutators
// ---------------------------------------------------------------------------

/**
 * A teaching sequence rather than a set to drill. Each entry is a worked example
 * of the same idea: do something, do something else, undo the first thing, undo
 * the second. Whatever the two halves disagree about is all that survives.
 *
 * The bracket notation `[A, B]` means `A B A' B'`, and `[X : Y]` means
 * `X Y X'` — a conjugate, or "setup". Note that the algorithm strings below are
 * written out in full, because the move parser reads square brackets as ordinary
 * grouping rather than as a commutator.
 */
export const COMMUTATOR_CASES: readonly AlgCase[] = [
	{
		id: 'comm-sexy',
		set: 'commutators',
		name: 'The sexy move as a commutator',
		shortName: '[R, U]',
		tier: 'expert',
		algs: [{ moves: "R U R' U'" }],
		recognition:
			'Four moves you have done thousands of times. A is R, B is U: turn R, turn U, undo the R, undo the U.',
		notes:
			'A piece that neither turn touches never moves at all — that is what makes a commutator surgical. Everything that does change here, four corners and three edges, lives where R and U interfere with each other: the top layer and the right-hand face. Seven pieces is more than we want. The craft of building commutators is choosing two halves that interfere over as little as possible, and the next few entries show what happens when they interfere over exactly one piece.',
		triggers: ['sexy move'],
		tags: ['sexy', 'foundational']
	},
	{
		id: 'comm-inverse',
		set: 'commutators',
		name: 'The same commutator backwards',
		shortName: '[U, R]',
		tier: 'expert',
		algs: [{ moves: "U R U' R'" }],
		recognition: 'The sexy move with the two halves swapped over.',
		notes:
			'Swapping A and B inverts the commutator: [B, A] undoes [A, B]. That is why doing a sexy move and then this returns the cube to where it started, and it is worth checking on a real cube once — the algebra is easier to trust after you have felt it.',
		tags: ['foundational']
	},
	{
		id: 'comm-sexy-order',
		set: 'commutators',
		name: 'Six sexy moves',
		shortName: '(R U R′ U′)6',
		tier: 'expert',
		algs: [{ moves: "(R U R' U')*6" }],
		recognition: 'The sexy move done six times over. The cube comes back solved.',
		notes:
			'Every sequence on the cube has an order — a number of repetitions that returns you to the start. The sexy move has order six, which is short enough to demonstrate and long enough to be surprising. Try it with a different pair, say R and U2, and count.',
		tags: ['theory', 'long']
	},
	{
		id: 'comm-conjugate',
		set: 'commutators',
		name: 'A conjugate: setup, act, undo',
		shortName: '[F : [R, U]]',
		tier: 'expert',
		algs: [{ moves: "F R U R' U' F'" }],
		recognition:
			'The sexy move with an F in front of it and an F prime behind. You know this one as an OLL, and as the cheapest CMLL case in the library.',
		notes:
			'A conjugate is not a commutator; it is the other tool. The F move carries pieces into the place where the sexy move can reach them, the sexy move does its work, and F prime carries everything back. Whatever the middle did to those pieces stays done. Almost every algorithm you know is a conjugate of a commutator, or a couple of them stitched together.',
		triggers: ['sexy move'],
		tags: ['foundational', 'conjugate', 'oll']
	},
	{
		id: 'comm-edges',
		set: 'commutators',
		name: 'A pure edge three-cycle',
		shortName: '[M′, U2]',
		tier: 'expert',
		algs: [{ moves: "M' U2 M U2" }],
		recognition:
			'Four moves. Three edges cycle — the two on the top of the M slice and the front one on the bottom — and nothing else on the cube moves at all.',
		notes:
			'Here the two halves are chosen so that they overlap in exactly one piece. U2 is the interchange: it swaps the two edges at the front and back of the top. M prime is the insertion: it brings a third edge up into the slice. Do them, undo them, and you are left with a three-cycle. This is the shape every blindfolded solver builds their edge method from.',
		tags: ['3-cycle', 'blind', 'slice']
	},
	{
		id: 'comm-edges-setup',
		set: 'commutators',
		name: 'The edge cycle, moved with a setup',
		shortName: '[U : [M′, U2]]',
		tier: 'expert',
		algs: [{ moves: "U M' U2 M U" }],
		recognition:
			'The same four-move commutator with a U in front. It now cycles the right, left and front-bottom edges instead.',
		notes:
			'Written out in full this would be U, then M prime U2 M U2, then U prime — but the closing U2 and U prime run into each other and collapse to a single U. Cancellations like that are why written algorithms so rarely look like the commutators they are. If you want to see the structure, undo the cancellation on paper first.',
		tags: ['conjugate', '3-cycle', 'slice']
	},
	{
		id: 'comm-corners',
		set: 'commutators',
		name: 'The eight-move corner cycle',
		shortName: '[R U R′, D]',
		tier: 'expert',
		algs: [{ moves: "R U R' D R U' R' D'" }],
		recognition:
			'Eight moves, three corners cycled — front-right-top, front-right-bottom and front-left-bottom — and not a single edge disturbed.',
		notes:
			'R U R prime is the insertion: it takes the corner sitting at the top and drops it into the front-right slot. D is the interchange: it swaps which bottom corner is waiting there. Undo both and three corners have moved round. This eight-move shape is the one to hunt for when you build your own algorithms — anything longer usually means the pieces were not lined up.',
		tags: ['3-cycle', 'blind', 'd-move']
	},
	{
		id: 'comm-corners-setup',
		set: 'commutators',
		name: 'The corner cycle with a setup move',
		shortName: '[U′ : [R U R′, D]]',
		tier: 'expert',
		algs: [{ moves: "U' R U R' D R U' R' D' U" }],
		recognition:
			'The eight-move corner commutator with a U prime before it and a U after. A different trio of corners cycles.',
		notes:
			'The commutator can only reach the corner sitting above the front-right slot. When the corner you want is somewhere else in the top layer, turn U until it arrives, run the commutator, and turn U back. Ten moves for a three-cycle is still cheap, and the thinking is almost none.',
		tags: ['conjugate', '3-cycle', 'blind']
	},
	{
		id: 'comm-niklas',
		set: 'commutators',
		name: 'Niklas — a corner cycle inside the top layer',
		shortName: 'Niklas',
		tier: 'expert',
		algs: [{ moves: "R U' L' U R' U' L U" }],
		recognition:
			'Eight moves alternating right and left. Three top-layer corners cycle and nothing else moves.',
		notes:
			'R and L do not touch each other at all, so U is the only thing they can disagree about — which is exactly what makes this work. The seven-move version, without the final U, is not a pure cycle: it twists corners and moves edges too, and that is why it shows up as a COLL algorithm rather than a commutator.',
		tags: ['3-cycle', 'niklas', 'two-handed']
	},
	{
		id: 'comm-half-turn',
		set: 'commutators',
		name: 'A commutator with a half-turn interchange',
		shortName: '[R′ F R, B2]',
		tier: 'expert',
		algs: [{ moves: "R' F R B2 R' F' R B2" }],
		recognition:
			'Eight moves, three corners cycled, everything else untouched — this time reaching round the back of the cube.',
		notes:
			'The interchange does not have to be a quarter turn. Here B2 swaps two corners diagonally and R prime F R inserts a third. Choosing a half turn as the interchange is often what lets you reach a pair of pieces that a single turn cannot separate.',
		tags: ['3-cycle', 'blind']
	},
	{
		id: 'comm-corners-u2',
		set: 'commutators',
		name: 'Changing the interchange changes the trio',
		shortName: '[R′ D′ R, U2]',
		tier: 'expert',
		algs: [{ moves: "R' D' R U2 R' D R U2" }],
		recognition:
			'Eight moves again, and again three corners. Compare with the D-interchange version and see which corners moved.',
		notes:
			'A three-move insertion again, but the interchange is a half turn this time, and a different three corners move. Once that clicks you are no longer learning algorithms: you choose an insertion for the piece you want to move and an interchange for the pair you want to swap, and the algorithm writes itself.',
		tags: ['3-cycle', 'blind', 'theory']
	}
];
