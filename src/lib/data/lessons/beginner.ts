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
	}
];
