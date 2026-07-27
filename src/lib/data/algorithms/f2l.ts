/**
 * F2L — the first two layers.
 *
 * All 41 ways the front-right pair can be arranged once the cross is done, and
 * how to finish the slot in one go. Every algorithm here fills the **front-right**
 * slot — the corner between the down, front and right faces plus the edge between
 * front and right — with the cross on the bottom.
 *
 * Two pieces of vocabulary run through the recognition notes:
 *
 * - The corner has three stickers: the **cross colour** (the one belonging on the
 *   bottom), the **front colour** and the **side colour**. Which way the cross
 *   colour points — up, towards you, or out to the right — is the whole of corner
 *   recognition.
 * - The edge has two: the same **front colour** and **side colour**. While it sits
 *   in the top layer, exactly one of them is on the top face, and saying which is
 *   the whole of edge recognition.
 *
 * The first four cases are the ones that need three or four moves, and almost
 * every other algorithm in the set ends by reducing to one of them. That is the
 * thread worth following: F2L is not 41 unrelated sequences, it is four insertions
 * plus the setups that reach them.
 *
 * Probabilities are out of the 150 ways the two pieces can sit relative to the
 * slot, which makes most cases 2/75 and the five with both pieces already in the
 * slot 1/150.
 */

import type { AlgCase } from '../types';

export const F2L_CASES: readonly AlgCase[] = [
	// -------------------------------------------------------------------------
	// The four basic insertions
	// -------------------------------------------------------------------------
	{
		id: 'f2l-01',
		set: 'f2l',
		name: 'Corner facing right, edge at the back',
		shortName: 'F2L 1',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-02',
		algs: [{ moves: "R U R'" }],
		recognition:
			'The corner sits directly above its slot with the cross colour pointing out to the right, and the edge is at the back of the top face with its front colour on top.',
		notes:
			'Three moves, and worth understanding rather than memorising: R lifts the corner up to the back-right where the edge is waiting, so the pair forms; U swings the finished pair round to the front; R’ drops it in. Watch the pair appear after the first turn and you will never have to recall this one.',
		tags: ['three-move', '2-gen', 'fast', 'basic']
	},
	{
		id: 'f2l-02',
		set: 'f2l',
		name: 'Corner facing front, edge on the left',
		shortName: 'F2L 2',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-01',
		algs: [{ moves: "F' U' F" }],
		recognition:
			'The corner is above its slot with the cross colour facing you, and the edge is on the left of the top face with its side colour on top.',
		notes:
			'The mirror image of case 1 and the same story told the other way round: F’ lifts the corner out to the front-left beside the edge, U’ brings the pair round to the front, F inserts. Learn the two together — between them they cover both hands, and a great many longer algorithms end in one or the other.',
		tags: ['three-move', 'basic', 'mirror']
	},
	{
		id: 'f2l-03',
		set: 'f2l',
		name: 'Joined pair, corner facing front',
		shortName: 'F2L 3',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-04',
		algs: [
			{ moves: "U R U' R'" },
			{
				moves: "R' F R F'",
				label: 'sledgehammer',
				note: 'The sledgehammer, if you would rather not start with a setup turn.'
			},
			{
				moves: "U2 R U2 R'",
				label: 'double turns',
				note: 'Same shape, fewer changes of direction.'
			}
		],
		recognition:
			'Corner and edge are already side by side at the front-right of the top layer, their side colours making a matching block down the right-hand face, and the corner’s cross colour points at you.',
		notes:
			'The pair is made and the right way round, so all four moves do is get it out of the way and put it back: U moves the pair off the slot, R opens the slot, U’ brings the pair back, R’ closes it with the pair inside.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'fast', 'pair made', 'basic']
	},
	{
		id: 'f2l-04',
		set: 'f2l',
		name: 'Joined pair, corner facing right',
		shortName: 'F2L 4',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-03',
		algs: [
			{ moves: "U' F' U F" },
			{
				moves: "F R' F' R",
				label: 'hedgeslammer',
				note: 'Four moves with no setup turn to think about.'
			},
			{ moves: "U2 F' U2 F", label: 'double turns' }
		],
		recognition:
			'Corner and edge are side by side along the front of the top layer, both showing the front colour on the front face, and the corner’s cross colour points out to the right.',
		notes:
			'The mirror of case 3. If you are working F2L out intuitively rather than from a sheet, this and case 3 are the two shapes you should be aiming to create — every pair you build is really an attempt to reach one of them.',
		tags: ['pair made', 'basic', 'mirror']
	},

	// -------------------------------------------------------------------------
	// Corner facing a side, pieces apart
	// -------------------------------------------------------------------------
	{
		id: 'f2l-05',
		set: 'f2l',
		name: 'Corner facing right, edge on the right, side colour up',
		shortName: 'F2L 5',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-06',
		algs: [{ moves: "R U' R' U2 F' U' F" }],
		recognition:
			'Corner above the slot with the cross colour to the right, edge immediately beside it on the right but with its side colour on top, so the two colours next to each other do not match.',
		notes:
			'The pieces are touching but cannot pair where they stand, because the edge is the wrong way up. R U’ R’ sends the corner round to the back-left and leaves the edge behind; the U2 then presents the two of them as case 2, which F’ U’ F finishes.',
		triggers: ['Aa insert'],
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-06',
		set: 'f2l',
		name: 'Corner facing front, edge at the front, front colour up',
		shortName: 'F2L 6',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-05',
		algs: [{ moves: "F' U F U2 R U R'" }],
		recognition:
			'Corner above the slot with the cross colour facing you, edge directly in front of it with its front colour on top rather than facing you.',
		notes:
			'The mirror of case 5. F’ U F rolls the edge through the front-left slot and back, which turns it over relative to the corner; the U2 then leaves you looking at case 1.',
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-07',
		set: 'f2l',
		name: 'Corner facing front, edge on the left, front colour up',
		shortName: 'F2L 7',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-15',
		algs: [
			{ moves: "U' R U2 R' U' R U2 R'" },
			{ moves: "U' R U2 R' U2 R U' R'", label: 'alternative' },
			{
				moves: "F2 U2 R' F2 R U2 F2",
				label: 'shorter',
				note: 'A move fewer, but heavy on double turns.'
			}
		],
		recognition:
			'Corner above the slot with the cross colour facing you, edge across the top layer on the left with its front colour on top.',
		notes:
			'R U2 R’ twice, with a U’ in between. The first pass turns the corner over; the second pairs it with the edge and inserts. Once you can feel R U2 R’ as one motion this is a comfortable eight moves.',
		tags: ['2-gen', 'split pair', 'mirror']
	},
	{
		id: 'f2l-08',
		set: 'f2l',
		name: 'Corner facing right, edge at the front, front colour up',
		shortName: 'F2L 8',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-14',
		algs: [
			{ moves: "U F' U2 F U' R U R'" },
			{
				moves: "R' U2 R2 U R2 U R",
				label: '2-gen',
				note: 'One move shorter and never leaves the right hand, but harder to follow.'
			}
		],
		recognition:
			'Corner above the slot with the cross colour to the right, edge directly in front of it with its front colour on top.',
		notes:
			'F’ U2 F hides the corner in the front-left slot and brings it back turned over, and after the U’ you are looking at case 1. The 2-gen alternative is quicker in the hands but tells you nothing about what is happening.',
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-09',
		set: 'f2l',
		name: 'Corner facing right, edge on the left, front colour up',
		shortName: 'F2L 9',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-12',
		algs: [
			{ moves: "U' R U R' U R U R'" },
			{ moves: "U2 R U' R' U' R U R'", label: 'alternative' },
			{ moves: "U' F' U' F U2 R U R'", label: 'left-hand start' }
		],
		recognition:
			'Corner above the slot with the cross colour to the right, edge on the far side of the top layer on the left, front colour on top.',
		notes:
			'The first five moves turn the corner over and leave the pieces set up as case 1, which R U R’ finishes. Two R U R’ groups with U turns between them — a rhythm rather than a sequence.',
		tags: ['2-gen', 'split pair', 'mirror']
	},
	{
		id: 'f2l-10',
		set: 'f2l',
		name: 'Corner facing front, edge at the back, front colour up',
		shortName: 'F2L 10',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-13',
		algs: [
			{ moves: "U' R U R' U' R U2 R'" },
			{ moves: "U' R U R' U2 R U' R'", label: 'alternative' },
			{ moves: "F U F' R' F R U' F'", label: 'front-face' }
		],
		recognition:
			'Corner above the slot with the cross colour facing you, edge at the back of the top layer with its front colour on top.',
		notes:
			'A sexy move turns the corner over while the edge waits at the side, and R U2 R’ pairs and inserts. Both halves are things your hands already do, so this one comes quickly.',
		triggers: ['sexy move'],
		tags: ['2-gen', 'split pair', 'mirror']
	},
	{
		id: 'f2l-11',
		set: 'f2l',
		name: 'Corner facing right, edge on the right, front colour up',
		shortName: 'F2L 11',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-16',
		algs: [
			{ moves: "U' R U' R' U R U R'" },
			{ moves: "U2 R2 U R' U R U2 R2", label: 'alternative' }
		],
		recognition:
			'Corner above the slot with the cross colour to the right, edge beside it on the right with its front colour on top — the two side stickers you can see do not match.',
		notes:
			'R U’ R’ dips the corner into the back-right slot and brings it out the other way up; the U after it leaves case 1. Compare with case 5, where the same two pieces sit in the same places but the edge is the other way round.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'split pair', 'mirror']
	},
	{
		id: 'f2l-12',
		set: 'f2l',
		name: 'Corner facing front, edge at the back, side colour up',
		shortName: 'F2L 12',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-09',
		algs: [
			{ moves: "U R U R' U2 F' U' F" },
			{ moves: "U' R U' R' U F' U' F", label: 'alternative' },
			{ moves: "U F' U' F U' F' U' F", label: 'front-face' }
		],
		recognition:
			'Corner above the slot with the cross colour facing you, edge at the back of the top layer with its side colour on top.',
		notes:
			'The first five moves put the corner where it needs to be and leave case 2 behind, so the algorithm ends with the familiar F’ U’ F. The mirror of case 9, and the two are worth drilling as a pair.',
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-13',
		set: 'f2l',
		name: 'Corner facing right, edge on the left, side colour up',
		shortName: 'F2L 13',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-10',
		algs: [
			{ moves: "U F' U' F U F' U2 F" },
			{ moves: "U F' U' F U2 F' U F", label: 'alternative' },
			{ moves: "R' U' R F R' F' U R", label: 'right-hand start' }
		],
		recognition:
			'Corner above the slot with the cross colour to the right, edge on the left of the top layer with its side colour on top.',
		notes:
			'Everything happens on the front face: the first four moves turn the corner over, then F’ U2 F pairs and inserts. If your left hand finds four F turns uncomfortable, the right-hand variant does the same job around the back.',
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-14',
		set: 'f2l',
		name: 'Corner facing front, edge on the right, side colour up',
		shortName: 'F2L 14',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-08',
		algs: [
			{ moves: "U' R U2 R' U F' U' F" },
			{
				moves: "F U2 F2 U' F2 U' F'",
				label: 'shorter',
				note: 'A move fewer, all on the front face.'
			}
		],
		recognition:
			'Corner above the slot with the cross colour facing you, edge beside it on the right with its side colour on top.',
		notes:
			'R U2 R’ lifts the corner over the top and drops it back the other way up, and after the U you have case 2. The mirror of case 8.',
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-15',
		set: 'f2l',
		name: 'Corner facing right, edge at the back, side colour up',
		shortName: 'F2L 15',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-07',
		algs: [
			{ moves: "U F' U2 F U F' U2 F" },
			{ moves: "U F' U2 F U2 F' U F", label: 'alternative' },
			{
				moves: "R2 U2 F R2 F' U2 R2",
				label: 'shorter',
				note: 'Seven moves, but three of them are R2.'
			}
		],
		recognition:
			'Corner above the slot with the cross colour to the right, edge at the back of the top layer with its side colour on top.',
		notes:
			'F’ U2 F twice with a U between, which is exactly case 7 reflected. If you learn one of the pair, work the other out rather than looking it up.',
		tags: ['split pair', 'mirror']
	},
	{
		id: 'f2l-16',
		set: 'f2l',
		name: 'Corner facing front, edge at the front, side colour up',
		shortName: 'F2L 16',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-11',
		algs: [
			{ moves: "U F' U F U' F' U' F" },
			{ moves: "R U R2 F R F2 U' F", label: 'right-hand start' },
			{ moves: "U2 F2 U' F U' F' U2 F2", label: 'alternative' }
		],
		recognition:
			'Corner above the slot with the cross colour facing you, edge directly in front of it showing its front colour on the front face — the corner and edge front stickers sit next to each other but the pair is not usable yet.',
		notes:
			'The first five moves turn the edge over through the front-left slot and leave case 2 behind. The mirror of case 11.',
		tags: ['split pair', 'mirror']
	},

	// -------------------------------------------------------------------------
	// Corner with the cross colour on top
	// -------------------------------------------------------------------------
	{
		id: 'f2l-17',
		set: 'f2l',
		name: 'Corner facing up, edge on the left, front colour up',
		shortName: 'F2L 17',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-20',
		algs: [
			{ moves: "R U' R' U2 R U R'" },
			{ moves: "U2 F' U' F R U R'", label: 'front-face' },
			{ moves: "U2 R U R' U R U' R'", label: 'alternative' }
		],
		recognition:
			'The corner is above its slot with the cross colour on the top face, so you can see it looking straight down; the edge is on the left of the top layer with its front colour on top.',
		notes:
			'When the cross colour is on top, the corner cannot pair with anything until it has been turned over. R U’ R’ does that — it swings the corner round to the back-left with the cross colour now pointing sideways — and the U2 leaves case 1.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'corner up', 'mirror']
	},
	{
		id: 'f2l-18',
		set: 'f2l',
		name: 'Corner facing up, edge on the right, front colour up',
		shortName: 'F2L 18',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-19',
		algs: [
			{ moves: "R U2 R' U' R U R'" },
			{ moves: "U2 R2 U2 F R F' U2 R2", label: 'alternative' }
		],
		recognition:
			'Corner above its slot showing the cross colour on top, edge beside it on the right with its front colour on top.',
		notes:
			'R U2 R’ turns the corner over and parks the edge out of the way at the same time; after the U’ you have case 1. Seven moves, entirely right-handed, and one of the first long F2L algorithms most people get fluent with.',
		tags: ['2-gen', 'corner up', 'fast', 'mirror']
	},
	{
		id: 'f2l-19',
		set: 'f2l',
		name: 'Corner facing up, edge at the front, side colour up',
		shortName: 'F2L 19',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-18',
		algs: [
			{ moves: "F' U2 F U F' U' F" },
			{ moves: "U2 F2 U2 R' F' R U2 F2", label: 'alternative' }
		],
		recognition:
			'Corner above its slot showing the cross colour on top, edge directly in front of it with its side colour on top.',
		notes:
			'Case 18 reflected: F’ U2 F turns the corner over, and what is left is case 2. Reading the two side by side is the quickest way to convince yourself that the mirror rule is real.',
		tags: ['corner up', 'mirror']
	},
	{
		id: 'f2l-20',
		set: 'f2l',
		name: 'Corner facing up, edge at the back, side colour up',
		shortName: 'F2L 20',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-17',
		algs: [
			{ moves: "U2 R U R' F' U' F" },
			{ moves: "F' U F U2 F' U' F", label: 'front-face' },
			{ moves: "U2 F' U' F2 R' F' R", label: 'alternative' }
		],
		recognition:
			'Corner above its slot showing the cross colour on top, edge at the back of the top layer with its side colour on top.',
		notes:
			'R U R’ lifts the corner out of the way and turns it over, and the last three moves are the case 2 insertion. Note how the algorithm changes hands halfway through — that is what makes it feel longer than seven moves.',
		tags: ['corner up', 'mirror']
	},
	{
		id: 'f2l-21',
		set: 'f2l',
		name: 'Corner facing up, edge at the back, front colour up',
		shortName: 'F2L 21',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-22',
		algs: [
			{ moves: "U R U2 R' U R U' R'" },
			{ moves: "U R U2 R2 F R F'", label: 'shorter' },
			{ moves: "U R U2 R' U2 R U2 R'", label: 'double turns' }
		],
		recognition:
			'Corner above its slot with the cross colour on top, edge at the back of the top layer with its front colour on top.',
		notes:
			'The first four moves turn the corner over and leave case 3 — a joined pair waiting for U R U’ R’. Eight moves that split cleanly into two halves you already know.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'corner up', 'mirror']
	},
	{
		id: 'f2l-22',
		set: 'f2l',
		name: 'Corner facing up, edge on the left, side colour up',
		shortName: 'F2L 22',
		group: 'Corner in the top, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-21',
		algs: [
			{ moves: "U' F' U2 F U' F' U F" },
			{ moves: "U' F' U2 F2 R' F' R", label: 'shorter' },
			{ moves: "U' F' U2 F U2 F' U2 F", label: 'double turns' }
		],
		recognition:
			'Corner above its slot with the cross colour on top, edge on the left of the top layer with its side colour on top.',
		notes:
			'The mirror of case 21: F’ U2 F turns the corner over and hands you case 4, which U’ F’ U F finishes.',
		tags: ['corner up', 'mirror']
	},
	{
		id: 'f2l-23',
		set: 'f2l',
		name: 'Corner facing up, edge at the front, front colour up',
		shortName: 'F2L 23',
		group: 'Corner in the top, edge in the top',
		tier: 'advanced',
		probability: '2/75',
		mirrorOf: 'f2l-24',
		algs: [
			{ moves: "U2 R2 U2 R' U' R U' R2" },
			{
				moves: "U F R' F' R U R U R'",
				label: 'hedgeslammer',
				note: 'A move longer, but every part of it is a trigger you already own.'
			},
			{ moves: "R2 U R' U R U2 R' U' R'", label: 'alternative' }
		],
		recognition:
			'Corner above its slot with the cross colour on top, edge directly in front of it with its front colour on top — the pair looks tantalisingly close but the corner is the wrong way up.',
		notes:
			'One of the two genuinely unfriendly cases in this group: the shortest route is 2-gen but built from R2 turns, which is hard to see through. The hedgeslammer version is a move longer and made entirely of triggers you already own, which for most people is the better trade.',
		tags: ['2-gen', 'corner up', 'awkward', 'mirror']
	},
	{
		id: 'f2l-24',
		set: 'f2l',
		name: 'Corner facing up, edge on the right, side colour up',
		shortName: 'F2L 24',
		group: 'Corner in the top, edge in the top',
		tier: 'advanced',
		probability: '2/75',
		mirrorOf: 'f2l-23',
		algs: [
			{ moves: "F U R U' R' F' R U' R'" },
			{ moves: "U2 F2 U2 F U F' U F2", label: 'shorter', note: 'One move fewer, front face only.' },
			{ moves: "U' R' F R F' U' F' U' F", label: 'sledgehammer' }
		],
		recognition:
			'Corner above its slot with the cross colour on top, edge beside it on the right with its side colour on top.',
		notes:
			'The opening F and the F’ four moves later bracket the case 3 insertion, and between them they turn the corner over without disturbing anything else. The pair is then ready for a plain Aa insert. The mirror of case 23, and the more approachable of the two.',
		triggers: ['Aa insert'],
		tags: ['corner up', 'awkward', 'mirror']
	},

	// -------------------------------------------------------------------------
	// Edge already in the slot
	// -------------------------------------------------------------------------
	{
		id: 'f2l-25',
		set: 'f2l',
		name: 'Corner facing up, edge flipped in the slot',
		shortName: 'F2L 25',
		group: 'Corner in the top, edge in the slot',
		tier: 'intermediate',
		probability: '2/75',
		algs: [
			{ moves: "R U' R' F' U2 F" },
			{
				moves: "F' U F R U2 R'",
				label: 'mirror',
				note: 'The same idea starting on the front face.'
			},
			{ moves: "R U' R' U F' U F", label: 'alternative' }
		],
		recognition:
			'The edge is already in the slot but the wrong way round — its front colour is showing on the right-hand face — and the corner is in the top layer with the cross colour on top.',
		notes:
			'Nothing can be done while the edge is stuck in backwards, so the first job is always to get it out. R U’ R’ lifts it into the top and parks the corner at the back; F’ U2 F then rebuilds the pair on the front and inserts it. Six moves, and this case is its own mirror image.',
		triggers: ['Aa insert'],
		tags: ['edge in slot', 'edge flipped', 'fast']
	},
	{
		id: 'f2l-26',
		set: 'f2l',
		name: 'Corner facing right, edge already in place',
		shortName: 'F2L 26',
		group: 'Corner in the top, edge in the slot',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-27',
		algs: [
			{ moves: "U R U R' U2 R U R'" },
			{ moves: "U' R U2 R' U R U R'", label: 'alternative' },
			{ moves: "U F' U F U2 F' U F", label: 'front-face' }
		],
		recognition:
			'The edge is sitting correctly in the slot with nothing above it, and the corner is in the top layer with the cross colour pointing to the right.',
		notes:
			'A solved edge with an unsolved corner above it is not a shortcut — the edge has to come out and go back in with the corner. R U R’ lifts it into the top, and after the U2 you are looking at case 1.',
		tags: ['2-gen', 'edge in slot', 'mirror']
	},
	{
		id: 'f2l-27',
		set: 'f2l',
		name: 'Corner facing front, edge already in place',
		shortName: 'F2L 27',
		group: 'Corner in the top, edge in the slot',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-26',
		algs: [
			{ moves: "U' R U' R' U2 R U' R'" },
			{ moves: "U' R U' R' U' R U2 R'", label: 'alternative' },
			{ moves: "U F' U2 F U' F' U' F", label: 'front-face' }
		],
		recognition:
			'The edge is correct in the slot and the corner is in the top layer with the cross colour facing you.',
		notes:
			'The mirror of case 26 and the same shape in the hands: two Aa inserts with a U2 between them. Resist the temptation to insert the corner on its own — that breaks the edge and costs you more than it saves.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'edge in slot', 'mirror']
	},
	{
		id: 'f2l-28',
		set: 'f2l',
		name: 'Corner facing right, edge flipped in the slot',
		shortName: 'F2L 28',
		group: 'Corner in the top, edge in the slot',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-29',
		algs: [
			{ moves: "U F' U' F U' R U R'" },
			{ moves: "U2 F' U F U R U R'", label: 'alternative' },
			{ moves: "U2 F' U' F R' F R F'", label: 'sledgehammer finish' }
		],
		recognition:
			'The edge is in the slot the wrong way round, and the corner is in the top layer with the cross colour pointing right.',
		notes:
			'F’ U’ F pulls the flipped edge up into the top layer and rights it on the way; after the U’ the two pieces are arranged as case 1. The same first move solves the whole family of flipped-edge cases, so look for it before anything else.',
		tags: ['edge in slot', 'edge flipped', 'mirror']
	},
	{
		id: 'f2l-29',
		set: 'f2l',
		name: 'Corner facing front, edge flipped in the slot',
		shortName: 'F2L 29',
		group: 'Corner in the top, edge in the slot',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-28',
		algs: [
			{ moves: "U' R U R' U F' U' F" },
			{ moves: "U2 R U R' F R' F' R", label: 'hedgeslammer finish' },
			{ moves: "U2 R U R' U' F' U F", label: 'alternative' }
		],
		recognition:
			'The edge is in the slot the wrong way round, and the corner is in the top layer with the cross colour facing you.',
		notes:
			'The mirror of case 28: R U R’ extracts the flipped edge, and the last three moves are the case 2 insertion. These two are the same algorithm reflected, so learn whichever hand you prefer and derive the other.',
		tags: ['edge in slot', 'edge flipped', 'mirror']
	},
	{
		id: 'f2l-30',
		set: 'f2l',
		name: 'Corner facing up, edge already in place',
		shortName: 'F2L 30',
		group: 'Corner in the top, edge in the slot',
		tier: 'advanced',
		probability: '2/75',
		algs: [
			{ moves: 'R2 U R2 U R2 U2 R2' },
			{ moves: "F2 U' F2 U' F2 U2 F2", label: 'mirror', note: 'The same rhythm on the front face.' }
		],
		recognition:
			'The edge is already correct in the slot, and the corner sits above it in the top layer with the cross colour facing straight up.',
		notes:
			'The most obstinate of the edge-in-slot cases: the corner is the wrong way up and the edge is in the way, so the usual tricks do not apply. Four R2 turns with U turns between them shuttle the pair between the front-right and back-right slots until the corner comes back the right way round. Learn it as a rhythm — R2 U R2 U R2 U2 R2 — rather than as six separate decisions, and note that it is its own mirror image.',
		tags: ['edge in slot', 'corner up', 'awkward', 'last-resort']
	},

	// -------------------------------------------------------------------------
	// Corner already in the slot
	// -------------------------------------------------------------------------
	{
		id: 'f2l-31',
		set: 'f2l',
		name: 'Corner twisted in the slot, cross to the front — edge on the right',
		shortName: 'F2L 31',
		group: 'Corner in the slot, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-35',
		algs: [
			{ moves: "R U' R' U R U' R'" },
			{
				moves: "F' U2 F R U2 R'",
				label: 'shorter',
				note: 'Six moves, if you do not mind changing hands.'
			},
			{ moves: "R U' R2 F R F'", label: 'alternative' }
		],
		recognition:
			'The corner is already down in its slot but twisted, with the cross colour showing on the front face; the edge is in the top layer on the right with its front colour on top.',
		notes:
			'Two Aa inserts with a U between them. The first R U’ R’ pulls the twisted corner out of the slot and turns it over, which leaves exactly case 3 — so the last four moves are an algorithm you already know.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'corner in slot', 'fast', 'mirror']
	},
	{
		id: 'f2l-32',
		set: 'f2l',
		name: 'Corner twisted in the slot, cross to the right — edge on the right',
		shortName: 'F2L 32',
		group: 'Corner in the slot, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-34',
		algs: [
			{ moves: "R U R' U' R U R'" },
			{
				moves: "F R' F' R F R' F' R",
				label: 'double hedgeslammer',
				note: 'The same trigger twice — satisfying, one move longer.'
			},
			{ moves: "U2 F' U F R U R'", label: 'front-face' }
		],
		recognition:
			'The corner is in its slot but twisted, cross colour showing on the right-hand face; the edge is in the top layer on the right with its front colour on top.',
		notes:
			'A sexy move takes the twisted corner out and turns it, leaving case 1 for the last three moves. Seven moves that are really two familiar triggers back to back, and among the fastest algorithms in the whole set.',
		triggers: ['sexy move'],
		tags: ['2-gen', 'corner in slot', 'fast', 'one-handed', 'mirror']
	},
	{
		id: 'f2l-33',
		set: 'f2l',
		name: 'Corner in place, edge on the right, side colour up',
		shortName: 'F2L 33',
		group: 'Corner in the slot, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-36',
		algs: [
			{ moves: "R U2 R' U2 F' U' F" },
			{ moves: "U2 R U' R' F R' F' R", label: 'hedgeslammer finish' },
			{ moves: "U2 F R' F' R F' U' F", label: 'front-face' }
		],
		recognition:
			'The corner is already solved in its slot; the edge is in the top layer on the right with its side colour on top.',
		notes:
			'A solved corner with the edge still out is not a head start — the corner has to come up again so the pair can go in together. R U2 R’ lifts it out and turns it, and the U2 leaves case 2.',
		tags: ['corner in slot', 'mirror']
	},
	{
		id: 'f2l-34',
		set: 'f2l',
		name: 'Corner twisted in the slot, cross to the front — edge on the right, side colour up',
		shortName: 'F2L 34',
		group: 'Corner in the slot, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-32',
		algs: [
			{ moves: "U' R U' R' F' U' F" },
			{ moves: "U F' U' F U F' U' F", label: 'front-face' },
			{ moves: "U2 R' F R F2 U' F", label: 'alternative' }
		],
		recognition:
			'The corner is in its slot but twisted, cross colour on the front face; the edge is in the top layer on the right with its side colour on top.',
		notes:
			'R U’ R’ brings the twisted corner up and round, and the last three moves are the case 2 insertion. This is case 32 reflected, which is worth checking on the cube — the corner twist and the edge orientation both swap over.',
		triggers: ['Aa insert'],
		tags: ['corner in slot', 'mirror']
	},
	{
		id: 'f2l-35',
		set: 'f2l',
		name: 'Corner twisted in the slot, cross to the right — edge on the right, side colour up',
		shortName: 'F2L 35',
		group: 'Corner in the slot, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-31',
		algs: [
			{ moves: "U R U2 R' F' U2 F" },
			{ moves: "U F' U F U' F' U F", label: 'front-face' },
			{ moves: "U F' U F2 R' F' R", label: 'alternative' }
		],
		recognition:
			'The corner is in its slot but twisted, cross colour on the right-hand face; the edge is in the top layer on the right with its side colour on top.',
		notes:
			'R U2 R’ brings the corner up and round to the back; F’ U2 F then swings the pair to the front and inserts it. The mirror of case 31.',
		tags: ['corner in slot', 'mirror']
	},
	{
		id: 'f2l-36',
		set: 'f2l',
		name: 'Corner in place, edge on the right, front colour up',
		shortName: 'F2L 36',
		group: 'Corner in the slot, edge in the top',
		tier: 'intermediate',
		probability: '2/75',
		mirrorOf: 'f2l-33',
		algs: [
			{ moves: "U' R' F R F' R U R'" },
			{ moves: "U F' U2 F U2 R U R'", label: 'alternative' },
			{ moves: "R F R' U R U' F' R'", label: 'no leading turn' }
		],
		recognition:
			'The corner is already solved in its slot; the edge is in the top layer on the right with its front colour on top.',
		notes:
			'The sledgehammer lifts the solved corner straight back out of the slot and turns it over in one trigger, and what is left is case 1. Being able to spot that a sledgehammer will empty a slot is worth a great deal later on.',
		triggers: ['sledgehammer'],
		tags: ['corner in slot', 'mirror']
	},

	// -------------------------------------------------------------------------
	// Both pieces in the slot
	// -------------------------------------------------------------------------
	{
		id: 'f2l-37',
		set: 'f2l',
		name: 'Corner twisted, cross to the front — edge in place',
		shortName: 'F2L 37',
		group: 'Both pieces in the slot',
		tier: 'advanced',
		probability: '1/150',
		mirrorOf: 'f2l-38',
		algs: [
			{ moves: "R2 U2 R' U' R U' R' U2 R'" },
			{ moves: "R U2 R U2 F R F' U2 R2", label: 'alternative' },
			{ moves: "F' U2 F' U' F U' F' U2 F2", label: 'mirror' }
		],
		recognition:
			'Both pieces are in the slot already: the edge is correct, and the corner is twisted with the cross colour showing on the front face.',
		notes:
			'When both pieces are down there is nothing to pair, so the whole algorithm is really "take them out, then solve the top-layer case that appears". The nine-move version above does both at once and stays on the right hand throughout. If you would rather think than memorise, pull the pair out with R U R’ and re-read the case.',
		triggers: ['Aa insert'],
		tags: ['2-gen', 'both in slot', 'rare', 'awkward']
	},
	{
		id: 'f2l-38',
		set: 'f2l',
		name: 'Corner twisted, cross to the right — edge in place',
		shortName: 'F2L 38',
		group: 'Both pieces in the slot',
		tier: 'advanced',
		probability: '1/150',
		mirrorOf: 'f2l-37',
		algs: [
			{ moves: "R U2 R U R' U R U2 R2" },
			{ moves: "R2 U2 F R' F' U2 R' U2 R'", label: 'alternative' },
			{ moves: "F2 U2 F U F' U F U2 F", label: 'mirror' }
		],
		recognition:
			'Both pieces are in the slot: the edge is correct, and the corner is twisted with the cross colour showing on the right-hand face.',
		notes:
			'The mirror of case 37 and the same nine moves reflected. These two are the cases people most often solve by accident — inserting a pair badly leaves one of them — so it is worth being able to fix them without stopping.',
		tags: ['2-gen', 'both in slot', 'rare', 'awkward']
	},
	{
		id: 'f2l-39',
		set: 'f2l',
		name: 'Corner twisted, cross to the front — edge flipped',
		shortName: 'F2L 39',
		group: 'Both pieces in the slot',
		tier: 'advanced',
		probability: '1/150',
		mirrorOf: 'f2l-40',
		algs: [
			{ moves: "R F U R U' R' F' U' R'" },
			{ moves: "F' U' R' F' U' F U R F", label: 'mirror' }
		],
		recognition:
			'Both pieces are in the slot and both are wrong: the corner twisted with the cross colour on the front face, the edge in backwards with its front colour on the right.',
		notes:
			'Read it in three parts: R takes the pair up into the top layer, the six moves from F to F’ turn the corner over, and U’ R’ puts everything back. Neither piece can be helped while it is buried, so getting them both out first is not a detour — it is the method.',
		triggers: ['Aa insert'],
		tags: ['both in slot', 'edge flipped', 'rare', 'awkward']
	},
	{
		id: 'f2l-40',
		set: 'f2l',
		name: 'Corner twisted, cross to the right — edge flipped',
		shortName: 'F2L 40',
		group: 'Both pieces in the slot',
		tier: 'advanced',
		probability: '1/150',
		mirrorOf: 'f2l-39',
		algs: [{ moves: "R U F R U R' U' F' R'" }, { moves: "F' R' U' F' U F R U F", label: 'mirror' }],
		recognition:
			'Both pieces are in the slot and both are wrong: the corner twisted with the cross colour on the right-hand face, the edge in backwards.',
		notes:
			'R U lifts the pair out and lines it up, F R U R’ U’ F’ — the algorithm that makes the last-layer cross — turns the corner over, and R’ puts it back. The mirror of case 39, and the friendlier of the two if you are right-handed.',
		triggers: ['sexy move'],
		tags: ['both in slot', 'edge flipped', 'rare', 'awkward']
	},
	{
		id: 'f2l-41',
		set: 'f2l',
		name: 'Corner in place, edge flipped in the slot',
		shortName: 'F2L 41',
		group: 'Both pieces in the slot',
		tier: 'advanced',
		probability: '1/150',
		algs: [
			{ moves: "R U R' U2 R U2 R' U F' U' F" },
			{
				moves: "R2 U2 F R2 F' U2 R' U R'",
				label: 'shorter',
				note: 'Nine moves rather than eleven, at the cost of any story to hang it on.'
			},
			{ moves: "F' U F U' R U2 R' U' R U2 R'", label: 'front-face start' }
		],
		recognition:
			'The corner is solved in its slot but the edge below the top layer is in backwards, showing its front colour on the right-hand face. The slot looks nearly finished until you notice the two colours on the right do not match.',
		notes:
			'The worst case in the set, and the one most likely to be missed during a solve — check the side colours of a slot before you call it done. R U R’ empties the slot completely and leaves an ordinary top-layer case, and the remaining eight moves are the route through case 2. This case is its own mirror image, so there is no left-handed shortcut to reach for.',
		tags: ['both in slot', 'edge flipped', 'rare', 'awkward', 'last-resort']
	}
];
