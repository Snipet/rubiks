/**
 * The 4×4 track.
 *
 * Reduction, in the order you meet it. Two of the four lessons are about stages
 * a 3×3 does not have; the third is about the two positions a 3×3 cannot reach;
 * the fourth is about going faster, which mostly means doing less of the first
 * two rather than anything new.
 */

import type { Lesson } from '../types';

export const REVENGE_LESSONS: readonly Lesson[] = [
	{
		slug: 'revenge-what-changes',
		title: 'What actually changes',
		summary: 'Loose centres, two of every edge, and why the puzzle is a 3×3 in disguise.',
		track: 'revenge',
		order: 1,
		minutes: 7,
		outcomes: [
			'Know the three kinds of piece a 4×4 has',
			'Understand what reduction means and why it works',
			'Read big-cube notation without guessing'
		],
		body: [
			{
				kind: 'prose',
				text: 'A 4×4 has eight corners, twenty-four edge pieces and twenty-four centre pieces. The corners behave exactly as they do on a 3×3. The other two groups are where the puzzle is different, and both differences come from the same thing: there is no middle layer, so nothing is fixed.'
			},
			{
				kind: 'list',
				items: [
					'**Centres are loose.** Four per face, and any of them can be moved anywhere. On a 3×3 the white centre tells you where white goes. Here you decide where white goes.',
					'**Edges come in pairs.** Each edge of the puzzle is two separate pieces — *wings* — that carry the same two colours and want to sit side by side.',
					'**Corners are corners.** Nothing new. Everything you know applies.'
				]
			},
			{ kind: 'heading', text: 'Reduction' },
			{
				kind: 'prose',
				text: "The method almost everyone uses is called *reduction*, and it is exactly what it sounds like: turn the 4×4 into a 3×3 and then solve that. Build each face's four centres into a solid block, join each pair of wings so they move as one, and what is left is a 3×3 whose pieces happen to be made of several bits."
			},
			{
				kind: 'prose',
				text: 'That is not a metaphor. This site takes it literally — once your centres are built and your wings are paired, the solve page reads off the 3×3 your puzzle has become and runs the ordinary 3×3 advice on it.'
			},
			{ kind: 'heading', text: 'Notation, and one trap' },
			{
				kind: 'table',
				headers: ['Written', 'Means'],
				rows: [
					['`R`', 'The right face on its own, as always.'],
					['`Rw`', 'The right face **and** the slice behind it, two layers together.'],
					['`2R`', 'The slice behind the right face, **on its own** — the face does not move.'],
					['`M`, `E`, `S`', 'Nothing. A 4×4 has no true middle layer, so these do not exist here.']
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Rw and 2R are different moves',
				text: 'Older guides write both as lowercase `r`, and which one they mean depends on the guide. It matters: a parity algorithm written with `2R` becomes a scramble if you perform `Rw`. This site always writes `2R` for the slice and `Rw` for the two-layer turn, and never uses lowercase for either.'
			},
			{
				kind: 'cube',
				setup: "Rw U2 2R F' Uw2 R",
				caption: 'Turn this one about. Notice that the wide turn drags the centres along with it.'
			}
		]
	},
	{
		slug: 'revenge-centres',
		title: 'Building the centres',
		summary: 'The stage with no algorithms, and the commutator for when it needs one.',
		track: 'revenge',
		order: 2,
		minutes: 10,
		prerequisites: ['revenge-what-changes'],
		teaches: ['revenge-centres'],
		outcomes: [
			'Build all six centres without an algorithm',
			'Know which colour goes opposite which',
			'Use a slice commutator for the last awkward pieces'
		],
		body: [
			{
				kind: 'prose',
				text: 'Six faces, four pieces each. There is nothing to line them up against, so you choose the scheme — and it has to be the right one, because a 4×4 with white opposite green cannot be finished.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'The standard scheme',
				text: 'White opposite yellow, green opposite blue, red opposite orange. Hold white on top with green in front and red is on the right. Get this wrong and everything works until the very end, which is a miserable way to find out.'
			},
			{ kind: 'heading', text: 'How to actually do it' },
			{
				kind: 'prose',
				text: 'Build white first, then yellow on the opposite side, then the remaining four in opposite pairs. The reason for that order is that the first two are free — nothing is built yet to break — and by the time you reach the last two, only two faces are left to work in.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Find a piece of the colour you are building and bring it to a slice that passes through the face you are building on.'
					},
					{
						text: 'Turn that face so the destination is out of the way of what you are about to do.'
					},
					{ text: 'Turn the slice to deliver the piece.' },
					{ text: 'Turn the face back. Whatever you already built comes back with it.' }
				]
			},
			{
				kind: 'prose',
				text: 'That last step is the whole trick, and it is worth saying plainly: **you protect what you have built by moving it out of the way and putting it back**, not by avoiding turns near it. Once that clicks, the first four centres stop being fiddly.'
			},
			{ kind: 'heading', text: 'When looking is not enough' },
			{
				kind: 'prose',
				text: 'The last few pieces are different. Every turn that fetches the piece you want undoes one you already placed, and there is nowhere left to hide anything. That is exactly the situation a commutator is for: do a thing, do another, undo the first, undo the second — and the two interferences cancel each other out.'
			},
			{ kind: 'case', id: 'revenge-centre-basic' },
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why this one is safe',
				text: 'It is built from inner slices only, and a slice turn cannot reach a corner. Six centre pieces move, in two three-cycles, and every other piece on the puzzle is exactly where you left it. That is measured rather than asserted — the tests check it piece by piece.'
			},
			{
				kind: 'prose',
				text: 'Learn what it does rather than the letters. Once you can see the two three-cycles you will start inventing the variants yourself, which is the point at which the centres stage stops being a chore.'
			},
			{
				kind: 'jump',
				href: '/algorithms/revenge-centres/',
				label: 'The commutator set',
				blurb: 'Five of them, with the effect of each written out.'
			}
		]
	},
	{
		slug: 'revenge-pairing',
		title: 'Pairing the wings',
		summary: 'Twelve edges, two pieces each, and a storage trick that makes it quick.',
		track: 'revenge',
		order: 3,
		minutes: 9,
		prerequisites: ['revenge-centres'],
		outcomes: [
			'Pair all twelve edges without breaking your centres',
			'Use the front face as storage',
			'Know why the last two pairs are the hard ones'
		],
		body: [
			{
				kind: 'prose',
				text: 'Every edge of the puzzle is two wings carrying the same two colours. Pairing means getting them side by side, and once paired they should stay paired — from here on you turn the outer layers only, and outer layers move a pair as a unit.'
			},
			{ kind: 'heading', text: 'The move' },
			{
				kind: 'steps',
				steps: [
					{ text: 'Bring one wing to the front-left edge and its partner to the front-right.' },
					{ text: 'Turn the slice between them so they meet.' },
					{ text: 'Turn the front face away, which stores the joined pair out of harm’s way.' },
					{ text: 'Turn the slice back, restoring the centres you just disturbed.' }
				]
			},
			{
				kind: 'prose',
				text: 'Step three is the part people skip and then wonder why their centres fall apart. Turning the front face after joining takes the finished pair out of the slice, so that when you undo the slice it stays joined and the centres come back.'
			},
			{
				kind: 'note',
				tone: 'tip',
				title: 'Do eight by eye before reading further',
				text: 'The pattern becomes obvious well before the theory does. Pair eight or ten edges on a real puzzle, badly and slowly, and the rest of this lesson will read as a description of something you already do.'
			},
			{ kind: 'heading', text: 'The last two' },
			{
				kind: 'prose',
				text: 'Eventually every edge but two is paired, and there is nowhere left to store anything — any slice you turn breaks a pair you already made. The usual fix is a short sequence that joins the last two while putting back what it disturbs.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Not in the library yet',
				text: 'This site has no last-two-edges algorithms, and rather than print ones it cannot check, it says so. The verifier here works by measuring exactly which pieces an algorithm moves, and a search of roughly eighty thousand candidate sequences turned up nothing short enough that moved wings alone. Until there is one that can be stated exactly, there is nothing here to copy.'
			},
			{
				kind: 'prose',
				text: 'In the meantime the honest workaround is the slow one, and it does work: break one paired edge deliberately, use it as the storage slot you no longer have, and pair the last two the ordinary way. It costs a few seconds and needs nothing memorised.'
			}
		]
	},
	{
		slug: 'revenge-parity',
		title: 'Parity, and finishing as a 3×3',
		summary: 'The two positions a 3×3 cannot reach, and why they are not your fault.',
		track: 'revenge',
		order: 4,
		minutes: 8,
		prerequisites: ['revenge-pairing'],
		teaches: ['revenge-parity'],
		outcomes: [
			'Finish a reduced 4×4 with ordinary 3×3 technique',
			'Recognise parity when it appears',
			'Fix it without undoing your reduction'
		],
		body: [
			{
				kind: 'prose',
				text: 'Centres built, wings paired: from here it is a 3×3. Turn the outer layers only, treat each pair of wings as one edge and each block of centres as one centre, and solve it the way you always do — cross, first two layers, last layer.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'The solve page will do this reading for you. Once your puzzle is reduced it shows the 3×3 you have made and gives you the ordinary 3×3 advice on it, at whichever level you have set.'
			},
			{ kind: 'heading', text: 'Then something impossible happens' },
			{
				kind: 'prose',
				text: 'Sooner or later you will reach a last layer that cannot exist. Two edges want to swap and nothing else is wrong; or one edge sits flipped on its own. Neither is a position a real 3×3 can hold, and no amount of 3×3 technique will get you out of it, because as a 3×3 it is not a legal cube.'
			},
			{
				kind: 'prose',
				text: 'This is **parity**, and it is not a mistake you made. A 4×4 has two of every wing, and when you paired them you had a choice about which went where that you could not see and did not make consciously. About half the time it comes out the other way.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'How this site detects it',
				text: 'Not by pattern-matching. It reduces your puzzle to the 3×3 it has become and asks the ordinary 3×3 validator whether that cube could be assembled at all. If the answer is no, that is parity — by definition rather than by recognition.'
			},
			{ kind: 'heading', text: 'The fix' },
			{ kind: 'case', id: 'revenge-parity-swap' },
			{
				kind: 'prose',
				text: 'Seven moves, and only three distinct ones. The important property is that it leaves your reduction intact — centres still solid, wings still paired — so you can use it in the middle of a solve rather than starting again.'
			},
			{
				kind: 'note',
				tone: 'warning',
				text: 'Read the notation carefully. `2R` is the slice one layer in, turned on its own. It is not `Rw`. Substituting one for the other turns this from a parity fix into a scramble, and it is the single most common way to ruin a solve at this stage.'
			},
			{
				kind: 'prose',
				text: 'Once parity is fixed, carry on with the 3×3 solve exactly where you left off. Expect it about half the time, build it into your expectations rather than treating it as bad luck, and the 4×4 stops feeling like a different puzzle.'
			}
		]
	}
];
