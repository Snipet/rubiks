/**
 * The beginner method, in the order it is learnt.
 *
 * Two sets live here. `beginner-f2l` builds the bottom two layers a piece at a
 * time: the cross on the bottom face, then the four bottom corners, then the four
 * middle edges. `beginner-ll` finishes the top: cross, orient the corners, place
 * the corners, place the edges.
 *
 * A word on how to read the diagrams. The cross goes on the **bottom** face and
 * the last layer sits on **top**, so every algorithm here works on the U face and
 * the slots sit between the two. Descriptions say "the cross colour" and "the top
 * colour" rather than naming colours, because which colour you start on is your
 * choice and the shapes are what you actually recognise.
 *
 * Several of these algorithms are meant to be run more than once. Where that is
 * the case the entry says so explicitly and gives the number of repetitions,
 * because "repeat until it goes in" is where most people lose their nerve — the
 * cube looks worse in the middle of the loop than it did at the start, and it is
 * supposed to.
 */

import type { AlgCase } from '../types';

export const BEGINNER_F2L_CASES: readonly AlgCase[] = [
	// -------------------------------------------------------------------------
	// Cross
	// -------------------------------------------------------------------------
	{
		id: 'beg-f2l-01',
		set: 'beginner-f2l',
		name: 'Dropping a petal into the cross',
		shortName: 'Petal drop',
		group: 'Cross',
		tier: 'beginner',
		algs: [{ moves: 'F2' }],
		recognition:
			'A cross-colour edge is sitting on the top face — a daisy petal — and its second sticker points at you and matches the centre of the front face. Lined up like that, it is ready to drop.',
		notes:
			'The daisy is the whole trick of this step: gather all four cross-colour edges around the top centre first, so they look like petals, and only then start dropping them. Because the petal is already above its matching centre, one half turn of the front face carries it straight down into the cross the right way up, and the three petals you have not touched stay where they are. Turn the top layer to bring the next petal round to the front and repeat. Four petals, four half turns.',
		tags: ['cross', 'daisy', 'one-move', 'first-step']
	},
	{
		id: 'beg-f2l-02',
		set: 'beginner-f2l',
		name: 'Cross edge lying on its side',
		shortName: 'Side edge',
		group: 'Cross',
		tier: 'beginner',
		algs: [{ moves: "U' R' F R" }],
		recognition:
			'The last cross edge is in the top layer but lying flat against the front face: the cross colour points out at you, and the sticker on top is the one that matches the front centre. It is the wrong way up to be a petal, so a half turn of the front would put it into the cross upside down.',
		notes:
			"Follow the edge rather than the moves. U' carries it round to the right of the top layer, R' drops it into the front-right slot, F swings it down into the cross with the cross colour underneath, and the closing R puts the right-hand layer back exactly as it was. If you would rather not learn a fourth move, you can instead turn it into a proper petal and use the half turn from the case above; it costs more turns but nothing new to remember.",
		tags: ['cross', 'daisy', 'insertion']
	},
	{
		id: 'beg-f2l-03',
		set: 'beginner-f2l',
		name: 'Cross edge in upside down',
		shortName: 'Flipped edge',
		group: 'Cross',
		tier: 'beginner',
		algs: [{ moves: "F2 U' R' F R" }],
		recognition:
			'The edge is already sitting in its place at the bottom of the front face, but flipped: the cross colour faces you and the side colour is underneath. From above the cross looks finished, which is exactly why this one catches people.',
		notes:
			'The opening F2 is the move worth understanding — it lifts the edge back out into the top layer, where it becomes the side-lying case above, and the remaining four moves are that case unchanged. Get into the habit of turning the cube over and looking at the finished cross before you start on the corners. A flipped cross edge is invisible from the top and quietly ruins everything built on it, and by the time you notice, the fix means taking a corner back out.',
		tags: ['cross', 'flipped', 'common-mistake']
	},

	// -------------------------------------------------------------------------
	// Bottom corners
	// -------------------------------------------------------------------------
	{
		id: 'beg-f2l-04',
		set: 'beginner-f2l',
		name: 'Corner above its slot, cross colour on the right',
		shortName: 'Corner, one go',
		group: 'Bottom corners',
		tier: 'beginner',
		probability: '1/3',
		algs: [{ moves: "R U R' U'" }],
		recognition:
			'The corner you want is in the top layer directly above the hole it belongs in — the bottom front right — and its cross-colour sticker is on the right-hand face.',
		notes:
			"These four moves are the sexy move, and they are the only sequence this entire step needs. Watch the corner as you go: it swings out to the back on R, comes round to the front on U, and drops into the slot on R'. The final U' is not part of the insertion at all — it puts the top layer back so you can read the next corner without re-counting. When the corner is facing some other way the same four moves still work; you run them again, which is what the next two cases are.",
		triggers: ['sexy move'],
		tags: ['2-gen', 'corners', 'fast']
	},
	{
		id: 'beg-f2l-05',
		set: 'beginner-f2l',
		name: 'Corner above its slot, cross colour on top',
		shortName: 'Corner, three goes',
		group: 'Bottom corners',
		tier: 'beginner',
		probability: '1/3',
		algs: [{ moves: "(R U R' U')*3" }],
		recognition:
			'Same position as above — the corner is in the top layer directly over its slot — but the cross-colour sticker is facing straight up at you instead of out to the right.',
		notes:
			'Three goes of the same four moves. Along the way the corner drops into the slot the wrong way round and then pops back out into the top layer; that is the loop working, not a mistake, and it is the point at which most people stop and start again. If you lose count, do not count — look. Stop the moment the cross colour is on the bottom of the cube. If the corner is sitting in the slot but showing its cross colour on a side face, you are halfway and need to keep going.',
		triggers: ['sexy move', 'double sexy'],
		tags: ['2-gen', 'corners', 'repeat']
	},
	{
		id: 'beg-f2l-06',
		set: 'beginner-f2l',
		name: 'Corner above its slot, cross colour facing you',
		shortName: 'Corner, five goes',
		group: 'Bottom corners',
		tier: 'beginner',
		probability: '1/3',
		algs: [{ moves: "(R U R' U')*5" }],
		recognition:
			'The corner is over its slot once more, and this time the cross-colour sticker is on the front face, pointing at you.',
		notes:
			'Five goes, twenty moves, and the longest wait in the beginner method. Nothing you have already built is at risk: the cross and any corners you have placed all come back every time the loop completes, so the only real way to go wrong is to stop early. Sit with it. When the twenty moves start to grate, that is the moment to look at intuitive F2L, which replaces all of this with a three-move insertion.',
		triggers: ['sexy move', 'double sexy'],
		tags: ['2-gen', 'corners', 'repeat', 'slow']
	},
	{
		id: 'beg-f2l-07',
		set: 'beginner-f2l',
		name: 'Corner in the top layer, over the wrong slot',
		shortName: 'Wrong slot',
		group: 'Bottom corners',
		tier: 'beginner',
		algs: [{ moves: "U R U R' U'" }],
		recognition:
			'The corner you want is loose in the top layer, but it is hovering over the back-right slot rather than the front-right one, showing its cross colour on the back face.',
		notes:
			'The leading U is the entire lesson: turn the top layer until the corner sits directly above the slot it belongs in, and only then start the insertion. Here one quarter turn brings it to the front right with the cross colour on the right-hand face, so a single sexy move finishes the job. Turning R and U while the corner is somewhere else only shuffles the top layer around.',
		triggers: ['sexy move'],
		tags: ['setup', 'corners', '2-gen']
	},
	{
		id: 'beg-f2l-08',
		set: 'beginner-f2l',
		name: 'Corner in the slot the wrong way round',
		shortName: 'Twisted in',
		group: 'Bottom corners',
		tier: 'beginner',
		algs: [{ moves: "(R U R' U')*4" }],
		recognition:
			'The corner is in the right slot but twisted — its cross-colour sticker faces the front instead of pointing down — so the bottom face still has a hole in it even though the piece looks placed.',
		notes:
			'Four more turns of the same loop puts it right, which is what the sixteen moves above are. If that feels absurd, run the loop once instead: the corner lifts back into the top layer, you read which way it is facing, and you use whichever of the three cases above matches. That is the same thing with a pause for thought in the middle, and it is usually quicker. The identical trick evicts a corner that has ended up in the wrong slot altogether.',
		triggers: ['sexy move', 'double sexy'],
		tags: ['corners', 'repeat', 'stuck']
	},

	// -------------------------------------------------------------------------
	// Middle edges
	// -------------------------------------------------------------------------
	{
		id: 'beg-f2l-09',
		set: 'beginner-f2l',
		name: 'Middle edge going to the right',
		shortName: 'Right insert',
		group: 'Middle edges',
		tier: 'beginner',
		mirrorOf: 'beg-f2l-10',
		algs: [
			{ moves: "U R U' R' U' F' U F" },
			{
				moves: "U R U' R' d' L' U L",
				label: 'rotating',
				note: "The d' turns the bottom two layers, so the cube finishes a quarter turn round from where it started. Nothing is unsolved; you are holding it differently."
			}
		],
		recognition:
			'An edge in the top layer with no cross colour anywhere on it. Its front sticker matches the front centre, and the sticker facing up matches the right-hand centre — so it belongs in the slot between the front and the right.',
		notes:
			'Watch the edge and it makes sense: it stays up in the top layer for seven of the eight moves and only drops into the slot on the very last turn. Everything before that is opening the slot, emptying whatever was in it up into the top layer, and closing it again with the right piece poised above. Get the recognition right before you turn anything — reading the two stickers the wrong way round sends the edge into the left slot, and you will not notice until the middle layer refuses to finish.',
		triggers: ['Aa insert'],
		tags: ['middle-layer', 'right-hand', 'mirror']
	},
	{
		id: 'beg-f2l-10',
		set: 'beginner-f2l',
		name: 'Middle edge going to the left',
		shortName: 'Left insert',
		group: 'Middle edges',
		tier: 'beginner',
		mirrorOf: 'beg-f2l-09',
		algs: [
			{ moves: "U' L' U L U F U' F'" },
			{
				moves: "U' L' U L d R U' R'",
				label: 'rotating',
				note: 'The mirror of the rotating version above, and again the cube ends up turned a quarter of the way round.'
			}
		],
		recognition:
			'The same picture with the top sticker matching the left-hand centre instead of the right. Front sticker matches the front centre, top sticker matches the left centre, so the edge belongs between the front and the left.',
		notes:
			'This is the right-hand insertion reflected in a mirror: every R becomes an L, every F stays an F, and every U turn reverses. Learn it as a reflection rather than as eight new moves, and check yourself by holding the two side by side. Most people find one hand markedly worse than the other here; the awkward one is worth drilling on its own, because half the middle layer needs it.',
		tags: ['middle-layer', 'left-hand', 'mirror']
	},
	{
		id: 'beg-f2l-11',
		set: 'beginner-f2l',
		name: 'Wrong edge stuck in a middle slot',
		shortName: 'Stuck edge',
		group: 'Middle edges',
		tier: 'beginner',
		algs: [{ moves: "U R U' R' U' F' U F U R U' R' U' F' U F" }],
		recognition:
			'The front-right slot is already full, but with the wrong edge — one of its stickers is the top colour, so it belongs in the last layer, not down here. Meanwhile the edge that does belong there is loose in the top layer.',
		notes:
			'This is the situation that stops beginners dead, because there is no top-layer edge left to work with and the algorithms all seem to need one. The answer is to run the insertion anyway. The first eight moves lift the intruder out into the top layer and drop something harmless in its place; you then have an ordinary case again and insert the correct edge with a second run. In this particular arrangement the two runs follow straight on from each other, which is why the sixteen moves above finish the job on their own. More often you will need to turn the top layer between them to line the right edge up, so pause and look after the first run rather than charging through.',
		triggers: ['Aa insert'],
		tags: ['middle-layer', 'stuck', 'repeat', 'common-mistake']
	}
];

export const BEGINNER_LL_CASES: readonly AlgCase[] = [
	// -------------------------------------------------------------------------
	// Top cross
	// -------------------------------------------------------------------------
	{
		id: 'beg-ll-01',
		set: 'beginner-ll',
		name: 'Line',
		shortName: 'Line',
		group: 'Top cross',
		tier: 'beginner',
		probability: '1/4',
		algs: [
			{ moves: "F R U R' U' F'" },
			{
				moves: "R U R' U' R' F R F'",
				label: 'two triggers',
				note: 'A sexy move followed by a sledgehammer. Same result, and both halves are patterns your hands will meet again constantly.'
			}
		],
		recognition:
			'A bar of three across the middle of the top face, running from the left edge to the right. The front and back edges are flipped, showing their top colour on the side faces instead. Ignore the corners entirely at this stage — they are allowed to be anything.',
		notes:
			"Six moves, and the one algorithm the whole top-cross step is built from. Hold the bar so it runs left to right, not front to back; turning the top layer a quarter to fix that costs nothing and getting it wrong turns the line into a dot. The F and F' at the ends are a bracket: the front face opens, the sexy move does the work, and the front face closes again.",
		triggers: ['sexy move'],
		tags: ['top-cross', 'edges', 'fast']
	},
	{
		id: 'beg-ll-02',
		set: 'beginner-ll',
		name: 'L shape',
		shortName: 'L',
		group: 'Top cross',
		tier: 'beginner',
		probability: '1/2',
		algs: [
			{ moves: "F U R U' R' F'" },
			{
				moves: "U2 f R U R' U' f'",
				label: 'wide-turn',
				note: 'The same idea with a double layer instead of the outer face. The U2 first, because the wide version expects the L in the opposite corner.'
			}
		],
		recognition:
			"Two flipped edges meeting at a right angle: the back edge and the left edge are the correct way up, forming an L that points into the back-left corner. Held like that, the elbow of the L is at nine and twelve o'clock.",
		notes:
			'The commonest of the three shapes — you will see it in half of all solves. Getting the L into the back-left corner is the only difficult part; the moves are the line algorithm with the middle two turns swapped round. If you would rather learn one sequence than two, run the line algorithm on the L instead: it will not finish the cross, but it does turn the L into a line, and a second run then finishes it.',
		triggers: ['Aa insert'],
		tags: ['top-cross', 'edges', 'common']
	},
	{
		id: 'beg-ll-03',
		set: 'beginner-ll',
		name: 'Dot',
		shortName: 'Dot',
		group: 'Top cross',
		tier: 'beginner',
		probability: '1/8',
		algs: [
			{ moves: "F R U R' U' F' U2 F U R U' R' F'" },
			{
				moves: "F R U R' U' F' f R U R' U' f'",
				label: 'wide-turn',
				note: 'The standard two-look version: the same algorithm twice, the second time with a double layer, which saves the turn of the top in the middle.'
			},
			{
				moves: "F U R U' R' F' U F R U R' U' F'",
				label: 'other order',
				note: 'L algorithm first, line algorithm second. Ends in the same place.'
			}
		],
		recognition:
			'Nothing on the top face but the centre. All four edges are flipped, each showing its top colour on a side face. There is no orientation to hunt for, so start from wherever the cube is.',
		notes:
			'The rarest shape and the only one that needs two runs. The first six moves turn the dot into an L; the U2 then swings that L round into the back-left corner where the second algorithm expects it, and those last six moves finish the cross. Do them as two separate thoughts with a look in between rather than as one thirteen-move block — you will make far fewer mistakes, and if you do slip you will know which half went wrong.',
		triggers: ['sexy move', 'Aa insert'],
		tags: ['top-cross', 'edges', 'repeat', 'rare']
	},

	// -------------------------------------------------------------------------
	// Corner orientation
	// -------------------------------------------------------------------------
	{
		id: 'beg-ll-04',
		set: 'beginner-ll',
		name: 'Sune — one corner done',
		shortName: 'Sune',
		group: 'Corner orientation',
		tier: 'beginner',
		probability: '4/27',
		algs: [
			{ moves: "R U R' U R U2 R'" },
			{
				moves: "U L' U2 L U L' U L",
				label: 'left-hand',
				note: 'The mirror image. The U at the front swings the finished corner round to the back left, which is where the left-hand version expects it.'
			},
			{ moves: "U' R' U2 R U R' U R", label: 'reverse grip' }
		],
		recognition:
			'The cross on top is done and exactly one corner already shows the top colour on top — hold it at the front left. The other three show their top colour on the back face, on the right face and on the front face in turn.',
		notes:
			'The sune is the single most useful algorithm in the hobby and the first one worth getting properly fluent. It is also the whole of this step: whatever arrangement of corners you are faced with, hold an unfinished one so that the sune applies and run it, look again, run it again. Two goes cover every case there is. The top will look badly broken partway through — corners flying up, the cross apparently gone — and it comes back together every time.',
		triggers: ['sune'],
		tags: ['sune', '2-gen', 'corners', 'fast']
	},
	{
		id: 'beg-ll-05',
		set: 'beginner-ll',
		name: 'Anti-sune — one corner done, mirrored',
		shortName: 'Anti-sune',
		group: 'Corner orientation',
		tier: 'beginner',
		probability: '4/27',
		mirrorOf: 'beg-ll-04',
		algs: [
			{ moves: "R U2 R' U' R U' R'" },
			{
				moves: "U2 (R U R' U R U2 R') U2 (R U R' U R U2 R')",
				label: 'sune twice',
				note: 'If you would rather know one algorithm than two: the sune, a half turn of the top, the sune again. Sixteen moves instead of seven, but nothing new to memorise.'
			}
		],
		recognition:
			'One corner done again, but the twist runs the other way. Hold the finished corner at the back right and the other three show their top colour on the left face, on the front face and on the right face.',
		notes:
			'Sune and anti-sune are the pair people confuse, and the confusion costs a whole extra algorithm every time. The reliable check: hold the finished corner at the front left and look at the corner diagonally opposite. Top colour on the right means sune; top colour on the back means anti-sune. Learn the seven-move version if you can — it is the sune backwards and your hands pick it up quickly.',
		triggers: ['Aa insert'],
		tags: ['sune', '2-gen', 'corners', 'mirror']
	},
	{
		id: 'beg-ll-06',
		set: 'beginner-ll',
		name: 'H — no corners done, stickers facing out sideways',
		shortName: 'H',
		group: 'Corner orientation',
		tier: 'beginner',
		probability: '2/27',
		algs: [
			{ moves: "R U R' U R U' R' U R U2 R'" },
			{
				moves: "(R U R' U R U2 R')*2",
				label: 'sune twice',
				note: "Exactly the same thing. The two sunes run straight on with no turn between them, and the R' R in the middle cancels, which is where the shorter form comes from."
			}
		],
		recognition:
			'No corner shows the top colour on top. All four top-colour corner stickers face outwards on two opposite side faces — two on the left and two on the right as drawn — so the case looks the same from either side.',
		notes:
			'The rarest corner case and the tidiest: two sunes back to back, with no turn of the top layer in between. The eleven-move algorithm above is those fourteen moves with the cancellation taken out, so if you already know the sune you know this one and can build it on the spot. Because the case is symmetric there is no angle to hunt for; pick up the cube and go.',
		triggers: ['Aa insert'],
		tags: ['sune', 'corners', 'symmetric', 'rare']
	},
	{
		id: 'beg-ll-07',
		set: 'beginner-ll',
		name: 'Pi — no corners done, two stickers together',
		shortName: 'Pi',
		group: 'Corner orientation',
		tier: 'beginner',
		probability: '4/27',
		algs: [
			{ moves: "R U2 R2 U' R2 U' R2 U2 R" },
			{
				moves: "(R U R' U R U2 R') U' (R U R' U R U2 R')",
				label: 'sune twice',
				note: 'The sune, a quarter turn of the top anticlockwise, the sune again.'
			}
		],
		recognition:
			'No corner done, and this time the loose stickers are unevenly spread: two of them sit side by side on one face — the left as drawn — with a single sticker at the far end of the front and another at the far end of the back.',
		notes:
			'Two sunes again, with a quarter turn between them rather than nothing. Between H and Pi you have covered every case where no corner is finished; anything else has one or two corners already done, and the same rule applies — hold an unfinished corner where the sune wants it, run the sune, and look again. The nine-move algorithm above is worth learning eventually because it is almost all half turns of the right face, which is quick once your fingers know it.',
		tags: ['sune', 'corners', 'rare']
	},

	// -------------------------------------------------------------------------
	// Corner permutation
	// -------------------------------------------------------------------------
	{
		id: 'beg-ll-08',
		set: 'beginner-ll',
		name: 'Three corners to move, one way round',
		shortName: 'Corner cycle',
		group: 'Corner permutation',
		tier: 'beginner',
		probability: '1/3',
		mirrorOf: 'beg-ll-09',
		algs: [
			{ moves: "R' F R' B2 R F' R' B2 R2" },
			{
				moves: "x R' U R' D2 R U' R' D2 R2 x'",
				label: 'tilted',
				note: "The version most people learn later, done with the cube tipped onto its side so the D2s fall under the right hand. The closing x' puts the cube back the way you picked it up."
			}
		],
		recognition:
			'The top face is one colour, so read the side stickers instead. Exactly one corner has both its side stickers matching the centres beside it — hold that corner at the front left. The two back corners then show the same colour as each other on the back face.',
		notes:
			'With the home corner at the front left, the other three travel round: the back-left corner goes to the back right, the back-right goes to the front right, and the front-right comes back to the back left. Work out which way the cycle runs before your hands start, because this and the case below are the same picture with the arrows reversed. If no corner at all is in the right place, run this algorithm from any angle; it will put one corner right, and then you have this case.',
		tags: ['corners', '3-cycle', 'a-perm', 'mirror']
	},
	{
		id: 'beg-ll-09',
		set: 'beginner-ll',
		name: 'Three corners to move, the other way round',
		shortName: 'Corner cycle back',
		group: 'Corner permutation',
		tier: 'beginner',
		probability: '1/3',
		mirrorOf: 'beg-ll-08',
		algs: [
			{ moves: "R2 B2 R F R' B2 R F' R" },
			{ moves: "x R2 D2 R U R' D2 R U' R x'", label: 'tilted' }
		],
		recognition:
			'Indistinguishable from the case above at a glance: one corner home, the rest wrong. Hold the home corner at the front left again and the two right-hand corners show the same colour as each other on the right face.',
		notes:
			'The cycle runs the other way: the back-left corner goes to the front right, the front-right goes to the back right, and the back-right comes back to the back left. This algorithm is the previous one backwards, so the second costs almost nothing once the first is fluent. Choosing wrongly is a cheap mistake — you are left with the other case and one more algorithm to run.',
		tags: ['corners', '3-cycle', 'a-perm', 'mirror']
	},
	{
		id: 'beg-ll-10',
		set: 'beginner-ll',
		name: 'Placing the corners before you twist them',
		shortName: 'Old corner cycle',
		group: 'Corner permutation',
		tier: 'beginner',
		algs: [{ moves: "U R U' L' U R' U' L" }],
		recognition:
			'The top cross is finished and all four edges are already in the right places, but the corners are a mess of orientations. One corner — the front right as drawn — is in the place it belongs; the other three are each in the wrong place and turned the wrong way.',
		notes:
			'This is the algorithm the printed beginner guides use, and it belongs to a different order of steps: place the corners first while their orientation is still random, then twist them into place afterwards. It cycles the back-left corner to the front left, the front left to the back right, and the back right to the back left, and it twists them as it goes. That last part matters. If you have already made the top face one colour by following the order on this page, use one of the two cycles above instead — running this one would undo the orientation work you have already done. It is here because a great many people learnt it first and go looking for it.',
		tags: ['corners', '3-cycle', 'alternative-order']
	},

	// -------------------------------------------------------------------------
	// Edge permutation
	// -------------------------------------------------------------------------
	{
		id: 'beg-ll-11',
		set: 'beginner-ll',
		name: 'Three edges to cycle, clockwise',
		shortName: 'Edge cycle',
		group: 'Edge permutation',
		tier: 'beginner',
		probability: '1/3',
		mirrorOf: 'beg-ll-12',
		algs: [
			{ moves: "F2 U L R' F2 L' R U F2" },
			{
				moves: "M2 U' M U2 M' U' M2",
				label: 'M-slice',
				note: 'Far shorter, and the version you will eventually keep. It needs a comfortable grip on the middle slice, which is why it is not the one to start with.'
			},
			{ moves: "R2 U R U R' U' R' U' R' U R'", label: '2-gen' }
		],
		recognition:
			'Everything is solved except three edges. One edge is already home — hold it at the back — and the other three need to move round: the left edge belongs on the right, the right edge belongs at the front, and the front edge belongs on the left.',
		notes:
			'Think of it as the three edges shuffling clockwise round the top, hopping over the solved one at the back. Find the solved edge first and put it at the back before you decide anything else; from there the only question is which way the other three travel, and this case and the one below differ by exactly two moves. The algorithm is symmetrical to look at — a half turn of the front at each end and the L and R turns cancelling each other in the middle — which makes it stick in the memory better than its nine moves suggest.',
		tags: ['edges', '3-cycle', 'mirror']
	},
	{
		id: 'beg-ll-12',
		set: 'beginner-ll',
		name: 'Three edges to cycle, anticlockwise',
		shortName: 'Edge cycle back',
		group: 'Edge permutation',
		tier: 'beginner',
		probability: '1/3',
		mirrorOf: 'beg-ll-11',
		algs: [
			{ moves: "F2 U' L R' F2 L' R U' F2" },
			{ moves: "M2 U M U2 M' U M2", label: 'M-slice' },
			{ moves: "R U' R U R U R U' R' U' R2", label: '2-gen' }
		],
		recognition:
			'The same picture with the cycle reversed. Solved edge at the back again; now the left edge belongs at the front, the front edge belongs on the right, and the right edge belongs on the left.',
		notes:
			"The identical algorithm with both single turns of the top layer reversed — U becomes U' in two places and nothing else changes. That is the whole difference, so learn the two together rather than separately. If you run the wrong one you get the other case back and lose nine moves, which is the cheapest mistake in the last layer.",
		tags: ['edges', '3-cycle', 'mirror']
	},
	{
		id: 'beg-ll-13',
		set: 'beginner-ll',
		name: 'No edge in the right place',
		shortName: 'Four edges',
		group: 'Edge permutation',
		tier: 'beginner',
		probability: '1/4',
		algs: [
			{ moves: "F2 U L R' F2 L' R U F2 U F2 U L R' F2 L' R U F2 U'" },
			{
				moves: "M2 U' M2 U' M' U2 M2 U2 M' U2",
				label: 'M-slice',
				note: 'One algorithm rather than two runs, once the middle slice is comfortable. This is the Z permutation.'
			}
		],
		recognition:
			'Every edge is wrong, so there is no solved one to hold at the back. Here the front and left edges want to swap with each other and so do the back and right — two swaps rather than a cycle.',
		notes:
			'Run the cycle from the case above starting anywhere. It cannot finish the layer in one go, but it will always leave you with exactly one edge home, which is an ordinary three-edge cycle you already know how to solve. That is what the long algorithm above is: the nine-move cycle, a quarter turn of the top, the same cycle again, and a quarter turn back. There is a second all-wrong case where the swaps are between opposite edges rather than neighbouring ones, and it is handled the same way — run the cycle once and look again.',
		tags: ['edges', 'repeat', 'four-edges']
	}
];
