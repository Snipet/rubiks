/**
 * PLL — permutation of the last layer.
 *
 * All 21 cases. The last layer is already one colour by the time you get here, so
 * every case is about where the pieces need to go rather than which way up they
 * are. The set is grouped the way it is usually taught: edges only, corners only,
 * then the cases that swap two adjacent corners, the ones that swap two diagonal
 * corners, and finally the four G permutations.
 *
 * Recognition notes describe the case as it is drawn: the last layer seen from
 * above with the top row of each side face folded outwards, front at the bottom.
 * "Headlights" means two matching corner stickers on one face with a different
 * edge between them; a "two-block" means a corner and the edge beside it showing
 * the same colour.
 */

import type { AlgCase } from '../types';

export const PLL_CASES: readonly AlgCase[] = [
	// -------------------------------------------------------------------------
	// Edges only
	// -------------------------------------------------------------------------
	{
		id: 'pll-ua',
		set: 'pll',
		name: 'Ua Permutation',
		shortName: 'Ua',
		group: 'Edges only',
		tier: 'intermediate',
		probability: '1/18',
		mirrorOf: 'pll-ub',
		algs: [
			{ moves: "M2 U M U2 M' U M2" },
			{
				moves: "R U' R U R U R U' R' U' R2",
				label: '2-gen',
				note: 'No slice moves, if your cube fights M turns.'
			}
		],
		recognition:
			'All four corners are home, so one side is a solid bar of its own colour and the other three show headlights. The three wrong edges cycle anticlockwise: with the solved edge at the back, the front edge belongs on the right.',
		notes:
			'Ua and Ub are the same seven moves with the single U turns reversed, so the algorithms cost almost nothing to learn and all the work is in telling the two apart. Read the cycle twice before you start rather than repairing it afterwards.',
		tags: ['m-slice', 'edges', 'fast', 'two-look', 'mirror']
	},
	{
		id: 'pll-ub',
		set: 'pll',
		name: 'Ub Permutation',
		shortName: 'Ub',
		group: 'Edges only',
		tier: 'intermediate',
		probability: '1/18',
		mirrorOf: 'pll-ua',
		algs: [
			{ moves: "M2 U' M U2 M' U' M2" },
			{
				moves: "R2 U R U R' U' R' U' R' U R'",
				label: '2-gen',
				note: 'The Ua 2-gen algorithm run backwards.'
			}
		],
		recognition:
			'The same picture as Ua — a solid bar on one side, headlights on the other three — with the cycle running the other way. Hold the solved edge at the back and the right-hand edge belongs at the front.',
		notes:
			'Together the two U perms come up in one solve in nine, and they are the pair you run most often in a two-look last layer. If you only ever get fast at two algorithms, make it these.',
		tags: ['m-slice', 'edges', 'fast', 'two-look', 'mirror']
	},
	{
		id: 'pll-h',
		set: 'pll',
		name: 'H Permutation',
		shortName: 'H',
		group: 'Edges only',
		tier: 'intermediate',
		probability: '1/72',
		algs: [
			{ moves: 'M2 U M2 U2 M2 U M2' },
			{
				moves: "M2 U' M2 U2 M2 U' M2",
				label: 'other direction',
				note: 'Works equally well — the case is symmetric.'
			},
			{ moves: 'R2 U2 R U2 R2 U2 R2 U2 R U2 R2', label: '2-gen' }
		],
		recognition:
			'Four sets of headlights, and every edge belongs on the face opposite the one it is sitting on. The case looks identical from all four sides, so there is no angle to hunt for.',
		notes:
			'The one PLL with no recognition work at all beyond spotting it, and no AUF to think about before or after. Seven moves, and the middle turn is the only U2.',
		tags: ['m-slice', 'edges', 'symmetric', 'fast', 'rare', 'two-look']
	},
	{
		id: 'pll-z',
		set: 'pll',
		name: 'Z Permutation',
		shortName: 'Z',
		group: 'Edges only',
		tier: 'intermediate',
		probability: '1/36',
		algs: [
			{ moves: "M2 U M2 U M' U2 M2 U2 M' U2" },
			{
				moves: "M' U' M2 U' M2 U' M' U2 M2",
				label: 'other direction',
				note: 'The form most lists print. A move shorter, and it finishes one U turn out of line.'
			}
		],
		recognition:
			'Four sets of headlights again, but the edges have swapped with their neighbours rather than their opposites: the front edge shows a side colour, not the back colour.',
		notes:
			'H and Z are the only two cases showing headlights on all four faces, so go straight to the edges to separate them. Z can be started from two different angles, and picking the nearer one saves a whole U turn.',
		tags: ['m-slice', 'edges', 'symmetric', 'rare', 'two-look']
	},

	// -------------------------------------------------------------------------
	// Corners only
	// -------------------------------------------------------------------------
	{
		id: 'pll-aa',
		set: 'pll',
		name: 'Aa Permutation',
		shortName: 'Aa',
		group: 'Corners only',
		tier: 'intermediate',
		probability: '1/18',
		mirrorOf: 'pll-ab',
		algs: [
			{ moves: "x R' U R' D2 R U' R' D2 R2 x'" },
			{
				moves: "R' F R' B2 R F' R' B2 R2",
				label: 'no rotation',
				note: 'The same nine moves written out flat: F where the tilted version turns U, B where it turns D.'
			},
			{
				moves: "x' L' U L' D2 L U' L' D2 L2 x",
				label: 'left-hand',
				note: 'Mirror-image fingers. It wants the headlights at the front rather than the back, so turn the top layer U2 first.'
			}
		],
		recognition:
			'Every edge is already home, so each side shows its own colour through the middle. One corner is home too; two matching corner stickers mark the face to hold at the back, and from there the back-left corner travels to the back-right.',
		notes:
			'Aa and Ab are the same algorithm run backwards, so the second one costs you almost nothing once the first is fluent. Keep the cube tilted after the x and let the right hand turn D2 as though it were U2 — regripping between the two D2s is what makes this feel slow.',
		triggers: ['Aa insert'],
		tags: ['corners', '3-cycle', 'd-moves', 'two-look', 'mirror']
	},
	{
		id: 'pll-ab',
		set: 'pll',
		name: 'Ab Permutation',
		shortName: 'Ab',
		group: 'Corners only',
		tier: 'intermediate',
		probability: '1/18',
		mirrorOf: 'pll-aa',
		algs: [
			{ moves: "x R2 D2 R U R' D2 R U' R x'" },
			{ moves: "R2 B2 R F R' B2 R F' R", label: 'no rotation' },
			{
				moves: "x' L2 D2 L U L' D2 L U' L x",
				label: 'left-hand',
				note: 'Mirror-image fingers, and like Aa’s left-hand version it wants the top layer turned U2 before you start.'
			}
		],
		recognition:
			'Indistinguishable from Aa at a glance: edges all solved, one corner home, one set of headlights — on the right in the diagram. Turn them to the back as you would for Aa and the cycle runs the other way: the back-right corner travels to the back-left.',
		notes:
			'The corner cycle is the only difference between the two A perms, so decide which way it goes before your hands start. Getting it wrong leaves you with the other A perm, which is at least a cheap mistake to fix.',
		tags: ['corners', '3-cycle', 'd-moves', 'two-look', 'mirror']
	},
	{
		id: 'pll-e',
		set: 'pll',
		name: 'E Permutation',
		shortName: 'E',
		group: 'Corners only',
		tier: 'advanced',
		probability: '1/36',
		algs: [
			{ moves: "x' R U' R' D R U R' D' R U R' D R U' R' D' x" },
			{ moves: "x' L' U L D' L' U' L D L' U' L D' L' U L D x", label: 'left-hand' },
			{
				moves: "R2 U R' U' y R U R' U' R U R' U' R U R' y' R U' R2",
				label: 'no D moves',
				note: 'Two sexy moves and an insert wrapped in a y conjugate. Two moves longer than the tilted version, but nothing in it is new.'
			}
		],
		recognition:
			'All four edges solved and not one set of headlights anywhere — no two corner stickers on any face match. That combination happens for E and nothing else. All four corners are wrong, swapping in pairs.',
		notes:
			'The D turns are the whole difficulty. Hold the cube tilted after the x’ so the left hand can turn D while the right runs R U R’, and let the tilt do the work rather than your wrist. It is the rarest of the corner-only cases, so learn the A perms properly first.',
		triggers: ['Aa insert'],
		tags: ['corners', 'd-moves', 'awkward', 'rare', 'two-look']
	},

	// -------------------------------------------------------------------------
	// Adjacent corner swap
	// -------------------------------------------------------------------------
	{
		id: 'pll-t',
		set: 'pll',
		name: 'T Permutation',
		shortName: 'T',
		group: 'Adjacent corner swap',
		tier: 'intermediate',
		probability: '1/18',
		algs: [
			{ moves: "R U R' U' R' F R2 U' R' U' R U R' F'" },
			{
				moves: "R2 U R2 U' R2 U' D R2 U' R2 U R2 D'",
				label: 'no F moves',
				note: 'Every R turn is a double, which suits some one-handed grips; the price is the D turn in the middle and the D’ that undoes it.'
			},
			{
				moves: "L' U' L U L F' L2 U L U L' U' L F",
				label: 'left-hand',
				note: 'Mirror-image fingers, wanting the headlights on the right rather than the left.'
			}
		],
		recognition:
			'Headlights on one face with a stranger of an edge between them. That edge swaps with the one directly across the layer, and the two corners on the far face swap with each other.',
		notes:
			'The first full-PLL algorithm most people learn, and the one worth polishing hardest. It splits into a sexy move, an F-conjugated block that does the actual work, and the closing F’ — think of it as three chunks rather than fourteen moves.',
		triggers: ['sexy move'],
		tags: ['adjacent', 'common', 'fast']
	},
	{
		id: 'pll-ja',
		set: 'pll',
		name: 'Ja Permutation',
		shortName: 'Ja',
		group: 'Adjacent corner swap',
		tier: 'intermediate',
		probability: '1/18',
		mirrorOf: 'pll-jb',
		algs: [
			{ moves: "R' U2 R U R' U2 L U' R U L'" },
			{
				moves: "R' U L' U2 R U' R' U2 R L",
				label: 'shorter',
				note: 'A move shorter and the form most lists print. It is written for the case a quarter turn round, with the three matching stickers lying across the front rather than down the left.'
			},
			{
				moves: "L' U' L F L' U' L U L F' L2 U L U",
				label: 'left-hand',
				note: 'Mirror-image fingers, wanting the three matching stickers down the right rather than the left.'
			}
		],
		recognition:
			'One face is solved outright — a solid bar of three. Hold it on the left and the front reads own colour, own colour, stranger. The two corners on the right swap, and so do the right and back edges.',
		notes:
			'Ja, Jb and the F perm all show a solid bar with the two far corners swapping, so read the edges to tell them apart: Ja takes the right and back edges, Jb the right and front, F the front and back.',
		tags: ['adjacent', 'bar', 'mirror']
	},
	{
		id: 'pll-jb',
		set: 'pll',
		name: 'Jb Permutation',
		shortName: 'Jb',
		group: 'Adjacent corner swap',
		tier: 'intermediate',
		probability: '1/18',
		mirrorOf: 'pll-ja',
		algs: [
			{ moves: "R U R' F' R U R' U' R' F R2 U' R' U'" },
			{
				moves: "R U2 R' U' R U2 L' U R' U' L",
				label: 'shorter',
				note: 'The mirror of the Ja algorithm, which makes the pair cheap to learn together.'
			}
		],
		recognition:
			'A solid bar of three on one side again. Hold it on the left and the front reads own colour, then two stickers of the right face’s colour. The right-hand corners swap along with the right and front edges.',
		notes:
			'The tail of this algorithm is the opening of the T perm, so the two share most of their muscle memory. Learn them in the same session and the second one arrives nearly free.',
		triggers: ['sexy move'],
		tags: ['adjacent', 'bar', 'common', 'mirror']
	},
	{
		id: 'pll-ra',
		set: 'pll',
		name: 'Ra Permutation',
		shortName: 'Ra',
		group: 'Adjacent corner swap',
		tier: 'advanced',
		probability: '1/18',
		mirrorOf: 'pll-rb',
		algs: [
			{ moves: "R U' R' U' R U R D R' U' R D' R' U2 R' U'" },
			{ moves: "R U R' F' R U2 R' U2 R' F R U R U2 R' U'", label: 'no D moves' },
			{
				moves: "L U2 L' U2 L F' L' U' L U L F L2 U",
				label: 'left-hand',
				note: 'The Rb algorithm mirrored. It wants the headlights facing you rather than on your left.'
			}
		],
		recognition:
			'Headlights on one face with a wrong edge between them, and a two-block — a corner sitting with its own edge — on a neighbouring face. Hold the headlights on your left and Ra’s two-block is at the front.',
		notes:
			'The R perms are the fiddliest of the adjacent-swap cases and the last of that group most people learn. If the D turns in the first algorithm break your grip, the no-D version costs nothing extra in move count.',
		triggers: ['Aa insert'],
		tags: ['adjacent', 'headlights', 'block', 'mirror', 'awkward']
	},
	{
		id: 'pll-rb',
		set: 'pll',
		name: 'Rb Permutation',
		shortName: 'Rb',
		group: 'Adjacent corner swap',
		tier: 'advanced',
		probability: '1/18',
		mirrorOf: 'pll-ra',
		algs: [
			{ moves: "R' U2 R U2 R' F R U R' U' R' F' R2 U'" },
			{
				moves: "R2 F R U R U' R' F' R U2 R' U2 R",
				label: 'F first',
				note: 'Opens with the F block instead of closing with it, and it is written for the case held the way the recognition describes, headlights on your left.'
			}
		],
		recognition:
			'The mirror of Ra: headlights with a stranger between them and a two-block on a neighbouring face. The diagram has the headlights facing you; turn them to your left and Rb’s two-block sits at the back, where Ra’s is at the front.',
		notes:
			'Friendlier than Ra for most right hands — everything but the single F and F’ is R and U. The sexy move in the middle is a useful landmark if you lose your place.',
		triggers: ['sexy move'],
		tags: ['adjacent', 'headlights', 'block', 'mirror']
	},
	{
		id: 'pll-f',
		set: 'pll',
		name: 'F Permutation',
		shortName: 'F',
		group: 'Adjacent corner swap',
		tier: 'advanced',
		probability: '1/18',
		algs: [
			{ moves: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
			{
				moves: "R' U R U' R2 F' U' F U R F R' F' R2 U'",
				label: 'shorter',
				note: 'Three moves shorter with no rotation in it. Like most published F perms it is written for the bar lying across the front rather than down the left.'
			},
			{
				moves: "R' U2 R' U' y R' F' R2 U' R' U R' F R U' F",
				label: 'with a rotation',
				note: 'Quick in the hands, but it wants the bar across the back and it leaves the cube turned a quarter of the way round.'
			}
		],
		recognition:
			'A solid bar of three on one side, like the J perms, but nothing lines up beside it: hold the bar on your left and the front shows three different colours. The two right-hand corners swap and the front and back edges trade places.',
		notes:
			'Eighteen moves in the standard form, which is why most people carry a shorter one alongside it. Any of the three is fine; what matters is settling on one and not weighing them up mid-solve.',
		triggers: ['sexy move'],
		tags: ['adjacent', 'bar', 'long', 'awkward']
	},

	// -------------------------------------------------------------------------
	// Diagonal corner swap
	// -------------------------------------------------------------------------
	{
		id: 'pll-v',
		set: 'pll',
		name: 'V Permutation',
		shortName: 'V',
		group: 'Diagonal corner swap',
		tier: 'advanced',
		probability: '1/18',
		algs: [
			{ moves: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2" },
			{
				moves: "R' U R' U' y R' F' R2 U' R' U R' F R F",
				label: 'with a rotation',
				note: 'Two moves shorter and the version most speedcubers use; it ends with the cube turned a quarter of the way round.'
			}
		],
		recognition:
			'One corner sits complete with both of its edges — three solved pieces wrapping a corner of the layer. Diagonally opposite, the other solved corner has both its edges swapped, and the two remaining corners swap diagonally.',
		notes:
			'V and Y both swap a diagonal pair of corners. The tell is the run of three: V has a corner with both its edges solved, Y does not.',
		tags: ['diagonal', 'block', 'd-moves']
	},
	{
		id: 'pll-y',
		set: 'pll',
		name: 'Y Permutation',
		shortName: 'Y',
		group: 'Diagonal corner swap',
		tier: 'advanced',
		probability: '1/18',
		algs: [
			{ moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
			{
				moves: "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
				label: 'shorter',
				note: 'A move shorter, and the whole middle is shared with the primary; it closes on a single F’ where the primary needs the sledgehammer.'
			}
		],
		recognition:
			'Two two-blocks on adjacent faces, sitting at opposite ends of the layer, and no run of three anywhere. The corners swap diagonally, and so do two of the edges.',
		notes:
			'Built entirely from pieces you already own: an F-conjugated opening, a sexy move in the middle and a sledgehammer to close. That structure makes it one of the easier long algorithms to hold on to.',
		triggers: ['sexy move', 'sledgehammer'],
		tags: ['diagonal', 'block', 'fast']
	},
	{
		id: 'pll-na',
		set: 'pll',
		name: 'Na Permutation',
		shortName: 'Na',
		group: 'Diagonal corner swap',
		tier: 'advanced',
		probability: '1/72',
		mirrorOf: 'pll-nb',
		algs: [
			{ moves: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
			{
				moves: "L U' R U2 L' U R' L U' R U2 L' U R'",
				label: 'symmetric',
				note: 'The same seven moves twice. Easier to remember than it is to run smoothly.'
			},
			{
				moves: "z U R' D R2 U' R D' U R' D R2 U' R D' z'",
				label: 'with rotations',
				note: 'The same seven moves twice again, tilted so the turns fall on U, R and D rather than L, U and R.'
			}
		],
		recognition:
			'Two two-blocks on opposite faces, offset against each other so the layer leans like the strokes of an N. In Na the front block sits on the right of the front face.',
		notes:
			'One solve in seventy-two, so most people leave the N perms until the rest of the set is solid. Both fourteen-move versions beat the standard twenty-one-move form on paper, but they want two hands working evenly.',
		triggers: ['sexy move', 'Aa insert'],
		tags: ['diagonal', 'rare', 'long', 'mirror', 'awkward']
	},
	{
		id: 'pll-nb',
		set: 'pll',
		name: 'Nb Permutation',
		shortName: 'Nb',
		group: 'Diagonal corner swap',
		tier: 'advanced',
		probability: '1/72',
		mirrorOf: 'pll-na',
		algs: [
			{ moves: "R' U R U' R' F' U' F R U R' F R' F' R U' R" },
			{
				moves: "R' U L' U2 R U' L R' U L' U2 R U' L",
				label: 'symmetric',
				note: 'Seven moves repeated, mirroring the Na version.'
			},
			{
				moves: "z D' R U' R2 D R' U D' R U' R2 D R' U z'",
				label: 'with rotations',
				note: 'The Na version reflected top to bottom: the same seven moves with U and D exchanged.'
			}
		],
		recognition:
			'The mirror image of Na: the same pair of opposed two-blocks, but the front one sits on the left of the front face.',
		notes:
			'Between them the two N perms turn up once in thirty-six solves. Learn the pair together, because the recognition is a single glance at which way the blocks lean and nothing else.',
		triggers: ['hedgeslammer'],
		tags: ['diagonal', 'rare', 'long', 'mirror', 'awkward']
	},

	// -------------------------------------------------------------------------
	// G permutations
	// -------------------------------------------------------------------------
	{
		id: 'pll-ga',
		set: 'pll',
		name: 'Ga Permutation',
		shortName: 'Ga',
		group: 'G permutations',
		tier: 'advanced',
		probability: '1/18',
		mirrorOf: 'pll-gc',
		algs: [
			{ moves: "R2 Uw R' U R' U' R Uw' R2 F' U F" },
			{
				moves: "R2 U R' U R' U' R U' R2 U' D R' U R D'",
				label: 'D turns',
				note: 'Avoids wide turns at the cost of three more moves.'
			}
		],
		recognition:
			'Exactly one two-block and exactly one set of headlights — the signature of every G perm. Hold the two-block on the front face: for Ga it sits at the right-hand end, with the headlights on the left.',
		notes:
			'Three corners and three edges cycle at once, which is why the G perms are the hardest recognition in the set. Fix the two-block to the front every time and read off where the headlights are — the four cases then differ by one glance.',
		tags: ['g-perm', '3-cycle', 'wide-turn', 'mirror', 'awkward']
	},
	{
		id: 'pll-gb',
		set: 'pll',
		name: 'Gb Permutation',
		shortName: 'Gb',
		group: 'G permutations',
		tier: 'advanced',
		probability: '1/18',
		mirrorOf: 'pll-gd',
		algs: [
			{ moves: "F' U' F R2 Uw R' U R U' R Uw' R2" },
			{ moves: "R' U' R U D' R2 U R' U R U' R U' R2 D", label: 'D turns' }
		],
		recognition:
			'One two-block and one set of headlights. With the two-block held at the right-hand end of the front face, Gb puts the headlights at the back.',
		notes:
			'Gb is the Ga algorithm run backwards, move for move, so the pair costs barely more than one algorithm to learn. Only the recognition has to be kept separate.',
		tags: ['g-perm', '3-cycle', 'wide-turn', 'mirror', 'awkward']
	},
	{
		id: 'pll-gc',
		set: 'pll',
		name: 'Gc Permutation',
		shortName: 'Gc',
		group: 'G permutations',
		tier: 'advanced',
		probability: '1/18',
		mirrorOf: 'pll-ga',
		algs: [
			{ moves: "R2 Uw' R U' R U R' Uw R2 Fw R' Fw'" },
			{ moves: "R2 U' R U' R U R' U R2 U D' R U' R' D", label: 'D turns' }
		],
		recognition:
			'One two-block, one set of headlights. The diagram shows the block lying along the back; bring it round to the front and it sits at the left-hand end, with the headlights on the right.',
		notes:
			'The mirror of Ga, so if you find the wide U turn in one direction easier than the other, this is the pair where that shows up. Gc and Gd are inverses of each other in the same way Ga and Gb are.',
		tags: ['g-perm', '3-cycle', 'wide-turn', 'mirror', 'awkward']
	},
	{
		id: 'pll-gd',
		set: 'pll',
		name: 'Gd Permutation',
		shortName: 'Gd',
		group: 'G permutations',
		tier: 'advanced',
		probability: '1/18',
		mirrorOf: 'pll-gb',
		algs: [
			{ moves: "Fw R Fw' R2 Uw' R U' R' U R' Uw R2" },
			{ moves: "R U R' U' D R2 U' R U' R' U R' U R2 D'", label: 'D turns' },
			{
				moves: "R U R' y' R2 Uw' R U' R' U R' Uw R2",
				label: 'with a rotation',
				note: 'The form most lists print; it leaves the cube turned a quarter of the way round.'
			}
		],
		recognition:
			'One two-block, one set of headlights, with the block along the back in the diagram again. Bring it to the front — left-hand end, as for Gc — and Gd puts the headlights at the back.',
		notes:
			'This is the Gc algorithm run backwards. Gb and Gd are the two G perms whose headlights sit on the face opposite the two-block, so once you have narrowed it to those, all that is left to check is which end of the front face the block sits at.',
		triggers: ['Aa insert'],
		tags: ['g-perm', '3-cycle', 'wide-turn', 'mirror', 'awkward']
	}
];
