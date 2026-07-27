/**
 * The beginner track.
 *
 * Written for someone holding a scrambled cube for the first time. Two rules
 * govern the tone: never assume a word has been met before, and always say what
 * a step is *for* before saying what to do. The algorithms are the standard
 * layer-by-layer set, chosen because every one of them reappears later — nothing
 * learnt here has to be unlearnt.
 */

import type { Lesson } from '../types';

export const BEGINNER_LESSONS: readonly Lesson[] = [
	{
		slug: 'what-you-are-holding',
		title: 'What you are actually holding',
		summary:
			'Why a cube has only twenty moving pieces, why the centres never move, and what that means for solving it.',
		track: 'beginner',
		order: 1,
		minutes: 8,
		outcomes: [
			'Tell corners, edges and centres apart, and say how many of each there are',
			'Explain why the centres decide what colour each face ends up',
			'Read the notation used everywhere else on this site'
		],
		body: [
			{
				kind: 'prose',
				text: 'A cube looks like twenty-six little cubes glued into a big one. It is not. Take one apart and you find a six-armed spindle in the middle, with the pieces clipped onto it. That single fact explains almost everything about how solving works.'
			},
			{ kind: 'heading', text: 'Three kinds of piece' },
			{
				kind: 'prose',
				text: 'Look at any face. The **centre** has one sticker, the four **edges** have two each, and the four **corners** have three each. There are six centres, twelve edges and eight corners: twenty moving pieces in total, not twenty-six.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'The centres never move',
				text: 'The centres are attached to the spindle. Turn a face and the centre spins in place, but it never travels to another face. So the white centre *is* the white face — permanently. When you are solving, you are moving edges and corners to match centres that were already right.'
			},
			{
				kind: 'prose',
				text: 'This is why "the white side" is never ambiguous, and it is why a piece can only ever go to one place. The green-white edge belongs between the green centre and the white centre. There is exactly one such gap on the whole cube.'
			},
			{
				kind: 'cube',
				setup: "R U R' U' F' L2 D",
				caption:
					'Turn this one around and find the white centre. Now find the piece with white and green on it — there is only one — and see where it will have to end up.',
				label: 'A scrambled cube to explore'
			},
			{ kind: 'heading', text: 'A piece keeps its colours' },
			{
				kind: 'prose',
				text: 'A corner with white, green and red on it will always have white, green and red on it. You cannot make a piece into a different piece; you can only move it and turn it. That means solving is a sorting problem, not a painting problem — and it means that if you ever see a corner with two whites, someone has taken your cube apart and put it back together wrong.'
			},
			{ kind: 'heading', text: 'How turns are written' },
			{
				kind: 'prose',
				text: 'Every instruction on this site is written in the standard notation. It takes about two minutes to learn and it is worth doing now, properly, because every algorithm you meet from here on assumes it.'
			},
			{
				kind: 'list',
				items: [
					'`U` — turn the **up** face a quarter turn clockwise, looking down at it',
					'`D` — the **down** face, clockwise as seen from below',
					'`R`, `L` — the **right** and **left** faces, clockwise as seen from that side',
					'`F`, `B` — the **front** and **back** faces, clockwise as seen from that side',
					"A `'` after the letter means anticlockwise instead: `R'` undoes `R`",
					'A `2` means half a turn: `R2` is the same either way round'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'The direction is always judged *from outside the face being turned*. A `L` turn looks anticlockwise when you are facing the front of the cube — because you are looking at the back of the left face. This trips up nearly everyone at first.'
			},
			{
				kind: 'cube',
				caption:
					'Try it on a solved cube. Press R, then U, then R again with the prime, then U with the prime — that four-move sequence has a name, and you will meet it more than any other.',
				label: 'A solved cube to practise notation on'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why any sequence eventually comes back',
				text: "Repeat any sequence of turns enough times and the cube returns to where it started. `R U R' U'` takes six repetitions. `R U` takes a hundred and five. There is nothing mystical about it: there are finitely many states, so repeating a fixed sequence must eventually loop — and since every turn can be undone, the loop has to pass back through the start."
			},
			{ kind: 'heading', text: 'The plan' },
			{
				kind: 'prose',
				text: 'You will solve the cube in layers, bottom to top. First a cross on the bottom, then the bottom corners, then the middle layer, then the top. Each step leaves the previous ones intact — that is the whole trick, and it is why the algorithms look as convoluted as they do.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Yellow on top',
				text: 'This site puts the **white cross on the bottom** and finishes with yellow on top. Some guides do it the other way up. It makes no difference to the method, but it does mean you should keep white down throughout rather than flipping the cube over between steps.'
			},
			{
				kind: 'jump',
				href: '/notation/',
				label: 'The full notation reference',
				blurb: 'Wide turns, slice turns and cube rotations, for when you meet them later.'
			}
		]
	},

	{
		slug: 'the-white-cross',
		title: 'The white cross',
		summary: 'The first step, and the only one you should work out yourself rather than memorise.',
		track: 'beginner',
		order: 2,
		minutes: 12,
		prerequisites: ['what-you-are-holding'],
		teaches: ['beginner-f2l'],
		outcomes: [
			'Build a white cross on the bottom with the side colours matching',
			'Recognise why a cross that "looks right" can still be wrong',
			'Place an edge that is already in the bottom layer but the wrong way round'
		],
		body: [
			{
				kind: 'prose',
				text: 'The goal is four white edges around the white centre, on the bottom — and each one matching the centre next to it. That last part is what people get wrong.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'A white cross is not enough',
				text: 'You can make a white cross on the bottom in about four moves if you ignore the side colours. It will be useless. The white-green edge must sit under the green centre, the white-red edge under the red centre, and so on — otherwise the corners you place next have nowhere correct to go.'
			},
			{ kind: 'heading', text: 'The daisy' },
			{
				kind: 'prose',
				text: 'The easiest route for a first solve is to build the cross upside down and then drop it into place. Hold the cube with **yellow on top**. Find the four white edges and bring each one to the top face, around the yellow centre. That gives you a white "daisy" with a yellow middle.'
			},
			{
				kind: 'prose',
				text: 'Getting an edge up there needs no algorithm — turn the face it is on until the edge is somewhere you can lift it, then lift it. The only rule is not to knock a white edge back out of the daisy while fetching the next one. If you do, turn the top face to move the finished ones out of the way first.'
			},
			{
				kind: 'steps',
				steps: [
					{ text: 'Hold the cube with yellow on top and white on the bottom.' },
					{
						text: 'Find a white edge. If it is in the bottom layer, turn that side face twice to bring it straight up to the top.',
						alg: 'F2'
					},
					{
						text: 'If it is in the middle layer, turn the face it sits on so it lands in the top layer, taking care not to disturb daisy petals you already have.',
						alg: "R U R'"
					},
					{ text: 'Repeat until all four white edges are around the yellow centre.' }
				]
			},
			{ kind: 'heading', text: 'Dropping the petals into place' },
			{
				kind: 'prose',
				text: 'Now each petal gets turned down into the cross. Take one white edge in the top layer and look at its **other** colour — the one that is not white. Turn the top face until that colour sits directly above the matching centre. Then turn that whole face **twice**, and the edge drops to the bottom, correctly placed.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Pick a white edge in the top layer. Say its other colour is green.',
						alg: ''
					},
					{
						text: 'Turn the top until that edge sits directly above the green centre — the green sticker will be facing you on the front face.',
						alg: 'U'
					},
					{
						text: 'Turn the front face half a turn. The edge swings down into the cross, green matching green.',
						alg: 'F2'
					},
					{ text: 'Repeat for the other three. Each one is the same idea on a different face.' }
				]
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why two turns rather than one',
				text: 'One turn would put the edge in the bottom layer but lying on its side, white facing outwards. The second turn carries it round to the bottom face. Half turns are also the only turns that leave the top layer positioned as it was, which is why you can do all four without ever disturbing the ones already placed.'
			},
			{ kind: 'heading', text: 'When an edge is already at the bottom' },
			{
				kind: 'prose',
				text: 'Sometimes a white edge is already in the bottom layer, but under the wrong centre, or with white facing sideways instead of down. Do not try to fix it in place. Turn that face twice to send it up to the top, and treat it like any other petal.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'This is the general shape of nearly every fix on a cube: rather than nudging a piece that is nearly right, take it back out to somewhere you can act on it freely, and put it in properly. It feels wasteful. It is much faster than the alternative.'
			},
			{ kind: 'heading', text: 'Checking your work' },
			{
				kind: 'prose',
				text: 'Turn the cube over and look at the bottom: a white cross. Now look at the four sides. Each cross edge should form a matching vertical pair with its centre — a green sticker under the green centre, and so on all the way round. Cubers call this the "T" check, because each side should show a T shape of colour.'
			},
			{
				kind: 'jump',
				href: '/solve/',
				label: 'Check your cross with the solver',
				blurb:
					'Paint in the cube you are holding and it will tell you whether the cross is genuinely finished, and what to do next if not.'
			}
		]
	},

	{
		slug: 'the-first-layer',
		title: 'The first layer',
		summary: 'Four corners, one repeated algorithm, and the first thing that feels like magic.',
		track: 'beginner',
		order: 3,
		minutes: 10,
		prerequisites: ['the-white-cross'],
		teaches: ['beginner-f2l'],
		outcomes: [
			'Place all four white corners to finish the bottom layer',
			'Use the same short sequence repeatedly rather than memorising several',
			'Get a corner out when it is stuck in the wrong slot'
		],
		body: [
			{
				kind: 'prose',
				text: 'The cross is done. Now the four white corners, which will finish the entire bottom layer. There is only one sequence to learn here, and you will use it over and over — including, in a slightly different guise, for the rest of your cubing life.'
			},
			{ kind: 'heading', text: 'Find the corner, then the slot' },
			{
				kind: 'prose',
				text: 'Pick a white corner — one with white on it somewhere. Read its other two colours: say green and red. It belongs in the gap between the green centre and the red centre, on the bottom. That gap is its **slot**.'
			},
			{
				kind: 'prose',
				text: 'Hold the cube so that slot is at the **front-right, on the bottom**. Then turn the top face until the corner sits directly above the slot. Now the corner and its destination are lined up in the same column, and there are only three possibilities for how it is turned.'
			},
			{ kind: 'heading', text: 'The sequence' },
			{
				kind: 'alg',
				moves: "R U R' U'",
				caption:
					'Four moves. Right up, top clockwise, right down, top anticlockwise. Cubers call it the "sexy move", which tells you something about how often it comes up.'
			},
			{
				kind: 'prose',
				text: 'With the corner in the top layer directly above its slot, do that sequence and look. If the corner is not in, do it again. Keep going. Within at most six repetitions the corner will drop into place with white on the bottom, every time.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why repeating it works',
				text: 'The sequence takes the corner out of the slot, turns it, and puts it back. Each repetition rotates the corner by a third. So one of the three rotations must be the correct one, and repeating simply cycles through them until you hit it. That is also why it takes at most six goes: three orientations, and it takes two repetitions to advance one.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'You do not have to repeat blindly. If the corner has white facing **right**, one repetition does it. If white faces **front**, it takes five — so it is quicker to turn the top face twice, move to a different slot, and come back. But repeating always works, and it is fine to start there.'
			},
			{ kind: 'heading', text: 'When the corner is already in the bottom layer' },
			{
				kind: 'prose',
				text: 'If a white corner is stuck in a bottom slot but wrong — in the wrong slot, or in the right slot but twisted — hold that slot at the front-right and do the sequence once. That pops the corner up into the top layer, where you can deal with it normally.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Hold the offending slot at the front-right, on the bottom.',
						alg: ''
					},
					{ text: 'Run the sequence once to lift the corner out.', alg: "R U R' U'" },
					{
						text: 'Turn the top face to line the corner up above the slot it actually belongs in, then repeat as normal.'
					}
				]
			},
			{ kind: 'heading', text: 'What finished looks like' },
			{
				kind: 'prose',
				text: 'The whole bottom face is white, and each of the four sides shows a solid band of its own colour across the bottom row. Not a T any more — a complete row of three. If a side shows two of one colour and one of another, a corner is in the wrong slot; lift it out and place it properly.'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'This is the point where most people first believe they will manage it. The bottom layer is a third of the cube and it took you one four-move sequence. The remaining two-thirds take six more.'
			},
			{
				kind: 'jump',
				href: '/algorithms/beginner-f2l/',
				label: 'The beginner first-two-layers algorithms',
				blurb: 'Every sequence from this step and the next, with a cube that will run them for you.'
			}
		]
	},

	{
		slug: 'the-middle-layer',
		title: 'The middle layer',
		summary:
			'Two algorithms that are really one algorithm, and the first step where you have to choose between them.',
		track: 'beginner',
		order: 4,
		minutes: 14,
		prerequisites: ['the-first-layer'],
		teaches: ['beginner-f2l'],
		outcomes: [
			'Insert a middle-layer edge to the right or to the left, whichever it needs',
			'Work out which of the two algorithms a piece wants before you start turning',
			'Free an edge that is sitting in a middle slot the wrong way round'
		],
		body: [
			{
				kind: 'prose',
				text: 'The bottom layer is finished and it stays finished. White stays down for this step and every step after it — if you find yourself turning the cube over to get a better look, turn it back.'
			},
			{
				kind: 'prose',
				text: 'What is left in the middle is four edges: the pieces that sit between two side centres, with no top or bottom colour on them. None of them has yellow. That gives you a way of spotting the ones you need without any thought at all — **the pieces you want are the edges in the top layer with no yellow on them**.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Anything with yellow on it is a last-layer piece and none of your business yet. You will place every one of them in the four lessons after this. For now they are furniture.'
			},
			{ kind: 'heading', text: 'Matching a piece to its slot' },
			{
				kind: 'prose',
				text: 'Pick a top-layer edge with no yellow. It has two colours — say green and red — and there is exactly one gap in the middle layer with green on one side of it and red on the other. Your job is to work out which way round it goes in.'
			},
			{
				kind: 'prose',
				text: "Turn the **top face** until the edge's outward-facing colour sits directly above the centre of the same colour. The face in front of you now shows a vertical bar of one colour: the edge at the top, the centre below it. Keep the cube still from here on."
			},
			{
				kind: 'prose',
				text: 'Now look at the same piece from above. Its other colour is facing the ceiling, and that colour is the instruction. If it matches the centre on your **right**, the edge belongs in the right-hand slot. If it matches the centre on your **left**, it belongs in the left-hand slot.'
			},
			{
				kind: 'cube',
				setup: "F' U' F U R U R' U'",
				caption:
					'The front-facing colour of the top edge already matches the centre beneath it, and the colour on its top face matches the centre on the right. This one goes right.',
				label: 'An edge lined up for a right-hand insert'
			},
			{ kind: 'heading', text: 'The two algorithms' },
			{
				kind: 'alg',
				moves: "U R U' R' U' F' U F",
				caption: 'The right-hand insert. Eight moves, and the edge drops into the front-right slot.'
			},
			{
				kind: 'alg',
				moves: "U' L' U L U F U' F'",
				caption:
					'The left-hand insert, for when the top colour matches the centre on your left. Same cube position, mirror image.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Two algorithms, one shape',
				text: "These are not two things to learn. The second is the first reflected in a mirror: every `R` becomes an `L`, every `F` stays an `F`, and every turn goes the other way. Look at the halves too. `U R U' R'` is the corner sequence from the last lesson run backwards, and `U' F' U F` is that same four-move shape moved one face round — up and front instead of up and right — turning the opposite way."
			},
			{
				kind: 'prose',
				text: 'What the algorithm actually does is a swap. It takes the piece sitting in the slot and sends it up into the top layer, and it takes the edge you lined up and puts it in the slot. That is worth holding on to, because it explains the awkward case further down this page.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'Find a top-layer edge with no yellow on it.'
					},
					{
						text: "Turn the top face until that edge's front colour lines up with the centre below it.",
						alg: 'U'
					},
					{
						text: 'Turn the whole cube, if you need to, so that edge is on the face nearest you. Do not turn the top again after this.',
						alg: 'y'
					},
					{
						text: 'If the colour on top of the edge matches the right-hand centre, run the right-hand insert.',
						alg: "U R U' R' U' F' U F"
					},
					{
						text: 'If it matches the left-hand centre, run the left-hand insert instead.',
						alg: "U' L' U L U F U' F'"
					},
					{ text: 'Repeat until all four middle edges are in.' }
				]
			},
			{
				kind: 'cube',
				setup: "F U F' U' L' U' L U",
				caption:
					'The same idea the other way round. The front colour matches again, but the colour on top belongs to the centre on the left.',
				label: 'An edge lined up for a left-hand insert'
			},
			{ kind: 'heading', text: 'When an edge is stuck in the middle layer' },
			{
				kind: 'prose',
				text: 'Sooner or later you will look at the top layer and find nothing usable — every edge up there has yellow on it. That means the middle edges are already down in the middle layer, but in the wrong slots, or in the right slot with the two colours the wrong way round.'
			},
			{
				kind: 'prose',
				text: 'Do not try to correct it in place. Use the swap. Hold the offending slot at the **front-right** and run the right-hand insert once, with whatever is in the top layer. The stuck edge is pushed up into the top layer, some yellow edge takes its place, and you are back to a position you know how to read.'
			},
			{
				kind: 'steps',
				steps: [
					{ text: 'Turn the whole cube so the bad slot is at the front-right.', alg: 'y' },
					{
						text: 'Run the right-hand insert once. Ignore what goes in — you only want the piece out.',
						alg: "U R U' R' U' F' U F"
					},
					{
						text: 'The edge is now in the top layer. Line it up and insert it properly.'
					}
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				text: 'An edge in the right slot but flipped looks nearly finished, and it is tempting to poke at it. It cannot be fixed by poking. It has to come out and go back in, and that costs you eight moves twice rather than eight moves once.'
			},
			{ kind: 'heading', text: 'What finished looks like' },
			{
				kind: 'prose',
				text: 'Turn the cube over and the bottom is still solid white. Turn it back and each of the four sides shows two complete rows of its own colour, with only the top row left in a mess. Two-thirds of the cube is done, and everything from here happens in that top layer.'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'Cubers call these two layers **F2L**, for "first two layers", and it is the part of the solve where the biggest savings hide. The intermediate track does not add algorithms to the two you have learnt here — it throws both steps away and replaces them with a single one that carries the corner and the edge into the slot together.'
			},
			{
				kind: 'jump',
				href: '/algorithms/beginner-f2l/',
				label: 'Both inserts, side by side',
				blurb:
					'The right and left algorithms with a cube that will run them, so you can watch the swap happen.'
			}
		]
	},

	{
		slug: 'the-yellow-cross',
		title: 'The yellow cross',
		summary:
			'One algorithm, three shapes, and the first time you are told to ignore most of what you can see.',
		track: 'beginner',
		order: 5,
		minutes: 10,
		prerequisites: ['the-middle-layer'],
		teaches: ['beginner-ll'],
		outcomes: [
			'Turn a dot, an L or a line into a yellow cross',
			'Hold the cube the right way round for each of the three shapes',
			'Leave the corners alone until the cross is finished'
		],
		body: [
			{
				kind: 'prose',
				text: 'The last layer is four corners and four edges, and it takes four steps: get yellow on top of the edges, get yellow on top of the corners, put the corners in their places, put the edges in theirs. This lesson is the first of those, and it is the shortest.'
			},
			{
				kind: 'prose',
				text: 'The goal is a yellow cross on the top face: the yellow centre plus the four edges around it showing yellow upwards. Nothing else.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Two things you are not doing yet',
				text: 'The corners are not part of this step. They will sit there showing yellow on the sides, looking wrong, and you leave them alone. Nor do the cross edges need their side colours to match the centres yet — that comes two lessons later. All you want is yellow facing up on four edges.'
			},
			{ kind: 'heading', text: 'Three shapes, and only three' },
			{
				kind: 'prose',
				text: 'Look down at the top face and ignore the corners. Whatever the scramble did, the yellow you can see forms one of three patterns — or it is already a cross, in which case this lesson is over before it starts.'
			},
			{
				kind: 'list',
				items: [
					'**The dot** — only the centre. No edge is showing yellow on top.',
					'**The L** — the centre and two edges next to each other, making a right angle.',
					'**The line** — the centre and two edges opposite each other, making a bar straight across.',
					'**The cross** — all four. Nothing to do; move on to the next lesson.'
				]
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why there is no case with one or three',
				text: 'The cube flips edges in pairs and never singly. With the first two layers finished, every edge that is the wrong way up has to be in the top layer, so the count up there is always even: none, two or four, and never one or three. It is also why one algorithm covers all three cases. It flips exactly two edges each time, and two at a time is enough to get from any of them to four.'
			},
			{ kind: 'heading', text: 'The algorithm' },
			{
				kind: 'alg',
				moves: "F R U R' U' F'",
				caption:
					'Six moves, and the same six moves for all three shapes. What changes is how you hold the cube before you start.'
			},
			{
				kind: 'prose',
				text: 'The whole of this step is that sequence applied one to three times, with the cube turned to face the right way in between. Here is how to hold it for each shape.'
			},
			{
				kind: 'steps',
				steps: [
					{
						text: 'If you have a **line**, turn the whole cube until the line runs from your left to your right, across the top. Run the algorithm and you have the cross.',
						alg: "F R U R' U' F'"
					},
					{
						text: 'If you have an **L**, turn the whole cube until the two yellow edges point away from you and to your left, so the elbow of the L sits at the back-left. Run the algorithm twice, without changing your grip: the first go gives you the line already lying the right way, the second gives you the cross.',
						alg: "F R U R' U' F'"
					},
					{
						text: 'If you have a **dot**, hold it any way you like and run the algorithm once. You get an L. Re-hold it as above and run the algorithm twice more.',
						alg: "F R U R' U' F'"
					}
				]
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'Holding it wrong costs you more than a repeat',
				text: 'A line held front-to-back instead of left-to-right does not become a cross — it becomes a dot, and you are further back than you started. The same is true of an L with its elbow in the wrong corner. Check the shape and the grip before every go; the algorithm is the fast part.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'A dot costs three goes, an L costs two, a line costs one. If you find yourself reaching for a fourth, you have almost certainly held something the wrong way round. Stop, look at the shape again, and re-hold before turning anything.'
			},
			{ kind: 'heading', text: 'Try each one' },
			{
				kind: 'cube',
				setup: "F U R U' R' F'",
				caption:
					'A line, already lying left to right. One go finishes the cross. Notice how wrong the corners look, and how little it matters.',
				label: 'The line case'
			},
			{
				kind: 'cube',
				setup: "F U R U' R' U R U' R' F'",
				caption:
					'An L with its two yellow edges pointing back and left, which is the position to hold it in. Two goes from here, one straight after the other.',
				label: 'The L case'
			},
			{
				kind: 'cube',
				setup: "R U2 R2 F R F' U2 R' F R F'",
				caption:
					'A dot: no yellow edge facing up at all. Three goes from here, re-holding between each one.',
				label: 'The dot case'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'Six moves and no name. Almost every other algorithm on this site has a label attached — sune, the T permutation, the sexy move — but this one is known to most people as "the yellow cross algorithm" and nothing more. It survives into the faster methods all the same: it is the opening of several of the full orientation cases, and you will recognise it inside them.'
			},
			{
				kind: 'jump',
				href: '/algorithms/beginner-ll/',
				label: 'The beginner last-layer algorithms',
				blurb:
					'This one and the three that follow it, with diagrams generated from the moves themselves.'
			}
		]
	},

	{
		slug: 'the-yellow-face',
		title: 'The yellow face',
		summary:
			'One algorithm repeated, and the step where you have to trust a cube that looks wrecked.',
		track: 'beginner',
		order: 6,
		minutes: 12,
		prerequisites: ['the-yellow-cross'],
		teaches: ['beginner-ll'],
		outcomes: [
			'Get all four yellow corners facing upwards using a single algorithm',
			'Hold the cube correctly between repetitions instead of guessing',
			'Keep going when the cube looks worse than when you started'
		],
		body: [
			{
				kind: 'prose',
				text: 'You have a yellow cross. The four corners around it are still showing yellow on their sides, and this step turns them all face up, so the whole top of the cube is yellow.'
			},
			{
				kind: 'prose',
				text: 'It takes one algorithm, done between one and three times. It is also the step that frightens people, so let us deal with that first.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The cube will look destroyed',
				text: 'Part-way through the seven moves the top of your cube looks far worse than when you started: the cross broken open, yellow scattered down the sides, corners flung about. Nothing has gone wrong. Watch the **bottom two layers** while it happens — they never change, not once, because the algorithm cannot reach them. And at the end of every repetition the yellow cross is back; the only thing that has altered is which way the corners face.'
			},
			{ kind: 'heading', text: 'The algorithm' },
			{
				kind: 'alg',
				moves: "R U R' U R U2 R'",
				caption:
					'Seven moves, all on two faces. It twists three corners, leaves the fourth alone, and shuffles the top edges around without turning any of them over.'
			},
			{
				kind: 'note',
				tone: 'history',
				title: 'Sune',
				text: 'This one has a name. Lars Petrus, the Swedish solver whose method carries his name, called it **Sune** — an ordinary Swedish first name — and the label stuck so firmly that its variations are all named after it: anti-sune, double sune, fat sune. You will meet it again in the advanced track as one of the fifty-seven orientation cases, unchanged.'
			},
			{ kind: 'heading', text: 'How to hold it' },
			{
				kind: 'prose',
				text: 'Everything depends on holding the cube right before each go. Count how many corners already have yellow on top — it will be none, one, or two, never three — and follow the matching rule.'
			},
			{
				kind: 'list',
				items: [
					'**Exactly one corner has yellow on top.** Turn the top face until that corner sits at the **front-left**, then run the algorithm.',
					'**None, or two, have yellow on top.** Turn the top face until the corner at the **front-left** has its yellow sticker on the **left-hand face**, then run the algorithm.'
				]
			},
			{
				kind: 'prose',
				text: 'Then look again, count again, and re-hold. Three goes is the worst the cube can throw at you and most positions take two.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why counting never gives you three',
				text: 'Twists have to balance across the layer. Count a corner twisted clockwise as one and one twisted anticlockwise as two, and the total across the four is always a multiple of three. Three corners already facing up contribute nothing at all, so the fourth would have to make up a multiple of three on its own — and a single corner cannot. It must be facing up too, which is why the rule above only has to cover none, one and two.'
			},
			{ kind: 'heading', text: 'Two positions to try' },
			{
				kind: 'cube',
				setup: "R U2 R' U' R U' R'",
				caption:
					'One corner already yellow on top, at the front-left. This is the position the algorithm was built for, and one go finishes it.',
				label: 'The one-go case'
			},
			{
				kind: 'cube',
				setup: "R U R' U R U' R' U R U2 R'",
				caption:
					'No corner facing up. Turn the top until the front-left corner shows yellow on the left-hand face, then run it twice, re-holding in between.',
				label: 'A two-go case'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Say the moves out loud the first few times — right, up, right-prime, up, right, up-two, right-prime. It is one hand and two faces, and once it lives in your fingers you will run it without looking, which leaves your attention free for the re-holding, where the thinking actually is.'
			},
			{ kind: 'heading', text: 'What finished looks like' },
			{
				kind: 'prose',
				text: 'The entire top face is yellow. The sides are still a mess and that is expected — the corners are facing the right way but almost certainly standing in the wrong places, which is the next lesson. Two steps left.'
			},
			{
				kind: 'jump',
				href: '/algorithms/beginner-ll/',
				label: 'Sune, and the rest of the last layer',
				blurb: 'Run it move by move on a cube that starts in the position it was made for.'
			}
		]
	},

	{
		slug: 'placing-the-corners',
		title: 'Placing the corners',
		summary: 'Three corners at a time, and a hunt for the one that is already home.',
		track: 'beginner',
		order: 7,
		minutes: 12,
		prerequisites: ['the-yellow-face'],
		teaches: ['beginner-ll'],
		outcomes: [
			'Move all four yellow corners into their correct places',
			'Find the corner that is already home by turning the top layer and looking',
			'Handle the position where you can never find exactly one'
		],
		body: [
			{
				kind: 'prose',
				text: 'The top is solid yellow, but the corners are probably standing in the wrong places. This step moves them into the right ones without disturbing which way up they are.'
			},
			{
				kind: 'prose',
				text: 'A corner is **home** when its two side colours match the two centres it sits between — a red-and-green corner in the gap between the red face and the green face. It does not matter that the sides look jumbled elsewhere; check that one corner on its own.'
			},
			{ kind: 'heading', text: 'Finding the one that is already right' },
			{
				kind: 'prose',
				text: 'Turn the top face and look after each quarter turn. There is always a position in which at least one corner is home — the cube cannot deny you one. Stop there.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Check corners by their side stickers only, in pairs. Hold the cube so you can see two faces at once and look at the corner between them: two colours, two centres, match or no match. Trying to judge all four corners from above at once is much harder than it sounds.'
			},
			{ kind: 'heading', text: 'The algorithm' },
			{
				kind: 'alg',
				moves: "R' F R' B2 R F' R' B2 R2",
				caption:
					'Nine moves. It leaves the front-left corner exactly where it is and rotates the other three around it.'
			},
			{
				kind: 'prose',
				text: 'Hold the cube with the corner you found at the **front-left**, on the top layer. Running the algorithm sends the other three round **clockwise**, seen from above: front-right goes to back-left, back-left goes to back-right, back-right comes to front-right.'
			},
			{
				kind: 'prose',
				text: 'So look at where your three loose corners need to travel. If that journey is clockwise, one go does it. If it is anticlockwise, run it twice — the second go carries them the rest of the way round.'
			},
			{
				kind: 'steps',
				steps: [
					{ text: 'Turn the top face until at least one corner is home.', alg: 'U' },
					{
						text: 'Turn the whole cube so that corner is at the front-left. Do not turn the top again.',
						alg: 'y'
					},
					{
						text: 'Work out whether the other three need to go clockwise or anticlockwise.'
					},
					{ text: 'Clockwise: run it once.', alg: "R' F R' B2 R F' R' B2 R2" },
					{
						text: 'Anticlockwise: run it twice, without changing your grip in between.',
						alg: "R' F R' B2 R F' R' B2 R2"
					}
				]
			},
			{
				kind: 'cube',
				setup: "R2 B2 R F R' B2 R F' R",
				caption:
					'Only the corners are wrong here — everything else is already solved, so you can see the effect on its own. Find the corner that is home, put it at the front-left, and go.',
				label: 'Three corners out of place'
			},
			{ kind: 'heading', text: 'When you can never find exactly one' },
			{
				kind: 'prose',
				text: 'Occasionally you will turn the top all the way round and never see a single home corner on its own. Instead you find two positions where **two** corners are home, sitting diagonally opposite each other, and two where none is.'
			},
			{
				kind: 'prose',
				text: 'That position cannot be finished by a three-corner rotation, because the two corners that are wrong need to swap rather than travel. The fix is to stop trying to be clever: hold the cube any way round and run the algorithm once. It breaks the diagonal up, one corner lands home, and you carry on exactly as above.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why one corner has to sit still',
				text: 'Any algorithm that rearranges the last-layer corners and puts everything else back exactly as it found it — the two layers below and the last-layer edges alike — has to either cycle three corners or swap two pairs of them. A four-way rotation, or a swap of only two, would need a matching disturbance somewhere else to balance the books. So hunting for the corner that stays still is not a shortcut. It is the only way in.'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'The twenty-one ways a finished last layer can be out of place are named by letter, and this is one of the two **A permutations**. Nothing you have learnt here is a beginner-only trick that later gets discarded: the advanced track keeps this exact sequence and adds nineteen more beside it.'
			},
			{ kind: 'heading', text: 'What finished looks like' },
			{
				kind: 'prose',
				text: 'The top is yellow and all four corners are home: every corner of the cube has its three colours matching the three faces it touches. Only four edges are still adrift, and there is one step left.'
			},
			{
				kind: 'jump',
				href: '/algorithms/beginner-ll/',
				label: 'The last-layer set',
				blurb:
					'This algorithm with a diagram drawn from the moves, alongside the three others in the beginner method.'
			}
		]
	},

	{
		slug: 'the-last-edges',
		title: 'The last edges',
		summary: 'One three-way swap, run once or twice, and the cube finishes in your hands.',
		track: 'beginner',
		order: 8,
		minutes: 10,
		prerequisites: ['placing-the-corners'],
		teaches: ['beginner-ll'],
		outcomes: [
			'Cycle the last three edges into place and complete the cube',
			'Tell which way round the cycle needs to go before you start turning',
			'Deal with the position where no edge is correct'
		],
		body: [
			{
				kind: 'prose',
				text: 'Everything is solved except four edges in the top layer, and often one of those is already right. One algorithm finishes the cube.'
			},
			{
				kind: 'note',
				tone: 'warning',
				title: 'The top layer is no longer free',
				text: 'Up to now you have turned the top face whenever you wanted a better position. Not any more — the corners are home, and turning the top takes them out of their places. From here you re-position by turning the **whole cube**, never the top layer on its own.'
			},
			{ kind: 'heading', text: 'Find the edge that is already right' },
			{
				kind: 'prose',
				text: 'An edge is right when its side colour matches the centre it sits above. Look round all four faces. Usually exactly one edge is already correct; turn the whole cube so that edge is at the **back**, away from you.'
			},
			{ kind: 'heading', text: 'The algorithm' },
			{
				kind: 'alg',
				moves: "R U' R U R U R U' R' U' R2",
				caption:
					'Eleven moves and only two faces. The back edge stays put; the other three change places.'
			},
			{
				kind: 'prose',
				text: 'With the correct edge at the back, this sends **the front edge to the right, the right edge to the left, and the left edge to the front**. Look at where your three loose edges actually need to go. If that is the journey, run it once. If they need to go the other way round, run it twice.'
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'There is a quicker way to read it. With the solved edge at the back, look at the edge nearest you and ask where it belongs. If it belongs on the right, run the algorithm once. If it belongs on the left, run it twice. That is the same rule with less to picture.'
			},
			{
				kind: 'steps',
				steps: [
					{ text: 'Turn the whole cube so the already-correct edge is at the back.', alg: 'y' },
					{
						text: 'Check where the front edge belongs. On the right — one go.',
						alg: "R U' R U R U R U' R' U' R2"
					},
					{
						text: 'On the left — two goes, without changing your grip.',
						alg: "R U' R U R U R U' R' U' R2"
					}
				]
			},
			{
				kind: 'cube',
				setup: "R2 U R U R' U' R' U' R' U R'",
				caption:
					'Three edges to move and one already home. Find the correct one, put it at the back, and read off which way the other three have to travel.',
				label: 'Three edges out of place'
			},
			{ kind: 'heading', text: 'When no edge is correct' },
			{
				kind: 'prose',
				text: 'Sometimes none of the four is right. This happens when the edges need swapping in pairs rather than cycling, and no amount of turning the cube will produce a solved one to hold at the back.'
			},
			{
				kind: 'prose',
				text: 'The answer is the same as it was for the corners. Hold the cube any way round, run the algorithm once, and look again — one edge will now be correct. Put it at the back and finish normally.'
			},
			{
				kind: 'cube',
				setup: 'M2 U M2 U2 M2 U M2',
				caption:
					'Not one edge in the right place. Run the algorithm once from any side, then look again and finish it properly.',
				label: 'No edge correct'
			},
			{ kind: 'heading', text: 'The moment it finishes' },
			{
				kind: 'prose',
				text: 'The last move of the last repetition is `R2`, and the cube comes together underneath your fingers rather than in front of your eyes — you feel the half turn go in and then everything is one colour on every side. It is worth doing slowly the first time.'
			},
			{
				kind: 'note',
				tone: 'history',
				text: 'This one is a **U permutation**, and there are two of them: this and its mirror. Speedsolvers learn both so that neither ever has to be run twice. Picking up the second is a genuinely good use of ten minutes, and it is the smallest useful thing you can add to the method you now have.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Why the cube cannot leave you one edge short',
				text: 'If you ever finish this step with a single edge flipped in place, or two edges swapped and nothing else, the cube has been taken apart and reassembled wrongly — no sequence of turns can produce it. It is not a case you have failed to learn. Pull a corner out, reassemble the cube solved, and start again.'
			},
			{
				kind: 'jump',
				href: '/solve/',
				label: 'Stuck part-way? Describe the cube you are holding',
				blurb:
					'Paint in what you can see and the solver will tell you which step you are on and what to do next.'
			}
		]
	},

	{
		slug: 'your-first-solve',
		title: 'Your first solve',
		summary:
			'What to practise now you can finish a cube, why this method is slow, and what changes next.',
		track: 'beginner',
		order: 9,
		minutes: 8,
		prerequisites: ['the-last-edges'],
		outcomes: [
			'Solve any scrambled cube unaided, from start to finish',
			'Say where the time goes in a beginner solve',
			'Choose what to work on before starting the intermediate track'
		],
		body: [
			{
				kind: 'prose',
				text: 'Seven algorithms, and none of them longer than eleven moves. That is the whole method, and it will solve any cube you are ever handed. The first thing to do with it is nothing clever: solve the cube again, from a fresh scramble, with the lessons closed.'
			},
			{ kind: 'heading', text: 'What to practise' },
			{
				kind: 'prose',
				text: 'The bottleneck now is not the algorithms, it is the pauses between them. Three things are worth practising in this order.'
			},
			{
				kind: 'list',
				ordered: true,
				items: [
					'**Recall without looking things up.** Run each of the seven sequences on a solved cube, over and over, until it comes back to solved: three repetitions for the two last-layer permutations, six for the sexy move, the cross sequence and sune, fifteen for the middle-layer inserts. Arriving back at a solved cube on the right count means you got every repetition right, which makes this a drill that marks itself.',
					'**The cross, worked out rather than remembered.** It is the only step with no algorithm behind it, which makes it the one where thinking rather than memory does the work. Try building it without the daisy, straight onto the bottom.',
					'**Not turning the cube over.** Every time you flip the cube to look at the bottom you lose two or three seconds and your place. Learn to trust that the layers below are safe.'
				]
			},
			{
				kind: 'note',
				tone: 'tip',
				text: 'Time yourself, but only every tenth solve or so. A timer running on every attempt makes you rush the part you are trying to learn. Somewhere between two and three minutes is a normal place to arrive at with this method, and under ninety seconds is a genuinely good beginner time.'
			},
			{ kind: 'heading', text: 'Why this method is slow' },
			{
				kind: 'prose',
				text: 'A beginner solve runs to well over a hundred turns. A competent speedsolver finishes the same scramble in around sixty. The difference is not finger speed; it is that this method does several things twice over.'
			},
			{
				kind: 'list',
				items: [
					'**You turn the cube over.** The daisy is built with yellow up, then flipped to become the cross. Those moves are spent on nothing but getting the pieces the right way up.',
					'**You place pieces one at a time.** The corner goes in, then the middle edge goes in beside it, and the second insertion undoes and redoes part of the first. The pair could have gone in together.',
					'**The last layer takes four passes.** Orient the edges, orient the corners, place the corners, place the edges — with a re-hold and a fresh look between each, and often a repetition inside each.',
					'**You stop to look.** Every step ends with the cube held still while you find the next piece. That still time is usually longer than the turning time.'
				]
			},
			{ kind: 'heading', text: 'What the intermediate track changes' },
			{
				kind: 'prose',
				text: 'It does not add a second method beside this one. It replaces this one, a piece at a time, and every replacement keeps what you already know.'
			},
			{
				kind: 'table',
				headers: ['Step', 'What you do now', 'What you will do'],
				rows: [
					[
						'Cross',
						'Built upside down as a daisy, then dropped in',
						'Built straight onto the bottom, planned before you start turning'
					],
					[
						'First two layers',
						'Corner placed, then the middle edge placed beside it',
						'Corner and edge paired up and inserted together, one slot at a time'
					],
					[
						'Orienting the last layer',
						'Cross, then corners: two algorithms, each repeated up to three times',
						'Two algorithms, each done once, chosen from a set of ten'
					],
					[
						'Placing the last layer',
						'Corners, then edges: two algorithms, each sometimes run more than once',
						'Two algorithms, each done once, chosen from a set of six'
					]
				],
				caption:
					'The two-look last layer costs sixteen algorithms to learn and takes something like twenty turns, and most of the pausing, off the end of every solve.'
			},
			{
				kind: 'note',
				tone: 'insight',
				title: 'Nothing here gets thrown away',
				text: 'The sexy move, sune, the A permutation and the U permutation all appear unchanged in full CFOP, and the two middle-layer inserts turn into the first cases you will meet when you learn to pair pieces. The only thing the later tracks retire is the daisy.'
			},
			{
				kind: 'prose',
				text: 'Take your time over the decision. There is no hurry to leave this method, and plenty of people solve happily for months before changing anything. When you are ready, the [intermediate track](/learn/) opens by working out where the time in your solve is actually going, and then rebuilds the cross.'
			},
			{
				kind: 'jump',
				href: '/learn/',
				label: 'Pick your next track',
				blurb: 'Four tracks, with what each one assumes and what it gives you back.'
			},
			{
				kind: 'jump',
				href: '/solve/',
				label: 'Analyse a cube you are stuck on',
				blurb:
					'Describe the stickers you can see and get advice pitched at the method you are using.'
			}
		]
	}
];
